# Acceptance Matrix

## session-exercise-loop (NEW)

- Exercise loop runs planner + author at session start → `src/session/exerciseLoop.js` (`setupExercise`), `tests/exercise-loop.test.js`
- Stage failure at session start is surfaced and session is not persisted → `src/session/exerciseLoop.js` (`setupExercise` returns null on rejection), `tests/exercise-loop.test.js`
- `attempt` command runs cargo test then reviewer stage → `src/session/exerciseLoop.js` (`runAttempt`), `src/session/session.js` (`attemptSession`), `tests/exercise-loop.test.js`
- `attempt` updates mastery on PASS → `src/session/exerciseLoop.js` (calls `updateMasteryForOutcome`), `tests/exercise-loop.test.js`
- Reviewer stage failure preserves attempt record → `src/session/exerciseLoop.js` (`runAttempt` fallback path), `tests/exercise-loop.test.js`
- `hint` command advances coach level L1→L2→L3 → `src/session/exerciseLoop.js` (`requestHint`), `src/session/session.js` (`hintSession`), `tests/exercise-loop.test.js`
- Hint capped at L3 (no new stage call) → `src/session/exerciseLoop.js` (`requestHint` cap path), `tests/exercise-loop.test.js`
- `review` command displays last stored verdict → `src/session/exerciseLoop.js` (`requestReview`), `src/session/session.js` (`reviewSession`), `tests/exercise-loop.test.js`
- Context packets built from live session state → `src/session/exerciseLoop.js` (`buildPlannerPacket`, `buildAuthorPacket`, `buildReviewerPacket`, `buildCoachPacket`)
- `attempt`, `hint`, `review` sub-commands registered in CLI → `src/session/cli.js` (COMMANDS map), `src/session/session.js`

## learning-cli-interface (NEW)

- CLI session lifecycle (`start`, `resume`, `end`, `status`) → `src/session/cli.js`, `src/session/session.js`
- Interactive mode selection (guided/custom) → `src/session/modeSelect.js`
- Session state bootstrap/loading from local storage → `src/session/session.js`, `src/state/storage.js`
- Session summary with attempts, dominant tags, recommendations → `src/session/summary.js`
- Guided track navigation with eligible/blocked node display → `src/session/guidedNav.js`, `tests/cli-guided-flow.test.js`
- Missing prerequisite reasons for blocked nodes → `src/session/guidedNav.js`, `tests/cli-guided-flow.test.js`
- Custom-topic input flow with mapping results + gap output → `src/session/customTopic.js`, `tests/custom-topic-flow.test.js`
- Explicit no-match handling for custom topics → `src/session/customTopic.js`, `tests/custom-topic-flow.test.js`

## codex-lesson-orchestration

- Role-based contracts (live codex exec as default) → `src/orchestration/stages.js` (schema path auto-resolved)
- Per-stage retry/backoff + failure classification → `src/orchestration/retry.js`, `tests/fallback-mode.test.js`
- Explicit fallback mode toggle → `src/orchestration/stages.js` (`STAGE_FALLBACK=1` env or `fallback` option), `tests/fallback-mode.test.js`
- Stage output schema-validated + policy-checked before state mutation → `src/orchestration/guard.js`, `tests/cli-guided-flow.test.js`
- Machine-readable error surfaces → `src/orchestration/stages.js` (`toMachineReadableError`), `src/orchestration/guard.js` (`toMachineError`)
- Context packet required fields → `src/context/validate.js`, `tests/fixtures.test.js`
- Schema validation enforcement → `src/validation/schemaValidator.js`, `tests/fixtures.test.js`
- Policy guardrails → `src/policy/engine.js`, `tests/fixtures.test.js`, invalid fixtures

## interactive-exercise-runtime

- Per-session workspace lifecycle → `src/runtime/workspace.js`
- Author-generated files materialized before test run → `src/runtime/materialize.js`, `src/seed/a203Flow.js`
- Real `cargo test` execution + stdout/stderr/exit capture → `src/runtime/commandRunner.js` (`runExercise`)
- Compiler/test diagnostics parsed into evidence packets → `src/runtime/reviewIntegration.js` (`extractAttemptEvidence`), `tests/cli-guided-flow.test.js`
- Attempt history persisted across retries within a session → `src/runtime/attempts.js` (`recordReviewOutcome`, `reviews` array)
- Hint ladder progressive and policy-aware → `src/runtime/hints.js`, invalid reveal fixtures
- Reviewer evidence loop → `src/runtime/reviewIntegration.js`, `tests/cli-guided-flow.test.js`

## rust-learning-curriculum

- Curriculum graph + prerequisites → `src/curriculum/model.js`, `src/curriculum/seed.js`
- Guided narrowing by track (with eligible/blocked) → `src/curriculum/selectors.js` (`narrowTrack`, `getEligibleByTrack`), `tests/cli-guided-flow.test.js`
- Custom topic mapping + prerequisite gaps → `src/curriculum/selectors.js`, `tests/custom-topic-flow.test.js`
- Node misconception tags (at least one required) → `src/curriculum/model.js` (`createNode` validation)
- Node rejection without misconception tags → `src/curriculum/model.js` (`createNode`), `src/curriculum/model.js` (`validateCurriculumGraph`)
- Tier 1 foundations nodes (A200–A209) → `src/curriculum/seed.js`, `tests/cli-guided-flow.test.js`
- Tier 2 collections/iterators/traits nodes (A500–A506) → `src/curriculum/seed.js`, `tests/custom-topic-flow.test.js`
- Tier 3 async/concurrency nodes (A700–A704) → `src/curriculum/seed.js`, `tests/custom-topic-flow.test.js`
- Curriculum graph integrity validation → `src/curriculum/model.js` (`validateCurriculumGraph`), `tests/cli-guided-flow.test.js`

## mastery-and-misconception-model

- Per-node mastery updates with history → `src/mastery/store.js`, `src/seed/a203Flow.js`
- No-change and downgrade-safe mastery rules → `src/mastery/store.js` (score-gated downgrade)
- Misconception events with node + attempt references (enforced) → `src/mastery/misconceptions.js` (validation in `recordMisconception`)
- Configurable remediation thresholds + trigger-frequency metadata → `src/mastery/remediation.js`
- Next-node recommendations exclude high-risk candidates, sorted by opportunity → `src/mastery/recommend.js`, `tests/cli-guided-flow.test.js`

## learning-content-and-fixtures

- Versioned schema contracts → `src/schemas/*.schema.json`
- Golden valid fixtures (baseline roles) → `fixtures/valid/**`
- Live-like sequence fixtures (all 4 stages) → `fixtures/valid/live_sequence/**`, `tests/fixtures.test.js`
- Invalid guardrail fixtures → `fixtures/invalid/**`
- Fixture pass/fail + machine-readable rule IDs → `src/fixtures/harness.js`, `src/fixtures/reporter.js`, `tests/fixtures.test.js`
- Policy rules covered in fixture set: `no_early_reveal`, `respect_attempt_threshold`, `pass_score_consistency`, `fail_score_consistency`, `non_empty_run_instructions`, `bridge_lesson_not_for_complex_outline` → `tests/fixtures.test.js`
- Fallback mode behavior tested → `tests/fallback-mode.test.js`
- Retry/backoff behavior tested → `tests/fallback-mode.test.js`
