import { getNode, unmetPrerequisites } from "./model.js";

export function getEligibleNextNodes(graph, masteryByNode = {}) {
  return graph.nodes.filter((node) => unmetPrerequisites(graph, node.id, masteryByNode).length === 0);
}

export function narrowTrack(graph, trackId, masteryByNode = {}) {
  const track = graph.tracks[trackId];
  if (!track) {
    throw new Error(`Unknown track: ${trackId}`);
  }

  return track.nodeIds.map((nodeId) => {
    const node = getNode(graph, nodeId);
    const missingPrerequisites = unmetPrerequisites(graph, node.id, masteryByNode);
    return {
      ...node,
      eligible: missingPrerequisites.length === 0,
      missingPrerequisites
    };
  });
}

function scoreTopicMatch(topic, node) {
  const haystack = `${node.title} ${node.keywords.join(" ")}`.toLowerCase();
  const terms = topic.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.reduce((score, term) => (haystack.includes(term) ? score + 1 : score), 0);
}

export function mapCustomTopic(graph, topic, masteryByNode = {}) {
  const scored = graph.nodes
    .map((node) => ({ node, score: scoreTopicMatch(topic, node) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      topic,
      mappedNodeIds: [],
      prerequisiteGaps: []
    };
  }

  const maxScore = scored[0].score;
  const mapped = scored.filter((entry) => entry.score === maxScore).map((entry) => entry.node);

  const prerequisiteGaps = mapped.map((node) => ({
    nodeId: node.id,
    missingPrerequisites: unmetPrerequisites(graph, node.id, masteryByNode)
  }));

  return {
    topic,
    mappedNodeIds: mapped.map((node) => node.id),
    prerequisiteGaps
  };
}

export function prerequisiteGapReport(mapping) {
  return mapping.prerequisiteGaps.filter((entry) => entry.missingPrerequisites.length > 0);
}
