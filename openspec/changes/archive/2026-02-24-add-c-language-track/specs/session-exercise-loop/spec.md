## ADDED Requirements

### Requirement: Session state carries a language field
The system SHALL store a `language` string field on session state, set from the selected curriculum node at session creation time, and persist it across commands.

#### Scenario: New session from a C node has language = "c"
- **WHEN** a learner starts a session and selects a C curriculum node (e.g. C200)
- **THEN** the created session has `language: "c"`

#### Scenario: New session from a Rust node has language = "rust"
- **WHEN** a learner starts a session and selects a Rust curriculum node
- **THEN** the created session has `language: "rust"`

#### Scenario: Existing session without language field is treated as Rust
- **WHEN** a session is loaded from disk that has no `language` property
- **THEN** all subsequent operations treat it as `language = "rust"`

## MODIFIED Requirements

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
