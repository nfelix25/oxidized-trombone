import test from "node:test";
import assert from "node:assert/strict";
import { seedCurriculum } from "../src/curriculum/seed.js";
import { mapCustomTopic, prerequisiteGapReport } from "../src/curriculum/selectors.js";

test("custom topic: exact match returns mapped nodes", () => {
  const mapping = mapCustomTopic(seedCurriculum, "mutable references aliasing", {});
  assert.ok(mapping.mappedNodeIds.length > 0, "should map to at least one node");
  assert.ok(mapping.mappedNodeIds.includes("A203"), "should map to A203");
});

test("custom topic: no match returns explicit empty result", () => {
  const mapping = mapCustomTopic(seedCurriculum, "python generators coroutines", {});
  assert.equal(mapping.mappedNodeIds.length, 0, "should have no mapped nodes");
  assert.deepEqual(mapping.prerequisiteGaps, [], "should have no prerequisite gaps");
  assert.equal(mapping.topic, "python generators coroutines");
});

test("custom topic: prerequisite gap report identifies unmet prerequisites", () => {
  // A203 requires A200 and A202
  const masteryByNode = { A200: 3 }; // A202 not mastered
  const mapping = mapCustomTopic(seedCurriculum, "mutable aliasing", masteryByNode);

  const gaps = prerequisiteGapReport(mapping);
  const a203Gap = gaps.find((g) => g.nodeId === "A203");
  if (a203Gap) {
    assert.ok(a203Gap.missingPrerequisites.includes("A202"), "A203 gap should report A202 as missing");
  }
});

test("custom topic: mastered prerequisites result in no gaps", () => {
  const masteryByNode = { A200: 3, A202: 3, A203: 3 };
  const mapping = mapCustomTopic(seedCurriculum, "mutable aliasing", masteryByNode);
  const gaps = prerequisiteGapReport(mapping);
  const a203Gap = gaps.find((g) => g.nodeId === "A203");
  if (a203Gap) {
    assert.equal(a203Gap.missingPrerequisites.length, 0, "A203 should have no gaps when prerequisites are mastered");
  }
});

test("custom topic: async keyword maps to async track nodes", () => {
  const mapping = mapCustomTopic(seedCurriculum, "async await ownership", {});
  assert.ok(mapping.mappedNodeIds.length > 0, "should map to async nodes");
  const hasAsyncNode = mapping.mappedNodeIds.some((id) => id.startsWith("A7"));
  assert.ok(hasAsyncNode, "should include at least one A7xx async node");
});

test("custom topic: iterator keyword maps to collections nodes", () => {
  const mapping = mapCustomTopic(seedCurriculum, "iterator into_iter", {});
  assert.ok(mapping.mappedNodeIds.length > 0, "should map to iterator nodes");
  assert.ok(mapping.mappedNodeIds.includes("A503"), "should map to A503 iterator ownership modes");
});
