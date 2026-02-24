export function summarizeFixtureResults(results) {
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    failures: results.filter((r) => !r.ok).map((r) => ({
      file: r.file,
      rule: r.rule ?? null,
      reason: r.reason
    })),
    rulesCovered: [...new Set(results.filter((r) => r.rule).map((r) => r.rule))]
  };

  return summary;
}

export function printFixtureReport(summary) {
  console.log(`Fixtures: ${summary.passed}/${summary.total} passed`);
  if (summary.rulesCovered.length > 0) {
    console.log(`Rules covered: ${summary.rulesCovered.join(", ")}`);
  }
  if (summary.failed > 0) {
    console.log("Failures:");
    for (const failure of summary.failures) {
      const ruleLabel = failure.rule ? `[${failure.rule}]` : "[unknown rule]";
      console.log(`- ${failure.file}: ${ruleLabel} ${failure.reason}`);
    }
  }
}
