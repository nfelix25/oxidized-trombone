## ADDED Requirements

### Requirement: TypeScript is a supported language in the registry
The system SHALL include a `typescript` entry in the language registry in `src/config/languages.js` alongside rust, c, zig, python, and cpp. The entry SHALL satisfy all existing registry contract requirements (testCommand, sourceDir, testsDir, writeProjectConfig, stageInstructions with all 6 keys).

#### Scenario: Registry entry for typescript is present and structurally valid
- **WHEN** the REGISTRY object in `src/config/languages.js` is inspected
- **THEN** a `typescript` key exists with non-null values for all required fields

#### Scenario: Adding typescript did not change existing language entries
- **WHEN** `getLanguageConfig("rust")`, `getLanguageConfig("c")`, and `getLanguageConfig("python")` are called after the typescript addition
- **THEN** each returns the same config as before this change (no regressions)

#### Scenario: TypeScript workspace creation succeeds through the standard pipeline
- **WHEN** `createWorkspace({ language: "typescript", ... })` is called
- **THEN** `writeTypescriptProjectConfig(dir)` is invoked and the workspace directory contains a valid `tsconfig.json`

#### Scenario: TypeScript test execution routes through the standard commandRunner
- **WHEN** `runExercise(workspaceDir, "typescript")` is called
- **THEN** the subprocess spawned is `sh run-tests.sh` inside the workspace directory

### Requirement: allCurricula.js includes the TypeScript curriculum graph
The system SHALL update `src/curriculum/allCurricula.js` to import `typescriptCurriculum` from `./typescriptSeed.js` and merge its nodes and tracks into the global curriculum graph.

#### Scenario: TypeScript nodes are retrievable from the global curriculum
- **WHEN** `getCurriculumForLanguage("typescript")` is called on the merged global graph
- **THEN** it returns the full set of TypeScript nodes (100+) with no rust, c, zig, python, or cpp nodes mixed in

#### Scenario: Existing language curricula are unaffected by the merge
- **WHEN** `getCurriculumForLanguage("rust")` is called after the merge
- **THEN** it returns only Rust nodes, identical to the pre-change result
