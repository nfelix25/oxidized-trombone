import test from "node:test";
import assert from "node:assert/strict";
import { getCurriculumForLanguage } from "../src/curriculum/allCurricula.js";
import { getAvailableLanguages } from "../src/config/languages.js";

// ---------------------------------------------------------------------------
// Language isolation
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: c graph contains only c nodes", () => {
  const graph = getCurriculumForLanguage("c");
  assert.ok(graph.nodes.length > 0, "c graph should have nodes");
  for (const node of graph.nodes) {
    assert.equal(node.language, "c", `Node ${node.id} should have language=c`);
  }
});

test("getCurriculumForLanguage: c graph contains no rust nodes", () => {
  const graph = getCurriculumForLanguage("c");
  const rustNode = graph.nodes.find((n) => n.language === "rust");
  assert.equal(rustNode, undefined, "c graph should contain no rust nodes");
});

// ---------------------------------------------------------------------------
// Node count
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: c language graph has the expected number of nodes", () => {
  const graph = getCurriculumForLanguage("c");
  // All language="c" nodes: C systems (45) + JS runtime (70) = 115
  // C systems: c-pointers(3) + c-ipc(4) + c-signals(2) + c-concurrency(3) + c-networking(3)
  //   + c-virtual-memory(7) + c-filesystem(5) + c-kqueue-io(7) + c-advanced-concurrency(4)
  //   + c-dynamic-linking(4) + c-subprocess-signals(3) = 45
  // JS runtime: JL(9)+JB(6)+JV(8)+JO(7)+JG(8)+JE(8)+JP(6)+JC(5)+JT(7)+JR(6) = 70
  assert.equal(
    graph.nodes.length,
    115,
    `Expected 115 c-language nodes, got ${graph.nodes.length}`
  );
});

// ---------------------------------------------------------------------------
// New tracks are present
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: c-virtual-memory track exists with 7 nodes", () => {
  const graph = getCurriculumForLanguage("c");
  const vmNodes = graph.nodes.filter((n) => n.track === "c-virtual-memory");
  assert.equal(vmNodes.length, 7, `Expected 7 c-virtual-memory nodes, got ${vmNodes.length}`);
  const ids = new Set(vmNodes.map((n) => n.id));
  for (const expected of ["C300", "C301", "C302", "C303", "C304", "C305", "C306"]) {
    assert.ok(ids.has(expected), `Missing node ${expected}`);
  }
});

test("getCurriculumForLanguage: c-filesystem track exists with 5 nodes", () => {
  const graph = getCurriculumForLanguage("c");
  const fsNodes = graph.nodes.filter((n) => n.track === "c-filesystem");
  assert.equal(fsNodes.length, 5, `Expected 5 c-filesystem nodes, got ${fsNodes.length}`);
  const ids = new Set(fsNodes.map((n) => n.id));
  for (const expected of ["C400", "C401", "C402", "C403", "C404"]) {
    assert.ok(ids.has(expected), `Missing node ${expected}`);
  }
});

test("getCurriculumForLanguage: c-kqueue-io track exists with 7 nodes", () => {
  const graph = getCurriculumForLanguage("c");
  const kqNodes = graph.nodes.filter((n) => n.track === "c-kqueue-io");
  assert.equal(kqNodes.length, 7, `Expected 7 c-kqueue-io nodes, got ${kqNodes.length}`);
  const ids = new Set(kqNodes.map((n) => n.id));
  for (const expected of ["C500", "C501", "C502", "C503", "C504", "C505", "C506"]) {
    assert.ok(ids.has(expected), `Missing node ${expected}`);
  }
});

test("getCurriculumForLanguage: c-advanced-concurrency track exists with 4 nodes", () => {
  const graph = getCurriculumForLanguage("c");
  const acNodes = graph.nodes.filter((n) => n.track === "c-advanced-concurrency");
  assert.equal(acNodes.length, 4, `Expected 4 c-advanced-concurrency nodes, got ${acNodes.length}`);
  const ids = new Set(acNodes.map((n) => n.id));
  for (const expected of ["C600", "C601", "C602", "C603"]) {
    assert.ok(ids.has(expected), `Missing node ${expected}`);
  }
});

test("getCurriculumForLanguage: c-dynamic-linking track exists with 4 nodes", () => {
  const graph = getCurriculumForLanguage("c");
  const dlNodes = graph.nodes.filter((n) => n.track === "c-dynamic-linking");
  assert.equal(dlNodes.length, 4, `Expected 4 c-dynamic-linking nodes, got ${dlNodes.length}`);
  const ids = new Set(dlNodes.map((n) => n.id));
  for (const expected of ["C700", "C701", "C702", "C703"]) {
    assert.ok(ids.has(expected), `Missing node ${expected}`);
  }
});

test("getCurriculumForLanguage: c-subprocess-signals track exists with 3 nodes", () => {
  const graph = getCurriculumForLanguage("c");
  const ssNodes = graph.nodes.filter((n) => n.track === "c-subprocess-signals");
  assert.equal(ssNodes.length, 3, `Expected 3 c-subprocess-signals nodes, got ${ssNodes.length}`);
  const ids = new Set(ssNodes.map((n) => n.id));
  for (const expected of ["C800", "C801", "C802"]) {
    assert.ok(ids.has(expected), `Missing node ${expected}`);
  }
});

// ---------------------------------------------------------------------------
// C241 fix: no epoll
// ---------------------------------------------------------------------------

test("C241 does not reference epoll in keywords", () => {
  const graph = getCurriculumForLanguage("c");
  const c241 = graph.byId.get("C241");
  assert.ok(c241, "C241 should exist");
  const hasEpoll = c241.keywords.some((k) => k.toLowerCase().includes("epoll"));
  assert.equal(hasEpoll, false, "C241 keywords should not include epoll (Linux-only)");
});

test("C241 title does not mention epoll", () => {
  const graph = getCurriculumForLanguage("c");
  const c241 = graph.byId.get("C241");
  assert.ok(c241, "C241 should exist");
  assert.ok(!c241.title.toLowerCase().includes("epoll"), "C241 title should not mention epoll");
});

// ---------------------------------------------------------------------------
// Internal consistency: all prereq IDs resolve
// ---------------------------------------------------------------------------

test("getCurriculumForLanguage: all c prerequisite IDs resolve to existing c nodes", () => {
  const graph = getCurriculumForLanguage("c");
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
// Key cross-track prerequisite nodes exist (needed by JS runtime curriculum)
// ---------------------------------------------------------------------------

test("JS runtime prerequisite nodes exist: C302, C303, C501, C502, C600, C602, C703", () => {
  const graph = getCurriculumForLanguage("c");
  const required = ["C302", "C303", "C501", "C502", "C600", "C602", "C703"];
  for (const id of required) {
    assert.ok(graph.byId.get(id), `Node ${id} should exist (required by JS runtime curriculum)`);
  }
});

// ---------------------------------------------------------------------------
// Language registry
// ---------------------------------------------------------------------------

test("getAvailableLanguages: includes c", () => {
  const langs = getAvailableLanguages();
  assert.ok(langs.includes("c"), "should include c");
});
