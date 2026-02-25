import test from "node:test";
import assert from "node:assert/strict";
import { getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";
import { getAvailableLanguages, getLanguageConfig } from "../src/config/languages.js";

// ---------------------------------------------------------------------------
// Python curriculum language isolation
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: python graph contains only python nodes", () => {
  const graph = getCurriculumForLanguage("python");
  assert.ok(graph.nodes.length > 0, "python graph should have nodes");
  for (const node of graph.nodes) {
    assert.equal(node.language, "python", `Node ${node.id} should have language=python`);
  }
});

test("getCurriculumForLanguage: python graph contains no rust nodes", () => {
  const graph = getCurriculumForLanguage("python");
  const rustNode = graph.nodes.find((n) => n.language === "rust");
  assert.equal(rustNode, undefined, "python graph should contain no rust nodes");
});

test("getCurriculumForLanguage: python graph contains no c nodes", () => {
  const graph = getCurriculumForLanguage("python");
  const cNode = graph.nodes.find((n) => n.language === "c");
  assert.equal(cNode, undefined, "python graph should contain no c nodes");
});

test("getCurriculumForLanguage: python graph contains no zig nodes", () => {
  const graph = getCurriculumForLanguage("python");
  const zigNode = graph.nodes.find((n) => n.language === "zig");
  assert.equal(zigNode, undefined, "python graph should contain no zig nodes");
});

// ---------------------------------------------------------------------------
// Python entry point
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: PF01 exists in python curriculum", () => {
  const graph = getCurriculumForLanguage("python");
  const pf01 = graph.byId.get("PF01");
  assert.ok(pf01, "PF01 should exist in python curriculum");
});

test("getCurriculumForLanguage: PF01 has no prerequisites", () => {
  const graph = getCurriculumForLanguage("python");
  const pf01 = graph.byId.get("PF01");
  assert.ok(pf01, "PF01 should exist");
  assert.deepEqual(pf01.prerequisites, [], "PF01 should have no prerequisites");
});

// ---------------------------------------------------------------------------
// Python node count
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: python curriculum has the expected number of nodes", () => {
  const graph = getCurriculumForLanguage("python");
  // 13 tracks: PF(10)+PD(8)+PO(9)+PI(6)+PE(6)+PT(7)+PM(5)+PA(8)+PX(5)+PS(7)+PK(6)+PB(5)+PH(5) = 87
  assert.equal(
    graph.nodes.length,
    87,
    `Expected 87 python nodes, got ${graph.nodes.length}`
  );
});

// ---------------------------------------------------------------------------
// Internal consistency: all prerequisite IDs resolve to existing python nodes
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all python prerequisite IDs resolve to existing python nodes", () => {
  const graph = getCurriculumForLanguage("python");
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

// ---------------------------------------------------------------------------
// Language registry
// ---------------------------------------------------------------------------

test("getAvailableLanguages: includes python", () => {
  const langs = getAvailableLanguages();
  assert.ok(langs.includes("python"), "should include python");
});

test("getLanguageConfig: python config returns without throwing", () => {
  assert.doesNotThrow(() => {
    const config = getLanguageConfig("python");
    assert.equal(config.name, "Python");
    assert.deepEqual(config.testCommand, ["python", "-m", "pytest"]);
    assert.equal(config.sourceDir, "src");
    assert.equal(config.testsDir, "tests");
  });
});
