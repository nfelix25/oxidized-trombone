import { randomUUID } from "node:crypto";
import { FileStorageAdapter } from "../state/storage.js";
import { createMasteryState } from "../mastery/store.js";
import { createMisconceptionState } from "../mastery/misconceptions.js";
import { selectMode, createPrompt, question } from "./modeSelect.js";
import { runGuidedNav } from "./guidedNav.js";
import { runCustomTopicFlow } from "./customTopic.js";
import { printSessionSummary } from "./summary.js";
import { seedCurriculum } from "../curriculum/seed.js";
import { recommendNextNodes } from "../mastery/recommend.js";
import { setupExercise, runAttempt, requestHint, requestReview } from "./exerciseLoop.js";

const SESSION_KEY = "active_session";
const GLOBAL_MASTERY_KEY = "global_mastery";

function defaultStorage() {
  return new FileStorageAdapter(".state/sessions");
}

function progressStorage() {
  return new FileStorageAdapter(".state/progress");
}

async function loadGlobalMastery() {
  const stored = await progressStorage().read(GLOBAL_MASTERY_KEY, null);
  return stored?.byNode ?? {};
}

async function saveGlobalMastery(sessionMasteryState) {
  const global = await loadGlobalMastery();
  const touchedNodes = new Set(sessionMasteryState.history.map((h) => h.nodeId));
  const merged = {
    ...global,
    ...Object.fromEntries(
      Object.entries(sessionMasteryState.byNode).filter(([id]) => touchedNodes.has(id))
    )
  };
  await progressStorage().write(GLOBAL_MASTERY_KEY, { byNode: merged });
}

export function createNewSession(mode, nodeId, globalMasteryByNode = {}) {
  return {
    sessionId: randomUUID(),
    startedAt: new Date().toISOString(),
    mode,
    nodeId: nodeId ?? null,
    masteryState: createMasteryState(globalMasteryByNode),
    misconceptionState: createMisconceptionState(),
    attempts: [],
    exerciseId: null,
    exercisePack: null,
    workspaceDir: null,
    attemptState: null,
    lastHintPack: null,
    status: "active"
  };
}

export async function loadSession(storage) {
  return storage.read(SESSION_KEY, null);
}

export async function saveSession(storage, session) {
  await storage.write(SESSION_KEY, session);
  return session;
}

export async function startSession(_args = []) {
  const storage = defaultStorage();
  const existing = await loadSession(storage);

  if (existing && existing.status === "active") {
    console.log(`Resuming existing active session: ${existing.sessionId}`);
    console.log(`Mode: ${existing.mode}  Node: ${existing.nodeId ?? "not selected"}`);
    return;
  }

  const rl = createPrompt();
  try {
    const mode = await selectMode(rl);

    let nodeId = null;
    if (mode === "guided") {
      const masteryByNode = {};
      nodeId = await runGuidedNav(rl, seedCurriculum, masteryByNode);
    } else {
      const result = await runCustomTopicFlow(rl, seedCurriculum, {});
      nodeId = result?.nodeId ?? null;
    }

    if (!nodeId) {
      console.log("No node selected. Session not started.");
      return;
    }

    const globalMastery = await loadGlobalMastery();
    const draft = createNewSession(mode, nodeId, globalMastery);
    const session = await setupExercise(draft);
    if (!session) {
      // setupExercise already printed the error and set exitCode
      return;
    }
    await saveSession(storage, session);
    console.log(`\nSession started: ${session.sessionId}`);
    console.log(`Node: ${nodeId}  Mode: ${mode}  Exercise: ${session.exerciseId}`);
    console.log(`Workspace: ${session.workspaceDir}`);
    console.log('Edit the files above, then run "npm run session attempt" to test, or "npm run session show" to re-display the exercise.');
  } finally {
    rl.close();
  }
}

export async function resumeSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session) {
    console.log("No active session found. Use 'npm run session start' to begin.");
    process.exitCode = 1;
    return;
  }

  console.log(`Session: ${session.sessionId}`);
  console.log(`Status: ${session.status}`);
  console.log(`Mode: ${session.mode}`);
  console.log(`Node: ${session.nodeId ?? "none"}`);
  console.log(`Started: ${session.startedAt}`);
  console.log(`Attempts: ${session.attempts.length}`);
}

export async function endSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session) {
    console.log("No active session found.");
    process.exitCode = 1;
    return;
  }

  const graph = seedCurriculum;
  const recommendations = recommendNextNodes({
    graph,
    masteryState: session.masteryState,
    misconceptionState: session.misconceptionState
  });

  const ended = { ...session, status: "ended", endedAt: new Date().toISOString() };
  await saveSession(storage, ended);
  await saveGlobalMastery(ended.masteryState);

  printSessionSummary(ended, recommendations);
}

export async function statusSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session) {
    console.log("No session on record.");
    return;
  }

  const dominantTags = computeDominantTags(session.misconceptionState);
  console.log(JSON.stringify({
    sessionId: session.sessionId,
    status: session.status,
    mode: session.mode,
    nodeId: session.nodeId,
    exerciseId: session.exerciseId ?? null,
    workspaceDir: session.workspaceDir ?? null,
    attempts: session.attemptState?.attemptIndex ?? 0,
    hintLevelUsed: session.attemptState?.hintLevelUsed ?? 0,
    startedAt: session.startedAt,
    endedAt: session.endedAt ?? null,
    dominantTags
  }, null, 2));
}

export async function showSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session) {
    console.log("No session on record.");
    return;
  }

  const pack = session.exercisePack;
  if (!pack) {
    console.log("No exercise loaded. Use 'npm run session start' to begin.");
    return;
  }

  console.log(`\n=== Exercise: ${pack.exercise_id} ===`);
  console.log(`Node: ${session.nodeId}  Depth: ${pack.depth_target}`);
  console.log(`Objective: ${pack.objective}`);
  console.log(`\nWorkspace: ${session.workspaceDir}`);

  const allFiles = [...(pack.starter_files ?? []), ...(pack.test_files ?? [])];
  if (allFiles.length > 0) {
    console.log("\nFiles:");
    for (const f of allFiles) {
      console.log(`  ${f.path}`);
    }
  }

  const attemptCount = session.attemptState?.attemptIndex ?? 0;
  const hintLevel = session.attemptState?.hintLevelUsed ?? 0;
  console.log(`\nAttempts: ${attemptCount}  Hints used: L${hintLevel}`);

  const latest = session.attemptState?.latestReview;
  if (latest) {
    console.log(`Latest review: ${latest.passFail} (score: ${latest.score})`);
  }
}

export async function attemptSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session || session.status !== "active") {
    console.log("No active session. Use 'npm run session start' to begin.");
    process.exitCode = 1;
    return;
  }

  const updated = await runAttempt(session);
  if (updated) {
    await saveSession(storage, updated);
    await saveGlobalMastery(updated.masteryState);
  }
}

export async function hintSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session || session.status !== "active") {
    console.log("No active session. Use 'npm run session start' to begin.");
    process.exitCode = 1;
    return;
  }

  const updated = await requestHint(session);
  if (updated) {
    await saveSession(storage, updated);
  }
}

export async function reviewSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session || session.status !== "active") {
    console.log("No active session. Use 'npm run session start' to begin.");
    process.exitCode = 1;
    return;
  }

  requestReview(session);
}

function computeDominantTags(misconceptionState) {
  if (!misconceptionState?.counts) return [];
  return Object.entries(misconceptionState.counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key, count]) => ({ key, count }));
}
