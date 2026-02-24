## 1. Session State Extension

- [x] 1.1 Add `exerciseId`, `exercisePack`, `workspaceDir`, `hintLevelUsed`, and `reviews` fields to `createNewSession` in `src/session/session.js` so exercise state is carried across commands.

## 2. Exercise Loop Module

- [x] 2.1 Create `src/session/exerciseLoop.js` with `setupExercise(session, storage)` that runs the planner stage then the author stage using a context packet built from session state, materializes the resulting exercise files into a workspace, and saves `exercisePack`, `workspaceDir`, and `exerciseId` to session state. Print a "Setting up exercise…" message before stage calls. On stage failure, print a human-readable error and machine-readable JSON to stderr, exit 1, and do not save session state.
- [x] 2.2 Add `runAttempt(session, storage)` to `src/session/exerciseLoop.js` that runs `cargo test` in the active workspace via `runExercise`, records the attempt via `recordAttempt`, runs the reviewer stage with evidence from the run, applies the mastery update via `recordReviewOutcome`, and prints the test result and reviewer verdict. On reviewer stage failure, preserve the attempt record in session state and surface the failure reason.
- [x] 2.3 Add `requestHint(session, storage)` to `src/session/exerciseLoop.js` that calls the coach stage at `hintLevelUsed + 1` (up to 3). If already at level 3, print the existing L3 hint without making a new stage call. Update `hintLevelUsed` in session state after a successful coach call.
- [x] 2.4 Add `requestReview(session)` to `src/session/exerciseLoop.js` that reads and displays the last stored reviewer verdict from session state without re-running the reviewer stage.

## 3. Context Packet Construction

- [x] 3.1 In `setupExercise`, build the planner and author context packets using the learner's current mastery levels and top misconception tags from session state (use `src/context/packet.js` and/or `src/context/adapters.js`).
- [x] 3.2 In `runAttempt`, build the reviewer context packet with compiler diagnostics and test outcomes from the most recent `cargo test` run.
- [x] 3.3 In `requestHint`, build the coach context packet with `hint_level` set to the next level and attempt evidence from the most recent run (empty evidence context if no attempts yet).

## 4. Session and CLI Integration

- [x] 4.1 Call `setupExercise` at the end of `startSession` in `src/session/session.js`, after the node is selected and before the session is persisted. If setup fails, do not save the session.
- [x] 4.2 Add `attemptSession`, `hintSession`, and `reviewSession` handler functions to `src/session/session.js` that load the active session, call the corresponding `exerciseLoop` function, and save updated session state.
- [x] 4.3 Register `attempt`, `hint`, and `review` in the `COMMANDS` map in `src/session/cli.js` and update the usage text to list the new commands.

## 5. Integration Tests

- [x] 5.1 Add an integration test in `tests/exercise-loop.test.js` that uses fallback stage injection and verifies that `setupExercise` runs planner + author and returns session with `exercisePack` and `workspaceDir` set.
- [x] 5.2 Add integration tests that verify `runAttempt` runs cargo test, calls the reviewer stage with evidence, and updates mastery in session state (passing case and reviewer failure case).
- [x] 5.3 Add integration tests that verify `requestHint` increments `hintLevelUsed` L1→L2→L3, caps at L3 (returns null with no new stage call), and calls coach at the correct level.
- [x] 5.4 Add an integration test that verifies `setupExercise` stage failure returns null (no session persisted) and sets exitCode 1.

## 6. Acceptance Matrix Update

- [x] 6.1 Add a `session-exercise-loop` section to `docs/acceptance-matrix.md` mapping each new requirement and scenario to the implementing modules and tests.
