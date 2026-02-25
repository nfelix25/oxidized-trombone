import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import { FileStorageAdapter } from "../state/storage.js";
import { createMasteryState } from "../mastery/store.js";
import { createMisconceptionState } from "../mastery/misconceptions.js";
import { selectLanguage, createPrompt } from "./modeSelect.js";
import { runGuidedNav } from "./guidedNav.js";
import { printSessionSummary } from "./summary.js";
import { allCurricula, getCurriculumForLanguage } from "../curriculum/allCurricula.js";
import { getNode } from "../curriculum/model.js";
import { loadCustomTopics } from "./customTopics.js";
import { runSessionPicker } from "./sessionPicker.js";
import { recommendNextNodes } from "../mastery/recommend.js";
import { setupExercise, runAttempt, requestHint, requestReview, runDebugStage } from "./exerciseLoop.js";

const SESSION_INDEX_KEY = "index";
const LEGACY_SESSION_KEY = "active_session";
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

export function createNewSession(mode, nodeId, globalMasteryByNode = {}, language = "rust") {
  return {
    sessionId: randomUUID(),
    startedAt: new Date().toISOString(),
    mode,
    nodeId: nodeId ?? null,
    language,
    masteryState: createMasteryState(globalMasteryByNode),
    misconceptionState: createMisconceptionState(),
    attempts: [],
    exerciseId: null,
    lessonFile: null,
    workspaceDir: null,
    attemptState: null,
    lastHintPack: null,
    status: "active"
  };
}

export async function loadSession(storage) {
  const index = (await storage.read(SESSION_INDEX_KEY, null)) ?? [];

  if (index.length === 0) {
    // Legacy fallback: read old single-file format and migrate to registry
    const legacySession = await storage.read(LEGACY_SESSION_KEY, null);
    if (legacySession) {
      await saveSession(storage, legacySession);
    }
    return legacySession;
  }

  // Sort entries by lastAccessedAt descending; try most recent first
  const sorted = [...index].sort((a, b) => {
    const ta = a.lastAccessedAt ?? a.startedAt ?? "";
    const tb = b.lastAccessedAt ?? b.startedAt ?? "";
    return tb > ta ? 1 : -1;
  });

  let mostRecentSession = null;
  let mostRecentId = null;

  for (const entry of sorted) {
    const session = await storage.read(entry.id, null);
    if (session) {
      mostRecentSession = session;
      mostRecentId = entry.id;
      break;
    }
    // stale entry (file missing) — skip silently
  }

  if (mostRecentSession && mostRecentId) {
    // Update lastAccessedAt for this entry in the index
    const now = new Date().toISOString();
    const updatedIndex = index.map((e) =>
      e.id === mostRecentId ? { ...e, lastAccessedAt: now } : e
    );
    await storage.write(SESSION_INDEX_KEY, updatedIndex);
  }

  return mostRecentSession;
}

export async function saveSession(storage, session) {
  // Write per-session file keyed by sessionId
  await storage.write(session.sessionId, session);

  // Upsert index entry
  const existingIndex = (await storage.read(SESSION_INDEX_KEY, null)) ?? [];
  const now = new Date().toISOString();
  const entry = {
    id: session.sessionId,
    nodeId: session.nodeId,
    language: session.language ?? "rust",
    workspaceDir: session.workspaceDir ?? null,
    startedAt: session.startedAt,
    lastAccessedAt: now
  };

  const idx = existingIndex.findIndex((e) => e.id === session.sessionId);
  const updatedIndex =
    idx >= 0
      ? existingIndex.map((e, i) => (i === idx ? entry : e))
      : [...existingIndex, entry];

  await storage.write(SESSION_INDEX_KEY, updatedIndex);
  return session;
}

export async function loadSessionById(storage, idPrefix) {
  const index = (await storage.read(SESSION_INDEX_KEY, null)) ?? [];
  const matches = index.filter((e) => e.id.startsWith(idPrefix));

  if (matches.length === 0) {
    throw new Error(`No session found with ID starting with '${idPrefix}'`);
  }

  if (matches.length > 1) {
    const ids = matches.map((e) => e.id.slice(0, 8)).join(", ");
    throw new Error(
      `Ambiguous prefix '${idPrefix}' matches multiple sessions: ${ids}. Use a longer prefix.`
    );
  }

  const entry = matches[0];
  const session = await storage.read(entry.id, null);
  if (!session) {
    throw new Error(`Session data not found for ID '${entry.id}'`);
  }

  // Update lastAccessedAt to make this the active session
  const now = new Date().toISOString();
  const updatedIndex = index.map((e) =>
    e.id === entry.id ? { ...e, lastAccessedAt: now } : e
  );
  await storage.write(SESSION_INDEX_KEY, updatedIndex);

  return session;
}

export async function listAllSessions(storage) {
  const index = (await storage.read(SESSION_INDEX_KEY, null)) ?? [];

  const sorted = [...index].sort((a, b) => {
    const ta = a.lastAccessedAt ?? a.startedAt ?? "";
    const tb = b.lastAccessedAt ?? b.startedAt ?? "";
    return tb > ta ? 1 : -1;
  });

  const results = await Promise.all(
    sorted.map(async (entry) => {
      let workspaceExists = true;
      if (entry.workspaceDir) {
        try {
          await fs.access(entry.workspaceDir);
          workspaceExists = true;
        } catch {
          workspaceExists = false;
        }
      }
      return { entry, workspaceExists };
    })
  );

  return results;
}

export async function startSession(args = []) {
  const debugMode = args.includes("--debug");
  const storage = defaultStorage();

  const rl = createPrompt();
  try {
    // Show session picker when sessions exist
    const index = (await storage.read(SESSION_INDEX_KEY, null)) ?? [];
    if (index.length > 0) {
      const chosen = await runSessionPicker(rl, storage);
      if (chosen) {
        // Resumed an existing session — show its info
        if (chosen.exerciseId) {
          console.log(`\nActive session: ${chosen.sessionId}`);
          console.log(`Exercise: ${chosen.exerciseId}`);
          console.log(`Node: ${chosen.nodeId}`);
          console.log(`Language: ${chosen.language}`);
          console.log(`Workspace: ${chosen.workspaceDir}`);
          if (chosen.lessonFile) console.log(`Lesson: ${chosen.lessonFile}`);
          console.log('Run "npm run session attempt" to test, or "npm run session show" to re-display.');
        } else {
          // Session exists but exercise not set up yet — complete setup
          console.log(`Completing setup for session: ${chosen.sessionId} (Node: ${chosen.nodeId})`);
          const completed = await setupExercise(chosen, { debug: debugMode });
          if (!completed) return;
          await saveSession(storage, completed);
          console.log(`\nExercise ready: ${completed.exerciseId}`);
          console.log(`Workspace: ${completed.workspaceDir}`);
          console.log('Run "npm run session attempt" to test, or "npm run session show" to re-display.');
        }
        return;
      }
      // chosen === null → user picked "Start new session", fall through
    }

    const globalMastery = await loadGlobalMastery();

    // Step 1: select language
    const language = await selectLanguage(rl);

    // Step 2: load language-scoped curriculum + custom topics
    const filteredGraph = getCurriculumForLanguage(language);
    const customTopics = await loadCustomTopics(language);

    // Step 3: pick track/node (custom topics shown as a synthetic track entry)
    const selected = await runGuidedNav(rl, filteredGraph, globalMastery, customTopics);

    if (!selected) {
      console.log("No node selected. Session not started.");
      return;
    }

    // selected is either a nodeId string (curriculum) or a custom node object
    const isCustom = typeof selected === "object" && selected._custom;
    const nodeId = isCustom ? selected.id : selected;
    const draft = createNewSession("guided", nodeId, globalMastery, language);
    if (isCustom) draft.customNode = selected;

    const session = await setupExercise(draft, { debug: debugMode });
    if (!session) {
      // setupExercise already printed the error and set exitCode
      return;
    }
    await saveSession(storage, session);
    console.log(`\nSession started: ${session.sessionId}`);
    console.log(`Node: ${nodeId}  Language: ${language}  Exercise: ${session.exerciseId}`);
    console.log(`Workspace: ${session.workspaceDir}`);
    if (session.lessonFile) console.log(`Lesson: ${session.lessonFile}`);
    console.log('Edit the files above, then run "npm run session attempt" to test.');
  } finally {
    rl.close();
  }
}

function printSessionInfo(session) {
  console.log(`Session: ${session.sessionId}`);
  console.log(`Status: ${session.status}`);
  console.log(`Mode: ${session.mode}`);
  console.log(`Node: ${session.nodeId ?? "none"}`);
  console.log(`Language: ${session.language ?? "none"}`);
  console.log(`Started: ${session.startedAt}`);
  if (session.workspaceDir) console.log(`Workspace: ${session.workspaceDir}`);
  if (session.exerciseId) console.log(`Exercise: ${session.exerciseId}`);
  console.log(`Attempts: ${session.attempts.length}`);
}

export async function resumeSession(args = []) {
  const storage = defaultStorage();

  if (args[0]) {
    try {
      const session = await loadSessionById(storage, args[0]);
      printSessionInfo(session);
    } catch (err) {
      console.error(err.message);
      process.exitCode = 1;
    }
    return;
  }

  // No arg: show picker
  const rl = createPrompt();
  try {
    const session = await runSessionPicker(rl, storage);
    if (!session) {
      console.log("No session selected.");
      return;
    }
    printSessionInfo(session);
  } finally {
    rl.close();
  }
}

export async function listSessions() {
  const storage = defaultStorage();
  const sessions = await listAllSessions(storage);

  if (sessions.length === 0) {
    console.log("No sessions found.");
    return;
  }

  console.log(
    "\nID         Node       Language   Last Accessed"
  );
  console.log(
    "---------- ---------- ---------- --------------"
  );
  for (const { entry, workspaceExists } of sessions) {
    const shortId = (entry.id ?? "").slice(0, 8).padEnd(10);
    const node = (entry.nodeId ?? "?").padEnd(10);
    const lang = (entry.language ?? "?").padEnd(10);
    const date = (entry.lastAccessedAt ?? entry.startedAt ?? "?").slice(0, 10);
    const ws = workspaceExists ? "" : "  [workspace missing]";
    console.log(`${shortId} ${node} ${lang} ${date}${ws}`);
  }
}

export async function endSession(_args = []) {
  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session) {
    console.log("No active session found.");
    process.exitCode = 1;
    return;
  }

  const graph = allCurricula;
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

  if (!session.exerciseId) {
    console.log("No exercise loaded. Use 'npm run session start' to begin.");
    return;
  }

  console.log(`\n=== Exercise: ${session.exerciseId} ===`);
  console.log(`Node: ${session.nodeId}`);
  console.log(`\nWorkspace: ${session.workspaceDir}`);
  if (session.lessonFile) console.log(`Lesson: ${session.lessonFile}`);

  const attemptCount = session.attemptState?.attemptIndex ?? 0;
  const hintLevel = session.attemptState?.hintLevelUsed ?? 0;
  console.log(`\nAttempts: ${attemptCount}  Hints used: L${hintLevel}`);

  const latest = session.attemptState?.latestReview;
  if (latest) {
    console.log(`Latest review: ${latest.passFail} (score: ${latest.score})`);
  }
}

export async function debugSession(args = []) {
  const stage = args[0];
  const validStages = ["scaffold", "starter", "test", "lesson"];

  if (!stage || !validStages.includes(stage)) {
    console.error(`Usage: session debug <stage>`);
    console.error(`  Stages: ${validStages.join(" | ")}`);
    console.error(`  scaffold  — run scaffold stage for the current session node, print JSON result`);
    console.error(`  starter   — run scaffold + one starter-expand iteration, print JSON result`);
    console.error(`  test      — run scaffold + one test-expand iteration, print JSON result`);
    console.error(`  lesson    — run scaffold + one lesson-expand iteration, print JSON result`);
    process.exitCode = 1;
    return;
  }

  const storage = defaultStorage();
  const session = await loadSession(storage);

  if (!session) {
    console.error("No active session. Run 'npm run session start' first to select a node.");
    process.exitCode = 1;
    return;
  }

  await runDebugStage(session, stage);
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
