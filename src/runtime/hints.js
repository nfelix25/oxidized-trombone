import { evaluatePolicy } from "../policy/engine.js";

export function nextHintLevel(currentLevel) {
  return Math.min(3, currentLevel + 1);
}

export function canReveal({ attemptIndex, maxAttemptsBeforeReveal, userRequestedReveal = false }) {
  return userRequestedReveal || attemptIndex >= maxAttemptsBeforeReveal;
}

export function applyHintPolicy(packet, hintPayload) {
  const policyResult = evaluatePolicy({
    schemaName: "hint_pack_v1",
    payload: hintPayload,
    packet
  });

  return {
    accepted: policyResult.ok,
    violations: policyResult.violations
  };
}
