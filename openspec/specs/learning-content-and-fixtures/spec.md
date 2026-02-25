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

### Requirement: Four New Schemas Define the Scaffold and Expand Loop Contracts
The system SHALL define `scaffold_v1`, `starter_section_v1`, `test_section_v1`, and `lesson_section_v1` schemas as the acceptance contracts for the new generation pipeline. All schemas SHALL be OpenAI structured-output compatible.

#### Scenario: All four new schemas registered in schema validator
- **WHEN** the schema validator is initialized
- **THEN** `scaffold_v1`, `starter_section_v1`, `test_section_v1`, and `lesson_section_v1` are all resolvable by name

### Requirement: Valid and Invalid Fixtures Exist for Each New Schema
The system SHALL provide at least one valid and one invalid fixture for each of the four new schemas.

#### Scenario: Valid scaffold fixture passes validation
- **WHEN** fixture validation runs against a valid scaffold_v1 fixture
- **THEN** it passes schema and policy checks

#### Scenario: Valid section fixtures pass validation for all three loop types
- **WHEN** fixture validation runs against valid starter_section_v1, test_section_v1, and lesson_section_v1 fixtures
- **THEN** all pass schema validation

### Requirement: Fixture harness validates C-language fixture files
The system SHALL extend the fixture harness to scan and validate fixture files under `fixtures/valid/c-*/` and `fixtures/invalid/c-*/` directories, covering all four section schemas populated with C content.

#### Scenario: Valid C scaffold fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-scaffold/`
- **THEN** all files in that directory validate against `scaffold_v1` and the harness reports no errors

#### Scenario: Valid C starter section fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-starter-section/`
- **THEN** all files validate against `starter_section_v1`

#### Scenario: Valid C test section fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-test-section/`
- **THEN** all files validate against `test_section_v1`

#### Scenario: Valid C lesson section fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-lesson-section/`
- **THEN** all files validate against `lesson_section_v1`

#### Scenario: Invalid C fixtures fail validation with expected errors
- **WHEN** the fixture harness runs against `fixtures/invalid/c-*/`
- **THEN** each fixture fails validation for the reason documented in the fixture file

### Requirement: C fixture files demonstrate realistic C content
C fixture files SHALL contain realistic C systems-programming content (pointer arithmetic, POSIX calls, `#include` headers) rather than placeholder strings, so that the harness confirms the schemas accept real-world C content.

#### Scenario: C starter section fixture contains a C function stub
- **WHEN** a valid c-starter-section fixture is read
- **THEN** its `content` field contains a C function definition with a body using `return 0;` or similar placeholder

#### Scenario: C test section fixture contains test.h macro usage
- **WHEN** a valid c-test-section fixture is read
- **THEN** its `content` field contains `#include "test.h"` and at least one `TEST_ASSERT` macro call

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
