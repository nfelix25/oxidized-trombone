import test from "node:test";
import assert from "node:assert/strict";
import { runFixtureValidation } from "../src/fixtures/harness.js";

test("fixture harness validates valid and invalid examples", () => {
  const { summary } = runFixtureValidation();
  assert.equal(summary.failed, 0);
  assert.ok(summary.passed > 0);
});
