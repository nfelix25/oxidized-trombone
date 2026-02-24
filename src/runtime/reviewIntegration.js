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
  const compilerErrors = [];
  const failingTests = [];

  const stderrLines = runResult.stderr.split("\n").filter(Boolean);
  for (const line of stderrLines) {
    if (line.includes("error[E")) {
      compilerErrors.push(line.trim());
    }
    if (line.includes("FAILED")) {
      failingTests.push(line.trim());
    }
  }

  return {
    compiler: {
      error_codes: compilerErrors
        .map((line) => {
          const match = line.match(/error\[(E\d+)\]/);
          return match?.[1];
        })
        .filter(Boolean),
      error_excerpt: stderrLines.slice(0, 5).join("\n")
    },
    tests: {
      passing: runResult.ok ? ["all"] : [],
      failing: failingTests,
      failure_excerpt: stderrLines.slice(0, 5).join("\n")
    }
  };
}
