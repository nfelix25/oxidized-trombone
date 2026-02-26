## 1. Schema and Fixture Updates

- [ ] 1.1 Add required `section_title: string` field to `src/schemas/lesson_section_v1.schema.json`
- [ ] 1.2 Update all existing `lesson_section_v1` fixture files under `fixtures/valid/` to include a `section_title` field
- [ ] 1.3 Add a new invalid fixture for `lesson_section_v1` missing `section_title` under `fixtures/invalid/`
- [ ] 1.4 Run `npm run test:fixtures` and confirm all fixture tests pass

## 2. Lesson Prompt Hardening

- [ ] 2.1 Update Rust `lesson-expand` instruction in `src/config/languages.js` to require `section_title` output matching the section intent (e.g., "Hook", "Core Concept", "Worked Example: X", "Pitfalls", "Comparison: X vs Y", "Bridge")
- [ ] 2.2 Update C `lesson-expand` instruction with same `section_title` requirement
- [ ] 2.3 Update C++ `lesson-expand` instruction with same `section_title` requirement
- [ ] 2.4 Update Python `lesson-expand` instruction with same `section_title` requirement
- [ ] 2.5 Update Zig `lesson-expand` instruction with same `section_title` requirement
- [ ] 2.6 Update `assembleLessonFile` in `src/runtime/materialize.js` to prepend `## {section_title}\n\n` before each section's content

## 3. Coach Free-Form Message Extension

- [ ] 3.1 Add optional `user_message` field to `hint_pack_v1` schema (or to the context packet schema used by the coach stage)
- [ ] 3.2 Update `buildCoachPacket` in `src/session/exerciseLoop.js` to accept and forward `user_message` via `attemptContext`
- [ ] 3.3 Update Rust coach stage instruction in `src/config/languages.js` to acknowledge: when `user_message` is present, respond to the specific question first before the hint-level content
- [ ] 3.4 Update C, C++, Python, Zig coach instructions with the same `user_message` handling
- [ ] 3.5 Update `requestHint` in `src/session/exerciseLoop.js` to accept `options.userMessage` and pass it to `buildCoachPacket`
- [ ] 3.6 Update `hintSession` in `src/session/session.js` to accept a `--message` arg (for CLI parity)

## 4. Exercise Loop Event Callbacks

- [ ] 4.1 Add `onEvent(event)` callback option to `runExpandLoop` in `src/session/exerciseLoop.js`; replace `process.stdout.write` calls with `options.onEvent?.(event) ?? process.stdout.write(text)`
- [ ] 4.2 Add `onEvent` callback threading to `setupExercise` in `src/session/exerciseLoop.js` with backward-compatible fallback
- [ ] 4.3 Add `onEvent` callback threading to `runAttempt` in `src/session/exerciseLoop.js`
- [ ] 4.4 Add `runExerciseStreaming(workspaceDir, language, onLine)` function to `src/runtime/commandRunner.js` that emits lines via callback as they arrive from the test subprocess

## 5. Express Server — Core Setup

- [ ] 5.1 Add `express` to `package.json` dependencies
- [ ] 5.2 Create `src/server/index.js` — Express app with JSON body parsing, CORS headers, static file serving from `client/dist/` when it exists, and a `npm run serve` script entry in `package.json`
- [ ] 5.3 Create `src/server/streaming/sessionBus.js` — `Map<sessionId, EventEmitter>` registry with `create(id)`, `emit(id, event)`, `subscribe(id, handler)`, and `destroy(id)` helpers
- [ ] 5.4 Create `src/server/middleware/errorHandler.js` — centralized JSON error response middleware

## 6. Express Server — Curriculum Routes

- [ ] 6.1 Create `src/server/routes/curriculum.js` with `GET /api/curriculum` returning all language curricula with global mastery merged in
- [ ] 6.2 Add `GET /api/curriculum?language=:lang` filtering support

## 7. Express Server — Session Routes

- [ ] 7.1 Create `src/server/routes/sessions.js` with `GET /api/sessions` listing all sessions from the index
- [ ] 7.2 Add `GET /api/sessions/:id` returning the full session object
- [ ] 7.3 Add `POST /api/sessions` — creates session, registers EventEmitter in sessionBus, starts `setupExercise` with `onEvent` callback in background, returns `{ sessionId }` immediately
- [ ] 7.4 Add `GET /api/sessions/:id/events` — SSE endpoint that subscribes to sessionBus and forwards events; closes on completion or client disconnect
- [ ] 7.5 Add `DELETE /api/sessions/:id` — ends session, saves global mastery, returns summary and recommendations
- [ ] 7.6 Add `POST /api/sessions/:id/attempt` — responds as SSE stream; calls `runExerciseStreaming` emitting `test-output` lines, then calls `runAttempt` for reviewer, emits reviewer result, closes stream; saves updated session
- [ ] 7.7 Add `POST /api/sessions/:id/hint` — accepts `{ message? }`, calls `requestHint` with `userMessage`, returns `{ level, text }`

## 8. Express Server — Workspace Routes

- [ ] 8.1 Create `src/server/routes/workspace.js` with `GET /api/sessions/:id/workspace` listing workspace files
- [ ] 8.2 Add `GET /api/sessions/:id/workspace/*filepath` returning file content
- [ ] 8.3 Add `PUT /api/sessions/:id/workspace/*filepath` writing file content to disk and returning `{ saved: true }`
- [ ] 8.4 Add `GET /api/sessions/:id/lesson` returning raw LESSON.md content

## 9. Client — Project Setup

- [ ] 9.1 Scaffold Vite + React app in `client/` using `npm create vite@latest client -- --template react`
- [ ] 9.2 Add `@monaco-editor/react` and `monaco-editor` to `client/package.json`
- [ ] 9.3 Configure Vite proxy in `client/vite.config.js`: `/api` → `http://localhost:3001`
- [ ] 9.4 Add a `marked` or equivalent markdown renderer to client dependencies for lesson rendering
- [ ] 9.5 Set up base CSS/layout (CSS variables for colors, font, pane sizing)

## 10. Client — Routing and App Shell

- [ ] 10.1 Set up client-side routing (React Router or similar) with routes: `/` (Home), `/select` (NodeSelector), `/loading/:sessionId` (Loading), `/session/:sessionId` (Exercise)
- [ ] 10.2 Create `client/src/hooks/useSSE.js` — generic hook that opens an EventSource, collects events, and cleans up on unmount
- [ ] 10.3 Create `client/src/hooks/useSession.js` — fetches session data and exposes `attempt()`, `hint(message?)`, and `end()` actions
- [ ] 10.4 Create `client/src/hooks/useWorkspace.js` — fetches file list, reads files, and debounced auto-save writes

## 11. Client — Home Screen

- [ ] 11.1 Create `client/src/screens/Home.jsx` listing sessions from `GET /api/sessions` with node, language, status, and last-accessed
- [ ] 11.2 Add "New session" button navigating to `/select`
- [ ] 11.3 Add click-to-resume on existing session rows navigating to `/session/:id`

## 12. Client — Node Selector Screen

- [ ] 12.1 Create `client/src/screens/NodeSelector.jsx` with language picker as first step
- [ ] 12.2 Render curriculum tree grouped by track using data from `GET /api/curriculum?language=:lang`
- [ ] 12.3 Show mastery level badges (D0/D1/D2/D3) per node
- [ ] 12.4 Show locked state and tooltip with missing prerequisite IDs for ineligible nodes
- [ ] 12.5 Add "Custom topic" input field that submits to `POST /api/sessions` with `customTopic`
- [ ] 12.6 On node confirm, call `POST /api/sessions`, navigate to `/loading/:sessionId`

## 13. Client — Loading Screen

- [ ] 13.1 Create `client/src/screens/Loading.jsx` that opens SSE to `/api/sessions/:id/events` via `useSSE`
- [ ] 13.2 Render current stage name and iteration progress (e.g., "lesson loop — 7 / 12")
- [ ] 13.3 Add spinner component that shows while stage status is `running`
- [ ] 13.4 Add toggleable log panel showing all received SSE events as timestamped lines
- [ ] 13.5 On `{ type: "complete" }` event, navigate to `/session/:sessionId`
- [ ] 13.6 On SSE disconnect, poll `GET /api/sessions/:id` every 3s and navigate to Exercise screen when session status is `active`

## 14. Client — Exercise Screen Layout

- [ ] 14.1 Create `client/src/screens/Exercise.jsx` with three-pane context-sensitive layout: lesson (left), editor (right), feedback (bottom strip)
- [ ] 14.2 Implement layout mode switching: `reading` (lesson 50 / editor 50), `coding` (lesson collapsed / editor full), `reviewing` (feedback expanded)
- [ ] 14.3 Add draggable pane divider between lesson and editor
- [ ] 14.4 Add keyboard shortcuts: `Ctrl+R` / `Cmd+R` to run tests, `Ctrl+H` / `Cmd+H` to request hint, `Escape` to toggle lesson collapse
- [ ] 14.5 Add status bar at top: node ID, language, depth target, attempt count, hint level used, save indicator

## 15. Client — Lesson Pane

- [ ] 15.1 Create `client/src/components/LessonPane.jsx` fetching lesson from `GET /api/sessions/:id/lesson`
- [ ] 15.2 Parse LESSON.md by splitting on `## ` headings into sections array `[{ title, content }]`
- [ ] 15.3 Render each section as a collapsible accordion with the heading as the toggle button
- [ ] 15.4 Render section content as HTML with markdown-it or marked, with code blocks syntax-highlighted
- [ ] 15.5 Add "Expand all" / "Collapse all" controls at the top of the lesson pane

## 16. Client — Monaco Editor Pane

- [ ] 16.1 Create `client/src/components/EditorPane.jsx` using `@monaco-editor/react`
- [ ] 16.2 Fetch file list from `GET /api/sessions/:id/workspace` and render file tabs
- [ ] 16.3 Fetch active file content from `GET /api/sessions/:id/workspace/*filepath` on tab switch
- [ ] 16.4 Implement debounced auto-save (800ms) via `PUT /api/sessions/:id/workspace/*filepath`
- [ ] 16.5 Show saving/saved indicator in the active tab label
- [ ] 16.6 Map file extension to Monaco language mode: `.rs` → `rust`, `.c`/`.h` → `c`, `.cpp`/`.hpp` → `cpp`, `.py` → `python`, `.zig` → `zig`
- [ ] 16.7 Configure Monaco editor options: `fontSize: 14`, `minimap: { enabled: false }`, `scrollBeyondLastLine: false`, `wordWrap: "on"`

## 17. Client — Feedback and Test Output Pane

- [ ] 17.1 Create `client/src/components/FeedbackPane.jsx` with a "Run tests" button that calls `attempt()` from `useSession`
- [ ] 17.2 Open SSE stream on attempt, append `test-output` lines to output panel in real time
- [ ] 17.3 Show PASS/FAIL badge and exit code when `test-done` event arrives
- [ ] 17.4 Show reviewer score, pass/fail, and feedback text when reviewer result arrives
- [ ] 17.5 Retain scrollback of previous attempt outputs, separated by attempt number headers

## 18. Client — Coach Panel

- [ ] 18.1 Create `client/src/components/CoachPanel.jsx` showing current hint level indicator
- [ ] 18.2 Add "Request hint" button calling `hint()` and displaying returned text
- [ ] 18.3 Add free-form message textarea and "Ask coach" submit button calling `hint(message)`
- [ ] 18.4 Display hint responses in a scrollable history list showing level and text
- [ ] 18.5 Show "L3 reached" state and replay stored text when ladder is exhausted

## 19. Client — Session Summary Screen

- [ ] 19.1 Create session summary view rendered within the Exercise screen after `end()` is called
- [ ] 19.2 Display attempt count, final score, mastery change (before → after), and dominant misconception tags
- [ ] 19.3 Render recommended next nodes as clickable links navigating to NodeSelector with node pre-selected
- [ ] 19.4 Add "Start new session" button navigating to `/select`

## 20. Integration and Polish

- [ ] 20.1 Add `npm run serve` script to root `package.json` (`node src/server/index.js`)
- [ ] 20.2 Add `npm run dev:server` script (`node --watch src/server/index.js`) for development
- [ ] 20.3 Update root `README.md` Development section with web frontend setup instructions
- [ ] 20.4 Test full session flow end-to-end: start → loading → exercise → attempt → hint → end
- [ ] 20.5 Verify CLI (`npm run session`) still works unchanged after all backend modifications
- [ ] 20.6 Run `npm test` and confirm all 175 existing tests pass with no regressions
