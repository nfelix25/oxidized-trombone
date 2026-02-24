import { unmetPrerequisites } from "../curriculum/model.js";

export const DEFAULT_RISK_THRESHOLD = 2;

export function recommendNextNodes({
  graph,
  masteryState,
  misconceptionState,
  riskThreshold = DEFAULT_RISK_THRESHOLD,
  maxResults = 5
}) {
  const mastery = masteryState.byNode;
  const counts = misconceptionState?.counts ?? {};

  const scored = graph.nodes
    .map((node) => {
      const missing = unmetPrerequisites(graph, node.id, mastery);
      const highRiskTag = node.misconceptionTags.find((tag) => {
        const key = `${node.id}:${tag}`;
        return (counts[key] ?? 0) >= riskThreshold;
      });

      const currentMastery = mastery[node.id] ?? 0;

      return {
        node,
        eligible: missing.length === 0 && !highRiskTag,
        missing,
        highRiskTag: highRiskTag ?? null,
        currentMastery
      };
    })
    .filter((entry) => entry.eligible)
    // Prefer lower-mastery nodes (more learning opportunity), then alphabetical
    .sort((a, b) => a.currentMastery - b.currentMastery || a.node.id.localeCompare(b.node.id));

  return scored.slice(0, maxResults).map((entry) => entry.node.id);
}
