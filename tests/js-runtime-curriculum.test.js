import test from "node:test";
import assert from "node:assert/strict";
import { allCurricula } from "../src/curriculum/allCurricula.js";

// ---------------------------------------------------------------------------
// All JS runtime nodes use language: "c"
// ---------------------------------------------------------------------------

const JS_PREFIXES = ["JL", "JB", "JV", "JO", "JG", "JE", "JP", "JC", "JT", "JR"];

function getJsRuntimeNodes() {
  return allCurricula.nodes.filter((n) =>
    JS_PREFIXES.some((prefix) => n.id.startsWith(prefix))
  );
}

test("JS runtime nodes: all use language='c'", () => {
  const nodes = getJsRuntimeNodes();
  assert.ok(nodes.length > 0, "should have JS runtime nodes");
  for (const node of nodes) {
    assert.equal(node.language, "c", `Node ${node.id} should have language=c`);
  }
});

// ---------------------------------------------------------------------------
// Total node count
// ---------------------------------------------------------------------------

test("JS runtime curriculum has exactly 80 nodes", () => {
  const nodes = getJsRuntimeNodes();
  // JL(11)+JB(6)+JV(8)+JO(8)+JG(8)+JE(8)+JP(7)+JC(7)+JT(7)+JR(10) = 80
  assert.equal(
    nodes.length,
    80,
    `Expected 80 JS runtime nodes, got ${nodes.length}`
  );
});

// ---------------------------------------------------------------------------
// All 10 tracks are present
// ---------------------------------------------------------------------------

test("JS runtime: all 10 tracks are present", () => {
  const expectedTracks = [
    "js-language-frontend",
    "js-bytecode",
    "js-virtual-machine",
    "js-object-model",
    "js-garbage-collection",
    "js-event-loop",
    "js-promises-async",
    "js-closures-scope",
    "js-jit-optimization",
    "js-runtime-internals"
  ];
  for (const trackId of expectedTracks) {
    assert.ok(allCurricula.tracks[trackId], `Track ${trackId} should exist`);
  }
});

// ---------------------------------------------------------------------------
// Track node counts
// ---------------------------------------------------------------------------

test("js-language-frontend has 11 nodes (JL01–JL09 + JL06a/JL06b/JL06c)", () => {
  const track = allCurricula.tracks["js-language-frontend"];
  assert.equal(track.nodeIds.length, 11, `Expected 11, got ${track.nodeIds.length}`);
});

test("js-bytecode has 6 nodes (JB01–JB06)", () => {
  const track = allCurricula.tracks["js-bytecode"];
  assert.equal(track.nodeIds.length, 6, `Expected 6, got ${track.nodeIds.length}`);
});

test("js-virtual-machine has 8 nodes (JV01–JV08)", () => {
  const track = allCurricula.tracks["js-virtual-machine"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("js-object-model has 8 nodes (JO01–JO07b)", () => {
  const track = allCurricula.tracks["js-object-model"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("js-garbage-collection has 8 nodes (JG01–JG08)", () => {
  const track = allCurricula.tracks["js-garbage-collection"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("js-event-loop has 8 nodes (JE01–JE08)", () => {
  const track = allCurricula.tracks["js-event-loop"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("js-promises-async has 7 nodes (JP01–JP06 + JP03a/JP03b)", () => {
  const track = allCurricula.tracks["js-promises-async"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-closures-scope has 7 nodes (JC01–JC05 + JC04a/JC04b/JC04c)", () => {
  const track = allCurricula.tracks["js-closures-scope"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-jit-optimization has 7 nodes (JT01–JT07)", () => {
  const track = allCurricula.tracks["js-jit-optimization"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-runtime-internals has 10 nodes (JR01a–JR06 + JR01b/JR01c/JR03a/JR03b/JR03c)", () => {
  const track = allCurricula.tracks["js-runtime-internals"];
  assert.equal(track.nodeIds.length, 10, `Expected 10, got ${track.nodeIds.length}`);
});

// ---------------------------------------------------------------------------
// Cross-track prerequisite links resolve (JS runtime → C systems)
// ---------------------------------------------------------------------------

test("JE02 has C501 as a prerequisite", () => {
  const node = allCurricula.byId.get("JE02");
  assert.ok(node, "JE02 should exist");
  assert.ok(node.prerequisites.includes("C501"), "JE02 should require C501");
});

test("JE03 has C502 as a prerequisite", () => {
  const node = allCurricula.byId.get("JE03");
  assert.ok(node, "JE03 should exist");
  assert.ok(node.prerequisites.includes("C502"), "JE03 should require C502");
});

test("JE05 has C600 as a prerequisite", () => {
  const node = allCurricula.byId.get("JE05");
  assert.ok(node, "JE05 should exist");
  assert.ok(node.prerequisites.includes("C600"), "JE05 should require C600");
});

test("JG02 has C303 as a prerequisite", () => {
  const node = allCurricula.byId.get("JG02");
  assert.ok(node, "JG02 should exist");
  assert.ok(node.prerequisites.includes("C303"), "JG02 should require C303");
});

test("JG04 has C602 as a prerequisite", () => {
  const node = allCurricula.byId.get("JG04");
  assert.ok(node, "JG04 should exist");
  assert.ok(node.prerequisites.includes("C602"), "JG04 should require C602");
});

test("JT07 has C302 as a prerequisite", () => {
  const node = allCurricula.byId.get("JT07");
  assert.ok(node, "JT07 should exist");
  assert.ok(node.prerequisites.includes("C302"), "JT07 should require C302");
});

test("JR04 has C703 as a prerequisite", () => {
  const node = allCurricula.byId.get("JR04");
  assert.ok(node, "JR04 should exist");
  assert.ok(node.prerequisites.includes("C703"), "JR04 should require C703");
});

// ---------------------------------------------------------------------------
// All cross-track prereq IDs resolve in allCurricula
// ---------------------------------------------------------------------------

test("all JS runtime prerequisite IDs resolve in allCurricula", () => {
  const nodes = getJsRuntimeNodes();
  const allIds = new Set(allCurricula.nodes.map((n) => n.id));
  const dangling = [];
  for (const node of nodes) {
    for (const prereqId of node.prerequisites) {
      if (!allIds.has(prereqId)) {
        dangling.push(`${node.id} references unknown prereq ${prereqId}`);
      }
    }
  }
  assert.deepEqual(dangling, [], `Dangling prerequisites: ${dangling.join(", ")}`);
});
