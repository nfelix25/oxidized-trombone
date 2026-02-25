## MODIFIED Requirements

### Requirement: Exercises Are Executed Through Local Rust Tooling
The system SHALL run learner exercises with local Rust tooling in per-session workspaces and SHALL capture compiler and test outcomes for feedback loops.

#### Scenario: Exercise execution collects outcome evidence
- **WHEN** a learner runs an exercise command
- **THEN** the system records compiler diagnostics and test pass/fail results for that attempt

#### Scenario: Workspace execution uses generated files
- **WHEN** an author stage returns starter and test files
- **THEN** the runtime materializes those files into the active workspace before test execution

### Requirement: Runtime Supports Attempted Retry Loops
The system SHALL support iterative attempts per exercise and SHALL track attempt index, hint level usage, elapsed effort metadata, and run-command metadata for each attempt.

#### Scenario: Learner submits repeated attempts
- **WHEN** a learner reruns an exercise after feedback
- **THEN** the system increments attempt state and stores the updated attempt metadata

#### Scenario: Attempt history persists between steps
- **WHEN** a session advances from attempt to review
- **THEN** attempt history remains available for subsequent hint and remediation decisions

### Requirement: Hint Ladder Is Progressive and Policy-Aware
The system SHALL provide progressive hints (`L1`, `L2`, `L3`) and SHALL enforce reveal gating rules defined by active policy and current attempt state.

#### Scenario: Hint progression before reveal threshold
- **WHEN** a learner has not reached reveal conditions
- **THEN** the runtime allows hint progression without returning a full solution

#### Scenario: Reveal permitted after threshold
- **WHEN** reveal conditions are met by policy
- **THEN** the runtime allows a full-solution response path for the coach stage

### Requirement: Runtime Feeds Evidence Back Into Coaching and Review
The system SHALL provide attempt evidence to coaching and review steps so generated feedback is grounded in actual learner outcomes, including command output excerpts.

#### Scenario: Reviewer receives evidence-backed input
- **WHEN** reviewer evaluation is requested for an attempt
- **THEN** the reviewer input includes relevant compiler/test evidence from that attempt

#### Scenario: Coach receives recent failure evidence
- **WHEN** coach guidance is requested after a failed attempt
- **THEN** the coach input includes recent failure evidence from the current exercise history
