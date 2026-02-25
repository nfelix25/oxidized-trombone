## Why

The session registry now stores all sessions as named files, but the `session start` flow only offers to continue the single most-recently-touched session. Learners with multiple in-progress workspaces have no way to switch between them or resume an older session.

## What Changes

- **Session picker at `session start`**: When an existing session is detected, instead of a simple yes/no prompt, the learner sees a numbered list of all sessions from the index (most recent first, showing node, language, and date) plus a "Start new session" option at the bottom
- **`session list` command**: New command that prints the full session index in a human-readable table — id (short), node, language, status, last accessed
- **`session resume <id>` command** (or `session resume` with picker): Resumes a specific session by short ID prefix or presents the picker if no ID is given; sets it as the active (most-recently-accessed) session without re-running setup
- **Stale session cleanup in the picker**: Sessions whose workspace directory no longer exists are shown with a `[workspace missing]` label so learners know they can't be resumed as-is

## Capabilities

### New Capabilities
- `session-picker`: Interactive numbered list of all sessions at `session start`; `session list` command; `session resume` command

### Modified Capabilities
- `session-registry`: The "active session" prompt at `session start` is replaced by the full picker

## Impact

- `src/session/session.js` — `startSession()` replaces yes/no prompt with `runSessionPicker()`; new `listSessions()` and `resumeSessionById()` exports
- `src/session/cli.js` — wire `list` and updated `resume` commands
- `src/session/sessionPicker.js` — new module: `runSessionPicker(rl, storage)` renders the list and returns the chosen session or `null` (start new)
- `.state/sessions/index.json` — read-only impact; no schema changes
