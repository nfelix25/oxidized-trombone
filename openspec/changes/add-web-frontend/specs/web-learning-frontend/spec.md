## ADDED Requirements

### Requirement: Frontend Provides Home Screen with Session Management
The system SHALL provide a home screen listing existing sessions and offering a button to start a new session. The home screen SHALL be the default landing page.

#### Scenario: Existing sessions displayed
- **WHEN** the home screen loads
- **THEN** it displays a list of sessions ordered by last-accessed, showing node ID, language, status, and last-accessed date for each

#### Scenario: Resume session from home screen
- **WHEN** the learner selects an existing session from the list
- **THEN** the frontend navigates to the Exercise screen for that session

#### Scenario: Start new session from home screen
- **WHEN** the learner clicks "New session"
- **THEN** the frontend navigates to the Node Selector screen

### Requirement: Frontend Provides Curriculum Node Selector
The system SHALL provide a node selector screen where the learner chooses a language and curriculum node before session setup begins. The selector SHALL show mastery state and prerequisite eligibility for each node.

#### Scenario: Language selection is the first step
- **WHEN** the node selector screen loads
- **THEN** the learner sees a language picker (Rust, C, C++, Python, Zig) before viewing nodes

#### Scenario: Curriculum tree shows mastery and eligibility
- **WHEN** a language is selected
- **THEN** the selector displays nodes grouped by track, with mastery level indicators (D0–D3) and locked state for nodes with unmet prerequisites

#### Scenario: Locked node shows missing prerequisites
- **WHEN** the learner hovers or focuses a locked node
- **THEN** the selector displays the missing prerequisite node IDs

#### Scenario: Custom topic entry
- **WHEN** the learner selects "Custom topic" and types a topic string
- **THEN** the selector shows mapped nodes and prerequisite gap information before allowing session start

#### Scenario: Session starts on node confirmation
- **WHEN** the learner confirms a node selection
- **THEN** the frontend calls `POST /api/sessions`, receives a session ID, and navigates to the Loading screen

### Requirement: Frontend Shows Loading Screen with Streaming Setup Progress
The system SHALL display a loading screen during session setup that shows stage-by-stage progress from the SSE stream and allows toggling a detailed log view.

#### Scenario: Stage progress is shown
- **WHEN** the SSE stream emits stage events during setup
- **THEN** the loading screen shows the current stage name and iteration count with a spinner

#### Scenario: Log toggle shows raw event stream
- **WHEN** the learner toggles the log panel open
- **THEN** all SSE events received so far are displayed as timestamped log lines

#### Scenario: Completion transitions to Exercise screen
- **WHEN** the SSE stream emits a `{ type: "complete" }` event
- **THEN** the frontend navigates to the Exercise screen with the completed session

#### Scenario: Connection drop during setup
- **WHEN** the SSE connection is lost during setup
- **THEN** the frontend displays a reconnecting indicator and polls `GET /api/sessions/:id` until the session status is `active`

### Requirement: Frontend Provides Context-Sensitive Exercise Screen Layout
The system SHALL provide the main exercise screen with a split layout that adapts based on the current activity: reading (lesson dominant), coding (editor dominant), or reviewing feedback (feedback dominant).

#### Scenario: Default layout shows lesson and editor side by side
- **WHEN** the Exercise screen first loads
- **THEN** the lesson pane occupies the left half and the editor pane occupies the right half, with a feedback strip at the bottom

#### Scenario: Layout shifts to editor-dominant during active coding
- **WHEN** the learner focuses the Monaco editor
- **THEN** the editor pane expands and the lesson pane collapses to an icon/tab

#### Scenario: Layout shifts to feedback-dominant after test run
- **WHEN** a test attempt completes
- **THEN** the feedback panel expands to show full test output and reviewer verdict, with lesson and editor accessible via tabs

#### Scenario: Learner can manually toggle pane sizes
- **WHEN** the learner drags the pane divider or uses keyboard shortcuts
- **THEN** the layout adjusts and persists for the duration of the session

### Requirement: Frontend Embeds Monaco Editor with File Tabs and Auto-Save
The system SHALL embed a Monaco editor with full syntax highlighting, multi-file tab navigation, and auto-save that persists edits to the server workspace without requiring explicit save actions.

#### Scenario: Editor loads with correct language mode
- **WHEN** the editor opens a `.rs` file
- **THEN** Monaco activates Rust syntax highlighting and bracket matching; `.c` files use C mode; `.py` files use Python mode; etc.

#### Scenario: Multi-file tabs
- **WHEN** the session workspace contains multiple source files
- **THEN** the editor shows a tab bar; switching tabs loads the corresponding file content

#### Scenario: Auto-save on change
- **WHEN** the learner stops typing for 800ms
- **THEN** the editor sends a `PUT /api/sessions/:id/workspace/*filepath` request with the current content

#### Scenario: Save indicator
- **WHEN** auto-save is in progress or complete
- **THEN** the editor tab shows a "saving…" / "saved" indicator

### Requirement: Frontend Renders Lesson with Collapsible Sections
The system SHALL render the LESSON.md content as formatted markdown with each `section_title`-delimited section collapsible independently.

#### Scenario: Lesson sections render as collapsible accordions
- **WHEN** the lesson pane loads
- **THEN** each `## {section_title}` heading is rendered as an expandable accordion, initially all expanded

#### Scenario: Learner can collapse individual sections
- **WHEN** the learner clicks a section heading
- **THEN** that section collapses, freeing vertical space for other sections

#### Scenario: Code blocks render with syntax highlighting
- **WHEN** the lesson contains a fenced code block with a language tag
- **THEN** the code is rendered with syntax-highlighted colors matching the language

#### Scenario: Lesson pane is independently scrollable
- **WHEN** the lesson content exceeds the pane height
- **THEN** the lesson pane scrolls independently of the editor pane

### Requirement: Frontend Streams Test Output in Real Time
The system SHALL display test output line by line as it arrives from the server SSE stream, providing immediate feedback during long-running test runs.

#### Scenario: Test output appears as lines stream in
- **WHEN** the learner clicks "Run tests" and the attempt SSE stream begins
- **THEN** each `{ type: "test-output", line }` event appends a new line to the output panel in real time

#### Scenario: Pass/fail indicator updates after test completes
- **WHEN** the `{ type: "test-done" }` event arrives
- **THEN** a green PASS or red FAIL badge appears with the exit code

#### Scenario: Reviewer verdict appears after review completes
- **WHEN** the `{ type: "reviewer", status: "done" }` event arrives
- **THEN** the feedback panel updates with pass/fail, score, and the reviewer's feedback text

### Requirement: Frontend Provides Coach Panel with Hint Ladder and Free-Form Input
The system SHALL provide a coach panel that shows the current hint level, allows requesting the next hint, and accepts a free-form message for targeted coaching questions.

#### Scenario: Hint level indicator shown
- **WHEN** the coach panel is open
- **THEN** it shows the current hint level (L0 = none used, L1, L2, L3) and a "Request hint" button

#### Scenario: Requesting next hint advances the ladder
- **WHEN** the learner clicks "Request hint"
- **THEN** the frontend calls `POST /api/sessions/:id/hint` and displays the returned hint text below the indicator

#### Scenario: Free-form coaching question
- **WHEN** the learner types a question in the coach input and submits
- **THEN** the frontend calls `POST /api/sessions/:id/hint` with `{ message }` and displays the targeted response

#### Scenario: Hint ladder exhausted
- **WHEN** L3 has been used and the learner requests another hint
- **THEN** the frontend displays the stored L3 text without making a new server request

### Requirement: Frontend Shows Session Summary on End
The system SHALL display a session summary screen when the learner ends a session, showing attempt history, mastery change, misconception tags, and recommended next nodes.

#### Scenario: Session summary shows on end
- **WHEN** the learner clicks "End session"
- **THEN** the frontend calls `DELETE /api/sessions/:id` and displays the returned summary and recommendations

#### Scenario: Recommendations are actionable
- **WHEN** the summary screen shows recommended next nodes
- **THEN** each recommendation is a link that navigates to the Node Selector with that node pre-selected
