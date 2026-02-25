## MODIFIED Requirements

### Requirement: Role-Based Orchestration Uses Dedicated Contracts
The system SHALL orchestrate lesson interactions through distinct roles (`scaffold`, `starter-expand`, `test-expand`, `lesson-expand`, `coach`, `reviewer`) with role-specific output schemas. The former roles `planner`, `teacher`, and `author` are removed.

#### Scenario: Role output is routed by schema contract
- **WHEN** the system invokes a role for a lesson step
- **THEN** the invocation requires the corresponding schema for that role output

#### Scenario: Scaffold role output is routed by scaffold_v1 schema
- **WHEN** the system invokes the `scaffold` role
- **THEN** the invocation requires the `scaffold_v1` schema for output validation

#### Scenario: Expand role outputs are routed by their section schemas
- **WHEN** the system invokes `starter-expand`, `test-expand`, or `lesson-expand`
- **THEN** the invocation requires `starter_section_v1`, `test_section_v1`, or `lesson_section_v1` respectively

## REMOVED Requirements

### Requirement: Teacher Role Output Is Routed by lesson_content_v1 Schema
**Reason**: The `teacher` role and `lesson_content_v1` schema are replaced by the `lesson-expand` loop producing `lesson_section_v1` payloads assembled into LESSON.md.
**Migration**: Use `lesson-expand` stage with `lesson_section_v1` schema.
