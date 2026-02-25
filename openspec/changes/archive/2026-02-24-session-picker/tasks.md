## 1. Session Picker Module

- [x] 1.1 Create `src/session/sessionPicker.js` — export `runSessionPicker(rl, storage)`: reads `index.json`, checks workspace existence via `fs.access` for each entry, renders numbered list (most recent first) with short ID, node, language, last-accessed date, `[workspace missing]` label if needed, and "Start new session" as the last option; returns the loaded session object or `null` for "start new"
- [x] 1.2 Add `loadSessionById(storage, idPrefix)` to `src/session/session.js` — searches index for entries whose `id` starts with `idPrefix`, loads and returns the matching session (updating `lastAccessedAt`); throws descriptive errors on zero or multiple matches
- [x] 1.3 Add `listAllSessions(storage)` to `src/session/session.js` — reads `index.json` and checks workspace existence for each entry; returns array of `{ entry, workspaceExists }` objects sorted by `lastAccessedAt` descending

## 2. Update session start flow

- [x] 2.1 Update `startSession()` in `src/session/session.js` to call `runSessionPicker(rl, storage)` instead of the binary yes/no prompt when the index is non-empty; if picker returns a session, show workspace/exercise info and return; if `null`, proceed to language selection

## 3. session list command

- [x] 3.1 Add `listSessions()` function to `src/session/session.js` — calls `listAllSessions(storage)` and prints a formatted table: short ID (8 chars), node, language, last-accessed date, and `[workspace missing]` if applicable; prints "No sessions found." if index is empty
- [x] 3.2 Wire `list` command in `src/session/cli.js` to call `listSessions()`

## 4. session resume command

- [x] 4.1 Update `resumeSession(args)` in `src/session/session.js`: if `args[0]` is provided, call `loadSessionById(storage, args[0])` and print session info (updating `lastAccessedAt`); if no arg, call `runSessionPicker(rl, storage)` and handle chosen session
- [x] 4.2 Update `resume` command handler in `src/session/cli.js` to pass `args` through to `resumeSession`

## 5. Tests

- [x] 5.1 Write tests for `loadSessionById`: exact prefix loads correct session and updates index; ambiguous prefix throws; unknown prefix throws
- [x] 5.2 Write tests for `listAllSessions`: returns entries sorted by lastAccessedAt; missing workspace flagged; empty index returns empty array
- [x] 5.3 Run full test suite and confirm all tests pass
