import test from "node:test";
import assert from "node:assert/strict";
import { allCurricula, getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";

// ---------------------------------------------------------------------------
// Identify toolchain nodes by two-letter X-prefix (XL, XP, XA, XD, XR, XT, XM, XN, XG, XS)
// Excludes legacy X100/X101 (single-letter X prefix in existing Rust core)
// ---------------------------------------------------------------------------

const TOOLCHAIN_PREFIXES = ["XL", "XP", "XA", "XD", "XR", "XT", "XM", "XN", "XG", "XS"];

function getToolchainNodes() {
  return allCurricula.nodes.filter((n) =>
    TOOLCHAIN_PREFIXES.some((prefix) => n.id.startsWith(prefix))
  );
}

// ---------------------------------------------------------------------------
// All toolchain nodes use language: "rust"
// ---------------------------------------------------------------------------

test("JS toolchain nodes: all use language='rust'", () => {
  const nodes = getToolchainNodes();
  assert.ok(nodes.length > 0, "should have JS toolchain nodes");
  for (const node of nodes) {
    assert.equal(node.language, "rust", `Node ${node.id} should have language=rust`);
  }
});

// ---------------------------------------------------------------------------
// Total node count
// ---------------------------------------------------------------------------

test("JS toolchain curriculum has exactly 70 nodes", () => {
  const nodes = getToolchainNodes();
  // XL(7)+XP(8)+XA(8)+XD(6)+XR(7)+XT(7)+XM(7)+XN(6)+XG(7)+XS(7) = 70
  assert.equal(
    nodes.length,
    70,
    `Expected 70 JS toolchain nodes, got ${nodes.length}`
  );
});

// ---------------------------------------------------------------------------
// All 10 tracks are present
// ---------------------------------------------------------------------------

test("JS toolchain: all 10 tracks are present", () => {
  const expectedTracks = [
    "js-lexer",
    "js-parser",
    "js-ast-semantics",
    "js-diagnostics",
    "js-lint-rules",
    "js-transformer",
    "js-minifier",
    "js-module-resolution",
    "js-codegen",
    "js-sourcemaps"
  ];
  for (const trackId of expectedTracks) {
    assert.ok(allCurricula.tracks[trackId], `Track ${trackId} should exist`);
  }
});

// ---------------------------------------------------------------------------
// Track node counts
// ---------------------------------------------------------------------------

test("js-lexer has 7 nodes (XL01–XL07)", () => {
  const track = allCurricula.tracks["js-lexer"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-parser has 8 nodes (XP01–XP08)", () => {
  const track = allCurricula.tracks["js-parser"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("js-ast-semantics has 8 nodes (XA01–XA08)", () => {
  const track = allCurricula.tracks["js-ast-semantics"];
  assert.equal(track.nodeIds.length, 8, `Expected 8, got ${track.nodeIds.length}`);
});

test("js-diagnostics has 6 nodes (XD01–XD06)", () => {
  const track = allCurricula.tracks["js-diagnostics"];
  assert.equal(track.nodeIds.length, 6, `Expected 6, got ${track.nodeIds.length}`);
});

test("js-lint-rules has 7 nodes (XR01–XR07)", () => {
  const track = allCurricula.tracks["js-lint-rules"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-transformer has 7 nodes (XT01–XT07)", () => {
  const track = allCurricula.tracks["js-transformer"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-minifier has 7 nodes (XM01–XM07)", () => {
  const track = allCurricula.tracks["js-minifier"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-module-resolution has 6 nodes (XN01–XN06)", () => {
  const track = allCurricula.tracks["js-module-resolution"];
  assert.equal(track.nodeIds.length, 6, `Expected 6, got ${track.nodeIds.length}`);
});

test("js-codegen has 7 nodes (XG01–XG07)", () => {
  const track = allCurricula.tracks["js-codegen"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

test("js-sourcemaps has 7 nodes (XS01–XS07)", () => {
  const track = allCurricula.tracks["js-sourcemaps"];
  assert.equal(track.nodeIds.length, 7, `Expected 7, got ${track.nodeIds.length}`);
});

// ---------------------------------------------------------------------------
// Cross-track prerequisite spot checks (toolchain → Rust core)
// ---------------------------------------------------------------------------

test("XL01 has S100 as a prerequisite", () => {
  const node = allCurricula.byId.get("XL01");
  assert.ok(node, "XL01 should exist");
  assert.ok(node.prerequisites.includes("S100"), "XL01 should require S100");
});

test("XL01 has A200 as a prerequisite", () => {
  const node = allCurricula.byId.get("XL01");
  assert.ok(node, "XL01 should exist");
  assert.ok(node.prerequisites.includes("A200"), "XL01 should require A200");
});

test("XA01 has B100 as a prerequisite", () => {
  const node = allCurricula.byId.get("XA01");
  assert.ok(node, "XA01 should exist");
  assert.ok(node.prerequisites.includes("B100"), "XA01 should require B100");
});

test("XA03 has G100 as a prerequisite", () => {
  const node = allCurricula.byId.get("XA03");
  assert.ok(node, "XA03 should exist");
  assert.ok(node.prerequisites.includes("G100"), "XA03 should require G100");
});

test("XR01 has G101 as a prerequisite", () => {
  const node = allCurricula.byId.get("XR01");
  assert.ok(node, "XR01 should exist");
  assert.ok(node.prerequisites.includes("G101"), "XR01 should require G101");
});

test("XR07 has C100 as a prerequisite", () => {
  const node = allCurricula.byId.get("XR07");
  assert.ok(node, "XR07 should exist");
  assert.ok(node.prerequisites.includes("C100"), "XR07 should require C100");
});

test("XT06 has A700 as a prerequisite", () => {
  const node = allCurricula.byId.get("XT06");
  assert.ok(node, "XT06 should exist");
  assert.ok(node.prerequisites.includes("A700"), "XT06 should require A700");
});

test("XN02 has A700 as a prerequisite", () => {
  const node = allCurricula.byId.get("XN02");
  assert.ok(node, "XN02 should exist");
  assert.ok(node.prerequisites.includes("A700"), "XN02 should require A700");
});

// ---------------------------------------------------------------------------
// All toolchain prerequisite IDs resolve in allCurricula
// ---------------------------------------------------------------------------

test("all JS toolchain prerequisite IDs resolve in allCurricula", () => {
  const nodes = getToolchainNodes();
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
// getCurriculumForLanguage("rust") includes core + toolchain
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage('rust') returns core + toolchain nodes (120 total)", () => {
  const graph = getCurriculumForLanguage("rust");
  // Rust core: 50 nodes (S1xx+A2xx+A5xx+X1xx+A7xx+B1xx+C1xx+M1xx+G1xx)
  // JS toolchain: 70 nodes (XL+XP+XA+XD+XR+XT+XM+XN+XG+XS)
  // Total: 120
  assert.equal(
    graph.nodes.length,
    120,
    `Expected 120 rust nodes (core + toolchain), got ${graph.nodes.length}`
  );
});
