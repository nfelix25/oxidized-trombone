## Requirements

### Requirement: Expand Loops Run in Fixed Order with Context Accumulation
The system SHALL run three expand loops sequentially in the order: starter → test → lesson. Each loop SHALL receive the scaffold and the accumulated output of all prior loops as context, so later loops can reference earlier output. The lesson loop SHALL run last so its bridge section can reference the actual generated code.

#### Scenario: Starter loop runs first with scaffold as context
- **WHEN** the scaffold stage succeeds
- **THEN** the starter expand loop is the first loop invoked, receiving the scaffold as its initial context

#### Scenario: Test loop receives prior starter output
- **WHEN** the starter loop completes
- **THEN** the test expand loop is invoked with scaffold + all generated starter sections as context

#### Scenario: Lesson loop receives prior starter and test output
- **WHEN** the test loop completes
- **THEN** the lesson expand loop is invoked with scaffold + starter sections + test sections as context, enabling the bridge section to reference specific functions and test cases

### Requirement: Each Expand Call Returns a Self-Termination Signal
Every expand stage call SHALL return an `is_complete` boolean and, when `is_complete` is false, a `next_focus` string describing what remains. The loop SHALL terminate when `is_complete` is true or the `MAX_ITERATIONS` safety cap is reached.

#### Scenario: Loop terminates when Codex signals completion
- **WHEN** an expand call returns `is_complete: true`
- **THEN** the loop stops and proceeds to assembly, regardless of how many iterations have run

#### Scenario: Safety cap terminates loop if Codex never signals completion
- **WHEN** an expand loop reaches `MAX_ITERATIONS` for the current depth target without `is_complete: true`
- **THEN** the loop terminates with whatever sections have been generated, and assembly proceeds normally

#### Scenario: next_focus feeds the following iteration
- **WHEN** an expand call returns `is_complete: false` and a non-empty `next_focus`
- **THEN** the next iteration's context packet includes `next_focus` as an explicit continuation directive

### Requirement: MAX_ITERATIONS Is Scaled by Depth Target and Loop Type
The system SHALL enforce a hard per-loop iteration cap based on the session's depth target. Caps SHALL be: D1 `{ starter:6, test:8, lesson:12 }`, D2 `{ starter:8, test:10, lesson:15 }`, D3 `{ starter:9, test:12, lesson:18 }`.

#### Scenario: D1 session caps lesson loop at 12 iterations
- **WHEN** a D1 session's lesson expand loop has run 12 iterations without `is_complete`
- **THEN** the loop terminates and assembly proceeds with the 12 sections generated

#### Scenario: D3 session allows lesson loop up to 18 iterations
- **WHEN** a D3 session's lesson expand loop produces `is_complete: true` at iteration 15
- **THEN** the loop terminates at iteration 15, well within the D3 cap of 18

### Requirement: Each Loop Assembles Its Sections into Workspace Files
After a loop completes, the system SHALL assemble all generated sections into the appropriate workspace files. Starter sections SHALL be assembled into `src/` files, test sections into `tests/` files, and lesson sections into `LESSON.md` at the workspace root.

#### Scenario: Lesson sections assembled into LESSON.md
- **WHEN** the lesson loop completes with N sections
- **THEN** all section markdown content is concatenated in order and written to `<workspaceDir>/LESSON.md`

#### Scenario: Starter sections assembled into src files
- **WHEN** the starter loop completes
- **THEN** section outputs referencing the same file path are merged, and each distinct file is written under `<workspaceDir>/src/`

#### Scenario: Test sections assembled into tests files
- **WHEN** the test loop completes
- **THEN** section outputs are assembled into `<workspaceDir>/tests/` with consistent module references matching the starter code

### Requirement: Expand Section Schemas Are Thin Wrappers Around Content
The `starter_section_v1`, `test_section_v1`, and `lesson_section_v1` schemas SHALL each contain: `section_id`, `type`, `content` (the generated output), `is_complete`, and `next_focus`. They SHALL be OpenAI structured-output compatible.

#### Scenario: Valid lesson section passes schema validation
- **WHEN** a `lesson_section_v1` payload is validated
- **THEN** required fields `section_id`, `type`, `content`, `is_complete` are present and well-formed

#### Scenario: Incomplete section without next_focus still validates
- **WHEN** a section has `is_complete: false` and an empty `next_focus`
- **THEN** schema validation accepts it (next_focus is informational, not required)
