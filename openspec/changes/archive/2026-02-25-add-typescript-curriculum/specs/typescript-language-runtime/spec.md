## ADDED Requirements

### Requirement: TypeScript runtime module scaffolds a valid workspace
The system SHALL provide `src/runtime/typescriptRuntime.js` that exports an async `writeTypescriptProjectConfig(dir)` function. When called, it SHALL create a workspace with: `tsconfig.json` (strict settings), `tests/type-harness.ts` (type-level test utilities), and `run-tests.sh` (two-phase test script).

#### Scenario: Workspace scaffold produces all required files
- **WHEN** `writeTypescriptProjectConfig(dir)` is called on an empty directory
- **THEN** the following files exist: `tsconfig.json`, `tests/type-harness.ts`, `run-tests.sh`

#### Scenario: tsconfig.json has maximum strict settings
- **WHEN** the generated `tsconfig.json` is parsed
- **THEN** it contains: `"strict": true`, `"exactOptionalPropertyTypes": true`, `"noUncheckedIndexedAccess": true`, `"target": "ES2022"`, `"moduleResolution": "NodeNext"`, and `"noEmit": false` (emit needed for bun run on hybrid exercises)

#### Scenario: tsconfig includes both src and tests in compilation
- **WHEN** the generated `tsconfig.json` is parsed
- **THEN** the `include` array covers both `"src/**/*"` and `"tests/**/*"`, and `rootDir` is not set (allowing both directories at root)

### Requirement: Type-level test harness provides Expect, Equal, and related utilities
The generated `tests/type-harness.ts` SHALL export the standard type-level test utilities used throughout the curriculum: `Expect<T extends true>`, `ExpectFalse<T extends false>`, `Equal<X, Y>`, `Extends<A, B>`, `IsAny<T>`, `IsNever<T>`.

#### Scenario: Type harness compiles with tsc --noEmit
- **WHEN** `tsc --noEmit` is run on a workspace containing only `tests/type-harness.ts`
- **THEN** the process exits with code 0

#### Scenario: Equal<A,B> correctly distinguishes types
- **WHEN** `type _t = Expect<Equal<string, string>>` is added to a test file
- **THEN** `tsc --noEmit` passes

#### Scenario: Equal<A,B> fails for different types
- **WHEN** `type _t = Expect<Equal<string, number>>` is added to a test file
- **THEN** `tsc --noEmit` exits with a type error on that line

### Requirement: Two-phase test command covers type checking and runtime execution
The system SHALL use a test command that first runs `tsc --noEmit` (type-only check) and then, for hybrid exercises, runs the test file with `bun`. The language registry `testCommand` SHALL be `["sh", "run-tests.sh"]`.

#### Scenario: Type error causes test failure without running runtime
- **WHEN** `src/solution.ts` contains a type error and `run-tests.sh` is executed
- **THEN** the script exits non-zero after the `tsc --noEmit` step without reaching `bun run`

#### Scenario: Type-only exercise passes when types are correct
- **WHEN** `src/solution.ts` and `tests/test.ts` contain only type-level assertions that all pass
- **THEN** `run-tests.sh` exits with code 0

#### Scenario: Hybrid exercise runtime failure is reported after types pass
- **WHEN** types pass `tsc --noEmit` but `tests/test.ts` throws at runtime
- **THEN** `run-tests.sh` exits non-zero and stdout contains the runtime error output from bun

### Requirement: TypeScript registry entry is complete and consistent with other languages
The system SHALL add a `typescript` key to the language REGISTRY in `src/config/languages.js` with all required fields: `name`, `testCommand`, `sourceDir` (`"src"`), `testsDir` (`"tests"`), `writeProjectConfig`, and `stageInstructions` (all 6 instruction sets: scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer).

#### Scenario: Registry lookup for typescript returns a valid config
- **WHEN** `getLanguageConfig("typescript")` is called
- **THEN** it returns an object with `name: "TypeScript"`, `testCommand: ["sh", "run-tests.sh"]`, `sourceDir: "src"`, `testsDir: "tests"`, and a non-null `writeProjectConfig` function

#### Scenario: Registry lookup for unknown language still throws
- **WHEN** `getLanguageConfig("doesNotExist")` is called
- **THEN** an error is thrown with message matching `Unknown language: doesNotExist`

### Requirement: TypeScript stage instructions guide the coach toward type-theory reasoning
The `coach` stage instruction for TypeScript SHALL direct the coach to ask Socratic questions about the TYPE THEORY property being exercised (distributivity, variance, inference site, etc.) rather than paraphrasing the `tsc` error message or revealing the specific syntax fix.

#### Scenario: Coach instructions do not instruct the model to echo tsc errors
- **WHEN** the TypeScript coach stage instruction text is inspected
- **THEN** it explicitly states the coach should NOT paraphrase the TypeScript compiler error message

#### Scenario: Coach instructions reference type-theory vocabulary
- **WHEN** the TypeScript coach stage instruction text is inspected
- **THEN** it references concepts such as: distributivity, variance, inference site, covariance, contravariance, conditional type position
