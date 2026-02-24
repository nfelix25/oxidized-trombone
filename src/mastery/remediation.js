import { rollingTagFrequency } from "./misconceptions.js";

const DEFAULT_THRESHOLDS = {
  bridge_lesson: 2,
  repeat_with_scaffold: 4
};

export function scheduleRemediation({
  misconceptionState,
  nodeId,
  tag,
  threshold,
  thresholds = DEFAULT_THRESHOLDS
}) {
  const resolvedThreshold = threshold ?? thresholds.bridge_lesson;
  const count = rollingTagFrequency(misconceptionState, { nodeId, tag });

  if (count < resolvedThreshold) {
    return null;
  }

  const action = count >= (thresholds.repeat_with_scaffold ?? 4)
    ? "repeat_with_scaffold"
    : "bridge_lesson";

  return {
    action,
    nodeId,
    tag,
    triggerFrequency: count,
    threshold: resolvedThreshold,
    reason: `Tag "${tag}" triggered ${count} time(s) (threshold: ${resolvedThreshold})`
  };
}

export function chooseFollowUpExercise(remediation) {
  if (!remediation) {
    return "normal";
  }
  if (remediation.action === "repeat_with_scaffold") return "scaffolded_repeat";
  return remediation.action === "bridge_lesson" ? "narrower_follow_up" : "normal";
}

export { DEFAULT_THRESHOLDS };
