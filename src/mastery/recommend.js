import { unmetPrerequisites } from "../curriculum/model.js";

export function recommendNextNodes({ graph, masteryState, misconceptionState, riskThreshold = 2 }) {
  const mastery = masteryState.byNode;

  return graph.nodes
    .map((node) => {
      const missing = unmetPrerequisites(graph, node.id, mastery);
      const highRiskTag = node.misconceptionTags.find((tag) => {
        const key = `${node.id}:${tag}`;
        return (misconceptionState.counts[key] ?? 0) >= riskThreshold;
      });

      return {
        node,
        eligible: missing.length === 0 && !highRiskTag,
        missing,
        highRiskTag: highRiskTag ?? null
      };
    })
    .filter((entry) => entry.eligible)
    .map((entry) => entry.node.id);
}
