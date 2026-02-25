## Context

The JS runtime curriculum is the primary learning goal. The C systems curriculum (expand-c-systems-curriculum) provides the OS foundation; this change builds the tower on top. Each node in this curriculum implements a minimal but real piece of JS engine machinery in C — not a toy example, not pseudocode, but a working implementation that can be compiled and tested. The exercises are designed so that a JS developer recognizes what they're building ("oh, this is how setTimeout scheduling works") even though the implementation is in C.

All nodes use `language: "c"` — the C toolchain and Makefile/test.h harness from the C track handles compilation. The J-prefix ID scheme avoids collisions with all existing tracks (Rust single-letter, C = C+digit, Zig = Z+letter, Python = P+letter, C++ = CF/CP/etc).

## Goals / Non-Goals

**Goals:**
- 70 nodes across 10 tracks covering the full JS engine stack: lexer → parser → AST → bytecode → VM → object model → GC → event loop → promises → JIT → runtime APIs
- Each node is a standalone, testable exercise — no node requires building a full engine
- Cross-track prerequisites wire JS runtime nodes to C systems nodes where OS knowledge is required
- Node descriptions explicitly motivate the "why JS behaves this way" connection

**Non-Goals:**
- Building an actual usable JS runtime
- Implementing a complete language (e.g. full ES2023 compliance)
- Zig/Rust/Python versions of these nodes — C is the right language for systems-level runtime internals
- Optimizing for performance in the exercises — correctness and clarity are the goals

## Decisions

### Node ID scheme: J + track-letter + 2-digit number
- JL = Language frontend (Lexer/parser)
- JB = Bytecode
- JV = Virtual Machine
- JO = Object model
- JG = Garbage collection
- JE = Event loop
- JP = Promises/async
- JC = Closures/scope
- JT = JIT and optimization
- JR = Runtime internals

Two-digit suffixes (01–09) allow up to 9 nodes per track, which matches the design. Using J as the family prefix avoids collision with existing C+letter C++ nodes.

### All nodes use language: "c"
The exercises implement runtime internals. C is the natural implementation language for this — close to the metal, forces explicit memory management (which is exactly what the GC nodes teach), and directly mirrors what V8/JSC are written in.

### Cross-track prerequisites (JS runtime → C systems)
Seven JS runtime nodes list C systems nodes as prerequisites. These are hard dependencies — you cannot meaningfully implement a kqueue-backed event loop without understanding kqueue:
- JE02 (kqueue I/O backend) → prereq: C501 (kqueue fundamentals)
- JE03 (timer heap) → prereq: C502 (kqueue timers)
- JE05 (thread pool integration) → prereq: C600 (thread pool pattern)
- JG02 (bump allocator) → prereq: C303 (implementing allocator)
- JG04 (root enumeration) → prereq: C602 (thread-local storage)
- JT07 (basic code gen) → prereq: C302 (mprotect, executable pages)
- JR04 (native addons) → prereq: C703 (N-API pattern)

This means `expand-c-systems-curriculum` must be implemented before `add-js-runtime-curriculum`.

### Track ordering for implementation
The tracks form a loose dependency graph. Recommended implementation order:
1. JL (language frontend) — standalone, no runtime prereqs
2. JB (bytecode) — depends on JL for context
3. JV (virtual machine) — consumes bytecode
4. JO (object model) — standalone, feeds into GC and VM
5. JG (garbage collection) — builds on JO + C303/C602
6. JE (event loop) — builds on C501/C502/C600
7. JP (promises/async) — builds on JE + JV
8. JC (closures/scope) — builds on JV + JL
9. JT (JIT) — builds on JV + JO + C302
10. JR (runtime internals) — builds on most of the above

### Single new seed file: jsSeed.js
All 70 nodes go in `src/curriculum/jsSeed.js`. Same pattern as zigSeed.js, pythonSeed.js, etc. The file exports `jsCurriculum` which is spread into `allCurricula.js`.

## Risks / Trade-offs

- [Risk: "language: c" for JS runtime nodes is surprising] → The exercises ARE written in C. The language field controls which toolchain/runtime is used for the exercise workspace. This is correct.
- [Risk: Cross-track prereqs to C3xx–C8xx nodes that don't exist until expand-c-systems-curriculum is applied] → expand-c-systems-curriculum must be applied first. Document this ordering requirement clearly.
- [Risk: Node count makes jsSeed.js large (~1000 lines)] → Acceptable. It's data, not logic. Same pattern as other seed files.
- [Risk: Some "why JS behaves this way" connections are motivating but the exercises are hard] → Depth targets are chosen carefully: D2 for foundational concepts, D3 for advanced ones. The progression is gradual.
