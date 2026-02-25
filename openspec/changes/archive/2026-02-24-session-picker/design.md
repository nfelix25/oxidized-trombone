## Context

The session registry (`index.json` + per-UUID files) was introduced in `language-first-session-flow`. It tracks all sessions with `id`, `nodeId`, `language`, `startedAt`, and `lastAccessedAt`. Currently `startSession()` reads only the most-recent entry and presents a binary "continue or start new?" prompt. There is no way to see all sessions or resume a non-recent one.

The CLI already has a `resume` command (`session resume`) that simply prints the active session's metadata — it doesn't actually switch sessions.

## Goals / Non-Goals

**Goals:**
- Replace the binary prompt with a numbered list of all index entries at `session start`
- Add `session list` command to view all sessions in a table
- Make `session resume` actually useful: accept an optional short-ID argument to switch the active session; show the picker if no ID is given
- Show `[workspace missing]` for sessions whose `workspaceDir` no longer exists on disk
- Keep the implementation in a single new `sessionPicker.js` module so `session.js` stays focused

**Non-Goals:**
- Deleting or archiving old sessions (future work)
- Filtering or sorting the list beyond most-recent-first
- Paginating very long lists

## Decisions

### D1: Picker lives in `src/session/sessionPicker.js`

**Decision:** Extract picker UI into its own module: `runSessionPicker(rl, storage)` returns either a loaded session object (the chosen one) or `null` (user chose "Start new session").

**Rationale:** Keeps `session.js` readable; picker logic is self-contained and independently testable.

---

### D2: Workspace existence check uses `fs.access`

**Decision:** For each index entry, check whether `workspaceDir` exists using `fs.access` before rendering the row. If missing, append `[workspace missing]` to the label. The session is still selectable (learner may want to inspect it); attempting to resume it will fail gracefully if the workspace is gone.

**Alternative considered:** Filter out sessions with missing workspaces entirely.
**Rejected because:** The session data (lesson file, attempts) may still be useful; the learner should decide whether to continue or start fresh, not have the system decide for them.

---

### D3: `session resume` loads by short-ID prefix

**Decision:** `session resume <prefix>` searches the index for entries whose `id` starts with `prefix`. If exactly one match, load it and update `lastAccessedAt` (making it the new "active" session). If zero or multiple matches, print an error. If no argument given, show the picker.

**Rationale:** Short prefixes (first 8 chars) are shown in `session list` output, so users can copy-paste them easily. Full UUID support is free since prefix matching subsumes it.

---

### D4: `session list` reads index directly, no full session file load

**Decision:** `session list` reads only `index.json` and does an `fs.access` workspace check — it does NOT load each `<uuid>.json`. This keeps listing fast regardless of how many sessions exist.

**Rationale:** Full session objects can be large (contain mastery state, attempt history, etc.). The index metadata is sufficient for a human-readable list.

---

### D5: Picker slot "Start new session" is always the last option

**Decision:** The numbered list ends with `N+1) Start new session`. The user's existing choice of `n` in the old binary prompt maps naturally to selecting this slot.

## Risks / Trade-offs

**Long index lists** → No pagination. Mitigation: acceptable for now; most learners will have < 20 sessions.

**Stale index entries** → A session file may be missing even with a valid `workspaceDir`. Mitigation: `runSessionPicker` does the `fs.access` workspace check but also gracefully handles a missing session file by showing `[data missing]`.

**`session resume` prefix collision** → Two sessions could share a prefix if UUIDs collide in the first N chars. Mitigation: if multiple matches, print all and ask for a longer prefix.

## Open Questions

None — scope is well-defined.
