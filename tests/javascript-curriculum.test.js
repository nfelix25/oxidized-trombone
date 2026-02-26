import test from "node:test";
import assert from "node:assert/strict";
import { getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";
import { getAvailableLanguages, getLanguageConfig } from "../src/config/languages.js";

// ---------------------------------------------------------------------------
// Language isolation
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: javascript graph contains only javascript nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.ok(graph.nodes.length > 0, "javascript graph should have nodes");
  for (const node of graph.nodes) {
    assert.equal(node.language, "javascript", `Node ${node.id} should have language=javascript`);
  }
});

test("getCurriculumForLanguage: javascript graph contains no rust nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  const rustNode = graph.nodes.find((n) => n.language === "rust");
  assert.equal(rustNode, undefined, "javascript graph should contain no rust nodes");
});

test("getCurriculumForLanguage: javascript graph contains no c nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  const cNode = graph.nodes.find((n) => n.language === "c");
  assert.equal(cNode, undefined, "javascript graph should contain no c nodes");
});

test("getCurriculumForLanguage: javascript graph contains no typescript nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  const tsNode = graph.nodes.find((n) => n.language === "typescript");
  assert.equal(tsNode, undefined, "javascript graph should contain no typescript nodes");
});

// ---------------------------------------------------------------------------
// Entry points — each track has an accessible first node
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: JM01 exists in javascript curriculum", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.ok(graph.byId.get("JM01"), "JM01 should exist in javascript curriculum");
});

test("getCurriculumForLanguage: JX01 exists in javascript curriculum", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.ok(graph.byId.get("JX01"), "JX01 should exist");
});

test("getCurriculumForLanguage: JN01 exists in javascript curriculum", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.ok(graph.byId.get("JN01"), "JN01 should exist");
});

test("getCurriculumForLanguage: JW01 exists in javascript curriculum", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.ok(graph.byId.get("JW01"), "JW01 should exist");
});

test("getCurriculumForLanguage: JA01 exists in javascript curriculum", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.ok(graph.byId.get("JA01"), "JA01 should exist");
});

test("getCurriculumForLanguage: JQ01 exists in javascript curriculum", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.ok(graph.byId.get("JQ01"), "JQ01 should exist");
});

// ---------------------------------------------------------------------------
// Node count and track coverage
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: javascript curriculum has 80 nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  assert.equal(
    graph.nodes.length,
    80,
    `Expected 80 javascript nodes, got ${graph.nodes.length}`
  );
});

test("getCurriculumForLanguage: javascript curriculum has exactly 6 tracks", () => {
  const graph = getCurriculumForLanguage("javascript");
  const trackCount = Object.keys(graph.tracks).length;
  assert.equal(trackCount, 6, `Expected 6 tracks, got ${trackCount}`);
});

test("getCurriculumForLanguage: all 6 expected tracks are present", () => {
  const graph = getCurriculumForLanguage("javascript");
  const expectedTracks = [
    "js-meta-programming",
    "js-challenges",
    "js-node-advanced",
    "js-weird-parts",
    "js-async-patterns",
    "js-toolchain"
  ];
  for (const trackId of expectedTracks) {
    assert.ok(graph.tracks[trackId], `Track ${trackId} should exist`);
  }
});

test("getCurriculumForLanguage: js-meta-programming track has 15 nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  const track = graph.tracks["js-meta-programming"];
  assert.ok(track, "js-meta-programming track should exist");
  assert.equal(track.nodeIds.length, 15, `Expected 15 nodes, got ${track.nodeIds.length}`);
});

test("getCurriculumForLanguage: js-challenges track has 20 nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  const track = graph.tracks["js-challenges"];
  assert.ok(track, "js-challenges track should exist");
  assert.equal(track.nodeIds.length, 20, `Expected 20 nodes, got ${track.nodeIds.length}`);
});

test("getCurriculumForLanguage: js-weird-parts track has 15 nodes", () => {
  const graph = getCurriculumForLanguage("javascript");
  const track = graph.tracks["js-weird-parts"];
  assert.ok(track, "js-weird-parts track should exist");
  assert.equal(track.nodeIds.length, 15, `Expected 15 nodes, got ${track.nodeIds.length}`);
});

// ---------------------------------------------------------------------------
// Node structural validity
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all javascript nodes have misconceptionTags", () => {
  const graph = getCurriculumForLanguage("javascript");
  const missing = graph.nodes.filter(
    (n) => !n.misconceptionTags || n.misconceptionTags.length === 0
  );
  assert.deepEqual(
    missing.map((n) => n.id),
    [],
    `Nodes missing misconceptionTags: ${missing.map((n) => n.id).join(", ")}`
  );
});

test("getCurriculumForLanguage: all javascript nodes have keywords", () => {
  const graph = getCurriculumForLanguage("javascript");
  const missing = graph.nodes.filter((n) => !n.keywords || n.keywords.length === 0);
  assert.deepEqual(
    missing.map((n) => n.id),
    [],
    `Nodes missing keywords: ${missing.map((n) => n.id).join(", ")}`
  );
});

test("getCurriculumForLanguage: all javascript nodes have a depthTarget", () => {
  const graph = getCurriculumForLanguage("javascript");
  const missing = graph.nodes.filter((n) => !n.depthTarget);
  assert.deepEqual(
    missing.map((n) => n.id),
    [],
    `Nodes missing depthTarget: ${missing.map((n) => n.id).join(", ")}`
  );
});

test("getCurriculumForLanguage: all javascript node IDs are unique", () => {
  const graph = getCurriculumForLanguage("javascript");
  const seen = new Set();
  const duplicates = [];
  for (const node of graph.nodes) {
    if (seen.has(node.id)) duplicates.push(node.id);
    seen.add(node.id);
  }
  assert.deepEqual(duplicates, [], `Duplicate node IDs: ${duplicates.join(", ")}`);
});

test("getCurriculumForLanguage: each node belongs to exactly one track", () => {
  const graph = getCurriculumForLanguage("javascript");
  const nodeTrackCount = new Map();
  for (const [trackId, track] of Object.entries(graph.tracks)) {
    for (const nodeId of track.nodeIds) {
      nodeTrackCount.set(nodeId, (nodeTrackCount.get(nodeId) ?? 0) + 1);
    }
  }
  const multiTrack = [...nodeTrackCount.entries()].filter(([, count]) => count > 1);
  assert.deepEqual(
    multiTrack,
    [],
    `Nodes in multiple tracks: ${multiTrack.map(([id]) => id).join(", ")}`
  );
});

// ---------------------------------------------------------------------------
// Prerequisite graph integrity (all should be empty — no deps)
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all javascript nodes have empty prerequisites", () => {
  const graph = getCurriculumForLanguage("javascript");
  const withPrereqs = graph.nodes.filter((n) => n.prerequisites.length > 0);
  assert.deepEqual(
    withPrereqs.map((n) => n.id),
    [],
    `Nodes with prerequisites (should be none): ${withPrereqs.map((n) => n.id).join(", ")}`
  );
});

test("getCurriculumForLanguage: javascript prerequisite graph has no cycles", () => {
  const graph = getCurriculumForLanguage("javascript");
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const prereqMap = new Map(graph.nodes.map((n) => [n.id, n.prerequisites]));

  function hasCycle(nodeId, visiting = new Set(), visited = new Set()) {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visiting.add(nodeId);
    for (const prereq of prereqMap.get(nodeId) ?? []) {
      if (nodeIds.has(prereq) && hasCycle(prereq, visiting, visited)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  }

  const cycles = [];
  for (const node of graph.nodes) {
    if (hasCycle(node.id)) cycles.push(node.id);
  }
  assert.deepEqual(cycles, [], `Cycle detected involving nodes: ${cycles.join(", ")}`);
});

// ---------------------------------------------------------------------------
// Language registry
// ---------------------------------------------------------------------------

test("getAvailableLanguages: includes javascript", () => {
  const langs = getAvailableLanguages();
  assert.ok(langs.includes("javascript"), "should include javascript");
});

test("getLanguageConfig: javascript config returns without throwing", () => {
  assert.doesNotThrow(() => {
    const config = getLanguageConfig("javascript");
    assert.equal(config.name, "JavaScript");
    assert.deepEqual(config.testCommand, ["node", "--test"]);
    assert.equal(config.sourceDir, "src");
    assert.equal(config.testsDir, "tests");
  });
});

test("getLanguageConfig: javascript config has all 6 stage instructions", () => {
  const config = getLanguageConfig("javascript");
  const requiredStages = ["scaffold", "starter-expand", "test-expand", "lesson-expand", "coach", "reviewer"];
  for (const stage of requiredStages) {
    assert.ok(
      config.stageInstructions[stage],
      `javascript stageInstructions should have ${stage}`
    );
    assert.ok(
      config.stageInstructions[stage].length > 50,
      `javascript ${stage} instruction should be non-trivial`
    );
  }
});

test("getLanguageConfig: javascript writeProjectConfig is a function", () => {
  const config = getLanguageConfig("javascript");
  assert.equal(typeof config.writeProjectConfig, "function");
});

// ---------------------------------------------------------------------------
// Existing languages unaffected
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: rust curriculum is unaffected by javascript addition", () => {
  const rustGraph = getCurriculumForLanguage("rust");
  assert.ok(rustGraph.nodes.length > 0, "rust curriculum should still have nodes");
  for (const node of rustGraph.nodes) {
    assert.equal(node.language, "rust", `Node ${node.id} should have language=rust`);
  }
});

test("getCurriculumForLanguage: typescript curriculum is unaffected by javascript addition", () => {
  const tsGraph = getCurriculumForLanguage("typescript");
  assert.ok(tsGraph.nodes.length > 0, "typescript curriculum should still have nodes");
  for (const node of tsGraph.nodes) {
    assert.equal(node.language, "typescript", `Node ${node.id} should have language=typescript`);
  }
});

test("getLanguageConfig: rust config is unaffected by javascript addition", () => {
  assert.doesNotThrow(() => {
    const config = getLanguageConfig("rust");
    assert.equal(config.name, "Rust");
  });
});
