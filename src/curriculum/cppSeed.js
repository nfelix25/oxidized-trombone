import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// Track: Language Foundations (CF01–CF10)
// Entry point for the entire C++ curriculum. CF01 has no prerequisites.
// ---------------------------------------------------------------------------
const foundationsNodes = [
  createNode({
    id: "CF01",
    title: "Variables, types, and type inference with auto",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D1",
    prerequisites: [],
    keywords: ["auto", "type deduction", "int", "double", "bool", "char", "variable declaration", "initialization", "const"],
    misconceptionTags: ["cpp.auto_always_deduces_reference", "cpp.auto_removes_const_qualifiers"]
  }),
  createNode({
    id: "CF02",
    title: "Integer types, floating point, bool, and char",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D1",
    prerequisites: ["CF01"],
    keywords: ["int", "long", "unsigned", "float", "double", "bool", "char", "integral promotion", "overflow", "narrowing"],
    misconceptionTags: ["cpp.signed_overflow_is_undefined", "cpp.float_comparison_exact", "cpp.char_signedness_platform"]
  }),
  createNode({
    id: "CF03",
    title: "Functions: parameters, return types, and overloading",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D1",
    prerequisites: ["CF01"],
    keywords: ["void", "return", "function overloading", "default arguments", "function declaration", "function definition", "parameter", "call site"],
    misconceptionTags: ["cpp.overloading_on_return_type", "cpp.default_args_must_be_trailing", "cpp.overload_resolution_ambiguity"]
  }),
  createNode({
    id: "CF04",
    title: "References: lvalue refs, const refs, and reference semantics",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D1",
    prerequisites: ["CF03"],
    keywords: ["lvalue reference", "const &", "reference semantics", "alias", "pass by reference", "rebinding", "dangling reference"],
    misconceptionTags: ["cpp.reference_is_like_pointer", "cpp.const_ref_extends_lifetime", "cpp.references_can_be_rebound"]
  }),
  createNode({
    id: "CF05",
    title: "Control flow: if, switch, while, for, and range-for",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D1",
    prerequisites: ["CF02", "CF03"],
    keywords: ["if", "else", "switch", "while", "for", "range-based for", "break", "continue", "do-while", "fallthrough"],
    misconceptionTags: ["cpp.switch_fallthrough_implicit", "cpp.range_for_copies_by_default", "cpp.if_initializer_scope"]
  }),
  createNode({
    id: "CF06",
    title: "Namespaces, using declarations, and argument-dependent lookup",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D2",
    prerequisites: ["CF03"],
    keywords: ["namespace", "using", "ADL", "Koenig lookup", "using namespace", "nested namespace", "inline namespace", "name collision"],
    misconceptionTags: ["cpp.using_namespace_in_headers", "cpp.adl_bypasses_explicit_qualification", "cpp.namespace_alias_confusion"]
  }),
  createNode({
    id: "CF07",
    title: "Structs and classes: member variables and member functions",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D1",
    prerequisites: ["CF03"],
    keywords: ["struct", "class", "access specifiers", "public", "private", "member function", "member variable", "this pointer", "encapsulation"],
    misconceptionTags: ["cpp.struct_vs_class_only_default_access", "cpp.this_is_pointer_not_reference", "cpp.member_function_needs_object"]
  }),
  createNode({
    id: "CF08",
    title: "Enums and enum class: scoped vs unscoped enumerations",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D1",
    prerequisites: ["CF07"],
    keywords: ["enum", "enum class", "scoped enum", "unscoped enum", "underlying type", "enumerator", "implicit conversion", "switch on enum"],
    misconceptionTags: ["cpp.enum_class_no_implicit_int_conversion", "cpp.unscoped_enum_pollutes_namespace", "cpp.enum_underlying_type_default"]
  }),
  createNode({
    id: "CF09",
    title: "const and constexpr: compile-time constants and functions",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D2",
    prerequisites: ["CF07"],
    keywords: ["const", "constexpr", "constant expression", "compile-time", "runtime const", "const member function", "mutable"],
    misconceptionTags: ["cpp.constexpr_always_evaluated_at_compile_time", "cpp.const_member_function_prevents_all_mutation", "cpp.constexpr_implies_const"]
  }),
  createNode({
    id: "CF10",
    title: "Initialization: braced-init, default member init, and aggregate init",
    language: "cpp",
    track: "cpp-foundations",
    depthTarget: "D2",
    prerequisites: ["CF07"],
    keywords: ["braced init", "uniform initialization", "aggregate initialization", "default member initializer", "value initialization", "zero initialization", "narrowing conversion"],
    misconceptionTags: ["cpp.braced_init_prevents_narrowing", "cpp.aggregate_init_requires_no_constructors", "cpp.default_member_init_overrides_constructor"]
  })
];

// ---------------------------------------------------------------------------
// Track: Classes and Polymorphism (CP01–CP09)
// ---------------------------------------------------------------------------
const classesNodes = [
  createNode({
    id: "CP01",
    title: "Constructors: default, parameterized, copy, and delegating",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CF07"],
    keywords: ["default constructor", "parameterized constructor", "copy constructor", "delegating constructor", "explicit", "initializer list", "constructor chaining"],
    misconceptionTags: ["cpp.explicit_prevents_only_implicit_copy_init", "cpp.initializer_list_order_is_declaration_order", "cpp.delegating_ctor_no_double_init"]
  }),
  createNode({
    id: "CP02",
    title: "Destructors and RAII: deterministic cleanup and resource ownership",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CP01"],
    keywords: ["destructor", "RAII", "scope-bound resource", "deterministic cleanup", "Rule of Three", "resource ownership", "stack unwinding"],
    misconceptionTags: ["cpp.destructor_called_on_scope_exit", "cpp.raii_prevents_leaks_not_deadlocks", "cpp.destructor_exception_terminates"]
  }),
  createNode({
    id: "CP03",
    title: "Copy semantics: copy constructor and copy assignment operator",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CP01"],
    keywords: ["copy constructor", "copy assignment", "operator=", "copy-and-swap", "deep copy", "shallow copy", "self-assignment", "Rule of Three"],
    misconceptionTags: ["cpp.default_copy_is_shallow", "cpp.self_assignment_must_be_guarded", "cpp.copy_and_swap_exception_safety"]
  }),
  createNode({
    id: "CP04",
    title: "Inheritance: public, protected, and private base classes",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CP01"],
    keywords: ["inheritance", "public", "protected", "private", "derived class", "base class", "is-a relationship", "access control", "constructor chaining"],
    misconceptionTags: ["cpp.private_inheritance_not_is_a", "cpp.protected_accessible_in_derived", "cpp.base_constructor_called_implicitly"]
  }),
  createNode({
    id: "CP05",
    title: "Virtual functions and dynamic dispatch",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CP04"],
    keywords: ["virtual", "vtable", "dynamic dispatch", "override", "final", "polymorphism", "base pointer", "virtual function table", "runtime dispatch"],
    misconceptionTags: ["cpp.virtual_dispatch_needs_pointer_or_ref", "cpp.override_keyword_is_optional_but_recommended", "cpp.vtable_overhead_per_object"]
  }),
  createNode({
    id: "CP06",
    title: "Abstract classes and pure virtual functions",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CP05"],
    keywords: ["abstract class", "pure virtual", "= 0", "interface", "concrete class", "instantiation", "override", "abstract base class"],
    misconceptionTags: ["cpp.abstract_class_cannot_be_instantiated", "cpp.pure_virtual_can_have_body", "cpp.derived_must_implement_all_pure_virtual"]
  }),
  createNode({
    id: "CP07",
    title: "Virtual destructors and the diamond problem",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D3",
    prerequisites: ["CP05", "CP04"],
    keywords: ["virtual destructor", "object slicing", "diamond problem", "virtual inheritance", "multiple inheritance", "dominance rule", "virtual base class"],
    misconceptionTags: ["cpp.missing_virtual_destructor_is_ub", "cpp.diamond_problem_needs_virtual_inheritance", "cpp.object_slicing_from_value_semantics"]
  }),
  createNode({
    id: "CP08",
    title: "Operator overloading: arithmetic, comparison, and stream operators",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CP03"],
    keywords: ["operator+", "operator==", "operator<<", "operator>>", "operator overloading", "member operator", "non-member operator", "comparison", "spaceship operator"],
    misconceptionTags: ["cpp.operator_overload_changes_precedence", "cpp.stream_operator_should_be_non_member", "cpp.spaceship_operator_auto_generates_comparisons"]
  }),
  createNode({
    id: "CP09",
    title: "friend functions and friend classes",
    language: "cpp",
    track: "cpp-classes",
    depthTarget: "D2",
    prerequisites: ["CP01"],
    keywords: ["friend", "friend function", "friend class", "access control", "encapsulation", "non-member access", "hidden friend idiom"],
    misconceptionTags: ["cpp.friend_is_not_inherited", "cpp.friend_breaks_encapsulation_selectively", "cpp.hidden_friend_enables_adl"]
  })
];

// ---------------------------------------------------------------------------
// Track: Memory Management (CM01–CM08)
// ---------------------------------------------------------------------------
const memoryNodes = [
  createNode({
    id: "CM01",
    title: "Pointers: address-of, dereference, nullptr, and pointer arithmetic",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D2",
    prerequisites: ["CF04"],
    keywords: ["*", "&", "nullptr", "pointer arithmetic", "->", "dereference", "address-of", "void*", "pointer decay", "dangling pointer"],
    misconceptionTags: ["cpp.nullptr_is_not_zero", "cpp.pointer_arithmetic_is_typed", "cpp.dangling_pointer_is_ub"]
  }),
  createNode({
    id: "CM02",
    title: "new and delete: heap allocation and manual ownership",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D2",
    prerequisites: ["CM01"],
    keywords: ["new", "delete", "new[]", "delete[]", "heap", "ownership", "memory leak", "double free", "malloc", "free"],
    misconceptionTags: ["cpp.delete_vs_delete_array", "cpp.new_throws_bad_alloc", "cpp.memory_leak_is_not_ub"]
  }),
  createNode({
    id: "CM03",
    title: "std::unique_ptr: exclusive ownership and move-only semantics",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D2",
    prerequisites: ["CM02", "CP02"],
    keywords: ["unique_ptr", "make_unique", "release", "reset", "get", "move-only", "exclusive ownership", "RAII", "custom deleter"],
    misconceptionTags: ["cpp.unique_ptr_not_copyable", "cpp.get_does_not_transfer_ownership", "cpp.make_unique_preferred_over_new"]
  }),
  createNode({
    id: "CM04",
    title: "std::shared_ptr and std::weak_ptr: shared ownership and cycles",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D2",
    prerequisites: ["CM03"],
    keywords: ["shared_ptr", "make_shared", "weak_ptr", "lock", "expired", "reference count", "control block", "cycle", "use_count"],
    misconceptionTags: ["cpp.shared_ptr_cycle_causes_leak", "cpp.weak_ptr_requires_lock_to_use", "cpp.make_shared_is_single_allocation"]
  }),
  createNode({
    id: "CM05",
    title: "Stack vs heap: memory layout, lifetimes, and trade-offs",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D2",
    prerequisites: ["CM02"],
    keywords: ["stack", "heap", "memory layout", "RAII lifetime", "stack overflow", "fragmentation", "locality", "allocation cost", "escape analysis"],
    misconceptionTags: ["cpp.stack_is_always_faster_than_heap", "cpp.heap_objects_live_forever", "cpp.stack_size_is_unlimited"]
  }),
  createNode({
    id: "CM06",
    title: "std::allocator and custom allocators",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D3",
    prerequisites: ["CM02", "CS01"],
    keywords: ["std::allocator", "allocate", "deallocate", "construct", "destroy", "allocator-aware", "rebind", "pmr", "pool allocator"],
    misconceptionTags: ["cpp.allocator_replaces_new_delete_globally", "cpp.pmr_allocators_not_composable", "cpp.custom_allocator_requires_rebind"]
  }),
  createNode({
    id: "CM07",
    title: "Placement new and manual object construction",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D3",
    prerequisites: ["CM02"],
    keywords: ["placement new", "in-place construction", "aligned storage", "std::launder", "object lifetime", "manual destructor call", "aligned_storage"],
    misconceptionTags: ["cpp.placement_new_does_not_allocate", "cpp.must_call_destructor_explicitly_with_placement_new", "cpp.launder_needed_after_placement_new"]
  }),
  createNode({
    id: "CM08",
    title: "Memory debugging: valgrind, AddressSanitizer, and UBSanitizer",
    language: "cpp",
    track: "cpp-memory",
    depthTarget: "D2",
    prerequisites: ["CM02"],
    keywords: ["valgrind", "AddressSanitizer", "-fsanitize=address", "UBSanitizer", "memory error", "leak detection", "undefined behavior", "sanitizer flags", "heap profiling"],
    misconceptionTags: ["cpp.valgrind_catches_all_ub", "cpp.sanitizers_have_no_runtime_cost", "cpp.asan_and_valgrind_can_run_together"]
  })
];

// ---------------------------------------------------------------------------
// Track: Move Semantics and Value Categories (CV01–CV07)
// ---------------------------------------------------------------------------
const moveNodes = [
  createNode({
    id: "CV01",
    title: "Value categories: lvalue, rvalue, xvalue, and prvalue",
    language: "cpp",
    track: "cpp-move-semantics",
    depthTarget: "D2",
    prerequisites: ["CF04", "CP03"],
    keywords: ["lvalue", "rvalue", "xvalue", "prvalue", "glvalue", "value category", "expression category", "identity", "movability"],
    misconceptionTags: ["cpp.rvalue_is_temporary_always", "cpp.named_rvalue_ref_is_lvalue", "cpp.xvalue_is_expiring_value"]
  }),
  createNode({
    id: "CV02",
    title: "Move constructors and move assignment operator",
    language: "cpp",
    track: "cpp-move-semantics",
    depthTarget: "D2",
    prerequisites: ["CV01", "CP03"],
    keywords: ["move constructor", "move assignment", "&&", "rvalue reference", "std::move", "transfer of ownership", "move semantics", "Rule of Five"],
    misconceptionTags: ["cpp.moved_from_object_is_valid_but_unspecified", "cpp.move_constructor_is_not_always_generated", "cpp.move_assignment_should_handle_self"]
  }),
  createNode({
    id: "CV03",
    title: "std::move and std::forward: casting value categories",
    language: "cpp",
    track: "cpp-move-semantics",
    depthTarget: "D2",
    prerequisites: ["CV02"],
    keywords: ["std::move", "std::forward", "cast to rvalue", "forwarding reference", "universal reference", "T&&", "value category cast"],
    misconceptionTags: ["cpp.std_move_does_not_actually_move", "cpp.std_forward_only_in_templates", "cpp.move_on_return_prevents_nrvo"]
  }),
  createNode({
    id: "CV04",
    title: "Perfect forwarding and universal references",
    language: "cpp",
    track: "cpp-move-semantics",
    depthTarget: "D3",
    prerequisites: ["CV03", "CT01"],
    keywords: ["perfect forwarding", "universal reference", "forwarding reference", "T&&", "std::forward", "reference collapsing", "argument preservation"],
    misconceptionTags: ["cpp.universal_ref_only_in_deduced_context", "cpp.reference_collapsing_rules", "cpp.forward_without_template_is_wrong"]
  }),
  createNode({
    id: "CV05",
    title: "Return value optimization: RVO, NRVO, and mandatory elision",
    language: "cpp",
    track: "cpp-move-semantics",
    depthTarget: "D2",
    prerequisites: ["CV02"],
    keywords: ["RVO", "NRVO", "copy elision", "mandatory elision", "prvalue materialization", "guaranteed copy elision", "C++17 elision"],
    misconceptionTags: ["cpp.rvo_and_nrvo_same_guarantee", "cpp.move_on_return_disables_nrvo", "cpp.guaranteed_elision_since_cpp17"]
  }),
  createNode({
    id: "CV06",
    title: "noexcept: exception guarantees and move optimization",
    language: "cpp",
    track: "cpp-move-semantics",
    depthTarget: "D2",
    prerequisites: ["CV02", "CE01"],
    keywords: ["noexcept", "exception specification", "noexcept(noexcept(...))", "move_if_noexcept", "strong exception safety", "vector reallocation", "conditional noexcept"],
    misconceptionTags: ["cpp.noexcept_prevents_all_exceptions", "cpp.vector_uses_move_only_if_noexcept", "cpp.noexcept_violation_calls_terminate"]
  }),
  createNode({
    id: "CV07",
    title: "Rule of 0/3/5: choosing the right set of special members",
    language: "cpp",
    track: "cpp-move-semantics",
    depthTarget: "D2",
    prerequisites: ["CV02", "CP02"],
    keywords: ["Rule of Three", "Rule of Five", "Rule of Zero", "special member functions", "default", "delete", "compiler-generated", "= default", "= delete"],
    misconceptionTags: ["cpp.rule_of_five_always_needed_with_destructor", "cpp.rule_of_zero_preferred_when_possible", "cpp.deleting_copy_suppresses_move"]
  })
];

// ---------------------------------------------------------------------------
// Track: STL Containers and Algorithms (CS01–CS09)
// ---------------------------------------------------------------------------
const stlNodes = [
  createNode({
    id: "CS01",
    title: "std::vector: dynamic arrays, capacity, and iterator invalidation",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D1",
    prerequisites: ["CM01"],
    keywords: ["vector", "push_back", "emplace_back", "reserve", "shrink_to_fit", "begin", "end", "iterator invalidation", "capacity", "size"],
    misconceptionTags: ["cpp.push_back_vs_emplace_back", "cpp.reserve_does_not_change_size", "cpp.reallocation_invalidates_all_iterators"]
  }),
  createNode({
    id: "CS02",
    title: "std::array: fixed-size stack arrays and aggregate initialization",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D1",
    prerequisites: ["CF05"],
    keywords: ["array", "fill", "std::array", "fixed-size", "stack allocation", "aggregate initialization", "at()", "get<>", "tuple-like"],
    misconceptionTags: ["cpp.std_array_is_not_c_array", "cpp.array_size_is_compile_time", "cpp.array_bounds_checking_with_at"]
  }),
  createNode({
    id: "CS03",
    title: "std::string and std::string_view: text handling and ownership",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D2",
    prerequisites: ["CS01"],
    keywords: ["std::string", "substr", "find", "c_str", "string_view", "non-owning view", "SSO", "string concatenation", "npos"],
    misconceptionTags: ["cpp.string_view_dangling_if_string_destroyed", "cpp.sso_avoids_heap_for_short_strings", "cpp.c_str_valid_until_modification"]
  }),
  createNode({
    id: "CS04",
    title: "std::map and std::set: balanced BST and ordered associative containers",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D2",
    prerequisites: ["CS01", "CM01"],
    keywords: ["map", "set", "lower_bound", "upper_bound", "balanced BST", "ordered", "comparator", "multimap", "multiset", "tree traversal"],
    misconceptionTags: ["cpp.map_insertion_invalidates_no_iterators", "cpp.set_elements_are_immutable", "cpp.map_operator_bracket_inserts_default"]
  }),
  createNode({
    id: "CS05",
    title: "std::unordered_map and std::unordered_set: hash table containers",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D2",
    prerequisites: ["CS04"],
    keywords: ["unordered_map", "unordered_set", "hash function", "bucket_count", "load_factor", "rehash", "std::hash", "collision", "custom hasher"],
    misconceptionTags: ["cpp.unordered_map_not_sorted", "cpp.hash_collision_degrades_to_linear", "cpp.custom_hash_requires_specialization"]
  }),
  createNode({
    id: "CS06",
    title: "std::list, std::deque, std::queue, and std::stack: sequence adapters",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D2",
    prerequisites: ["CS01"],
    keywords: ["list", "deque", "queue", "stack", "push", "pop", "front", "back", "splice", "doubly-linked", "container adapter"],
    misconceptionTags: ["cpp.list_iteration_is_cache_unfriendly", "cpp.deque_has_stable_front_insertion", "cpp.stack_and_queue_are_adapters_not_containers"]
  }),
  createNode({
    id: "CS07",
    title: "STL algorithms: sort, find, transform, accumulate, and predicates",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D2",
    prerequisites: ["CS01", "CT01"],
    keywords: ["sort", "find_if", "transform", "accumulate", "copy", "count_if", "predicate", "lambda", "algorithm", "range"],
    misconceptionTags: ["cpp.sort_requires_random_access_iterators", "cpp.transform_does_not_filter", "cpp.accumulate_is_left_fold"]
  }),
  createNode({
    id: "CS08",
    title: "Iterators: categories, adapters, and std::back_inserter",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D2",
    prerequisites: ["CS07"],
    keywords: ["iterator category", "input", "output", "forward", "bidirectional", "random-access", "back_inserter", "istream_iterator", "iterator adapter", "reverse_iterator"],
    misconceptionTags: ["cpp.all_iterators_support_random_access", "cpp.back_inserter_requires_push_back", "cpp.iterator_invalidation_per_container"]
  }),
  createNode({
    id: "CS09",
    title: "std::span and ranges (C++20): non-owning views and composable pipelines",
    language: "cpp",
    track: "cpp-stl",
    depthTarget: "D2",
    prerequisites: ["CS08", "CK01"],
    keywords: ["span", "ranges", "views::filter", "views::transform", "lazy evaluation", "non-owning view", "range pipeline", "views::take", "views::drop"],
    misconceptionTags: ["cpp.span_is_not_vector", "cpp.range_views_are_lazy_not_eager", "cpp.span_dangling_if_data_destroyed"]
  })
];

// ---------------------------------------------------------------------------
// Track: Templates (CT01–CT08)
// ---------------------------------------------------------------------------
const templatesNodes = [
  createNode({
    id: "CT01",
    title: "Function templates: syntax, instantiation, and deduction",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D2",
    prerequisites: ["CF03"],
    keywords: ["template<typename T>", "template parameter", "type deduction", "typename", "instantiation", "explicit instantiation", "function template", "deduction guide"],
    misconceptionTags: ["cpp.template_instantiated_per_translation_unit", "cpp.deduction_fails_without_argument", "cpp.typename_vs_class_in_templates"]
  }),
  createNode({
    id: "CT02",
    title: "Class templates: member functions and explicit instantiation",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D2",
    prerequisites: ["CT01", "CF07"],
    keywords: ["class template", "member template", "explicit instantiation", "template argument", "template member function", "class template deduction", "CTAD"],
    misconceptionTags: ["cpp.class_template_member_defined_outside_inline", "cpp.ctad_requires_deduction_guides", "cpp.explicit_instantiation_prevents_multiple_definitions"]
  }),
  createNode({
    id: "CT03",
    title: "Template specialization: full and partial specialization",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D3",
    prerequisites: ["CT02"],
    keywords: ["template<>", "full specialization", "partial specialization", "primary template", "specialization selection", "explicit specialization"],
    misconceptionTags: ["cpp.function_templates_no_partial_specialization", "cpp.specialization_must_match_primary", "cpp.partial_spec_more_specific_wins"]
  }),
  createNode({
    id: "CT04",
    title: "Variadic templates and parameter packs",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D3",
    prerequisites: ["CT01", "CF05"],
    keywords: ["variadic template", "sizeof...", "parameter pack", "pack expansion", "fold expression", "recursive template", "tuple", "args..."],
    misconceptionTags: ["cpp.variadic_template_is_not_variadic_function", "cpp.fold_expression_requires_cpp17", "cpp.pack_expansion_context_rules"]
  }),
  createNode({
    id: "CT05",
    title: "SFINAE and enable_if: conditional template selection",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D3",
    prerequisites: ["CT01"],
    keywords: ["SFINAE", "enable_if", "enable_if_t", "substitution failure", "overload resolution", "type constraint", "decltype", "void_t"],
    misconceptionTags: ["cpp.sfinae_is_not_a_compile_error", "cpp.enable_if_in_return_type_vs_parameter", "cpp.sfinae_applies_only_in_immediate_context"]
  }),
  createNode({
    id: "CT06",
    title: "Template template parameters and policy-based design",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D3",
    prerequisites: ["CT02"],
    keywords: ["template template", "policy class", "policy-based design", "template parameter template", "mixin", "compile-time configuration", "allocator policy"],
    misconceptionTags: ["cpp.template_template_param_syntax", "cpp.policy_class_zero_runtime_cost", "cpp.mixing_policies_requires_care"]
  }),
  createNode({
    id: "CT07",
    title: "Concepts (C++20): requires clauses and named concepts",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D2",
    prerequisites: ["CT01"],
    keywords: ["requires", "concept", "concept C =", "std::same_as", "std::integral", "requires clause", "requires expression", "constraint", "subsumption"],
    misconceptionTags: ["cpp.concepts_replace_sfinae_always", "cpp.requires_clause_vs_requires_expression", "cpp.concept_subsumption_ordering"]
  }),
  createNode({
    id: "CT08",
    title: "std::type_traits: is_same, is_integral, conditional, and void_t",
    language: "cpp",
    track: "cpp-templates",
    depthTarget: "D2",
    prerequisites: ["CT01"],
    keywords: ["type_traits", "is_same_v", "is_integral_v", "conditional_t", "void_t", "remove_cv", "add_pointer", "decay_t", "enable_if"],
    misconceptionTags: ["cpp.type_traits_evaluated_at_compile_time", "cpp.void_t_enables_detection_idiom", "cpp.conditional_t_vs_if_constexpr"]
  })
];

// ---------------------------------------------------------------------------
// Track: Compile-time Programming (CK01–CK07)
// ---------------------------------------------------------------------------
const constexprNodes = [
  createNode({
    id: "CK01",
    title: "constexpr functions and variables: guaranteed compile-time evaluation",
    language: "cpp",
    track: "cpp-constexpr",
    depthTarget: "D2",
    prerequisites: ["CF09"],
    keywords: ["constexpr", "constant expression", "compile-time evaluation", "constexpr function", "constexpr variable", "literal type", "core constant expression"],
    misconceptionTags: ["cpp.constexpr_function_always_compile_time", "cpp.constexpr_implies_inline", "cpp.constexpr_can_be_runtime_too"]
  }),
  createNode({
    id: "CK02",
    title: "consteval and constinit: immediate functions and static initialization",
    language: "cpp",
    track: "cpp-constexpr",
    depthTarget: "D2",
    prerequisites: ["CK01"],
    keywords: ["consteval", "immediate function", "constinit", "static initialization", "static init order fiasco", "guaranteed constant init", "consteval if"],
    misconceptionTags: ["cpp.consteval_stronger_than_constexpr", "cpp.constinit_implies_const", "cpp.static_init_order_fiasco_solution"]
  }),
  createNode({
    id: "CK03",
    title: "if constexpr: compile-time conditional code selection",
    language: "cpp",
    track: "cpp-constexpr",
    depthTarget: "D2",
    prerequisites: ["CK01", "CT01"],
    keywords: ["if constexpr", "compile-time branch", "dead code elimination", "discarded statement", "template specialization alternative", "type dispatch"],
    misconceptionTags: ["cpp.if_constexpr_discards_not_compiles", "cpp.if_constexpr_requires_template_context", "cpp.if_constexpr_vs_normal_if"]
  }),
  createNode({
    id: "CK04",
    title: "static_assert: compile-time precondition checks",
    language: "cpp",
    track: "cpp-constexpr",
    depthTarget: "D2",
    prerequisites: ["CK01"],
    keywords: ["static_assert", "compile-time assertion", "constant expression bool", "diagnostic message", "type constraint check", "template constraint"],
    misconceptionTags: ["cpp.static_assert_vs_assert", "cpp.static_assert_message_is_optional_cpp17", "cpp.static_assert_only_in_templates"]
  }),
  createNode({
    id: "CK05",
    title: "std::integral_constant and type lists",
    language: "cpp",
    track: "cpp-constexpr",
    depthTarget: "D3",
    prerequisites: ["CT08", "CK01"],
    keywords: ["integral_constant", "true_type", "false_type", "type list", "Cons<H,T>", "type manipulation", "compile-time value", "type sequence"],
    misconceptionTags: ["cpp.integral_constant_value_is_constexpr", "cpp.type_list_is_not_std_tuple", "cpp.true_type_and_false_type_for_dispatch"]
  }),
  createNode({
    id: "CK06",
    title: "Template metaprogramming: recursive templates and type computation",
    language: "cpp",
    track: "cpp-constexpr",
    depthTarget: "D3",
    prerequisites: ["CK05", "CT04"],
    keywords: ["template recursion", "TMP", "type computation", "compile-time algorithm", "factorial template", "fibonacci template", "type-level programming"],
    misconceptionTags: ["cpp.tmp_is_turing_complete", "cpp.tmp_replaced_by_constexpr_mostly", "cpp.recursive_template_instantiation_limit"]
  }),
  createNode({
    id: "CK07",
    title: "Reflection preview (C++26) and __builtin intrinsics",
    language: "cpp",
    track: "cpp-constexpr",
    depthTarget: "D3",
    prerequisites: ["CK03"],
    keywords: ["reflection", "std::meta", "__builtin_clz", "__builtin_popcount", "C++26 preview", "static reflection", "intrinsics", "compile-time metadata"],
    misconceptionTags: ["cpp.reflection_available_in_cpp20", "cpp.builtins_are_portable", "cpp.reflection_replaces_type_traits"]
  })
];

// ---------------------------------------------------------------------------
// Track: Error Handling (CE01–CE06)
// ---------------------------------------------------------------------------
const errorNodes = [
  createNode({
    id: "CE01",
    title: "Exceptions: throw, try, catch, and exception types",
    language: "cpp",
    track: "cpp-error-handling",
    depthTarget: "D2",
    prerequisites: ["CF05"],
    keywords: ["throw", "try", "catch", "catch(...)", "exception object", "stack unwinding", "exception type", "exception safety", "rethrow"],
    misconceptionTags: ["cpp.exceptions_always_have_overhead", "cpp.catch_by_value_slices", "cpp.catch_all_hides_errors"]
  }),
  createNode({
    id: "CE02",
    title: "Exception specifications: noexcept and std::terminate",
    language: "cpp",
    track: "cpp-error-handling",
    depthTarget: "D2",
    prerequisites: ["CE01"],
    keywords: ["noexcept", "std::terminate", "noexcept(expr)", "exception specification", "throw()", "destructor noexcept", "unexpected"],
    misconceptionTags: ["cpp.noexcept_catches_exceptions", "cpp.std_terminate_is_catchable", "cpp.noexcept_spec_is_checked_at_runtime"]
  }),
  createNode({
    id: "CE03",
    title: "Custom exception classes: inheriting from std::exception",
    language: "cpp",
    track: "cpp-error-handling",
    depthTarget: "D2",
    prerequisites: ["CE01", "CP04"],
    keywords: ["std::exception", "what()", "std::runtime_error", "std::logic_error", "exception hierarchy", "custom exception", "virtual what", "inheritance chain"],
    misconceptionTags: ["cpp.custom_exception_must_inherit_std_exception", "cpp.what_returns_c_string", "cpp.exception_hierarchy_catches_base"]
  }),
  createNode({
    id: "CE04",
    title: "RAII and exception safety: basic, strong, and no-throw guarantees",
    language: "cpp",
    track: "cpp-error-handling",
    depthTarget: "D2",
    prerequisites: ["CE01", "CP02"],
    keywords: ["basic exception safety", "strong exception safety", "no-throw guarantee", "exception-safe swap", "RAII", "commit-or-rollback", "transaction"],
    misconceptionTags: ["cpp.exception_safe_code_is_slow", "cpp.strong_guarantee_always_achievable", "cpp.noexcept_functions_provide_strong_guarantee"]
  }),
  createNode({
    id: "CE05",
    title: "std::optional: representing optional values without null pointers",
    language: "cpp",
    track: "cpp-error-handling",
    depthTarget: "D2",
    prerequisites: ["CF07"],
    keywords: ["std::optional", "std::nullopt", "has_value()", "value()", "value_or()", "in-place construction", "optional reference", "monadic optional"],
    misconceptionTags: ["cpp.optional_value_throws_bad_optional_access", "cpp.optional_reference_is_not_standard", "cpp.optional_is_not_pointer"]
  }),
  createNode({
    id: "CE06",
    title: "std::expected (C++23): error-or-value result type",
    language: "cpp",
    track: "cpp-error-handling",
    depthTarget: "D2",
    prerequisites: ["CE05"],
    keywords: ["std::expected", "std::unexpected", "error()", "monadic operations", "and_then", "or_else", "transform", "result type", "C++23"],
    misconceptionTags: ["cpp.expected_replaces_exceptions_always", "cpp.unexpected_wraps_any_error_type", "cpp.expected_monadic_ops_require_cpp23"]
  })
];

// ---------------------------------------------------------------------------
// Track: Operators and Type Conversions (CO01–CO05)
// ---------------------------------------------------------------------------
const conversionsNodes = [
  createNode({
    id: "CO01",
    title: "Implicit conversions and the standard conversion sequence",
    language: "cpp",
    track: "cpp-conversions",
    depthTarget: "D2",
    prerequisites: ["CF02", "CP01"],
    keywords: ["implicit conversion", "integral promotion", "floating-point conversion", "user-defined conversion", "overload resolution", "conversion sequence", "narrowing"],
    misconceptionTags: ["cpp.implicit_conversion_always_safe", "cpp.conversion_sequence_single_user_defined", "cpp.integral_promotion_preserves_value"]
  }),
  createNode({
    id: "CO02",
    title: "explicit constructors and conversion operators",
    language: "cpp",
    track: "cpp-conversions",
    depthTarget: "D2",
    prerequisites: ["CP01", "CO01"],
    keywords: ["explicit", "conversion operator", "operator int()", "explicit conversion", "direct initialization", "copy initialization", "explicit cast"],
    misconceptionTags: ["cpp.explicit_prevents_all_conversions", "cpp.conversion_operator_vs_constructor", "cpp.explicit_on_conversion_operator_cpp11"]
  }),
  createNode({
    id: "CO03",
    title: "The four casts: static_cast, dynamic_cast, reinterpret_cast, const_cast",
    language: "cpp",
    track: "cpp-conversions",
    depthTarget: "D2",
    prerequisites: ["CO01", "CP05"],
    keywords: ["static_cast", "dynamic_cast", "reinterpret_cast", "const_cast", "RTTI", "downcasting", "typeid", "safe downcast", "undefined behavior"],
    misconceptionTags: ["cpp.dynamic_cast_needs_virtual_function", "cpp.reinterpret_cast_is_always_ub", "cpp.const_cast_removes_const_safely"]
  }),
  createNode({
    id: "CO04",
    title: "Structured bindings (C++17): decomposing tuples, pairs, and structs",
    language: "cpp",
    track: "cpp-conversions",
    depthTarget: "D2",
    prerequisites: ["CF07"],
    keywords: ["structured binding", "auto [a, b]", "std::tie", "tuple decomposition", "pair decomposition", "aggregate decomposition", "C++17", "binding declaration"],
    misconceptionTags: ["cpp.structured_binding_copies_aggregate", "cpp.binding_to_reference_needs_explicit", "cpp.structured_binding_works_with_arrays"]
  }),
  createNode({
    id: "CO05",
    title: "std::variant and std::visit: type-safe tagged union",
    language: "cpp",
    track: "cpp-conversions",
    depthTarget: "D2",
    prerequisites: ["CT02", "CE05"],
    keywords: ["std::variant", "std::get<>", "std::visit", "std::monostate", "overloaded visitor", "tagged union", "holds_alternative", "valueless_by_exception"],
    misconceptionTags: ["cpp.variant_can_hold_references", "cpp.std_visit_requires_all_alternatives_handled", "cpp.variant_valueless_is_exceptional"]
  })
];

// ---------------------------------------------------------------------------
// Track: Concurrency (CC01–CC08)
// ---------------------------------------------------------------------------
const concurrencyNodes = [
  createNode({
    id: "CC01",
    title: "std::thread: spawn, join, detach, and thread lifecycle",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D2",
    prerequisites: ["CF03"],
    keywords: ["std::thread", "join", "detach", "get_id", "hardware_concurrency", "thread lifecycle", "joinable", "thread function", "lambda thread"],
    misconceptionTags: ["cpp.detached_thread_safe_to_ignore", "cpp.thread_destructor_calls_terminate_if_joinable", "cpp.hardware_concurrency_is_exact"]
  }),
  createNode({
    id: "CC02",
    title: "std::mutex, lock_guard, and unique_lock: exclusive access",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D2",
    prerequisites: ["CC01"],
    keywords: ["std::mutex", "lock_guard", "unique_lock", "try_lock", "scoped_lock", "deadlock avoidance", "RAII lock", "recursive_mutex", "timed_mutex"],
    misconceptionTags: ["cpp.lock_guard_is_not_recursive", "cpp.scoped_lock_for_multiple_mutexes", "cpp.mutex_is_not_reentrant"]
  }),
  createNode({
    id: "CC03",
    title: "std::condition_variable: wait, notify_one, and notify_all",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D3",
    prerequisites: ["CC02"],
    keywords: ["condition_variable", "wait", "notify_one", "notify_all", "spurious wakeup", "predicate", "wait_for", "wait_until", "producer-consumer"],
    misconceptionTags: ["cpp.condition_variable_no_spurious_wakeup", "cpp.notify_before_wait_is_fine", "cpp.condition_variable_requires_unique_lock"]
  }),
  createNode({
    id: "CC04",
    title: "std::atomic: operations, compare_exchange, and memory_order",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D3",
    prerequisites: ["CC01"],
    keywords: ["atomic", "load", "store", "fetch_add", "compare_exchange_strong", "memory_order", "relaxed", "acquire", "release", "seq_cst", "lock-free"],
    misconceptionTags: ["cpp.atomic_operations_are_always_seq_cst", "cpp.relaxed_ordering_allows_reordering", "cpp.compare_exchange_weak_may_fail_spuriously"]
  }),
  createNode({
    id: "CC05",
    title: "std::future and std::promise: asynchronous value passing",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D2",
    prerequisites: ["CC01"],
    keywords: ["future", "promise", "get_future", "set_value", "set_exception", "shared_future", "future::get", "packaged_task", "async channel"],
    misconceptionTags: ["cpp.future_get_blocks_until_ready", "cpp.promise_destroyed_before_set_value", "cpp.shared_future_safe_to_copy"]
  }),
  createNode({
    id: "CC06",
    title: "std::async and launch policies",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D2",
    prerequisites: ["CC05"],
    keywords: ["std::async", "launch::async", "launch::deferred", "future", "thread pool", "async task", "launch policy", "deferred execution"],
    misconceptionTags: ["cpp.async_always_creates_new_thread", "cpp.deferred_runs_on_get_call", "cpp.async_future_destructor_blocks"]
  }),
  createNode({
    id: "CC07",
    title: "Thread-safe data structures and RAII locking patterns",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D3",
    prerequisites: ["CC02", "CC03"],
    keywords: ["thread-safe queue", "RAII lock", "monitor pattern", "concurrent access", "lock hierarchy", "double-checked locking", "thread-safe singleton"],
    misconceptionTags: ["cpp.thread_safe_means_no_races", "cpp.double_checked_locking_safe_with_atomic", "cpp.lock_hierarchy_prevents_deadlock"]
  }),
  createNode({
    id: "CC08",
    title: "Coroutines (C++20): co_await, co_yield, and co_return",
    language: "cpp",
    track: "cpp-concurrency",
    depthTarget: "D3",
    prerequisites: ["CC05", "CK01"],
    keywords: ["co_await", "co_yield", "co_return", "coroutine handle", "promise type", "awaitable", "coroutine frame", "generator", "async generator"],
    misconceptionTags: ["cpp.coroutines_are_like_threads", "cpp.co_await_suspends_thread", "cpp.coroutine_promise_is_like_std_promise"]
  })
];

// ---------------------------------------------------------------------------
// Track: Streams and I/O (CW01–CW06)
// ---------------------------------------------------------------------------
const ioNodes = [
  createNode({
    id: "CW01",
    title: "std::iostream: cin, cout, cerr, clog, and stream operators",
    language: "cpp",
    track: "cpp-io",
    depthTarget: "D1",
    prerequisites: ["CF03"],
    keywords: ["std::cin", "std::cout", "std::cerr", "std::clog", "<<", ">>", "flush", "endl", "setw", "setprecision", "stream state"],
    misconceptionTags: ["cpp.endl_flushes_buffer", "cpp.cin_skips_whitespace_by_default", "cpp.cerr_is_unbuffered"]
  }),
  createNode({
    id: "CW02",
    title: "std::fstream: file read/write modes and stream state",
    language: "cpp",
    track: "cpp-io",
    depthTarget: "D2",
    prerequisites: ["CW01"],
    keywords: ["std::ifstream", "std::ofstream", "std::fstream", "open modes", "is_open", "eof", "fail", "clear", "getline", "file state"],
    misconceptionTags: ["cpp.fstream_closes_on_destruction", "cpp.eof_flag_set_after_failed_read", "cpp.mode_flags_are_bitmask"]
  }),
  createNode({
    id: "CW03",
    title: "std::stringstream: in-memory string buffering and parsing",
    language: "cpp",
    track: "cpp-io",
    depthTarget: "D2",
    prerequisites: ["CW01"],
    keywords: ["std::istringstream", "std::ostringstream", "str()", "in-memory buffer", "string parsing", "tokenizing", "round-trip conversion"],
    misconceptionTags: ["cpp.stringstream_str_returns_copy", "cpp.istringstream_not_resetable_without_str", "cpp.ostringstream_append_with_str_set"]
  }),
  createNode({
    id: "CW04",
    title: "std::format (C++20): type-safe string formatting",
    language: "cpp",
    track: "cpp-io",
    depthTarget: "D2",
    prerequisites: ["CW01"],
    keywords: ["std::format", "format string", "{}", "format specifiers", "type-safe", "std::print", "std::format_to", "format_string"],
    misconceptionTags: ["cpp.std_format_is_like_printf", "cpp.format_specifiers_same_as_python", "cpp.std_format_available_before_cpp20"]
  }),
  createNode({
    id: "CW05",
    title: "std::filesystem: path, directory_iterator, and file status",
    language: "cpp",
    track: "cpp-io",
    depthTarget: "D2",
    prerequisites: ["CW02", "CM03"],
    keywords: ["std::filesystem::path", "directory_iterator", "recursive_directory_iterator", "exists", "file_size", "status", "permissions", "create_directories"],
    misconceptionTags: ["cpp.filesystem_path_is_string", "cpp.directory_iterator_is_not_recursive", "cpp.filesystem_operations_throw_on_error"]
  }),
  createNode({
    id: "CW06",
    title: "Binary I/O: read(), write(), seekg(), and seekp()",
    language: "cpp",
    track: "cpp-io",
    depthTarget: "D2",
    prerequisites: ["CW02"],
    keywords: ["read()", "write()", "seekg", "seekp", "tellg", "tellp", "binary mode", "reinterpret_cast bytes", "structured binary", "ios::binary"],
    misconceptionTags: ["cpp.binary_mode_same_on_all_platforms", "cpp.seek_does_not_clear_eof", "cpp.read_returns_bytes_not_bool"]
  })
];

// ---------------------------------------------------------------------------
// Track: Build, Testing, and Tooling (CB01–CB07)
// ---------------------------------------------------------------------------
const buildNodes = [
  createNode({
    id: "CB01",
    title: "CMake basics: CMakeLists.txt, targets, and build types",
    language: "cpp",
    track: "cpp-build-tools",
    depthTarget: "D1",
    prerequisites: ["CF01"],
    keywords: ["CMakeLists.txt", "cmake_minimum_required", "project", "add_executable", "add_library", "target_include_directories", "target_compile_features", "cmake --build", "build type"],
    misconceptionTags: ["cpp.cmake_is_a_build_system", "cpp.out_of_source_build_is_optional", "cpp.cmake_build_type_case_sensitive"]
  }),
  createNode({
    id: "CB02",
    title: "Linking: static/shared libraries and target_link_libraries",
    language: "cpp",
    track: "cpp-build-tools",
    depthTarget: "D2",
    prerequisites: ["CB01"],
    keywords: ["target_link_libraries", "PRIVATE", "PUBLIC", "INTERFACE", "static library", "shared library", "link order", "transitive dependency", "find_package"],
    misconceptionTags: ["cpp.public_link_propagates_to_consumers", "cpp.static_lib_includes_all_symbols", "cpp.link_order_matters_for_static"]
  }),
  createNode({
    id: "CB03",
    title: "Compilation flags: warnings, sanitizers, and optimization levels",
    language: "cpp",
    track: "cpp-build-tools",
    depthTarget: "D2",
    prerequisites: ["CB01"],
    keywords: ["-Wall", "-Wextra", "-O2", "-O3", "-fsanitize=address", "-g", "-Werror", "optimization", "debug info", "compiler flags"],
    misconceptionTags: ["cpp.wall_enables_all_warnings", "cpp.o2_and_o3_always_faster", "cpp.sanitizers_work_with_all_optimizations"]
  }),
  createNode({
    id: "CB04",
    title: "Google Test and Catch2: test macros and test fixtures",
    language: "cpp",
    track: "cpp-build-tools",
    depthTarget: "D2",
    prerequisites: ["CF05"],
    keywords: ["gtest", "EXPECT_EQ", "ASSERT_TRUE", "test fixture", "SetUp", "TearDown", "TEST_F", "TEST", "Catch2", "REQUIRE", "CHECK"],
    misconceptionTags: ["cpp.assert_terminates_vs_expect_continues", "cpp.fixture_setup_called_per_test", "cpp.gtest_and_catch2_same_syntax"]
  }),
  createNode({
    id: "CB05",
    title: "Test parameterization and mock objects",
    language: "cpp",
    track: "cpp-build-tools",
    depthTarget: "D2",
    prerequisites: ["CB04"],
    keywords: ["INSTANTIATE_TEST_SUITE_P", "mock", "gmock", "EXPECT_CALL", "ON_CALL", "mock object", "dependency injection", "test double", "parameterized test"],
    misconceptionTags: ["cpp.mocks_replace_all_dependencies", "cpp.parameterized_tests_run_in_order", "cpp.gmock_requires_virtual_functions"]
  }),
  createNode({
    id: "CB06",
    title: "clang-format and clang-tidy: code style and static analysis",
    language: "cpp",
    track: "cpp-build-tools",
    depthTarget: "D1",
    prerequisites: ["CF01"],
    keywords: [".clang-format", ".clang-tidy", "static analysis", "code style", "linting", "modernize checks", "readability checks", "clang-tidy integration"],
    misconceptionTags: ["cpp.clang_format_fixes_bugs", "cpp.clang_tidy_is_only_for_style", "cpp.clang_format_config_is_universal"]
  }),
  createNode({
    id: "CB07",
    title: "Package managers: Conan, vcpkg, and CMake FetchContent",
    language: "cpp",
    track: "cpp-build-tools",
    depthTarget: "D2",
    prerequisites: ["CB01"],
    keywords: ["Conan", "vcpkg", "FetchContent_Declare", "FetchContent_MakeAvailable", "package manager", "dependency management", "conanfile.txt", "CMakePresets"],
    misconceptionTags: ["cpp.vcpkg_and_conan_interchangeable", "cpp.fetchcontent_always_downloads", "cpp.package_managers_solve_abi_issues"]
  })
];

// ---------------------------------------------------------------------------
// Tracks index
// ---------------------------------------------------------------------------
const tracks = {
  "cpp-foundations": {
    id: "cpp-foundations",
    title: "Language Foundations",
    nodeIds: foundationsNodes.map((n) => n.id)
  },
  "cpp-classes": {
    id: "cpp-classes",
    title: "Classes and Polymorphism",
    nodeIds: classesNodes.map((n) => n.id)
  },
  "cpp-memory": {
    id: "cpp-memory",
    title: "Memory Management",
    nodeIds: memoryNodes.map((n) => n.id)
  },
  "cpp-move-semantics": {
    id: "cpp-move-semantics",
    title: "Move Semantics and Value Categories",
    nodeIds: moveNodes.map((n) => n.id)
  },
  "cpp-stl": {
    id: "cpp-stl",
    title: "STL Containers and Algorithms",
    nodeIds: stlNodes.map((n) => n.id)
  },
  "cpp-templates": {
    id: "cpp-templates",
    title: "Templates",
    nodeIds: templatesNodes.map((n) => n.id)
  },
  "cpp-constexpr": {
    id: "cpp-constexpr",
    title: "Compile-time Programming",
    nodeIds: constexprNodes.map((n) => n.id)
  },
  "cpp-error-handling": {
    id: "cpp-error-handling",
    title: "Error Handling",
    nodeIds: errorNodes.map((n) => n.id)
  },
  "cpp-conversions": {
    id: "cpp-conversions",
    title: "Operators and Type Conversions",
    nodeIds: conversionsNodes.map((n) => n.id)
  },
  "cpp-concurrency": {
    id: "cpp-concurrency",
    title: "Concurrency",
    nodeIds: concurrencyNodes.map((n) => n.id)
  },
  "cpp-io": {
    id: "cpp-io",
    title: "Streams and I/O",
    nodeIds: ioNodes.map((n) => n.id)
  },
  "cpp-build-tools": {
    id: "cpp-build-tools",
    title: "Build, Testing, and Tooling",
    nodeIds: buildNodes.map((n) => n.id)
  }
};

// ---------------------------------------------------------------------------
// Combined node list (all 100 nodes)
// ---------------------------------------------------------------------------
const allNodes = [
  ...foundationsNodes,
  ...classesNodes,
  ...memoryNodes,
  ...moveNodes,
  ...stlNodes,
  ...templatesNodes,
  ...constexprNodes,
  ...errorNodes,
  ...conversionsNodes,
  ...concurrencyNodes,
  ...ioNodes,
  ...buildNodes
];

export const cppCurriculum = createCurriculumGraph(allNodes, tracks);
