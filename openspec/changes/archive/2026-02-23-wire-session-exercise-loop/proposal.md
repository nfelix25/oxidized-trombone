## Why

The previous change built all the runtime primitives (stage execution, workspace lifecycle, cargo test runner, attempt/review tracking) but they're not yet connected into a working learner flow. Starting a session selects a node but then stops — there's no way to actually run a lesson, attempt an exercise, request a hint, or get a review without manually scripting it. This change wires those modules into an end-to-end interactive loop so a real learning session can happen.

## What Changes

- Add a `session-exercise-loop` orchestration module that sequences the four stages (planner → author → materialize → attempt → coach/reviewer) within an active session.
- Add `attempt`, `hint`, and `review` sub-commands to the CLI so the learner can drive the loop interactively.
- Integrate workspace creation and `cargo test` execution into the session lifecycle, persisting attempt state back to session storage after each run.
- Surface stage failure reasons and reviewer feedback in the terminal in human-readable form.

## Capabilities

### New Capabilities

- `session-exercise-loop`: Orchestrates the full lesson cycle within an active session — runs planner and author stages to set up an exercise, materializes files to a workspace, executes `cargo test` for learner attempts, invokes the coach for hints, and calls the reviewer to evaluate outcomes and update mastery.

### Modified Capabilities

- `learning-cli-interface`: Add `attempt`, `hint`, and `review` sub-commands to the session CLI, enabling the learner to drive the exercise loop from the terminal. The current CLI only handles session lifecycle (`start`, `resume`, `end`, `status`); this extends it to cover the in-session interaction cycle the spec requires.

## Impact

- Affected code: `src/session/cli.js`, `src/session/session.js` (new sub-commands and loop integration), new `src/session/exerciseLoop.js` orchestration module.
- Uses existing modules without modification: `src/orchestration/stages.js`, `src/runtime/workspace.js`, `src/runtime/materialize.js`, `src/runtime/commandRunner.js`, `src/runtime/attempts.js`, `src/context/packet.js`.
- Session state in `.state/sessions/active_session.json` gains exercise and attempt fields.
- No schema or policy changes required.
