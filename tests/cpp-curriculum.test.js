import test from "node:test";
import assert from "node:assert/strict";
import { getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";
import { getAvailableLanguages, getLanguageConfig } from "../src/config/languages.js";

// ---------------------------------------------------------------------------
// C++ curriculum language isolation
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: cpp graph contains only cpp nodes", () => {
  const graph = getCurriculumForLanguage("cpp");
  assert.ok(graph.nodes.length > 0, "cpp graph should have nodes");
  for (const node of graph.nodes) {
    assert.equal(node.language, "cpp", `Node ${node.id} should have language=cpp`);
  }
});

test("getCurriculumForLanguage: cpp graph contains no rust nodes", () => {
  const graph = getCurriculumForLanguage("cpp");
  const rustNode = graph.nodes.find((n) => n.language === "rust");
  assert.equal(rustNode, undefined, "cpp graph should contain no rust nodes");
});

test("getCurriculumForLanguage: cpp graph contains no c nodes", () => {
  const graph = getCurriculumForLanguage("cpp");
  const cNode = graph.nodes.find((n) => n.language === "c");
  assert.equal(cNode, undefined, "cpp graph should contain no c nodes");
});

test("getCurriculumForLanguage: cpp graph contains no zig nodes", () => {
  const graph = getCurriculumForLanguage("cpp");
  const zigNode = graph.nodes.find((n) => n.language === "zig");
  assert.equal(zigNode, undefined, "cpp graph should contain no zig nodes");
});

test("getCurriculumForLanguage: cpp graph contains no python nodes", () => {
  const graph = getCurriculumForLanguage("cpp");
  const pyNode = graph.nodes.find((n) => n.language === "python");
  assert.equal(pyNode, undefined, "cpp graph should contain no python nodes");
});

// ---------------------------------------------------------------------------
// C++ entry point
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: CF01 exists in cpp curriculum", () => {
  const graph = getCurriculumForLanguage("cpp");
  const cf01 = graph.byId.get("CF01");
  assert.ok(cf01, "CF01 should exist in cpp curriculum");
});

test("getCurriculumForLanguage: CF01 has no prerequisites", () => {
  const graph = getCurriculumForLanguage("cpp");
  const cf01 = graph.byId.get("CF01");
  assert.ok(cf01, "CF01 should exist");
  assert.deepEqual(cf01.prerequisites, [], "CF01 should have no prerequisites");
});

// ---------------------------------------------------------------------------
// C++ node count
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: cpp curriculum has the expected number of nodes", () => {
  const graph = getCurriculumForLanguage("cpp");
  // 12 tracks: CF(10)+CP(9)+CM(8)+CV(7)+CS(9)+CT(8)+CK(7)+CE(6)+CO(5)+CC(8)+CW(6)+CB(7) = 90
  assert.equal(
    graph.nodes.length,
    90,
    `Expected 90 cpp nodes, got ${graph.nodes.length}`
  );
});

// ---------------------------------------------------------------------------
// Internal consistency: all prerequisite IDs resolve to existing cpp nodes
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all cpp prerequisite IDs resolve to existing cpp nodes", () => {
  const graph = getCurriculumForLanguage("cpp");
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

test("getAvailableLanguages: includes cpp", () => {
  const langs = getAvailableLanguages();
  assert.ok(langs.includes("cpp"), "should include cpp");
});

test("getLanguageConfig: cpp config returns without throwing", () => {
  assert.doesNotThrow(() => {
    const config = getLanguageConfig("cpp");
    assert.equal(config.name, "C++");
    assert.equal(config.sourceDir, "src");
    assert.equal(config.testsDir, "tests");
  });
});
