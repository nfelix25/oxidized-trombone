## Context

The runtime primitives are complete: `runStage` drives codex exec with schema/policy validation, `createWorkspace` manages per-session Cargo directories, `runExercise` wraps `cargo test`, and `recordAttempt`/`recordReviewOutcome` track learner history. What's missing is the glue: a module that sequences these calls in the right order, builds context packets from session state, and wires the result into the CLI.

The session state file (`active_session.json`) currently holds mastery and misconception state but no exercise state — there's no `exercisePack`, `attemptState`, or `workspaceDir` field. The CLI has `start`/`resume`/`end`/`status` but no `attempt`, `hint`, or `review` sub-commands.

Constraints: personal-use local tool, no network beyond Codex CLI, existing schema/policy contracts must not change.

## Goals / Non-Goals

**Goals:**
- Create `src/session/exerciseLoop.js` that sequences planner → author → materialize for session setup, and exposes `runAttempt`, `requestHint`, and `requestReview` for the in-session cycle.
- Extend `src/session/cli.js` and `src/session/session.js` with `attempt`, `hint`, and `review` sub-commands.
- Extend session state to carry `exerciseId`, `exercisePack`, `attemptState`, and `workspaceDir` across commands.
- Print human-readable output (hint text, review verdict, stage errors) to stdout after each action.

**Non-Goals:**
- Changing any schema, policy rule, or curriculum content.
- Persistent workspace review across separate sessions.
- Concurrent or background stage execution.
- Streaming stage output (output appears only after stage completes).

## Decisions

### 1) `start` triggers planner + author automatically

Decision: When `npm run session start` completes node selection, immediately run the planner and author stages before saving session state. The learner lands in a state where the exercise is ready to attempt with no extra command.

Rationale: The learner selected a node because they want to practice it. Making them issue a separate "setup" command before they can attempt adds friction with no benefit. The planner+author stages are the setup — they belong at session start.

Alternatives considered:
- Separate `setup` command: extra ceremony, easy to forget.
- Lazy setup on first `attempt`: hides latency inside `attempt`, surprising UX.

### 2) `attempt` runs cargo test + reviewer in sequence

Decision: `npm run session attempt` runs `cargo test` in the workspace, records the attempt, then automatically runs the reviewer stage and updates mastery. It prints the test result and reviewer verdict.

Rationale: Attempt and review are always a pair — you never want a raw `cargo test` result without knowing whether it passed or failed from the reviewer's perspective. Combining them keeps the flow fast and predictable.

Alternatives considered:
- Separate `review` command triggered manually: adds a step learners will forget; reviewer requires evidence from the run so it must follow immediately.
- Keep `review` as a separate explicit command for when the learner wants on-demand review without running tests: kept as an alias that shows the latest review without re-running.

### 3) `hint` runs coach with current hint level, capped at L3

Decision: `npm run session hint` calls the coach stage at `hintLevelUsed + 1`, up to hint level 3, then records the new level in session state. Running `hint` when already at L3 prints the existing L3 hint rather than erroring.

Rationale: Progressive hints are the intended mechanic. The coach stage handles L1/L2/L3 naturally through the context packet's `attempt_context.hint_level`. Capping silently at L3 is more learner-friendly than throwing an error.

Alternatives considered:
- Allow repeated L3 hints: same content each time, wasted codex call.
- Block hints entirely after reveal threshold: too rigid for personal use.

### 4) Context packets built from session state at call time

Decision: `exerciseLoop.js` builds the `context_packet_v1` for each stage by reading the current session state (mastery, misconception history, attempt state, node metadata) at the moment the command is invoked.

Rationale: Session state is the single source of truth. Building packets from it at call time means no stale packet data is stored, and the coach/reviewer always receive up-to-date evidence from the most recent run.

Alternatives considered:
- Store a pre-built packet in session state: stale after each attempt; redundant with session state.
- Pass packet as CLI arg: too verbose for interactive use.

### 5) Stage failures print machine-readable error + human summary, do not crash

Decision: If a stage returns `accepted: false`, `exerciseLoop.js` prints a human summary (`Stage failed: <reason>`) plus the raw machine error as JSON to stderr, then exits with code 1 without modifying session state.

Rationale: Learners need to know something went wrong and why (e.g., Codex offline → try fallback mode). The machine-readable JSON supports debugging. Preserving session state means they can retry after fixing the issue.

Alternatives considered:
- Throw and let Node print a stack trace: noisy, not actionable.
- Silently skip and continue: hides failures.

## Risks / Trade-offs

- [Codex exec latency makes `start` feel slow] → Mitigation: print a "Setting up exercise…" spinner/message before stage calls; keep prompt payloads concise.
- [Author produces an exercise that fails to compile even with correct learner code] → Mitigation: reviewer will catch this as evidence of a bad exercise; surface in review output; learner can `end` and restart.
- [Session state grows large over many attempts] → Mitigation: cap attempt history to last 10 entries in storage; full history available in audit log.
- [Hint stage and reviewer both need evidence context; first attempt may have no prior run] → Mitigation: on first hint (attemptIndex 0), send empty evidence context; coach handles this via prompt instruction.

## Migration Plan

1. Add `exerciseLoop.js` with `setupExercise`, `runAttempt`, `requestHint`, `requestReview`.
2. Update `session.js` to call `setupExercise` at the end of `startSession`.
3. Add `attemptSession`, `hintSession`, `reviewSession` handlers to `session.js`.
4. Register `attempt`, `hint`, `review` in `cli.js` COMMANDS map.
5. Update session state structure in `createNewSession` to include exercise fields.
6. Add integration tests for the new commands.

Rollback: All new code is additive. Removing `exerciseLoop.js` and reverting the COMMANDS map restores the previous CLI surface without touching any existing module.

## Open Questions

- Should `hint` require an active run (at least one attempt) before calling coach, or allow hinting before any attempt?
- Should `review` re-run the reviewer stage or just display the last stored review?
