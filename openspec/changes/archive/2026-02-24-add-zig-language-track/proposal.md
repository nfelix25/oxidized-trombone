## Why

The language registry lists Zig, but selecting it at session start produces no tracks or nodes — the curriculum is empty. Zig is a first-principles systems language with a distinctive allocator model, rich comptime system, unique error handling, and no hidden control flow. A learner should be able to use this system to go from zero Zig knowledge to production-ready fluency. This change adds a fully comprehensive Zig curriculum: ~100 nodes across 14 tracks, covering every major area of the language and standard library.

## What Changes

- Register `zig` fully in `src/config/languages.js` with correct test command, source/test dir paths, and project config (build.zig-based)
- Add ~100 Zig curriculum nodes organized into 14 tracks with a full prerequisite graph
- Each node carries keywords for custom topic search, misconception tags for common Zig learner errors, and appropriate depth targets (D1/D2/D3)
- No changes to session flow, picker, mastery, or exercise loop — all are language-agnostic

**Tracks (planned):**
1. **Language Foundations** (~10 nodes, D1-D2) — const/var, primitive types, functions, control flow, switch, blocks-as-expressions, defer, structs, enums, tagged unions
2. **Pointers and Slices** (~8 nodes, D2-D3) — *T, []T, [*]T, [*:0]T, [*c]T, anyopaque, alignment, coercion rules
3. **Memory and Allocators** (~9 nodes, D2-D3) — std.mem.Allocator interface, page_allocator, GeneralPurposeAllocator, ArenaAllocator, FixedBufferAllocator, StackFallbackAllocator, allocator composition, errdefer patterns
4. **Arrays and Strings** (~7 nodes, D1-D2) — [N]T arrays, slice coercion, std.mem utilities, []const u8 strings, std.fmt, parsing, unicode
5. **Error Handling** (~7 nodes, D2-D3) — error sets, error unions (!T), try/catch, inferred error sets, errdefer, error return traces, error set coercion
6. **Optionals** (~5 nodes, D1-D2) — ?T, null, if-capture, orelse, .? unwrap, optional pointer null-optimization
7. **Comptime** (~9 nodes, D2-D3) — comptime keyword, type as value, anytype, @TypeOf, @typeInfo, @field, generic functions, duck typing, inline for, @embedFile
8. **Collections** (~7 nodes, D2) — ArrayList, ArrayListUnmanaged, AutoHashMap, StringHashMap, ArrayHashMap, MultiArrayList, BoundedArray
9. **I/O and Filesystem** (~8 nodes, D2-D3) — std.io.Writer/Reader, stdout/stderr/stdin, buffered I/O, std.fs file and directory operations, std.fs.path, std.process, child processes
10. **Concurrency** (~7 nodes, D2-D3) — std.Thread, Mutex, Condition, RwLock, std.atomic.Value, WaitGroup, thread pool patterns
11. **C Interop** (~6 nodes, D2-D3) — @cImport/@cInclude, extern functions/variables, C ABI and calling conventions, C strings vs Zig slices, packed/extern structs, translate-c
12. **Build System** (~7 nodes, D1-D3) — std.testing, test blocks, leak detection, build.zig fundamentals, steps/artifacts, optimize modes (Debug/ReleaseSafe/ReleaseFast/ReleaseSmall), build.zig.zon package manager
13. **Low-Level and Unsafe** (~7 nodes, D3) — @bitCast, @ptrCast/@alignCast, packed integers, @Vector/SIMD, volatile and memory-mapped I/O, inline assembly, @memcpy/@memset
14. **Advanced Metaprogramming** (~5 nodes, D3) — comptime interfaces, automatic struct generation via @Type, constructing TypeInfo at comptime, comptime string manipulation, @compileError/@compileLog

## Capabilities

### New Capabilities
- `zig-curriculum`: Comprehensive Zig learning curriculum — 14 tracks, ~100 nodes, full prerequisite dependency graph, keyword coverage for topic search, misconception tags, and depth targets

### Modified Capabilities
<!-- none — existing spec-level behavior is language-agnostic; no requirement changes -->

## Impact

- `src/config/languages.js` — add `zig` entry with build.zig project config, test command, and depth targets
- `src/curriculum/` — new Zig node definitions (~100 nodes); update track/node index and `allCurricula.js`
- `getCurriculumForLanguage("zig")` already works once nodes are registered — no code changes needed there
- `fixtures/` — new exercise seed fixtures for Zig scaffold/test/lesson templates
- No session, picker, mastery, or orchestration changes
