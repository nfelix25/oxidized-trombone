## ADDED Requirements

### Requirement: Canonical Content Schemas Are Versioned and Enforced
The system SHALL define versioned schemas for lesson planning, exercise generation, hints, and review outputs and SHALL use those schemas as acceptance contracts.

#### Scenario: Content schema version mismatch
- **WHEN** a generated artifact declares an unsupported schema version
- **THEN** the system rejects the artifact and reports the version mismatch

### Requirement: Starter Fixture Set Covers Core Happy Paths
The system SHALL provide golden valid fixtures for baseline lesson flows, including representative packet and role output combinations for initial seed nodes.

#### Scenario: Valid fixture regression run
- **WHEN** fixture validation runs against golden valid examples
- **THEN** all valid fixtures pass schema and policy checks

### Requirement: Negative Fixtures Assert Guardrail Rejections
The system SHALL provide invalid fixtures that intentionally violate schema or policy and SHALL verify that each is rejected for the expected reason.

#### Scenario: Invalid reveal fixture is rejected
- **WHEN** a fixture includes full-solution reveal before allowed conditions
- **THEN** validation fails with a policy-violation classification

### Requirement: Fixture Results Are Actionable for Prompt Iteration
The system SHALL produce per-fixture pass/fail results with rejection reasons so prompt or policy updates can be tested deterministically.

#### Scenario: Fixture failure includes diagnosis
- **WHEN** a fixture fails validation
- **THEN** the result includes the failing rule and a machine-readable failure reason
