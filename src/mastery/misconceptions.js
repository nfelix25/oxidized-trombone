export function createMisconceptionState() {
  return {
    attempts: [],
    counts: {}
  };
}

export function recordMisconception(state, { nodeId, tag, attemptIndex }) {
  const attempts = [
    ...state.attempts,
    {
      nodeId,
      tag,
      attemptIndex,
      at: new Date().toISOString()
    }
  ];

  const key = `${nodeId}:${tag}`;
  const counts = {
    ...state.counts,
    [key]: (state.counts[key] ?? 0) + 1
  };

  return { attempts, counts };
}

export function rollingTagFrequency(state, { nodeId, tag }) {
  return state.counts[`${nodeId}:${tag}`] ?? 0;
}
