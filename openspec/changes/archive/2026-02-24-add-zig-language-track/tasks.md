## 1. Zig Runtime Module

- [x] 1.1 Create `src/runtime/zigRuntime.js` — export `writeZigProjectConfig(dir)` that writes `build.zig` (with a static library target, per-file source adding, and a `test` step that compiles all `tests/*.zig`) and an empty `src/root.zig` entry point
- [ ] 1.2 Confirm `zig build test` succeeds against the generated `build.zig` template (manual or test)

## 2. Zig Stage Instructions

- [x] 2.1 Write `ZIG_INSTRUCTIONS.scaffold` prompt in `src/config/languages.js` — Zig exercise planner persona; references `build.zig`, `src/*.zig`, `tests/*.zig`; depth guidance: D1: 6-8 section_intents / 2-3 file_intents / 7-10 case_intents; D2: 8-12 / 3-4 / 10-14; D3: 10-15 / 4-6 / 12-18
- [x] 2.2 Write `ZIG_INSTRUCTIONS["starter-expand"]` — Zig code writer; generates `.zig` files relative to `src/`; uses `@panic("TODO")` or typed placeholder returns; includes `///` doc comments per function; no test files
- [x] 2.3 Write `ZIG_INSTRUCTIONS["test-expand"]` — Zig test writer; generates `tests/*.zig`; uses `const std = @import("std"); const exercise = @import("exercise");`; tests use `test "..." { ... }` blocks with `std.testing.expect*`
- [x] 2.4 Write `ZIG_INSTRUCTIONS["lesson-expand"]` — Zig educator; Zig code in fences; pitfall sections show Zig compiler errors; covers motivation, core concept, worked examples, pitfalls, comparison, bridge
- [x] 2.5 Write `ZIG_INSTRUCTIONS.coach` and `ZIG_INSTRUCTIONS.reviewer` — Zig tutor and Zig code reviewer personas; reviewer notes that compiler errors use `<file>:<line>:<col>:` format and test output uses `zig build test`

## 3. Language Registry Entry

- [x] 3.1 Add `zig` entry to `REGISTRY` in `src/config/languages.js` with `name: "Zig"`, `testCommand: ["zig", "build", "test"]`, `sourceDir: "src"`, `testsDir: "tests"`, `writeProjectConfig` pointing to `zigRuntime.js`, `stageInstructions: ZIG_INSTRUCTIONS`
- [x] 3.2 Verify `getAvailableLanguages()` returns `["rust", "c", "zig"]` and `getLanguageConfig("zig")` does not throw

## 4. Curriculum Seed — Foundations and Type System

- [x] 4.1 Create `src/curriculum/zigSeed.js` — scaffold file with imports (`createCurriculumGraph`, `createNode`), per-track node arrays, track definitions, and a final `export const zigCurriculum = createCurriculumGraph(...)` merging all nodes and tracks
- [x] 4.2 Add Language Foundations track (`zig-foundations`): nodes ZF01–ZF10 with titles, depth targets, prerequisites, keywords, misconception tags, and `language: "zig"` per spec
- [x] 4.3 Add Pointers and Slices track (`zig-pointers`): nodes ZP01–ZP08 per spec
- [x] 4.4 Add Memory and Allocators track (`zig-memory`): nodes ZM01–ZM09 per spec
- [x] 4.5 Add Arrays and Strings track (`zig-arrays-strings`): nodes ZA01–ZA07 per spec

## 5. Curriculum Seed — Error Handling, Optionals, Comptime

- [x] 5.1 Add Error Handling track (`zig-errors`): nodes ZE01–ZE07 per spec
- [x] 5.2 Add Optionals track (`zig-optionals`): nodes ZO01–ZO05 per spec
- [x] 5.3 Add Comptime track (`zig-comptime`): nodes ZC01–ZC09 per spec

## 6. Curriculum Seed — Collections, I/O, Concurrency

- [x] 6.1 Add Collections track (`zig-collections`): nodes ZL01–ZL07 per spec
- [x] 6.2 Add I/O and Filesystem track (`zig-io`): nodes ZI01–ZI08 per spec
- [x] 6.3 Add Concurrency track (`zig-concurrency`): nodes ZT01–ZT07 per spec

## 7. Curriculum Seed — Interop, Build, Unsafe, Metaprogramming

- [x] 7.1 Add C Interop track (`zig-c-interop`): nodes ZX01–ZX06 per spec
- [x] 7.2 Add Build and Testing track (`zig-build-test`): nodes ZB01–ZB07 per spec
- [x] 7.3 Add Low-Level and Unsafe track (`zig-unsafe`): nodes ZU01–ZU07 per spec
- [x] 7.4 Add Advanced Metaprogramming track (`zig-metaprogramming`): nodes ZG01–ZG05 per spec

## 8. Wire Curriculum into allCurricula

- [x] 8.1 Import `zigCurriculum` from `./zigSeed.js` in `src/curriculum/allCurricula.js`
- [x] 8.2 Spread Zig nodes and tracks into the `allCurricula` merge: `[...seedCurriculum.nodes, ...cCurriculum.nodes, ...zigCurriculum.nodes]` and corresponding tracks

## 9. Verification and Tests

- [x] 9.1 Add test: `getCurriculumForLanguage("zig")` returns only nodes with `language === "zig"` and no Rust or C nodes
- [x] 9.2 Add test: ZF01 exists with no prerequisites (the Zig curriculum entry point)
- [x] 9.3 Add test: total Zig node count is 102 (10+8+9+7+7+5+9+7+8+7+6+7+7+5)
- [x] 9.4 Add test: all prerequisite node IDs in the Zig curriculum resolve to existing Zig nodes (internal consistency — no dangling prerequisite references)
- [x] 9.5 Add test: `getAvailableLanguages()` includes "zig"
- [x] 9.6 Run full test suite and confirm all tests pass
