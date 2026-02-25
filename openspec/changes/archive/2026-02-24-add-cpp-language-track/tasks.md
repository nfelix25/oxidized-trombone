## 1. C++ Runtime Module

- [x] 1.1 Create `src/runtime/cppRuntime.js` — export `writeCppProjectConfig(dir)` that writes `CMakeLists.txt` (C++20 project, `exercise` static library from `src/solution.cpp`, Google Test via FetchContent, CTest enabled), `src/solution.cpp` (empty stub), `src/solution.h` (empty header), and `tests/test_main.cpp` (minimal gtest main boilerplate)
- [x] 1.2 Confirm the generated `CMakeLists.txt` template builds and runs tests successfully via `cmake -B build -S . -DCMAKE_BUILD_TYPE=Debug && cmake --build build && ctest --test-dir build -q` (manual or automated test)

## 2. C++ Stage Instructions

- [x] 2.1 Write `CPP_INSTRUCTIONS.scaffold` prompt in `src/config/languages.js` — C++ exercise planner persona; references `CMakeLists.txt`, `src/solution.cpp`, `src/solution.h`, `tests/*.cpp`; depth guidance: D1: 6-8 section_intents / 2-3 file_intents / 7-10 case_intents; D2: 8-12 / 3-4 / 10-14; D3: 10-15 / 4-6 / 12-18; notes Google Test as the test harness
- [x] 2.2 Write `CPP_INSTRUCTIONS["starter-expand"]` — C++ code writer; generates `.cpp` and `.h` files relative to `src/`; stubs use `// TODO: implement` or typed placeholder returns (e.g. `return 0;`, `return nullptr;`, `return {};`); includes Doxygen `///` doc comments per function; C++ return-type-before-name style; no test files
- [x] 2.3 Write `CPP_INSTRUCTIONS["test-expand"]` — C++ test writer; generates `tests/*.cpp`; uses `#include <gtest/gtest.h>` and `#include "solution.h"`; tests use `TEST(SuiteName, CaseName) { EXPECT_EQ(...); ASSERT_TRUE(...); }` blocks with Google Test assertion macros
- [x] 2.4 Write `CPP_INSTRUCTIONS["lesson-expand"]` — C++ educator persona; C++ code in `cpp` fences; pitfall sections show GCC/Clang compiler errors in `file.cpp:line:col: error:` format; covers RAII, undefined behavior, const-correctness, and modern C++ idioms
- [x] 2.5 Write `CPP_INSTRUCTIONS.coach` and `CPP_INSTRUCTIONS.reviewer` — C++ tutor and C++ code reviewer personas; reviewer checks for RAII correctness, smart pointer usage, const-correctness, object slicing, and undefined behavior; compiler errors in GCC/Clang format

## 3. Language Registry Entry

- [x] 3.1 Add `cpp` entry to `REGISTRY` in `src/config/languages.js` with `name: "C++"`, `testCommand: ["bash", "-c", "cmake -B build -S . -DCMAKE_BUILD_TYPE=Debug && cmake --build build && ctest --test-dir build -q"]`, `sourceDir: "src"`, `testsDir: "tests"`, `writeProjectConfig` pointing to `cppRuntime.js`, `stageInstructions: CPP_INSTRUCTIONS`
- [x] 3.2 Verify `getAvailableLanguages()` returns `["rust", "c", "zig", "cpp"]` (or similar including "cpp") and `getLanguageConfig("cpp")` does not throw

## 4. Curriculum Seed — Foundations and Core OOP

- [x] 4.1 Create `src/curriculum/cppSeed.js` — scaffold file with imports (`createCurriculumGraph`, `createNode`), per-track node arrays, track definitions, and a final `export const cppCurriculum = createCurriculumGraph(...)` merging all nodes and tracks
- [x] 4.2 Add Language Foundations track (`cpp-foundations`): nodes CF01–CF10 with titles, depth targets, prerequisites, keywords, misconception tags, and `language: "cpp"` per spec
- [x] 4.3 Add Classes and Polymorphism track (`cpp-classes`): nodes CP01–CP09 per spec
- [x] 4.4 Add Memory Management track (`cpp-memory`): nodes CM01–CM08 per spec

## 5. Curriculum Seed — Move Semantics, STL, Templates

- [x] 5.1 Add Move Semantics and Value Categories track (`cpp-move-semantics`): nodes CV01–CV07 per spec
- [x] 5.2 Add STL Containers and Algorithms track (`cpp-stl`): nodes CS01–CS09 per spec
- [x] 5.3 Add Templates track (`cpp-templates`): nodes CT01–CT08 per spec

## 6. Curriculum Seed — Compile-time, Error Handling, Conversions

- [x] 6.1 Add Compile-time Programming track (`cpp-constexpr`): nodes CK01–CK07 per spec
- [x] 6.2 Add Error Handling track (`cpp-error-handling`): nodes CE01–CE06 per spec
- [x] 6.3 Add Operators and Type Conversions track (`cpp-conversions`): nodes CO01–CO05 per spec

## 7. Curriculum Seed — Concurrency, I/O, Build Tooling

- [x] 7.1 Add Concurrency track (`cpp-concurrency`): nodes CC01–CC08 per spec
- [x] 7.2 Add Streams and I/O track (`cpp-io`): nodes CW01–CW06 per spec
- [x] 7.3 Add Build, Testing, and Tooling track (`cpp-build-tools`): nodes CB01–CB07 per spec

## 8. Wire Curriculum into allCurricula

- [x] 8.1 Import `cppCurriculum` from `./cppSeed.js` in `src/curriculum/allCurricula.js`
- [x] 8.2 Spread C++ nodes and tracks into the `allCurricula` merge: `[...seedCurriculum.nodes, ...cCurriculum.nodes, ...zigCurriculum.nodes, ...cppCurriculum.nodes]` and corresponding tracks spread

## 9. Verification and Tests

- [x] 9.1 Add test: `getCurriculumForLanguage("cpp")` returns only nodes with `language === "cpp"` and no Rust, C, or Zig nodes
- [x] 9.2 Add test: CF01 exists with no prerequisites (the C++ curriculum entry point)
- [x] 9.3 Add test: total C++ node count is 90 (10+9+8+7+9+8+7+6+5+8+6+7)
- [x] 9.4 Add test: all prerequisite node IDs in the C++ curriculum resolve to existing C++ nodes (internal consistency — no dangling prerequisite references)
- [x] 9.5 Add test: `getAvailableLanguages()` includes "cpp"
- [x] 9.6 Run full test suite and confirm all tests pass
