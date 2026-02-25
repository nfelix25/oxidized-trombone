## Why

The platform currently supports only Rust. Adding C unlocks a set of intermediate/advanced systems-programming topics — advanced pointers, IPC, signals, POSIX threads, and networking — that are most naturally taught in C, since these are canonical POSIX/C-level APIs. These topics round out the curriculum for learners who want deep systems literacy beyond Rust's memory-safety layer.

## What Changes

- Add a language abstraction layer so `workspace`, `commandRunner`, `materialize`, and `stages` are parametrized by language rather than hardcoded to Rust
- Add a C runtime: Makefile-based workspace, minimal `test.h` harness (Rust-like output format), `gcc`/`clang` compilation, `make test` as the test command
- Add a C test output parser to `reviewIntegration.js` (parsing `make test` + `test.h` output)
- Add C-specific stage instructions to the Codex prompt layer
- Add a 14-node C curriculum (`seed.js`) across 5 tracks: C-Pointers, C-IPC, C-Signals, C-Concurrency, C-Networking
- Thread `language` through session state so the correct runtime is chosen at exercise setup and attempt time

## Capabilities

### New Capabilities
- `c-language-runtime`: Workspace generation, build tooling, and test execution for C exercises (Makefile, test.h harness, clang/gcc compilation)
- `c-learning-curriculum`: 14-node C curriculum covering advanced pointers, IPC, signals, POSIX threads/concurrency, and TCP/UDP networking at D2–D3 depth
- `multi-language-support`: Language abstraction layer that parametrizes the runtime, materialize, and Codex prompt layers so additional languages can be added with minimal new code

### Modified Capabilities
- `codex-lesson-orchestration`: Stage instructions gain a `language` parameter; Rust instructions move to a per-language config; C instructions added
- `session-exercise-loop`: Session state carries a `language` field; `setupExercise` and `runAttempt` dispatch to the correct runtime
- `learning-content-and-fixtures`: Fixture harness extended to cover C schemas and C-language fixture files

## Impact

- `src/runtime/workspace.js` — replace `writeCargotoml()` with `writeProjectConfig(dir, language)`
- `src/runtime/commandRunner.js` — replace `runCargoTest()` with `runLanguageTest(cwd, language)`
- `src/runtime/materialize.js` — `sourceDir`/`testsDir` driven by language config instead of hardcoded `src/` and `tests/`
- `src/orchestration/stages.js` — STAGE_INSTRUCTIONS becomes a per-language lookup
- `src/runtime/reviewIntegration.js` — add C test output parser (test.h format)
- `src/curriculum/seed.js` — add 14 C nodes across 5 tracks
- `src/session/session.js` + `exerciseLoop.js` — thread `language` through session/setup/attempt
- New: `src/config/languages.js` — language registry (testCommand, dirs, instructions, parser)
- New: `src/runtime/cRuntime.js` — Makefile and test.h generation for C workspaces
- No schema changes required; all schemas are already language-agnostic
- Fixtures: add valid/invalid C fixture files for harness coverage
