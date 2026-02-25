## ADDED Requirements

### Requirement: lesson_content_v1 Schema Defines Teacher Stage Output Contract
The system SHALL define a versioned `lesson_content_v1` JSON schema that specifies the required structure for teacher stage outputs, including lesson body, worked examples, misconception callouts, and resources array. The schema SHALL be compatible with OpenAI structured output constraints (no union types, all objects with explicit properties and `additionalProperties: false`).

#### Scenario: Valid teacher output passes schema validation
- **WHEN** a `lesson_content_v1` payload is validated against the schema
- **THEN** all required fields (lesson_id, node_id, depth_target, lesson_body, worked_examples, misconception_callouts, resources) must be present and well-formed

#### Scenario: Missing required field fails schema validation
- **WHEN** a `lesson_content_v1` payload omits a required field such as `lesson_body`
- **THEN** schema validation rejects the payload with a SCHEMA_VALIDATION_FAILED reason

#### Scenario: Resource entry with invalid kind fails schema validation
- **WHEN** a resource entry uses a `kind` value outside the allowed enum
- **THEN** schema validation rejects the payload

### Requirement: Valid and Invalid Fixtures Exist for lesson_content_v1
The system SHALL provide at least one valid fixture and at least one invalid fixture for the `lesson_content_v1` schema, following the same fixture conventions as other stage outputs.

#### Scenario: Valid lesson_content_v1 fixture passes validation
- **WHEN** fixture validation runs against the valid teacher fixture
- **THEN** it passes schema and policy checks

#### Scenario: Invalid lesson_content_v1 fixture is rejected
- **WHEN** fixture validation runs against the invalid teacher fixture (e.g., missing required field or bad enum value)
- **THEN** validation fails with the expected SCHEMA_VALIDATION_FAILED reason
