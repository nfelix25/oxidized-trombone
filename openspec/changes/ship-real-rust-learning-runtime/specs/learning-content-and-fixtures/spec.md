## MODIFIED Requirements

### Requirement: Canonical Content Schemas Are Versioned and Enforced
The system SHALL define versioned schemas for lesson planning, exercise generation, hints, and review outputs and SHALL use those schemas as acceptance contracts across fixture mode and live runtime mode.

#### Scenario: Content schema version mismatch
- **WHEN** a generated artifact declares an unsupported schema version
- **THEN** the system rejects the artifact and reports the version mismatch

#### Scenario: Live runtime output schema enforcement
- **WHEN** a live stage output is returned during a runtime session
- **THEN** the output is validated against its declared schema before it is consumed

### Requirement: Starter Fixture Set Covers Core Happy Paths
The system SHALL provide golden valid fixtures for baseline lesson flows, including representative packet and role output combinations for initial seed nodes and at least one live-like session flow.

#### Scenario: Valid fixture regression run
- **WHEN** fixture validation runs against golden valid examples
- **THEN** all valid fixtures pass schema and policy checks

#### Scenario: Live-like fixture path included
- **WHEN** fixture inventory is generated for acceptance checks
- **THEN** it includes at least one end-to-end live-like session fixture sequence

### Requirement: Negative Fixtures Assert Guardrail Rejections
The system SHALL provide invalid fixtures that intentionally violate schema or policy and SHALL verify that each is rejected for the expected reason, including runtime-specific violations.

#### Scenario: Invalid reveal fixture is rejected
- **WHEN** a fixture includes full-solution reveal before allowed conditions
- **THEN** validation fails with a policy-violation classification

#### Scenario: Runtime malformed output fixture is rejected
- **WHEN** a fixture includes malformed runtime stage output
- **THEN** validation fails with schema or policy failure classification

### Requirement: Fixture Results Are Actionable for Prompt Iteration
The system SHALL produce per-fixture pass/fail results with rejection reasons so prompt or policy updates can be tested deterministically, and SHALL include machine-readable rule identifiers for failures.

#### Scenario: Fixture failure includes diagnosis
- **WHEN** a fixture fails validation
- **THEN** the result includes the failing rule and a machine-readable failure reason

#### Scenario: Fixture report includes aggregate status
- **WHEN** a fixture run completes
- **THEN** the report includes total, passed, failed, and failure breakdown outputs
