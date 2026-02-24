## ADDED Requirements

### Requirement: Exercise Loop Runs Planner and Author Stages at Session Start
The system SHALL automatically run the planner and author stages when a learning session starts, using the selected node and current learner state, and SHALL persist the resulting exercise pack to session state before returning control to the learner.

#### Scenario: Session start triggers lesson setup
- **WHEN** a learner starts a session and selects a node
- **THEN** the system runs the planner stage, then the author stage, materializes the resulting exercise files into a workspace, and saves the exercise pack and workspace path to session state

#### Scenario: Stage failure at session start is surfaced and session is not persisted
- **WHEN** a stage fails during session start (schema, policy, or execution failure)
- **THEN** the system prints a human-readable error with machine-readable reason and does not save an active session

### Requirement: Attempt Command Runs Cargo Test and Reviewer
The system SHALL provide an `attempt` command that executes `cargo test` in the active workspace, records the run result as an attempt, and then runs the reviewer stage using the attempt evidence to produce a pass/fail verdict and mastery update.

#### Scenario: Successful attempt updates mastery
- **WHEN** the learner runs the `attempt` command and `cargo test` exits 0
- **THEN** the system records the passing run, runs the reviewer stage with evidence, applies the mastery update, and displays the reviewer verdict

#### Scenario: Failed attempt records evidence and runs reviewer
- **WHEN** the learner runs the `attempt` command and `cargo test` exits non-zero
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
The exercise loop SHALL construct the context packet for each stage call from the current session state at the moment of invocation, including current mastery, misconception history, and attempt evidence for coach and reviewer stages.

#### Scenario: Coach and reviewer receive current attempt evidence
- **WHEN** the coach or reviewer stage is called after at least one attempt
- **THEN** the context packet includes compiler diagnostics and test outcomes from the most recent attempt

#### Scenario: Planner and author receive current mastery and misconception context
- **WHEN** the planner or author stage is called at session start
- **THEN** the context packet includes the learner's current mastery levels and top misconception tags for the selected node
