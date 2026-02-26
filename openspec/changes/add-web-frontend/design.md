## Context

The learning CLI currently works as a sequence of terminal commands (`npm run session start`, `attempt`, `hint`, etc.) with lesson content in a separate file and code editing in whatever `$EDITOR` is configured. Every learning action requires a context switch. The goal is a browser-based alternative that keeps lesson, editor, streaming test output, and coaching feedback in one surface without replacing the CLI.

The existing codebase is well-factored: session logic, exercise orchestration, mastery tracking, and curriculum data are all modular Node.js functions. The server layer is primarily a thin HTTP wrapper around these functions. The main adaptation needed is replacing direct `process.stdout.write` calls with an event callback that both CLI and server can consume.

Single user, personal local machine. No auth, no multi-tenancy, no deployment concerns.

## Goals / Non-Goals

**Goals:**
- Browser-based exercise experience with Monaco editor, rendered+collapsible lesson, and real-time test output
- Express REST+SSE server wrapping existing session logic without forking it
- CLI (`npm run session`) continues to work unchanged
- Structured lesson sections (with `section_title`) enabling collapsible UI
- Free-form coach messaging alongside L1/L2/L3 hint ladder
- Single-command local start in production mode

**Non-Goals:**
- Multi-user or cloud deployment
- Authentication or session isolation
- WebSocket bidirectional streaming (SSE is sufficient)
- Token-level Codex output streaming (Codex exec does not stream mid-response)
- A built-in terminal emulator or shell inside the browser

## Decisions

### Decision 1: REST + SSE over WebSockets

**Chosen:** HTTP REST for request/response actions, SSE for the two long-running streams (session setup and test attempt).

**Rationale:** Only two operations need server-push: the scaffold/expand loop during session setup, and `cargo test` / `make test` output during an attempt. SSE is HTTP-native, trivial to proxy through Vite's dev server, and requires no extra library. WebSockets would add handshake complexity and a library dependency for no benefit at this scale.

**Alternative considered:** `ws` or `socket.io` — rejected. Bidirectional messaging is not needed; all actions are client-initiated.

---

### Decision 2: React + Vite + `@monaco-editor/react`

**Chosen:** React/Vite for the frontend, `@monaco-editor/react` for the embedded editor.

**Rationale:** `@monaco-editor/react` is the first-class wrapper around the same engine powering VS Code — syntax highlighting, bracket matching, multi-file tabs, and familiar keybindings work out of the box. The user has JS/React familiarity. Vite's dev proxy (`/api → localhost:3001`) eliminates CORS config during development.

**Alternative considered:** SvelteKit — good framework but Monaco integration is community-maintained and less complete. Plain HTML + htmx — poor Monaco integration, no component model for the complex exercise screen split layout.

---

### Decision 3: `onEvent` callback for backward-compatible streaming

**Chosen:** Thread an optional `onEvent(event)` callback through `exerciseLoop.js` options. When absent, falls back to existing `process.stdout.write` behavior. Server routes pass a callback that pipes events to the SSE response.

**Rationale:** Zero code duplication between CLI and server. The exercise loop is the same function regardless of consumer. Adding a parallel "server exercise runner" would create divergence risk.

**Shape of events emitted:**
```json
{ "stage": "scaffold", "status": "running" }
{ "stage": "scaffold", "status": "done", "scaffoldId": "ex-a1b2" }
{ "stage": "starter", "iteration": 1, "of": 8, "status": "running" }
{ "stage": "starter", "iteration": 1, "of": 8, "status": "done" }
{ "type": "complete", "session": { ...full session object... } }
```

---

### Decision 4: In-memory EventEmitter registry for SSE

**Chosen:** `Map<sessionId, EventEmitter>` in `src/server/streaming/sessionBus.js`. POST `/api/sessions` creates the session ID and emitter, starts background processing, returns `{ sessionId }`. Client immediately opens SSE at `GET /api/sessions/:id/events`. Emitter is cleaned up on stream close or completion.

**Rationale:** Single user, single process. No persistence of in-flight event state is needed. If the browser tab closes during setup, the Codex subprocess continues to completion (acceptable) and the session file is saved normally.

**Alternative considered:** Queue-based (Bull, BullMQ) — rejected. Unnecessary infrastructure for a personal app. Redis pub/sub — same rejection.

---

### Decision 5: `client/` at repo root, served statically by Express in production

**Chosen:** `client/` is a standalone Vite app at the repo root. In dev: two processes (`node src/server/index.js` and `cd client && npm run dev`), Vite proxies `/api/*` to port 3001. In production: `npm run build` inside `client/` outputs to `client/dist/`, which Express serves as static files at `/`.

**Rationale:** Clean separation between server source (`src/`) and client source (`client/`). One-command prod start: `node src/server/index.js`. No nginx or separate static server needed.

**Alternative considered:** `src/client/` inside the server source tree — rejected (mixes build artifacts with runtime source). Separate repo — rejected (unnecessary for personal project, complicates shared development).

---

### Decision 6: `section_title` as required field in `lesson_section_v1`

**Chosen:** Add `section_title: string` as a required field to `lesson_section_v1`. All lesson-expand prompts updated to emit it. `materialize.js` prepends `## {section_title}\n\n` to each section's content before joining.

**Rationale:** The collapsible lesson UI depends on section boundaries being explicitly labeled. Making it required (not optional) forces consistent structure and avoids conditional UI rendering. The number of existing fixtures that need updating is small and tracked in tasks.

**Alternative considered:** Parse headings from `content` markdown — rejected. Current lesson content has no headings; this is the change we're making. Optional field — rejected; collapsible UI becomes fragile and inconsistent.

---

### Decision 7: Free-form coach message via context packet extension

**Chosen:** Add optional `user_message: string` to the coach context packet's `attemptContext`. The hint endpoint accepts `{ message? }` in the request body. Coach stage instructions updated to acknowledge: when `user_message` is present, respond to the specific question first, then provide the appropriate hint level.

**Rationale:** Minimal change — context packet already has an `attemptContext` object. No new schema version needed (optional field). Additive to the L1/L2/L3 ladder; the hint level still advances.

**Alternative considered:** Separate `/chat` endpoint — rejected (adds a new stage type and schema; the coach stage is already the right tool for directed feedback).

---

## Risks / Trade-offs

**[Risk] SSE connection drops during long setup (30+ Codex calls, 2-5 min)**
→ Client polls `GET /api/sessions/:id` after reconnect. If session is complete, transitions directly to Exercise screen. Codex subprocess is not cancelled on disconnect — session file is written regardless.

**[Risk] `section_title` requirement breaks existing lesson fixture files**
→ All fixture files under `fixtures/valid/` and `fixtures/invalid/` that contain `lesson_section_v1` objects need `section_title` added. Tracked as tasks. Schema validator will catch regressions.

**[Risk] Monaco bundle size (multi-MB)**
→ Vite code-splits Monaco lazily. First load on local machine is acceptable. Not a concern for a personal local app.

**[Risk] Multiple browser tabs during session setup**
→ Both tabs subscribe to the same EventEmitter. Duplicate SSE events are harmless (idempotent display updates). Acceptable for single-user use.

## Migration Plan

1. Existing `npm run session` CLI: no changes, continues to work
2. New command `npm run serve` starts Express server (port 3001)
3. Dev workflow: two terminals (server + `cd client && npm run dev`)
4. Production: `cd client && npm run build`, then `npm run serve` serves everything on port 3001
5. Fixture files updated in-place (no user migration needed)
6. `npm run test:fixtures` catches any fixture regressions

## Open Questions

- Should the server port (3001) be configurable via env var (`PORT`)? Likely yes, trivial to add.
- Does `codex exec` write anything useful to stderr during execution that could be surfaced in the log toggle panel? Worth checking during implementation; if yes, thread it through `onEvent`.
