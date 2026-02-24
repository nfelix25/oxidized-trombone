import { createCurriculumGraph, createNode } from "./model.js";

// --- Tier 1: Foundations ---
const foundationsNodes = [
  createNode({
    id: "A200",
    title: "Ownership mental model",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["own.move.after_move_use"],
    keywords: ["ownership", "moves", "stack", "heap", "copy", "clone"]
  }),
  createNode({
    id: "A201",
    title: "Move semantics and Copy types",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A200"],
    misconceptionTags: ["own.copy_vs_clone_confusion", "own.move.after_move_use"],
    keywords: ["move", "copy", "clone", "integer", "string"]
  }),
  createNode({
    id: "A202",
    title: "Shared borrowing",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: ["A200"],
    misconceptionTags: ["borrow.shared_then_mut_conflict"],
    keywords: ["borrow", "shared", "reference", "ampersand"]
  }),
  createNode({
    id: "A203",
    title: "Mutable references and aliasing",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: ["A200", "A202"],
    misconceptionTags: [
      "borrow.two_mut_refs",
      "borrow.shared_then_mut_conflict",
      "borrow.reborrow_confusion"
    ],
    keywords: ["mutable", "aliasing", "borrowing", "references", "mut"]
  }),
  createNode({
    id: "A204",
    title: "Borrow scopes and NLL",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: ["A203"],
    misconceptionTags: ["borrow.reborrow_confusion", "borrow.scope_extension_confusion"],
    keywords: ["scope", "nll", "lifetimes", "lexical", "non-lexical"]
  }),
  createNode({
    id: "A205",
    title: "Error handling with Result",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A200"],
    misconceptionTags: ["err.unwrap_panic_confusion", "err.question_mark_propagation"],
    keywords: ["result", "error", "unwrap", "question_mark", "ok", "err"]
  }),
  createNode({
    id: "A206",
    title: "Option and None patterns",
    track: "foundations",
    depthTarget: "D1",
    prerequisites: ["A200"],
    misconceptionTags: ["err.option_vs_result_confusion"],
    keywords: ["option", "none", "some", "if let", "match"]
  }),
  createNode({
    id: "A207",
    title: "Pattern matching and destructuring",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A206"],
    misconceptionTags: ["pattern.non_exhaustive_match", "pattern.binding_confusion"],
    keywords: ["match", "pattern", "destructure", "enum", "struct", "binding"]
  }),
  createNode({
    id: "A208",
    title: "Lifetime annotations in functions",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A204"],
    misconceptionTags: ["life.missing_annotation", "life.lifetime_longer_than_owner"],
    keywords: ["lifetime", "annotations", "references", "tick", "generic"]
  }),
  createNode({
    id: "A209",
    title: "Struct ownership and field access",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A200", "A202"],
    misconceptionTags: ["own.partial_move_struct", "borrow.field_borrow_conflict"],
    keywords: ["struct", "field", "ownership", "partial move", "self"]
  })
];

// --- Tier 2: Collections, Iterators, Traits ---
const collectionsNodes = [
  createNode({
    id: "A500",
    title: "Vec ownership patterns",
    track: "collections",
    depthTarget: "D3",
    prerequisites: ["A203"],
    misconceptionTags: ["coll.vec_reallocation_reference_invalidity", "coll.vec_push_borrow_conflict"],
    keywords: ["vec", "collections", "ownership", "push", "pop", "borrow"]
  }),
  createNode({
    id: "A501",
    title: "HashMap and entry API",
    track: "collections",
    depthTarget: "D2",
    prerequisites: ["A200"],
    misconceptionTags: ["coll.hashmap_key_ownership", "coll.entry_borrow_lifetime"],
    keywords: ["hashmap", "entry", "insert", "get", "keys", "values"]
  }),
  createNode({
    id: "A502",
    title: "Slices and slice references",
    track: "collections",
    depthTarget: "D2",
    prerequisites: ["A202", "A500"],
    misconceptionTags: ["coll.slice_vs_vec_confusion", "borrow.shared_then_mut_conflict"],
    keywords: ["slice", "str", "array", "reference", "range"]
  }),
  createNode({
    id: "A503",
    title: "Iterator ownership modes",
    track: "collections",
    depthTarget: "D3",
    prerequisites: ["A500"],
    misconceptionTags: ["iter.iter_vs_into_iter", "iter.adaptor_lazy_evaluation"],
    keywords: ["iter", "into_iter", "iter_mut", "ownership", "consuming", "borrowing"]
  }),
  createNode({
    id: "A504",
    title: "Iterator adaptors and chaining",
    track: "collections",
    depthTarget: "D2",
    prerequisites: ["A503"],
    misconceptionTags: ["iter.adaptor_lazy_evaluation", "iter.collect_type_inference"],
    keywords: ["map", "filter", "fold", "collect", "chain", "flat_map", "take"]
  }),
  createNode({
    id: "A505",
    title: "Trait objects and dynamic dispatch",
    track: "collections",
    depthTarget: "D2",
    prerequisites: ["A200", "A202"],
    misconceptionTags: ["trait.dyn_size_unknown", "trait.object_safety_confusion"],
    keywords: ["dyn", "trait", "dynamic", "dispatch", "box", "vtable"]
  }),
  createNode({
    id: "A506",
    title: "Implementing Display and From traits",
    track: "collections",
    depthTarget: "D1",
    prerequisites: ["A205"],
    misconceptionTags: ["trait.from_into_direction_confusion"],
    keywords: ["display", "from", "into", "trait", "implement", "format"]
  })
];

// --- Tier 3: Async, Transfer Practice ---
const asyncNodes = [
  createNode({
    id: "A700",
    title: "Future and async runtime basics",
    track: "async",
    depthTarget: "D1",
    prerequisites: ["A200"],
    misconceptionTags: ["async.future_not_lazy_confusion", "async.executor_required"],
    keywords: ["async", "future", "await", "tokio", "runtime", "poll"]
  }),
  createNode({
    id: "A701",
    title: "Async fn ownership effects",
    track: "async",
    depthTarget: "D2",
    prerequisites: ["A203", "A700"],
    misconceptionTags: ["async.lifetime_across_await_confusion", "async.send_bound_confusion"],
    keywords: ["async", "await", "ownership", "lifetime", "send", "sync"]
  }),
  createNode({
    id: "A702",
    title: "Shared state with Arc and Mutex",
    track: "async",
    depthTarget: "D2",
    prerequisites: ["A203", "A701"],
    misconceptionTags: ["async.arc_mutex_deadlock", "async.send_bound_confusion"],
    keywords: ["arc", "mutex", "rwlock", "shared", "state", "thread"]
  }),
  createNode({
    id: "A703",
    title: "Channels and message passing",
    track: "async",
    depthTarget: "D2",
    prerequisites: ["A700"],
    misconceptionTags: ["async.channel_ownership_transfer", "async.closed_receiver_confusion"],
    keywords: ["channel", "mpsc", "sender", "receiver", "message", "tokio"]
  }),
  createNode({
    id: "A704",
    title: "Pin and self-referential types",
    track: "async",
    depthTarget: "D3",
    prerequisites: ["A701", "A702"],
    misconceptionTags: ["async.pin_move_after_pin", "async.unpin_vs_pin_confusion"],
    keywords: ["pin", "unpin", "self-referential", "future", "box", "stack"]
  })
];

// --- Tier 4: Smart Pointers ---
const smartPointerNodes = [
  createNode({
    id: "B100",
    title: "Box<T> and heap allocation",
    track: "smart-pointers",
    depthTarget: "D2",
    prerequisites: ["A200"],
    misconceptionTags: ["ptr.box_vs_stack_confusion", "ptr.deref_coercion_surprise"],
    keywords: ["box", "heap", "allocation", "recursive", "deref", "pointer"]
  }),
  createNode({
    id: "B101",
    title: "Rc<T> and shared ownership",
    track: "smart-pointers",
    depthTarget: "D2",
    prerequisites: ["B100"],
    misconceptionTags: ["ptr.rc_cycle_leak", "ptr.rc_vs_arc_confusion"],
    keywords: ["rc", "reference counting", "shared", "clone", "strong", "weak"]
  }),
  createNode({
    id: "B102",
    title: "RefCell<T> and interior mutability",
    track: "smart-pointers",
    depthTarget: "D2",
    prerequisites: ["B101", "A203"],
    misconceptionTags: ["ptr.refcell_runtime_borrow_panic", "ptr.interior_mutability_confusion"],
    keywords: ["refcell", "interior mutability", "borrow_mut", "runtime", "cell"]
  }),
  createNode({
    id: "B103",
    title: "Deref coercions and smart pointer patterns",
    track: "smart-pointers",
    depthTarget: "D2",
    prerequisites: ["B100", "A202"],
    misconceptionTags: ["ptr.deref_coercion_surprise", "ptr.deref_chain_confusion"],
    keywords: ["deref", "coercion", "as_ref", "target", "auto-deref", "method resolution"]
  })
];

// --- Tier 5: Concurrency (OS threads) ---
const concurrencyNodes = [
  createNode({
    id: "C100",
    title: "OS threads with std::thread",
    track: "concurrency",
    depthTarget: "D2",
    prerequisites: ["A200", "A201"],
    misconceptionTags: ["conc.thread_lifetime_confusion", "conc.spawn_without_join_leak"],
    keywords: ["thread", "spawn", "join", "handle", "std::thread", "parallelism"]
  }),
  createNode({
    id: "C101",
    title: "Move closures and thread ownership",
    track: "concurrency",
    depthTarget: "D2",
    prerequisites: ["C100", "A207"],
    misconceptionTags: ["conc.closure_capture_vs_move", "own.move.after_move_use"],
    keywords: ["move", "closure", "capture", "thread", "FnOnce", "send"]
  }),
  createNode({
    id: "C102",
    title: "Channels and message passing (mpsc)",
    track: "concurrency",
    depthTarget: "D2",
    prerequisites: ["C100"],
    misconceptionTags: ["conc.channel_closed_recv_confusion", "conc.mpsc_multi_producer"],
    keywords: ["mpsc", "channel", "sender", "receiver", "send", "recv", "clone"]
  }),
  createNode({
    id: "C103",
    title: "Mutex<T> and Arc<Mutex<T>> shared state",
    track: "concurrency",
    depthTarget: "D3",
    prerequisites: ["C100", "B101"],
    misconceptionTags: ["conc.mutex_deadlock", "conc.arc_mutex_lock_guard_lifetime"],
    keywords: ["mutex", "arc", "lock", "guard", "shared state", "poisoned"]
  })
];

// --- Tier 6: Macros ---
const macroNodes = [
  createNode({
    id: "M100",
    title: "macro_rules! declarative macros",
    track: "macros",
    depthTarget: "D2",
    prerequisites: ["A200", "A207"],
    misconceptionTags: ["macro.matcher_fragment_confusion", "macro.macro_hygiene_confusion"],
    keywords: ["macro_rules", "declarative", "matcher", "fragment", "tt", "expr", "ident"]
  }),
  createNode({
    id: "M101",
    title: "Built-in derive macros",
    track: "macros",
    depthTarget: "D1",
    prerequisites: ["A200"],
    misconceptionTags: ["macro.derive_not_implemented_confusion", "macro.partial_eq_vs_eq"],
    keywords: ["derive", "debug", "clone", "partialEq", "hash", "serialize", "attribute"]
  }),
  createNode({
    id: "M102",
    title: "Procedural macros introduction",
    track: "macros",
    depthTarget: "D2",
    prerequisites: ["M100", "M101"],
    misconceptionTags: ["macro.proc_macro_crate_required", "macro.token_stream_confusion"],
    keywords: ["proc_macro", "derive macro", "attribute macro", "token stream", "syn", "quote"]
  })
];

// --- Tier 7: Generics ---
const genericsNodes = [
  createNode({
    id: "G100",
    title: "Generic type parameters in functions and structs",
    track: "generics",
    depthTarget: "D2",
    prerequisites: ["A200", "A209"],
    misconceptionTags: ["gen.monomorphization_confusion", "gen.type_param_vs_lifetime_param"],
    keywords: ["generic", "type parameter", "monomorphization", "angle brackets", "struct", "fn"]
  }),
  createNode({
    id: "G101",
    title: "Trait bounds and where clauses",
    track: "generics",
    depthTarget: "D2",
    prerequisites: ["G100", "A505"],
    misconceptionTags: ["gen.bound_not_satisfied_confusion", "gen.multiple_bounds_syntax"],
    keywords: ["trait bound", "where", "impl Trait", "dyn Trait", "bounds", "constraint"]
  }),
  createNode({
    id: "G102",
    title: "Associated types in traits",
    track: "generics",
    depthTarget: "D2",
    prerequisites: ["G101", "A503"],
    misconceptionTags: ["gen.associated_type_vs_generic_param", "gen.iterator_item_confusion"],
    keywords: ["associated type", "type", "Iterator", "Item", "trait definition", "impl"]
  }),
  createNode({
    id: "G103",
    title: "Generic lifetime parameters",
    track: "generics",
    depthTarget: "D3",
    prerequisites: ["A208", "G100"],
    misconceptionTags: ["life.missing_annotation", "gen.lifetime_bound_confusion"],
    keywords: ["lifetime", "generic", "tick", "annotation", "struct lifetime", "impl lifetime"]
  })
];

const nodes = [
  ...foundationsNodes,
  ...collectionsNodes,
  ...asyncNodes,
  ...smartPointerNodes,
  ...concurrencyNodes,
  ...macroNodes,
  ...genericsNodes
];

const tracks = {
  foundations: {
    id: "foundations",
    title: "Ownership and Borrowing",
    nodeIds: foundationsNodes.map((n) => n.id)
  },
  collections: {
    id: "collections",
    title: "Collections, Iterators, and Traits",
    nodeIds: collectionsNodes.map((n) => n.id)
  },
  async: {
    id: "async",
    title: "Async and Concurrency",
    nodeIds: asyncNodes.map((n) => n.id)
  },
  "smart-pointers": {
    id: "smart-pointers",
    title: "Smart Pointers and Interior Mutability",
    nodeIds: smartPointerNodes.map((n) => n.id)
  },
  concurrency: {
    id: "concurrency",
    title: "OS Threads and Shared State",
    nodeIds: concurrencyNodes.map((n) => n.id)
  },
  macros: {
    id: "macros",
    title: "Macros",
    nodeIds: macroNodes.map((n) => n.id)
  },
  generics: {
    id: "generics",
    title: "Generics and Type System",
    nodeIds: genericsNodes.map((n) => n.id)
  }
};

export const seedCurriculum = createCurriculumGraph(nodes, tracks);
