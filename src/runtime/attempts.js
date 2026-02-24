export function createAttemptState(exerciseId) {
  return {
    exerciseId,
    attemptIndex: 0,
    hintLevelUsed: 0,
    elapsedMinutes: 0,
    history: [],
    reviews: []
  };
}

export function recordAttempt(state, runResult, elapsedMinutes) {
  const attemptIndex = state.attemptIndex + 1;
  return {
    ...state,
    attemptIndex,
    elapsedMinutes,
    history: [
      ...state.history,
      {
        attemptIndex,
        exitCode: runResult.exitCode ?? runResult.code,
        ok: runResult.ok,
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        command: runResult.command ?? null,
        elapsedMinutes,
        at: new Date().toISOString()
      }
    ]
  };
}

export function recordHintUsage(state, hintLevel) {
  return {
    ...state,
    hintLevelUsed: Math.max(state.hintLevelUsed, hintLevel)
  };
}

export function recordReviewOutcome(state, reviewPayload) {
  return {
    ...state,
    reviews: [
      ...state.reviews,
      {
        attemptIndex: state.attemptIndex,
        passFail: reviewPayload.pass_fail,
        score: reviewPayload.score,
        dominantTag: reviewPayload.dominant_tag,
        remediation: reviewPayload.remediation,
        at: new Date().toISOString()
      }
    ],
    latestReview: {
      passFail: reviewPayload.pass_fail,
      score: reviewPayload.score,
      dominantTag: reviewPayload.dominant_tag,
      remediation: reviewPayload.remediation
    }
  };
}

export function getLatestRunResult(state) {
  return state.history[state.history.length - 1] ?? null;
}
