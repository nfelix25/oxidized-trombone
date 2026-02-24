import test from "node:test";
import assert from "node:assert/strict";
import { runA203SeedFlow } from "../src/seed/a203Flow.js";

test("seed A203 flow returns progression artifacts", async () => {
  const result = await runA203SeedFlow(".state/test_seed_a203");
  assert.ok(result.eligibleBefore.includes("A203"));
  assert.ok(result.customTopic.mappedNodeIds.includes("A203"));
  assert.equal(result.persistedAttempt.latestReview.passFail, "FAIL");
});
