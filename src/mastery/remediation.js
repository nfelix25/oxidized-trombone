import { rollingTagFrequency } from "./misconceptions.js";

export function scheduleRemediation({ misconceptionState, nodeId, tag, threshold = 2 }) {
  const count = rollingTagFrequency(misconceptionState, { nodeId, tag });
  if (count < threshold) {
    return null;
  }

  return {
    action: "bridge_lesson",
    nodeId,
    tag,
    reason: `Tag frequency threshold reached (${count})`
  };
}

export function chooseFollowUpExercise(remediation) {
  if (!remediation) {
    return "normal";
  }
  return remediation.action === "bridge_lesson" ? "narrower_follow_up" : "normal";
}
