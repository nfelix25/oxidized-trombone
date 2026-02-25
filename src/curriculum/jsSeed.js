import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// JL: Language Frontend (Lexer / Parser)
// ---------------------------------------------------------------------------
const jsLanguageFrontendNodes = [
  createNode({
    id: "JL01",
    title: "Lexical analysis: char scanning, token types, DFA",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.lexer_regex_confusion", "js.token_vs_lexeme_confusion"],
    keywords: ["lexer", "tokenizer", "DFA", "lookahead", "token", "scanner", "character class"],
    language: "c"
  }),
  createNode({
    id: "JL02",
    title: "Lexing strings, numbers, template literals, and regex tokens",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL01"],
    misconceptionTags: ["js.template_literal_lex_confusion", "js.regex_token_ambiguity"],
    keywords: ["string literal", "template literal", "regex token", "escape sequence", "number literal", "numeric separator"],
    language: "c"
  }),
  createNode({
    id: "JL03",
    title: "Recursive descent parsing: statement grammar, top-down",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL01"],
    misconceptionTags: ["js.left_recursion_confusion", "js.parse_lookahead_confusion"],
    keywords: ["recursive descent", "parser", "grammar", "statement", "top-down", "production rule", "LL(1)"],
    language: "c"
  }),
  createNode({
    id: "JL04",
    title: "Pratt parsing: top-down operator precedence",
    track: "js-language-frontend",
    depthTarget: "D3",
    prerequisites: ["JL03"],
    misconceptionTags: ["js.pratt_nud_led_confusion", "js.binding_power_confusion"],
    keywords: ["Pratt parser", "operator precedence", "binding power", "null denotation", "left denotation", "TDOP", "V8 parser"],
    language: "c"
  }),
  createNode({
    id: "JL05",
    title: "AST design: node types, source positions, visitor pattern",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL03"],
    misconceptionTags: ["js.ast_vs_cst_confusion", "js.visitor_double_dispatch_confusion"],
    keywords: ["AST", "abstract syntax tree", "visitor pattern", "source position", "node type", "tree walk", "tagged union"],
    language: "c"
  }),
  createNode({
    id: "JL06a",
    title: "Scope analysis: binding and scope chain",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL05"],
    misconceptionTags: ["js.scope_chain_confusion"],
    keywords: ["scope analysis", "binding", "scope chain", "lexical scope", "identifier resolution", "name lookup"],
    language: "c"
  }),
  createNode({
    id: "JL06b",
    title: "Scope analysis: var hoisting and function hoisting",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL06a"],
    misconceptionTags: ["js.hoisting_confusion"],
    keywords: ["hoisting", "var hoisting", "function hoisting", "declaration hoisting", "scope analysis", "initializer"],
    language: "c"
  }),
  createNode({
    id: "JL06c",
    title: "Scope analysis: TDZ and strict mode",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL06b"],
    misconceptionTags: ["js.tdz_confusion"],
    keywords: ["temporal dead zone", "TDZ", "let", "const", "strict mode", "use strict", "block scope", "TDZ error"],
    language: "c"
  }),
  createNode({
    id: "JL07",
    title: "Error recovery: synchronization points and partial ASTs",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL03"],
    misconceptionTags: ["js.parse_error_cascade_confusion", "js.recovery_point_confusion"],
    keywords: ["error recovery", "synchronization", "panic mode", "partial AST", "parser error", "error production"],
    language: "c"
  }),
  createNode({
    id: "JL08",
    title: "Source maps: VLQ encoding and position mapping",
    track: "js-language-frontend",
    depthTarget: "D2",
    prerequisites: ["JL05"],
    misconceptionTags: ["js.vlq_sign_confusion", "js.sourcemap_column_confusion"],
    keywords: ["source map", "VLQ", "base64", "position mapping", "debugger", "variable-length quantity", "sourceMappingURL"],
    language: "c"
  }),
  createNode({
    id: "JL09",
    title: "Incremental parsing: invalidation regions and reparsing",
    track: "js-language-frontend",
    depthTarget: "D3",
    prerequisites: ["JL05"],
    misconceptionTags: ["js.incremental_parse_scope_confusion", "js.tree_sitter_reuse_confusion"],
    keywords: ["incremental parsing", "invalidation", "changed region", "editor performance", "tree reuse", "syntax tree diff"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JB: Bytecode
// ---------------------------------------------------------------------------
const jsBytecodeNodes = [
  createNode({
    id: "JB01",
    title: "Stack-based bytecode: opcodes, operand encoding, constant pool",
    track: "js-bytecode",
    depthTarget: "D2",
    prerequisites: ["JL05"],
    misconceptionTags: ["js.bytecode_vs_machine_code_confusion", "js.constant_pool_confusion"],
    keywords: ["bytecode", "opcode", "stack machine", "constant pool", "operand", "instruction encoding", "bytecode format"],
    language: "c"
  }),
  createNode({
    id: "JB02",
    title: "Register-based bytecode: V8 Ignition register machine",
    track: "js-bytecode",
    depthTarget: "D3",
    prerequisites: ["JB01"],
    misconceptionTags: ["js.virtual_register_confusion", "js.register_vs_stack_tradeoff_confusion"],
    keywords: ["register machine", "Ignition", "virtual register", "V8", "bytecode", "register file", "accumulator"],
    language: "c"
  }),
  createNode({
    id: "JB03",
    title: "Constant folding in the bytecode emitter",
    track: "js-bytecode",
    depthTarget: "D2",
    prerequisites: ["JB01"],
    misconceptionTags: ["js.fold_side_effect_confusion", "js.fold_float_confusion"],
    keywords: ["constant folding", "compile-time evaluation", "optimization", "emitter", "dead code", "literal folding"],
    language: "c"
  }),
  createNode({
    id: "JB04",
    title: "Bytecode serialization: code cache and snapshot format",
    track: "js-bytecode",
    depthTarget: "D2",
    prerequisites: ["JB01"],
    misconceptionTags: ["js.code_cache_invalidation_confusion", "js.snapshot_vs_cache_confusion"],
    keywords: ["code cache", "serialization", "snapshot", "startup performance", "V8", "deserialization", "bytecode cache"],
    language: "c"
  }),
  createNode({
    id: "JB05",
    title: "Bytecode disassembly: human-readable output for debugging",
    track: "js-bytecode",
    depthTarget: "D2",
    prerequisites: ["JB01"],
    misconceptionTags: ["js.disasm_opcode_confusion", "js.register_annotation_confusion"],
    keywords: ["disassembly", "bytecode dump", "debugging", "human-readable", "disassembler", "--print-bytecode"],
    language: "c"
  }),
  createNode({
    id: "JB06",
    title: "Compilation units: script vs module vs eval scope",
    track: "js-bytecode",
    depthTarget: "D2",
    prerequisites: ["JB01", "JL06c"],
    misconceptionTags: ["js.module_scope_hoisting_confusion", "js.eval_scope_confusion"],
    keywords: ["compilation unit", "module scope", "eval scope", "script scope", "compilation context", "strict mode", "top-level await"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JV: Virtual Machine
// ---------------------------------------------------------------------------
const jsVirtualMachineNodes = [
  createNode({
    id: "JV01",
    title: "Stack interpreter: value stack, call stack, dispatch loop",
    track: "js-virtual-machine",
    depthTarget: "D2",
    prerequisites: ["JB01"],
    misconceptionTags: ["js.value_stack_overflow_confusion", "js.dispatch_loop_performance_confusion"],
    keywords: ["interpreter", "dispatch loop", "value stack", "call stack", "opcode", "switch dispatch", "bytecode interpreter"],
    language: "c"
  }),
  createNode({
    id: "JV02",
    title: "Call frames: activations, return addresses, argument passing",
    track: "js-virtual-machine",
    depthTarget: "D2",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.frame_pointer_confusion", "js.arguments_object_confusion"],
    keywords: ["call frame", "activation record", "return address", "argument passing", "spread", "rest", "frame layout"],
    language: "c"
  }),
  createNode({
    id: "JV03",
    title: "NaN boxing: encoding all JS values in 64-bit doubles",
    track: "js-virtual-machine",
    depthTarget: "D3",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.nan_payload_confusion", "js.quiet_vs_signaling_nan_confusion"],
    keywords: ["NaN boxing", "value encoding", "64-bit", "V8", "JSC", "tagged value", "IEEE 754", "quiet NaN"],
    language: "c"
  }),
  createNode({
    id: "JV04",
    title: "Tagged pointers: Smi encoding and heap pointer tagging",
    track: "js-virtual-machine",
    depthTarget: "D3",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.smi_range_confusion", "js.pointer_alignment_tag_confusion"],
    keywords: ["tagged pointer", "Smi", "small integer", "pointer tagging", "V8", "low bit tag", "heap object pointer"],
    language: "c"
  }),
  createNode({
    id: "JV05",
    title: "Exception handling: try/catch/finally and stack unwinding",
    track: "js-virtual-machine",
    depthTarget: "D3",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.finally_return_confusion", "js.stack_unwind_order_confusion"],
    keywords: ["exception", "try catch", "stack unwinding", "finally", "setjmp", "longjmp", "exception table", "throw"],
    language: "c"
  }),
  createNode({
    id: "JV06",
    title: "Generator frames: suspending and resuming mid-execution",
    track: "js-virtual-machine",
    depthTarget: "D3",
    prerequisites: ["JV02"],
    misconceptionTags: ["js.generator_return_confusion", "js.generator_throw_confusion"],
    keywords: ["generator", "yield", "suspend", "resume", "coroutine", "register file", "GeneratorObject", "generator frame"],
    language: "c"
  }),
  createNode({
    id: "JV07",
    title: "Computed-goto dispatch: fastest interpreter technique in C",
    track: "js-virtual-machine",
    depthTarget: "D3",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.computed_goto_portability_confusion", "js.direct_threading_vs_switch_confusion"],
    keywords: ["computed goto", "direct threading", "GCC labels", "interpreter performance", "dispatch", "label-as-value", "indirect branch"],
    language: "c"
  }),
  createNode({
    id: "JV08",
    title: "Basic inline caching: caching property offsets at call sites",
    track: "js-virtual-machine",
    depthTarget: "D3",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.ic_miss_vs_deopt_confusion", "js.monomorphic_vs_polymorphic_confusion"],
    keywords: ["inline cache", "IC", "property offset", "monomorphic", "polymorphic", "megamorphic", "IC site", "hidden class"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JO: Object Model
// ---------------------------------------------------------------------------
const jsObjectModelNodes = [
  createNode({
    id: "JO01",
    title: "Hidden classes and shapes: property maps and transition trees",
    track: "js-object-model",
    depthTarget: "D3",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.hidden_class_per_instance_confusion", "js.transition_tree_branch_confusion"],
    keywords: ["hidden class", "shape", "property map", "transition tree", "V8 Maps", "monomorphic", "object layout", "Map transition"],
    language: "c"
  }),
  createNode({
    id: "JO02",
    title: "Property storage: in-object slots vs backing store",
    track: "js-object-model",
    depthTarget: "D2",
    prerequisites: ["JO01"],
    misconceptionTags: ["js.inobject_slack_confusion", "js.backing_store_growth_confusion"],
    keywords: ["in-object property", "backing store", "property storage", "object layout", "out-of-object", "slack tracking"],
    language: "c"
  }),
  createNode({
    id: "JO03",
    title: "Prototype chain: [[Prototype]] link and property lookup",
    track: "js-object-model",
    depthTarget: "D2",
    prerequisites: ["JO01"],
    misconceptionTags: ["js.proto_vs_prototype_confusion", "js.prototype_chain_mutation_confusion"],
    keywords: ["prototype chain", "[[Prototype]]", "property lookup", "inheritance", "Object.create", "Object.getPrototypeOf", "__proto__"],
    language: "c"
  }),
  createNode({
    id: "JO04",
    title: "Property descriptors: writable, enumerable, configurable",
    track: "js-object-model",
    depthTarget: "D2",
    prerequisites: ["JO01"],
    misconceptionTags: ["js.configurable_delete_confusion", "js.enumerable_forin_confusion"],
    keywords: ["property descriptor", "writable", "enumerable", "configurable", "defineProperty", "getOwnPropertyDescriptor", "accessor property"],
    language: "c"
  }),
  createNode({
    id: "JO05",
    title: "Array internals: dense vs sparse, elements kinds hierarchy",
    track: "js-object-model",
    depthTarget: "D3",
    prerequisites: ["JO01"],
    misconceptionTags: ["js.array_hole_confusion", "js.elements_kind_demotion_confusion"],
    keywords: ["array", "dense array", "sparse array", "holey", "elements kind", "V8", "PACKED_SMI_ELEMENTS", "HOLEY_ELEMENTS"],
    language: "c"
  }),
  createNode({
    id: "JO06",
    title: "Symbol: unique property keys and well-known symbols",
    track: "js-object-model",
    depthTarget: "D2",
    prerequisites: ["JO01"],
    misconceptionTags: ["js.symbol_global_registry_confusion", "js.well_known_symbol_override_confusion"],
    keywords: ["Symbol", "unique key", "Symbol.iterator", "Symbol.toPrimitive", "Symbol.hasInstance", "well-known symbol", "symbol registry"],
    language: "c"
  }),
  createNode({
    id: "JO07a",
    title: "Proxy: trap mechanism and handler protocol",
    track: "js-object-model",
    depthTarget: "D3",
    prerequisites: ["JO03"],
    misconceptionTags: ["js.proxy_invariant_confusion"],
    keywords: ["Proxy", "trap", "get trap", "set trap", "has trap", "deleteProperty", "proxy handler", "target", "proxy invariants"],
    language: "c"
  }),
  createNode({
    id: "JO07b",
    title: "Reflect: the meta-object protocol API",
    track: "js-object-model",
    depthTarget: "D2",
    prerequisites: ["JO07a"],
    misconceptionTags: ["js.reflect_vs_object_confusion"],
    keywords: ["Reflect", "Reflect.get", "Reflect.set", "Reflect.apply", "meta-object protocol", "fundamental operation", "Reflect vs Object"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JG: Garbage Collection
// ---------------------------------------------------------------------------
const jsGarbageCollectionNodes = [
  createNode({
    id: "JG01",
    title: "Heap layout: new space, old space, large object space",
    track: "js-garbage-collection",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.heap_vs_stack_confusion", "js.large_object_threshold_confusion"],
    keywords: ["heap", "new space", "nursery", "old space", "large object space", "generational GC", "heap layout", "semi-space"],
    language: "c"
  }),
  createNode({
    id: "JG02",
    title: "Bump-pointer allocation in the nursery",
    track: "js-garbage-collection",
    depthTarget: "D2",
    prerequisites: ["JG01", "C303"],
    misconceptionTags: ["js.bump_ptr_alignment_confusion", "js.nursery_exhaustion_confusion"],
    keywords: ["bump pointer", "nursery allocation", "O(1) allocation", "semi-space", "allocation pointer", "limit pointer"],
    language: "c"
  }),
  createNode({
    id: "JG03",
    title: "Minor GC — Scavenger: semi-space copying collection",
    track: "js-garbage-collection",
    depthTarget: "D3",
    prerequisites: ["JG02"],
    misconceptionTags: ["js.scavenger_promotion_confusion", "js.forwarding_pointer_confusion"],
    keywords: ["scavenger", "minor GC", "semi-space", "Cheney", "from-space", "to-space", "generational hypothesis", "forwarding pointer"],
    language: "c"
  }),
  createNode({
    id: "JG04",
    title: "Root enumeration: stack scanning and handle scopes",
    track: "js-garbage-collection",
    depthTarget: "D3",
    prerequisites: ["JG01", "C602"],
    misconceptionTags: ["js.conservative_vs_precise_gc_confusion", "js.handle_scope_lifetime_confusion"],
    keywords: ["root enumeration", "stack scanning", "handle scope", "GC roots", "thread-local", "precise GC", "root set"],
    language: "c"
  }),
  createNode({
    id: "JG05",
    title: "Mark phase: tricolor marking and work list traversal",
    track: "js-garbage-collection",
    depthTarget: "D3",
    prerequisites: ["JG04"],
    misconceptionTags: ["js.tricolor_invariant_confusion", "js.mark_stack_overflow_confusion"],
    keywords: ["tricolor marking", "mark phase", "grey set", "DFS", "incremental marking", "white", "grey", "black", "work list"],
    language: "c"
  }),
  createNode({
    id: "JG06",
    title: "Sweep and compact: free list construction and pointer updating",
    track: "js-garbage-collection",
    depthTarget: "D3",
    prerequisites: ["JG05"],
    misconceptionTags: ["js.sweep_vs_compact_tradeoff_confusion", "js.forwarding_ptr_update_confusion"],
    keywords: ["sweep", "compact", "free list", "compaction", "pointer update", "fragmentation", "live bitmap", "marking bitmap"],
    language: "c"
  }),
  createNode({
    id: "JG07",
    title: "Write barriers: generational and incremental marking barriers",
    track: "js-garbage-collection",
    depthTarget: "D3",
    prerequisites: ["JG03", "JG05"],
    misconceptionTags: ["js.write_barrier_cost_confusion", "js.remembered_set_vs_card_table_confusion"],
    keywords: ["write barrier", "generational barrier", "incremental barrier", "remembered set", "card table", "old-to-new pointer"],
    language: "c"
  }),
  createNode({
    id: "JG08",
    title: "Weak references: WeakMap, WeakRef, FinalizationRegistry",
    track: "js-garbage-collection",
    depthTarget: "D3",
    prerequisites: ["JG05"],
    misconceptionTags: ["js.weakmap_key_gc_confusion", "js.finalizer_timing_confusion"],
    keywords: ["WeakMap", "WeakRef", "FinalizationRegistry", "weak cell", "weak reference", "finalizer", "ephemeron"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JE: Event Loop
// ---------------------------------------------------------------------------
const jsEventLoopNodes = [
  createNode({
    id: "JE01",
    title: "Event loop phases: timers, poll, check, close (libuv model)",
    track: "js-event-loop",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.settimeout_vs_setimmediate_confusion", "js.event_loop_blocking_confusion"],
    keywords: ["event loop", "libuv", "timers phase", "poll phase", "check phase", "setTimeout", "setImmediate", "close callbacks"],
    language: "c"
  }),
  createNode({
    id: "JE02",
    title: "kqueue as I/O backend: EVFILT_READ/WRITE in the poll phase",
    track: "js-event-loop",
    depthTarget: "D3",
    prerequisites: ["JE01", "C501"],
    misconceptionTags: ["js.kqueue_libuv_phase_confusion", "js.io_backend_abstraction_confusion"],
    keywords: ["kqueue", "EVFILT_READ", "EVFILT_WRITE", "I/O backend", "libuv", "poll phase", "macOS event loop"],
    language: "c"
  }),
  createNode({
    id: "JE03",
    title: "Timer heap: binary min-heap for setTimeout/setInterval",
    track: "js-event-loop",
    depthTarget: "D2",
    prerequisites: ["JE01", "C502"],
    misconceptionTags: ["js.timer_precision_confusion", "js.setinterval_drift_confusion"],
    keywords: ["timer heap", "min-heap", "setTimeout", "setInterval", "timer scheduling", "heap property", "timer expiry"],
    language: "c"
  }),
  createNode({
    id: "JE04",
    title: "Microtask queue: ordering guarantees and starvation",
    track: "js-event-loop",
    depthTarget: "D2",
    prerequisites: ["JE01"],
    misconceptionTags: ["js.microtask_vs_macrotask_confusion", "js.microtask_starvation_confusion"],
    keywords: ["microtask", "Promise", "microtask queue", "starvation", "checkpoint", "job queue", "PromiseReactionJob"],
    language: "c"
  }),
  createNode({
    id: "JE05",
    title: "Thread pool integration: posting blocking work and result delivery",
    track: "js-event-loop",
    depthTarget: "D3",
    prerequisites: ["JE01", "C600"],
    misconceptionTags: ["js.threadpool_size_confusion", "js.blocking_op_event_loop_confusion"],
    keywords: ["thread pool", "blocking I/O", "work queue", "result delivery", "libuv", "UV_THREADPOOL_SIZE", "uv_queue_work"],
    language: "c"
  }),
  createNode({
    id: "JE06",
    title: "Handle and request lifecycle: what keeps the event loop alive",
    track: "js-event-loop",
    depthTarget: "D2",
    prerequisites: ["JE01"],
    misconceptionTags: ["js.unref_timer_confusion", "js.handle_vs_request_confusion"],
    keywords: ["handle", "request", "uv_ref", "uv_unref", "event loop alive", "libuv lifecycle", "active handles"],
    language: "c"
  }),
  createNode({
    id: "JE07",
    title: "Stream backpressure: highWaterMark, drain, cork/uncork",
    track: "js-event-loop",
    depthTarget: "D2",
    prerequisites: ["JE06"],
    misconceptionTags: ["js.backpressure_ignore_confusion", "js.drain_timing_confusion"],
    keywords: ["backpressure", "highWaterMark", "drain", "cork", "uncork", "writable stream", "pipe", "stream buffering"],
    language: "c"
  }),
  createNode({
    id: "JE08",
    title: "process.nextTick: why it drains before Promise microtasks",
    track: "js-event-loop",
    depthTarget: "D2",
    prerequisites: ["JE04"],
    misconceptionTags: ["js.nexttick_vs_promise_order_confusion", "js.nexttick_starvation_confusion"],
    keywords: ["nextTick", "process.nextTick", "microtask", "Node.js", "queue ordering", "nextTickQueue", "microtask checkpoint"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JP: Promises and Async
// ---------------------------------------------------------------------------
const jsPromisesAsyncNodes = [
  createNode({
    id: "JP01",
    title: "Promise state machine: pending, fulfilled, rejected, reactions",
    track: "js-promises-async",
    depthTarget: "D2",
    prerequisites: ["JE04"],
    misconceptionTags: ["js.promise_sync_resolution_confusion", "js.then_chaining_confusion"],
    keywords: ["Promise", "pending", "fulfilled", "rejected", "reaction record", "state machine", "resolve", "reject"],
    language: "c"
  }),
  createNode({
    id: "JP02",
    title: "Promise resolution procedure: [[Resolve]] and thenable assimilation",
    track: "js-promises-async",
    depthTarget: "D3",
    prerequisites: ["JP01"],
    misconceptionTags: ["js.thenable_extra_microtask_confusion", "js.resolve_vs_fulfill_confusion"],
    keywords: ["Promise resolution", "[[Resolve]]", "thenable", "assimilation", "extra microtask", "PromiseResolveThenableJob"],
    language: "c"
  }),
  createNode({
    id: "JP03a",
    title: "Generator coroutine mechanics: suspend, resume, and the iterator protocol",
    track: "js-promises-async",
    depthTarget: "D3",
    prerequisites: ["JV06"],
    misconceptionTags: ["js.generator_return_confusion", "js.generator_throw_confusion"],
    keywords: ["generator", "function*", "yield", "suspend", "resume", "iterator protocol", "GeneratorObject", "generator state machine"],
    language: "c"
  }),
  createNode({
    id: "JP03b",
    title: "async/await desugaring: generator + promise machinery",
    track: "js-promises-async",
    depthTarget: "D3",
    prerequisites: ["JP01", "JP03a"],
    misconceptionTags: ["js.async_stack_trace_confusion", "js.await_microtask_count_confusion"],
    keywords: ["async await", "desugaring", "async stack trace", "AsyncFunction", "PromiseReactionJob", "await unwrapping"],
    language: "c"
  }),
  createNode({
    id: "JP04",
    title: "Async iterators: Symbol.asyncIterator and for-await-of",
    track: "js-promises-async",
    depthTarget: "D3",
    prerequisites: ["JP03b", "JO06"],
    misconceptionTags: ["js.async_gen_return_confusion", "js.for_await_cancel_confusion"],
    keywords: ["async iterator", "Symbol.asyncIterator", "for-await-of", "async generator", "AsyncIterator protocol"],
    language: "c"
  }),
  createNode({
    id: "JP05",
    title: "Unhandled rejection tracking and PromiseReactionJob timing",
    track: "js-promises-async",
    depthTarget: "D2",
    prerequisites: ["JP01", "JE04"],
    misconceptionTags: ["js.unhandled_rejection_timing_confusion", "js.rejection_tracking_turn_confusion"],
    keywords: ["unhandled rejection", "PromiseReactionJob", "unhandledRejection event", "microtask timing", "rejection tracking"],
    language: "c"
  }),
  createNode({
    id: "JP06",
    title: "Promise combinators: all, allSettled, race, any",
    track: "js-promises-async",
    depthTarget: "D2",
    prerequisites: ["JP01"],
    misconceptionTags: ["js.promise_all_short_circuit_confusion", "js.promise_any_agg_error_confusion"],
    keywords: ["Promise.all", "Promise.allSettled", "Promise.race", "Promise.any", "combinator", "AggregateError"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JC: Closures and Scope
// ---------------------------------------------------------------------------
const jsClosuresScopeNodes = [
  createNode({
    id: "JC01",
    title: "Upvalues: capturing enclosing scope variables",
    track: "js-closures-scope",
    depthTarget: "D2",
    prerequisites: ["JL06c"],
    misconceptionTags: ["js.closure_copy_vs_reference_confusion", "js.open_closed_upvalue_confusion"],
    keywords: ["upvalue", "closure", "enclosing scope", "open upvalue", "closed upvalue", "Lua", "captured variable"],
    language: "c"
  }),
  createNode({
    id: "JC02",
    title: "Closure cells: shared mutable state across closures",
    track: "js-closures-scope",
    depthTarget: "D3",
    prerequisites: ["JC01"],
    misconceptionTags: ["js.loop_closure_confusion", "js.shared_cell_confusion"],
    keywords: ["closure cell", "shared state", "loop closure", "cell indirection", "mutable capture", "let in loop"],
    language: "c"
  }),
  createNode({
    id: "JC03",
    title: "Variable hoisting: var function-scoped, let/const TDZ",
    track: "js-closures-scope",
    depthTarget: "D2",
    prerequisites: ["JL06c"],
    misconceptionTags: ["js.hoisting_initialization_confusion", "js.tdz_typeof_confusion"],
    keywords: ["hoisting", "var", "let", "const", "TDZ", "temporal dead zone", "function scope", "block scope"],
    language: "c"
  }),
  createNode({
    id: "JC04a",
    title: "Module scope: live bindings in ESM",
    track: "js-closures-scope",
    depthTarget: "D2",
    prerequisites: ["JB06", "JC01"],
    misconceptionTags: ["js.live_binding_vs_copy_confusion"],
    keywords: ["module scope", "live binding", "ESM", "import binding", "export binding", "binding update", "named export"],
    language: "c"
  }),
  createNode({
    id: "JC04b",
    title: "Module namespace objects and the namespace exotic object",
    track: "js-closures-scope",
    depthTarget: "D2",
    prerequisites: ["JC04a"],
    misconceptionTags: ["js.namespace_object_proxy_confusion"],
    keywords: ["namespace object", "module namespace", "namespace exotic", "import * as", "[[Module]]", "namespace iteration"],
    language: "c"
  }),
  createNode({
    id: "JC04c",
    title: "Circular module dependencies and evaluation order",
    track: "js-closures-scope",
    depthTarget: "D3",
    prerequisites: ["JC04b"],
    misconceptionTags: ["js.circular_import_confusion"],
    keywords: ["circular dependency", "circular import", "evaluation order", "TDZ in modules", "module graph", "link phase", "dead binding"],
    language: "c"
  }),
  createNode({
    id: "JC05",
    title: "eval() scope: why eval breaks static analysis and JIT",
    track: "js-closures-scope",
    depthTarget: "D2",
    prerequisites: ["JC03"],
    misconceptionTags: ["js.direct_vs_indirect_eval_confusion", "js.eval_strict_mode_confusion"],
    keywords: ["eval", "direct eval", "indirect eval", "scope analysis", "JIT barrier", "dynamic scope", "strict mode eval"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JT: JIT and Optimization
// ---------------------------------------------------------------------------
const jsJitOptimizationNodes = [
  createNode({
    id: "JT01",
    title: "Tiered compilation: interpreter → baseline → optimizing (Ignition→Turbofan)",
    track: "js-jit-optimization",
    depthTarget: "D2",
    prerequisites: ["JV01"],
    misconceptionTags: ["js.tier_promotion_threshold_confusion", "js.jit_always_faster_confusion"],
    keywords: ["tiered compilation", "Ignition", "Maglev", "Turbofan", "tier promotion", "V8", "OSR", "hot function"],
    language: "c"
  }),
  createNode({
    id: "JT02",
    title: "Type feedback vectors: recording observed types at IC sites",
    track: "js-jit-optimization",
    depthTarget: "D3",
    prerequisites: ["JT01", "JV08"],
    misconceptionTags: ["js.feedback_vector_slot_confusion", "js.type_feedback_stale_confusion"],
    keywords: ["type feedback", "feedback vector", "IC site", "observed type", "slot", "FeedbackNexus", "speculation"],
    language: "c"
  }),
  createNode({
    id: "JT03",
    title: "Speculative optimization: assuming types, deopt on violation",
    track: "js-jit-optimization",
    depthTarget: "D3",
    prerequisites: ["JT02"],
    misconceptionTags: ["js.speculation_bailout_confusion", "js.guard_overhead_confusion"],
    keywords: ["speculative optimization", "type assumption", "deoptimization guard", "bailout condition", "checkmap", "speculate"],
    language: "c"
  }),
  createNode({
    id: "JT04",
    title: "Deoptimization: bailout detection and return to interpreter",
    track: "js-jit-optimization",
    depthTarget: "D3",
    prerequisites: ["JT03", "JV05"],
    misconceptionTags: ["js.deopt_frame_reconstruction_confusion", "js.osr_deopt_confusion"],
    keywords: ["deoptimization", "deopt", "bailout", "frame reconstruction", "OSR", "lazy deopt", "eager deopt"],
    language: "c"
  }),
  createNode({
    id: "JT05",
    title: "Escape analysis: stack-allocating non-escaping objects",
    track: "js-jit-optimization",
    depthTarget: "D3",
    prerequisites: ["JT03", "JG01"],
    misconceptionTags: ["js.escape_through_closure_confusion", "js.stack_alloc_gc_interaction_confusion"],
    keywords: ["escape analysis", "stack allocation", "non-escaping", "object elision", "scalar replacement", "heap allocation elision"],
    language: "c"
  }),
  createNode({
    id: "JT06",
    title: "Inline expansion: when to inline and deopt frame reconstruction",
    track: "js-jit-optimization",
    depthTarget: "D3",
    prerequisites: ["JT04"],
    misconceptionTags: ["js.inlining_depth_confusion", "js.inline_deopt_frame_confusion"],
    keywords: ["inlining", "call inlining", "deopt frame", "inlining depth", "inline budget", "call site", "callee size"],
    language: "c"
  }),
  createNode({
    id: "JT07",
    title: "Basic code generation: emitting x86-64/ARM64 from a simple IR",
    track: "js-jit-optimization",
    depthTarget: "D3",
    prerequisites: ["JT01", "C302"],
    misconceptionTags: ["js.ir_vs_bytecode_confusion", "js.register_allocation_confusion"],
    keywords: ["code generation", "x86-64", "ARM64", "machine code", "IR", "JIT", "mprotect", "instruction emission"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// JR: Runtime Internals
// ---------------------------------------------------------------------------
const jsRuntimeInternalsNodes = [
  createNode({
    id: "JR01a",
    title: "String interning: the symbol table and identity equality",
    track: "js-runtime-internals",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.intern_vs_literal_confusion"],
    keywords: ["string interning", "symbol table", "string identity", "V8 strings", "intern pool", "heap string", "short string optimization"],
    language: "c"
  }),
  createNode({
    id: "JR01b",
    title: "String encoding: one-byte vs two-byte representation",
    track: "js-runtime-internals",
    depthTarget: "D2",
    prerequisites: ["JR01a"],
    misconceptionTags: ["js.string_immutable_copy_confusion"],
    keywords: ["one-byte string", "two-byte string", "Latin-1", "UTF-16", "string encoding", "SeqOneByteString", "SeqTwoByteString", "memory layout"],
    language: "c"
  }),
  createNode({
    id: "JR01c",
    title: "String slices and cons strings: lazy concatenation",
    track: "js-runtime-internals",
    depthTarget: "D2",
    prerequisites: ["JR01b"],
    misconceptionTags: ["js.string_concat_copy_confusion"],
    keywords: ["string slice", "SlicedString", "cons string", "ConsString", "rope", "flat string", "string flattening", "lazy concat"],
    language: "c"
  }),
  createNode({
    id: "JR02",
    title: "Regex engine: NFA construction and Irregexp approach",
    track: "js-runtime-internals",
    depthTarget: "D3",
    prerequisites: ["JL01"],
    misconceptionTags: ["js.regex_backtracking_catastrophe_confusion", "js.nfa_vs_dfa_confusion"],
    keywords: ["regex", "NFA", "backtracking", "Irregexp", "regex engine", "V8", "compiled regex", "catastrophic backtracking"],
    language: "c"
  }),
  createNode({
    id: "JR03a",
    title: "Module records: the module graph, link phase, and evaluate phase",
    track: "js-runtime-internals",
    depthTarget: "D3",
    prerequisites: ["JB06", "JC04c"],
    misconceptionTags: ["js.module_record_confusion"],
    keywords: ["ESM", "module record", "module graph", "link phase", "evaluate phase", "cyclic module record", "ModuleStatus"],
    language: "c"
  }),
  createNode({
    id: "JR03b",
    title: "Dynamic import(): lazy loading and the import() promise",
    track: "js-runtime-internals",
    depthTarget: "D2",
    prerequisites: ["JR03a"],
    misconceptionTags: ["js.dynamic_import_sync_confusion"],
    keywords: ["dynamic import", "import()", "lazy loading", "code splitting", "import promise", "async module loading"],
    language: "c"
  }),
  createNode({
    id: "JR03c",
    title: "import.meta: module URL, dirname, and host-defined metadata",
    track: "js-runtime-internals",
    depthTarget: "D2",
    prerequisites: ["JR03b"],
    misconceptionTags: ["js.import_meta_confusion"],
    keywords: ["import.meta", "import.meta.url", "import.meta.dirname", "host-defined", "module metadata", "Node.js module"],
    language: "c"
  }),
  createNode({
    id: "JR04",
    title: "Native addons: N-API, napi_value, calling C from JS",
    track: "js-runtime-internals",
    depthTarget: "D3",
    prerequisites: ["C703"],
    misconceptionTags: ["js.napi_handle_scope_confusion", "js.napi_gc_interaction_confusion"],
    keywords: ["N-API", "native addon", "napi_value", "napi_env", "napi_create_function", "FFI", "napi_module", "node-gyp"],
    language: "c"
  }),
  createNode({
    id: "JR05",
    title: "Inspector protocol: CDP, breakpoints, profiler, SIGUSR2",
    track: "js-runtime-internals",
    depthTarget: "D3",
    prerequisites: ["JV05"],
    misconceptionTags: ["js.inspector_thread_safety_confusion", "js.cdp_vs_devtools_confusion"],
    keywords: ["inspector", "CDP", "Chrome DevTools Protocol", "breakpoint", "profiler", "SIGUSR2", "WebSocket", "debug port"],
    language: "c"
  }),
  createNode({
    id: "JR06",
    title: "Structured clone: postMessage serialization and transferables",
    track: "js-runtime-internals",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.structured_clone_function_confusion", "js.transfer_vs_copy_confusion"],
    keywords: ["structured clone", "postMessage", "transferable", "ArrayBuffer", "SharedArrayBuffer", "serialization", "worker_threads"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// Graph assembly
// ---------------------------------------------------------------------------

const nodes = [
  ...jsLanguageFrontendNodes,
  ...jsBytecodeNodes,
  ...jsVirtualMachineNodes,
  ...jsObjectModelNodes,
  ...jsGarbageCollectionNodes,
  ...jsEventLoopNodes,
  ...jsPromisesAsyncNodes,
  ...jsClosuresScopeNodes,
  ...jsJitOptimizationNodes,
  ...jsRuntimeInternalsNodes
];

const tracks = {
  "js-language-frontend": {
    id: "js-language-frontend",
    title: "JS Language Frontend (Lexer / Parser)",
    nodeIds: jsLanguageFrontendNodes.map((n) => n.id)
  },
  "js-bytecode": {
    id: "js-bytecode",
    title: "JS Bytecode",
    nodeIds: jsBytecodeNodes.map((n) => n.id)
  },
  "js-virtual-machine": {
    id: "js-virtual-machine",
    title: "JS Virtual Machine",
    nodeIds: jsVirtualMachineNodes.map((n) => n.id)
  },
  "js-object-model": {
    id: "js-object-model",
    title: "JS Object Model",
    nodeIds: jsObjectModelNodes.map((n) => n.id)
  },
  "js-garbage-collection": {
    id: "js-garbage-collection",
    title: "JS Garbage Collection",
    nodeIds: jsGarbageCollectionNodes.map((n) => n.id)
  },
  "js-event-loop": {
    id: "js-event-loop",
    title: "JS Event Loop",
    nodeIds: jsEventLoopNodes.map((n) => n.id)
  },
  "js-promises-async": {
    id: "js-promises-async",
    title: "JS Promises and Async",
    nodeIds: jsPromisesAsyncNodes.map((n) => n.id)
  },
  "js-closures-scope": {
    id: "js-closures-scope",
    title: "JS Closures and Scope",
    nodeIds: jsClosuresScopeNodes.map((n) => n.id)
  },
  "js-jit-optimization": {
    id: "js-jit-optimization",
    title: "JS JIT and Optimization",
    nodeIds: jsJitOptimizationNodes.map((n) => n.id)
  },
  "js-runtime-internals": {
    id: "js-runtime-internals",
    title: "JS Runtime Internals",
    nodeIds: jsRuntimeInternalsNodes.map((n) => n.id)
  }
};

export const jsCurriculum = createCurriculumGraph(nodes, tracks);
