## MODIFIED Requirements

### Requirement: Mastery State Is Tracked Per Curriculum Node
The system SHALL maintain per-node mastery state and SHALL update that state based on lesson outcomes aligned to depth targets, while preserving history for session-level auditability.

#### Scenario: Passing outcome updates mastery
- **WHEN** a learner passes a node assessment at the current depth target
- **THEN** the node mastery state is updated according to configured progression rules

#### Scenario: Mastery update writes history
- **WHEN** mastery changes for a node
- **THEN** the system records before/after mastery values in mastery history

### Requirement: Misconception Tags Are Recorded From Feedback Outcomes
The system SHALL record misconception tags derived from review and coaching outcomes for each attempt and SHALL associate tags with node and attempt identifiers.

#### Scenario: Failed attempt assigns dominant misconception
- **WHEN** an attempt fails with a diagnosed dominant misconception tag
- **THEN** the system records that tag in learner history for the associated node and attempt

#### Scenario: Misconception event includes attempt reference
- **WHEN** a misconception tag is recorded
- **THEN** the stored event includes the attempt index for traceability

### Requirement: Repeated Misconceptions Trigger Remediation
The system SHALL trigger remediation actions when repeated misconception patterns exceed configured thresholds and SHALL expose the triggering frequency in remediation metadata.

#### Scenario: Threshold breach triggers bridge action
- **WHEN** a misconception tag frequency exceeds the configured threshold window
- **THEN** the system schedules a remediation action such as bridge lesson or narrower exercise

#### Scenario: Below-threshold frequency does not trigger remediation
- **WHEN** a misconception tag frequency is below configured threshold
- **THEN** the system does not schedule remediation for that tag

### Requirement: Next-Node Recommendations Use Mastery and Risk Signals
The system SHALL compute next-node recommendations from prerequisite readiness, mastery levels, and misconception risk indicators, and SHALL exclude high-risk blocked candidates.

#### Scenario: Recommendation excludes risky blocked node
- **WHEN** a candidate next node has unmet prerequisites or high unresolved misconception risk
- **THEN** the recommendation output excludes that node from immediate progression

#### Scenario: Eligible low-risk nodes are recommended
- **WHEN** nodes satisfy prerequisites and do not exceed risk thresholds
- **THEN** the recommendation output includes those nodes
