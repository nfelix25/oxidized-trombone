## ADDED Requirements

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
