import { narrowTrack } from "../curriculum/selectors.js";
import { question } from "./modeSelect.js";

export async function runGuidedNav(rl, graph, masteryByNode = {}) {
  const tracks = Object.values(graph.tracks);

  console.log("\nAvailable tracks:");
  tracks.forEach((track, i) => {
    console.log(`  ${i + 1}) ${track.title} (${track.nodeIds.length} nodes)`);
  });

  let selectedTrack;
  while (!selectedTrack) {
    const input = (await question(rl, "Select track [number]: ")).trim();
    const idx = parseInt(input, 10) - 1;
    if (idx >= 0 && idx < tracks.length) {
      selectedTrack = tracks[idx];
    } else {
      console.log(`Please enter a number between 1 and ${tracks.length}.`);
    }
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
