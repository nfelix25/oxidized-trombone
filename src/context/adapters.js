const BASE_KEYS = [
  "schema_version",
  "packet_id",
  "timestamp_utc",
  "role",
  "task_type",
  "learner_profile",
  "curriculum_context",
  "misconception_context",
  "attempt_context",
  "evidence_context",
  "policy_context",
  "output_contract"
];

function pick(obj, keys) {
  return Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]]));
}

export function plannerView(packet) {
  return pick(packet, [
    ...BASE_KEYS.filter((key) => key !== "evidence_context"),
    "memory_context"
  ]);
}

export function authorView(packet) {
  return pick(packet, [
    ...BASE_KEYS.filter((key) => key !== "evidence_context"),
    "memory_context"
  ]);
}

export function coachView(packet) {
  return pick(packet, [...BASE_KEYS, "memory_context"]);
}

export function reviewerView(packet) {
  return pick(packet, [...BASE_KEYS, "memory_context"]);
}

export const roleViews = {
  planner: plannerView,
  author: authorView,
  coach: coachView,
  reviewer: reviewerView
};

export function adaptContextForRole(packet) {
  const adapter = roleViews[packet.role];
  if (!adapter) {
    throw new Error(`No adapter for role ${packet.role}`);
  }
  return adapter(packet);
}
