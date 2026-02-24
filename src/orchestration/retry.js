export const FAILURE_CLASSES = {
  EXECUTION_FAILED: "execution",
  SCHEMA_VALIDATION_FAILED: "schema",
  POLICY_VIOLATION: "policy",
  TIMEOUT: "execution",
  UNKNOWN: "unknown"
};

export function classifyFailure(result) {
  if (!result) return "unknown";
  return FAILURE_CLASSES[result.reason] ?? "unknown";
}

export function isRetryable(result) {
  const cls = classifyFailure(result);
  return cls === "execution";
}

const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelayMs: 500,
  backoffMultiplier: 2
};

export function getRetryConfig(stage, overrides = {}) {
  return { ...DEFAULT_RETRY_CONFIG, ...overrides[stage], ...overrides };
}

export async function withRetry(fn, config = {}) {
  const { maxAttempts, baseDelayMs, backoffMultiplier } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  };

  let lastResult;
  let delayMs = baseDelayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await fn();

    if (result.accepted) return result;

    lastResult = { ...result, retryAttempt: attempt };

    if (!isRetryable(result) || attempt === maxAttempts) {
      return lastResult;
    }

    await sleep(delayMs);
    delayMs *= backoffMultiplier;
  }

  return lastResult;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
