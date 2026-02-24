export function computeSessionMetrics(session) {
  const attempts = session.attempts ?? [];
  const misconceptionCounts = session.misconceptionState?.counts ?? {};

  const dominantTags = Object.entries(misconceptionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key, count]) => {
      const [nodeId, tag] = key.split(":", 2);
      return { nodeId, tag, count };
    });

  const passed = attempts.filter((a) => a.latestReview?.passFail === "PASS").length;
  const failed = attempts.filter((a) => a.latestReview?.passFail === "FAIL").length;

  return {
    totalAttempts: attempts.length,
    passed,
    failed,
    dominantTags
  };
}

export function printSessionSummary(session, recommendations = []) {
  const metrics = computeSessionMetrics(session);

  console.log("\n=== Session Summary ===");
  console.log(`Session ID:   ${session.sessionId}`);
  console.log(`Mode:         ${session.mode}`);
  console.log(`Node:         ${session.nodeId ?? "none"}`);
  console.log(`Started:      ${session.startedAt}`);
  if (session.endedAt) console.log(`Ended:        ${session.endedAt}`);

  console.log(`\nAttempts:     ${metrics.totalAttempts} (${metrics.passed} passed, ${metrics.failed} failed)`);

  if (metrics.dominantTags.length > 0) {
    console.log("\nDominant misconception tags:");
    for (const { nodeId, tag, count } of metrics.dominantTags) {
      console.log(`  ${nodeId}:${tag}  (${count}x)`);
    }
  }

  if (recommendations.length > 0) {
    console.log("\nNext-step recommendations:");
    for (const nodeId of recommendations.slice(0, 3)) {
      console.log(`  -> ${nodeId}`);
    }
  } else {
    console.log("\nNo next-step recommendations available.");
  }
  console.log("======================\n");
}
