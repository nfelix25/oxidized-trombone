export function createMasteryState(seed = {}) {
  return {
    byNode: { ...seed },
    history: []
  };
}

export function updateMasteryForOutcome(state, { nodeId, depthTarget, pass }) {
  const before = state.byNode[nodeId] ?? 0;
  let after = before;

  if (pass) {
    if (depthTarget === "D1") after = Math.max(before, 1);
    if (depthTarget === "D2") after = Math.max(before, 2);
    if (depthTarget === "D3") after = 3;
  }

  return {
    byNode: { ...state.byNode, [nodeId]: after },
    history: [
      ...state.history,
      {
        nodeId,
        before,
        after,
        depthTarget,
        pass,
        at: new Date().toISOString()
      }
    ]
  };
}
