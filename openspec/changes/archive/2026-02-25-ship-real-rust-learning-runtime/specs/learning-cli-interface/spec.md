## ADDED Requirements

### Requirement: CLI Supports Session Lifecycle Control
The system SHALL provide a terminal CLI that supports starting, resuming, and ending a learning session for a single local learner.

#### Scenario: Start a new guided session
- **WHEN** the learner starts a guided session from the CLI
- **THEN** the system creates a new session context and displays the next eligible guided options

### Requirement: CLI Supports Guided and Custom Topic Entry
The CLI MUST allow the learner to choose either guided track navigation or custom-topic entry in each session.

#### Scenario: Select custom-topic mode
- **WHEN** the learner selects custom-topic mode and provides a topic string
- **THEN** the CLI displays mapped nodes and prerequisite gap information before lesson generation

### Requirement: CLI Exposes Attempt, Hint, and Review Actions
The CLI SHALL expose commands for submitting attempts, requesting progressively deeper hints, and viewing reviewer feedback for the current exercise.

#### Scenario: Request next hint level
- **WHEN** the learner requests a hint during an active exercise
- **THEN** the CLI displays the next allowed hint level output and updates hint usage state

### Requirement: CLI Presents Session Summary and Next-Step Recommendation
The system SHALL provide an end-of-session summary with completed attempts, dominant misconception tags, and recommended next nodes.

#### Scenario: End session and show summary
- **WHEN** the learner ends the session
- **THEN** the CLI outputs session metrics and at least one recommendation for the next learning step
