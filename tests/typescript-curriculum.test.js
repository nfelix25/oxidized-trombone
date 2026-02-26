import test from "node:test";
import assert from "node:assert/strict";
import { getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";
import { getAvailableLanguages, getLanguageConfig } from "../src/config/languages.js";

// ---------------------------------------------------------------------------
// Language isolation
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: typescript graph contains only typescript nodes", () => {
  const graph = getCurriculumForLanguage("typescript");
  assert.ok(graph.nodes.length > 0, "typescript graph should have nodes");
  for (const node of graph.nodes) {
    assert.equal(node.language, "typescript", `Node ${node.id} should have language=typescript`);
  }
});

test("getCurriculumForLanguage: typescript graph contains no rust nodes", () => {
  const graph = getCurriculumForLanguage("typescript");
  const rustNode = graph.nodes.find((n) => n.language === "rust");
  assert.equal(rustNode, undefined, "typescript graph should contain no rust nodes");
});

test("getCurriculumForLanguage: typescript graph contains no c nodes", () => {
  const graph = getCurriculumForLanguage("typescript");
  const cNode = graph.nodes.find((n) => n.language === "c");
  assert.equal(cNode, undefined, "typescript graph should contain no c nodes");
});

// ---------------------------------------------------------------------------
// Entry points — each track has an accessible first node
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: TF01 exists in typescript curriculum", () => {
  const graph = getCurriculumForLanguage("typescript");
  const tf01 = graph.byId.get("TF01");
  assert.ok(tf01, "TF01 should exist in typescript curriculum");
});

test("getCurriculumForLanguage: TF01 has no prerequisites", () => {
  const graph = getCurriculumForLanguage("typescript");
  const tf01 = graph.byId.get("TF01");
  assert.ok(tf01, "TF01 should exist");
  assert.deepEqual(tf01.prerequisites, [], "TF01 should have no prerequisites");
});

test("getCurriculumForLanguage: TN01 exists in typescript curriculum", () => {
  const graph = getCurriculumForLanguage("typescript");
  assert.ok(graph.byId.get("TN01"), "TN01 should exist");
});

test("getCurriculumForLanguage: TL01 exists in typescript curriculum", () => {
  const graph = getCurriculumForLanguage("typescript");
  assert.ok(graph.byId.get("TL01"), "TL01 should exist");
});

// ---------------------------------------------------------------------------
// Node count and track coverage
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: typescript curriculum has 112 nodes", () => {
  const graph = getCurriculumForLanguage("typescript");
  assert.equal(
    graph.nodes.length,
    112,
    `Expected 112 typescript nodes, got ${graph.nodes.length}`
  );
});

test("getCurriculumForLanguage: typescript curriculum has exactly 9 tracks", () => {
  const graph = getCurriculumForLanguage("typescript");
  const trackCount = Object.keys(graph.tracks).length;
  assert.equal(trackCount, 9, `Expected 9 tracks, got ${trackCount}`);
});

test("getCurriculumForLanguage: all 9 expected tracks are present", () => {
  const graph = getCurriculumForLanguage("typescript");
  const expectedTracks = [
    "ts-foundations",
    "ts-narrowing",
    "ts-generics",
    "ts-variance",
    "ts-advanced-types",
    "ts-type-challenges",
    "ts-runtime-bridges",
    "ts-performance",
    "ts-declarations",
  ];
  for (const trackId of expectedTracks) {
    assert.ok(graph.tracks[trackId], `Track ${trackId} should exist`);
  }
});

test("getCurriculumForLanguage: ts-foundations track has 6 nodes", () => {
  const graph = getCurriculumForLanguage("typescript");
  const track = graph.tracks["ts-foundations"];
  assert.ok(track, "ts-foundations track should exist");
  assert.equal(track.nodeIds.length, 6, `Expected 6 foundation nodes, got ${track.nodeIds.length}`);
});

test("getCurriculumForLanguage: ts-type-challenges track has 22 nodes", () => {
  const graph = getCurriculumForLanguage("typescript");
  const track = graph.tracks["ts-type-challenges"];
  assert.ok(track, "ts-type-challenges track should exist");
  assert.equal(track.nodeIds.length, 22, `Expected 22 challenge nodes, got ${track.nodeIds.length}`);
});

// ---------------------------------------------------------------------------
// Node structural validity
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all typescript nodes have misconceptionTags", () => {
  const graph = getCurriculumForLanguage("typescript");
  const missing = graph.nodes.filter(
    (n) => !n.misconceptionTags || n.misconceptionTags.length === 0
  );
  assert.deepEqual(
    missing.map((n) => n.id),
    [],
    `Nodes missing misconceptionTags: ${missing.map((n) => n.id).join(", ")}`
  );
});

test("getCurriculumForLanguage: all typescript nodes have keywords", () => {
  const graph = getCurriculumForLanguage("typescript");
  const missing = graph.nodes.filter((n) => !n.keywords || n.keywords.length === 0);
  assert.deepEqual(
    missing.map((n) => n.id),
    [],
    `Nodes missing keywords: ${missing.map((n) => n.id).join(", ")}`
  );
});

test("getCurriculumForLanguage: all typescript nodes have a depthTarget", () => {
  const graph = getCurriculumForLanguage("typescript");
  const missing = graph.nodes.filter((n) => !n.depthTarget);
  assert.deepEqual(
    missing.map((n) => n.id),
    [],
    `Nodes missing depthTarget: ${missing.map((n) => n.id).join(", ")}`
  );
});

test("getCurriculumForLanguage: all typescript node IDs are unique", () => {
  const graph = getCurriculumForLanguage("typescript");
  const seen = new Set();
  const duplicates = [];
  for (const node of graph.nodes) {
    if (seen.has(node.id)) duplicates.push(node.id);
    seen.add(node.id);
  }
  assert.deepEqual(duplicates, [], `Duplicate node IDs: ${duplicates.join(", ")}`);
});

test("getCurriculumForLanguage: each node belongs to exactly one track", () => {
  const graph = getCurriculumForLanguage("typescript");
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
// Prerequisite graph integrity
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all typescript prerequisite IDs resolve to existing typescript nodes", () => {
  const graph = getCurriculumForLanguage("typescript");
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const dangling = [];
  for (const node of graph.nodes) {
    for (const prereqId of node.prerequisites) {
      if (!nodeIds.has(prereqId)) {
        dangling.push(`${node.id} references unknown prereq ${prereqId}`);
      }
    }
  }
  assert.deepEqual(dangling, [], `Dangling prerequisites: ${dangling.join(", ")}`);
});

test("getCurriculumForLanguage: typescript prerequisite graph has no cycles", () => {
  const graph = getCurriculumForLanguage("typescript");
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
    if (hasCycle(node.id)) {
      cycles.push(node.id);
    }
  }
  assert.deepEqual(cycles, [], `Cycle detected involving nodes: ${cycles.join(", ")}`);
});

// ---------------------------------------------------------------------------
// Language registry
// ---------------------------------------------------------------------------

test("getAvailableLanguages: includes typescript", () => {
  const langs = getAvailableLanguages();
  assert.ok(langs.includes("typescript"), "should include typescript");
});

test("getLanguageConfig: typescript config returns without throwing", () => {
  assert.doesNotThrow(() => {
    const config = getLanguageConfig("typescript");
    assert.equal(config.name, "TypeScript");
    assert.deepEqual(config.testCommand, ["sh", "run-tests.sh"]);
    assert.equal(config.sourceDir, "src");
    assert.equal(config.testsDir, "tests");
  });
});

test("getLanguageConfig: typescript config has all 6 stage instructions", () => {
  const config = getLanguageConfig("typescript");
  const requiredStages = ["scaffold", "starter-expand", "test-expand", "lesson-expand", "coach", "reviewer"];
  for (const stage of requiredStages) {
    assert.ok(
      config.stageInstructions[stage],
      `typescript stageInstructions should have ${stage}`
    );
    assert.ok(
      config.stageInstructions[stage].length > 50,
      `typescript ${stage} instruction should be non-trivial`
    );
  }
});

test("getLanguageConfig: typescript coach instruction mentions type-theory vocabulary", () => {
  const config = getLanguageConfig("typescript");
  const coach = config.stageInstructions["coach"];
  assert.ok(coach.includes("distributiv"), "coach should mention distributivity");
  assert.ok(coach.includes("variance"), "coach should mention variance");
  assert.ok(coach.includes("NOT paraphrase"), "coach should instruct not to paraphrase tsc errors");
});

test("getLanguageConfig: typescript writeProjectConfig is a function", () => {
  const config = getLanguageConfig("typescript");
  assert.equal(typeof config.writeProjectConfig, "function");
});

// ---------------------------------------------------------------------------
// Existing languages unaffected
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: rust curriculum is unaffected by typescript addition", () => {
  const rustGraph = getCurriculumForLanguage("rust");
  assert.ok(rustGraph.nodes.length > 0, "rust curriculum should still have nodes");
  for (const node of rustGraph.nodes) {
    assert.equal(node.language, "rust", `Node ${node.id} should have language=rust`);
  }
});

test("getLanguageConfig: rust config is unaffected by typescript addition", () => {
  assert.doesNotThrow(() => {
    const config = getLanguageConfig("rust");
    assert.equal(config.name, "Rust");
  });
});
