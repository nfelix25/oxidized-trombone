/**
 * End-to-end validation guard. Prevents unvalidated stage outputs
 * from entering session state by requiring `accepted: true` before
 * any downstream mutation is permitted.
 */
export function assertAccepted(stageResult, context = "") {
  if (!stageResult || stageResult.accepted !== true) {
    const reason = stageResult?.reason ?? "UNKNOWN";
    const label = context ? ` [${context}]` : "";
    throw new StageRejectedError(
      `Stage output rejected${label}: ${reason}`,
      stageResult
    );
  }
  return stageResult.payload;
}

export function isAccepted(stageResult) {
  return stageResult?.accepted === true;
}

export class StageRejectedError extends Error {
  constructor(message, result) {
    super(message);
    this.name = "StageRejectedError";
    this.result = result;
  }
}

export function toMachineError(stageResult) {
  if (!stageResult) {
    return { error: "NULL_RESULT", reason: "UNKNOWN", detail: null };
  }
  return {
    error: stageResult.reason ?? "UNKNOWN",
    schemaName: stageResult.schemaName ?? null,
    violations: stageResult.violations ?? null,
    errors: stageResult.errors ?? null,
    detail: stageResult.details ?? null
  };
}
