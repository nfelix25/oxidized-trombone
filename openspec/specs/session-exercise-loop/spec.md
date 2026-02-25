### Requirement: Exercise Loop Runs Scaffold Then Three Sequential Expand Loops at Session Start
The system SHALL automatically run the scaffold stage followed by three expand loops (starter → test → lesson) when a learning session starts, using the selected node and current learner state. The system SHALL persist workspace file paths and the lesson file path to session state before returning control to the learner. The former planner/teacher/author stage sequence is replaced entirely.

#### Scenario: Session start runs scaffold then all three loops
- **WHEN** a learner starts a session and selects a node
- **THEN** the system runs the scaffold stage, then the starter loop, then the test loop, then the lesson loop, writes all output to the workspace, and saves file paths to session state

#### Scenario: Stage failure at session start is surfaced and session is not persisted
- **WHEN** any stage or loop fails during session start (schema, policy, or execution failure)
- **THEN** the system prints a human-readable error with machine-readable reason and does not save an active session

### Requirement: Session state carries a language field
The system SHALL store a `language` string field on session state, set explicitly from the learner's language selection at session creation time (not derived from the node), and persist it across commands.

#### Scenario: New session from a C node has language = "c"
- **WHEN** a learner starts a session, selects C as the language, and selects a C curriculum node (e.g. C200)
- **THEN** the created session has `language: "c"`

#### Scenario: New session from a Rust node has language = "rust"
- **WHEN** a learner starts a session, selects Rust as the language, and selects a Rust curriculum node
- **THEN** the created session has `language: "rust"`

#### Scenario: Existing session without language field is treated as Rust
- **WHEN** a session is loaded from disk that has no `language` property
- **THEN** all subsequent operations treat it as `language = "rust"`

#### Scenario: Session created from a custom topic carries the custom topic's language
- **WHEN** a learner selects a language, then selects a custom topic for that language, and starts a session
- **THEN** the created session has `language` matching the custom topic's language

### Requirement: Attempt Command Runs Language Test and Reviewer
The system SHALL provide an `attempt` command that executes the language-appropriate test command (`cargo test` for Rust, `make test` for C) in the active workspace, records the run result as an attempt, and then runs the reviewer stage using the attempt evidence to produce a pass/fail verdict and mastery update.

#### Scenario: Successful Rust attempt updates mastery
- **WHEN** the learner runs the `attempt` command on a Rust session and `cargo test` exits 0
- **THEN** the system records the passing run, runs the reviewer stage with evidence, applies the mastery update, and displays the reviewer verdict

#### Scenario: Successful C attempt updates mastery
- **WHEN** the learner runs the `attempt` command on a C session and `make test` exits 0
- **THEN** the system records the passing run, runs the reviewer stage with evidence, applies the mastery update, and displays the reviewer verdict

#### Scenario: Failed attempt records evidence and runs reviewer
- **WHEN** the learner runs the `attempt` command and the test command exits non-zero
- **THEN** the system records the failing run with compiler diagnostics, runs the reviewer stage, and displays feedback without updating mastery to passing

#### Scenario: Reviewer stage failure preserves attempt record
- **WHEN** the reviewer stage returns an unaccepted result after an attempt
- **THEN** the system preserves the attempt run record in session state and surfaces the reviewer failure reason

### Requirement: Hint Command Invokes Coach at the Next Hint Level
The system SHALL provide a `hint` command that calls the coach stage at the next unused hint level, displays the hint text, and records the hint level used in session state. The hint level SHALL NOT exceed 3.

#### Scenario: First hint returns L1 coach output
- **WHEN** the learner runs the `hint` command and no hints have been used yet
- **THEN** the system calls the coach stage at level 1, displays the hint, and records hint level 1 as used

#### Scenario: Repeated hints advance to next level
- **WHEN** the learner runs the `hint` command and hint level N was last used
- **THEN** the system calls the coach stage at level N+1 (up to 3), displays the hint, and updates the used level

#### Scenario: Hint capped at level 3
- **WHEN** the learner runs the `hint` command and hint level 3 has already been used
- **THEN** the system displays the existing L3 hint without making a new stage call

### Requirement: Context Packets for Stages Are Built from Live Session State
The exercise loop SHALL construct the context packet for each stage call from the current session state at the moment of invocation, including current mastery, misconception history, and attempt evidence for coach and reviewer stages. Each expand loop SHALL additionally receive the accumulated output of all prior loops.

#### Scenario: Coach and reviewer receive current attempt evidence
- **WHEN** the coach or reviewer stage is called after at least one attempt
- **THEN** the context packet includes compiler diagnostics and test outcomes from the most recent attempt

#### Scenario: Scaffold receives mastery and misconception context
- **WHEN** the scaffold stage is called at session start
- **THEN** the context packet includes the learner's current mastery levels and top misconception tags for the selected node

#### Scenario: Lesson expand loop receives starter and test output
- **WHEN** the lesson expand loop is invoked
- **THEN** each lesson expand call's context packet includes the scaffold and summaries of generated starter and test sections
