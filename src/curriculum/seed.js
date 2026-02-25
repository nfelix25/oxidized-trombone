import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// Tier 0: Rust Syntax Basics — fast-track for experienced programmers
// These are D1/D2 nodes: you already know what a variable is; you just need
// to learn how Rust spells it. All should unlock quickly.
// ---------------------------------------------------------------------------
const syntaxBasicsNodes = [
  createNode({
    id: "S100",
    title: "Variables, types, and mutability",
    track: "syntax-basics",
    depthTarget: "D1",
    prerequisites: [],
    misconceptionTags: ["syn.let_mut_confusion", "syn.shadowing_vs_mutation"],
    keywords: ["let", "mut", "const", "type inference", "shadowing", "i32", "u64", "f64", "bool", "char", "tuple", "unit"]
  }),
  createNode({
    id: "S101",
    title: "Functions, control flow, and expressions",
    track: "syntax-basics",
    depthTarget: "D1",
    prerequisites: ["S100"],
    misconceptionTags: ["syn.statement_vs_expression", "syn.implicit_return_confusion"],
    keywords: ["fn", "return", "if", "else", "loop", "while", "for", "in", "break", "continue", "range", "block expression"]
  }),
  createNode({
    id: "S102",
    title: "Structs and impl blocks",
    track: "syntax-basics",
    depthTarget: "D1",
    prerequisites: ["S101"],
    misconceptionTags: ["syn.self_vs_Self_confusion", "syn.associated_fn_vs_method"],
    keywords: ["struct", "impl", "self", "&self", "&mut self", "associated function", "new", "field", "method"]
  }),
  createNode({
    id: "S103",
    title: "Enums with data and match",
    track: "syntax-basics",
    depthTarget: "D1",
    prerequisites: ["S102"],
    misconceptionTags: ["syn.enum_variant_not_type_confusion", "syn.match_arm_binding_confusion"],
    keywords: ["enum", "match", "variant", "if let", "while let", "tuple variant", "struct variant", "exhaustive"]
  }),
  createNode({
    id: "S104",
    title: "String types: String vs &str",
    track: "syntax-basics",
    depthTarget: "D2",
    prerequisites: ["S100"],
    misconceptionTags: ["syn.string_vs_str_confusion", "syn.string_literal_type_confusion"],
    keywords: ["String", "&str", "str", "string literal", "to_string", "to_owned", "format!", "UTF-8", "push_str", "as_str"]
  }),
  createNode({
    id: "S105",
    title: "Closures and higher-order functions",
    track: "syntax-basics",
    depthTarget: "D2",
    prerequisites: ["S101"],
    misconceptionTags: ["syn.closure_type_inference_confusion", "syn.fn_pointer_vs_closure"],
    keywords: ["closure", "|args|", "Fn", "FnMut", "FnOnce", "capture", "higher-order", "fn pointer", "type inference"]
  }),
  createNode({
    id: "S106",
    title: "Traits — defining and implementing",
    track: "syntax-basics",
    depthTarget: "D2",
    prerequisites: ["S102"],
    misconceptionTags: ["syn.trait_not_interface_confusion", "syn.default_method_override_confusion"],
    keywords: ["trait", "impl Trait for Type", "default method", "required method", "duck typing", "interface", "polymorphism"]
  }),
  createNode({
    id: "S107",
    title: "Modules, visibility, and Cargo",
    track: "syntax-basics",
    depthTarget: "D1",
    prerequisites: ["S100"],
    misconceptionTags: ["syn.mod_vs_crate_confusion", "syn.pub_visibility_confusion"],
    keywords: ["mod", "use", "pub", "pub(crate)", "super", "crate", "extern crate", "Cargo.toml", "dependencies", "workspace"]
  })
];

// ---------------------------------------------------------------------------
// Tier 1: Foundations — Ownership, Borrowing, Lifetimes
// Gate A200 behind S104 so learners have seen String before ownership.
// ---------------------------------------------------------------------------
const foundationsNodes = [
  createNode({
    id: "A200",
    title: "Ownership mental model",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: ["S104"],
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
    prerequisites: ["A200", "S103"],
    misconceptionTags: ["err.unwrap_panic_confusion", "err.question_mark_propagation"],
    keywords: ["result", "error", "unwrap", "question_mark", "ok", "err"]
  }),
  createNode({
    id: "A206",
    title: "Option and None patterns",
    track: "foundations",
    depthTarget: "D1",
    prerequisites: ["A200", "S103"],
    misconceptionTags: ["err.option_vs_result_confusion"],
    keywords: ["option", "none", "some", "if let", "match"]
  }),
  createNode({
    id: "A207",
    title: "Pattern matching and destructuring",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A206", "S103"],
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
  }),
  createNode({
    id: "A210",
    title: "Closures, ownership, and move capture",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A200", "S105"],
    misconceptionTags: ["clos.move_capture_confusion", "clos.fn_trait_bound_confusion"],
    keywords: ["closure", "move", "capture", "FnOnce", "FnMut", "Fn", "borrow in closure", "environment"]
  }),
  createNode({
    id: "A211",
    title: "Custom error types and error propagation",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A205", "S106"],
    misconceptionTags: ["err.from_impl_for_conversion", "err.question_mark_propagation"],
    keywords: ["custom error", "impl Error", "From", "thiserror", "anyhow", "error chain", "Box<dyn Error>"]
  })
];

// ---------------------------------------------------------------------------
// Tier 2: Collections, Iterators, Traits
// ---------------------------------------------------------------------------
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
    prerequisites: ["A200", "A202", "S106"],
    misconceptionTags: ["trait.dyn_size_unknown", "trait.object_safety_confusion"],
    keywords: ["dyn", "trait", "dynamic", "dispatch", "box", "vtable"]
  }),
  createNode({
    id: "A506",
    title: "Implementing Display and From traits",
    track: "collections",
    depthTarget: "D1",
    prerequisites: ["A205", "S106"],
    misconceptionTags: ["trait.from_into_direction_confusion"],
    keywords: ["display", "from", "into", "trait", "implement", "format"]
  }),
  createNode({
    id: "A507",
    title: "Implementing the Iterator trait",
    track: "collections",
    depthTarget: "D2",
    prerequisites: ["A503", "S106"],
    misconceptionTags: ["iter.next_return_type_confusion", "iter.associated_item_confusion"],
    keywords: ["Iterator", "next", "Item", "associated type", "impl Iterator", "custom iterator", "for loop protocol"]
  })
];

// ---------------------------------------------------------------------------
// Tier 2.5: Testing
// ---------------------------------------------------------------------------
const testingNodes = [
  createNode({
    id: "X100",
    title: "Unit and integration testing",
    track: "testing",
    depthTarget: "D1",
    prerequisites: ["S106", "A205"],
    misconceptionTags: ["test.cfg_test_confusion", "test.integration_test_mod_confusion"],
    keywords: ["#[test]", "#[cfg(test)]", "assert_eq!", "assert!", "should_panic", "integration test", "tests/", "test module"]
  }),
  createNode({
    id: "X101",
    title: "Test organization and mocking patterns",
    track: "testing",
    depthTarget: "D2",
    prerequisites: ["X100", "S106", "A210"],
    misconceptionTags: ["test.mock_trait_confusion", "test.test_isolation_confusion"],
    keywords: ["trait mock", "test double", "dependency injection", "test fixtures", "setup", "test helpers", "proptest"]
  })
];

// ---------------------------------------------------------------------------
// Tier 3: Async, Transfer Practice
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Tier 4: Smart Pointers
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Tier 5: Concurrency (OS threads)
// ---------------------------------------------------------------------------
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
    prerequisites: ["C100", "A210"],
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

// ---------------------------------------------------------------------------
// Tier 6: Macros
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Tier 7: Generics
// ---------------------------------------------------------------------------
const genericsNodes = [
  createNode({
    id: "G100",
    title: "Generic type parameters in functions and structs",
    track: "generics",
    depthTarget: "D2",
    prerequisites: ["A200", "A209", "S106"],
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
  ...syntaxBasicsNodes,
  ...foundationsNodes,
  ...collectionsNodes,
  ...testingNodes,
  ...asyncNodes,
  ...smartPointerNodes,
  ...concurrencyNodes,
  ...macroNodes,
  ...genericsNodes
];

const tracks = {
  "syntax-basics": {
    id: "syntax-basics",
    title: "Rust Syntax Basics",
    nodeIds: syntaxBasicsNodes.map((n) => n.id)
  },
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
  testing: {
    id: "testing",
    title: "Testing",
    nodeIds: testingNodes.map((n) => n.id)
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
