export const DEPTH_LEVELS = ["D1", "D2", "D3"];
export const ROLES = ["planner", "author", "coach", "reviewer"];
export const TASK_TYPES = [
  "plan_lesson",
  "generate_exercise",
  "give_hint",
  "evaluate_attempt"
];

export function isDepthLevel(value) {
  return DEPTH_LEVELS.includes(value);
}

export function isRole(value) {
  return ROLES.includes(value);
}

export function nowIso() {
  return new Date().toISOString();
}

export function createAttemptRecord({
  exerciseId,
  attemptIndex,
  hintLevelUsed,
  elapsedMinutes,
  compilerErrors = [],
  failingTests = []
}) {
  return {
    exerciseId,
    attemptIndex,
    hintLevelUsed,
    elapsedMinutes,
    compilerErrors,
    failingTests,
    capturedAt: nowIso()
  };
}

export function createMasteryRecord(nodeId, before = 0, after = 0) {
  return {
    nodeId,
    before,
    after,
    updatedAt: nowIso()
  };
}
