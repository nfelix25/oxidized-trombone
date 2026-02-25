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

### Requirement: Starter Sections Include Learner-Facing Orientation Comments
Every stub function in every starter section SHALL include a comment that orients the learner as a practitioner, not a Codex spec recipient. The comment SHALL state: the exercise unit ID (ex-N), the first principle being practiced, a reference to the LESSON.md section that teaches it, and the name of the test case that will assert it. The comment SHALL end with a "start here" cue pointing to the first concrete action, not a list of implementation requirements.

#### Scenario: Stub comment names the first principle
- **WHEN** a starter section is generated
- **THEN** each stub function comment includes "First principle: <concept>" identifying what the learner is practicing

#### Scenario: Stub comment cross-references lesson and test
- **WHEN** a starter section is generated
- **THEN** each stub comment references the LESSON.md section that teaches the concept and the test function that will validate the implementation

#### Scenario: Stub comment does not enumerate implementation requirements
- **WHEN** a starter section is generated
- **THEN** stub comments do not use "the learner must" phrasing or list implementation steps — orientation only

### Requirement: Starter Sections Pre-Define Constants Required by Tests
Any constant, flag value, error code, or tag value that a test case will reference SHALL be pre-defined in the stub file or its corresponding header. The learner SHALL be able to read the entire contract of a stub from the starter file alone, without opening the test file.

#### Scenario: Test-referenced flags defined in header
- **WHEN** a test case references a flag constant (e.g., TRANSFER_FLAG_REGISTERED)
- **THEN** that constant is defined in the corresponding stub header or source file, visible to the learner before they inspect the test

#### Scenario: Stub file is self-contained
- **WHEN** a learner reads only the stub source and header files
- **THEN** they can identify the full contract (function signature, expected error codes, relevant constants) without opening the test file

### Requirement: Lesson Sections Are Directly Enabling
Each lesson section SHALL be written to directly prepare the learner to implement one or more named stub functions. Every lesson section SHALL include a worked example that demonstrates the exact pattern the learner will apply. The section SHALL reference the stub it enables by function name so the learner can move directly from reading to implementing.

#### Scenario: Lesson section includes worked example for the target stub
- **WHEN** a lesson section is generated for exercise ex-N
- **THEN** the section includes a complete worked example demonstrating the pattern the learner will apply in the corresponding stub, before asking them to implement it

#### Scenario: Lesson section names the stub it enables
- **WHEN** a lesson section is generated
- **THEN** the section references the stub function(s) it directly enables by name, so the learner knows which stub to open after reading

### Requirement: Test Cases Target Individual Stubs with Assertion-Stating Names
Each test case SHALL target exactly one stub function. Test function names SHALL describe the assertion being made, not just the function under test. Test cases SHALL be ordered to match the progressive composition order of the stubs they target.

#### Scenario: Test name describes the assertion
- **WHEN** a test section is generated
- **THEN** test function names follow the pattern `test_<function>_<assertion>` (e.g., `test_context_init_zeroes_arena`, not `test_context_init_1`)

#### Scenario: Each test targets one stub
- **WHEN** a test section targets stub ex-N
- **THEN** the test function exercises exactly one stub function's behavior, not multiple stubs in sequence
