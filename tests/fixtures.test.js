import test from "node:test";
import assert from "node:assert/strict";
import { runFixtureValidation } from "../src/fixtures/harness.js";

test("fixture harness validates valid and invalid examples", () => {
  const { summary } = runFixtureValidation();
  assert.equal(summary.failed, 0);
  assert.ok(summary.passed > 0);
});

test("fixture report includes rule identifiers for failures in invalid fixtures", () => {
  const { summary } = runFixtureValidation();
  // rulesCovered should include at least the baseline policy rules still applicable
  const covered = new Set(summary.rulesCovered);
  assert.ok(covered.has("no_early_reveal"), "should cover no_early_reveal rule");
  assert.ok(covered.has("pass_score_consistency"), "should cover pass_score_consistency rule");
});

test("fixture harness includes live-like sequence fixtures in results", () => {
  const { results } = runFixtureValidation();
  const liveSeqResults = results.filter((r) => r.file.includes("live_sequence"));
  assert.ok(liveSeqResults.length >= 4, "should have at least 4 live-sequence fixtures");
  for (const r of liveSeqResults) {
    assert.ok(r.ok, `live-sequence fixture should pass: ${r.file} - ${r.reason}`);
  }
});
