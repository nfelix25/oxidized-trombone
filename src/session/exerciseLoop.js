import { buildContextPacket } from "../context/packet.js";
import { runPlannerStage, runAuthorStage, runCoachStage, runReviewerStage, toMachineReadableError } from "../orchestration/stages.js";
import { createWorkspace } from "../runtime/workspace.js";
import { materializeExercise } from "../runtime/materialize.js";
import { runExercise } from "../runtime/commandRunner.js";
import { createAttemptState, recordAttempt, recordHintUsage, recordReviewOutcome, getLatestRunResult } from "../runtime/attempts.js";
import { extractAttemptEvidence } from "../runtime/reviewIntegration.js";
import { updateMasteryForOutcome } from "../mastery/store.js";
import { getNode } from "../curriculum/model.js";
import { seedCurriculum } from "../curriculum/seed.js";

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

function buildPlannerPacket(session, node) {
  return buildContextPacket({
    role: "planner",
    taskType: "lesson_setup",
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

function buildAuthorPacket(session, node, lessonPlan) {
  return buildContextPacket({
    role: "author",
    taskType: "exercise_generation",
    learnerProfile: { masteryLevel: session.masteryState.byNode[node.id] ?? 0 },
    curriculumContext: {
      node_id: node.id,
      title: node.title,
      track: node.track,
      depth_target: node.depthTarget,
      keywords: node.keywords,
      misconception_tags: node.misconceptionTags,
      lesson_plan: lessonPlan
    },
    misconceptionContext: { top_tags: topMisconceptionTags(session.misconceptionState) },
    attemptContext: null,
    evidenceContext: null,
    policyContext: { allow_reveal: false }
  });
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

/**
 * Run planner → author stages, create workspace, materialize exercise.
 * Returns updated session state or null on failure.
 *
 * @param {object} session  Current session state
 * @param {object} options  Optional overrides for testing:
 *   - plannerOptions: forwarded to runPlannerStage
 *   - authorOptions: forwarded to runAuthorStage
 *   - createWorkspaceFn: replaces createWorkspace
 */
export async function setupExercise(session, options = {}) {
  const node = getNode(seedCurriculum, session.nodeId);
  const createWs = options.createWorkspaceFn ?? createWorkspace;

  console.log("Setting up exercise…");

  // Planner stage
  const plannerPacket = buildPlannerPacket(session, node);
  const plannerResult = await runPlannerStage(plannerPacket, options.plannerOptions ?? {});
  if (!plannerResult.accepted) {
    printStageError("planner", plannerResult);
    process.exitCode = 1;
    return null;
  }

  // Author stage
  const authorPacket = buildAuthorPacket(session, node, plannerResult.payload);
  const authorResult = await runAuthorStage(authorPacket, options.authorOptions ?? {});
  if (!authorResult.accepted) {
    printStageError("author", authorResult);
    process.exitCode = 1;
    return null;
  }

  const exercisePack = authorResult.payload;
  const exerciseId = exercisePack.exercise_id;

  // Create workspace and materialize files
  const ws = await createWs(session.sessionId, session.nodeId);
  await materializeExercise(ws.dir, exercisePack);

  return {
    ...session,
    exerciseId,
    exercisePack,
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

  const node = getNode(seedCurriculum, session.nodeId);
  const execExercise = options.exerciseRunner ?? runExercise;

  console.log("Running cargo test…");
  const runResult = await execExercise(session.workspaceDir);

  const passLabel = runResult.ok ? "PASS" : "FAIL";
  console.log(`\nTest result: ${passLabel} (exit ${runResult.exitCode})`);
  if (runResult.stdout) process.stdout.write(runResult.stdout);
  if (runResult.stderr) process.stdout.write(runResult.stderr);

  // Record attempt
  const updatedAttemptState = recordAttempt(session.attemptState, runResult, 0);
  const sessionWithAttempt = { ...session, attemptState: updatedAttemptState };

  // Reviewer stage
  const reviewerPacket = buildReviewerPacket(sessionWithAttempt, node, runResult);
  const reviewerResult = await runReviewerStage(reviewerPacket, options.reviewerOptions ?? {});

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
  if (!session.exercisePack) {
    console.error("No active exercise. Run 'npm run session start' first.");
    process.exitCode = 1;
    return null;
  }

  const node = getNode(seedCurriculum, session.nodeId);
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
