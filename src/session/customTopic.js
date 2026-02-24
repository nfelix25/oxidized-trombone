import { mapCustomTopic, prerequisiteGapReport } from "../curriculum/selectors.js";
import { question } from "./modeSelect.js";

export async function runCustomTopicFlow(rl, graph, masteryByNode = {}) {
  const topic = (await question(rl, "\nEnter topic (e.g. 'mutable references'): ")).trim();

  if (!topic) {
    console.log("No topic entered. Cancelling.");
    return null;
  }

  const mapping = mapCustomTopic(graph, topic, masteryByNode);

  if (mapping.mappedNodeIds.length === 0) {
    return handleNoMatch(topic);
  }

  console.log(`\nMapped nodes for "${topic}":`);
  mapping.mappedNodeIds.forEach((nodeId) => {
    const node = graph.byId.get(nodeId);
    const label = node ? `[${nodeId}] ${node.title}` : nodeId;
    console.log(`  - ${label}`);
  });

  const gaps = prerequisiteGapReport(mapping);
  if (gaps.length > 0) {
    console.log("\nPrerequisite gaps:");
    for (const { nodeId, missingPrerequisites } of gaps) {
      console.log(`  ${nodeId} requires: ${missingPrerequisites.join(", ")}`);
    }
  }

  const eligibleIds = mapping.mappedNodeIds.filter((nodeId) => {
    const gap = gaps.find((g) => g.nodeId === nodeId);
    return !gap || gap.missingPrerequisites.length === 0;
  });

  if (eligibleIds.length === 0) {
    console.log("\nNo eligible nodes (all have unmet prerequisites).");
    console.log("Complete prerequisites first, then retry this topic.");
    return { topic, nodeId: null, mapping, gaps };
  }

  const nodeId = eligibleIds[0];
  const node = graph.byId.get(nodeId);
  console.log(`\nStarting with: [${nodeId}] ${node?.title ?? nodeId}`);

  return { topic, nodeId, mapping, gaps };
}

function handleNoMatch(topic) {
  console.log(`\nNo curriculum nodes found for "${topic}".`);
  console.log("Available topic areas: ownership, borrowing, lifetimes, iterators, async, traits, error handling.");
  return { topic, nodeId: null, mapping: { topic, mappedNodeIds: [], prerequisiteGaps: [] }, gaps: [] };
}
