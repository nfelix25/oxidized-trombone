import path from "node:path";
import { fileURLToPath } from "node:url";
import { allCurricula as seedCurriculum } from "../curriculum/allCurricula.js";
import { getEligibleNextNodes, mapCustomTopic, prerequisiteGapReport } from "../curriculum/selectors.js";
import { FileStorageAdapter } from "../state/storage.js";
import { createMasteryState, updateMasteryForOutcome } from "../mastery/store.js";
import { createMisconceptionState, recordMisconception } from "../mastery/misconceptions.js";
import { recommendNextNodes } from "../mastery/recommend.js";
import { assembleStarterFiles, assembleTestFiles } from "../runtime/materialize.js";
import { runCommand } from "../runtime/commandRunner.js";
import { createAttemptState, recordAttempt, recordHintUsage } from "../runtime/attempts.js";
import { persistReviewOutcome, extractAttemptEvidence } from "../runtime/reviewIntegration.js";

export async function runA203SeedFlow(baseDir = ".state/seed_a203") {
  const storage = new FileStorageAdapter(baseDir);
  const masteryState = createMasteryState({ A200: 3, A202: 2 });
  const misconceptionState = createMisconceptionState();

  const eligibleBefore = getEligibleNextNodes(seedCurriculum, masteryState.byNode).map((n) => n.id);

  const customTopic = mapCustomTopic(seedCurriculum, "mutable references aliasing", masteryState.byNode);
  const gaps = prerequisiteGapReport(customTopic);

  const starterSections = [{ file_path: "lib.rs", content: "pub fn bump(v: &mut Vec<i32>) { let _ = v; }" }];
  const testSections = [{ file_path: "aliasing.rs", content: "#[test] fn smoke(){ assert!(true); }" }];

  const workspace = path.join(baseDir, "workspace");
  await assembleStarterFiles(workspace, starterSections);
  await assembleTestFiles(workspace, testSections);

  let attempt = createAttemptState("A203_seed");
  const simulatedFailure = await runCommand("node", ["-e", "console.error('error[E0499]: cannot borrow as mutable'); process.exit(1)"]);
  attempt = recordAttempt(attempt, simulatedFailure, 8);
  attempt = recordHintUsage(attempt, 1);

  const evidence = extractAttemptEvidence(simulatedFailure);
  const reviewPayload = {
    pass_fail: "FAIL",
    score: 62,
    dominant_tag: "borrow.two_mut_refs",
    remediation: { action: "retry_same", reason: "Overlapping mutable references" }
  };

  const persistedAttempt = await persistReviewOutcome(storage, attempt, reviewPayload);
  const misconceptionUpdated = recordMisconception(misconceptionState, {
    nodeId: "A203",
    tag: reviewPayload.dominant_tag,
    attemptIndex: attempt.attemptIndex
  });

  const masteryAfterFail = updateMasteryForOutcome(masteryState, {
    nodeId: "A203",
    depthTarget: "D2",
    pass: false
  });

  const recommendations = recommendNextNodes({
    graph: seedCurriculum,
    masteryState: masteryAfterFail,
    misconceptionState: misconceptionUpdated
  });

  return {
    eligibleBefore,
    customTopic,
    gaps,
    evidence,
    persistedAttempt,
    masteryAfterFail,
    recommendations
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runA203SeedFlow().then((result) => {
    console.log(JSON.stringify(result, null, 2));
  });
}
