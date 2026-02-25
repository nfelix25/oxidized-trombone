## Purpose

Defines the Zig language curriculum: the language registry entry, project runtime, stage instructions, and the full set of curriculum nodes and tracks that a learner progresses through when studying Zig.

## Requirements

### Requirement: Zig is a selectable language in the curriculum system
The system SHALL register `zig` as a supported language in the language registry with a test command of `["zig", "build", "test"]`, a `build.zig`-based project config writer, and Zig-specific stage instructions (scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer).

#### Scenario: Zig appears in language selection
- **WHEN** a learner runs `session start`
- **THEN** "Zig" appears as a selectable language alongside Rust and C

#### Scenario: Selecting Zig scopes the curriculum to Zig nodes
- **WHEN** a learner selects Zig
- **THEN** `getCurriculumForLanguage("zig")` returns only nodes with `language: "zig"` and tracks containing those nodes

#### Scenario: Zig exercise workspace is created with build.zig
- **WHEN** a Zig session exercise is set up
- **THEN** the workspace contains a valid `build.zig` with a test step and a `src/root.zig` entry point

---

### Requirement: Language Foundations track (ZF) provides core Zig syntax
The system SHALL provide a `zig-foundations` track with 10 nodes (ZF01–ZF10) covering the fundamental building blocks of Zig. ZF01 has no prerequisites and serves as the entry point to the entire Zig curriculum.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZF01 | Variables, constants, and type inference | D1 | — |
| ZF02 | Primitive types: integers, floats, bool, and void | D1 | ZF01 |
| ZF03 | Functions: parameters, return types, and recursion | D1 | ZF01 |
| ZF04 | Control flow: if, while, for, break, continue, and labeled loops | D1 | ZF02, ZF03 |
| ZF05 | switch expressions and exhaustiveness checking | D2 | ZF04 |
| ZF06 | Blocks as expressions and labeled breaks | D2 | ZF04 |
| ZF07 | Structs: fields, methods, and the self parameter | D1 | ZF03 |
| ZF08 | Enums: declarations, methods, and integer representation | D1 | ZF07 |
| ZF09 | Tagged unions: union(enum) and exhaustive switch | D2 | ZF08 |
| ZF10 | defer and errdefer: scope-exit resource cleanup | D2 | ZF04, ZF07 |

**Keywords covered:** `const`, `var`, `comptime_int`, `comptime_float`, `@as`, `usize`, `isize`, `f32`, `f64`, `bool`, `void`, `noreturn`, `fn`, `return`, `inline`, `if`, `while`, `for`, `break`, `continue`, labeled loop, `switch`, `prong`, exhaustiveness, block expression, `blk:`, `struct`, `self`, method, field, `pub`, `enum`, `@intFromEnum`, `@enumFromInt`, `union(enum)`, tagged union, `defer`, `errdefer`, LIFO, scope exit

#### Scenario: ZF01 is the curriculum entry point with no prerequisites
- **WHEN** a learner selects the Zig language and has no mastery
- **THEN** ZF01 is the first eligible node shown in the guided navigator

#### Scenario: Foundations nodes unlock in prerequisite order
- **WHEN** a learner completes ZF04
- **THEN** ZF05 and ZF06 become eligible, and ZF10 becomes eligible after ZF07 is also complete

#### Scenario: Tagged union node requires both enum and switch knowledge
- **WHEN** a learner has completed ZF08 but not ZF05
- **THEN** ZF09 is not yet eligible

---

### Requirement: Pointers and Slices track (ZP) teaches Zig's pointer type system
The system SHALL provide a `zig-pointers` track with 8 nodes (ZP01–ZP08) covering Zig's rich hierarchy of pointer types, slice semantics, alignment, and type-erased pointers.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZP01 | Single-item pointers: *T, address-of, and dereferencing | D2 | ZF07 |
| ZP02 | Slices: []T, ptr+len model, and slice expressions | D2 | ZP01 |
| ZP03 | Many-item pointers: [*]T and pointer arithmetic | D2 | ZP02 |
| ZP04 | Sentinel-terminated arrays and pointers: [N:0]T and [*:0]T | D2 | ZP03 |
| ZP05 | C pointers: [*c]T and interoperability implications | D2 | ZP04 |
| ZP06 | Pointer alignment: @alignOf, @alignCast, @ptrFromInt, @intFromPtr | D3 | ZP03 |
| ZP07 | Type coercion rules for pointers and slices | D2 | ZP02, ZP04 |
| ZP08 | anyopaque: type-erased pointers and vtable patterns | D3 | ZP06, ZF07 |

**Keywords covered:** `*T`, `&`, `.*`, `*const T`, `?*T`, `[]T`, `.len`, `.ptr`, slice expression, `[*]T`, pointer arithmetic, sentinel, `[*:0]T`, `[N:0]T`, null terminator, C string, `std.mem.span`, `[*c]T`, C pointer, nullable, `@alignOf`, `@alignCast`, `@ptrFromInt`, `@intFromPtr`, alignment, coercion, `anyopaque`, `*anyopaque`, `@ptrCast`, type erasure, vtable

#### Scenario: Slice nodes require pointer foundation
- **WHEN** a learner completes ZP01
- **THEN** ZP02 becomes eligible

#### Scenario: anyopaque requires alignment knowledge
- **WHEN** a learner has not completed ZP06
- **THEN** ZP08 is not eligible even if ZF07 is complete

#### Scenario: Sentinel-terminated types gate C pointer node
- **WHEN** a learner completes ZP04
- **THEN** ZP05 becomes eligible for C string interop

---

### Requirement: Memory and Allocators track (ZM) covers Zig's explicit allocator model
The system SHALL provide a `zig-memory` track with 9 nodes (ZM01–ZM09) covering the `std.mem.Allocator` interface and all major standard-library allocator implementations.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZM01 | The std.mem.Allocator interface: alloc, free, create, destroy | D2 | ZP02, ZF10 |
| ZM02 | std.heap.page_allocator: direct OS-level allocation | D2 | ZM01 |
| ZM03 | std.testing.allocator and automatic leak detection | D2 | ZM01 |
| ZM04 | std.heap.GeneralPurposeAllocator: safety and double-free detection | D2 | ZM02 |
| ZM05 | std.heap.ArenaAllocator: bulk allocation and bulk reset | D2 | ZM01 |
| ZM06 | std.heap.FixedBufferAllocator: stack-backed allocation with no heap | D2 | ZM01 |
| ZM07 | std.heap.StackFallbackAllocator: prefer stack, spill to heap | D2 | ZM05, ZM06 |
| ZM08 | Allocator ownership patterns: passing, deinit, and caller-owned data | D2 | ZM01, ZF10 |
| ZM09 | Multi-resource cleanup: errdefer ordering and safe teardown | D3 | ZM08 |

**Keywords covered:** `std.mem.Allocator`, `alloc`, `free`, `create`, `destroy`, `realloc`, `page_allocator`, `GeneralPurposeAllocator`, double-free detection, use-after-free, `ArenaAllocator`, `arena.reset`, `FixedBufferAllocator`, `StackFallbackAllocator`, allocator ownership, `deinit`, caller owns, `errdefer`, defer ordering, multi-resource

#### Scenario: Allocator interface node requires slice and defer knowledge
- **WHEN** a learner has completed ZP02 and ZF10
- **THEN** ZM01 becomes eligible

#### Scenario: All specialized allocators depend on the base interface node
- **WHEN** a learner completes ZM01
- **THEN** ZM02, ZM03, ZM05, ZM06, and ZM08 all become eligible

#### Scenario: StackFallbackAllocator requires both arena and fixed-buffer knowledge
- **WHEN** a learner has completed ZM05 and ZM06
- **THEN** ZM07 becomes eligible

---

### Requirement: Arrays and Strings track (ZA) covers array/slice/string handling
The system SHALL provide a `zig-arrays-strings` track with 7 nodes (ZA01–ZA07) covering Zig's arrays, the absence of a dedicated string type, std.fmt formatting, string parsing, and unicode.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZA01 | Arrays: [N]T literals, multi-dimensional, comptime length, and ++ | D1 | ZF02 |
| ZA02 | Slicing arrays: arr[a..b], mutable vs const slices, open-ended | D1 | ZA01, ZP02 |
| ZA03 | std.mem utilities: copy, eql, indexOf, sort, and reverse | D2 | ZA02 |
| ZA04 | Strings as []const u8: literals, comparison, and comptime concat | D1 | ZA02 |
| ZA05 | std.fmt: format, allocPrint, bufPrint, and format specifiers | D2 | ZA04, ZM01 |
| ZA06 | Parsing strings: std.fmt.parseInt, parseFloat, and charToDigit | D2 | ZA05, ZE02 |
| ZA07 | Unicode: std.unicode, code points vs bytes, and Utf8View | D2 | ZA04 |

**Keywords covered:** `[N]T`, array literal, `++`, `**`, multi-dimensional, `arr[a..b]`, `.len`, mutable slice, const slice, `std.mem.copy`, `std.mem.eql`, `std.mem.indexOf`, `std.mem.sort`, `std.mem.reverse`, `std.mem.startsWith`, `[]const u8`, string literal, `std.fmt`, `std.debug.print`, `allocPrint`, `bufPrint`, `{d}`, `{s}`, `{x}`, `{any}`, `std.fmt.parseInt`, `parseFloat`, `charToDigit`, unicode, UTF-8, code point, `std.unicode`, `Utf8View`

#### Scenario: Array node has minimal prerequisites
- **WHEN** a learner has completed ZF02 (primitive types)
- **THEN** ZA01 is eligible

#### Scenario: String formatting requires allocator knowledge
- **WHEN** a learner has not completed ZM01
- **THEN** ZA05 (allocPrint) is not eligible

#### Scenario: String parsing requires error union knowledge
- **WHEN** a learner has not completed ZE02
- **THEN** ZA06 is not eligible (parseInt returns !i64)

---

### Requirement: Error Handling track (ZE) covers Zig's error model
The system SHALL provide a `zig-errors` track with 7 nodes (ZE01–ZE07) covering error sets, error unions, try/catch, inferred error sets, errdefer, error traces, and choosing between error types and optionals.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZE01 | Error sets: declaring error types and the anyerror catch-all | D2 | ZF04, ZF07 |
| ZE02 | Error unions: !T, try, and catch | D2 | ZE01 |
| ZE03 | Inferred error sets and the !ReturnType shorthand | D2 | ZE02 |
| ZE04 | Error set coercion and combining sets with \|\| | D2 | ZE01, ZE03 |
| ZE05 | errdefer: conditional cleanup on error return | D2 | ZE02, ZF10 |
| ZE06 | Error return traces: how Zig tracks error propagation | D2 | ZE02 |
| ZE07 | Choosing between error unions, optionals, and sentinel values | D2 | ZE03, ZO01 |

**Keywords covered:** error set, `error.Something`, `anyerror`, `!T`, error union, `try`, `catch`, `catch unreachable`, inferred error set, `!ReturnType`, error set coercion, `||`, `errdefer`, error return trace, `@errorReturnTrace`, error vs null vs sentinel

#### Scenario: Error union node requires error set foundation
- **WHEN** a learner completes ZE01
- **THEN** ZE02, ZE03 (with ZE02), and ZE04 (with ZE03) become progressively eligible

#### Scenario: Error-vs-optional comparison node requires both tracks
- **WHEN** a learner has completed ZE03 and ZO01
- **THEN** ZE07 becomes eligible

---

### Requirement: Optionals track (ZO) teaches Zig's null-safety model
The system SHALL provide a `zig-optionals` track with 5 nodes (ZO01–ZO05) covering the `?T` type, all capture syntaxes, orelse, unwrap, and the null-pointer optimization.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZO01 | The ?T type: optional declaration and the null literal | D1 | ZF02 |
| ZO02 | if-capture and while-capture: if (opt) \|val\| syntax | D1 | ZO01, ZF04 |
| ZO03 | orelse: default values and early return/break patterns | D1 | ZO01, ZF04 |
| ZO04 | .? unwrap: asserting non-null and panic on null | D2 | ZO02 |
| ZO05 | Optional pointers: ?*T, null-pointer optimization, @sizeOf | D2 | ZO01, ZP01 |

**Keywords covered:** `?T`, `null`, optional, `if (opt) |val|`, while-capture, `orelse`, `.?`, unwrap, `@panic`, optional pointer, `?*T`, null-pointer optimization, `@sizeOf`

#### Scenario: Optionals entry node requires only primitive types
- **WHEN** a learner has completed ZF02
- **THEN** ZO01 is eligible

#### Scenario: Capture syntax requires both optionals and control flow
- **WHEN** a learner has completed ZO01 and ZF04
- **THEN** ZO02 and ZO03 become eligible

#### Scenario: Optional pointers require pointer knowledge
- **WHEN** a learner has not completed ZP01
- **THEN** ZO05 is not eligible

---

### Requirement: Comptime track (ZC) covers compile-time execution
The system SHALL provide a `zig-comptime` track with 9 nodes (ZC01–ZC09) covering all aspects of Zig's comptime system: the keyword itself, types as values, reflection, generic functions, duck typing, inline for, file embedding, and evaluation limits.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZC01 | comptime keyword: forcing compile-time evaluation | D2 | ZF07, ZF08 |
| ZC02 | type as a first-class value: anytype, type, and @TypeOf | D2 | ZC01 |
| ZC03 | @typeInfo, TypeInfo, and struct field reflection | D3 | ZC02 |
| ZC04 | @hasField, @hasDecl, @field, and runtime-computed field names | D3 | ZC03 |
| ZC05 | Generic functions: fn(comptime T: type, ...) patterns | D2 | ZC02 |
| ZC06 | Comptime duck typing: checking interface conformance | D3 | ZC05, ZC04 |
| ZC07 | inline for: iterating over comptime-known sequences | D2 | ZC01, ZF04 |
| ZC08 | @embedFile: loading resources at compile time | D2 | ZC01 |
| ZC09 | Comptime limits: @compileError, @compileLog, and best practices | D3 | ZC05, ZC07 |

**Keywords covered:** `comptime`, comptime variable, comptime parameter, `type`, `anytype`, `@TypeOf`, `@typeInfo`, `std.builtin.Type`, `TypeInfo`, `@hasField`, `@hasDecl`, `@field`, generic function, monomorphization, comptime duck typing, `std.meta.hasFn`, `inline for`, `@embedFile`, `@compileError`, `@compileLog`

#### Scenario: Comptime entry requires struct and enum knowledge
- **WHEN** a learner has completed ZF07 and ZF08
- **THEN** ZC01 is eligible

#### Scenario: Generic functions build on type-as-value knowledge
- **WHEN** a learner completes ZC02
- **THEN** ZC05 is eligible

#### Scenario: Duck typing requires both generics and field reflection
- **WHEN** a learner has completed ZC05 and ZC04
- **THEN** ZC06 is eligible

---

### Requirement: Collections track (ZL) covers standard library containers
The system SHALL provide a `zig-collections` track with 7 nodes (ZL01–ZL07) covering all major Zig standard library container types.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZL01 | std.ArrayList: dynamic arrays, append, remove, and toOwnedSlice | D2 | ZM01, ZA02 |
| ZL02 | std.ArrayListUnmanaged: ownership-separated variant | D2 | ZL01 |
| ZL03 | std.AutoHashMap: hash tables, getOrPut, and the entry API | D2 | ZM01, ZF07 |
| ZL04 | std.StringHashMap: string-keyed maps and key ownership | D2 | ZL03, ZA04 |
| ZL05 | std.ArrayHashMap: insertion-order-preserving hash map | D2 | ZL03 |
| ZL06 | std.MultiArrayList: structure-of-arrays layout for cache performance | D3 | ZL01, ZF07 |
| ZL07 | std.BoundedArray: fixed-capacity stack-allocated buffer | D2 | ZA01 |

**Keywords covered:** `ArrayList`, `append`, `appendSlice`, `orderedRemove`, `swapRemove`, `pop`, `toOwnedSlice`, `ArrayListUnmanaged`, `AutoHashMap`, `put`, `get`, `getOrPut`, `remove`, `Entry`, iterator, `StringHashMap`, key ownership, `ArrayHashMap`, ordered iteration, `MultiArrayList`, SoA, cache-friendly, `BoundedArray`, fixed capacity

#### Scenario: ArrayList requires allocator and slice knowledge
- **WHEN** a learner has completed ZM01 and ZA02
- **THEN** ZL01 is eligible

#### Scenario: MultiArrayList requires both ArrayList and struct knowledge
- **WHEN** a learner has completed ZL01 and ZF07
- **THEN** ZL06 is eligible

#### Scenario: BoundedArray has minimal prerequisites
- **WHEN** a learner has completed ZA01
- **THEN** ZL07 is eligible

---

### Requirement: I/O and Filesystem track (ZI) covers Zig's I/O model
The system SHALL provide a `zig-io` track with 8 nodes (ZI01–ZI08) covering the Writer/Reader interface abstraction, standard streams, buffered I/O, file and directory operations, path utilities, process management, and child processes.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZI01 | std.io.Writer and Reader: the generic I/O interface model | D2 | ZP08, ZF07 |
| ZI02 | Standard streams: stdout, stderr, stdin and locking | D2 | ZI01 |
| ZI03 | std.io.BufferedWriter and BufferedReader | D2 | ZI02 |
| ZI04 | File I/O: openFile, createFile, reader(), writer(), readAll | D2 | ZI02, ZM01 |
| ZI05 | Directory iteration: Dir.iterate() and recursive Walker | D2 | ZI04 |
| ZI06 | std.fs.path: join, dirname, basename, extension, resolve | D2 | ZA04, ZM01 |
| ZI07 | std.process: args, ArgIterator, getEnvVarOwned, and exit | D2 | ZA04, ZM01 |
| ZI08 | Spawning child processes: std.process.Child and pipes | D3 | ZI07, ZM01 |

**Keywords covered:** `std.io.Writer`, `AnyWriter`, `GenericWriter`, `std.io.Reader`, `std.io.getStdOut`, `.writer()`, `.lock()`, `BufferedWriter`, `flush`, `BufferedReader`, `std.fs.cwd`, `openFile`, `createFile`, `readAll`, `Dir.iterate`, `IterableDir`, `Walker`, `std.fs.path.join`, `dirname`, `basename`, `std.process.args`, `ArgIterator`, `getEnvVarOwned`, `std.process.exit`, `std.process.Child`, pipes, `wait`, `kill`

#### Scenario: Writer interface requires anyopaque knowledge
- **WHEN** a learner has completed ZP08 and ZF07
- **THEN** ZI01 is eligible

#### Scenario: File I/O requires both streams and allocator knowledge
- **WHEN** a learner has completed ZI02 and ZM01
- **THEN** ZI04 is eligible

#### Scenario: Child processes is the most advanced I/O node
- **WHEN** a learner has completed ZI07 and ZM01
- **THEN** ZI08 is eligible

---

### Requirement: Concurrency track (ZT) covers Zig's threading and synchronization
The system SHALL provide a `zig-concurrency` track with 7 nodes (ZT01–ZT07) covering `std.Thread`, all synchronization primitives, atomics, WaitGroup, and thread pool patterns. (Zig async/await is not included as it was removed in Zig 0.12.)

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZT01 | std.Thread: spawn, join, detach, and thread lifecycle | D2 | ZM01, ZF07 |
| ZT02 | std.Thread.Mutex: exclusive access and deadlock avoidance | D2 | ZT01 |
| ZT03 | std.Thread.Condition: condition variables and signalling | D3 | ZT02 |
| ZT04 | std.Thread.RwLock: reader-writer locking | D3 | ZT02 |
| ZT05 | std.atomic.Value: atomic operations and memory ordering | D3 | ZT01 |
| ZT06 | std.Thread.WaitGroup: fan-out/fan-in coordination | D2 | ZT01 |
| ZT07 | Thread pool patterns: fixed pool with Mutex + Condition dispatch | D3 | ZT02, ZT03, ZL01 |

**Keywords covered:** `Thread.spawn`, `Thread.join`, `Thread.detach`, thread function, `Mutex.lock`, `Mutex.unlock`, `Mutex.tryLock`, deadlock, `Condition.wait`, `Condition.signal`, `Condition.broadcast`, spurious wakeup, `RwLock.lockShared`, `lockExclusive`, `std.atomic.Value`, `load`, `store`, `compareAndSwap`, `fetchAdd`, memory ordering, `WaitGroup.start`, `WaitGroup.finish`, `WaitGroup.wait`, thread pool, work queue

#### Scenario: Thread spawn requires allocator and struct knowledge
- **WHEN** a learner has completed ZM01 and ZF07
- **THEN** ZT01 is eligible

#### Scenario: Thread pool requires Mutex, Condition, and ArrayList
- **WHEN** a learner has completed ZT02, ZT03, and ZL01
- **THEN** ZT07 is eligible

#### Scenario: Async/await is explicitly excluded
- **WHEN** a learner searches for "async" or "await" Zig topics
- **THEN** no Zig async nodes exist (async was removed in Zig 0.12)

---

### Requirement: C Interop track (ZX) covers Zig's C interoperability
The system SHALL provide a `zig-c-interop` track with 6 nodes (ZX01–ZX06) covering `@cImport`, extern declarations, the C calling convention, C string handling, packed/extern structs for ABI compatibility, and the translate-c tool.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZX01 | @cImport and @cInclude: consuming C headers in Zig | D2 | ZF07, ZP04 |
| ZX02 | extern functions and variables: linking to C libraries | D2 | ZX01 |
| ZX03 | C calling convention: callconv(.C), export fn, and ABI matching | D2 | ZX02, ZP06 |
| ZX04 | C strings vs Zig slices: std.mem.span and null termination | D2 | ZX01, ZP04 |
| ZX05 | Packed and extern structs: C-compatible data layouts | D3 | ZX03, ZP06 |
| ZX06 | translate-c: automatic C-to-Zig translation and wrapping | D2 | ZX02, ZX04 |

**Keywords covered:** `@cImport`, `@cInclude`, `@cDefine`, `translate-c`, `extern fn`, `extern var`, `-lc`, linkage, `callconv(.C)`, `export`, `extern struct`, `packed struct`, `[*:0]u8`, `std.mem.span`, `std.mem.sliceTo`, C string, `bitOffsetOf`, `zig translate-c`

#### Scenario: C interop entry requires pointer and struct knowledge
- **WHEN** a learner has completed ZF07 and ZP04
- **THEN** ZX01 is eligible

#### Scenario: Packed/extern struct layout requires alignment and ABI knowledge
- **WHEN** a learner has completed ZX03 and ZP06
- **THEN** ZX05 is eligible

---

### Requirement: Build and Testing track (ZB) covers std.testing and build.zig
The system SHALL provide a `zig-build-test` track with 7 nodes (ZB01–ZB07) covering the full testing framework and the Zig build system, from basic test assertions through package management.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZB01 | std.testing: expect, expectEqual, expectError, expectEqualSlices | D1 | ZF04 |
| ZB02 | Test blocks, test names, and refAllDecls | D1 | ZB01, ZE02 |
| ZB03 | std.testing.allocator and automatic memory leak detection in tests | D2 | ZB01, ZM01 |
| ZB04 | build.zig fundamentals: addExecutable, addStaticLibrary, installArtifact | D2 | ZF07 |
| ZB05 | Build steps and dependencies: b.step and step.dependOn | D2 | ZB04 |
| ZB06 | Optimize modes: Debug, ReleaseSafe, ReleaseFast, ReleaseSmall | D2 | ZB04 |
| ZB07 | build.zig.zon: package manifests, b.dependency, and zig fetch | D2 | ZB04 |

**Keywords covered:** `std.testing.expect`, `expectEqual`, `expectEqualStrings`, `expectError`, `expectEqualSlices`, `test "..."`, `refAllDecls`, `std.testing.allocator`, `detectLeaks`, `b.addExecutable`, `b.addStaticLibrary`, `b.installArtifact`, `b.step`, `dependOn`, `b.standardOptimizeOption`, `-Doptimize=`, `Debug`, `ReleaseSafe`, `ReleaseFast`, `ReleaseSmall`, `.zig-pkg`, `b.dependency`, `zig fetch`

#### Scenario: Testing entry node has minimal prerequisites
- **WHEN** a learner has completed ZF04 (control flow)
- **THEN** ZB01 is eligible early in the curriculum

#### Scenario: Test leak detection requires allocator knowledge
- **WHEN** a learner has completed ZB01 and ZM01
- **THEN** ZB03 is eligible

#### Scenario: Build system nodes are accessible with only struct knowledge
- **WHEN** a learner has completed ZF07
- **THEN** ZB04 is eligible

---

### Requirement: Low-Level and Unsafe track (ZU) covers unsafe Zig operations
The system SHALL provide a `zig-unsafe` track with 7 nodes (ZU01–ZU07) covering type reinterpretation, unsafe casts, packed integer types, SIMD vectors, volatile memory, inline assembly, and low-level memory operations.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZU01 | @bitCast: reinterpreting bytes between same-size types | D3 | ZP06, ZF02 |
| ZU02 | @ptrCast and @alignCast: unsafe pointer reinterpretation | D3 | ZP06, ZU01 |
| ZU03 | Packed integers and packed structs: bit-field layout patterns | D3 | ZU01, ZF07 |
| ZU04 | @Vector and SIMD: data-parallel arithmetic operations | D3 | ZU01, ZA01 |
| ZU05 | Volatile and memory-mapped I/O: hardware register access | D3 | ZP06, ZU01 |
| ZU06 | Inline assembly: asm volatile() syntax and constraints | D3 | ZU05 |
| ZU07 | @memcpy, @memset, @memmove, and noalias | D2 | ZP03, ZM01 |

**Keywords covered:** `@bitCast`, byte reinterpretation, endianness, `@ptrCast`, `@alignCast`, unsafe cast, packed integer, `u1`–`u127`, `packed struct`, `@bitSizeOf`, `@Vector(N, T)`, element-wise, `@shuffle`, `@select`, SIMD, `volatile`, memory-mapped I/O, hardware register, `asm volatile()`, constraints, clobbers, `@memcpy`, `@memset`, `@memmove`, `noalias`

#### Scenario: All unsafe nodes require alignment knowledge as a foundation
- **WHEN** a learner has not completed ZP06
- **THEN** ZU01, ZU02, ZU05 are not eligible

#### Scenario: @memcpy and @memset have lower barrier than the rest of the track
- **WHEN** a learner has completed ZP03 and ZM01
- **THEN** ZU07 is eligible even without ZP06

#### Scenario: Inline assembly is the most advanced unsafe node
- **WHEN** a learner has completed ZU05
- **THEN** ZU06 is eligible

---

### Requirement: Advanced Metaprogramming track (ZG) covers comptime type generation
The system SHALL provide a `zig-metaprogramming` track with 5 nodes (ZG01–ZG05) covering comptime interface checking, struct generation with @Type, struct field reflection, tagged union dispatch tables, and compile-time assertion patterns.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| ZG01 | Comptime interfaces: defining and enforcing trait-like contracts | D3 | ZC06 |
| ZG02 | Automatic struct generation with @Type and TypeInfo.Struct | D3 | ZC03, ZG01 |
| ZG03 | Struct field reflection and comptime string manipulation | D3 | ZC04, ZC07 |
| ZG04 | Tagged union dispatch via comptime: type-indexed switch tables | D3 | ZF09, ZC05, ZG01 |
| ZG05 | @compileError, @compileLog, and compile-time assertion strategies | D3 | ZC09 |

**Keywords covered:** comptime interface, `@hasDecl`, interface assertion, `@Type`, `TypeInfo.Struct`, struct generation, field merging, `std.meta.fields`, field name strings, `comptime` string, tagged union dispatch, type-indexed switch, `@compileError`, `@compileLog`, `std.debug.assert`, comptime assertion

#### Scenario: All metaprogramming nodes are advanced (D3)
- **WHEN** a learner views any ZG node
- **THEN** all ZG nodes have depth target D3

#### Scenario: Comptime interface node is the entry to metaprogramming
- **WHEN** a learner has completed ZC06
- **THEN** ZG01 is eligible and unlocks ZG02 (with ZC03) and ZG04 (with ZF09 and ZC05)

#### Scenario: Dispatch table node requires union, generics, and interface knowledge
- **WHEN** a learner has completed ZF09, ZC05, and ZG01
- **THEN** ZG04 is eligible
