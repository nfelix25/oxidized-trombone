## Context

The archived change delivered a validated scaffold covering curriculum modeling, context/schema contracts, orchestration wrappers, runtime primitives, mastery tracking, fixtures, and seed-flow tests. The current system still behaves as an internal framework rather than a real user-facing learning product because session UX is minimal, seed flow still uses simulated failures, and live Codex stage integration has not been exercised as the default runtime path.

This change upgrades the scaffold into a usable local application for daily Rust learning by wiring an actual CLI/session loop, driving planner/author/coach/reviewer through real `codex exec` calls, running real Rust exercises with `cargo test`, and expanding curriculum and reliability coverage.

Constraints:

- Personal-use, local-first operation (no multi-user/auth/cloud scope).
- Must work with local Codex CLI and local Rust toolchain availability.
- Must preserve strict policy and schema guardrails from the existing scaffold.
- Must keep iteration cycles fast enough for short learning sessions.

## Goals / Non-Goals

**Goals:**

- Introduce a learner-facing CLI flow for selecting topic mode (guided/custom), launching sessions, requesting hints, and reviewing outcomes.
- Make live stage orchestration (`planner`, `author`, `coach`, `reviewer`) the default path in runtime sessions.
- Run real generated Rust exercises in isolated local workspaces and capture diagnostics for feedback loops.
- Expand and harden curriculum content from seed nodes to a broader practical set while preserving prerequisite integrity.
- Upgrade validation and fixtures so live integration paths are tested, not only static schemas.

**Non-Goals:**

- Desktop/web GUI.
- Remote execution or cloud synchronization.
- Full pedagogical personalization research system beyond deterministic rule-based adaptation.
- Multi-language support beyond Rust.

## Decisions

### 1) Add a dedicated CLI session application layer

Decision:

- Create a top-level CLI entrypoint that orchestrates session lifecycle:
  - Session start (guided/custom mode)
  - Topic selection and confirmation
  - Stage execution loop
  - Attempt/hint/review cycle
  - Session summary output

Rationale:

- Existing modules are composable but do not provide an integrated learner journey.
- A single session controller reduces glue code duplication and makes behavior observable.

Alternatives considered:

- Continue with script-based ad hoc execution: lower upfront cost, weak usability.
- Implement GUI first: higher complexity without proving core runtime robustness.

### 2) Treat live Codex execution as primary, fixtures as safety net

Decision:

- Route runtime stages through real `codex exec` by default.
- Keep fixture-backed and mock-backed execution available as fallback/testing modes.

Rationale:

- Live behavior must be exercised continuously to validate practical learning value.
- Fixtures remain essential for deterministic regression testing of schema/policy contracts.

Alternatives considered:

- Fixture-only pipeline: stable but not representative of actual runtime.
- Live-only pipeline: realistic but brittle for repeatable tests.

### 3) Replace simulated failure loop with real Rust workspace execution

Decision:

- Materialize generated exercise/test files into per-session workspaces.
- Execute actual `cargo test` commands and parse real diagnostics into attempt evidence.

Rationale:

- Rust learning depends on real compiler/test feedback, not synthetic error strings.
- Real runs reveal integration gaps that simulated flows cannot expose.

Alternatives considered:

- Continue simulated failures: insufficient fidelity.
- Add custom evaluator without running Rust: misses compiler semantics.

### 4) Expand curriculum via incremental tiers with prerequisite guarantees

Decision:

- Extend curriculum in tiers:
  - Tier 1: broaden foundational ownership/borrowing and error handling nodes.
  - Tier 2: collections/iterators/traits depth.
  - Tier 3: async and transfer-heavy practice nodes.
- Keep eligibility and gap reporting deterministic and explicit.

Rationale:

- Immediate full-catalog rollout increases risk and maintenance overhead.
- Tiered expansion keeps feedback fast and allows iterative quality tuning.

Alternatives considered:

- Big-bang full curriculum import: faster initial breadth, higher inconsistency risk.
- Keep minimal seed only: insufficient for sustained learning.

### 5) Strengthen policy and acceptance checks around live execution failure modes

Decision:

- Add policy checks for runtime-specific issues (e.g., malformed run instructions, empty test packs, invalid reveal behavior after retries).
- Extend acceptance matrix and integration tests to include at least one end-to-end live-like session path.

Rationale:

- Existing validation is strong structurally but under-tested on end-to-end runtime edges.
- More realistic acceptance checks reduce regression risk during iterative prompt/content updates.

Alternatives considered:

- Rely on manual session checks: slower and less reliable.
- Expand only unit tests: misses orchestration/runtime coupling.

## Risks / Trade-offs

- [Live `codex exec` variability increases flaky behavior] -> Mitigation: add retry/backoff + fallback mode + clear error classification.
- [Real `cargo test` loops can slow sessions] -> Mitigation: keep micro exercises small, isolate workspaces, and optimize default commands.
- [CLI UX complexity can grow quickly] -> Mitigation: start with a narrow command set and structured menus before adding advanced controls.
- [Curriculum expansion may dilute quality] -> Mitigation: tiered rollout with fixture/test gates per tier.
- [Policy strictness may frustrate learning flow] -> Mitigation: keep explicit override knobs while preserving default guardrails.

## Migration Plan

1. Build CLI session controller and wire current modules into a single runtime path.
2. Integrate live `codex exec` stage execution with structured error handling and fallback options.
3. Replace seed simulation with real exercise materialization + `cargo test` evidence ingestion.
4. Expand curriculum nodes in tiers and update guided/custom selection logic accordingly.
5. Extend fixture sets and integration tests to cover live-like runtime flows and policy edge cases.
6. Update runbook and acceptance matrix to reflect operational session workflow.

Rollback strategy:

- Keep scaffold-level modules intact and backward-compatible.
- If live stage execution is unstable, switch runtime default to fixture/mock mode while preserving CLI/session flow.
- Gate curriculum tiers so problematic tiers can be disabled independently.

## Open Questions

- Should live stage retries be per-stage fixed-count or adaptive by error type?
- Should session workspaces be persistent between sessions for review, or ephemeral by default?
- How much CLI interactivity should be menu-driven vs command-flag driven in v1 runtime UX?
- What minimum curriculum tier size is enough to be genuinely useful for daily learning before further expansion?
