## Why

The current implementation is a validated scaffold but not yet a real day-to-day learning application. This change is needed now to turn the scaffold into an actually usable local product with live Codex stage execution, real Rust exercise runs, and richer curriculum coverage.

## What Changes

- Add a real interactive CLI/session flow for selecting tracks, choosing custom topics, running attempts, and requesting hints/reviews.
- Replace seed/mocked stage behavior with live `codex exec` orchestration across planner, author, coach, and reviewer stages.
- Replace simulated exercise outcomes with real Rust workspace execution (`cargo test`) and captured diagnostics.
- Expand curriculum content breadth/depth beyond seed nodes and tighten guided progression behavior.
- Strengthen policy/schema enforcement and fixture coverage for production-like reliability in personal use.

## Capabilities

### New Capabilities

- `learning-cli-interface`: Interactive terminal experience for session setup, guided/custom topic selection, attempt loop controls, and learner-facing feedback display.

### Modified Capabilities

- `codex-lesson-orchestration`: Evolve orchestration from scaffold-level stage wrappers to fully wired live `codex exec` flows with robust error handling and retries.
- `interactive-exercise-runtime`: Upgrade from simulated attempt loops to real Rust workspace execution and stateful session progression.
- `rust-learning-curriculum`: Expand node coverage, track structure, and prerequisite behavior to support deeper and broader learning paths.
- `mastery-and-misconception-model`: Refine mastery transitions and remediation triggers based on real attempt streams and longer session histories.
- `learning-content-and-fixtures`: Expand golden/negative fixtures and acceptance checks to cover live stage integration and runtime edge cases.

## Impact

- Affected code: `src/orchestration`, `src/runtime`, `src/curriculum`, `src/mastery`, and new CLI/session modules.
- Affected interfaces: learner-facing terminal UX and internal stage invocation contracts.
- Dependencies/systems: increased operational reliance on local Codex CLI availability and Rust toolchain execution at runtime.
- Delivery impact: introduces deeper integration and reliability work before the app can be considered a stable daily learning tool.
