## MODIFIED Requirements

### Requirement: Canonical Content Schemas Are Versioned and Enforced
The system SHALL define versioned schemas for lesson planning, exercise generation, hints, and review outputs and SHALL use those schemas as acceptance contracts across fixture mode and live runtime mode. The `lesson_section_v1` schema SHALL include a required `section_title` field containing a concise heading string (e.g., "Hook", "Core Concept", "Worked Example: arena allocation", "Pitfalls", "Comparison: shadowing vs mutation", "Bridge").

#### Scenario: Content schema version mismatch
- **WHEN** a generated artifact declares an unsupported schema version
- **THEN** the system rejects the artifact and reports the version mismatch

#### Scenario: Live runtime output schema enforcement
- **WHEN** a live stage output is returned during a runtime session
- **THEN** the output is validated against its declared schema before it is consumed

#### Scenario: Lesson section without section_title is rejected
- **WHEN** a lesson_section_v1 object is validated and the `section_title` field is absent or empty
- **THEN** the schema validator rejects the artifact as non-conforming

#### Scenario: Lesson section with section_title passes validation
- **WHEN** a lesson_section_v1 object includes a non-empty `section_title` string
- **THEN** the schema validator accepts the artifact

### Requirement: Lesson Materialize Emits Structured Markdown with Section Headings
The system SHALL prepend each lesson section's `section_title` as a `##`-level markdown heading when assembling LESSON.md, producing a document with navigable section boundaries.

#### Scenario: LESSON.md contains section headings
- **WHEN** the lesson expand loop completes and `assembleLessonFile` runs
- **THEN** the output LESSON.md contains `## {section_title}` before each section's content

#### Scenario: Section headings enable downstream collapsible rendering
- **WHEN** a frontend or tool parses LESSON.md
- **THEN** each `##` heading corresponds to exactly one lesson section and can be used as a collapse boundary

### Requirement: Starter Fixture Set Covers Core Happy Paths
The system SHALL provide golden valid fixtures for baseline lesson flows, including representative packet and role output combinations for initial seed nodes and at least one live-like session flow. All `lesson_section_v1` fixtures SHALL include the `section_title` field.

#### Scenario: Valid fixture regression run
- **WHEN** fixture validation runs against golden valid examples
- **THEN** all valid fixtures pass schema and policy checks

#### Scenario: Live-like fixture path included
- **WHEN** fixture inventory is generated for acceptance checks
- **THEN** it includes at least one end-to-end live-like session fixture sequence

#### Scenario: Existing lesson fixtures updated to include section_title
- **WHEN** fixture validation runs against lesson_section_v1 fixture files
- **THEN** all fixture files include a non-empty `section_title` field and pass validation

### Requirement: Negative Fixtures Assert Guardrail Rejections
The system SHALL provide invalid fixtures that intentionally violate schema or policy and SHALL verify that each is rejected for the expected reason, including runtime-specific violations. A missing `section_title` in a lesson section SHALL be an invalid fixture scenario.

#### Scenario: Invalid reveal fixture is rejected
- **WHEN** a fixture includes full-solution reveal before allowed conditions
- **THEN** validation fails with a policy-violation classification

#### Scenario: Runtime malformed output fixture is rejected
- **WHEN** a fixture includes malformed runtime stage output
- **THEN** validation fails with schema or policy failure classification

#### Scenario: Lesson section missing section_title is rejected
- **WHEN** a fixture contains a lesson_section_v1 object without a `section_title` field
- **THEN** validation fails with schema violation citing the missing required field

### Requirement: Fixture Results Are Actionable for Prompt Iteration
The system SHALL produce per-fixture pass/fail results with rejection reasons so prompt or policy updates can be tested deterministically, and SHALL include machine-readable rule identifiers for failures.

#### Scenario: Fixture failure includes diagnosis
- **WHEN** a fixture fails validation
- **THEN** the result includes the failing rule and a machine-readable failure reason

#### Scenario: Fixture report includes aggregate status
- **WHEN** a fixture run completes
- **THEN** the report includes total, passed, failed, and failure breakdown outputs
