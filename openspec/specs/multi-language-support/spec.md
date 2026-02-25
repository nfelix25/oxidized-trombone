## Purpose
Specifies the language abstraction layer that allows the platform to support multiple programming languages (Rust, C, and future additions) without changes to core runtime modules.

## Requirements

### Requirement: Language registry is the single source of truth for language config
The system SHALL provide a `src/config/languages.js` module that exports a registry object keyed by language ID (`"rust"`, `"c"`), where each entry contains: `testCommand`, `sourceDir`, `testsDir`, `writeProjectConfig`, `parseTestOutput`, and `stageInstructions`.

#### Scenario: Registry entry for rust matches current behaviour
- **WHEN** the rust registry entry is used for workspace creation and test execution
- **THEN** behaviour is identical to the pre-refactor hardcoded Rust implementation

#### Scenario: Registry lookup for unknown language throws
- **WHEN** code calls `getLanguageConfig("python")` and no such entry exists
- **THEN** the system throws a clear error: `Unknown language: python`

#### Scenario: Adding a third language requires only registry and curriculum changes
- **WHEN** a developer adds a new entry to the registry with valid `testCommand`, dirs, and instructions
- **THEN** no changes to `workspace.js`, `commandRunner.js`, `materialize.js`, or `stages.js` are required

### Requirement: workspace.js uses registry for project config generation
The system SHALL replace the hardcoded `writeCargotoml()` call with `language.writeProjectConfig(dir)` from the registry, so that workspace creation produces the correct build files for each language.

#### Scenario: Rust workspace still gets Cargo.toml
- **WHEN** `createWorkspace` is called with `language = "rust"`
- **THEN** a valid `Cargo.toml` is written to the workspace root, identical to the pre-refactor output

#### Scenario: C workspace gets Makefile and test.h instead of Cargo.toml
- **WHEN** `createWorkspace` is called with `language = "c"`
- **THEN** `Makefile` and `tests/test.h` are written; no `Cargo.toml` is created

### Requirement: commandRunner.js uses registry for test execution
The system SHALL replace the hardcoded `cargo test -q` invocation with `language.testCommand` from the registry.

#### Scenario: Rust test command unchanged
- **WHEN** `runLanguageTest(cwd, "rust")` is called
- **THEN** the process spawned is `cargo test -q` in the given directory

#### Scenario: C test command runs make
- **WHEN** `runLanguageTest(cwd, "c")` is called
- **THEN** the process spawned is `make test` in the given directory

### Requirement: materialize.js uses registry for directory layout
The system SHALL replace hardcoded `"src"` and `"tests"` directory constants with `language.sourceDir` and `language.testsDir` from the registry.

#### Scenario: Rust layout unchanged (src/ and tests/)
- **WHEN** `assembleStarterFiles` is called with `language = "rust"`
- **THEN** files are written under `workspaceDir/src/` as before

#### Scenario: C layout uses same src/ and tests/ directories
- **WHEN** `assembleStarterFiles` is called with `language = "c"`
- **THEN** files are written under `workspaceDir/src/` (C uses the same layout in this implementation)

### Requirement: stages.js uses registry for Codex stage instructions
The system SHALL replace the hardcoded `STAGE_INSTRUCTIONS` object with a per-language lookup via the registry, so each language gets appropriate Codex prompts.

#### Scenario: Rust instructions unchanged
- **WHEN** a stage runs with `language = "rust"`
- **THEN** the prompt preamble is identical to the current Rust-specific instruction text

#### Scenario: C instructions reference C concepts and tooling
- **WHEN** a stage runs with `language = "c"`
- **THEN** the prompt preamble says "You are a C systems programmer", references `gcc`/`clang`, `make`, the `test.h` harness, and C-specific conventions

### Requirement: Session language defaults to "rust" for backward compatibility
The system SHALL treat any session without an explicit `language` field as a Rust session, so that existing persisted session state continues to work after the refactor.

#### Scenario: Existing session without language field runs as Rust
- **WHEN** a session loaded from disk has no `language` property
- **THEN** all runtime calls use `language = "rust"`
