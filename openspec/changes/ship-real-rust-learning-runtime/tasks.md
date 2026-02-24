## 1. Session CLI Foundation

- [x] 1.1 Add a top-level CLI entrypoint for session commands (`start`, `resume`, `end`, `status`).
- [x] 1.2 Implement interactive mode selection for guided vs custom-topic session flow.
- [x] 1.3 Implement session state bootstrap/loading from local storage.
- [x] 1.4 Implement session summary output with attempts, dominant tags, and next-step recommendations.

## 2. Live Codex Stage Integration

- [x] 2.1 Wire runtime stages to use live `codex exec` by default (`planner`, `author`, `coach`, `reviewer`).
- [x] 2.2 Add per-stage retry/backoff configuration and failure classification.
- [x] 2.3 Add explicit fallback mode toggle (fixture/mock) for offline or unstable stage execution.
- [x] 2.4 Ensure stage outputs are schema-validated and policy-checked before runtime state mutation.
- [x] 2.5 Add machine-readable error surfaces for execution, schema, and policy rejection paths.

## 3. Real Rust Exercise Loop

- [x] 3.1 Implement per-session workspace lifecycle for generated exercise files.
- [x] 3.2 Materialize author-generated starter/test files into active workspace before each run.
- [x] 3.3 Execute real `cargo test` runs for learner attempts and capture stdout/stderr + exit code.
- [x] 3.4 Parse compiler/test diagnostics into evidence packets for coach/reviewer stages.
- [x] 3.5 Persist attempt history and review outcomes across retries within a session.

## 4. Guided and Custom Topic UX

- [x] 4.1 Implement guided track navigation screens with eligible/blocked node display.
- [x] 4.2 Show missing prerequisite reasons for blocked guided nodes.
- [x] 4.3 Implement custom-topic input flow with mapping results and prerequisite gap output.
- [x] 4.4 Implement explicit no-match handling path for custom topics with no mapped nodes.

## 5. Curriculum Expansion (Tiered)

- [x] 5.1 Expand Tier 1 curriculum nodes (foundations) with validated prerequisite/tag metadata.
- [x] 5.2 Expand Tier 2 curriculum nodes (collections/iterators/traits) with prerequisite integrity checks.
- [x] 5.3 Expand Tier 3 curriculum nodes (async/transfer practice) with prerequisite integrity checks.
- [x] 5.4 Add curriculum validation checks that reject node definitions missing misconception tags.
- [x] 5.5 Update guided selectors to handle larger graph sizes without changing eligibility semantics.

## 6. Mastery and Remediation Refinement

- [x] 6.1 Refine mastery update rules for live session outcomes (including no-change and downgrade-safe cases).
- [x] 6.2 Ensure misconception events always include node and attempt references.
- [x] 6.3 Add configurable remediation thresholds and include trigger-frequency metadata in remediation events.
- [x] 6.4 Ensure next-node recommendations exclude high-risk candidates while preserving eligible low-risk nodes.

## 7. Policy and Validation Hardening

- [x] 7.1 Extend policy rules for runtime-specific failures (malformed run instructions, empty test packs, invalid handoff states).
- [x] 7.2 Add policy checks for reveal conditions using current attempt count and explicit reveal requests.
- [x] 7.3 Add end-to-end validation guard to prevent unvalidated stage outputs from entering session state.
- [x] 7.4 Add structured audit logs for schema/policy failures with rule identifiers.

## 8. Fixtures and Test Coverage Expansion

- [x] 8.1 Add golden valid fixtures for at least one full live-like stage sequence.
- [x] 8.2 Add negative fixtures for runtime-specific malformed outputs and policy edge cases.
- [x] 8.3 Expand fixture harness assertions to verify expected rule identifiers for failures.
- [x] 8.4 Add integration tests covering CLI guided flow to real run evidence ingestion.
- [x] 8.5 Add integration tests covering custom-topic no-match and prerequisite-gap flows.
- [x] 8.6 Add integration tests for fallback mode behavior when live stage execution fails.

## 9. Operational Readiness and Acceptance

- [x] 9.1 Update runbook with real session commands and fallback workflows.
- [x] 9.2 Update acceptance matrix to map each modified/new requirement to tests or fixtures.
- [x] 9.3 Run full validation suite (`npm test`, fixture checks, seed/live-like flows) and resolve regressions.
- [x] 9.4 Verify all capabilities in this change satisfy spec requirements before marking complete.
