## Requirements

### Requirement: Lesson Delivered as LESSON.md File in Workspace
The system SHALL write all lesson content to a `LESSON.md` file at the root of the workspace directory, assembling it from the ordered output of the lesson expand loop. The lesson SHALL be comprehensive enough to fully cover the topic and explicitly bridge to the specific exercise generated alongside it. The former session-state storage and `study` CLI command are removed.

#### Scenario: LESSON.md written to workspace root after lesson loop
- **WHEN** the lesson expand loop completes
- **THEN** LESSON.md is present at `<workspaceDir>/LESSON.md` and contains all generated section content in order

#### Scenario: LESSON.md bridge section references actual exercise code
- **WHEN** the lesson loop's final section is of type `bridge`
- **THEN** it references specific function signatures, types, or test cases from the generated starter and test files

#### Scenario: Lesson file path recorded in session state
- **WHEN** LESSON.md is successfully written
- **THEN** the session state records the path under `lessonFile` for reference
