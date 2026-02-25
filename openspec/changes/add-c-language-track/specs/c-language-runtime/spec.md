## ADDED Requirements

### Requirement: C workspace is created with Makefile and test harness
When a C exercise workspace is initialised, the system SHALL generate a Makefile and a `tests/test.h` header alongside the standard `src/` and `tests/` directories, so that `make test` compiles and runs all test files without any additional tooling.

#### Scenario: Workspace creation produces required files
- **WHEN** `createWorkspace` is called with `language = "c"`
- **THEN** the workspace directory contains `Makefile`, `tests/test.h`, an empty `src/` directory, and an empty `tests/` directory

#### Scenario: Makefile compiles src and test files together
- **WHEN** `make test` is run in a C workspace containing `src/exercise.c` and `tests/test_exercise.c`
- **THEN** the Makefile compiles both files with `-I src -I tests` and executes the resulting binary

#### Scenario: Makefile links POSIX libraries by default
- **WHEN** `make test` is run on any C workspace
- **THEN** the compilation includes `-lpthread` so threading exercises compile without modification

### Requirement: test.h provides a standard assertion and runner API
The generated `tests/test.h` SHALL define macros for assertions and test execution that produce output in the same line format as `cargo test`, so that the existing test output parser requires only a minor extension.

#### Scenario: Passing test produces cargo-like output line
- **WHEN** a test function wrapped with `RUN_TEST(my_test)` completes without failing assertions
- **THEN** stdout contains `test my_test ... ok`

#### Scenario: Failing assertion marks test as failed
- **WHEN** `TEST_ASSERT_EQ(a, b)` is called with `a != b`
- **THEN** stderr contains a line with `FAILED`, the file name, line number, and expression; the test is counted as failed

#### Scenario: TEST_SUMMARY exits with correct code
- **WHEN** `TEST_SUMMARY()` is called at the end of main
- **THEN** it prints `test result: ok. N passed; 0 failed` and exits 0 if all passed, or `test result: FAILED. N passed; M failed` and exits 1 if any failed

#### Scenario: Floating-point comparison macro
- **WHEN** `TEST_ASSERT_FLOAT_EQ(a, b, epsilon)` is called
- **THEN** the assertion passes if `|a - b| < epsilon`, fails otherwise

### Requirement: C test output is parsed by reviewIntegration
The system SHALL include a C-specific test output parser that reads `make test` stdout/stderr and extracts passing test names, failing test names, and compiler error lines.

#### Scenario: Parser identifies passing tests
- **WHEN** stdout contains lines matching `test <name> ... ok`
- **THEN** the parser returns those names in the `passingTests` array

#### Scenario: Parser identifies failing tests
- **WHEN** stdout or stderr contains lines matching `test <name> ... FAILED` or `FAILED: <file>:<line>:`
- **THEN** the parser returns those names/lines in the `failingTests` array

#### Scenario: Parser extracts compiler errors
- **WHEN** stderr contains lines matching `<file>:<line>:<col>: error:` (clang/gcc format)
- **THEN** the parser returns those lines in the `compilerErrors` array

### Requirement: make test exit code drives attempt outcome
The system SHALL use the exit code of `make test` as the `ok` boolean in the run result, consistent with how `cargo test` exit code is used for Rust.

#### Scenario: All tests pass
- **WHEN** `make test` exits 0
- **THEN** `runResult.ok` is `true`

#### Scenario: Any test fails or compilation fails
- **WHEN** `make test` exits non-zero
- **THEN** `runResult.ok` is `false`
