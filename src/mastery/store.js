export function createMasteryState(seed = {}) {
  return {
    byNode: { ...seed },
    history: []
  };
}

export function updateMasteryForOutcome(state, { nodeId, depthTarget, pass, score }) {
  const before = state.byNode[nodeId] ?? 0;
  let after = before;

  if (pass) {
    // Passing advances mastery level but never downgrades it
    if (depthTarget === "D1") after = Math.max(before, 1);
    if (depthTarget === "D2") after = Math.max(before, 2);
    if (depthTarget === "D3") after = 3;
  } else if (score !== undefined) {
    // Failing with a very low score (< 40) can downgrade mastery by 1, floor 0
    if (score < 40 && before > 0) {
      after = before - 1;
    }
    // score >= 40 on fail: no change (downgrade-safe)
  }
  // Failing without score: no change

  const changed = after !== before;

  return {
    byNode: { ...state.byNode, [nodeId]: after },
    history: [
      ...state.history,
      {
        nodeId,
        before,
        after,
        changed,
        depthTarget,
        pass,
        score: score ?? null,
        at: new Date().toISOString()
      }
    ]
  };
}

export function masteryLevel(state, nodeId) {
  return state.byNode[nodeId] ?? 0;
}
