## Purpose
Specifies the JS runtime curriculum: 70 nodes across 10 tracks implementing JS engine internals in C. Covers the full engine stack from lexer/parser through bytecode, VM, object model, GC, event loop, promises, closures, JIT, and runtime APIs. All nodes use `language: "c"`.

## Requirements

### Requirement: JL — Language Frontend track exists (JL01–JL09)
The system SHALL include a `js-language-frontend` track with nine nodes covering lexical analysis, parsing, AST design, scope analysis, error recovery, source maps, and incremental parsing.

#### Scenario: JL01 covers lexical analysis
- **WHEN** a session targets node JL01
- **THEN** the scaffold plans content on character scanning, token types, lookahead, and DFA-based tokenization

#### Scenario: JL02 covers lexing special token types
- **WHEN** a session targets node JL02
- **THEN** the scaffold plans content on lexing strings, numbers, template literals, and regex tokens including escape sequences and edge cases

#### Scenario: JL03 covers recursive descent parsing
- **WHEN** a session targets node JL03
- **THEN** the scaffold plans content on statement grammar, top-down parsing, and the relationship between grammar rules and parsing functions

#### Scenario: JL04 covers Pratt parsing
- **WHEN** a session targets node JL04
- **THEN** the scaffold plans content on top-down operator precedence (Pratt parsing), binding power, null denotation / left denotation functions, and why V8 uses this approach

#### Scenario: JL05 covers AST design
- **WHEN** a session targets node JL05
- **THEN** the scaffold plans content on node types, source position tracking, visitor pattern, and memory-efficient AST representation

#### Scenario: JL06 covers scope analysis
- **WHEN** a session targets node JL06
- **THEN** the scaffold plans content on binding analysis, hoisting, temporal dead zone (TDZ), and strict mode differences

#### Scenario: JL07 covers error recovery in parsers
- **WHEN** a session targets node JL07
- **THEN** the scaffold plans content on synchronization points, panic-mode recovery, and how to produce partial ASTs for editor tooling

#### Scenario: JL08 covers source maps
- **WHEN** a session targets node JL08
- **THEN** the scaffold plans content on source map format (VLQ encoding), mapping positions from generated to original code, and their role in debuggers

#### Scenario: JL09 covers incremental parsing
- **WHEN** a session targets node JL09
- **THEN** the scaffold plans content on invalidation regions, identifying changed syntax regions, and reparsing only what changed for editor performance

### Requirement: JB — Bytecode track exists (JB01–JB06)
The system SHALL include a `js-bytecode` track with six nodes covering stack-based bytecode, register-based bytecode (V8 Ignition), constant folding, serialization, disassembly, and compilation units.

#### Scenario: JB01 covers stack-based bytecode
- **WHEN** a session targets node JB01
- **THEN** the scaffold plans content on opcode design, operand encoding, constant pool, and a minimal stack-based bytecode interpreter

#### Scenario: JB02 covers register-based bytecode
- **WHEN** a session targets node JB02
- **THEN** the scaffold plans content on V8 Ignition's register machine design, virtual registers, and why register machines generate fewer instructions than stack machines

#### Scenario: JB03 covers constant folding
- **WHEN** a session targets node JB03
- **THEN** the scaffold plans content on compile-time evaluation of constant expressions in the bytecode emitter, foldable operations, and guarding against side effects

#### Scenario: JB04 covers bytecode serialization
- **WHEN** a session targets node JB04
- **THEN** the scaffold plans content on code cache format, snapshot serialization, and how V8's code caching avoids reparsing on repeat loads

#### Scenario: JB05 covers bytecode disassembly
- **WHEN** a session targets node JB05
- **THEN** the scaffold plans content on producing human-readable bytecode output from a binary stream, useful for debugging compiler output

#### Scenario: JB06 covers compilation units
- **WHEN** a session targets node JB06
- **THEN** the scaffold plans content on the differences between script, module, and eval compilation contexts and their scope and bytecode implications

### Requirement: JV — Virtual Machine track exists (JV01–JV08)
The system SHALL include a `js-virtual-machine` track with eight nodes covering stack interpretation, call frames, NaN boxing, tagged pointers, exception handling, generator frames, computed-goto dispatch, and basic inline caching.

#### Scenario: JV01 covers a stack interpreter
- **WHEN** a session targets node JV01
- **THEN** the scaffold plans content on value stack, call stack, and a dispatch loop over opcodes

#### Scenario: JV02 covers call frames
- **WHEN** a session targets node JV02
- **THEN** the scaffold plans content on activation records, return addresses, argument passing conventions, and spread/rest argument handling

#### Scenario: JV03 covers NaN boxing
- **WHEN** a session targets node JV03
- **THEN** the scaffold plans content on encoding all JS value types (number, string, object, null, undefined, boolean) within a 64-bit double using NaN payload bits, as used by V8 and JSC

#### Scenario: JV04 covers tagged pointers
- **WHEN** a session targets node JV04
- **THEN** the scaffold plans content on Smi (small integer) encoding using the low bit, heap object pointer tagging, and the performance benefit of avoiding heap allocation for small integers

#### Scenario: JV05 covers exception handling
- **WHEN** a session targets node JV05
- **THEN** the scaffold plans content on try/catch/finally implementation, stack unwinding, and how the VM restores state on exception

#### Scenario: JV06 covers generator frames
- **WHEN** a session targets node JV06
- **THEN** the scaffold plans content on suspending a generator function mid-execution, saving and restoring the register file and program counter, and the yield protocol

#### Scenario: JV07 covers computed-goto dispatch
- **WHEN** a session targets node JV07
- **THEN** the scaffold plans content on GCC/Clang label-as-values extension, direct-threaded interpretation, and why computed-goto is the fastest interpreter dispatch technique in C

#### Scenario: JV08 covers basic inline caching
- **WHEN** a session targets node JV08
- **THEN** the scaffold plans content on caching property offsets at property-access call sites, monomorphic vs polymorphic IC states, and why IC misses are expensive

### Requirement: JO — Object Model track exists (JO01–JO07)
The system SHALL include a `js-object-model` track with seven nodes covering hidden classes, property storage, prototype chains, property descriptors, array internals, Symbol, and Proxy/Reflect.

#### Scenario: JO01 covers hidden classes and shapes
- **WHEN** a session targets node JO01
- **THEN** the scaffold plans content on V8 Maps / hidden classes, property transition trees, and why adding properties in a consistent order keeps objects monomorphic

#### Scenario: JO02 covers property storage
- **WHEN** a session targets node JO02
- **THEN** the scaffold plans content on in-object slots vs out-of-object backing store, when V8 promotes properties to the backing store, and the performance implication

#### Scenario: JO03 covers prototype chain lookup
- **WHEN** a session targets node JO03
- **THEN** the scaffold plans content on [[Prototype]] internal slot, the property lookup algorithm walking the chain, and how prototype chain depth affects lookup cost

#### Scenario: JO04 covers property descriptors
- **WHEN** a session targets node JO04
- **THEN** the scaffold plans content on writable/enumerable/configurable attributes, Object.defineProperty semantics, and the performance cost of non-writable properties

#### Scenario: JO05 covers array internals
- **WHEN** a session targets node JO05
- **THEN** the scaffold plans content on dense (packed) vs sparse (holey) arrays, the elements kinds hierarchy in V8, and why creating holes degrades array performance

#### Scenario: JO06 covers Symbol
- **WHEN** a session targets node JO06
- **THEN** the scaffold plans content on unique property key semantics, well-known symbols (Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance), and the global Symbol registry

#### Scenario: JO07 covers Proxy and Reflect
- **WHEN** a session targets node JO07
- **THEN** the scaffold plans content on fundamental operation interception (get, set, has, deleteProperty), Reflect as a passthrough, and the performance cost of Proxy traps

### Requirement: JG — Garbage Collection track exists (JG01–JG08)
The system SHALL include a `js-garbage-collection` track with eight nodes covering heap layout, bump-pointer allocation, minor GC (scavenger), root enumeration, mark phase, sweep/compact, write barriers, and weak references.

#### Scenario: JG01 covers heap layout
- **WHEN** a session targets node JG01
- **THEN** the scaffold plans content on new space (nursery), old space, large object space, and the motivation for generational collection

#### Scenario: JG02 covers bump-pointer allocation
- **WHEN** a session targets node JG02
- **THEN** the scaffold plans content on implementing fast object allocation using a bump pointer in the nursery, and why this is O(1) and cache-friendly

#### Scenario: JG03 covers minor GC — the Scavenger
- **WHEN** a session targets node JG03
- **THEN** the scaffold plans content on semi-space copying collection, from-space and to-space, Cheney's algorithm, and why most objects die young (generational hypothesis)

#### Scenario: JG04 covers root enumeration
- **WHEN** a session targets node JG04
- **THEN** the scaffold plans content on stack scanning for live references, global roots, handle scopes as GC roots, and thread-local root sets

#### Scenario: JG05 covers the mark phase
- **WHEN** a session targets node JG05
- **THEN** the scaffold plans content on tricolor marking (white/grey/black), a work list (grey set), DFS traversal, and incremental marking interruption

#### Scenario: JG06 covers sweep and compact
- **WHEN** a session targets node JG06
- **THEN** the scaffold plans content on free list construction from swept pages, compaction to reduce fragmentation, and updating pointers after moving objects

#### Scenario: JG07 covers write barriers
- **WHEN** a session targets node JG07
- **THEN** the scaffold plans content on the generational write barrier (record old→new pointers), the incremental marking barrier (remark on pointer store), and their implementation cost

#### Scenario: JG08 covers weak references
- **WHEN** a session targets node JG08
- **THEN** the scaffold plans content on WeakMap/WeakRef/FinalizationRegistry semantics, how the GC processes weak cells after marking, and use cases (caches, observable object lifecycle)

### Requirement: JE — Event Loop track exists (JE01–JE08)
The system SHALL include a `js-event-loop` track with eight nodes covering libuv loop phases, kqueue I/O backend, timer heap, microtask queue, thread pool integration, handle/request lifecycle, stream backpressure, and process.nextTick.

#### Scenario: JE01 covers event loop phases
- **WHEN** a session targets node JE01
- **THEN** the scaffold plans content on the libuv event loop phases in order: timers, pending callbacks, idle/prepare, poll, check, close callbacks; and why phase ordering matters for setTimeout vs setImmediate

#### Scenario: JE02 covers kqueue as I/O backend
- **WHEN** a session targets node JE02
- **THEN** the scaffold plans content on integrating EVFILT_READ/WRITE events from kqueue into the poll phase of the event loop

#### Scenario: JE03 covers the timer heap
- **WHEN** a session targets node JE03
- **THEN** the scaffold plans content on implementing a binary min-heap for timer scheduling, timer expiry detection in the timers phase, and setInterval repeat scheduling

#### Scenario: JE04 covers the microtask queue
- **WHEN** a session targets node JE04
- **THEN** the scaffold plans content on ordering guarantees (microtasks drain fully before returning to event loop), microtask starvation risk, and checkpoint timing between phases

#### Scenario: JE05 covers thread pool integration
- **WHEN** a session targets node JE05
- **THEN** the scaffold plans content on posting blocking work to the thread pool, delivering results back to the main thread, and how this enables non-blocking file I/O on top of synchronous OS calls

#### Scenario: JE06 covers handle and request lifecycle
- **WHEN** a session targets node JE06
- **THEN** the scaffold plans content on what keeps the event loop alive (active handles and requests), uv_ref/uv_unref, and the lifecycle of a TCP handle from creation to close

#### Scenario: JE07 covers stream backpressure
- **WHEN** a session targets node JE07
- **THEN** the scaffold plans content on highWaterMark, the drain event, cork/uncork, and how a writable stream prevents unbounded memory growth from a fast producer

#### Scenario: JE08 covers process.nextTick
- **WHEN** a session targets node JE08
- **THEN** the scaffold plans content on nextTick draining before Promise microtasks, why this is a Node.js-specific behavior not in the spec, and the historical reason it exists

### Requirement: JP — Promises and Async track exists (JP01–JP06)
The system SHALL include a `js-promises-async` track with six nodes covering the Promise state machine, resolution procedure, async/await desugaring, async iterators, unhandled rejection tracking, and Promise combinators.

#### Scenario: JP01 covers the Promise state machine
- **WHEN** a session targets node JP01
- **THEN** the scaffold plans content on pending/fulfilled/rejected states, reaction records (then/catch/finally callbacks), and the one-way state transition rule

#### Scenario: JP02 covers the Promise resolution procedure
- **WHEN** a session targets node JP02
- **THEN** the scaffold plans content on the [[Resolve]] spec algorithm, thenable assimilation, and why resolving with a thenable creates an extra microtask

#### Scenario: JP03 covers async/await desugaring
- **WHEN** a session targets node JP03
- **THEN** the scaffold plans content on rewriting async functions as generator + promise machinery, suspension points at await, and why async stack traces look different

#### Scenario: JP04 covers async iterators
- **WHEN** a session targets node JP04
- **THEN** the scaffold plans content on Symbol.asyncIterator, the AsyncIterator protocol, for-await-of desugaring, and async generator functions

#### Scenario: JP05 covers unhandled rejection tracking
- **WHEN** a session targets node JP05
- **THEN** the scaffold plans content on PromiseReactionJob timing, the unhandledRejection event, microtask checkpoint timing, and why detection requires a turn of the event loop

#### Scenario: JP06 covers Promise combinators
- **WHEN** a session targets node JP06
- **THEN** the scaffold plans content on implementing Promise.all, Promise.allSettled, Promise.race, and Promise.any from scratch using the state machine primitives

### Requirement: JC — Closures and Scope track exists (JC01–JC05)
The system SHALL include a `js-closures-scope` track with five nodes covering upvalues, closure cells, variable hoisting, module scope, and eval scope.

#### Scenario: JC01 covers upvalues
- **WHEN** a session targets node JC01
- **THEN** the scaffold plans content on capturing enclosing-scope variables (Lua-style upvalue model), open vs closed upvalue lifecycle, and how closures keep variables alive past function return

#### Scenario: JC02 covers closure cells
- **WHEN** a session targets node JC02
- **THEN** the scaffold plans content on shared mutable state across multiple closures capturing the same variable, the cell indirection pattern, and the classic loop-variable capture bug

#### Scenario: JC03 covers variable hoisting
- **WHEN** a session targets node JC03
- **THEN** the scaffold plans content on why var is function-scoped and hoisted, let/const TDZ enforcement, and the implementation of TDZ as a sentinel value in the register file

#### Scenario: JC04 covers module scope
- **WHEN** a session targets node JC04
- **THEN** the scaffold plans content on live bindings (ESM export references are live, not copied), namespace objects, and circular dependency handling in the module loader

#### Scenario: JC05 covers eval scope
- **WHEN** a session targets node JC05
- **THEN** the scaffold plans content on why eval breaks static scope analysis and prevents JIT optimization, the difference between direct and indirect eval, and strict-mode eval scoping

### Requirement: JT — JIT and Optimization track exists (JT01–JT07)
The system SHALL include a `js-jit-optimization` track with seven nodes covering tiered compilation, type feedback vectors, speculative optimization, deoptimization, escape analysis, inline expansion, and basic machine code generation.

#### Scenario: JT01 covers tiered compilation
- **WHEN** a session targets node JT01
- **THEN** the scaffold plans content on the interpreter → baseline → optimizing compiler pipeline (Ignition → Maglev → Turbofan in V8), tier promotion thresholds, and the cost-benefit tradeoff of each tier

#### Scenario: JT02 covers type feedback vectors
- **WHEN** a session targets node JT02
- **THEN** the scaffold plans content on recording observed types at IC sites in a feedback vector, slot types (call, load, store), and how feedback drives optimization decisions

#### Scenario: JT03 covers speculative optimization
- **WHEN** a session targets node JT03
- **THEN** the scaffold plans content on assuming observed types hold, generating optimized code for the assumed case, and inserting deoptimization guards for violations

#### Scenario: JT04 covers deoptimization
- **WHEN** a session targets node JT04
- **THEN** the scaffold plans content on detecting bailout conditions, the deopt frame reconstruction problem, returning to the interpreter at the correct bytecode offset with correct register values

#### Scenario: JT05 covers escape analysis
- **WHEN** a session targets node JT05
- **THEN** the scaffold plans content on determining whether an object escapes its allocation scope, stack-allocating non-escaping objects, and the conditions that prevent stack allocation

#### Scenario: JT06 covers inline expansion
- **WHEN** a session targets node JT06
- **THEN** the scaffold plans content on when inlining is profitable (call frequency, callee size), the deopt frame reconstruction complexity it introduces, and inlining depth limits

#### Scenario: JT07 covers basic machine code generation
- **WHEN** a session targets node JT07
- **THEN** the scaffold plans content on emitting x86-64 or ARM64 instruction bytes from a simple IR, allocating executable memory with mprotect, and the minimal structure of a JIT-compiled function

### Requirement: JR — Runtime Internals track exists (JR01–JR06)
The system SHALL include a `js-runtime-internals` track with six nodes covering string internals, regex engine, module system, native addons, inspector protocol, and structured clone.

#### Scenario: JR01 covers string internals
- **WHEN** a session targets node JR01
- **THEN** the scaffold plans content on string interning (one unique copy of each string literal), one-byte vs two-byte encoding, string slices (substring without copying), and the cons-string (concatenation rope)

#### Scenario: JR02 covers the regex engine
- **WHEN** a session targets node JR02
- **THEN** the scaffold plans content on NFA construction from a regex pattern, backtracking simulation, and the Irregexp approach used by V8 for high-performance regex

#### Scenario: JR03 covers the module system
- **WHEN** a session targets node JR03
- **THEN** the scaffold plans content on ESM module records (Parse → Link → Evaluate phases), dynamic import() mechanics, and import.meta.url resolution

#### Scenario: JR04 covers native addons
- **WHEN** a session targets node JR04
- **THEN** the scaffold plans content on N-API (napi_env, napi_value, napi_create_function), calling a C function from JS, and the GC interaction requirements for native objects

#### Scenario: JR05 covers the inspector protocol
- **WHEN** a session targets node JR05
- **THEN** the scaffold plans content on the Chrome DevTools Protocol (CDP), how the runtime exposes breakpoints and profiler data over a WebSocket, and SIGUSR2 as the activation signal

#### Scenario: JR06 covers structured clone
- **WHEN** a session targets node JR06
- **THEN** the scaffold plans content on postMessage serialization format, transferable objects (ArrayBuffer ownership transfer), and SharedArrayBuffer semantics

### Requirement: JS runtime nodes have correct cross-track prerequisites
Seven nodes in the JS runtime curriculum SHALL list specific C systems curriculum nodes as prerequisites, establishing the required OS foundation before attempting runtime implementation.

#### Scenario: JE02 requires C501
- **WHEN** the curriculum is loaded
- **THEN** node JE02 has `"C501"` in its prerequisites array

#### Scenario: JE03 requires C502
- **WHEN** the curriculum is loaded
- **THEN** node JE03 has `"C502"` in its prerequisites array

#### Scenario: JE05 requires C600
- **WHEN** the curriculum is loaded
- **THEN** node JE05 has `"C600"` in its prerequisites array

#### Scenario: JG02 requires C303
- **WHEN** the curriculum is loaded
- **THEN** node JG02 has `"C303"` in its prerequisites array

#### Scenario: JG04 requires C602
- **WHEN** the curriculum is loaded
- **THEN** node JG04 has `"C602"` in its prerequisites array

#### Scenario: JT07 requires C302
- **WHEN** the curriculum is loaded
- **THEN** node JT07 has `"C302"` in its prerequisites array

#### Scenario: JR04 requires C703
- **WHEN** the curriculum is loaded
- **THEN** node JR04 has `"C703"` in its prerequisites array

### Requirement: JS Runtime High-Priority Composite Nodes Are Split Into Atomic Sub-Nodes
Nodes that conflate multiple unrelated concepts SHALL be replaced by atomic sub-nodes:

- **JL06** (scope analysis: binding, hoisting, TDZ, strict mode) SHALL be split into: JL06a (binding and scope chain), JL06b (var hoisting and function hoisting), and JL06c (TDZ and strict mode). Chain: JL05→JL06a→JL06b→JL06c.
- **JP03** (async/await desugaring: generator + promise machinery) SHALL be split into: JP03a (generator coroutine mechanics: suspend, resume, iterator protocol) and JP03b (async/await desugaring, prereqs JP01+JP03a).
- **JC04** (module scope: live bindings, namespace objects, circular deps) SHALL be split into: JC04a (live bindings in ESM), JC04b (namespace objects, prereq JC04a), and JC04c (circular module dependencies, prereq JC04b).
- **JR01** (string internals: interning, encoding, slices) SHALL be split into: JR01a (string interning), JR01b (one-byte vs two-byte encoding, prereq JR01a), and JR01c (string slices and cons strings, prereq JR01b).
- **JR03** (module system: ESM records, dynamic import, import.meta) SHALL be split into: JR03a (module records: graph, link, evaluate phases), JR03b (dynamic import(), prereq JR03a), and JR03c (import.meta, prereq JR03b).
- **JO07** (Proxy and Reflect) SHALL be split into: JO07a (Proxy trap mechanism, prereq JO03) and JO07b (Reflect API, prereq JO07a).
- **JO01** (hidden classes and shapes) SHALL add JV01 (stack interpreter) as a prerequisite.

#### Scenario: JL06a covers binding and scope chain only
- **WHEN** a session targets node JL06a
- **THEN** the scaffold plans content on binding analysis, scope chain structure, and identifier resolution — without hoisting or TDZ

#### Scenario: JL06b covers hoisting only
- **WHEN** a session targets node JL06b
- **THEN** the scaffold plans content on var hoisting, function declaration hoisting, and how the scope analyzer pre-populates the scope before execution

#### Scenario: JL06c covers TDZ and strict mode
- **WHEN** a session targets node JL06c
- **THEN** the scaffold plans content on temporal dead zone enforcement for let/const, strict mode scope differences, and TDZ as a sentinel in the register file

#### Scenario: JP03a covers generator coroutine mechanics
- **WHEN** a session targets node JP03a
- **THEN** the scaffold plans content on function* syntax, yield suspend/resume semantics, the GeneratorObject state machine, and the iterator protocol implementation

#### Scenario: JP03b covers async/await desugaring
- **WHEN** a session targets node JP03b
- **THEN** the scaffold plans content on rewriting async functions as generator + promise machinery, PromiseReactionJob scheduling at await, and async stack trace behavior

#### Scenario: JC04a covers live bindings
- **WHEN** a session targets node JC04a
- **THEN** the scaffold plans content on ESM live binding semantics (exported bindings are references, not copies), and how import binding updates propagate

#### Scenario: JC04c covers circular dependencies
- **WHEN** a session targets node JC04c
- **THEN** the scaffold plans content on circular module graphs, TDZ in modules, evaluation order guarantees, and how the module loader handles cycles

#### Scenario: JR01a covers string interning
- **WHEN** a session targets node JR01a
- **THEN** the scaffold plans content on string interning, the symbol table for unique string identity, and when V8 interns strings

#### Scenario: JR03a covers module records
- **WHEN** a session targets node JR03a
- **THEN** the scaffold plans content on the cyclic module record, the Parse → Link → Evaluate phase model, and ModuleStatus transitions

#### Scenario: JO07a covers the Proxy trap mechanism
- **WHEN** a session targets node JO07a
- **THEN** the scaffold plans content on fundamental operations (get, set, has, deleteProperty), trap protocol, proxy invariant enforcement, and the handler object
