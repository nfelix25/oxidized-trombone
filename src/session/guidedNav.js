import { narrowTrack } from "../curriculum/selectors.js";
import { question } from "./modeSelect.js";

/**
 * Run guided curriculum navigation.
 *
 * @param {object} rl              readline interface
 * @param {object} graph           language-filtered curriculum graph
 * @param {object} masteryByNode   mastery levels keyed by node id
 * @param {Array}  customTopics    optional saved custom topics for this language
 * @returns {Promise<string|object>} nodeId string for curriculum nodes,
 *   or a custom node object `{ id, name, language, keywords, _custom: true }` for custom topics
 */
export async function runGuidedNav(rl, graph, masteryByNode = {}, customTopics = []) {
  const tracks = Object.values(graph.tracks);
  const hasCustom = customTopics.length > 0;
  const totalOptions = tracks.length + (hasCustom ? 1 : 0);

  console.log("\nAvailable tracks:");
  tracks.forEach((track, i) => {
    console.log(`  ${i + 1}) ${track.title} (${track.nodeIds.length} nodes)`);
  });
  if (hasCustom) {
    console.log(`  ${tracks.length + 1}) Custom (${customTopics.length} saved topics)`);
  }

  let selectedTrack = null;
  let pickedCustom = false;
  while (!selectedTrack && !pickedCustom) {
    const input = (await question(rl, "Select track [number]: ")).trim();
    const idx = parseInt(input, 10) - 1;
    if (idx >= 0 && idx < tracks.length) {
      selectedTrack = tracks[idx];
    } else if (hasCustom && idx === tracks.length) {
      pickedCustom = true;
    } else {
      console.log(`Please enter a number between 1 and ${totalOptions}.`);
    }
  }

  // Custom topic branch
  if (pickedCustom) {
    return pickCustomTopic(rl, customTopics);
  }

  const nodes = narrowTrack(graph, selectedTrack.id, masteryByNode);
  console.log(`\nNodes in "${selectedTrack.title}":`);

  const eligible = [];
  const blocked = [];

  for (const node of nodes) {
    if (node.eligible) {
      eligible.push(node);
    } else {
      blocked.push(node);
    }
  }

  if (eligible.length === 0) {
    console.log("  No eligible nodes in this track. Complete prerequisites first.");
    return null;
  }

  console.log("\n  Eligible:");
  eligible.forEach((node, i) => {
    console.log(`    ${i + 1}) [${node.id}] ${node.title} (depth: ${node.depthTarget})`);
  });

  if (blocked.length > 0) {
    console.log("\n  Blocked (missing prerequisites):");
    for (const node of blocked) {
      console.log(`    - [${node.id}] ${node.title}`);
      showBlockedReasons(node);
    }
  }

  let selectedNode;
  while (!selectedNode) {
    const input = (await question(rl, "\nSelect eligible node [number]: ")).trim();
    const idx = parseInt(input, 10) - 1;
    if (idx >= 0 && idx < eligible.length) {
      selectedNode = eligible[idx];
    } else {
      console.log(`Please enter a number between 1 and ${eligible.length}.`);
    }
  }

  console.log(`\nSelected: [${selectedNode.id}] ${selectedNode.title}`);
  return selectedNode.id;
}

function showBlockedReasons(node) {
  if (node.missingPrerequisites && node.missingPrerequisites.length > 0) {
    console.log(`      Missing prerequisites: ${node.missingPrerequisites.join(", ")}`);
  }
}

async function pickCustomTopic(rl, topics) {
  console.log("\nCustom topics:");
  topics.forEach((topic, i) => {
    console.log(`  ${i + 1}) ${topic.name}`);
  });

  let selected;
  while (!selected) {
    const input = (await question(rl, "\nSelect topic [number]: ")).trim();
    const idx = parseInt(input, 10) - 1;
    if (idx >= 0 && idx < topics.length) {
      selected = topics[idx];
    } else {
      console.log(`Please enter a number between 1 and ${topics.length}.`);
    }
  }

  console.log(`\nSelected: ${selected.name}`);
  return {
    id: selected.id,
    name: selected.name,
    language: selected.language,
    keywords: selected.keywords ?? [],
    title: selected.name,
    track: "custom",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: selected.keywords?.length > 0 ? selected.keywords : ["custom.topic"],
    _custom: true
  };
}
