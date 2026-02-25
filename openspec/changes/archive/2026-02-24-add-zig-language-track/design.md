## Context

The curriculum system merges language-specific seed files into `allCurricula` via `allCurricula.js`. Rust nodes live in `seedCurriculum.js`; C nodes in `cSeed.js`. Language runtime config (test command, project file writer, stage prompts) lives in `src/config/languages.js`. A new language requires: (1) a seed file for nodes+tracks, (2) a runtime module that writes the project scaffold (analogous to `cRuntime.js`), and (3) an entry in the REGISTRY.

Zig uses `zig build test` as its test command and `build.zig` as its project file. The standard source layout is `src/root.zig` for the library root, with additional modules under `src/`. Tests live in `build.zig` and run via `zig build test`.

## Goals / Non-Goals

**Goals:**
- ~100 nodes across 14 tracks covering the full Zig language and standard library
- Full prerequisite graph so `runGuidedNav` can recommend eligible nodes and block locked ones
- Zig-specific stage instructions (scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer) tuned to Zig idioms and the `zig build test` harness
- Keyword coverage on every node so custom topic search finds Zig nodes
- Misconception tags capturing common Zig learner errors

**Non-Goals:**
- Zig async/await (removed from Zig in 0.12; will note this in relevant nodes but not teach it)
- Networking (std.net is incomplete/unstable; deferred)
- JSON/crypto/hash stdlib (useful but not core; can be added as a later extension)
- Cross-compilation, embedded targets, or OS-level baremetal programming

## Decisions

### D1: New `src/curriculum/zigSeed.js` file (same pattern as `cSeed.js`)

**Decision:** Add `src/curriculum/zigSeed.js` exporting a `zigCurriculum` object. Wire it into `allCurricula.js` with a single spread, same as cCurriculum.

**Rationale:** Keeps language curricula isolated. `allCurricula.js` stays a simple merge. No changes to `getCurriculumForLanguage` or any session/mastery code.

---

### D2: Node ID scheme — 2-letter prefix + 2-digit number

**Decision:** Each track gets a 2-letter Zig prefix:
- `ZF` — Foundations
- `ZP` — Pointers and Slices
- `ZM` — Memory and Allocators
- `ZA` — Arrays and Strings
- `ZE` — Errors
- `ZO` — Optionals
- `ZC` — Comptime
- `ZL` — coLLections
- `ZI` — I/O and Filesystem
- `ZT` — Threads and Concurrency
- `ZX` — C inter-op (eXterior)
- `ZB` — Build and Testing
- `ZU` — Unsafe and Low-level
- `ZG` — metaproGramming (advanced comptime)

IDs: `ZF01`, `ZF02`, ..., `ZP01`, `ZP02`, etc. Two-digit suffixes allow up to 99 nodes per track.

**Rationale:** Prevents collision with existing Rust (S, A, B, C, M, G, X) and C (C2xx) node IDs. Immediately readable — `ZC05` is clearly a Zig comptime node.

---

### D3: New `src/runtime/zigRuntime.js` for project scaffolding

**Decision:** Add `src/runtime/zigRuntime.js` exporting `writeZigProjectConfig(dir)`. It writes:
- `build.zig` — declares a static library `exercise`, adds source files from `src/`, and adds a test step that compiles all `tests/*.zig` files
- `src/root.zig` — empty module entry point (the AI fills in stubs during starter-expand)

The test command remains `["zig", "build", "test"]`, which `zig build` interprets via the `build.zig` test step.

**Rationale:** Mirrors the C runtime pattern (`cRuntime.js`). Each language owns its own project-file writer. The `zigRuntime.js` module stays slim — just template strings.

---

### D4: Zig stage instructions as `ZIG_INSTRUCTIONS` in `languages.js`

**Decision:** Add a `ZIG_INSTRUCTIONS` constant to `languages.js` with keys: `scaffold`, `starter-expand`, `test-expand`, `lesson-expand`, `coach`, `reviewer`. Wire into the `zig` REGISTRY entry as `stageInstructions: ZIG_INSTRUCTIONS`.

Key instruction differences from Rust:
- **scaffold**: Zig-aware; references `build.zig`, `src/*.zig`, `tests/*.zig`; mentions depth targets for Zig (D1: 6-8 section_intents; D2: 8-12; D3: 10-15)
- **starter-expand**: Generates `.zig` files relative to `src/`; stubs use `@panic("TODO")` or `return undefined;`; includes doc comments (`///`)
- **test-expand**: Generates `tests/*.zig`; uses `const std = @import("std");` and `test "..." { ... }` blocks; references `const exercise = @import("exercise");`
- **lesson-expand**: Zig educator persona; includes Zig code in fences; pitfall sections show compile errors in Zig format
- **coach/reviewer**: Zig tutor/reviewer personas; compiler errors use Zig's `error[EXXXX]` or `<file>:<line>:<col>: error:` format

---

### D5: Prerequisite graph structure

**Decision:** Use a layered dependency graph:

```
ZF (Foundations) — entry point, no prerequisites
  └─ ZO (Optionals) — needs ZF basics
  └─ ZP (Pointers) — needs ZF basics
  └─ ZA (Arrays/Strings) — needs ZF basics
  └─ ZE (Errors) — needs ZF + ZO
  └─ ZM (Memory) — needs ZP + ZA
  └─ ZC (Comptime) — needs ZF structs/enums
  └─ ZL (Collections) — needs ZM + ZA
  └─ ZI (I/O/FS) — needs ZM + ZA
  └─ ZT (Concurrency) — needs ZM + ZE
  └─ ZX (C Interop) — needs ZP + ZM
  └─ ZB (Build/Test) — needs ZE + ZA
  └─ ZU (Unsafe) — needs ZP + ZM + ZC
  └─ ZG (Advanced Meta) — needs ZC + ZU
```

Root entry node: `ZF01` (variables, types, mutability) — no prerequisites, accessible immediately.

---

### D6: Depth target distribution

**Decision:**
- **D1** (6-8 lesson sections, 2-3 starter files, 7-10 tests): Pure syntax and first-use concepts — first ~3 Foundations nodes, first Optionals node
- **D2** (8-12 lesson sections, 3-4 starter files, 10-14 tests): Standard library usage, common patterns — most Collection, I/O, and Error nodes
- **D3** (10-15 lesson sections, 4-6 starter files, 12-18 tests): Advanced Zig idioms — Unsafe, Advanced Metaprogramming, deep Comptime, Concurrency internals

## Risks / Trade-offs

**Zig stdlib is still evolving** → Some APIs (especially std.fs, std.Thread, std.net) change between minor versions. Mitigation: Target Zig 0.13 (current stable); note version in stage instructions; avoid deprecated async APIs entirely.

**`zig build` test harness differs from `cargo test`** → The test step must compile all `tests/*.zig` into a single test binary. Mitigation: The `build.zig` template adds each `tests/*.zig` as a separate `addTest` step, so individual test files remain independently runnable.

**~100 nodes is a large content task** → The zigSeed.js file will be large. Mitigation: Split by track into separate constants (same pattern as cSeed.js using per-track arrays), then merge at the end of the file.

**Zig doesn't have `undefined` as a default** → Stubs in starter-expand cannot use a single universal placeholder. Mitigation: Zig instructions explicitly list valid placeholder returns by type: `return 0;`, `return null;`, `return .{};`, `return error.Todo;`, `@panic("TODO")`.

## Open Questions

None — scope is fully defined.
