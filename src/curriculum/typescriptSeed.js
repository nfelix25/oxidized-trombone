import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// TF — Foundations & Mental Models (6 nodes)
// ---------------------------------------------------------------------------

const tfNodes = [
  createNode({
    id: "TF01",
    title: "Structural typing depth — excess property checking and freshness",
    language: "typescript",
    track: "ts-foundations",
    depthTarget: "D2",
    prerequisites: [],
    keywords: ["structural typing", "excess property checking", "freshness", "nominal typing", "object literal", "widening"],
    misconceptionTags: ["typescript.structural_means_anything_matches", "typescript.excess_property_checking_is_structural"]
  }),
  createNode({
    id: "TF02",
    title: "unknown, any, never — the algebra of top and bottom types",
    language: "typescript",
    track: "ts-foundations",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["unknown", "any", "never", "top type", "bottom type", "type algebra", "assignability"],
    misconceptionTags: ["typescript.unknown_and_any_are_the_same", "typescript.never_is_just_void"]
  }),
  createNode({
    id: "TF03",
    title: "Type inference — contextual typing and inference sites",
    language: "typescript",
    track: "ts-foundations",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["type inference", "contextual typing", "inference site", "annotation", "widening", "const assertion"],
    misconceptionTags: ["typescript.inference_means_no_types_needed", "typescript.annotate_everything"]
  }),
  createNode({
    id: "TF04",
    title: "Literal types, widening, and as const",
    language: "typescript",
    track: "ts-foundations",
    depthTarget: "D2",
    prerequisites: ["TF03"],
    keywords: ["literal type", "widening", "as const", "const assertion", "readonly", "template literal", "satisfies"],
    misconceptionTags: ["typescript.const_variables_have_literal_types", "typescript.as_const_and_readonly_are_same"]
  }),
  createNode({
    id: "TF05",
    title: "The satisfies operator — annotation without widening",
    language: "typescript",
    track: "ts-foundations",
    depthTarget: "D2",
    prerequisites: ["TF03", "TF04"],
    keywords: ["satisfies", "annotation", "inference", "widening", "type narrowing", "TS 4.9"],
    misconceptionTags: ["typescript.satisfies_is_same_as_annotation", "typescript.satisfies_widens_type"]
  }),
  createNode({
    id: "TF06",
    title: "using and await using — Explicit Resource Management",
    language: "typescript",
    track: "ts-foundations",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["using", "await using", "Symbol.dispose", "Symbol.asyncDispose", "Disposable", "resource management", "TS 5.2"],
    misconceptionTags: ["typescript.using_is_just_try_finally", "typescript.using_requires_class"]
  }),
];

// ---------------------------------------------------------------------------
// TN — Narrowing & Control Flow Analysis (10 nodes)
// ---------------------------------------------------------------------------

const tnNodes = [
  createNode({
    id: "TN01",
    title: "The control flow graph — how TypeScript models code paths",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TF01", "TF02"],
    keywords: ["control flow analysis", "CFA", "narrowing", "type narrowing", "control flow graph", "join points"],
    misconceptionTags: ["typescript.narrowing_tracks_values_not_types", "typescript.narrowing_persists_across_function_calls"]
  }),
  createNode({
    id: "TN02",
    title: "Type guards — typeof, instanceof, in, and truthiness",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TN01"],
    keywords: ["typeof", "instanceof", "in operator", "truthiness narrowing", "type guard", "null check"],
    misconceptionTags: ["typescript.in_operator_checks_value_not_type", "typescript.typeof_null_is_object_causes_narrowing"]
  }),
  createNode({
    id: "TN03",
    title: "Discriminated unions and exhaustiveness checking",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TN02"],
    keywords: ["discriminated union", "discriminant property", "exhaustiveness", "never", "switch", "tagged union"],
    misconceptionTags: ["typescript.any_shared_property_can_discriminate", "typescript.exhaustiveness_requires_default_branch"]
  }),
  createNode({
    id: "TN04",
    title: "Assertion functions vs type predicates — different guarantees",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TN02"],
    keywords: ["type predicate", "x is T", "assertion function", "asserts x is T", "user-defined type guard"],
    misconceptionTags: ["typescript.type_predicates_are_verified_by_compiler", "typescript.assertion_functions_and_predicates_are_same"]
  }),
  createNode({
    id: "TN05",
    title: "Aliased condition analysis — CFA through variables",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TN01"],
    keywords: ["aliased condition", "CFA", "TS 4.4", "stored narrowing", "const condition", "type narrowing in variable"],
    misconceptionTags: ["typescript.narrowing_only_works_at_condition_site", "typescript.stored_conditions_always_narrow"]
  }),
  createNode({
    id: "TN06",
    title: "Destructured discriminant narrowing",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TN03", "TN05"],
    keywords: ["destructuring", "discriminant", "narrowing", "TS 4.6", "control flow"],
    misconceptionTags: ["typescript.destructuring_always_loses_narrowing", "typescript.destructured_discriminant_narrows_same_as_property"]
  }),
  createNode({
    id: "TN07",
    title: "switch(true) narrowing — TS 5.3 pattern",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TN02", "TN03"],
    keywords: ["switch true", "narrowing", "TS 5.3", "case clause", "type guard in switch"],
    misconceptionTags: ["typescript.switch_true_is_same_as_if_else_chain", "typescript.switch_true_narrows_all_cases_simultaneously"]
  }),
  createNode({
    id: "TN08",
    title: "Inferred type predicates — TS 5.5 automatic narrowing",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TN04"],
    keywords: ["inferred type predicate", "TS 5.5", "filter", "boolean return", "automatic narrowing", "Array.filter"],
    misconceptionTags: ["typescript.filter_always_produces_widened_type", "typescript.inferred_predicates_work_for_any_function"]
  }),
  createNode({
    id: "TN09",
    title: "CFA limitations — what TypeScript cannot narrow and why",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D3",
    prerequisites: ["TN01", "TN05"],
    keywords: ["CFA limitations", "aliasing", "mutation", "closure capture", "narrowing escape", "mutable binding"],
    misconceptionTags: ["typescript.narrowing_persists_across_function_boundaries", "typescript.narrowing_tracks_mutable_variables_reliably"]
  }),
  createNode({
    id: "TN10",
    title: "NoInfer<T> — blocking unwanted contextual inference",
    language: "typescript",
    track: "ts-narrowing",
    depthTarget: "D2",
    prerequisites: ["TF03", "TN01"],
    keywords: ["NoInfer", "TS 5.4", "contextual typing", "inference site", "type parameter inference blocking"],
    misconceptionTags: ["typescript.noinfer_prevents_all_inference", "typescript.noinfer_is_same_as_unknown"]
  }),
];

// ---------------------------------------------------------------------------
// TG — Generics (12 nodes)
// ---------------------------------------------------------------------------

const tgNodes = [
  createNode({
    id: "TG01",
    title: "Generic function inference — inference at call sites",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TF03"],
    keywords: ["generic function", "type parameter", "inference", "call site", "explicit type argument", "type argument inference"],
    misconceptionTags: ["typescript.must_always_provide_type_arguments", "typescript.inference_always_picks_the_narrowest_type"]
  }),
  createNode({
    id: "TG02",
    title: "Generic constraints — extends, recursive constraints",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TG01"],
    keywords: ["extends constraint", "generic constraint", "recursive constraint", "keyof", "bounded generics"],
    misconceptionTags: ["typescript.extends_in_generics_means_inheritance", "typescript.constraints_narrow_the_type_at_usage"]
  }),
  createNode({
    id: "TG03",
    title: "Default type parameters and inference interaction",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TG02"],
    keywords: ["default type parameter", "type default", "inference with defaults", "optional type argument"],
    misconceptionTags: ["typescript.default_type_params_are_always_used", "typescript.defaults_override_inference"]
  }),
  createNode({
    id: "TG04",
    title: "Const type parameters — literal preservation at call sites",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TF04", "TG01"],
    keywords: ["const type parameter", "TS 5.0", "literal type preservation", "const generic", "inference"],
    misconceptionTags: ["typescript.const_type_param_is_same_as_readonly_constraint", "typescript.const_param_always_produces_tuples"]
  }),
  createNode({
    id: "TG05",
    title: "Instantiation expressions — partial generic application",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TG02"],
    keywords: ["instantiation expression", "TS 4.7", "generic specialization", "partial application", "Array<string>"],
    misconceptionTags: ["typescript.instantiation_expressions_call_the_function", "typescript.only_classes_support_instantiation_expressions"]
  }),
  createNode({
    id: "TG06",
    title: "Generic classes — polymorphic this and F-bounded quantification",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TG02"],
    keywords: ["generic class", "polymorphic this", "F-bounded", "recursive type parameter", "fluent interface", "builder pattern"],
    misconceptionTags: ["typescript.this_type_is_always_the_declaring_class", "typescript.f_bounded_requires_abstract_class"]
  }),
  createNode({
    id: "TG07",
    title: "Abstract construct signatures — TS 4.2 mixin pattern",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TG06"],
    keywords: ["abstract construct signature", "TS 4.2", "mixin", "abstract new", "construct signature", "class factory"],
    misconceptionTags: ["typescript.abstract_constructors_can_be_called_directly", "typescript.construct_signatures_only_work_with_new"]
  }),
  createNode({
    id: "TG08",
    title: "Higher-kinded type simulation — encoding type constructors",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D3",
    prerequisites: ["TG02", "TG06"],
    keywords: ["higher-kinded type", "HKT", "type constructor", "functor", "kind", "generic interface extension"],
    misconceptionTags: ["typescript.hkts_are_natively_supported", "typescript.interface_extension_simulates_hkt_perfectly"]
  }),
  createNode({
    id: "TG09",
    title: "Variance annotations — in and out modifiers",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TG02"],
    keywords: ["variance annotation", "in modifier", "out modifier", "covariant", "contravariant", "TS 4.7", "explicit variance"],
    misconceptionTags: ["typescript.variance_annotations_change_assignability_rules", "typescript.all_type_params_are_covariant_by_default"]
  }),
  createNode({
    id: "TG10",
    title: "Inference from multiple positions — union and intersection inference",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D3",
    prerequisites: ["TG01", "TG02"],
    keywords: ["multi-site inference", "union inference", "intersection inference", "inference from multiple positions", "type widening in inference"],
    misconceptionTags: ["typescript.inference_always_produces_union", "typescript.multiple_inference_sites_produce_intersection"]
  }),
  createNode({
    id: "TG11",
    title: "Generic inference from conditional types",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D3",
    prerequisites: ["TG10"],
    keywords: ["conditional type inference", "generic constraint interaction", "inference blocking", "deferred conditional type"],
    misconceptionTags: ["typescript.conditional_types_always_resolve_eagerly", "typescript.inference_through_conditional_types_is_reliable"]
  }),
  createNode({
    id: "TG12",
    title: "Generic overloads — when to use overloads vs conditional returns",
    language: "typescript",
    track: "ts-generics",
    depthTarget: "D2",
    prerequisites: ["TG01"],
    keywords: ["function overload", "overload signature", "implementation signature", "generic overload", "conditional return type", "overload vs conditional"],
    misconceptionTags: ["typescript.overloads_are_checked_at_runtime", "typescript.implementation_signature_is_visible_to_callers"]
  }),
];

// ---------------------------------------------------------------------------
// TV — Variance & Assignability (10 nodes)
// ---------------------------------------------------------------------------

const tvNodes = [
  createNode({
    id: "TV01",
    title: "Covariance — return types and readonly containers",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D2",
    prerequisites: ["TG01"],
    keywords: ["covariance", "covariant", "return type", "readonly", "ReadonlyArray", "subtype", "extends"],
    misconceptionTags: ["typescript.all_generic_types_are_covariant", "typescript.readonly_array_is_same_as_mutable_array_variance"]
  }),
  createNode({
    id: "TV02",
    title: "Contravariance — function parameters and callback types",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D2",
    prerequisites: ["TV01"],
    keywords: ["contravariance", "contravariant", "function parameter", "callback", "parameter position", "input type"],
    misconceptionTags: ["typescript.function_parameters_are_covariant", "typescript.contravariance_means_you_cant_pass_subtype"]
  }),
  createNode({
    id: "TV03",
    title: "Bivariance — why method shorthand is intentionally bivariant",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D2",
    prerequisites: ["TV01", "TV02"],
    keywords: ["bivariance", "bivariant", "method shorthand", "strictFunctionTypes", "Array methods", "intentional unsoundness"],
    misconceptionTags: ["typescript.method_shorthand_bivariance_is_a_bug", "typescript.strict_mode_fixes_method_bivariance"]
  }),
  createNode({
    id: "TV04",
    title: "Invariance — mutable containers and generic mutation",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D2",
    prerequisites: ["TV01", "TV02"],
    keywords: ["invariance", "invariant", "mutable container", "Array", "Set", "Map", "generic mutation", "type safety"],
    misconceptionTags: ["typescript.array_is_covariant", "typescript.mutable_types_can_be_covariant_if_you_only_read"]
  }),
  createNode({
    id: "TV05",
    title: "strictFunctionTypes — what the flag actually changes",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D2",
    prerequisites: ["TV02", "TV03"],
    keywords: ["strictFunctionTypes", "strict mode", "function type checking", "method vs property function", "contravariance enforcement"],
    misconceptionTags: ["typescript.strict_makes_all_functions_contravariant", "typescript.property_functions_and_method_functions_behave_the_same"]
  }),
  createNode({
    id: "TV06",
    title: "Variance in generic types — Promise, Set, Map covariance",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D2",
    prerequisites: ["TV01", "TV04"],
    keywords: ["generic variance", "Promise covariance", "Set variance", "Map variance", "ReadonlySet", "variance inference"],
    misconceptionTags: ["typescript.all_generic_stdlib_types_are_invariant", "typescript.promise_is_invariant_due_to_then"]
  }),
  createNode({
    id: "TV07",
    title: "CFA and variance interaction — narrowing in mutable containers",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D3",
    prerequisites: ["TN01", "TV04"],
    keywords: ["CFA variance", "mutable property narrowing", "narrowing escape", "closure mutation", "control flow and variance"],
    misconceptionTags: ["typescript.narrowing_applies_to_mutable_object_properties", "typescript.const_object_properties_are_narrowed_reliably"]
  }),
  createNode({
    id: "TV08",
    title: "Variance and distributive conditional types — the connection",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D3",
    prerequisites: ["TV01", "TV02"],
    keywords: ["variance", "distributive conditional type", "covariant position", "contravariant position", "conditional type distribution"],
    misconceptionTags: ["typescript.distributivity_is_unrelated_to_variance", "typescript.naked_type_params_distribute_in_all_positions"]
  }),
  createNode({
    id: "TV09",
    title: "The assignability algorithm — structural compatibility depth",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D3",
    prerequisites: ["TF01", "TV01", "TV02"],
    keywords: ["assignability", "structural compatibility", "subtype check", "excess property", "recursive type check", "type depth"],
    misconceptionTags: ["typescript.assignability_is_checked_shallowly", "typescript.assignability_and_equality_are_the_same"]
  }),
  createNode({
    id: "TV10",
    title: "Excess property checking — freshness and why it is not structural",
    language: "typescript",
    track: "ts-variance",
    depthTarget: "D2",
    prerequisites: ["TF01", "TV09"],
    keywords: ["excess property checking", "freshness", "object literal", "widening", "structural typing exception"],
    misconceptionTags: ["typescript.excess_property_checking_is_always_applied", "typescript.excess_properties_are_a_structural_violation"]
  }),
];

// ---------------------------------------------------------------------------
// TA — Advanced Type Operators (22 nodes)
// ---------------------------------------------------------------------------

const taNodes = [
  createNode({
    id: "TA01",
    title: "keyof — what it produces with index signatures and mapped types",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TF01", "TG02"],
    keywords: ["keyof", "keyof any", "keyof unknown", "index signature", "string | number | symbol", "mapped type key"],
    misconceptionTags: ["typescript.keyof_always_produces_string_union", "typescript.keyof_any_is_never"]
  }),
  createNode({
    id: "TA02",
    title: "typeof in type positions — class instances vs constructors",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["typeof", "type query", "value space", "type space", "typeof class", "InstanceType", "ReturnType"],
    misconceptionTags: ["typescript.typeof_in_type_position_works_like_javascript_typeof", "typescript.typeof_class_gives_instance_type"]
  }),
  createNode({
    id: "TA03",
    title: "Indexed access types — T[K], T[number], deep access",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA01"],
    keywords: ["indexed access", "T[K]", "T[number]", "lookup type", "deep access", "tuple element type"],
    misconceptionTags: ["typescript.indexed_access_is_same_as_javascript_property_access", "typescript.t_number_only_works_on_arrays"]
  }),
  createNode({
    id: "TA04",
    title: "Conditional types — extends, distributivity, naked type params",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TG02"],
    keywords: ["conditional type", "extends", "naked type parameter", "distributive", "non-distributive", "ternary type"],
    misconceptionTags: ["typescript.all_conditional_types_distribute_over_unions", "typescript.extends_in_conditional_means_subclass"]
  }),
  createNode({
    id: "TA05",
    title: "Non-distributive conditionals — wrapping in tuples to suppress distribution",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA04"],
    keywords: ["non-distributive", "tuple wrapping", "[T] extends [U]", "suppress distribution", "wrapped conditional type"],
    misconceptionTags: ["typescript.tuple_wrapping_always_prevents_distribution", "typescript.all_conditional_types_can_be_made_non_distributive"]
  }),
  createNode({
    id: "TA06",
    title: "infer — extracting types from conditional branches",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA04"],
    keywords: ["infer", "type extraction", "ReturnType", "Parameters", "Awaited", "infer keyword", "conditional inference"],
    misconceptionTags: ["typescript.infer_can_be_used_outside_conditional_types", "typescript.infer_always_produces_a_single_type"]
  }),
  createNode({
    id: "TA07",
    title: "infer in covariant vs contravariant position — union vs intersection",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D3",
    prerequisites: ["TA06", "TV02"],
    keywords: ["infer covariant", "infer contravariant", "union extraction", "intersection extraction", "UnionToIntersection", "function parameter infer"],
    misconceptionTags: ["typescript.infer_always_produces_union", "typescript.infer_position_has_no_effect_on_result"]
  }),
  createNode({
    id: "TA08",
    title: "infer with extends constraint — TS 4.7 constrained inference",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D3",
    prerequisites: ["TA06", "TA07"],
    keywords: ["infer extends", "TS 4.7", "constrained inference", "infer R extends string", "upper bound on inferred type"],
    misconceptionTags: ["typescript.infer_extends_is_same_as_naked_infer", "typescript.constrained_infer_always_succeeds"]
  }),
  createNode({
    id: "TA09",
    title: "Multiple same-name infer — intersection accumulation",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D3",
    prerequisites: ["TA07", "TA08"],
    keywords: ["multiple infer", "same-name infer", "intersection accumulation", "TS 4.7", "covariant intersection"],
    misconceptionTags: ["typescript.duplicate_infer_names_cause_errors", "typescript.duplicate_infer_produces_union"]
  }),
  createNode({
    id: "TA10",
    title: "Mapped types — homomorphic vs non-homomorphic",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA01", "TA03"],
    keywords: ["mapped type", "homomorphic mapped type", "keyof T", "non-homomorphic", "modifier preservation", "Partial", "Readonly"],
    misconceptionTags: ["typescript.all_mapped_types_are_homomorphic", "typescript.homomorphic_types_always_preserve_readonly"]
  }),
  createNode({
    id: "TA11",
    title: "Mapped type modifiers — +/- on readonly and optional",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA10"],
    keywords: ["mapped type modifier", "+readonly", "-readonly", "+?", "-?", "Required", "Mutable", "optional removal"],
    misconceptionTags: ["typescript.omitting_modifier_is_same_as_removing_it", "typescript.required_utility_uses_plus_modifier"]
  }),
  createNode({
    id: "TA12",
    title: "Key remapping in mapped types — as clause and filtering",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA10", "TA04"],
    keywords: ["key remapping", "as clause", "TS 4.1", "template literal key", "filter with never", "Capitalize key"],
    misconceptionTags: ["typescript.key_remapping_can_add_new_keys", "typescript.filtering_with_never_in_mapped_type_removes_values"]
  }),
  createNode({
    id: "TA13",
    title: "Template literal types — union distribution over positions",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TF04", "TA04"],
    keywords: ["template literal type", "TS 4.1", "string concatenation type", "union distribution", "string manipulation type"],
    misconceptionTags: ["typescript.template_literal_types_are_just_string", "typescript.unions_in_template_literals_produce_union_of_strings"]
  }),
  createNode({
    id: "TA14",
    title: "Template literals + infer — string parsing at the type level",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D3",
    prerequisites: ["TA06", "TA13"],
    keywords: ["template literal infer", "string parsing type", "head tail split", "infer in template", "type-level string operations"],
    misconceptionTags: ["typescript.infer_in_template_literals_captures_whole_string", "typescript.template_literal_parsing_is_greedy"]
  }),
  createNode({
    id: "TA15",
    title: "Intrinsic string manipulation types — Uppercase, Lowercase, Capitalize",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA13"],
    keywords: ["Uppercase", "Lowercase", "Capitalize", "Uncapitalize", "intrinsic type", "string manipulation", "compiler built-in"],
    misconceptionTags: ["typescript.intrinsic_types_are_just_conditional_types", "typescript.capitalize_works_on_any_string_not_just_literals"]
  }),
  createNode({
    id: "TA16",
    title: "Recursive conditional types — evaluation model and depth limit",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D3",
    prerequisites: ["TA04", "TA06"],
    keywords: ["recursive conditional type", "TS 4.1", "recursive type", "type instantiation depth", "lazy evaluation", "circular type"],
    misconceptionTags: ["typescript.recursive_types_evaluate_immediately", "typescript.depth_limit_is_configurable"]
  }),
  createNode({
    id: "TA17",
    title: "Tail recursion optimization in conditional types — TS 4.5",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D3",
    prerequisites: ["TA16"],
    keywords: ["tail recursion", "TS 4.5", "conditional type optimization", "accumulator pattern", "type recursion optimization"],
    misconceptionTags: ["typescript.all_recursive_types_are_tail_recursive", "typescript.tail_recursion_removes_the_depth_limit"]
  }),
  createNode({
    id: "TA18",
    title: "Variadic tuple types — spreads in type position",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA03"],
    keywords: ["variadic tuple", "TS 4.0", "spread type", "tuple spread", "rest element in tuple", "concat types"],
    misconceptionTags: ["typescript.variadic_tuples_are_the_same_as_rest_parameters", "typescript.tuple_spread_must_be_at_end"]
  }),
  createNode({
    id: "TA19",
    title: "Labeled tuple elements — semantic names without structural change",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA18"],
    keywords: ["labeled tuple", "TS 4.0", "tuple element name", "parameter name inference", "named tuple"],
    misconceptionTags: ["typescript.labeled_tuples_create_named_property_access", "typescript.tuple_labels_affect_assignability"]
  }),
  createNode({
    id: "TA20",
    title: "Leading and middle rest elements in tuples — TS 4.2",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TA18"],
    keywords: ["leading rest", "middle rest", "TS 4.2", "rest at any position", "tuple prefix suffix", "non-trailing rest"],
    misconceptionTags: ["typescript.rest_elements_must_be_at_end_of_tuple", "typescript.multiple_rest_elements_are_allowed"]
  }),
  createNode({
    id: "TA21",
    title: "Independent getter and setter types — TS 4.3",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["getter type", "setter type", "TS 4.3", "different get set types", "accessors", "write type"],
    misconceptionTags: ["typescript.getter_and_setter_must_have_the_same_type", "typescript.setter_type_must_extend_getter_type"]
  }),
  createNode({
    id: "TA22",
    title: "Symbol and unique symbol — nominal typing in a structural system",
    language: "typescript",
    track: "ts-advanced-types",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["symbol", "unique symbol", "Symbol.for", "symbol index signature", "nominal type", "branded with symbol"],
    misconceptionTags: ["typescript.symbol_and_unique_symbol_are_the_same", "typescript.symbol_provides_true_nominal_typing"]
  }),
];

// ---------------------------------------------------------------------------
// TL — Type-Level Challenges (22 nodes)
// ---------------------------------------------------------------------------

const tlNodes = [
  // Medium tier
  createNode({
    id: "TL01",
    title: "Implement DeepReadonly<T> — recursive mapped type",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D2",
    prerequisites: ["TA10", "TA16"],
    keywords: ["DeepReadonly", "recursive mapped type", "readonly deep", "nested objects", "type challenge medium"],
    misconceptionTags: ["typescript.readonly_is_already_deep", "typescript.recursive_mapped_types_bottom_out_automatically"]
  }),
  createNode({
    id: "TL02",
    title: "Implement TupleToUnion<T> — indexed access at number",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D2",
    prerequisites: ["TA03", "TA18"],
    keywords: ["TupleToUnion", "indexed access number", "T[number]", "tuple to union", "type challenge medium"],
    misconceptionTags: ["typescript.tuple_to_union_requires_iteration", "typescript.t_number_on_tuple_produces_element_count"]
  }),
  createNode({
    id: "TL03",
    title: "Implement Awaited<T> from scratch — recursive promise unwrapping",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D2",
    prerequisites: ["TA04", "TA06", "TA16"],
    keywords: ["Awaited", "Promise unwrapping", "recursive conditional", "thenable", "PromiseLike", "type challenge medium"],
    misconceptionTags: ["typescript.awaited_is_just_promise_t", "typescript.awaited_only_unwraps_one_level"]
  }),
  createNode({
    id: "TL04",
    title: "Implement UnionToIntersection<T> — the contravariant infer trick",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D2",
    prerequisites: ["TA07"],
    keywords: ["UnionToIntersection", "contravariant infer", "function parameter intersection", "union to intersection", "type challenge medium"],
    misconceptionTags: ["typescript.union_to_intersection_uses_covariant_infer", "typescript.intersecting_unions_is_straightforward"]
  }),
  createNode({
    id: "TL05",
    title: "Implement PickByValue<T, V> — mapped type with conditional key filtering",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D2",
    prerequisites: ["TA10", "TA12"],
    keywords: ["PickByValue", "filter by value type", "mapped type filter", "conditional key", "type challenge medium"],
    misconceptionTags: ["typescript.pick_by_value_is_built_in", "typescript.filtering_keys_requires_Pick_utility"]
  }),
  createNode({
    id: "TL06",
    title: "Implement IsUnion<T> — detecting union via distributivity",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D2",
    prerequisites: ["TA04", "TA05"],
    keywords: ["IsUnion", "detect union", "distributivity trick", "tuple wrapping", "union detection", "type challenge medium"],
    misconceptionTags: ["typescript.unions_can_be_detected_with_keyof", "typescript.distributivity_test_works_for_any_conditional"]
  }),
  // Hard tier
  createNode({
    id: "TL07",
    title: "Implement Chunk<T, N> — tuple partitioning at the type level",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA16", "TA17", "TA18"],
    keywords: ["Chunk", "tuple partition", "type-level iteration", "accumulator", "recursive tuple", "type challenge hard"],
    misconceptionTags: ["typescript.tuple_chunking_uses_array_slice_equivalent", "typescript.fixed_size_accumulators_require_length_counting"]
  }),
  createNode({
    id: "TL08",
    title: "Implement StringToTuple<S> — character-by-character split",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA14", "TA16"],
    keywords: ["StringToTuple", "string to char tuple", "template literal infer", "string split type level", "type challenge hard"],
    misconceptionTags: ["typescript.string_splitting_uses_array_split_equivalent", "typescript.template_literal_infer_is_greedy_per_character"]
  }),
  createNode({
    id: "TL09",
    title: "Implement CamelCase<S> — string transformation at the type level",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA13", "TA14", "TA15", "TA16"],
    keywords: ["CamelCase", "string transformation type", "Capitalize", "snake to camel", "type challenge hard"],
    misconceptionTags: ["typescript.string_case_conversion_uses_Uppercase_directly", "typescript.camelcase_can_be_done_without_recursion"]
  }),
  createNode({
    id: "TL10",
    title: "Implement FlattenDepth<T, N> — depth counter in types",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA16", "TA17", "TA18"],
    keywords: ["FlattenDepth", "type-level counter", "depth counting", "recursive tuple length", "number arithmetic type level", "type challenge hard"],
    misconceptionTags: ["typescript.type_level_counters_use_numeric_literals_directly", "typescript.depth_zero_base_case_requires_special_handling"]
  }),
  createNode({
    id: "TL11",
    title: "Implement ZipWith<T, U> — heterogeneous tuple zipping",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA16", "TA18"],
    keywords: ["ZipWith", "tuple zip", "heterogeneous zip", "pairwise tuple", "type challenge hard"],
    misconceptionTags: ["typescript.zipping_tuples_uses_indexed_access_on_both", "typescript.zip_requires_equal_length_tuples_by_default"]
  }),
  createNode({
    id: "TL12",
    title: "Implement TupleToObject with key validation",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA03", "TA10", "TA18"],
    keywords: ["TupleToObject", "tuple as const", "key validation", "PropertyKey", "mapped from tuple", "type challenge hard"],
    misconceptionTags: ["typescript.tuple_to_object_works_without_const", "typescript.tuple_elements_are_always_valid_keys"]
  }),
  // Extreme tier
  createNode({
    id: "TL13",
    title: "Implement ParseInt<S> — string literal to number type",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA14", "TA16", "TA17", "TL14"],
    keywords: ["ParseInt type level", "string to number type", "digit extraction", "type arithmetic", "type challenge extreme"],
    misconceptionTags: ["typescript.numeric_literals_can_be_parsed_from_strings_directly", "typescript.parseint_type_only_handles_single_digits"]
  }),
  createNode({
    id: "TL14",
    title: "Implement Add<A, B> — type-level arithmetic via tuple length",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA16", "TA17", "TA18"],
    keywords: ["type-level arithmetic", "tuple length arithmetic", "Add type", "number via tuple", "type challenge extreme"],
    misconceptionTags: ["typescript.numeric_types_support_arithmetic_operators", "typescript.type_level_numbers_have_no_upper_bound"]
  }),
  createNode({
    id: "TL15",
    title: "Implement Compare<A, B> — type-level number comparison",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TL14"],
    keywords: ["type-level comparison", "number comparison type", "greater than type", "type challenge extreme"],
    misconceptionTags: ["typescript.numeric_literal_comparison_uses_extends_directly", "typescript.comparison_types_work_like_subtraction"]
  }),
  createNode({
    id: "TL16",
    title: "Implement AllPermutations<T> — every union permutation as tuple",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA04", "TA05", "TA16", "TA18"],
    keywords: ["AllPermutations", "union permutation", "distributive recursion", "type-level set operations", "type challenge extreme"],
    misconceptionTags: ["typescript.permutations_require_explicit_union_size", "typescript.distributive_types_naturally_produce_permutations"]
  }),
  createNode({
    id: "TL17",
    title: "Type-level JSON parser — parse JSON string literal to type",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA14", "TA16", "TA17", "TL13"],
    keywords: ["JSON type parser", "string literal parsing", "recursive type parser", "type challenge extreme", "type-level state machine"],
    misconceptionTags: ["typescript.json_parsing_at_type_level_is_impractical", "typescript.template_literal_parsing_handles_nested_strings"]
  }),
  createNode({
    id: "TL18",
    title: "Type-state machine — FSM encoded as types with invalid transition errors",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TN03", "TA04", "TA10"],
    keywords: ["type-state", "finite state machine", "FSM types", "invalid transition type error", "phantom type", "type challenge extreme"],
    misconceptionTags: ["typescript.state_machines_require_runtime_validation", "typescript.phantom_types_need_runtime_values"]
  }),
  // Meta/Understanding
  createNode({
    id: "TL19",
    title: "Dissect Equal<A,B> — why the two-function form is the only correct implementation",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA04", "TA06", "TV09"],
    keywords: ["Equal type", "type equality", "two-function form", "TypeScript equality check", "distributivity pitfall", "any detection"],
    misconceptionTags: ["typescript.A_extends_B_and_B_extends_A_means_equal", "typescript.any_can_be_detected_with_conditional_types_naively"]
  }),
  createNode({
    id: "TL20",
    title: "Recursion limits and workarounds — the 100-depth wall",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TA16", "TA17"],
    keywords: ["recursion limit", "type instantiation depth", "100 depth wall", "tail recursion pattern", "accumulator pattern", "type challenge meta"],
    misconceptionTags: ["typescript.recursion_limit_applies_to_all_recursive_types", "typescript.tail_recursion_pattern_always_avoids_depth_limit"]
  }),
  createNode({
    id: "TL21",
    title: "Detecting special types — IsAny, IsNever, IsUnknown tricks",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TF02", "TA04", "TA05"],
    keywords: ["IsAny", "IsNever", "IsUnknown", "special type detection", "1 & T trick", "tuple never check"],
    misconceptionTags: ["typescript.never_can_be_detected_with_extends_never_directly", "typescript.any_is_a_subtype_of_all_types"]
  }),
  createNode({
    id: "TL22",
    title: "UnionToTuple — why it is hard and the only known workaround",
    language: "typescript",
    track: "ts-type-challenges",
    depthTarget: "D3",
    prerequisites: ["TL04", "TL19"],
    keywords: ["UnionToTuple", "union ordering", "unsound workaround", "type system limitation", "type challenge extreme meta"],
    misconceptionTags: ["typescript.union_to_tuple_has_a_clean_implementation", "typescript.union_element_order_is_guaranteed"]
  }),
];

// ---------------------------------------------------------------------------
// TR — Runtime Bridges (10 nodes)
// ---------------------------------------------------------------------------

const trNodes = [
  createNode({
    id: "TR01",
    title: "Runtime type validator — Zod-lite with branded parse results",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TG06", "TA10"],
    keywords: ["runtime validation", "schema validation", "branded type", "parse not validate", "type guard", "Zod pattern"],
    misconceptionTags: ["typescript.types_exist_at_runtime", "typescript.runtime_validators_and_type_guards_are_interchangeable"]
  }),
  createNode({
    id: "TR02",
    title: "Branded and nominal types at runtime — the pattern and its limits",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TF01", "TA22"],
    keywords: ["branded type", "nominal type", "brand pattern", "unique symbol brand", "opaque type", "newtype pattern"],
    misconceptionTags: ["typescript.branded_types_have_runtime_identity", "typescript.symbol_branding_is_enforced_at_runtime"]
  }),
  createNode({
    id: "TR03",
    title: "Type-safe event emitter — EventEmitter<EventMap>",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TG01", "TA10"],
    keywords: ["event emitter", "EventMap", "typed events", "on emit typed", "mapped event types", "generic event system"],
    misconceptionTags: ["typescript.event_emitters_cannot_be_fully_typed", "typescript.on_and_emit_must_have_separate_type_parameters"]
  }),
  createNode({
    id: "TR04",
    title: "Tagged template processors — sql`...` with type-safe interpolations",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TA13", "TG01"],
    keywords: ["tagged template", "template tag function", "TemplateStringsArray", "type-safe interpolation", "sql tag", "gql tag"],
    misconceptionTags: ["typescript.tagged_templates_are_the_same_as_template_literals", "typescript.interpolation_types_cannot_be_constrained"]
  }),
  createNode({
    id: "TR05",
    title: "Overload resolution algorithm — predict which overload wins",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TG12"],
    keywords: ["overload resolution", "overload order", "first match wins", "implementation signature", "overload with generics"],
    misconceptionTags: ["typescript.typescript_picks_the_best_overload_match", "typescript.implementation_signature_participates_in_resolution"]
  }),
  createNode({
    id: "TR06",
    title: "Stage 3 decorators — TS 5.0 class and method decorators",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TG06"],
    keywords: ["decorator", "stage 3 decorator", "TS 5.0", "class decorator", "method decorator", "accessor decorator", "ClassDecoratorContext"],
    misconceptionTags: ["typescript.stage_3_decorators_work_like_experimental_decorators", "typescript.decorators_can_change_class_type_shape"]
  }),
  createNode({
    id: "TR07",
    title: "Decorator metadata — TS 5.2 and Symbol.metadata",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TR06"],
    keywords: ["decorator metadata", "TS 5.2", "Symbol.metadata", "metadata proposal", "ClassDecoratorContext metadata", "reflect metadata"],
    misconceptionTags: ["typescript.decorator_metadata_requires_reflect_metadata", "typescript.metadata_is_accessible_on_instances"]
  }),
  createNode({
    id: "TR08",
    title: "Auto-accessors — TS 4.9 and how they desugar",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TG06", "TR06"],
    keywords: ["auto-accessor", "TS 4.9", "accessor keyword", "desugaring", "private backing field", "stage 3 accessor"],
    misconceptionTags: ["typescript.auto_accessors_are_same_as_get_set_methods", "typescript.accessor_keyword_only_works_with_decorators"]
  }),
  createNode({
    id: "TR09",
    title: "Typed iterator protocol — IterableIterator and Generator types",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D2",
    prerequisites: ["TG01", "TA06"],
    keywords: ["IterableIterator", "Generator", "AsyncGenerator", "iterator protocol", "Symbol.iterator", "generator return type"],
    misconceptionTags: ["typescript.generators_return_any", "typescript.iterable_and_iterator_are_the_same_interface"]
  }),
  createNode({
    id: "TR10",
    title: "TypeScript compiler API — ts.createProgram and AST walking",
    language: "typescript",
    track: "ts-runtime-bridges",
    depthTarget: "D3",
    prerequisites: ["TI10"],
    keywords: ["compiler API", "ts.createProgram", "TypeChecker", "AST", "Node visitor", "SourceFile", "type extraction"],
    misconceptionTags: ["typescript.compiler_api_is_only_for_plugin_authors", "typescript.ast_walking_requires_explicit_node_casting"]
  }),
];

// ---------------------------------------------------------------------------
// TP — Performance & Compiler Behavior (10 nodes)
// ---------------------------------------------------------------------------

const tpNodes = [
  createNode({
    id: "TP01",
    title: "interface extends vs type intersection — the compiler cost model",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["interface extends", "type intersection", "performance", "lazy evaluation", "eager evaluation", "type display"],
    misconceptionTags: ["typescript.interface_and_type_alias_have_identical_performance", "typescript.intersection_is_always_more_readable"]
  }),
  createNode({
    id: "TP02",
    title: "Conditional type caching — deduplication and evaluation order",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D3",
    prerequisites: ["TA04", "TA16"],
    keywords: ["conditional type caching", "type deduplication", "structural identity", "evaluation order", "type instantiation cache"],
    misconceptionTags: ["typescript.conditional_types_are_always_re_evaluated", "typescript.type_cache_uses_reference_equality"]
  }),
  createNode({
    id: "TP03",
    title: "Recursive type depth limits — the 100-instantiation wall and tail recursion scope",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D3",
    prerequisites: ["TA16", "TA17"],
    keywords: ["depth limit", "recursion limit", "100 instantiations", "tail recursion optimization scope", "type instantiation is excessively deep"],
    misconceptionTags: ["typescript.depth_limit_applies_uniformly_to_all_recursive_types", "typescript.increasing_depth_limit_is_possible_via_config"]
  }),
  createNode({
    id: "TP04",
    title: "Union blowup — exponential distribution and how to avoid it",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D3",
    prerequisites: ["TA04", "TA13"],
    keywords: ["union blowup", "exponential type", "distribution explosion", "cross-product union", "template literal union size"],
    misconceptionTags: ["typescript.union_size_is_bounded_by_member_count", "typescript.template_literal_unions_are_computed_lazily"]
  }),
  createNode({
    id: "TP05",
    title: "isolatedModules — constraints and const enum casualties",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D2",
    prerequisites: ["TI08"],
    keywords: ["isolatedModules", "const enum", "bundler compatibility", "single file compilation", "type-only imports", "ambient declarations"],
    misconceptionTags: ["typescript.isolated_modules_only_affects_const_enums", "typescript.isolatedModules_prevents_all_cross_file_types"]
  }),
  createNode({
    id: "TP06",
    title: "Declaration emit — what generates .d.ts and what changes it",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D2",
    prerequisites: ["TI01"],
    keywords: ["declaration emit", ".d.ts generation", "declaration", "inline types", "import elision", "verbatimModuleSyntax"],
    misconceptionTags: ["typescript.d_ts_files_are_identical_to_source_types", "typescript.declaration_emit_inlines_all_imported_types"]
  }),
  createNode({
    id: "TP07",
    title: "Project references — composite builds and incremental compilation",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D2",
    prerequisites: ["TP06"],
    keywords: ["project references", "composite", "incremental build", "tsbuildinfo", "build mode", "monorepo"],
    misconceptionTags: ["typescript.project_references_require_a_build_tool", "typescript.composite_projects_must_emit_all_files"]
  }),
  createNode({
    id: "TP08",
    title: "exactOptionalPropertyTypes and noUncheckedIndexedAccess — semantic impact",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["exactOptionalPropertyTypes", "noUncheckedIndexedAccess", "strict flags", "undefined in index", "optional vs undefined", "T | undefined"],
    misconceptionTags: ["typescript.optional_properties_always_allow_undefined", "typescript.array_access_is_always_T_not_T_or_undefined"]
  }),
  createNode({
    id: "TP09",
    title: "Module resolution — node16, bundler, and extension rules",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D2",
    prerequisites: ["TI09"],
    keywords: ["moduleResolution", "node16", "bundler", "NodeNext", "extension in imports", ".js import", "ESM module resolution"],
    misconceptionTags: ["typescript.module_resolution_is_the_same_as_node_require", "typescript.bundler_mode_requires_js_extensions"]
  }),
  createNode({
    id: "TP10",
    title: "Compiler pipeline internals — binder, checker, emitter, transformer",
    language: "typescript",
    track: "ts-performance",
    depthTarget: "D3",
    prerequisites: ["TR10"],
    keywords: ["compiler pipeline", "binder", "type checker", "emitter", "transformer", "parse tree", "bound tree", "compiler phases"],
    misconceptionTags: ["typescript.type_checking_happens_during_parsing", "typescript.the_emitter_has_access_to_type_information"]
  }),
];

// ---------------------------------------------------------------------------
// TI — Declarations & Ecosystem (10 nodes)
// ---------------------------------------------------------------------------

const tiNodes = [
  createNode({
    id: "TI01",
    title: "Writing .d.ts files — declare module, declare global, namespace",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["d.ts", "declaration file", "declare module", "declare global", "ambient declaration", "namespace"],
    misconceptionTags: ["typescript.d_ts_files_can_contain_implementations", "typescript.declare_module_is_for_npm_packages_only"]
  }),
  createNode({
    id: "TI02",
    title: "Module augmentation — extending third-party types without forking",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TI01"],
    keywords: ["module augmentation", "declaration merging", "extend third-party", "interface merging", "type extension"],
    misconceptionTags: ["typescript.module_augmentation_creates_a_new_module", "typescript.augmentation_requires_reexporting_the_module"]
  }),
  createNode({
    id: "TI03",
    title: "Declaration merging — the full merge table",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TI02"],
    keywords: ["declaration merging", "interface merging", "namespace merging", "function namespace merge", "class namespace merge", "merge table"],
    misconceptionTags: ["typescript.only_interfaces_can_be_merged", "typescript.merging_changes_the_original_type"]
  }),
  createNode({
    id: "TI04",
    title: "Ambient modules — wildcard patterns and module fallback",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TI01"],
    keywords: ["ambient module", "wildcard module", "*.css", "*.svg", "module fallback", "declare module with wildcard"],
    misconceptionTags: ["typescript.ambient_modules_provide_actual_implementations", "typescript.wildcard_ambient_modules_are_type_safe"]
  }),
  createNode({
    id: "TI05",
    title: "Overload authoring — implementation signature visibility rules",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TG12"],
    keywords: ["overload authoring", "implementation signature", "overload specificity", "JIT consideration", "signature visibility"],
    misconceptionTags: ["typescript.implementation_signature_is_the_most_general_overload", "typescript.callers_can_match_the_implementation_signature"]
  }),
  createNode({
    id: "TI06",
    title: "Import attributes — TS 5.3 with clause in the type system",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TI01"],
    keywords: ["import attributes", "TS 5.3", "with clause", "type json", "import assertion", "module attribute"],
    misconceptionTags: ["typescript.import_attributes_are_the_same_as_import_assertions", "typescript.typescript_validates_attribute_values"]
  }),
  createNode({
    id: "TI07",
    title: "JSDoc TypeScript — @type, @satisfies, @import in TS 5.5",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TF05"],
    keywords: ["JSDoc", "@type", "@satisfies", "@import", "TS 5.5", "@template", "@typedef", "type checking in JS"],
    misconceptionTags: ["typescript.jsdoc_types_are_fully_equivalent_to_ts_types", "typescript.jsdoc_import_is_same_as_es_import"]
  }),
  createNode({
    id: "TI08",
    title: "const enums vs regular enums vs union types — the full tradeoff",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TF01"],
    keywords: ["const enum", "enum", "union type", "enum vs union", "isolatedModules enum", "enum emit", "enum pitfall"],
    misconceptionTags: ["typescript.const_enums_are_always_better_than_regular_enums", "typescript.enums_and_union_types_are_interchangeable"]
  }),
  createNode({
    id: "TI09",
    title: "Type-only imports and exports — the isolation guarantee",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D2",
    prerequisites: ["TI01"],
    keywords: ["import type", "export type", "type-only import", "import elision", "verbatimModuleSyntax", "type isolation"],
    misconceptionTags: ["typescript.import_type_is_optional_with_isolatedModules", "typescript.type_only_imports_affect_runtime"]
  }),
  createNode({
    id: "TI10",
    title: "Resolution modes on import types — module vs require split",
    language: "typescript",
    track: "ts-declarations",
    depthTarget: "D3",
    prerequisites: ["TP09", "TI01"],
    keywords: ["resolution mode", "import type with resolution", "module require split", "package.json exports", "conditional exports", "dual CJS ESM package"],
    misconceptionTags: ["typescript.import_types_always_use_the_global_module_resolution", "typescript.resolution_mode_only_matters_for_node_packages"]
  }),
];

// ---------------------------------------------------------------------------
// Curriculum graph
// ---------------------------------------------------------------------------

const allNodes = [
  ...tfNodes,
  ...tnNodes,
  ...tgNodes,
  ...tvNodes,
  ...taNodes,
  ...tlNodes,
  ...trNodes,
  ...tpNodes,
  ...tiNodes,
];

const tracks = {
  "ts-foundations": {
    title: "Foundations & Mental Models",
    nodeIds: tfNodes.map((n) => n.id),
  },
  "ts-narrowing": {
    title: "Narrowing & Control Flow Analysis",
    nodeIds: tnNodes.map((n) => n.id),
  },
  "ts-generics": {
    title: "Generics",
    nodeIds: tgNodes.map((n) => n.id),
  },
  "ts-variance": {
    title: "Variance & Assignability",
    nodeIds: tvNodes.map((n) => n.id),
  },
  "ts-advanced-types": {
    title: "Advanced Type Operators",
    nodeIds: taNodes.map((n) => n.id),
  },
  "ts-type-challenges": {
    title: "Type-Level Challenges",
    nodeIds: tlNodes.map((n) => n.id),
  },
  "ts-runtime-bridges": {
    title: "Runtime Bridges",
    nodeIds: trNodes.map((n) => n.id),
  },
  "ts-performance": {
    title: "Performance & Compiler Behavior",
    nodeIds: tpNodes.map((n) => n.id),
  },
  "ts-declarations": {
    title: "Declarations & Ecosystem",
    nodeIds: tiNodes.map((n) => n.id),
  },
};

export const typescriptCurriculum = createCurriculumGraph(allNodes, tracks);
