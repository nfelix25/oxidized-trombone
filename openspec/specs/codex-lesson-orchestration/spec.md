## ADDED Requirements

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

### Requirement: Context Packet Is Mandatory for Codex Invocations
The system SHALL require a valid context packet for each Codex lesson invocation and SHALL fail closed if required packet fields are missing.

#### Scenario: Missing required context field
- **WHEN** an invocation payload omits a required context field
- **THEN** the system rejects the invocation before calling Codex

### Requirement: Role Outputs Must Pass Schema Validation
The system SHALL validate each role output against its declared JSON schema and SHALL reject non-conforming outputs.

#### Scenario: Schema mismatch in role output
- **WHEN** Codex returns output that violates the declared schema
- **THEN** the system marks the output invalid and prevents downstream consumption

### Requirement: Policy Engine Enforces Pedagogical Guardrails
The system SHALL apply deterministic policy checks after schema validation, including reveal restrictions and consistency checks.

#### Scenario: Early reveal policy violation
- **WHEN** a coach output includes a full solution before reveal conditions are met
- **THEN** the policy engine rejects the output as non-compliant

### Requirement: Stage instructions are parametrized by language
The system SHALL select Codex stage instruction text based on the session language, so that scaffold, expand, coach, and reviewer prompts reference the correct language, tooling, and idioms.

#### Scenario: C session uses C-specific instructions
- **WHEN** any stage runs in a session with `language = "c"`
- **THEN** the prompt preamble identifies the role as a C systems programmer, references `gcc`/`clang`, `make test`, the `test.h` harness, and C conventions (header guards, `#include`, pointer syntax)

#### Scenario: Rust session instructions unchanged
- **WHEN** any stage runs in a session with `language = "rust"` or no language set
- **THEN** the prompt preamble is identical to the current Rust instruction text

### Requirement: C stage instructions enforce C-specific file and test conventions
The C starter-expand instruction SHALL specify that `file_path` is relative to `src/`, files use `.c`/`.h` extensions, and stubs use `return 0;`/`return NULL;`/`return (Type){0};` placeholders. The C test-expand instruction SHALL specify that test files use the `test.h` harness macros (`RUN_TEST`, `TEST_ASSERT_EQ`, `TEST_SUMMARY`) and `#include "exercise.h"` rather than a package import statement.

#### Scenario: C starter file uses .c extension
- **WHEN** Codex generates a starter section with language = "c"
- **THEN** the `file_path` ends in `.c` or `.h`, not `.rs`

#### Scenario: C test file uses test.h macros
- **WHEN** Codex generates a test section with language = "c"
- **THEN** the content includes `#include "test.h"`, `RUN_TEST(...)`, and `TEST_SUMMARY()` in main
