import { isDepthLevel } from "../domain/types.js";

export function createNode({
  id,
  title,
  track,
  depthTarget,
  prerequisites = [],
  misconceptionTags = [],
  keywords = [],
  language = "rust"
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
    keywords,
    language
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

export function validateCurriculumGraph(graph) {
  const errors = [];
  const knownIds = new Set(graph.nodes.map((n) => n.id));

  for (const node of graph.nodes) {
    if (!node.misconceptionTags || node.misconceptionTags.length === 0) {
      errors.push(`${node.id}: missing misconception tags`);
    }
    for (const prereq of node.prerequisites) {
      if (!knownIds.has(prereq)) {
        errors.push(`${node.id}: unknown prerequisite ${prereq}`);
      }
    }
    if (!node.depthTarget) {
      errors.push(`${node.id}: missing depthTarget`);
    }
    if (!node.track) {
      errors.push(`${node.id}: missing track`);
    }
  }

  for (const [trackId, track] of Object.entries(graph.tracks)) {
    for (const nodeId of track.nodeIds) {
      if (!knownIds.has(nodeId)) {
        errors.push(`Track ${trackId}: references unknown node ${nodeId}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
}
