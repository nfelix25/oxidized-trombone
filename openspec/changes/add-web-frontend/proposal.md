## Why

The existing session CLI requires constant context switching — reading the lesson in a file viewer, editing code in a separate editor, and running test commands in the terminal — which fragments the learning experience. A browser-based frontend with an embedded Monaco editor, rendered lesson pane, and real-time test feedback keeps every learning interaction in one place, enabling a proper IDE-like experience without leaving the environment.

## What Changes

- **New**: Express HTTP server wrapping existing session logic with REST endpoints and SSE streaming for long-running Codex calls
- **New**: React/Vite single-page app with Monaco editor, collapsible lesson pane, streaming test output panel, and coach/hint panel
- **New**: Monaco file editor with auto-save, replacing the `$EDITOR` hand-off pattern
- **Modified**: Lesson-expand prompts produce structured sections with explicit `section_title` output field, enabling collapsible UI sections; `lesson_section_v1` schema gains `section_title`
- **Modified**: Coach hint stage accepts an optional `user_message` field for free-form learner questions alongside the L1/L2/L3 ladder
- **Modified**: `exerciseLoop.js` gains an `onEvent` callback (backward-compatible with existing CLI stdout writes)
- **Modified**: `commandRunner.js` gains a streaming variant for line-by-line test output forwarding

## Capabilities

### New Capabilities

- `web-session-api`: Express server exposing REST endpoints and SSE streams for session lifecycle, workspace file I/O, and exercise actions (attempt, hint, end). Wraps existing `session.js` and `exerciseLoop.js` logic without modifying their core behavior.
- `web-learning-frontend`: React/Vite single-page app with context-sensitive split layout: home/session-picker screen, curriculum node selector, scaffold loading screen with streaming progress, and the main exercise screen (lesson pane + Monaco editor + feedback panel + coach panel).

### Modified Capabilities

- `learning-content-and-fixtures`: `lesson_section_v1` schema gains required `section_title` field. All lesson-expand prompts across all languages are updated to emit a concise heading per section (e.g., "Hook", "Core Concept", "Pitfalls") that drives collapsible UI rendering and LESSON.md structure.
- `codex-lesson-orchestration`: Coach hint stage context packet gains optional `user_message` field. When present, the coach responds to the learner's specific question rather than generating a generic L1/L2/L3 nudge.

## Impact

- New dependency: `express` (server), `react` + `vite` + `@monaco-editor/react` (frontend)
- `src/server/` added alongside existing `src/session/`, `src/runtime/`, etc.
- `client/` added at repo root (Vite app, proxies `/api/*` to Express in dev)
- Existing CLI (`npm run session`) unchanged — `onEvent` falls back to stdout when absent
- `.state/` file store used as-is by the server layer; no schema migration needed
- `lesson_section_v1` schema change is additive (new required field) — existing fixture files will need `section_title` added
- All 5 language lesson-expand prompts updated (Rust, C, C++, Python, Zig)
