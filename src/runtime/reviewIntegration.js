export function mergeReviewIntoAttempt(attemptState, reviewPayload) {
  return {
    ...attemptState,
    latestReview: {
      passFail: reviewPayload.pass_fail,
      score: reviewPayload.score,
      dominantTag: reviewPayload.dominant_tag,
      remediation: reviewPayload.remediation
    }
  };
}

export async function persistReviewOutcome(storage, attemptState, reviewPayload) {
  const merged = mergeReviewIntoAttempt(attemptState, reviewPayload);
  await storage.write(`attempt_${attemptState.exerciseId}`, merged);
  return merged;
}

export function extractAttemptEvidence(runResult) {
  const stderrLines = (runResult.stderr ?? "").split("\n").filter(Boolean);
  const stdoutLines = (runResult.stdout ?? "").split("\n").filter(Boolean);

  const compilerErrorLines = stderrLines.filter((line) => line.includes("error[E"));
  const errorCodes = compilerErrorLines
    .map((line) => {
      const match = line.match(/error\[(E\d+)\]/);
      return match?.[1];
    })
    .filter(Boolean);

  const failingTests = stderrLines
    .concat(stdoutLines)
    .filter((line) => line.includes("FAILED") || line.match(/^test .+ \.\.\. FAILED/));

  const passingTests = stdoutLines
    .filter((line) => line.match(/^test .+ \.\.\. ok/))
    .map((line) => {
      const m = line.match(/^test (.+?) \.\.\. ok/);
      return m?.[1] ?? line;
    });

  const excerptLines = stderrLines.length > 0 ? stderrLines : stdoutLines;

  return {
    compiler: {
      error_codes: [...new Set(errorCodes)],
      error_excerpt: excerptLines.slice(0, 8).join("\n")
    },
    tests: {
      passing: runResult.ok ? (passingTests.length > 0 ? passingTests : ["all"]) : passingTests,
      failing: failingTests,
      failure_excerpt: excerptLines.slice(0, 8).join("\n")
    }
  };
}
