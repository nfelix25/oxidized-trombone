import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { setupExercise, runAttempt, requestHint, requestReview, runExpandLoop } from "../src/session/exerciseLoop.js";
import { createNewSession } from "../src/session/session.js";
import { getNode } from "../src/curriculum/model.js";
import { allCurricula as seedCurriculum } from "../src/curriculum/allCurricula.js";

// ---------------------------------------------------------------------------
// Fixtures (schema-valid fallback payloads for each stage)
// ---------------------------------------------------------------------------

const SCAFFOLD_PAYLOAD = {
  schema_version: "scaffold_v1",
  role: "scaffold",
  scaffold_id: "sc_test_a200",
  node_id: "A200",
  depth_target: "D2",
  lesson_plan: {
    section_intents: ["concept: ownership transfer", "bridge: connect to exercise"]
  },
  starter_plan: {
    file_intents: ["src/lib.rs: stub take_and_return"]
  },
  test_plan: {
    case_intents: ["tests/tests.rs: test take_and_return returns same string"]
  },
  exercise_description: "Implement take_and_return which takes a String by value and returns it."
};

const STARTER_SECTION_PAYLOAD = {
  schema_version: "starter_section_v1",
  role: "starter-expand",
  section_id: "ss_test_s1",
  type: "function_stub",
  file_path: "lib.rs",
  content: "pub fn take_and_return(s: String) -> String {\n    todo!()\n}\n",
  is_complete: false,
  next_focus: "Add implementation body"
};

const STARTER_SECTION_FINAL = {
  schema_version: "starter_section_v1",
  role: "starter-expand",
  section_id: "ss_test_final",
  type: "function_impl",
  file_path: "lib.rs",
  content: "pub fn take_and_return(s: String) -> String {\n    s\n}\n",
  is_complete: true,
  next_focus: ""
};

const TEST_SECTION_FINAL = {
  schema_version: "test_section_v1",
  role: "test-expand",
  section_id: "ts_test_final",
  type: "unit_test",
  file_path: "tests.rs",
  content: "#[test]\nfn test_take_and_return() { assert_eq!(take_and_return(String::from(\"hi\")), \"hi\"); }\n",
  is_complete: true,
  next_focus: ""
};

const LESSON_SECTION_PAYLOAD = {
  schema_version: "lesson_section_v1",
  role: "lesson-expand",
  section_id: "ls_test_s1",
  type: "concept",
  content: "## Ownership Transfer\nIn Rust, every value has a single owner.",
  is_complete: false,
  next_focus: "Add a bridge section"
};

const LESSON_SECTION_FINAL = {
  schema_version: "lesson_section_v1",
  role: "lesson-expand",
  section_id: "ls_test_bridge",
  type: "bridge",
  content: "## Bridge to Exercise\nApply ownership transfer in take_and_return.",
  is_complete: true,
  next_focus: ""
};

const REVIEWER_PAYLOAD_PASS = {
  schema_version: "review_report_v1",
  role: "reviewer",
  report_id: "rr_test_pass",
  exercise_id: "sc_test_a200",
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
  exercise_id: "sc_test_a200",
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
  exercise_id: "sc_test_a200",
  node_id: "A200",
  depth_target: "D2",
  attempt_index: 1,
  hint_level: 1,
  dominant_tag: "own.move.after_move_use",
  allowed_reveal: false,
  current_hint: { style: "nudge", text: "Remember: returning a value transfers ownership back to the caller." },
  full_solution_provided: false,
  revealed_solution: null
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
    exerciseId: "sc_test_a200",
    lessonFile: "/tmp/fake_ws/LESSON.md",
    workspaceDir: "/tmp/fake_ws",
    attemptState: {
      exerciseId: "sc_test_a200",
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
// Test — setupExercise runs scaffold + three loops and returns session with lessonFile
// ---------------------------------------------------------------------------

test("exercise loop: setupExercise runs scaffold + loops and returns session with lessonFile", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ox-test-setup-"));

  try {
    const session = createNewSession("guided", "A200");

    const updated = await setupExercise(session, {
      scaffoldOptions: { fallback: true, fallbackPayload: SCAFFOLD_PAYLOAD },
      starterOptions: { fallback: true, fallbackPayload: STARTER_SECTION_FINAL },
      testOptions: { fallback: true, fallbackPayload: TEST_SECTION_FINAL },
      lessonOptions: { fallback: true, fallbackPayload: LESSON_SECTION_FINAL },
      createWorkspaceFn: async (sessionId, nodeId) => {
        const dir = path.join(tmpDir, `${sessionId.slice(0, 8)}_${nodeId}`);
        await fs.mkdir(dir, { recursive: true });
        await fs.mkdir(path.join(dir, "src"), { recursive: true });
        await fs.mkdir(path.join(dir, "tests"), { recursive: true });
        return { dir, sessionId, nodeId };
      }
    });

    assert.ok(updated !== null, "setupExercise should return updated session");
    assert.equal(updated.exerciseId, "sc_test_a200", "exerciseId derived from scaffold_id");
    assert.ok(updated.lessonFile !== null, "lessonFile should be set");
    assert.ok(updated.lessonFile.endsWith("LESSON.md"), "lessonFile should point to LESSON.md");
    assert.ok(updated.workspaceDir !== null, "workspaceDir should be set");
    assert.ok(updated.attemptState !== null, "attemptState should be initialized");
    assert.equal(updated.attemptState.exerciseId, "sc_test_a200");
    assert.equal(updated.attemptState.attemptIndex, 0);

    // Verify LESSON.md was written
    const lessonContent = await fs.readFile(updated.lessonFile, "utf8");
    assert.ok(lessonContent.includes("Bridge to Exercise"), "LESSON.md should contain lesson section content");
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Test — setupExercise returns null when scaffold stage fails
// ---------------------------------------------------------------------------

test("exercise loop: setupExercise returns null when scaffold stage fails", async () => {
  const originalExitCode = process.exitCode;
  process.exitCode = 0;

  const session = createNewSession("guided", "A200");

  const updated = await setupExercise(session, {
    scaffoldOptions: {
      fallback: true
      // no fallbackPayload → EXECUTION_FAILED
    }
  });

  assert.equal(updated, null, "should return null when scaffold fails");
  assert.equal(process.exitCode, 1, "exitCode should be 1 on scaffold failure");

  process.exitCode = originalExitCode;
});

// ---------------------------------------------------------------------------
// Tests for runExpandLoop
// ---------------------------------------------------------------------------

test("runExpandLoop: terminates when is_complete: true returned on first call", async () => {
  const session = createNewSession("guided", "A200");
  const node = getNode(seedCurriculum, "A200");

  const sections = await runExpandLoop(
    "starter",
    SCAFFOLD_PAYLOAD,
    [],
    session,
    node,
    { starter: { fallback: true, fallbackPayload: STARTER_SECTION_FINAL } }
  );

  assert.ok(sections !== null, "should return sections array");
  assert.equal(sections.length, 1, "should terminate after one call with is_complete: true");
  assert.equal(sections[0].is_complete, true);
});

test("runExpandLoop: respects MAX_ITERATIONS cap when is_complete never true", async () => {
  const session = createNewSession("guided", "A200");
  const node = getNode(seedCurriculum, "A200");
  // A200 has depthTarget D3, starter max = 9

  const sections = await runExpandLoop(
    "starter",
    SCAFFOLD_PAYLOAD,
    [],
    session,
    node,
    { starter: { fallback: true, fallbackPayload: STARTER_SECTION_PAYLOAD } }
  );

  assert.ok(sections !== null, "should return sections array");
  assert.equal(sections.length, 9, "should cap at D3 starter MAX_ITERATIONS (9)");
  // All sections have is_complete: false (loop hit cap, not completion signal)
  assert.ok(sections.every((s) => !s.is_complete));
});

test("runExpandLoop: returns null on expand stage failure", async () => {
  const session = createNewSession("guided", "A200");
  const node = getNode(seedCurriculum, "A200");

  const sections = await runExpandLoop(
    "starter",
    SCAFFOLD_PAYLOAD,
    [],
    session,
    node,
    { starter: { fallback: true } } // no fallbackPayload → EXECUTION_FAILED
  );

  assert.equal(sections, null, "should return null when expand stage fails");
});

// ---------------------------------------------------------------------------
// Test — runAttempt updates mastery after a passing run
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

  assert.ok(updated !== null, "should return session with attempt recorded");
  assert.equal(updated.attemptState.attemptIndex, 1, "attempt should be recorded");
  assert.equal(updated.attemptState.history.length, 1);

  process.exitCode = originalExitCode;
});

// ---------------------------------------------------------------------------
// Test — requestHint advances hint level and caps at L3
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
  assert.equal(session.attemptState.hintLevelUsed, 3, "hintLevelUsed unchanged after cap");
});

test("exercise loop: requestHint calls coach at correct hint_level", async () => {
  const session = makeSessionWithExercise({
    attemptState: {
      exerciseId: "sc_test_a200",
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
      exerciseId: "sc_test_a200",
      attemptIndex: 1,
      hintLevelUsed: 0,
      elapsedMinutes: 0,
      history: [],
      reviews: [{ attemptIndex: 1, passFail: "FAIL", score: 55, dominantTag: "own.move.after_move_use", at: new Date().toISOString() }],
      latestReview: { passFail: "FAIL", score: 55, dominantTag: "own.move.after_move_use", remediation: { action: "retry_same", reason: "Not done yet" } }
    }
  });

  assert.doesNotThrow(() => requestReview(session));
});

// ---------------------------------------------------------------------------
// Test — new session shape
// ---------------------------------------------------------------------------

test("session: new session has lessonFile: null (not lessonContent)", () => {
  const session = createNewSession("guided", "A200");
  assert.equal(session.lessonFile, null, "new session should have lessonFile: null");
  assert.equal(session.lessonContent, undefined, "new session should not have lessonContent field");
  assert.equal(session.exercisePack, undefined, "new session should not have exercisePack field");
});
