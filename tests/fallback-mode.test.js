import test from "node:test";
import assert from "node:assert/strict";
import { runStage } from "../src/orchestration/stages.js";
import { withRetry, isRetryable, classifyFailure } from "../src/orchestration/retry.js";

const VALID_PLANNER_PAYLOAD = {
  schema_version: "lesson_plan_v1",
  role: "planner",
  plan_id: "lp_test",
  node_id: "A200",
  depth_target: "D1",
  objective: "Test fallback mode",
  misconception_focus: ["own.move.after_move_use"],
  lesson_outline: [{ step: 1, title: "intro" }],
  assessment_plan: { assessment_type: "coding_exercise" },
  next_action: "generate_exercise"
};

test("fallback mode: uses fallbackPayload when fallback=true", async () => {
  const packet = {};
  const result = await runStage("planner", packet, {
    fallback: true,
    fallbackPayload: VALID_PLANNER_PAYLOAD
  });

  assert.equal(result.accepted, true, "fallback with valid payload should be accepted");
  assert.equal(result.payload.node_id, "A200");
});

test("fallback mode: fails with machine-readable error when no fallbackPayload", async () => {
  const packet = {};
  const result = await runStage("planner", packet, {
    fallback: true
  });

  assert.equal(result.accepted, false, "fallback without payload should fail");
  assert.equal(result.reason, "EXECUTION_FAILED");
  assert.ok(result.details.includes("fallback mode"));
});

test("fallback mode: schema validation still runs on fallbackPayload", async () => {
  const packet = {};
  const badPayload = { schema_version: "lesson_plan_v1", role: "planner" }; // missing required fields
  const result = await runStage("planner", packet, {
    fallback: true,
    fallbackPayload: badPayload
  });

  assert.equal(result.accepted, false, "fallback with invalid payload should fail schema validation");
  assert.equal(result.reason, "SCHEMA_VALIDATION_FAILED");
});

test("fallback mode: policy still runs on fallbackPayload", async () => {
  const packet = { attempt_context: { attempt_index: 1, user_requested_reveal: false }, policy_context: { max_attempts_before_reveal: 4 } };
  const earlyRevealPayload = {
    schema_version: "hint_pack_v1",
    role: "coach",
    hint_id: "hp_test",
    exercise_id: "ex_test",
    node_id: "A200",
    depth_target: "D1",
    attempt_index: 1,
    hint_level: 3,
    dominant_tag: "own.move.after_move_use",
    allowed_reveal: false,
    current_hint: { style: "full", text: "solution" },
    full_solution_provided: true
  };

  const result = await runStage("coach", packet, {
    fallback: true,
    fallbackPayload: earlyRevealPayload
  });

  assert.equal(result.accepted, false, "fallback payload violating policy should fail");
  assert.equal(result.reason, "POLICY_VIOLATION");
  const ruleIds = result.violations.map((v) => v.rule);
  assert.ok(ruleIds.includes("no_early_reveal") || ruleIds.includes("respect_attempt_threshold"));
});

test("retry: classifies execution failures as retryable", () => {
  const execFailed = { accepted: false, reason: "EXECUTION_FAILED" };
  assert.equal(classifyFailure(execFailed), "execution");
  assert.ok(isRetryable(execFailed));
});

test("retry: classifies schema failures as non-retryable", () => {
  const schemaFailed = { accepted: false, reason: "SCHEMA_VALIDATION_FAILED" };
  assert.equal(classifyFailure(schemaFailed), "schema");
  assert.ok(!isRetryable(schemaFailed));
});

test("retry: withRetry stops on non-retryable failure", async () => {
  let callCount = 0;
  const result = await withRetry(async () => {
    callCount++;
    return { accepted: false, reason: "SCHEMA_VALIDATION_FAILED" };
  }, { maxAttempts: 3, baseDelayMs: 0 });

  assert.equal(callCount, 1, "should only call once for non-retryable failure");
  assert.equal(result.accepted, false);
  assert.equal(result.retryAttempt, 1);
});

test("retry: withRetry retries on execution failure up to max attempts", async () => {
  let callCount = 0;
  const result = await withRetry(async () => {
    callCount++;
    return { accepted: false, reason: "EXECUTION_FAILED" };
  }, { maxAttempts: 3, baseDelayMs: 0, backoffMultiplier: 1 });

  assert.equal(callCount, 3, "should retry up to max attempts");
  assert.equal(result.retryAttempt, 3);
});

test("retry: withRetry returns immediately on success", async () => {
  let callCount = 0;
  const result = await withRetry(async () => {
    callCount++;
    if (callCount < 2) return { accepted: false, reason: "EXECUTION_FAILED" };
    return { accepted: true, payload: { ok: true } };
  }, { maxAttempts: 5, baseDelayMs: 0 });

  assert.equal(callCount, 2, "should return after first success");
  assert.equal(result.accepted, true);
});
