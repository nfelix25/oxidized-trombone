import { promises as fs } from "node:fs";
import path from "node:path";
import { buildContextPacket } from "../context/packet.js";
import { runScaffoldStage, runStarterExpandStage, runTestExpandStage, runLessonExpandStage, runStage, runCoachStage, runReviewerStage, toMachineReadableError } from "../orchestration/stages.js";
import { createWorkspace } from "../runtime/workspace.js";
import { assembleStarterFiles, assembleTestFiles, assembleLessonFile } from "../runtime/materialize.js";
import { runExercise } from "../runtime/commandRunner.js";
import { createAttemptState, recordAttempt, recordHintUsage, recordReviewOutcome, getLatestRunResult } from "../runtime/attempts.js";
import { extractAttemptEvidence } from "../runtime/reviewIntegration.js";
import { updateMasteryForOutcome } from "../mastery/store.js";
import { getNode } from "../curriculum/model.js";
import { allCurricula } from "../curriculum/allCurricula.js";

function resolveNode(session) {
  if (session.customNode) return session.customNode;
  return getNode(allCurricula, session.nodeId);
}

const MAX_ITERATIONS = {
  D1: { starter: 6, test: 8, lesson: 12 },
  D2: { starter: 8, test: 10, lesson: 15 },
  D3: { starter: 9, test: 12, lesson: 18 }
};

async function createDebugLogger(workspaceDir) {
  const dir = path.join(workspaceDir, ".debug");
  await fs.mkdir(dir, { recursive: true });
  let seq = 0;
  console.log(`  [debug] logging to ${dir}/`);
  return {
    dir,
    async write(label, data) {
      const n = String(seq).padStart(2, "0");
      await fs.writeFile(path.join(dir, `${n}-${label}.json`), JSON.stringify(data, null, 2));
      seq++;
    }
  };
}

function printStageError(stageName, result) {
  const reason = result.reason ?? "UNKNOWN";
  console.error(`Stage failed: ${stageName} — ${reason}`);
  process.stderr.write(JSON.stringify(toMachineReadableError(result)) + "\n");
}

function topMisconceptionTags(misconceptionState, limit = 3) {
  return Object.entries(misconceptionState.counts ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([key]) => key);
}

function buildScaffoldPacket(session, node) {
  return buildContextPacket({
    role: "scaffold",
    taskType: "session_scaffold",
    learnerProfile: { masteryLevel: session.masteryState.byNode[node.id] ?? 0 },
    curriculumContext: {
      node_id: node.id,
      title: node.title,
      track: node.track,
      depth_target: node.depthTarget,
      keywords: node.keywords,
      misconception_tags: node.misconceptionTags
    },
    misconceptionContext: { top_tags: topMisconceptionTags(session.misconceptionState) },
    attemptContext: null,
    evidenceContext: null,
    policyContext: { allow_reveal: false }
  });
}

function buildExpandPacket(loopType, scaffold, priorLoopSections, currentSections, nextFocus, session, node) {
  return buildContextPacket({
    role: loopType + "-expand",
    taskType: loopType + "_expand",
    learnerProfile: { masteryLevel: session.masteryState.byNode[node.id] ?? 0 },
    curriculumContext: {
      node_id: node.id,
      depth_target: node.depthTarget
    },
    scaffoldContext: {
      scaffold_id: scaffold.scaffold_id,
      exercise_description: scaffold.exercise_description,
      lesson_plan: scaffold.lesson_plan,
      starter_plan: scaffold.starter_plan,
      test_plan: scaffold.test_plan
    },
    priorLoopSections,
    currentSections,
    nextFocus: nextFocus ?? null,
    misconceptionContext: { top_tags: topMisconceptionTags(session.misconceptionState) },
    attemptContext: null,
    evidenceContext: null,
    policyContext: { allow_reveal: false }
  });
}

export async function runExpandLoop(loopType, scaffold, priorSections, session, node, options = {}, debugLog = null) {
  const depthTarget = node.depthTarget ?? "D2";
  const max = MAX_ITERATIONS[depthTarget]?.[loopType] ?? MAX_ITERATIONS.D2[loopType];
  const sections = [];
  let nextFocus = null;

  while (sections.length < max) {
    const iteration = sections.length + 1;
    process.stdout.write(`  [${loopType} ${iteration}/${max}] running…`);
    const packet = buildExpandPacket(loopType, scaffold, priorSections, sections, nextFocus, session, node);
    if (debugLog) await debugLog.write(`${loopType}-expand-${iteration}-in`, packet);
    const result = await runStage(loopType + "-expand", packet, options[loopType] ?? {});
    if (debugLog) await debugLog.write(`${loopType}-expand-${iteration}-out`, result);
    if (!result.accepted) {
      process.stdout.write(" FAILED\n");
      printStageError(loopType + "-expand", result);
      return null;
    }
    sections.push(result.payload);
    if (result.payload.is_complete) {
      process.stdout.write(" ✓ complete\n");
      break;
    }
    const focus = result.payload.next_focus ? ` → "${result.payload.next_focus}"` : "";
    process.stdout.write(` ✓${focus}\n`);
    nextFocus = result.payload.next_focus ?? null;
  }

  if (sections.length > 0 && !sections[sections.length - 1].is_complete) {
    console.log(`  [${loopType}] cap reached (${max} sections)`);
  }

  return sections;
}

/**
 * Run scaffold → starter loop → test loop → lesson loop, create workspace, write files.
 * Returns updated session state or null on failure.
 *
 * @param {object} session  Current session state
 * @param {object} options  Optional overrides for testing:
 *   - scaffoldOptions: forwarded to runScaffoldStage
 *   - starterOptions: forwarded to starter-expand loop (keyed as options.starter)
 *   - testOptions: forwarded to test-expand loop (keyed as options.test)
 *   - lessonOptions: forwarded to lesson-expand loop (keyed as options.lesson)
 *   - createWorkspaceFn: replaces createWorkspace
 */
export async function setupExercise(session, options = {}) {
  const node = resolveNode(session);
  const createWs = options.createWorkspaceFn ?? createWorkspace;
  const language = session.language ?? "rust";

  // Build expand loop option maps from flat options, injecting language
  const starterLoopOpts = { starter: { language, ...options.starterOptions ?? {} } };
  const testLoopOpts = { test: { language, ...options.testOptions ?? {} } };
  const lessonLoopOpts = { lesson: { language, ...options.lessonOptions ?? {} } };

  console.log(`Setting up exercise… (node: ${node.id}, depth: ${node.depthTarget ?? "D2"})`);

  // In debug mode, create workspace early so we have a dir for the debug log
  let ws = null;
  let debugLog = null;
  if (options.debug) {
    ws = await createWs(session.sessionId, session.nodeId, language);
    debugLog = await createDebugLogger(ws.dir);
  }

  // Scaffold stage
  process.stdout.write("  [scaffold] running…");
  const scaffoldPacket = buildScaffoldPacket(session, node);
  if (debugLog) await debugLog.write("scaffold-in", scaffoldPacket);
  const scaffoldResult = await runScaffoldStage(scaffoldPacket, { language, ...options.scaffoldOptions ?? {} });
  if (debugLog) await debugLog.write("scaffold-out", scaffoldResult);
  if (!scaffoldResult.accepted) {
    process.stdout.write(" FAILED\n");
    printStageError("scaffold", scaffoldResult);
    process.exitCode = 1;
    return null;
  }
  const scaffold = scaffoldResult.payload;
  console.log(` ✓ ${scaffold.scaffold_id}`);

  // Starter expand loop
  console.log("  [starter loop]");
  const starterSections = await runExpandLoop("starter", scaffold, [], session, node, starterLoopOpts, debugLog);
  if (!starterSections) {
    process.exitCode = 1;
    return null;
  }
  console.log(`  [starter] done (${starterSections.length} sections)`);

  // Test expand loop (receives starter sections as prior context)
  console.log("  [test loop]");
  const testSections = await runExpandLoop("test", scaffold, starterSections, session, node, testLoopOpts, debugLog);
  if (!testSections) {
    process.exitCode = 1;
    return null;
  }
  console.log(`  [test] done (${testSections.length} sections)`);

  // Lesson expand loop (receives starter + test sections as prior context)
  console.log("  [lesson loop]");
  const lessonSections = await runExpandLoop("lesson", scaffold, [...starterSections, ...testSections], session, node, lessonLoopOpts, debugLog);
  if (!lessonSections) {
    process.exitCode = 1;
    return null;
  }
  console.log(`  [lesson] done (${lessonSections.length} sections)`);

  // Create workspace and assemble files (reuse early-created ws if debug mode)
  process.stdout.write("  Writing workspace…");
  if (!ws) ws = await createWs(session.sessionId, session.nodeId, language);
  await assembleStarterFiles(ws.dir, starterSections, language);
  await assembleTestFiles(ws.dir, testSections, language);
  const lessonFile = await assembleLessonFile(ws.dir, lessonSections);
  console.log(" ✓");

  const exerciseId = scaffold.scaffold_id;

  return {
    ...session,
    exerciseId,
    lessonFile,
    workspaceDir: ws.dir,
    attemptState: createAttemptState(exerciseId)
  };
}

/**
 * Run cargo test in the active workspace, then invoke the reviewer stage.
 * Returns updated session state or null on failure to load workspace.
 *
 * @param {object} session  Current session state
 * @param {object} options  Optional overrides for testing:
 *   - reviewerOptions: forwarded to runReviewerStage
 *   - exerciseRunner: replaces runExercise(workspaceDir)
 */
export async function runAttempt(session, options = {}) {
  if (!session.workspaceDir) {
    console.error("No active exercise workspace. Run 'npm run session start' first.");
    process.exitCode = 1;
    return null;
  }

  const node = resolveNode(session);
  const execExercise = options.exerciseRunner ?? runExercise;
  const language = session.language ?? "rust";

  console.log("Running cargo test…");
  const runResult = await execExercise(session.workspaceDir, language);

  const passLabel = runResult.ok ? "PASS" : "FAIL";
  console.log(`\nTest result: ${passLabel} (exit ${runResult.exitCode})`);
  if (runResult.stdout) process.stdout.write(runResult.stdout);
  if (runResult.stderr) process.stdout.write(runResult.stderr);

  // Record attempt
  const updatedAttemptState = recordAttempt(session.attemptState, runResult, 0);
  const sessionWithAttempt = { ...session, attemptState: updatedAttemptState };

  // Reviewer stage
  const reviewerPacket = buildReviewerPacket(sessionWithAttempt, node, runResult);
  const reviewerResult = await runReviewerStage(reviewerPacket, { language, ...options.reviewerOptions ?? {} });

  if (!reviewerResult.accepted) {
    // Preserve attempt record, surface reviewer failure
    console.error(`Stage failed: reviewer — ${reviewerResult.reason ?? "UNKNOWN"}`);
    process.stderr.write(JSON.stringify(toMachineReadableError(reviewerResult)) + "\n");
    return sessionWithAttempt;
  }

  const reviewPayload = reviewerResult.payload;
  console.log(`\nReviewer: ${reviewPayload.pass_fail} (score: ${reviewPayload.score})`);
  if (reviewPayload.remediation?.reason) {
    console.log(`Feedback: ${reviewPayload.remediation.reason}`);
  }

  const finalAttemptState = recordReviewOutcome(updatedAttemptState, reviewPayload);
  const masteryState = updateMasteryForOutcome(session.masteryState, {
    nodeId: node.id,
    depthTarget: node.depthTarget,
    pass: reviewPayload.pass_fail === "PASS",
    score: reviewPayload.score
  });

  return { ...session, attemptState: finalAttemptState, masteryState };
}

/**
 * Invoke the coach stage at the next hint level (capped at 3).
 * Returns updated session state or null on failure.
 *
 * @param {object} session  Current session state
 * @param {object} options  Optional overrides for testing:
 *   - coachOptions: forwarded to runCoachStage
 */
export async function requestHint(session, options = {}) {
  if (!session.exerciseId) {
    console.error("No active exercise. Run 'npm run session start' first.");
    process.exitCode = 1;
    return null;
  }

  const node = resolveNode(session);
  const currentLevel = session.attemptState?.hintLevelUsed ?? 0;

  if (currentLevel >= 3) {
    console.log("Hint (level 3):");
    const storedText = session.lastHintPack?.current_hint?.text;
    console.log(storedText ?? "(L3 hint not available — no previous hint stored.)");
    return null;
  }

  const nextLevel = currentLevel + 1;
  const latestRun = getLatestRunResult(session.attemptState);
  const coachPacket = buildCoachPacket(session, node, nextLevel, latestRun);
  const coachResult = await runCoachStage(coachPacket, options.coachOptions ?? {});

  if (!coachResult.accepted) {
    printStageError("coach", coachResult);
    process.exitCode = 1;
    return null;
  }

  const hintPack = coachResult.payload;
  const hintText = hintPack.current_hint?.text ?? "(no hint text)";
  console.log(`Hint (level ${nextLevel}):`);
  console.log(hintText);

  const updatedAttemptState = recordHintUsage(session.attemptState, nextLevel);
  return { ...session, attemptState: updatedAttemptState, lastHintPack: hintPack };
}

/**
 * Run a single stage in isolation for debugging.
 * stage: "scaffold" | "starter" | "test" | "lesson"
 * For expand stages, runs scaffold first to get a real scaffold, then runs one expand iteration.
 * Prints the result JSON and returns { stage, accepted, payload, error }.
 */
export async function runDebugStage(session, stage, options = {}) {
  const node = resolveNode(session);

  if (stage === "scaffold") {
    console.log(`[debug] scaffold — node: ${node.id} depth: ${node.depthTarget}`);
    const packet = buildScaffoldPacket(session, node);
    console.log("[debug] context packet:", JSON.stringify(packet, null, 2));
    const result = await runScaffoldStage(packet, options.scaffoldOptions ?? {});
    console.log(`\n[debug] result (accepted: ${result.accepted}):`);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }

  if (stage === "starter" || stage === "test" || stage === "lesson") {
    // Need scaffold first
    console.log(`[debug] scaffold (needed for ${stage}-expand context)…`);
    const scaffoldPacket = buildScaffoldPacket(session, node);
    const scaffoldResult = await runScaffoldStage(scaffoldPacket, options.scaffoldOptions ?? {});
    if (!scaffoldResult.accepted) {
      console.error("[debug] scaffold failed — cannot run expand stage");
      console.log(JSON.stringify(scaffoldResult, null, 2));
      return scaffoldResult;
    }
    const scaffold = scaffoldResult.payload;
    console.log(`[debug] scaffold ✓ (${scaffold.scaffold_id})`);

    console.log(`\n[debug] ${stage}-expand — iteration 1`);
    const expandPacket = buildExpandPacket(stage, scaffold, [], [], null, session, node);
    console.log("[debug] context packet:", JSON.stringify(expandPacket, null, 2));
    const expandResult = await runStage(stage + "-expand", expandPacket, options[stage + "Options"] ?? {});
    console.log(`\n[debug] result (accepted: ${expandResult.accepted}):`);
    console.log(JSON.stringify(expandResult, null, 2));
    return expandResult;
  }

  console.error(`[debug] unknown stage: ${stage}. Use: scaffold | starter | test | lesson`);
  return null;
}

/**
 * Display the last stored reviewer verdict without re-running the reviewer stage.
 */
export function requestReview(session) {
  const latestReview = session.attemptState?.latestReview;
  if (!latestReview) {
    console.log("No review available. Run 'npm run session attempt' first.");
    return;
  }
  console.log(`\nLatest review: ${latestReview.passFail} (score: ${latestReview.score})`);
  if (latestReview.remediation?.reason) {
    console.log(`Feedback: ${latestReview.remediation.reason}`);
  }
}

function buildReviewerPacket(session, node, runResult) {
  const evidence = extractAttemptEvidence(runResult);
  const attemptState = session.attemptState;
  return buildContextPacket({
    role: "reviewer",
    taskType: "attempt_review",
    learnerProfile: { masteryLevel: session.masteryState.byNode[node.id] ?? 0 },
    curriculumContext: { node_id: node.id, depth_target: node.depthTarget },
    misconceptionContext: { top_tags: topMisconceptionTags(session.misconceptionState) },
    attemptContext: {
      attempt_index: attemptState.attemptIndex,
      exercise_id: attemptState.exerciseId
    },
    evidenceContext: evidence,
    policyContext: { allow_reveal: false }
  });
}

function buildCoachPacket(session, node, hintLevel, runResult) {
  const evidence = runResult ? extractAttemptEvidence(runResult) : null;
  const attemptState = session.attemptState;
  return buildContextPacket({
    role: "coach",
    taskType: "hint_request",
    learnerProfile: { masteryLevel: session.masteryState.byNode[node.id] ?? 0 },
    curriculumContext: { node_id: node.id, depth_target: node.depthTarget },
    misconceptionContext: { top_tags: topMisconceptionTags(session.misconceptionState) },
    attemptContext: {
      attempt_index: attemptState?.attemptIndex ?? 0,
      exercise_id: session.exerciseId,
      hint_level: hintLevel
    },
    evidenceContext: evidence,
    policyContext: { allow_reveal: false }
  });
}
