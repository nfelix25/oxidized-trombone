import test from "node:test";
import assert from "node:assert/strict";
import { allCurricula as seedCurriculum } from "../src/curriculum/allCurricula.js";
import { getEligibleNextNodes, narrowTrack } from "../src/curriculum/selectors.js";
import { createAttemptState, recordAttempt, recordHintUsage, recordReviewOutcome } from "../src/runtime/attempts.js";
import { extractAttemptEvidence } from "../src/runtime/reviewIntegration.js";
import { createMasteryState } from "../src/mastery/store.js";
import { createMisconceptionState, recordMisconception } from "../src/mastery/misconceptions.js";
import { recommendNextNodes } from "../src/mastery/recommend.js";
import { assertAccepted, isAccepted, toMachineError, StageRejectedError } from "../src/orchestration/guard.js";
import { validateCurriculumGraph } from "../src/curriculum/model.js";

test("guided flow: eligible nodes shown, blocked nodes with prerequisites", () => {
  // S100 is the true entry point (no prereqs). A200 needs S104 (which needs S100).
  // Eligible = all prerequisites met (includes already-mastered nodes).
  const masteryByNode = { S100: 3, S104: 3, A200: 3 };
  const eligible = getEligibleNextNodes(seedCurriculum, masteryByNode);
  const eligibleIds = eligible.map((n) => n.id);

  // S100 has no prereqs so it remains eligible even when mastered
  assert.ok(eligibleIds.includes("S100"), "S100 should be eligible (no prereqs)");
  assert.ok(eligibleIds.includes("A200"), "A200 should be eligible (S104 satisfied)");
  assert.ok(eligibleIds.includes("A201"), "A201 should be eligible (only needs A200)");
  assert.ok(eligibleIds.includes("A202"), "A202 should be eligible (only needs A200)");
  assert.ok(!eligibleIds.includes("A203"), "A203 should be blocked (needs A202 which is unmastered)");

  // With empty mastery, only nodes with no prerequisites are eligible
  const emptyEligible = getEligibleNextNodes(seedCurriculum, {});
  const emptyIds = emptyEligible.map((n) => n.id);
  assert.ok(emptyIds.includes("S100"), "S100 should be eligible with no mastery (true entry point)");
  assert.ok(!emptyIds.includes("A200"), "A200 should be blocked with no mastery (requires S104)");

  const foundationsNodes = narrowTrack(seedCurriculum, "foundations", masteryByNode);
  const a203Entry = foundationsNodes.find((n) => n.id === "A203");
  assert.ok(a203Entry, "A203 should appear in narrowed track");
  assert.ok(!a203Entry.eligible, "A203 should not be eligible");
  assert.ok(a203Entry.missingPrerequisites.includes("A202"), "A203 should report A202 as missing");
});

test("guided flow: attempt -> evidence -> review produces complete session record", () => {
  let attempt = createAttemptState("ex_a200_d2");

  const simulatedRun = {
    exitCode: 1,
    ok: false,
    stdout: "",
    stderr: "error[E0382]: borrow of moved value: `s`\n  --> src/lib.rs:2:5",
    command: "cargo test -q"
  };

  attempt = recordAttempt(attempt, simulatedRun, 5);
  assert.equal(attempt.attemptIndex, 1);
  assert.equal(attempt.history.length, 1);
  assert.equal(attempt.history[0].exitCode, 1);

  const evidence = extractAttemptEvidence(simulatedRun);
  assert.ok(evidence.compiler.error_codes.includes("E0382"), "should extract E0382 error code");
  assert.ok(evidence.compiler.error_excerpt.includes("borrow of moved value"));

  attempt = recordHintUsage(attempt, 1);
  assert.equal(attempt.hintLevelUsed, 1);

  attempt = recordReviewOutcome(attempt, {
    pass_fail: "FAIL",
    score: 55,
    dominant_tag: "own.move.after_move_use",
    remediation: { action: "retry_same", reason: "ownership not returned" }
  });

  assert.equal(attempt.latestReview.passFail, "FAIL");
  assert.equal(attempt.reviews.length, 1);
  assert.equal(attempt.reviews[0].attemptIndex, 1);
  assert.equal(attempt.reviews[0].dominantTag, "own.move.after_move_use");
});

test("guided flow: mastery + misconception updates after session", () => {
  const masteryState = createMasteryState({ A200: 2 });
  const misconceptionState = createMisconceptionState();

  const updatedMisconception = recordMisconception(misconceptionState, {
    nodeId: "A200",
    tag: "own.move.after_move_use",
    attemptIndex: 1
  });

  const recommendations = recommendNextNodes({
    graph: seedCurriculum,
    masteryState,
    misconceptionState: updatedMisconception,
    riskThreshold: 3
  });

  assert.ok(Array.isArray(recommendations), "recommendations should be array");
  assert.ok(recommendations.length > 0, "should have at least one recommendation");
});

test("stage guard: assertAccepted throws on rejected result", () => {
  const rejected = { accepted: false, reason: "EXECUTION_FAILED", details: "codex not found" };

  assert.throws(
    () => assertAccepted(rejected, "planner"),
    StageRejectedError,
    "should throw StageRejectedError"
  );

  const err = (() => {
    try { assertAccepted(rejected, "planner"); } catch (e) { return e; }
  })();
  assert.equal(err.result.reason, "EXECUTION_FAILED");
});

test("stage guard: toMachineError returns structured error", () => {
  const rejected = {
    accepted: false,
    reason: "SCHEMA_VALIDATION_FAILED",
    schemaName: "hint_pack_v1",
    errors: ["$.hint_level: expected type integer|got string"]
  };

  assert.ok(!isAccepted(rejected));
  const machineErr = toMachineError(rejected);
  assert.equal(machineErr.error, "SCHEMA_VALIDATION_FAILED");
  assert.equal(machineErr.schemaName, "hint_pack_v1");
  assert.ok(Array.isArray(machineErr.errors));
});

test("curriculum validation: expanded graph is internally consistent", () => {
  const { ok, errors } = validateCurriculumGraph(seedCurriculum);
  assert.ok(ok, `Curriculum graph has errors: ${errors.join("; ")}`);
});
