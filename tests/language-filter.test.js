import test from "node:test";
import assert from "node:assert/strict";
import { getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";
import { getAvailableLanguages } from "../src/config/languages.js";

// ---------------------------------------------------------------------------
// getCurriculumForLanguage
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: rust graph contains only rust nodes", () => {
  const rustGraph = getCurriculumForLanguage("rust");
  const nodeList = rustGraph.nodes;
  assert.ok(nodeList.length > 0, "rust graph should have nodes");
  for (const node of nodeList) {
    assert.equal(node.language, "rust", `Node ${node.id} should have language=rust`);
  }
});

test("getCurriculumForLanguage: rust graph contains no nodes with language=c", () => {
  const rustGraph = getCurriculumForLanguage("rust");
  const cNode = rustGraph.nodes.find((n) => n.language === "c");
  assert.equal(cNode, undefined, "rust graph should contain no language=c nodes");
});

test("getCurriculumForLanguage: c graph contains only c nodes", () => {
  const cGraph = getCurriculumForLanguage("c");
  const nodeList = cGraph.nodes;
  assert.ok(nodeList.length > 0, "c graph should have nodes");
  for (const node of nodeList) {
    assert.equal(node.language, "c", `Node ${node.id} should have language=c`);
  }
});

test("getCurriculumForLanguage: c graph contains no rust nodes", () => {
  const cGraph = getCurriculumForLanguage("c");
  const rustNode = cGraph.nodes.find((n) => n.language === "rust");
  assert.equal(rustNode, undefined, "c graph should contain no rust nodes");
});

test("getCurriculumForLanguage: rust tracks have no cross-language node IDs", () => {
  const rustGraph = getCurriculumForLanguage("rust");
  const rustNodeIds = new Set(rustGraph.nodes.map((n) => n.id));
  for (const track of Object.values(rustGraph.tracks)) {
    for (const nodeId of track.nodeIds) {
      assert.ok(rustNodeIds.has(nodeId), `Track ${track.id} has nodeId ${nodeId} not in rust nodes`);
    }
  }
});

test("getCurriculumForLanguage: unknown lang returns empty graph", () => {
  const unknownGraph = getCurriculumForLanguage("unknown-language-xyz");
  assert.equal(unknownGraph.nodes.length, 0, "unknown graph should have no nodes");
  assert.equal(Object.keys(unknownGraph.tracks).length, 0, "unknown graph should have no tracks");
});

test("getCurriculumForLanguage: byId map is consistent with filtered nodes", () => {
  const cGraph = getCurriculumForLanguage("c");
  for (const node of cGraph.nodes) {
    assert.ok(cGraph.byId.has(node.id), `byId should contain ${node.id}`);
  }
});

// ---------------------------------------------------------------------------
// getAvailableLanguages
// ---------------------------------------------------------------------------

test("getAvailableLanguages: returns array containing rust and c", () => {
  const langs = getAvailableLanguages();
  assert.ok(Array.isArray(langs), "should return an array");
  assert.ok(langs.includes("rust"), "should include rust");
  assert.ok(langs.includes("c"), "should include c");
});

test("getAvailableLanguages: returns at least two languages", () => {
  const langs = getAvailableLanguages();
  assert.ok(langs.length >= 2, "should have at least two languages");
});
