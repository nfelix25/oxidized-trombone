## ADDED Requirements

### Requirement: Exercises Are Executed Through Local Rust Tooling
The system SHALL run learner exercises with local Rust tooling and SHALL capture compiler and test outcomes for feedback loops.

#### Scenario: Exercise execution collects outcome evidence
- **WHEN** a learner runs an exercise command
- **THEN** the system records compiler diagnostics and test pass/fail results for that attempt

### Requirement: Runtime Supports Attempted Retry Loops
The system SHALL support iterative attempts per exercise and SHALL track attempt index, hint level usage, and elapsed effort metadata.

#### Scenario: Learner submits repeated attempts
- **WHEN** a learner reruns an exercise after feedback
- **THEN** the system increments attempt state and stores the updated attempt metadata

### Requirement: Hint Ladder Is Progressive and Policy-Aware
The system SHALL provide progressive hints (`L1`, `L2`, `L3`) and SHALL enforce reveal gating rules defined by active policy.

#### Scenario: Hint progression before reveal threshold
- **WHEN** a learner has not reached reveal conditions
- **THEN** the runtime allows hint progression without returning a full solution

### Requirement: Runtime Feeds Evidence Back Into Coaching and Review
The system SHALL provide attempt evidence to coaching and review steps so generated feedback is grounded in actual learner outcomes.

#### Scenario: Reviewer receives evidence-backed input
- **WHEN** reviewer evaluation is requested for an attempt
- **THEN** the reviewer input includes relevant compiler/test evidence from that attempt
