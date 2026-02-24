import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { setupExercise, runAttempt, requestHint, requestReview } from "../src/session/exerciseLoop.js";
import { createNewSession } from "../src/session/session.js";

// ---------------------------------------------------------------------------
// Fixtures (schema-valid fallback payloads for each stage)
// ---------------------------------------------------------------------------

const PLANNER_PAYLOAD = {
  schema_version: "lesson_plan_v1",
  role: "planner",
  plan_id: "lp_test_a200",
  node_id: "A200",
  depth_target: "D2",
  objective: "Understand ownership transfer at function boundaries",
  misconception_focus: ["own.move.after_move_use"],
  lesson_outline: [{ step: 1, title: "Ownership transfer on call" }],
  assessment_plan: { assessment_type: "coding_exercise" },
  next_action: "generate_exercise"
};

const AUTHOR_PAYLOAD = {
  schema_version: "exercise_pack_v1",
  role: "author",
  exercise_id: "ex_test_a200",
  node_id: "A200",
  depth_target: "D2",
  objective: "Write a function that takes ownership and returns it",
  starter_files: [{ path: "src/lib.rs", content: "pub fn id(s: String) -> String { s }\n" }],
  test_files: [{ path: "tests/tests.rs", content: "#[test]\nfn test_id() { assert_eq!(super::id(String::from(\"hi\")), \"hi\"); }\n" }],
  run_instructions: { commands: ["cargo test -q"] },
  hint_policy: { max_hint_level: 3, reveal_allowed_before_threshold: false }
};

const REVIEWER_PAYLOAD_PASS = {
  schema_version: "review_report_v1",
  role: "reviewer",
  report_id: "rr_test_pass",
  exercise_id: "ex_test_a200",
  node_id: "A200",
  depth_target: "D2",
  attempt_index: 1,
  pass_fail: "PASS",
  score: 85,
  dominant_tag: null,
  remediation: { action: "advance_next", reason: "Correct ownership return" }
};

const REVIEWER_PAYLOAD_FAIL = {
  schema_version: "review_report_v1",
  role: "reviewer",
  report_id: "rr_test_fail",
  exercise_id: "ex_test_a200",
  node_id: "A200",
  depth_target: "D2",
  attempt_index: 1,
  pass_fail: "FAIL",
  score: 55,
  dominant_tag: "own.move.after_move_use",
  remediation: { action: "retry_same", reason: "Ownership not returned correctly" }
};

const COACH_PAYLOAD_L1 = {
  schema_version: "hint_pack_v1",
  role: "coach",
  hint_id: "hp_test_l1",
  exercise_id: "ex_test_a200",
  node_id: "A200",
  depth_target: "D2",
  attempt_index: 1,
  hint_level: 1,
  dominant_tag: "own.move.after_move_use",
  allowed_reveal: false,
  current_hint: { style: "nudge", text: "Remember: returning a value transfers ownership back to the caller." },
  full_solution_provided: false
};

const COACH_PAYLOAD_L2 = {
  ...COACH_PAYLOAD_L1,
  hint_id: "hp_test_l2",
  hint_level: 2,
  current_hint: { style: "example", text: "Try: fn take(s: String) -> String { s }" }
};

const COACH_PAYLOAD_L3 = {
  ...COACH_PAYLOAD_L1,
  hint_id: "hp_test_l3",
  hint_level: 3,
  current_hint: { style: "solution", text: "pub fn take_and_return(s: String) -> String { s }" }
};

// ---------------------------------------------------------------------------
// Helper: create a session pre-loaded with exercise state (post-setup)
// ---------------------------------------------------------------------------

function makeSessionWithExercise(overrides = {}) {
  const base = createNewSession("guided", "A200");
  return {
    ...base,
    exerciseId: "ex_test_a200",
    exercisePack: AUTHOR_PAYLOAD,
    workspaceDir: "/tmp/fake_ws",
    attemptState: {
      exerciseId: "ex_test_a200",
      attemptIndex: 0,
      hintLevelUsed: 0,
      elapsedMinutes: 0,
      history: [],
      reviews: []
    },
    lastHintPack: null,
    ...overrides
  };
}

// ---------------------------------------------------------------------------
// Test 5.1 — setupExercise triggers planner + author and persists exercise state
// ---------------------------------------------------------------------------

test("exercise loop: setupExercise runs planner + author and returns session with exercise state", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ox-test-setup-"));

  try {
    const session = createNewSession("guided", "A200");

    const updated = await setupExercise(session, {
      plannerOptions: { fallback: true, fallbackPayload: PLANNER_PAYLOAD },
      authorOptions: { fallback: true, fallbackPayload: AUTHOR_PAYLOAD },
      createWorkspaceFn: async (sessionId, nodeId) => {
        const dir = path.join(tmpDir, `${sessionId.slice(0, 8)}_${nodeId}`);
        await fs.mkdir(dir, { recursive: true });
        // Create required subdirectories so materializeExercise can write files
        await fs.mkdir(path.join(dir, "src"), { recursive: true });
        await fs.mkdir(path.join(dir, "tests"), { recursive: true });
        return { dir, sessionId, nodeId };
      }
    });

    assert.ok(updated !== null, "setupExercise should return updated session");
    assert.equal(updated.exerciseId, "ex_test_a200", "exerciseId should be set");
    assert.ok(updated.exercisePack !== null, "exercisePack should be set");
    assert.ok(updated.workspaceDir !== null, "workspaceDir should be set");
    assert.ok(updated.attemptState !== null, "attemptState should be initialized");
    assert.equal(updated.attemptState.exerciseId, "ex_test_a200");
    assert.equal(updated.attemptState.attemptIndex, 0);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Test 5.1b — setupExercise failure does not return a session
// ---------------------------------------------------------------------------

test("exercise loop: setupExercise stage failure returns null (no session persisted)", async () => {
  const originalExitCode = process.exitCode;
  process.exitCode = 0;

  const session = createNewSession("guided", "A200");

  const updated = await setupExercise(session, {
    plannerOptions: {
      fallback: true
      // no fallbackPayload → EXECUTION_FAILED
    }
  });

  assert.equal(updated, null, "should return null when planner fails");
  assert.equal(process.exitCode, 1, "exitCode should be 1 on stage failure");

  process.exitCode = originalExitCode;
});

// ---------------------------------------------------------------------------
// Test 5.2 — runAttempt updates mastery after a passing run
// ---------------------------------------------------------------------------

test("exercise loop: runAttempt records attempt and updates mastery on PASS", async () => {
  const session = makeSessionWithExercise();

  const passingRun = {
    workspaceDir: "/tmp/fake_ws",
    command: "cargo test -q",
    exitCode: 0,
    ok: true,
    stdout: "test test_id ... ok\ntest result: ok. 1 passed; 0 failed",
    stderr: "",
    ranAt: new Date().toISOString()
  };

  const updated = await runAttempt(session, {
    exerciseRunner: async () => passingRun,
    reviewerOptions: { fallback: true, fallbackPayload: REVIEWER_PAYLOAD_PASS }
  });

  assert.ok(updated !== null, "runAttempt should return updated session");
  assert.equal(updated.attemptState.attemptIndex, 1, "attemptIndex should increment");
  assert.equal(updated.attemptState.latestReview.passFail, "PASS");
  assert.ok(updated.masteryState.byNode["A200"] > 0, "mastery should increase on pass");
});

test("exercise loop: runAttempt preserves attempt record when reviewer stage fails", async () => {
  const originalExitCode = process.exitCode;
  process.exitCode = 0;

  const session = makeSessionWithExercise();

  const failingRun = {
    workspaceDir: "/tmp/fake_ws",
    command: "cargo test -q",
    exitCode: 1,
    ok: false,
    stdout: "",
    stderr: "error[E0382]: borrow of moved value",
    ranAt: new Date().toISOString()
  };

  const updated = await runAttempt(session, {
    exerciseRunner: async () => failingRun,
    reviewerOptions: { fallback: true } // no payload → EXECUTION_FAILED
  });

  // Attempt should be preserved even when reviewer fails
  assert.ok(updated !== null, "should return session with attempt recorded");
  assert.equal(updated.attemptState.attemptIndex, 1, "attempt should be recorded");
  assert.equal(updated.attemptState.history.length, 1);

  process.exitCode = originalExitCode;
});

// ---------------------------------------------------------------------------
// Test 5.3 — requestHint advances hint level and caps at L3
// ---------------------------------------------------------------------------

test("exercise loop: requestHint increments hintLevelUsed L0 → L1 → L2 → L3", async () => {
  let session = makeSessionWithExercise();
  assert.equal(session.attemptState.hintLevelUsed, 0);

  // L1
  let updated = await requestHint(session, {
    coachOptions: { fallback: true, fallbackPayload: COACH_PAYLOAD_L1 }
  });
  assert.ok(updated !== null);
  assert.equal(updated.attemptState.hintLevelUsed, 1, "should advance to L1");
  session = updated;

  // L2
  updated = await requestHint(session, {
    coachOptions: { fallback: true, fallbackPayload: COACH_PAYLOAD_L2 }
  });
  assert.ok(updated !== null);
  assert.equal(updated.attemptState.hintLevelUsed, 2, "should advance to L2");
  session = updated;

  // L3
  updated = await requestHint(session, {
    coachOptions: { fallback: true, fallbackPayload: COACH_PAYLOAD_L3 }
  });
  assert.ok(updated !== null);
  assert.equal(updated.attemptState.hintLevelUsed, 3, "should advance to L3");
  assert.equal(updated.lastHintPack.hint_level, 3, "lastHintPack should be stored");
  session = updated;

  // Already at L3 — should return null (no new stage call)
  const capped = await requestHint(session, {
    coachOptions: { fallback: true, fallbackPayload: COACH_PAYLOAD_L3 }
  });
  assert.equal(capped, null, "should return null when already at L3");
  // hintLevelUsed stays 3 (session unchanged because null returned)
  assert.equal(session.attemptState.hintLevelUsed, 3, "hintLevelUsed unchanged after cap");
});

test("exercise loop: requestHint calls coach at correct hint_level", async () => {
  const session = makeSessionWithExercise({
    attemptState: {
      exerciseId: "ex_test_a200",
      attemptIndex: 1,
      hintLevelUsed: 1,
      elapsedMinutes: 0,
      history: [{
        attemptIndex: 1,
        exitCode: 1,
        ok: false,
        stdout: "",
        stderr: "error[E0382]: borrow of moved value",
        command: "cargo test -q",
        elapsedMinutes: 0,
        at: new Date().toISOString()
      }],
      reviews: []
    },
    lastHintPack: COACH_PAYLOAD_L1
  });

  const updated = await requestHint(session, {
    coachOptions: { fallback: true, fallbackPayload: COACH_PAYLOAD_L2 }
  });

  assert.ok(updated !== null);
  assert.equal(updated.attemptState.hintLevelUsed, 2, "should advance from L1 to L2");
});

// ---------------------------------------------------------------------------
// Test — requestReview shows last stored verdict
// ---------------------------------------------------------------------------

test("exercise loop: requestReview displays latest review without re-running reviewer", () => {
  const session = makeSessionWithExercise({
    attemptState: {
      exerciseId: "ex_test_a200",
      attemptIndex: 1,
      hintLevelUsed: 0,
      elapsedMinutes: 0,
      history: [],
      reviews: [{ attemptIndex: 1, passFail: "FAIL", score: 55, dominantTag: "own.move.after_move_use", at: new Date().toISOString() }],
      latestReview: { passFail: "FAIL", score: 55, dominantTag: "own.move.after_move_use", remediation: { action: "retry_same", reason: "Not done yet" } }
    }
  });

  // requestReview is sync — just verify it doesn't throw
  assert.doesNotThrow(() => requestReview(session));
});
