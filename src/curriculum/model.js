import { isDepthLevel } from "../domain/types.js";

export function createNode({
  id,
  title,
  track,
  depthTarget,
  prerequisites = [],
  misconceptionTags = [],
  keywords = []
}) {
  if (!id || !title) {
    throw new Error("Node requires id and title");
  }
  if (!isDepthLevel(depthTarget)) {
    throw new Error(`Invalid depthTarget for ${id}: ${depthTarget}`);
  }
  if (!Array.isArray(misconceptionTags) || misconceptionTags.length === 0) {
    throw new Error(`Node ${id} must provide at least one misconception tag`);
  }

  return {
    id,
    title,
    track,
    depthTarget,
    prerequisites,
    misconceptionTags,
    keywords
  };
}

export function createCurriculumGraph(nodes, tracks) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return {
    nodes,
    tracks,
    byId
  };
}

export function getNode(graph, nodeId) {
  const node = graph.byId.get(nodeId);
  if (!node) {
    throw new Error(`Unknown node: ${nodeId}`);
  }
  return node;
}

export function unmetPrerequisites(graph, nodeId, masteryByNode = {}) {
  const node = getNode(graph, nodeId);
  return node.prerequisites.filter((prereqId) => (masteryByNode[prereqId] ?? 0) < 2);
}
