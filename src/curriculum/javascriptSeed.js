import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// JM: Meta-Programming (15 nodes)
// ---------------------------------------------------------------------------
const jsMetaProgrammingNodes = [
  createNode({
    id: "JM01",
    title: "Property descriptors: writable, enumerable, configurable, and defineProperty",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.configurable_delete_confusion", "js.enumerable_forin_confusion"],
    keywords: ["property descriptor", "writable", "enumerable", "configurable", "defineProperty", "getOwnPropertyDescriptor", "Object.defineProperties"],
    language: "javascript"
  }),
  createNode({
    id: "JM02",
    title: "Accessor properties: get/set descriptors and the lazy initializer pattern",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.accessor_vs_data_property_confusion", "js.getter_this_binding_confusion"],
    keywords: ["accessor property", "getter", "setter", "lazy initializer", "Object.defineProperty", "redefine on access", "computed property"],
    language: "javascript"
  }),
  createNode({
    id: "JM03",
    title: "Object.freeze vs seal vs preventExtensions: mutation trapping and shallow depth",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.freeze_deep_confusion", "js.seal_vs_freeze_confusion"],
    keywords: ["Object.freeze", "Object.seal", "Object.preventExtensions", "shallow freeze", "deep freeze", "isFrozen", "isSealed", "isExtensible"],
    language: "javascript"
  }),
  createNode({
    id: "JM04",
    title: "Proxy get/set traps: intercepting all property reads and writes",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.proxy_revocable_confusion", "js.proxy_target_mutation_confusion"],
    keywords: ["Proxy", "get trap", "set trap", "Reflect.get", "Reflect.set", "target", "receiver", "proxy handler"],
    language: "javascript"
  }),
  createNode({
    id: "JM05",
    title: "Proxy has/deleteProperty/ownKeys/getOwnPropertyDescriptor traps",
    track: "js-meta-programming",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.ownkeys_symbol_confusion", "js.has_trap_forin_confusion"],
    keywords: ["has trap", "deleteProperty trap", "ownKeys trap", "getOwnPropertyDescriptor trap", "proxy enumeration", "Reflect.ownKeys", "for-in proxy"],
    language: "javascript"
  }),
  createNode({
    id: "JM06",
    title: "Proxy apply/construct traps: function call interception and new.target override",
    track: "js-meta-programming",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.apply_trap_this_confusion", "js.construct_trap_new_target_confusion"],
    keywords: ["apply trap", "construct trap", "new.target", "function proxy", "callable proxy", "Reflect.apply", "Reflect.construct"],
    language: "javascript"
  }),
  createNode({
    id: "JM07",
    title: "Proxy invariants: non-configurable and non-extensible constraints the trap cannot violate",
    track: "js-meta-programming",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.proxy_invariant_trap_lie_confusion"],
    keywords: ["proxy invariant", "non-configurable", "non-extensible", "invariant violation", "TypeError from proxy", "consistent proxy", "sealed target"],
    language: "javascript"
  }),
  createNode({
    id: "JM08",
    title: "Reflect: the meta-object protocol — trap forwarding and receiver semantics",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.reflect_vs_object_confusion", "js.reflect_receiver_confusion"],
    keywords: ["Reflect", "Reflect.get", "Reflect.set", "Reflect.apply", "Reflect.construct", "meta-object protocol", "receiver", "trap forwarding"],
    language: "javascript"
  }),
  createNode({
    id: "JM09",
    title: "Symbol.toPrimitive: the three-hint coercion protocol (number/string/default)",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.toprimitive_hint_order_confusion", "js.valueof_vs_toprimitive_confusion"],
    keywords: ["Symbol.toPrimitive", "coercion hint", "number hint", "string hint", "default hint", "valueOf", "toString", "ToPrimitive abstract op"],
    language: "javascript"
  }),
  createNode({
    id: "JM10",
    title: "Symbol.iterator: custom iterables, infinite lazy sequences, and the iterator protocol",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.iterable_vs_iterator_confusion", "js.iterator_return_confusion"],
    keywords: ["Symbol.iterator", "iterable", "iterator protocol", "next()", "done", "value", "lazy sequence", "infinite iterator", "for-of"],
    language: "javascript"
  }),
  createNode({
    id: "JM11",
    title: "Symbol.asyncIterator: async generators as composable pull-based pipelines",
    track: "js-meta-programming",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.async_generator_return_confusion", "js.for_await_cancel_confusion"],
    keywords: ["Symbol.asyncIterator", "async generator", "for-await-of", "async iterable", "async iterator protocol", "pipeline", "backpressure"],
    language: "javascript"
  }),
  createNode({
    id: "JM12",
    title: "Symbol.hasInstance: overriding instanceof and OrdinaryHasInstance",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.instanceof_prototype_chain_confusion", "js.hasinstance_static_confusion"],
    keywords: ["Symbol.hasInstance", "instanceof", "static method", "OrdinaryHasInstance", "custom instanceof", "type predicate"],
    language: "javascript"
  }),
  createNode({
    id: "JM13",
    title: "Symbol.species: subclass factories, Array.prototype.map return type, and deprecation",
    track: "js-meta-programming",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.species_map_confusion", "js.species_deprecation_confusion"],
    keywords: ["Symbol.species", "subclass", "factory", "Array.species", "map/filter subclass", "species deprecation", "TC39"],
    language: "javascript"
  }),
  createNode({
    id: "JM14",
    title: "WeakMap: private data pattern, memoization, and identity-keyed metadata",
    track: "js-meta-programming",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.weakmap_enumerable_confusion", "js.weakmap_vs_map_confusion"],
    keywords: ["WeakMap", "private data pattern", "memoization", "identity key", "object metadata", "weak reference", "GC semantics"],
    language: "javascript"
  }),
  createNode({
    id: "JM15",
    title: "WeakRef and FinalizationRegistry: lifecycle-aware caches and ephemeron semantics",
    track: "js-meta-programming",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.weakref_deref_always_confusion", "js.finalizer_timing_confusion"],
    keywords: ["WeakRef", "FinalizationRegistry", "deref", "finalizer", "held value", "GC non-determinism", "ephemeron", "cache eviction"],
    language: "javascript"
  })
];

// ---------------------------------------------------------------------------
// JX: Challenges — build from scratch (20 nodes)
// ---------------------------------------------------------------------------
const jsChallengesNodes = [
  createNode({
    id: "JX01",
    title: "Implement curry with variable arity detection via Function.length",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.curry_arity_rest_confusion", "js.curry_placeholder_confusion"],
    keywords: ["curry", "Function.length", "partial application", "arity", "curried function", "variadic"],
    language: "javascript"
  }),
  createNode({
    id: "JX02",
    title: "Implement compose and pipe supporting sync and async functions",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.compose_order_confusion", "js.async_compose_await_confusion"],
    keywords: ["compose", "pipe", "function composition", "async compose", "point-free", "right-to-left", "reduce"],
    language: "javascript"
  }),
  createNode({
    id: "JX03",
    title: "Implement memoize with WeakMap for object keys and Map for primitives",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.memoize_object_key_confusion", "js.memoize_cache_invalidation_confusion"],
    keywords: ["memoize", "WeakMap", "Map", "cache", "referential equality", "object key", "cache miss"],
    language: "javascript"
  }),
  createNode({
    id: "JX04",
    title: "Implement debounce and throttle with leading and trailing edge options",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.debounce_vs_throttle_confusion", "js.debounce_leading_confusion"],
    keywords: ["debounce", "throttle", "leading edge", "trailing edge", "setTimeout", "clearTimeout", "rate limiting"],
    language: "javascript"
  }),
  createNode({
    id: "JX05",
    title: "Implement Promise.all, Promise.race, and Promise.any from scratch",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.promise_all_short_circuit_confusion", "js.promise_any_agg_error_confusion"],
    keywords: ["Promise.all", "Promise.race", "Promise.any", "AggregateError", "rejection tracking", "counter", "Promise constructor"],
    language: "javascript"
  }),
  createNode({
    id: "JX06",
    title: "Implement a Deferred: externalized resolve/reject (Promise.withResolvers pattern)",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.deferred_executor_timing_confusion"],
    keywords: ["Deferred", "Promise.withResolvers", "externalized promise", "resolve capture", "reject capture", "promise constructor executor"],
    language: "javascript"
  }),
  createNode({
    id: "JX07",
    title: "Implement an async queue with configurable concurrency limit",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.concurrency_limit_race_confusion", "js.queue_drain_confusion"],
    keywords: ["async queue", "concurrency limit", "in-flight", "drain", "semaphore", "task scheduler", "queue"],
    language: "javascript"
  }),
  createNode({
    id: "JX08",
    title: "Implement EventEmitter: on, once, off, emit with error event convention",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.eventemitter_once_removal_confusion", "js.error_event_throw_confusion"],
    keywords: ["EventEmitter", "on", "once", "off", "emit", "error event", "listener", "pub/sub"],
    language: "javascript"
  }),
  createNode({
    id: "JX09",
    title: "Implement deep equality with circular reference detection",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.deep_equal_NaN_confusion", "js.circular_reference_detection_confusion"],
    keywords: ["deep equality", "structural equality", "circular reference", "WeakSet", "NaN comparison", "Map/Set equality", "Date equality"],
    language: "javascript"
  }),
  createNode({
    id: "JX10",
    title: "Implement deep clone handling Date, RegExp, Map, Set, and circular references",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.shallow_clone_confusion", "js.structured_clone_limit_confusion"],
    keywords: ["deep clone", "Date clone", "RegExp clone", "Map clone", "Set clone", "circular reference", "WeakMap", "structuredClone"],
    language: "javascript"
  }),
  createNode({
    id: "JX11",
    title: "Implement observable reactive state: signal, computed, and effect via Proxy",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.reactive_stale_closure_confusion", "js.effect_dependency_tracking_confusion"],
    keywords: ["reactive", "signal", "computed", "effect", "Proxy", "dependency tracking", "dirty flag", "observer pattern"],
    language: "javascript"
  }),
  createNode({
    id: "JX12",
    title: "Implement tagged template literals for safe SQL parameterization",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.tagged_template_raw_confusion", "js.template_injection_confusion"],
    keywords: ["tagged template", "template literal", "tag function", "strings array", "values array", "SQL injection", "escaping", "raw"],
    language: "javascript"
  }),
  createNode({
    id: "JX13",
    title: "Implement lazy Range using Symbol.iterator and Symbol.asyncIterator",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.range_materialization_confusion"],
    keywords: ["Range", "lazy evaluation", "Symbol.iterator", "Symbol.asyncIterator", "generator", "infinite sequence", "take", "map"],
    language: "javascript"
  }),
  createNode({
    id: "JX14",
    title: "Implement flatten to arbitrary depth without recursion using an explicit stack",
    track: "js-challenges",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.flatten_recursive_stackoverflow_confusion"],
    keywords: ["flatten", "arbitrarily deep", "explicit stack", "iterative DFS", "Array.prototype.flat", "stack overflow avoidance"],
    language: "javascript"
  }),
  createNode({
    id: "JX15",
    title: "Implement a parser combinator: sequence, choice, many, map",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.parser_combinator_backtrack_confusion", "js.combinator_result_confusion"],
    keywords: ["parser combinator", "sequence", "choice", "many", "map", "PEG parser", "higher-order function"],
    language: "javascript"
  }),
  createNode({
    id: "JX16",
    title: "Implement a finite state machine with typed transitions and guards",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.fsm_state_mutation_confusion", "js.guard_side_effect_confusion"],
    keywords: ["state machine", "FSM", "transition", "guard", "action", "state", "event", "XState-lite", "deterministic"],
    language: "javascript"
  }),
  createNode({
    id: "JX17",
    title: "Implement Option/Maybe monad: map, flatMap, getOrElse, match",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.monad_laws_confusion", "js.maybe_vs_nullable_confusion"],
    keywords: ["Option", "Maybe", "monad", "functor", "map", "flatMap", "getOrElse", "None", "Some", "algebraic data type"],
    language: "javascript"
  }),
  createNode({
    id: "JX18",
    title: "Implement trampoline for stack-safe mutual recursion",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.trampoline_thunk_confusion", "js.stack_overflow_tco_confusion"],
    keywords: ["trampoline", "thunk", "stack-safe recursion", "tail call optimization", "mutual recursion", "continuation-passing style"],
    language: "javascript"
  }),
  createNode({
    id: "JX19",
    title: "Implement a pipeline operator simulation with Result/Either error short-circuiting",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.pipeline_async_confusion", "js.pipeline_error_propagation_confusion"],
    keywords: ["pipeline operator", "|> proposal", "pipe", "reduce", "Either", "Result", "error short-circuit", "async pipeline"],
    language: "javascript"
  }),
  createNode({
    id: "JX20",
    title: "Implement a minimal reactive framework: batched updates, diamond dependency, computed cache",
    track: "js-challenges",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.reactive_diamond_dependency_confusion", "js.batching_flush_confusion"],
    keywords: ["reactive", "dependency tracking", "computed", "effect", "batch update", "flush", "diamond problem", "Vue reactivity"],
    language: "javascript"
  })
];

// ---------------------------------------------------------------------------
// JN: Node.js Advanced (15 nodes)
// ---------------------------------------------------------------------------
const jsNodeAdvancedNodes = [
  createNode({
    id: "JN01",
    title: "Buffer internals: alloc vs allocUnsafe, pool slicing, and encoding",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.buffer_allocunsafe_data_leak_confusion", "js.buffer_pool_slice_confusion"],
    keywords: ["Buffer", "allocUnsafe", "alloc", "Buffer pool", "Buffer.from", "encoding", "zero-fill", "buffer slice"],
    language: "javascript"
  }),
  createNode({
    id: "JN02",
    title: "Transform streams: _transform, _flush, and objectMode pipelines",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.transform_push_callback_confusion", "js.objectmode_buffer_confusion"],
    keywords: ["Transform stream", "_transform", "_flush", "objectMode", "push", "stream.pipeline", "Duplex", "stream transform"],
    language: "javascript"
  }),
  createNode({
    id: "JN03",
    title: "Backpressure mechanics: highWaterMark, drain event, cork/uncork",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.backpressure_ignore_confusion", "js.highwatermark_bytes_confusion"],
    keywords: ["backpressure", "highWaterMark", "drain", "writable.write", "cork", "uncork", "stream buffering", "flow control"],
    language: "javascript"
  }),
  createNode({
    id: "JN04",
    title: "worker_threads: SharedArrayBuffer + Atomics for lock-free coordination",
    track: "js-node-advanced",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.sab_race_condition_confusion", "js.atomics_wait_main_thread_confusion"],
    keywords: ["worker_threads", "SharedArrayBuffer", "Atomics", "Atomics.wait", "Atomics.notify", "lock-free", "compareExchange", "memory model"],
    language: "javascript"
  }),
  createNode({
    id: "JN05",
    title: "worker_threads: MessageChannel, transferables, and postMessage performance",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.transferable_post_confusion", "js.message_channel_port_confusion"],
    keywords: ["MessageChannel", "MessagePort", "transferable", "postMessage", "ArrayBuffer transfer", "worker communication", "structured clone"],
    language: "javascript"
  }),
  createNode({
    id: "JN06",
    title: "AsyncLocalStorage: request-scoped context propagation through async boundaries",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.als_child_store_confusion", "js.als_run_exit_confusion"],
    keywords: ["AsyncLocalStorage", "async context", "request scoping", "run", "getStore", "async hooks", "CLS", "context propagation"],
    language: "javascript"
  }),
  createNode({
    id: "JN07",
    title: "async_hooks: AsyncResource, createHook, and execution context tracking",
    track: "js-node-advanced",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.asyncresource_bind_confusion", "js.trigger_asyncid_confusion"],
    keywords: ["async_hooks", "AsyncResource", "createHook", "asyncId", "triggerAsyncId", "destroy", "bind", "execution context"],
    language: "javascript"
  }),
  createNode({
    id: "JN08",
    title: "vm module: isolated contexts, runInNewContext, and code sandboxing limits",
    track: "js-node-advanced",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.vm_sandbox_escape_confusion", "js.context_sharing_confusion"],
    keywords: ["vm", "createContext", "runInNewContext", "Script", "sandbox", "isolated globals", "vm.Module", "realms"],
    language: "javascript"
  }),
  createNode({
    id: "JN09",
    title: "child_process: spawn vs exec vs execFile vs fork, stdio modes, and IPC",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.exec_shell_injection_confusion", "js.child_process_stdio_inherit_confusion"],
    keywords: ["spawn", "exec", "execFile", "fork", "stdio", "IPC", "child_process", "kill", "shell injection", "pipe"],
    language: "javascript"
  }),
  createNode({
    id: "JN10",
    title: "cluster module: fork, IPC messaging, and shared server socket distribution",
    track: "js-node-advanced",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.cluster_shared_port_confusion", "js.cluster_worker_death_confusion"],
    keywords: ["cluster", "fork", "IPC", "shared server", "worker death", "primary", "connection distribution", "SIGTERM"],
    language: "javascript"
  }),
  createNode({
    id: "JN11",
    title: "perf_hooks: PerformanceObserver, mark/measure, and GC observation",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.perf_mark_vs_measure_confusion", "js.gc_timing_precision_confusion"],
    keywords: ["perf_hooks", "PerformanceObserver", "performance.mark", "performance.measure", "gc", "entryTypes", "PerformanceEntry", "timing"],
    language: "javascript"
  }),
  createNode({
    id: "JN12",
    title: "node:net: raw TCP server with length-prefixed framing protocol",
    track: "js-node-advanced",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.tcp_fragment_confusion", "js.net_data_encoding_confusion"],
    keywords: ["node:net", "TCP", "createServer", "framing", "length-prefix", "socket", "data event", "protocol design"],
    language: "javascript"
  }),
  createNode({
    id: "JN13",
    title: "node:crypto advanced: HKDF, PBKDF2, scrypt, and subtle crypto",
    track: "js-node-advanced",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.crypto_kdf_confusion", "js.subtle_crypto_async_confusion"],
    keywords: ["HKDF", "PBKDF2", "scrypt", "key derivation", "subtle crypto", "createHmac", "randomBytes", "crypto.subtle"],
    language: "javascript"
  }),
  createNode({
    id: "JN14",
    title: "Node.js module hooks: module.register, resolve, load, and globalPreload",
    track: "js-node-advanced",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.loader_hook_worker_confusion", "js.resolve_url_confusion"],
    keywords: ["module hooks", "module.register", "resolve hook", "load hook", "globalPreload", "custom loader", "ESM loader", "shortCircuit"],
    language: "javascript"
  }),
  createNode({
    id: "JN15",
    title: "node:fs advanced: fs.watch with AbortSignal, recursive watching, and FSEvents on macOS",
    track: "js-node-advanced",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.fswatch_rename_confusion", "js.fsevents_reliability_confusion"],
    keywords: ["fs.watch", "FSEvents", "recursive", "AbortSignal", "watchFile", "inotify", "kqueue", "file watching"],
    language: "javascript"
  })
];

// ---------------------------------------------------------------------------
// JW: Weird Parts / Engine Gotchas (15 nodes)
// ---------------------------------------------------------------------------
const jsWeirdPartsNodes = [
  createNode({
    id: "JW01",
    title: "Abstract equality: the complete == coercion algorithm step by step",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.abstract_equality_symmetry_confusion", "js.null_undefined_equality_confusion"],
    keywords: ["abstract equality", "==", "coercion", "ToPrimitive", "ToNumber", "null == undefined", "[] == false", "type coercion algorithm"],
    language: "javascript"
  }),
  createNode({
    id: "JW02",
    title: "The + operator: string/number disambiguation and ToPrimitive hint order",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.plus_operator_object_confusion", "js.plus_null_confusion"],
    keywords: ["+ operator", "string concatenation", "numeric addition", "ToPrimitive", "default hint", "object coercion", "unary plus"],
    language: "javascript"
  }),
  createNode({
    id: "JW03",
    title: "typeof quirks: null, undeclared variables, class, Symbol, and async functions",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.typeof_null_confusion", "js.typeof_function_confusion"],
    keywords: ["typeof", "typeof null", "typeof undeclared", "typeof function", "typeof class", "typeof Symbol", "type checking"],
    language: "javascript"
  }),
  createNode({
    id: "JW04",
    title: "NaN: self-inequality, propagation, isNaN vs Number.isNaN, and Object.is",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.isnan_string_coercion_confusion", "js.nan_propagation_confusion"],
    keywords: ["NaN", "isNaN", "Number.isNaN", "Object.is", "NaN propagation", "IEEE 754", "self-inequality", "typeof NaN"],
    language: "javascript"
  }),
  createNode({
    id: "JW05",
    title: "Signed zero: Object.is(-0, 0), division by -0, and JSON.stringify(-0)",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.negative_zero_equality_confusion", "js.negative_zero_stringify_confusion"],
    keywords: ["negative zero", "-0", "Object.is", "JSON.stringify", "Math.sign", "division by zero", "IEEE 754 signed zero"],
    language: "javascript"
  }),
  createNode({
    id: "JW06",
    title: "Floating point: 0.1 + 0.2, Number.EPSILON, Math.fround, and safe comparison",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.float_equality_confusion", "js.epsilon_comparison_confusion"],
    keywords: ["floating point", "0.1 + 0.2", "Number.EPSILON", "Math.fround", "IEEE 754", "rounding error", "toFixed", "precision"],
    language: "javascript"
  }),
  createNode({
    id: "JW07",
    title: "Prototype pollution: __proto__ in JSON, Object.assign merge, and Object.create(null) defense",
    track: "js-weird-parts",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.proto_assign_confusion", "js.object_create_null_defense_confusion"],
    keywords: ["prototype pollution", "__proto__", "Object.assign", "JSON.parse", "Object.create(null)", "hasOwnProperty", "defense pattern"],
    language: "javascript"
  }),
  createNode({
    id: "JW08",
    title: "Array holes: delete creates holes, map/filter/reduce skip, join and Array.from",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.delete_array_element_confusion", "js.holey_array_iteration_confusion"],
    keywords: ["array hole", "sparse array", "delete", "map skip", "filter skip", "Array.from", "join", "PACKED vs HOLEY"],
    language: "javascript"
  }),
  createNode({
    id: "JW09",
    title: "Integer precision: MAX_SAFE_INTEGER, bitwise 32-bit truncation, BigInt boundary",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.max_safe_integer_confusion", "js.bitwise_truncation_confusion"],
    keywords: ["MAX_SAFE_INTEGER", "bitwise operator", "32-bit int", "BigInt", "integer overflow", "Number.isSafeInteger", ">>> 0"],
    language: "javascript"
  }),
  createNode({
    id: "JW10",
    title: "Relational coercion: null >= 0 is true, null == 0 is false — AbstractRelationalComparison",
    track: "js-weird-parts",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.relational_null_confusion", "js.comparison_symmetry_confusion"],
    keywords: ["null >= 0", "null == 0", "AbstractRelationalComparison", "ToNumber(null)", "abstract equality", "relational comparison"],
    language: "javascript"
  }),
  createNode({
    id: "JW11",
    title: "Function.name: inference rules, computed keys, class methods, and bound function names",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.function_name_anonymous_confusion", "js.bound_function_name_confusion"],
    keywords: ["Function.name", "name inference", "anonymous function", "bound function", "class method name", "computed method", "Symbol key name"],
    language: "javascript"
  }),
  createNode({
    id: "JW12",
    title: "arguments object: aliasing with named params, caller/callee, and strict mode ban",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.arguments_aliasing_confusion", "js.arguments_arrow_function_confusion"],
    keywords: ["arguments", "arguments aliasing", "caller", "callee", "strict mode", "rest params", "arguments vs rest"],
    language: "javascript"
  }),
  createNode({
    id: "JW13",
    title: "Variable hoisting edge cases: var in blocks, function declarations in if, duplicate names",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.var_block_scope_confusion", "js.function_declaration_if_confusion"],
    keywords: ["hoisting", "var in block", "function declaration hoisting", "TDZ", "let const hoisting", "block-level function"],
    language: "javascript"
  }),
  createNode({
    id: "JW14",
    title: "Unicode in JS: surrogate pairs, String.codePointAt, grapheme clusters, Intl.Segmenter",
    track: "js-weird-parts",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.string_length_unicode_confusion", "js.emoji_surrogate_confusion"],
    keywords: ["surrogate pair", "codePointAt", "fromCodePoint", "Intl.Segmenter", "grapheme cluster", "UTF-16", "emoji length", "Unicode scalar"],
    language: "javascript"
  }),
  createNode({
    id: "JW15",
    title: "Regex state: lastIndex mutation, sticky/global pitfalls, named captures, lookbehind",
    track: "js-weird-parts",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.regex_lastindex_confusion", "js.regex_global_reuse_confusion"],
    keywords: ["regex lastIndex", "sticky flag", "global flag", "named capture group", "exec loop", "test side effect", "lookbehind"],
    language: "javascript"
  })
];

// ---------------------------------------------------------------------------
// JA: Async Patterns (8 nodes)
// ---------------------------------------------------------------------------
const jsAsyncPatternsNodes = [
  createNode({
    id: "JA01",
    title: "queueMicrotask: scheduling relative to Promise microtasks and setTimeout(0)",
    track: "js-async-patterns",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.queuemicrotask_vs_promise_resolve_confusion"],
    keywords: ["queueMicrotask", "microtask", "macrotask", "scheduling", "setTimeout(0)", "PromiseReactionJob", "checkpoint"],
    language: "javascript"
  }),
  createNode({
    id: "JA02",
    title: "AbortController and AbortSignal: cooperative cancellation across async boundaries",
    track: "js-async-patterns",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.abort_after_resolve_confusion", "js.abort_signal_fetch_confusion"],
    keywords: ["AbortController", "AbortSignal", "abort", "signal.aborted", "signal.reason", "fetch cancellation", "cooperative cancellation"],
    language: "javascript"
  }),
  createNode({
    id: "JA03",
    title: "Async generator cancellation: for-await break triggers .return() and finally cleanup",
    track: "js-async-patterns",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.async_gen_finally_confusion", "js.for_await_break_cleanup_confusion"],
    keywords: ["async generator", "return()", "finally cleanup", "for-await break", "generator protocol", "cancellation", "resource cleanup"],
    language: "javascript"
  }),
  createNode({
    id: "JA04",
    title: "Structured concurrency: racing tasks with guaranteed cleanup on cancellation or error",
    track: "js-async-patterns",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.race_leak_confusion", "js.structured_concurrency_scope_confusion"],
    keywords: ["structured concurrency", "task group", "race with cleanup", "AbortSignal", "nursery pattern", "Kotlin coroutines", "cleanup guarantee"],
    language: "javascript"
  }),
  createNode({
    id: "JA05",
    title: "Async generators as pull-based streams with natural demand-driven backpressure",
    track: "js-async-patterns",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.push_vs_pull_confusion", "js.async_gen_buffering_confusion"],
    keywords: ["async generator", "pull stream", "backpressure", "demand-driven", "yield await", "pipeline", "async iterable chain"],
    language: "javascript"
  }),
  createNode({
    id: "JA06",
    title: "Error cause chain: new Error('msg', { cause }) across async stack frame boundaries",
    track: "js-async-patterns",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.error_cause_serialization_confusion", "js.aggregate_error_causes_confusion"],
    keywords: ["Error cause", "error chaining", "cause property", "AggregateError", "error wrapping", "async stack trace", "error context"],
    language: "javascript"
  }),
  createNode({
    id: "JA07",
    title: "Promise.withResolvers: the standardized Deferred and its composability",
    track: "js-async-patterns",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.withresolvers_executor_confusion"],
    keywords: ["Promise.withResolvers", "Deferred", "resolve", "reject", "externalized promise", "promise resolve capture"],
    language: "javascript"
  }),
  createNode({
    id: "JA08",
    title: "Scheduler API: scheduler.postTask with TaskPriority, delay, and AbortSignal",
    track: "js-async-patterns",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.scheduler_priority_confusion", "js.scheduler_vs_settimeout_confusion"],
    keywords: ["Scheduler API", "postTask", "TaskPriority", "user-visible", "background", "user-blocking", "delay", "AbortSignal", "web scheduler"],
    language: "javascript"
  })
];

// ---------------------------------------------------------------------------
// JQ: Toolchain Internals (7 nodes)
// ---------------------------------------------------------------------------
const jsToolchainNodes = [
  createNode({
    id: "JQ01",
    title: "ESTree AST format: node types, location info, and generic visitor traversal",
    track: "js-toolchain",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.ast_node_type_confusion", "js.visitor_traversal_order_confusion"],
    keywords: ["ESTree", "AST", "Node type", "loc", "range", "visitor", "walk", "acorn", "estree spec", "statement vs expression"],
    language: "javascript"
  }),
  createNode({
    id: "JQ02",
    title: "Babel plugin anatomy: visitor pattern, NodePath API, and scope.rename",
    track: "js-toolchain",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.babel_path_vs_node_confusion", "js.scope_rename_binding_confusion"],
    keywords: ["Babel plugin", "visitor", "NodePath", "path.replaceWith", "scope.rename", "binding", "traverse", "babel transform"],
    language: "javascript"
  }),
  createNode({
    id: "JQ03",
    title: "Tree shaking: sideEffects flag, /*#__PURE__*/ annotation, and IIFE detection",
    track: "js-toolchain",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.sideeffects_module_confusion", "js.pure_annotation_confusion"],
    keywords: ["tree shaking", "sideEffects", "__PURE__", "dead code elimination", "rollup", "esbuild", "IIFE", "module graph"],
    language: "javascript"
  }),
  createNode({
    id: "JQ04",
    title: "CommonJS/ESM interop: __esModule flag, default export wrapping, and exports conditions",
    track: "js-toolchain",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.esm_cjs_default_confusion", "js.exports_conditions_confusion"],
    keywords: ["CommonJS", "ESM", "interop", "__esModule", "default import", "exports", "conditions", ".cjs", ".mjs", "named exports"],
    language: "javascript"
  }),
  createNode({
    id: "JQ05",
    title: "Module resolution algorithm: bare specifiers, exports map, subpath patterns, and conditions",
    track: "js-toolchain",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["js.exports_map_fallback_confusion", "js.import_specifier_conditions_confusion"],
    keywords: ["module resolution", "bare specifier", "exports map", "conditions", "subpath exports", "package.json#exports", "import map"],
    language: "javascript"
  }),
  createNode({
    id: "JQ06",
    title: "Node.js module register hooks: resolve, load, and globalPreload hook chain",
    track: "js-toolchain",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.loader_hook_chain_confusion", "js.module_register_format_confusion"],
    keywords: ["module.register", "resolve hook", "load hook", "globalPreload", "format", "source", "shortCircuit", "ESM loader"],
    language: "javascript"
  }),
  createNode({
    id: "JQ07",
    title: "Source map consumer: VLQ encoding, mappings field, and original position lookup",
    track: "js-toolchain",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["js.vlq_sign_confusion", "js.sourcemap_segment_confusion"],
    keywords: ["source map", "VLQ", "base64 VLQ", "mappings", "generated column", "original line", "source-map consumer", "sourceMappingURL"],
    language: "javascript"
  })
];

// ---------------------------------------------------------------------------
// Graph assembly
// ---------------------------------------------------------------------------
const nodes = [
  ...jsMetaProgrammingNodes,
  ...jsChallengesNodes,
  ...jsNodeAdvancedNodes,
  ...jsWeirdPartsNodes,
  ...jsAsyncPatternsNodes,
  ...jsToolchainNodes
];

const tracks = {
  "js-meta-programming": {
    id: "js-meta-programming",
    title: "JavaScript Meta-Programming",
    nodeIds: jsMetaProgrammingNodes.map((n) => n.id)
  },
  "js-challenges": {
    id: "js-challenges",
    title: "JavaScript Challenges",
    nodeIds: jsChallengesNodes.map((n) => n.id)
  },
  "js-node-advanced": {
    id: "js-node-advanced",
    title: "Node.js Advanced",
    nodeIds: jsNodeAdvancedNodes.map((n) => n.id)
  },
  "js-weird-parts": {
    id: "js-weird-parts",
    title: "JavaScript Weird Parts",
    nodeIds: jsWeirdPartsNodes.map((n) => n.id)
  },
  "js-async-patterns": {
    id: "js-async-patterns",
    title: "JavaScript Async Patterns",
    nodeIds: jsAsyncPatternsNodes.map((n) => n.id)
  },
  "js-toolchain": {
    id: "js-toolchain",
    title: "JavaScript Toolchain Internals",
    nodeIds: jsToolchainNodes.map((n) => n.id)
  }
};

export const javascriptCurriculum = createCurriculumGraph(nodes, tracks);
