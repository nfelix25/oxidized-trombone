export function evaluatePolicy({ schemaName, payload, packet }) {
  const violations = [];

  if (schemaName === "exercise_pack_v1") {
    // Policy check: run_instructions.commands must not be empty if present
    // (schema only requires run_instructions is an object, not that it has commands)
    const runInstructions = payload.run_instructions;
    if (runInstructions !== undefined) {
      const commands = runInstructions.commands;
      if (Array.isArray(commands) && commands.length === 0) {
        violations.push({
          rule: "non_empty_run_instructions",
          reason: "run_instructions.commands must not be empty"
        });
      }
    }
  }

  if (schemaName === "hint_pack_v1") {
    if (payload.allowed_reveal === false && payload.full_solution_provided === true) {
      violations.push({
        rule: "no_early_reveal",
        reason: "Full solution provided while reveal is not allowed"
      });
    }

    const maxAttempts = packet?.policy_context?.max_attempts_before_reveal ?? 4;
    const explicitReveal = packet?.attempt_context?.user_requested_reveal === true;
    const currentAttempt = packet?.attempt_context?.attempt_index ?? 0;

    if (!explicitReveal && currentAttempt < maxAttempts) {
      if (payload.full_solution_provided === true) {
        violations.push({
          rule: "respect_attempt_threshold",
          reason: `Full solution provided before attempt threshold (${currentAttempt}/${maxAttempts})`
        });
      }
    }

    // Hint level must be one of 1, 2, 3
    if (payload.hint_level !== undefined) {
      if (![1, 2, 3].includes(payload.hint_level)) {
        violations.push({
          rule: "valid_hint_level",
          reason: `hint_level must be 1, 2, or 3; got ${payload.hint_level}`
        });
      }
    }
  }

  if (schemaName === "review_report_v1") {
    if (payload.pass_fail === "PASS" && payload.score < 70) {
      violations.push({
        rule: "pass_score_consistency",
        reason: "PASS requires a score >= 70"
      });
    }

    if (payload.pass_fail === "FAIL" && payload.score >= 90) {
      violations.push({
        rule: "fail_score_consistency",
        reason: "FAIL with score >= 90 is inconsistent"
      });
    }
  }

  if (schemaName === "lesson_plan_v1") {
    // Policy check: bridge_lesson handoff must not be used when lesson_outline only has 1 step
    // (schema validates next_action enum, but not semantic consistency)
    if (payload.next_action === "bridge_lesson") {
      const outlineLen = payload.lesson_outline?.length ?? 0;
      if (outlineLen > 2) {
        violations.push({
          rule: "bridge_lesson_not_for_complex_outline",
          reason: "bridge_lesson handoff is intended for short focused corrections, not multi-step outlines"
        });
      }
    }
  }

  return {
    ok: violations.length === 0,
    violations
  };
}

export function toRejectionResult(schemaName, violations) {
  return {
    accepted: false,
    schemaName,
    reason: "POLICY_VIOLATION",
    violations
  };
}
