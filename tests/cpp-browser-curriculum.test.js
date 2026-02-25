import test from "node:test";
import assert from "node:assert/strict";
import { allCurricula, getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";

// ---------------------------------------------------------------------------
// All browser nodes use language: "cpp"
// ---------------------------------------------------------------------------

const B_PREFIXES = ["BF", "BL", "BV", "BN", "BA", "BP"];

function getBrowserNodes() {
  return allCurricula.nodes.filter((n) =>
    B_PREFIXES.some((prefix) => n.id.startsWith(prefix))
  );
}

test("browser curriculum nodes: all use language='cpp'", () => {
  const nodes = getBrowserNodes();
  assert.ok(nodes.length > 0, "should have browser curriculum nodes");
  for (const node of nodes) {
    assert.equal(node.language, "cpp", `Node ${node.id} should have language=cpp`);
  }
});

// ---------------------------------------------------------------------------
// Total node count
// ---------------------------------------------------------------------------

test("browser curriculum has exactly 48 nodes", () => {
  const nodes = getBrowserNodes();
  // BF(8)+BL(10)+BV(7)+BN(8)+BA(8)+BP(7) = 48
  assert.equal(
    nodes.length,
    48,
    `Expected 48 browser curriculum nodes, got ${nodes.length}`
  );
});

// ---------------------------------------------------------------------------
// All 6 tracks are present
// ---------------------------------------------------------------------------

test("browser curriculum: all 6 tracks are present", () => {
  const expectedTracks = [
    "chromium-foundations",
    "blink-rendering",
    "v8-embedding",
    "network-stack",
    "aura-ui",
    "process-model"
  ];
  for (const trackId of expectedTracks) {
    assert.ok(allCurricula.tracks[trackId], `Track ${trackId} should exist`);
  }
});

// ---------------------------------------------------------------------------
// Track node counts
// ---------------------------------------------------------------------------

test("chromium-foundations has 8 nodes (BF01–BF08)", () => {
  const track = allCurricula.tracks["chromium-foundations"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("blink-rendering has 10 nodes (BL01–BL10)", () => {
  const track = allCurricula.tracks["blink-rendering"];
  assert.equal(track.nodeIds.length, 10, `Expected 10, got ${track.nodeIds.length}`);
});

test("v8-embedding has 7 nodes (BV01–BV07)", () => {
  const track = allCurricula.tracks["v8-embedding"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("network-stack has 8 nodes (BN01–BN08)", () => {
  const track = allCurricula.tracks["network-stack"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("aura-ui has 8 nodes (BA01–BA08)", () => {
  const track = allCurricula.tracks["aura-ui"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("process-model has 7 nodes (BP01–BP07)", () => {
  const track = allCurricula.tracks["process-model"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

// ---------------------------------------------------------------------------
// Cross-track prerequisite spot checks (browser → C++ core)
// ---------------------------------------------------------------------------

test("BF01 has CC01 as a prerequisite", () => {
  const node = allCurricula.byId.get("BF01");
  assert.ok(node, "BF01 should exist");
  assert.ok(node.prerequisites.includes("CC01"), "BF01 should require CC01");
});

test("BF03 has CV02 as a prerequisite", () => {
  const node = allCurricula.byId.get("BF03");
  assert.ok(node, "BF03 should exist");
  assert.ok(node.prerequisites.includes("CV02"), "BF03 should require CV02");
});

test("BV01 has CT01 as a prerequisite", () => {
  const node = allCurricula.byId.get("BV01");
  assert.ok(node, "BV01 should exist");
  assert.ok(node.prerequisites.includes("CT01"), "BV01 should require CT01");
});

test("BV06 has CE01 as a prerequisite", () => {
  const node = allCurricula.byId.get("BV06");
  assert.ok(node, "BV06 should exist");
  assert.ok(node.prerequisites.includes("CE01"), "BV06 should require CE01");
});

test("BL07 has BV03 as a prerequisite", () => {
  const node = allCurricula.byId.get("BL07");
  assert.ok(node, "BL07 should exist");
  assert.ok(node.prerequisites.includes("BV03"), "BL07 should require BV03");
});

test("BP05 has BL01 as a prerequisite", () => {
  const node = allCurricula.byId.get("BP05");
  assert.ok(node, "BP05 should exist");
  assert.ok(node.prerequisites.includes("BL01"), "BP05 should require BL01");
});

test("BA04 has BL05 as a prerequisite", () => {
  const node = allCurricula.byId.get("BA04");
  assert.ok(node, "BA04 should exist");
  assert.ok(node.prerequisites.includes("BL05"), "BA04 should require BL05");
});

// ---------------------------------------------------------------------------
// All browser prerequisite IDs resolve in allCurricula
// ---------------------------------------------------------------------------

test("all browser curriculum prerequisite IDs resolve in allCurricula", () => {
  const nodes = getBrowserNodes();
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

// ---------------------------------------------------------------------------
// getCurriculumForLanguage("cpp") includes both core and browser nodes
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage('cpp') returns core + browser nodes (138 total)", () => {
  const graph = getCurriculumForLanguage("cpp");
  // C++ core: CF(10)+CP(9)+CM(8)+CV(7)+CS(9)+CT(8)+CK(7)+CE(6)+CO(5)+CC(8)+CW(6)+CB(7) = 90
  // Browser:  BF(8)+BL(10)+BV(7)+BN(8)+BA(8)+BP(7) = 48
  // Total: 138
  assert.equal(
    graph.nodes.length,
    138,
    `Expected 138 cpp nodes (core + browser), got ${graph.nodes.length}`
  );
});
