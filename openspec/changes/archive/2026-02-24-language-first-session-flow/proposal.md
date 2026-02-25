## Why

With C now supported alongside Rust, and Zig on the horizon, language selection must become an explicit first-class step in the session flow rather than an implicit property of the curriculum node chosen. Users should choose their language before browsing topics, so they only see relevant nodes. Additionally, the single-file `active_session.json` approach doesn't support session history or resumability.

## What Changes

- **Language selection first**: `npm run session start` now prompts for language before showing curriculum tracks
- **Language-scoped topic list**: After language selection, tracks and nodes shown are filtered to that language only; plus a "Custom" entry if per-language custom topics exist
- **Session registry (Option A)**: Each session saved as `<uuid>.json`; `index.json` tracks metadata (id, nodeId, language, startedAt); "active" pointer = most recently touched
- **`getCurriculumForLanguage(lang)`**: New function filtering `allCurricula` to nodes/tracks matching a language
- **`getAvailableLanguages()`**: Enumerates registered language IDs from the language registry for the selection UI
- **Custom topics infrastructure**: Per-language flat topic storage at `.state/custom_topics/<language>.json`; shown as a "Custom" entry in the track list alongside regular tracks; selecting it lists saved custom topics; must not block future "generate a new custom topic" flow

## Capabilities

### New Capabilities
- `language-first-session-flow`: Language selection step before curriculum navigation, language-scoped track/node filtering, and `getCurriculumForLanguage()` / `getAvailableLanguages()` APIs
- `session-registry`: Session storage as named files (`<uuid>.json`) plus `index.json` with metadata; active = most recently touched
- `custom-topics`: Per-language custom topic storage and display; "Custom" entry in track picker; no prerequisites or subnodes

### Modified Capabilities
- `session-exercise-loop`: Session creation flow updated to require language selection; session state schema unchanged but session loading now reads from registry

## Impact

- `src/curriculum/allCurricula.js` — add `getCurriculumForLanguage(lang)` export
- `src/config/languages.js` — add `getAvailableLanguages()` export
- `src/session/session.js` — `startSession()` refactored; session file I/O switches to per-file registry
- `src/session/cli.js` — session start and resume flows updated
- `src/session/modeSelect.js` — new `selectLanguage(rl)` function
- `src/session/guidedNav.js` — receives language-filtered graph instead of `allCurricula`
- `src/state/storage.js` — potentially extended with `list()` / `readAll()` for session index
- `.state/sessions/` — new per-session files + `index.json` (existing `active_session.json` superseded)
- `.state/custom_topics/` — new per-language custom topic files
- Existing tests that stub `active_session.json` will need updating
