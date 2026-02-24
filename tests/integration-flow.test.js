import test from "node:test";
import assert from "node:assert/strict";
import { seedCurriculum } from "../src/curriculum/seed.js";
import { getEligibleNextNodes, mapCustomTopic, prerequisiteGapReport } from "../src/curriculum/selectors.js";
import { createAttemptState, recordAttempt, recordHintUsage } from "../src/runtime/attempts.js";
import { mergeReviewIntoAttempt } from "../src/runtime/reviewIntegration.js";

test("guided selection -> attempt -> hint -> review loop", () => {
  const masteryByNode = { A200: 3, A202: 2 };
  const eligible = getEligibleNextNodes(seedCurriculum, masteryByNode);
  assert.ok(eligible.find((node) => node.id === "A203"));

  let attempt = createAttemptState("ex_a203");
  attempt = recordAttempt(
    attempt,
    { code: 1, stdout: "", stderr: "error[E0499]" },
    7
  );
  attempt = recordHintUsage(attempt, 2);

  const reviewed = mergeReviewIntoAttempt(attempt, {
    pass_fail: "FAIL",
    score: 65,
    dominant_tag: "borrow.two_mut_refs",
    remediation: { action: "retry_same", reason: "scope borrows" }
  });

  assert.equal(reviewed.attemptIndex, 1);
  assert.equal(reviewed.hintLevelUsed, 2);
  assert.equal(reviewed.latestReview.passFail, "FAIL");
});

test("custom topic mapping includes prerequisite gap report", () => {
  const masteryByNode = { A200: 1, A202: 0 };
  const mapping = mapCustomTopic(seedCurriculum, "mutable aliasing", masteryByNode);
  assert.ok(mapping.mappedNodeIds.includes("A203"));

  const gaps = prerequisiteGapReport(mapping);
  const a203Gap = gaps.find((entry) => entry.nodeId === "A203");
  assert.ok(a203Gap);
  assert.ok(a203Gap.missingPrerequisites.includes("A202"));
});
