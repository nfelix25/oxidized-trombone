import test from "node:test";
import assert from "node:assert/strict";
import { getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";
import { getAvailableLanguages, getLanguageConfig } from "../src/config/languages.js";

// ---------------------------------------------------------------------------
// Zig curriculum language isolation
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: zig graph contains only zig nodes", () => {
  const zigGraph = getCurriculumForLanguage("zig");
  const nodeList = zigGraph.nodes;
  assert.ok(nodeList.length > 0, "zig graph should have nodes");
  for (const node of nodeList) {
    assert.equal(node.language, "zig", `Node ${node.id} should have language=zig`);
  }
});

test("getCurriculumForLanguage: zig graph contains no rust nodes", () => {
  const zigGraph = getCurriculumForLanguage("zig");
  const rustNode = zigGraph.nodes.find((n) => n.language === "rust");
  assert.equal(rustNode, undefined, "zig graph should contain no language=rust nodes");
});

test("getCurriculumForLanguage: zig graph contains no c nodes", () => {
  const zigGraph = getCurriculumForLanguage("zig");
  const cNode = zigGraph.nodes.find((n) => n.language === "c");
  assert.equal(cNode, undefined, "zig graph should contain no language=c nodes");
});

// ---------------------------------------------------------------------------
// Zig entry point
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: ZF01 exists in zig curriculum", () => {
  const zigGraph = getCurriculumForLanguage("zig");
  const zf01 = zigGraph.byId.get("ZF01");
  assert.ok(zf01, "ZF01 should exist in zig curriculum");
});

test("getCurriculumForLanguage: ZF01 has no prerequisites", () => {
  const zigGraph = getCurriculumForLanguage("zig");
  const zf01 = zigGraph.byId.get("ZF01");
  assert.ok(zf01, "ZF01 should exist");
  assert.deepEqual(zf01.prerequisites, [], "ZF01 should have no prerequisites");
});

// ---------------------------------------------------------------------------
// Zig node count
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: zig curriculum has exactly 102 nodes", () => {
  const zigGraph = getCurriculumForLanguage("zig");
  assert.equal(
    zigGraph.nodes.length,
    102,
    `Expected 102 zig nodes, got ${zigGraph.nodes.length}`
  );
});

// ---------------------------------------------------------------------------
// Internal consistency: all prerequisite IDs resolve to existing zig nodes
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all zig prerequisite IDs resolve to existing zig nodes", () => {
  const zigGraph = getCurriculumForLanguage("zig");
  const nodeIds = new Set(zigGraph.nodes.map((n) => n.id));
  const dangling = [];
  for (const node of zigGraph.nodes) {
    for (const prereqId of node.prerequisites) {
      if (!nodeIds.has(prereqId)) {
        dangling.push(`${node.id} references unknown prereq ${prereqId}`);
      }
    }
  }
  assert.deepEqual(dangling, [], `Dangling prerequisites found: ${dangling.join(", ")}`);
});

// ---------------------------------------------------------------------------
// Language registry
// ---------------------------------------------------------------------------

test("getAvailableLanguages: includes zig", () => {
  const langs = getAvailableLanguages();
  assert.ok(Array.isArray(langs), "should return an array");
  assert.ok(langs.includes("zig"), "should include zig");
});

test("getLanguageConfig: zig config returns without throwing", () => {
  assert.doesNotThrow(() => {
    const config = getLanguageConfig("zig");
    assert.equal(config.name, "Zig", "config.name should be Zig");
    assert.deepEqual(config.testCommand, ["zig", "build", "test"]);
    assert.equal(config.sourceDir, "src");
    assert.equal(config.testsDir, "tests");
  });
});

test("getAvailableLanguages: returns rust, c, and zig", () => {
  const langs = getAvailableLanguages();
  assert.ok(langs.includes("rust"), "should include rust");
  assert.ok(langs.includes("c"), "should include c");
  assert.ok(langs.includes("zig"), "should include zig");
});
