## 1. Language Filtering APIs

- [x] 1.1 Add `getAvailableLanguages()` to `src/config/languages.js` — returns `Object.keys(LANGUAGE_REGISTRY)`
- [x] 1.2 Add `getCurriculumForLanguage(lang)` to `src/curriculum/allCurricula.js` — filters nodes to `node.language === lang`, rebuilds track map to include only tracks with matching nodes (filtered node lists)
- [x] 1.3 Write unit tests for `getCurriculumForLanguage`: rust-only graph, c-only graph, unknown lang returns empty graph
- [x] 1.4 Write unit tests for `getAvailableLanguages`: returns array containing "rust" and "c"

## 2. Session Registry Storage

- [x] 2.1 Update `saveSession(session)` in `src/session/session.js` to write `<uuid>.json` under `.state/sessions/` and upsert the session metadata entry in `.state/sessions/index.json` (fields: `id`, `nodeId`, `language`, `startedAt`, `lastAccessedAt`)
- [x] 2.2 Update `loadActiveSession()` in `src/session/session.js` to read `index.json`, pick the entry with the latest `lastAccessedAt`, load `<id>.json`, and update `lastAccessedAt` in the index; skip missing files silently
- [x] 2.3 Add legacy fallback in `loadActiveSession()`: when index is empty/missing, fall back to reading `active_session.json`
- [x] 2.4 Write tests for session registry: new session writes file + index entry; loadActiveSession picks most recent; stale index entry (missing file) is skipped; empty index falls back to legacy file

## 3. Language Selection UI

- [x] 3.1 Add `selectLanguage(rl)` to `src/session/modeSelect.js` — calls `getAvailableLanguages()`, presents numbered list, returns selected language string
- [x] 3.2 Update `startSession()` in `src/session/session.js` to call `selectLanguage(rl)` as the first step when starting a new session (after the resume/new branch, before `runGuidedNav`)

## 4. Language-Filtered Curriculum Navigation

- [x] 4.1 Update `startSession()` to call `getCurriculumForLanguage(language)` with the selected language and pass the filtered graph to `runGuidedNav` (replacing the current `allCurricula` reference)
- [x] 4.2 Verify `runGuidedNav` in `src/session/guidedNav.js` works correctly with a filtered graph that excludes tracks from other languages (no changes expected; confirm by running existing tests)

## 5. Custom Topics Infrastructure

- [x] 5.1 Create `src/session/customTopics.js` with `loadCustomTopics(language)` (reads `.state/custom_topics/<language>.json`, returns array or `[]` if missing) and `saveCustomTopic(topic)` (appends to per-language file; topic shape: `{ id, name, language, keywords: [] }`)
- [x] 5.2 Inject "Custom" track entry into `runGuidedNav` (or the caller) when `loadCustomTopics(language)` returns a non-empty array — "Custom" appears after regular tracks
- [x] 5.3 Implement custom topic selection flow: when learner picks the "Custom" entry, display topic names as numbered choices and return the selected topic as a node-like object (`{ id, name, language, keywords, _custom: true }`)
- [x] 5.4 Write tests for `loadCustomTopics`: returns empty array when file missing; returns topics from file when present; "Custom" track entry appears in navigation when topics exist

## 6. Test Updates and Verification

- [x] 6.1 Update test helpers in `tests/` that stub `active_session.json` to write/read using the new registry format (`index.json` + `<uuid>.json`); update storage adapter mocks as needed
- [x] 6.2 Update `cli-guided-flow.test.js`, `exercise-loop.test.js`, and `fallback-mode.test.js` to account for the language selection step (add language prompt response to mock sequences)
- [x] 6.3 Run full test suite and confirm all tests pass
