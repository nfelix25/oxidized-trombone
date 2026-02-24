export function createMisconceptionState() {
  return {
    attempts: [],
    counts: {}
  };
}

export function recordMisconception(state, { nodeId, tag, attemptIndex }) {
  if (!nodeId || typeof nodeId !== "string") {
    throw new Error("recordMisconception: nodeId is required");
  }
  if (!tag || typeof tag !== "string") {
    throw new Error("recordMisconception: tag is required");
  }
  if (attemptIndex === undefined || attemptIndex === null) {
    throw new Error("recordMisconception: attemptIndex is required");
  }

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
