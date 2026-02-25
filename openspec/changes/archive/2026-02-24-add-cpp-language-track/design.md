## Context

The curriculum system merges language-specific seed files into `allCurricula` via `allCurricula.js`. Rust nodes live in `seedCurriculum.js`; C nodes in `cSeed.js`; Zig nodes in `zigSeed.js`. Language runtime config (test command, project file writer, stage prompts) lives in `src/config/languages.js`. A new language requires: (1) a seed file for nodes+tracks, (2) a runtime module that writes the project scaffold (analogous to `cRuntime.js` and `zigRuntime.js`), and (3) an entry in the REGISTRY.

C++ uses CMake as its canonical build system and Google Test (or Catch2) for testing. The standard source layout has implementation in `src/solution.cpp` and tests in `tests/`. The CMake test command must configure, build, and run tests in a single invocation to match the existing one-shot test pattern used by Rust (`cargo test`) and Zig (`zig build test`).

## Goals / Non-Goals

**Goals:**
- ~100 nodes across 13 tracks covering the full C++ language through C++20
- Full prerequisite graph so `runGuidedNav` can recommend eligible nodes and block locked ones
- C++-specific stage instructions (scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer) tuned to C++ idioms and the CMake/ctest harness
- Keyword coverage on every node so custom topic search finds C++ nodes
- Misconception tags capturing common C++ learner errors (dangling references, object slicing, forgetting virtual destructors, etc.)

**Non-Goals:**
- C++ modules (C++20 modules have fragmented toolchain support; deferred)
- Coroutine library types (generator, task) — only the language-level co_await/co_yield/co_return primitives in CC08
- Windows-specific tooling (MSVC, Visual Studio project files); target is LLVM/GCC on POSIX
- Boost libraries — only the C++ standard library
- Embedded / bare-metal / RTOS targets
- Networking (std::net is not yet in the standard)
- GPU programming (CUDA, SYCL)

## Decisions

### D1: New `src/curriculum/cppSeed.js` file (same pattern as `zigSeed.js`)

**Decision:** Add `src/curriculum/cppSeed.js` exporting a `cppCurriculum` object. Wire it into `allCurricula.js` with a single spread, same as `zigCurriculum`.

**Rationale:** Keeps language curricula isolated. `allCurricula.js` stays a simple merge. No changes to `getCurriculumForLanguage` or any session/mastery code. The existing `createCurriculumGraph` and `createNode` helpers handle the node structure without modification.

**Alternative considered:** Embedding C++ nodes directly in `seedCurriculum.js` alongside Rust. Rejected — mixing languages in one file makes future edits error-prone and breaks the per-language isolation pattern established by `cSeed.js` and `zigSeed.js`.

---

### D2: Node ID scheme — 2-letter prefix + 2-digit number

**Decision:** Each track gets a 2-letter C++ prefix:
- `CF` — C++ Foundations
- `CP` — Classes and Polymorphism
- `CM` — Memory Management
- `CV` — moVe semantics and Value categories
- `CS` — STL Containers and algorithms (Standard library)
- `CT` — Templates
- `CK` — compile-time / constexpr (Kompile-time)
- `CE` — Error handling (Exceptions)
- `CO` — Operators and type COnversions
- `CC` — Concurrency
- `CW` — streams and I/O (floW)
- `CB` — Build, testing, and tooling

IDs: `CF01`, `CF02`, ..., `CP01`, `CP02`, etc. Two-digit suffixes allow up to 99 nodes per track.

**Rationale:** Prevents collision with existing node IDs:
- Rust uses single-letter prefixes (`S`, `A`, `B`, `C`, `M`, `G`, `X`) with two-digit numbers — no collision with two-letter prefixes
- C language uses `C2xx` format (e.g., `C201`, `C202`) — the digit immediately after C prevents collision with letter-letter prefixes like `CF`, `CP`
- Zig uses `Z`-prefixed two-letter codes (`ZF`, `ZP`, `ZM`, etc.) — no overlap with `C`-prefixed codes
- Python (being added in parallel) uses `P`-prefixed codes — no overlap

Immediately readable — `CV03` is clearly a C++ move-semantics node.

---

### D3: New `src/runtime/cppRuntime.js` for project scaffolding

**Decision:** Add `src/runtime/cppRuntime.js` exporting `writeCppProjectConfig(dir)`. It writes:
- `CMakeLists.txt` — declares a C++20 project, an `exercise` static library from `src/solution.cpp`, a `tests` executable linked against `exercise` and Google Test, and enables CTest
- `src/solution.cpp` — empty translation unit (the AI fills in stubs during starter-expand)
- `src/solution.h` — empty header (the AI adds declarations during starter-expand)
- `tests/test_main.cpp` — minimal Google Test main boilerplate

The test command is `["bash", "-c", "cmake -B build -S . -DCMAKE_BUILD_TYPE=Debug && cmake --build build && ctest --test-dir build -q"]`. This single-command invocation configures, builds, and runs, matching the pattern of `cargo test` and `zig build test`.

**Rationale:** Mirrors the Zig runtime pattern (`zigRuntime.js`). Each language owns its own project-file writer. Google Test is the most widely known C++ testing framework; FetchContent downloads it automatically during configure, so no system-wide installation is required.

**Alternative considered:** Using Catch2 instead of Google Test. Rejected because Google Test's `EXPECT_EQ`/`ASSERT_TRUE` macros are more recognizable to learners coming from other testing frameworks and are closer to the xUnit model that other tutor languages use. Catch2 support can be added as a later node (CB04 covers both).

**Alternative considered:** Running `cmake` and `ctest` as separate `testCommand` array entries. Rejected because the REGISTRY test command is a single command array. The bash wrapper is cleaner than adding a shell-step abstraction.

---

### D4: C++ stage instructions as `CPP_INSTRUCTIONS` in `languages.js`

**Decision:** Add a `CPP_INSTRUCTIONS` constant to `languages.js` with keys: `scaffold`, `starter-expand`, `test-expand`, `lesson-expand`, `coach`, `reviewer`. Wire into the `cpp` REGISTRY entry as `stageInstructions: CPP_INSTRUCTIONS`.

Key instruction differences from Rust and Zig:

- **scaffold**: C++-aware; references `CMakeLists.txt`, `src/solution.cpp`, `src/solution.h`, `tests/`; mentions depth targets for C++ (D1: 6-8 section_intents; D2: 8-12; D3: 10-15); notes that the test harness is Google Test via CTest
- **starter-expand**: Generates `.cpp` and `.h` files relative to `src/`; stubs use `// TODO: implement` or typed placeholder returns; function signatures use C++ style (return type before name); includes Doxygen `///` doc comments per function; no test files
- **test-expand**: Generates `tests/*.cpp`; uses `#include <gtest/gtest.h>` and `#include "solution.h"`; tests use `TEST(SuiteName, CaseName) { EXPECT_EQ(...); }` blocks with Google Test assertion macros
- **lesson-expand**: C++ educator persona; includes C++ code in `cpp` fences; pitfall sections show GCC/Clang compiler errors in their format; covers RAII, undefined behavior, and modern C++ idioms
- **coach/reviewer**: C++ tutor/reviewer personas; compiler errors use GCC/Clang format (`file.cpp:line:col: error: ...`); reviewer checks for RAII correctness, smart pointer usage, const-correctness, and undefined behavior

---

### D5: Prerequisite graph structure

**Decision:** Use a layered dependency graph:

```
CF (Foundations) — entry point, no prerequisites
  ├─ CP (Classes/Polymorphism) — needs CF07 (structs)
  ├─ CM (Memory) — needs CF04 (references) → CM01 (pointers)
  ├─ CS (STL) — needs CM01 (pointers) → CS01 (vector)
  ├─ CT (Templates) — needs CF03 (functions) → CT01
  ├─ CE (Error Handling) — needs CF05 (control flow) → CE01
  ├─ CO (Conversions) — needs CF02 + CP01
  ├─ CC (Concurrency) — needs CF03 → CC01
  ├─ CW (Streams) — needs CF03 → CW01
  ├─ CB (Build/Tools) — needs CF01 → CB01
  ├─ CV (Move Semantics) — needs CF04 + CP03
  ├─ CK (Constexpr) — needs CF09 → CK01
```

Root entry node: `CF01` (variables, types, auto) — no prerequisites, accessible immediately.

Cross-track prerequisites are intentionally limited to 2 at most per node to avoid blocking learners with complex multi-track requirements. The exception is advanced nodes (D3) which may require 2-3 prerequisites across tracks.

---

### D6: Depth target distribution

**Decision:**
- **D1** (6-8 lesson sections, 2-3 starter files, 7-10 tests): Pure syntax and first-use concepts — first 3-4 Foundations nodes, array node, vector node, iostream node, CMake/clang-format basics
- **D2** (8-12 lesson sections, 3-4 starter files, 10-14 tests): Standard library usage, common patterns — most STL, Classes, Memory, Error Handling, and Concurrency nodes
- **D3** (10-15 lesson sections, 4-6 starter files, 12-18 tests): Advanced C++ idioms — deep template metaprogramming, SFINAE, coroutines, unsafe casts, concurrency internals

## Risks / Trade-offs

**CMake is verbose** → The `CMakeLists.txt` template with FetchContent for Google Test is longer than Zig's `build.zig`. The cppRuntime.js file will contain multi-line template strings. Mitigation: Keep the template minimal — single library target, single test executable. Learners can extend it via CB-track exercises.

**C++ has many dialects** → C++11, 14, 17, 20, and 23 all add features. Mitigation: Target C++20 as the baseline (`target_compile_features(exercise PUBLIC cxx_std_20)`); nodes explicitly note which standard version introduced each feature. C++23 features (std::expected) are included with version callouts.

**Undefined behavior is pervasive** → Many C++ concepts involve UB (signed overflow, dangling references, misaligned casts). Mitigation: Stage instructions direct the coach and reviewer personas to flag UB explicitly; misconception tags on affected nodes call out UB risks.

**Node count is large** → `cppSeed.js` with 100 nodes will be long. Mitigation: Split by track into separate constant arrays (same pattern as `zigSeed.js`), then merge at the end of the file.

**Google Test requires network access at configure time** → FetchContent downloads gtest during `cmake -B build`. Mitigation: Note in CB01 stage instructions that the first configure may require internet access. In CI/offline environments, FetchContent can be pointed at a local mirror via `FETCHCONTENT_SOURCE_DIR`.

## Open Questions

None — scope is fully defined.
