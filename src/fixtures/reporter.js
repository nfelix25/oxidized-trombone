export function summarizeFixtureResults(results) {
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    failures: results.filter((r) => !r.ok).map((r) => ({
      file: r.file,
      rule: r.rule,
      reason: r.reason
    }))
  };

  return summary;
}

export function printFixtureReport(summary) {
  console.log(`Fixtures: ${summary.passed}/${summary.total} passed`);
  if (summary.failed > 0) {
    console.log("Failures:");
    for (const failure of summary.failures) {
      console.log(`- ${failure.file}: ${failure.rule ?? "unknown"} (${failure.reason})`);
    }
  }
}
