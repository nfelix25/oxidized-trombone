## Context

The platform now supports Rust and C, with Zig planned. Currently:
- `allCurricula` merges all language nodes into one graph; `runGuidedNav` shows all tracks regardless of language
- A single `.state/sessions/active_session.json` holds the one active session; no history, no resumability list
- Language is set on the session node after node selection, not before it
- No infrastructure exists for custom (user-defined) topics

This change makes language a first-class selection step and prepares the session model for multi-session management and custom topics.

## Goals / Non-Goals

**Goals:**
- Language selection is the first step when starting a new session
- Track/node list is filtered to the selected language only
- Session state is stored as named files (`<uuid>.json`) with an `index.json` for metadata
- "Active" session concept is preserved (most recently touched entry in index)
- `getCurriculumForLanguage(lang)` and `getAvailableLanguages()` are exported as stable APIs
- Custom topics infrastructure: per-language flat storage + "Custom" entry in track picker
- Architecture must not block future: adding Zig (registry entry only), generating new custom topics

**Non-Goals:**
- In-progress session picker UI (full session list / resume-by-name) — deferred
- Adding Zig language entry — deferred
- Custom topic generation (AI-assisted topic creation) — deferred
- Prerequisite graph / subnodes for custom topics

## Decisions

### D1: Session storage as named files + index

**Decision:** Each session is saved at `.state/sessions/<uuid>.json`. A separate `.state/sessions/index.json` holds an array of metadata entries `{ id, nodeId, language, startedAt, lastAccessedAt }`. "Active" = the entry with the latest `lastAccessedAt`.

**Alternative considered:** Keep `active_session.json` as the sole store.
**Rejected because:** Doesn't support session history, resumability, or future session picker.

**Alternative considered:** Single `sessions.json` file with all sessions embedded.
**Rejected because:** Concurrent writes and large file sizes as history grows; per-file is simpler to read/write.

**Migration:** Existing `active_session.json` is read on first load as a fallback; subsequent saves write to the new format. Tests that stub `active_session.json` will be updated.

---

### D2: Language selection before node selection

**Decision:** `startSession()` presents language choice (via `selectLanguage(rl)`) before calling `runGuidedNav`. `runGuidedNav` receives a language-filtered graph.

**Alternative considered:** Infer language from the selected node.
**Rejected because:** Cross-language leakage in the track list confuses users and breaks the UX promise of "show only what's relevant."

**Implementation note:** `selectLanguage(rl)` calls `getAvailableLanguages()` from the registry, so adding a new language requires only a registry entry.

---

### D3: getCurriculumForLanguage() in allCurricula.js

**Decision:** A new exported function filters `allCurricula` to only nodes whose `node.language === lang`, then rebuilds the track map to include only tracks that have at least one matching node (with their node lists filtered too).

```
getCurriculumForLanguage(lang) → CurriculumGraph
```

**Alternative considered:** Language-specific graphs exported separately.
**Rejected because:** Requires updating all import sites when a new language is added; a single filtering function is more maintainable.

---

### D4: Custom topics as language-scoped flat files

**Decision:** Custom topics stored at `.state/custom_topics/<language>.json` as an array of lightweight node objects `{ id, name, language, keywords: [] }`. They are presented as a synthetic "Custom" track in `runGuidedNav` when topics exist for the selected language.

**Rationale:** Matches the existing node shape well enough for session creation without introducing a parallel data model. The `keywords: []` field keeps the shape extensible for future topic generation.

**Alternative considered:** Storing custom topics inside the curriculum graph.
**Rejected because:** The curriculum graph is read-only / source-controlled; user-generated topics belong in `.state/`.

**Alternative considered:** Single global custom topics file.
**Rejected because:** Per-language files make `getCurriculumForLanguage()` trivially applicable and prevent cross-language contamination.

---

### D5: getAvailableLanguages() in languages.js

**Decision:** Exported function that returns `Object.keys(LANGUAGE_REGISTRY)`. Language selection UI calls this dynamically, so adding a new registry entry automatically exposes it.

## Risks / Trade-offs

**Test churn** → Tests that read/write `active_session.json` directly will break. Mitigation: update test helpers to write the new index + per-file format; `MemoryStorageAdapter` already used in most tests, so impact is limited.

**Index/file drift** → A crash mid-write could leave an orphan `<uuid>.json` with no index entry, or an index entry pointing to a missing file. Mitigation: on load, validate the indexed file exists; silently skip stale index entries.

**Custom topic node shape** → Custom topics need enough fields for session creation (id, name, language). Using the same shape as curriculum nodes (`createNode`) risks confusion. Mitigation: store a `_custom: true` flag; session code treats custom nodes identically at runtime.

**Backward compat** → Existing sessions have no `language` field; the system already defaults these to `"rust"`. The new flow sets language at session creation, so all new sessions are correct. Old sessions remain functional.

## Migration Plan

1. `getAvailableLanguages()` and `getCurriculumForLanguage()` added first (no breaking changes)
2. `selectLanguage(rl)` added to `modeSelect.js`; `startSession()` updated to call it
3. Session storage switched to index + per-file; `saveSession` writes both files; `loadActiveSession` reads index to find most-recent, falls back to `active_session.json` if index is empty
4. `runGuidedNav` updated to receive pre-filtered graph + optional custom topics list
5. Custom topics storage + "Custom" track entry added to guidedNav
6. Tests updated: stubs write to `<uuid>.json` + `index.json`

## Open Questions

- Should "Continue most recent session" be suppressed if that session was marked complete? (Proposed: yes — only offer resume for incomplete sessions. Deferred: not blocking initial implementation.)
