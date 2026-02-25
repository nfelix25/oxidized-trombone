## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Teacher Stage Generates Personalized Lesson Content
**Reason**: Replaced by the scaffold + lesson-expand loop architecture. Lesson content is now generated iteratively as typed sections assembled into LESSON.md rather than as a single `lesson_content_v1` JSON blob.
**Migration**: The lesson-expand loop with `lesson_section_v1` schema produces equivalent and substantially richer content.

### Requirement: Lesson Content Includes Worked Examples and Misconception Callouts
**Reason**: These are now section types within the lesson-expand loop (`worked_example`, `pitfalls`) rather than structured fields in a schema.
**Migration**: Scaffold intents and lesson-expand loop section types enforce coverage of examples and misconceptions.

### Requirement: Teacher Stage Produces Curated External Resource Links
**Reason**: Resources are now a dedicated section type (`resources`) in the lesson-expand loop, with Codex able to web-search for current links rather than generating static ones.
**Migration**: The lesson-expand loop's `resources` section type replaces the `resources` array in `lesson_content_v1`.

### Requirement: Study Command Re-displays Lesson Content
**Reason**: LESSON.md is a file in the workspace, opened directly in the editor. A CLI re-display command is redundant.
**Migration**: Open `LESSON.md` at the workspace path printed when the session starts.
