export function evaluatePolicy({ schemaName, payload, packet }) {
  const violations = [];

  if (schemaName === "hint_pack_v1") {
    if (payload.allowed_reveal === false && payload.full_solution_provided === true) {
      violations.push({
        rule: "no_early_reveal",
        reason: "Full solution provided while reveal is not allowed"
      });
    }

    const maxAttempts = packet?.policy_context?.max_attempts_before_reveal ?? 4;
    const explicitReveal = packet?.attempt_context?.user_requested_reveal === true;
    if (!explicitReveal && (packet?.attempt_context?.attempt_index ?? 0) < maxAttempts) {
      if (payload.full_solution_provided === true) {
        violations.push({
          rule: "respect_attempt_threshold",
          reason: "Full solution provided before attempt threshold"
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
