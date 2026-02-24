## ADDED Requirements

### Requirement: Mastery State Is Tracked Per Curriculum Node
The system SHALL maintain per-node mastery state and SHALL update that state based on lesson outcomes aligned to depth targets.

#### Scenario: Passing outcome updates mastery
- **WHEN** a learner passes a node assessment at the current depth target
- **THEN** the node mastery state is updated according to configured progression rules

### Requirement: Misconception Tags Are Recorded From Feedback Outcomes
The system SHALL record misconception tags derived from review and coaching outcomes for each attempt.

#### Scenario: Failed attempt assigns dominant misconception
- **WHEN** an attempt fails with a diagnosed dominant misconception tag
- **THEN** the system records that tag in learner history for the associated node and attempt

### Requirement: Repeated Misconceptions Trigger Remediation
The system SHALL trigger remediation actions when repeated misconception patterns exceed configured thresholds.

#### Scenario: Threshold breach triggers bridge action
- **WHEN** a misconception tag frequency exceeds the configured threshold window
- **THEN** the system schedules a remediation action such as bridge lesson or narrower exercise

### Requirement: Next-Node Recommendations Use Mastery and Risk Signals
The system SHALL compute next-node recommendations from prerequisite readiness, mastery levels, and misconception risk indicators.

#### Scenario: Recommendation excludes risky blocked node
- **WHEN** a candidate next node has unmet prerequisites or high unresolved misconception risk
- **THEN** the recommendation output excludes that node from immediate progression
