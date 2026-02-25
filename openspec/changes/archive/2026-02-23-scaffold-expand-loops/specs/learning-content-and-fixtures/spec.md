## ADDED Requirements

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

## REMOVED Requirements

### Requirement: lesson_content_v1 Schema Defines Teacher Stage Output Contract
**Reason**: Replaced by `lesson_section_v1` — lesson content is now generated iteratively as individual sections rather than as a single structured blob.
**Migration**: Use `lesson_section_v1` schema for lesson expand loop outputs.

### Requirement: Valid and Invalid Fixtures Exist for lesson_content_v1
**Reason**: lesson_content_v1 schema is removed; fixtures for the new schemas replace them.
**Migration**: Use fixtures under `fixtures/valid/scaffold/`, `fixtures/valid/starter-section/`, `fixtures/valid/test-section/`, `fixtures/valid/lesson-section/`.
