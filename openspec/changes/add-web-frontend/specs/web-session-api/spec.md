## ADDED Requirements

### Requirement: Server Exposes REST Endpoints for Session Lifecycle
The system SHALL provide an Express HTTP server on a configurable port (default 3001) exposing REST endpoints for session creation, retrieval, listing, and termination. All endpoints SHALL return JSON.

#### Scenario: List sessions
- **WHEN** `GET /api/sessions` is requested
- **THEN** the server returns an array of session index entries ordered by last-accessed descending

#### Scenario: Get single session
- **WHEN** `GET /api/sessions/:id` is requested with a valid session ID
- **THEN** the server returns the full session object including mastery state, attempt history, and exercise metadata

#### Scenario: Get single session not found
- **WHEN** `GET /api/sessions/:id` is requested with an unknown ID
- **THEN** the server returns 404 with a machine-readable error

#### Scenario: Create session returns session ID immediately
- **WHEN** `POST /api/sessions` is called with `{ language, nodeId }`
- **THEN** the server returns `{ sessionId }` within one second and begins session setup in the background

#### Scenario: Create session with custom topic
- **WHEN** `POST /api/sessions` is called with `{ language, customTopic }`
- **THEN** the server maps the topic to curriculum nodes and begins setup, returning `{ sessionId }`

#### Scenario: End session
- **WHEN** `DELETE /api/sessions/:id` is requested
- **THEN** the server marks the session ended, saves global mastery, and returns `{ summary, recommendations }`

### Requirement: Server Streams Session Setup Progress via SSE
The system SHALL expose a Server-Sent Events endpoint for session setup progress. Events SHALL be emitted at stage and iteration granularity throughout the scaffold and expand loops.

#### Scenario: Client receives scaffold progress
- **WHEN** a client subscribes to `GET /api/sessions/:id/events` during session setup
- **THEN** the server emits `{ stage: "scaffold", status: "running" }` when the scaffold call begins and `{ stage: "scaffold", status: "done", scaffoldId }` when it completes

#### Scenario: Client receives expand loop iteration progress
- **WHEN** the starter, test, or lesson expand loop is running
- **THEN** the server emits `{ stage, iteration, of, status }` for each iteration start and completion

#### Scenario: Client receives completion event
- **WHEN** all expand loops complete and the workspace is written
- **THEN** the server emits `{ type: "complete", session: <full session object> }` and closes the SSE stream

#### Scenario: SSE stream closes on client disconnect
- **WHEN** the client disconnects from the SSE stream before completion
- **THEN** the server stops sending events but does NOT cancel the background Codex subprocess — session setup completes and is saved normally

#### Scenario: No active setup stream
- **WHEN** a client subscribes to events for a session that has no active setup in progress
- **THEN** the server emits `{ type: "error", message: "no active stream" }` and closes

### Requirement: Server Streams Test Attempt Output via SSE
The system SHALL expose a Server-Sent Events endpoint for test attempt execution, streaming compiler/test output line by line before delivering the reviewer result.

#### Scenario: Test output lines stream in real time
- **WHEN** `POST /api/sessions/:id/attempt` is called
- **THEN** the server responds as an SSE stream, emitting `{ type: "test-output", line }` for each line of stdout/stderr as it arrives

#### Scenario: Test completion event emitted
- **WHEN** the test process exits
- **THEN** the server emits `{ type: "test-done", exitCode, ok }` before beginning the reviewer stage

#### Scenario: Reviewer result delivered via SSE
- **WHEN** the reviewer stage completes
- **THEN** the server emits `{ type: "reviewer", status: "done", passFail, score, feedback }` and closes the stream

### Requirement: Server Exposes Hint Endpoint with Optional Free-Form Message
The system SHALL expose a hint endpoint that accepts an optional user message, forwarding it to the coach stage for context-aware responses.

#### Scenario: Hint without user message
- **WHEN** `POST /api/sessions/:id/hint` is called without a `message` field
- **THEN** the server invokes the coach stage with the current hint level and returns `{ level, text }`

#### Scenario: Hint with free-form user message
- **WHEN** `POST /api/sessions/:id/hint` is called with `{ message: "why does the borrow checker reject X?" }`
- **THEN** the server forwards the message to the coach stage context and returns a response addressing the specific question

#### Scenario: Hint at maximum level
- **WHEN** `POST /api/sessions/:id/hint` is called and hint level is already at 3
- **THEN** the server returns the stored L3 hint text without calling the coach stage again

### Requirement: Server Exposes Workspace File Endpoints for Monaco Integration
The system SHALL expose endpoints to list, read, and write workspace source files, enabling the browser editor to load and auto-save code without file system access.

#### Scenario: List workspace files
- **WHEN** `GET /api/sessions/:id/workspace` is requested
- **THEN** the server returns an array of `{ path, relativePath }` entries for all source and test files in the session workspace

#### Scenario: Read workspace file
- **WHEN** `GET /api/sessions/:id/workspace/*filepath` is requested
- **THEN** the server returns `{ path, content }` for the file

#### Scenario: Write workspace file
- **WHEN** `PUT /api/sessions/:id/workspace/*filepath` is called with `{ content }`
- **THEN** the server writes the content to disk and returns `{ saved: true }`

#### Scenario: Read lesson file
- **WHEN** `GET /api/sessions/:id/lesson` is requested
- **THEN** the server returns `{ content }` containing the raw LESSON.md text

### Requirement: Server Exposes Curriculum and Mastery Endpoints
The system SHALL expose a curriculum endpoint combining node metadata and current global mastery state, enabling the node selector screen to show eligibility and progress.

#### Scenario: Curriculum endpoint returns nodes with mastery
- **WHEN** `GET /api/curriculum` is requested
- **THEN** the server returns `{ languages, nodesByLanguage, mastery }` where `mastery` reflects the current global mastery state from `.state/progress/global_mastery.json`

#### Scenario: Curriculum filters by language
- **WHEN** `GET /api/curriculum?language=rust` is requested
- **THEN** the server returns only nodes for the Rust curriculum with mastery data

### Requirement: Server Serves Frontend Static Files in Production
The system SHALL serve the compiled frontend from `client/dist/` when `NODE_ENV=production` or when the dist directory exists, enabling single-command local operation.

#### Scenario: Production static file serving
- **WHEN** the server starts and `client/dist/index.html` exists
- **THEN** all non-API requests are served from `client/dist/`, enabling the SPA to load at `/`

#### Scenario: API routes take precedence over static files
- **WHEN** a request matches `/api/*`
- **THEN** the Express router handles it before the static file middleware
