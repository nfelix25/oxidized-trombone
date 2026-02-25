## 1. Create jsSeed.js — JL Language Frontend (JL01–JL09)

- [x] 1.1 Create `src/curriculum/jsSeed.js` with the `createCurriculumGraph` import and a `jsCurriculum` export; add node JL01: title "Lexical analysis: char scanning, token types, DFA", track `js-language-frontend`, language `c`, depthTarget 2, prerequisites [], keywords include "lexer", "tokenizer", "DFA", "lookahead", "token"
- [x] 1.2 Add node JL02: title "Lexing strings, numbers, template literals, and regex tokens", track `js-language-frontend`, language `c`, depthTarget 2, prerequisites ["JL01"], keywords include "string literal", "template literal", "regex token", "escape sequence", "number literal"
- [x] 1.3 Add node JL03: title "Recursive descent parsing: statement grammar, top-down", track `js-language-frontend`, language `c`, depthTarget 2, prerequisites ["JL01"], keywords include "recursive descent", "parser", "grammar", "statement", "top-down"
- [x] 1.4 Add node JL04: title "Pratt parsing: top-down operator precedence", track `js-language-frontend`, language `c`, depthTarget 3, prerequisites ["JL03"], keywords include "Pratt parser", "operator precedence", "binding power", "null denotation", "left denotation"
- [x] 1.5 Add node JL05: title "AST design: node types, source positions, visitor pattern", track `js-language-frontend`, language `c`, depthTarget 2, prerequisites ["JL03"], keywords include "AST", "abstract syntax tree", "visitor pattern", "source position", "node type"
- [x] 1.6 Add node JL06: title "Scope analysis: binding, hoisting, TDZ, strict mode", track `js-language-frontend`, language `c`, depthTarget 3, prerequisites ["JL05"], keywords include "scope analysis", "binding", "hoisting", "temporal dead zone", "TDZ", "strict mode"
- [x] 1.7 Add node JL07: title "Error recovery: synchronization points and partial ASTs", track `js-language-frontend`, language `c`, depthTarget 2, prerequisites ["JL03"], keywords include "error recovery", "synchronization", "panic mode", "partial AST", "parser error"
- [x] 1.8 Add node JL08: title "Source maps: VLQ encoding and position mapping", track `js-language-frontend`, language `c`, depthTarget 2, prerequisites ["JL05"], keywords include "source map", "VLQ", "base64", "position mapping", "debugger"
- [x] 1.9 Add node JL09: title "Incremental parsing: invalidation regions and reparsing", track `js-language-frontend`, language `c`, depthTarget 3, prerequisites ["JL05"], keywords include "incremental parsing", "invalidation", "changed region", "editor performance"

## 2. JB — Bytecode track (JB01–JB06)

- [x] 2.1 Add node JB01: title "Stack-based bytecode: opcodes, operand encoding, constant pool", track `js-bytecode`, language `c`, depthTarget 2, prerequisites ["JL05"], keywords include "bytecode", "opcode", "stack machine", "constant pool", "operand"
- [x] 2.2 Add node JB02: title "Register-based bytecode: V8 Ignition register machine", track `js-bytecode`, language `c`, depthTarget 3, prerequisites ["JB01"], keywords include "register machine", "Ignition", "virtual register", "V8", "bytecode"
- [x] 2.3 Add node JB03: title "Constant folding in the bytecode emitter", track `js-bytecode`, language `c`, depthTarget 2, prerequisites ["JB01"], keywords include "constant folding", "compile-time evaluation", "optimization", "emitter"
- [x] 2.4 Add node JB04: title "Bytecode serialization: code cache and snapshot format", track `js-bytecode`, language `c`, depthTarget 2, prerequisites ["JB01"], keywords include "code cache", "serialization", "snapshot", "startup performance", "V8"
- [x] 2.5 Add node JB05: title "Bytecode disassembly: human-readable output for debugging", track `js-bytecode`, language `c`, depthTarget 2, prerequisites ["JB01"], keywords include "disassembly", "bytecode dump", "debugging", "human-readable"
- [x] 2.6 Add node JB06: title "Compilation units: script vs module vs eval scope", track `js-bytecode`, language `c`, depthTarget 2, prerequisites ["JB01", "JL06"], keywords include "compilation unit", "module scope", "eval scope", "script scope", "compilation context"

## 3. JV — Virtual Machine track (JV01–JV08)

- [x] 3.1 Add node JV01: title "Stack interpreter: value stack, call stack, dispatch loop", track `js-virtual-machine`, language `c`, depthTarget 2, prerequisites ["JB01"], keywords include "interpreter", "dispatch loop", "value stack", "call stack", "opcode"
- [x] 3.2 Add node JV02: title "Call frames: activations, return addresses, argument passing", track `js-virtual-machine`, language `c`, depthTarget 2, prerequisites ["JV01"], keywords include "call frame", "activation record", "return address", "argument passing", "spread"
- [x] 3.3 Add node JV03: title "NaN boxing: encoding all JS values in 64-bit doubles", track `js-virtual-machine`, language `c`, depthTarget 3, prerequisites ["JV01"], keywords include "NaN boxing", "value encoding", "64-bit", "V8", "JSC", "tagged value"
- [x] 3.4 Add node JV04: title "Tagged pointers: Smi encoding and heap pointer tagging", track `js-virtual-machine`, language `c`, depthTarget 3, prerequisites ["JV01"], keywords include "tagged pointer", "Smi", "small integer", "pointer tagging", "V8"
- [x] 3.5 Add node JV05: title "Exception handling: try/catch/finally and stack unwinding", track `js-virtual-machine`, language `c`, depthTarget 3, prerequisites ["JV01"], keywords include "exception", "try catch", "stack unwinding", "finally", "setjmp"
- [x] 3.6 Add node JV06: title "Generator frames: suspending and resuming mid-execution", track `js-virtual-machine`, language `c`, depthTarget 3, prerequisites ["JV02"], keywords include "generator", "yield", "suspend", "resume", "coroutine", "register file"
- [x] 3.7 Add node JV07: title "Computed-goto dispatch: fastest interpreter technique in C", track `js-virtual-machine`, language `c`, depthTarget 3, prerequisites ["JV01"], keywords include "computed goto", "direct threading", "GCC labels", "interpreter performance", "dispatch"
- [x] 3.8 Add node JV08: title "Basic inline caching: caching property offsets at call sites", track `js-virtual-machine`, language `c`, depthTarget 3, prerequisites ["JV01"], keywords include "inline cache", "IC", "property offset", "monomorphic", "polymorphic"

## 4. JO — Object Model track (JO01–JO07)

- [x] 4.1 Add node JO01: title "Hidden classes and shapes: property maps and transition trees", track `js-object-model`, language `c`, depthTarget 3, prerequisites [], keywords include "hidden class", "shape", "property map", "transition tree", "V8 Maps", "monomorphic"
- [x] 4.2 Add node JO02: title "Property storage: in-object slots vs backing store", track `js-object-model`, language `c`, depthTarget 2, prerequisites ["JO01"], keywords include "in-object property", "backing store", "property storage", "object layout"
- [x] 4.3 Add node JO03: title "Prototype chain: [[Prototype]] link and property lookup", track `js-object-model`, language `c`, depthTarget 2, prerequisites ["JO01"], keywords include "prototype chain", "[[Prototype]]", "property lookup", "inheritance", "Object.create"
- [x] 4.4 Add node JO04: title "Property descriptors: writable, enumerable, configurable", track `js-object-model`, language `c`, depthTarget 2, prerequisites ["JO01"], keywords include "property descriptor", "writable", "enumerable", "configurable", "defineProperty"
- [x] 4.5 Add node JO05: title "Array internals: dense vs sparse, elements kinds hierarchy", track `js-object-model`, language `c`, depthTarget 3, prerequisites ["JO01"], keywords include "array", "dense array", "sparse array", "holey", "elements kind", "V8"
- [x] 4.6 Add node JO06: title "Symbol: unique property keys and well-known symbols", track `js-object-model`, language `c`, depthTarget 2, prerequisites ["JO01"], keywords include "Symbol", "unique key", "Symbol.iterator", "Symbol.toPrimitive", "well-known symbol"
- [x] 4.7 Add node JO07: title "Proxy and Reflect: intercepting fundamental object operations", track `js-object-model`, language `c`, depthTarget 3, prerequisites ["JO03"], keywords include "Proxy", "Reflect", "trap", "get trap", "set trap", "fundamental operation"

## 5. JG — Garbage Collection track (JG01–JG08)

- [x] 5.1 Add node JG01: title "Heap layout: new space, old space, large object space", track `js-garbage-collection`, language `c`, depthTarget 2, prerequisites [], keywords include "heap", "new space", "nursery", "old space", "large object space", "generational GC"
- [x] 5.2 Add node JG02: title "Bump-pointer allocation in the nursery", track `js-garbage-collection`, language `c`, depthTarget 2, prerequisites ["JG01", "C303"], keywords include "bump pointer", "nursery allocation", "O(1) allocation", "semi-space"
- [x] 5.3 Add node JG03: title "Minor GC — Scavenger: semi-space copying collection", track `js-garbage-collection`, language `c`, depthTarget 3, prerequisites ["JG02"], keywords include "scavenger", "minor GC", "semi-space", "Cheney", "from-space", "to-space", "generational hypothesis"
- [x] 5.4 Add node JG04: title "Root enumeration: stack scanning and handle scopes", track `js-garbage-collection`, language `c`, depthTarget 3, prerequisites ["JG01", "C602"], keywords include "root enumeration", "stack scanning", "handle scope", "GC roots", "thread-local"
- [x] 5.5 Add node JG05: title "Mark phase: tricolor marking and work list traversal", track `js-garbage-collection`, language `c`, depthTarget 3, prerequisites ["JG04"], keywords include "tricolor marking", "mark phase", "grey set", "DFS", "incremental marking"
- [x] 5.6 Add node JG06: title "Sweep and compact: free list construction and pointer updating", track `js-garbage-collection`, language `c`, depthTarget 3, prerequisites ["JG05"], keywords include "sweep", "compact", "free list", "compaction", "pointer update", "fragmentation"
- [x] 5.7 Add node JG07: title "Write barriers: generational and incremental marking barriers", track `js-garbage-collection`, language `c`, depthTarget 3, prerequisites ["JG03", "JG05"], keywords include "write barrier", "generational barrier", "incremental barrier", "remembered set"
- [x] 5.8 Add node JG08: title "Weak references: WeakMap, WeakRef, FinalizationRegistry", track `js-garbage-collection`, language `c`, depthTarget 3, prerequisites ["JG05"], keywords include "WeakMap", "WeakRef", "FinalizationRegistry", "weak cell", "weak reference", "finalizer"

## 6. JE — Event Loop track (JE01–JE08)

- [x] 6.1 Add node JE01: title "Event loop phases: timers, poll, check, close (libuv model)", track `js-event-loop`, language `c`, depthTarget 2, prerequisites [], keywords include "event loop", "libuv", "timers phase", "poll phase", "check phase", "setTimeout", "setImmediate"
- [x] 6.2 Add node JE02: title "kqueue as I/O backend: EVFILT_READ/WRITE in the poll phase", track `js-event-loop`, language `c`, depthTarget 3, prerequisites ["JE01", "C501"], keywords include "kqueue", "EVFILT_READ", "EVFILT_WRITE", "I/O backend", "libuv", "poll phase"
- [x] 6.3 Add node JE03: title "Timer heap: binary min-heap for setTimeout/setInterval", track `js-event-loop`, language `c`, depthTarget 2, prerequisites ["JE01", "C502"], keywords include "timer heap", "min-heap", "setTimeout", "setInterval", "timer scheduling"
- [x] 6.4 Add node JE04: title "Microtask queue: ordering guarantees and starvation", track `js-event-loop`, language `c`, depthTarget 2, prerequisites ["JE01"], keywords include "microtask", "Promise", "microtask queue", "starvation", "checkpoint"
- [x] 6.5 Add node JE05: title "Thread pool integration: posting blocking work and result delivery", track `js-event-loop`, language `c`, depthTarget 3, prerequisites ["JE01", "C600"], keywords include "thread pool", "blocking I/O", "work queue", "result delivery", "libuv", "UV_THREADPOOL_SIZE"
- [x] 6.6 Add node JE06: title "Handle and request lifecycle: what keeps the event loop alive", track `js-event-loop`, language `c`, depthTarget 2, prerequisites ["JE01"], keywords include "handle", "request", "uv_ref", "uv_unref", "event loop alive", "libuv lifecycle"
- [x] 6.7 Add node JE07: title "Stream backpressure: highWaterMark, drain, cork/uncork", track `js-event-loop`, language `c`, depthTarget 2, prerequisites ["JE06"], keywords include "backpressure", "highWaterMark", "drain", "cork", "uncork", "writable stream"
- [x] 6.8 Add node JE08: title "process.nextTick: why it drains before Promise microtasks", track `js-event-loop`, language `c`, depthTarget 2, prerequisites ["JE04"], keywords include "nextTick", "process.nextTick", "microtask", "Node.js", "queue ordering"

## 7. JP — Promises and Async track (JP01–JP06)

- [x] 7.1 Add node JP01: title "Promise state machine: pending, fulfilled, rejected, reactions", track `js-promises-async`, language `c`, depthTarget 2, prerequisites ["JE04"], keywords include "Promise", "pending", "fulfilled", "rejected", "reaction record", "state machine"
- [x] 7.2 Add node JP02: title "Promise resolution procedure: [[Resolve]] and thenable assimilation", track `js-promises-async`, language `c`, depthTarget 3, prerequisites ["JP01"], keywords include "Promise resolution", "[[Resolve]]", "thenable", "assimilation", "extra microtask"
- [x] 7.3 Add node JP03: title "async/await desugaring: generator + promise machinery", track `js-promises-async`, language `c`, depthTarget 3, prerequisites ["JP01", "JV06"], keywords include "async await", "desugaring", "generator", "suspend", "async stack trace"
- [x] 7.4 Add node JP04: title "Async iterators: Symbol.asyncIterator and for-await-of", track `js-promises-async`, language `c`, depthTarget 3, prerequisites ["JP03", "JO06"], keywords include "async iterator", "Symbol.asyncIterator", "for-await-of", "async generator"
- [x] 7.5 Add node JP05: title "Unhandled rejection tracking and PromiseReactionJob timing", track `js-promises-async`, language `c`, depthTarget 2, prerequisites ["JP01", "JE04"], keywords include "unhandled rejection", "PromiseReactionJob", "unhandledRejection event", "microtask timing"
- [x] 7.6 Add node JP06: title "Promise combinators: all, allSettled, race, any", track `js-promises-async`, language `c`, depthTarget 2, prerequisites ["JP01"], keywords include "Promise.all", "Promise.allSettled", "Promise.race", "Promise.any", "combinator"

## 8. JC — Closures and Scope track (JC01–JC05)

- [x] 8.1 Add node JC01: title "Upvalues: capturing enclosing scope variables", track `js-closures-scope`, language `c`, depthTarget 2, prerequisites ["JL06"], keywords include "upvalue", "closure", "enclosing scope", "open upvalue", "closed upvalue", "Lua"
- [x] 8.2 Add node JC02: title "Closure cells: shared mutable state across closures", track `js-closures-scope`, language `c`, depthTarget 3, prerequisites ["JC01"], keywords include "closure cell", "shared state", "loop closure", "cell indirection", "mutable capture"
- [x] 8.3 Add node JC03: title "Variable hoisting: var function-scoped, let/const TDZ", track `js-closures-scope`, language `c`, depthTarget 2, prerequisites ["JL06"], keywords include "hoisting", "var", "let", "const", "TDZ", "temporal dead zone", "function scope"
- [x] 8.4 Add node JC04: title "Module scope: live bindings, namespace objects, circular deps", track `js-closures-scope`, language `c`, depthTarget 3, prerequisites ["JB06", "JC01"], keywords include "module scope", "live binding", "ESM", "namespace object", "circular dependency"
- [x] 8.5 Add node JC05: title "eval() scope: why eval breaks static analysis and JIT", track `js-closures-scope`, language `c`, depthTarget 2, prerequisites ["JC03"], keywords include "eval", "direct eval", "indirect eval", "scope analysis", "JIT barrier", "dynamic scope"

## 9. JT — JIT and Optimization track (JT01–JT07)

- [x] 9.1 Add node JT01: title "Tiered compilation: interpreter → baseline → optimizing (Ignition→Turbofan)", track `js-jit-optimization`, language `c`, depthTarget 2, prerequisites ["JV01"], keywords include "tiered compilation", "Ignition", "Maglev", "Turbofan", "tier promotion", "V8"
- [x] 9.2 Add node JT02: title "Type feedback vectors: recording observed types at IC sites", track `js-jit-optimization`, language `c`, depthTarget 3, prerequisites ["JT01", "JV08"], keywords include "type feedback", "feedback vector", "IC site", "observed type", "slot"
- [x] 9.3 Add node JT03: title "Speculative optimization: assuming types, deopt on violation", track `js-jit-optimization`, language `c`, depthTarget 3, prerequisites ["JT02"], keywords include "speculative optimization", "type assumption", "deoptimization guard", "bailout condition"
- [x] 9.4 Add node JT04: title "Deoptimization: bailout detection and return to interpreter", track `js-jit-optimization`, language `c`, depthTarget 3, prerequisites ["JT03", "JV05"], keywords include "deoptimization", "deopt", "bailout", "frame reconstruction", "OSR"
- [x] 9.5 Add node JT05: title "Escape analysis: stack-allocating non-escaping objects", track `js-jit-optimization`, language `c`, depthTarget 3, prerequisites ["JT03", "JG01"], keywords include "escape analysis", "stack allocation", "non-escaping", "object elision"
- [x] 9.6 Add node JT06: title "Inline expansion: when to inline and deopt frame reconstruction", track `js-jit-optimization`, language `c`, depthTarget 3, prerequisites ["JT04"], keywords include "inlining", "call inlining", "deopt frame", "inlining depth", "inline budget"
- [x] 9.7 Add node JT07: title "Basic code generation: emitting x86-64/ARM64 from a simple IR", track `js-jit-optimization`, language `c`, depthTarget 3, prerequisites ["JT01", "C302"], keywords include "code generation", "x86-64", "ARM64", "machine code", "IR", "JIT", "mprotect"

## 10. JR — Runtime Internals track (JR01–JR06)

- [x] 10.1 Add node JR01: title "String internals: interning, one-byte vs two-byte, slices", track `js-runtime-internals`, language `c`, depthTarget 2, prerequisites [], keywords include "string interning", "one-byte string", "two-byte string", "string slice", "cons string", "rope"
- [x] 10.2 Add node JR02: title "Regex engine: NFA construction and Irregexp approach", track `js-runtime-internals`, language `c`, depthTarget 3, prerequisites ["JL01"], keywords include "regex", "NFA", "backtracking", "Irregexp", "regex engine", "V8"
- [x] 10.3 Add node JR03: title "Module system: ESM records, dynamic import(), import.meta", track `js-runtime-internals`, language `c`, depthTarget 3, prerequisites ["JB06", "JC04"], keywords include "ESM", "module record", "dynamic import", "import.meta", "module loader", "link phase"
- [x] 10.4 Add node JR04: title "Native addons: N-API, napi_value, calling C from JS", track `js-runtime-internals`, language `c`, depthTarget 3, prerequisites ["C703"], keywords include "N-API", "native addon", "napi_value", "napi_env", "napi_create_function", "FFI"
- [x] 10.5 Add node JR05: title "Inspector protocol: CDP, breakpoints, profiler, SIGUSR2", track `js-runtime-internals`, language `c`, depthTarget 3, prerequisites ["JV05"], keywords include "inspector", "CDP", "Chrome DevTools Protocol", "breakpoint", "profiler", "SIGUSR2"
- [x] 10.6 Add node JR06: title "Structured clone: postMessage serialization and transferables", track `js-runtime-internals`, language `c`, depthTarget 2, prerequisites [], keywords include "structured clone", "postMessage", "transferable", "ArrayBuffer", "SharedArrayBuffer", "serialization"

## 11. Wire into allCurricula.js

- [x] 11.1 In `src/curriculum/allCurricula.js`, import `jsCurriculum` from `./jsSeed.js` and spread its nodes and tracks into the unified graph, following the same pattern as zigCurriculum, pythonCurriculum, and cppCurriculum

## 12. Verification

- [x] 12.1 Run `npm test` — confirm all existing tests still pass (no regressions from the new allCurricula spread)
- [x] 12.2 Create `tests/js-runtime-curriculum.test.js` with tests verifying: the 10 tracks are present, all nodes have `language: "c"`, all 7 cross-track prerequisite links resolve (JE02→C501, JE03→C502, JE05→C600, JG02→C303, JG04→C602, JT07→C302, JR04→C703), total node count is 70, and no dangling prerequisite IDs
- [x] 12.3 Run `npm test` — confirm new tests pass
