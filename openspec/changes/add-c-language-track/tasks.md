## 1. Language Registry

- [x] 1.1 Create `src/config/languages.js` exporting a `getLanguageConfig(lang)` function and a registry object with a `rust` entry mirroring current hardcoded values (testCommand, sourceDir, testsDir, writeProjectConfig stub, parseTestOutput stub, stageInstructions)
- [x] 1.2 Verify all existing tests still pass with the registry in place (Rust entry should be a no-op change)

## 2. Refactor Runtime to Use Registry (Rust unchanged)

- [x] 2.1 Refactor `src/runtime/workspace.js`: replace `writeCargotoml()` with `language.writeProjectConfig(dir)` from registry; accept `language` param in `createWorkspace`
- [x] 2.2 Refactor `src/runtime/commandRunner.js`: replace `runCargoTest()` with `runLanguageTest(cwd, language)` that reads `testCommand` from registry; update `runExercise` to accept `language`
- [x] 2.3 Refactor `src/runtime/materialize.js`: replace hardcoded `"src"` and `"tests"` strings with `language.sourceDir` and `language.testsDir` from registry in `assembleStarterFiles` and `assembleTestFiles`
- [x] 2.4 Refactor `src/orchestration/stages.js`: replace hardcoded `STAGE_INSTRUCTIONS` object with a call to `language.stageInstructions[stage]` from registry; default to `"rust"` if no language provided
- [x] 2.5 Thread `language` through `setupExercise` and `runAttempt` in `src/session/exerciseLoop.js`: read from `session.language ?? "rust"` and pass to all runtime calls
- [x] 2.6 Add `language` field to `createNewSession` in `src/session/session.js`; derive from selected curriculum node's `language` property; default to `"rust"`
- [x] 2.7 Run full test suite; confirm zero regressions

## 3. C Runtime Implementation

- [x] 3.1 Create `src/runtime/cRuntime.js` with `writeCMakefile(dir)` that writes a `Makefile` to the workspace root (CC=cc, CFLAGS=-Wall -Wextra -g -I src -I tests, LDFLAGS=-lpthread, compiles all src/*.c + each tests/test_*.c, `make test` target)
- [x] 3.2 Add `writeTestHeader(dir)` in `cRuntime.js` that writes `tests/test.h` with macros: `TEST_ASSERT(expr)`, `TEST_ASSERT_EQ(a,b)`, `TEST_ASSERT_STR_EQ(a,b)`, `TEST_ASSERT_FLOAT_EQ(a,b,eps)`, `RUN_TEST(fn)`, `TEST_SUMMARY()` — output format matches `cargo test` (`test <name> ... ok/FAILED`)
- [x] 3.3 Add `parseCTestOutput(stdout, stderr)` in `cRuntime.js` that extracts `passingTests` (lines matching `test .+ \.\.\. ok`), `failingTests` (lines matching `test .+ \.\.\. FAILED` or `FAILED: <file>:<line>`), and `compilerErrors` (lines matching `<file>:<line>:<col>: error:`)
- [x] 3.4 Add C entry to the language registry in `src/config/languages.js`: testCommand `["make", "test"]`, sourceDir `"src"`, testsDir `"tests"`, writeProjectConfig calls `writeCMakefile` + `writeTestHeader`, parseTestOutput calls `parseCTestOutput`, stageInstructions defined inline

## 4. C Stage Instructions

- [x] 4.1 Write C-specific scaffold instruction in `languages.js`: "You are a C systems programmer. Your sole task: generate a scaffold_v1 JSON object…" including depth-based intent counts, emphasis on POSIX APIs, and warning against undefined behaviour in stubs
- [x] 4.2 Write C-specific starter-expand instruction: file_path relative to `src/`, `.c`/`.h` extensions, placeholder returns (`return 0;`/`return NULL;`), include guard convention, rustdoc → C-style block comments; no test files
- [x] 4.3 Write C-specific test-expand instruction: file_path relative to `tests/`, `#include "test.h"` + `#include "<exercise_header>.h"`, `RUN_TEST`/`TEST_SUMMARY` in `main()`, `TEST_ASSERT_EQ` assertions with messages; tie is_complete to case_intents count
- [x] 4.4 Write C-specific lesson-expand instruction: Rust → C throughout; pitfall sections show C compiler errors not rustc errors; worked examples use C syntax; bridge sections may reference Zig/Rust equivalents for context

## 5. C Curriculum

- [x] 5.1 Create `src/curriculum/cSeed.js` with the `c-pointers` track: C200 (pointer arithmetic, decay, restrict, const-correctness), C201 (function pointers, callbacks, dispatch tables), C202 (dynamic memory, malloc/realloc/free, arena pattern) — all D2, `language: "c"`
- [x] 5.2 Add `c-ipc` track to cSeed.js: C210 (fork/waitpid/exec, zombie/orphan), C211 (pipe/FIFO, fd management), C212 (mmap MAP_SHARED, shm_open/shm_unlink), C213 (mq_open/mq_send/mq_receive) — D2/D3
- [x] 5.3 Add `c-signals` track to cSeed.js: C220 (sigaction vs signal(), sigset_t, common signals), C221 (sigprocmask, async-signal-safety, self-pipe trick) — D3
- [x] 5.4 Add `c-concurrency` track to cSeed.js: C230 (pthread_create/join/detach), C231 (pthread_mutex, pthread_cond_wait/signal, producer-consumer), C232 (_Atomic, atomic_fetch_add, lock-free counter) — D3
- [x] 5.5 Add `c-networking` track to cSeed.js: C240 (socket/bind/listen/accept/connect, TCP echo server), C241 (select/poll/epoll, O_NONBLOCK, event loop), C242 (sendto/recvfrom, UDP datagram echo) — D2/D3
- [x] 5.6 Create `src/curriculum/allCurricula.js` that imports and merges Rust seed and C seed into a unified graph; update all imports of `seedCurriculum` to use `allCurricula`

## 6. C Fixtures

- [x] 6.1 Create `fixtures/valid/c-scaffold/c200_d2_scaffold.json` — a realistic C200 scaffold_v1 fixture with pointer arithmetic section intents, 2-3 file intents, 6+ test case intents
- [x] 6.2 Create `fixtures/valid/c-starter-section/c200_d2_starter.json` — starter_section_v1 fixture with realistic C pointer arithmetic stub code
- [x] 6.3 Create `fixtures/valid/c-test-section/c200_d2_test.json` — test_section_v1 fixture with test.h macro usage and `#include "pointers.h"`
- [x] 6.4 Create `fixtures/valid/c-lesson-section/c200_d2_lesson.json` — lesson_section_v1 fixture with a substantial concept section about pointer arithmetic
- [x] 6.5 Create `fixtures/invalid/c-starter-section/empty_file_path.json` — invalid starter_section_v1 with file_path: "" to confirm minLength validation
- [x] 6.6 Update fixture harness roleMap to include `c-scaffold`, `c-starter-section`, `c-test-section`, `c-lesson-section` folder-to-schema mappings; verify harness passes

## 7. Integration & Smoke Test

- [ ] 7.1 Manually run `npm run session start -- --debug` after selecting a C node; confirm workspace contains Makefile and tests/test.h
- [ ] 7.2 Confirm scaffold output for a C node contains C-specific keywords (POSIX function names, C types) and correct intent counts for the depth target
- [ ] 7.3 Confirm starter sections have `.c` file extensions and no Rust syntax
- [ ] 7.4 Confirm test sections use `#include "test.h"` and `RUN_TEST`/`TEST_SUMMARY`
- [ ] 7.5 Compile a generated C workspace manually with `make test` and confirm it compiles and runs (even with todo stubs returning 0)
- [x] 7.6 Update README to mention C language support and the `make test` command
