# Acceptance Matrix

## rust-learning-curriculum

- Curriculum graph + prerequisites -> `tests/integration-flow.test.js` (`guided selection` test)
- Guided narrowing by track -> `src/curriculum/selectors.js` (`narrowTrack`), covered by seed flow usage
- Custom topic mapping + prerequisite gaps -> `tests/integration-flow.test.js` (`custom topic mapping` test)
- Node misconception tags -> `src/curriculum/seed.js` node definitions and selection logic

## codex-lesson-orchestration

- Role-based contracts -> `src/orchestration/stages.js`
- Context packet required fields -> `src/context/validate.js`, `tests/fixtures.test.js`
- Schema validation enforcement -> `src/validation/schemaValidator.js`, `tests/fixtures.test.js`
- Policy guardrails -> `src/policy/engine.js`, invalid fixtures in `fixtures/invalid/*.json`

## interactive-exercise-runtime

- Local execution + evidence capture -> `src/runtime/commandRunner.js`, `src/runtime/reviewIntegration.js`
- Attempt retries + metadata tracking -> `src/runtime/attempts.js`, `tests/integration-flow.test.js`
- Progressive hint policy -> `src/runtime/hints.js`, invalid reveal fixture
- Reviewer evidence loop -> `src/runtime/reviewIntegration.js`, `src/seed/a203Flow.js`

## mastery-and-misconception-model

- Per-node mastery updates -> `src/mastery/store.js`, `src/seed/a203Flow.js`
- Misconception tag recording -> `src/mastery/misconceptions.js`, `src/seed/a203Flow.js`
- Rolling tag frequency + remediation -> `src/mastery/remediation.js`
- Next-node recommendation with risk -> `src/mastery/recommend.js`, `src/seed/a203Flow.js`

## learning-content-and-fixtures

- Versioned schema contracts -> `src/schemas/*.schema.json`
- Golden valid fixtures -> `fixtures/valid/**`
- Invalid guardrail fixtures -> `fixtures/invalid/**`
- Fixture pass/fail + machine-readable reason -> `src/fixtures/harness.js`, `src/fixtures/reporter.js`, `tests/fixtures.test.js`
