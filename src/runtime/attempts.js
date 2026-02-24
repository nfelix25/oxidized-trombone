export function createAttemptState(exerciseId) {
  return {
    exerciseId,
    attemptIndex: 0,
    hintLevelUsed: 0,
    elapsedMinutes: 0,
    history: []
  };
}

export function recordAttempt(state, runResult, elapsedMinutes) {
  const next = {
    ...state,
    attemptIndex: state.attemptIndex + 1,
    elapsedMinutes,
    history: [
      ...state.history,
      {
        attemptIndex: state.attemptIndex + 1,
        code: runResult.code,
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        elapsedMinutes
      }
    ]
  };

  return next;
}

export function recordHintUsage(state, hintLevel) {
  return {
    ...state,
    hintLevelUsed: Math.max(state.hintLevelUsed, hintLevel)
  };
}
