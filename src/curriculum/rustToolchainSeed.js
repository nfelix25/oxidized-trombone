import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// XL: Lexer — byte-level JS/TS tokenization in Rust
// Entry: XL01 — prereqs S100 (syntax-basics), A200 (ownership)
// ---------------------------------------------------------------------------
const jsLexerNodes = [
  createNode({
    id: "XL01",
    title: "Byte scanning: u8 slices, `&str`, and UTF-8 safety in Rust",
    language: "rust",
    track: "js-lexer",
    depthTarget: "D2",
    prerequisites: ["S100", "A200"],
    keywords: ["&[u8]", "&str", "char", "UTF-8", "std::str::from_utf8", "byte offset", "as_bytes", "unsafe utf8", "is_ascii", "u8 range"],
    misconceptionTags: ["rust.str_vs_string_indexing", "rust.utf8_byte_vs_char", "rust.from_utf8_unchecked_safety"]
  }),
  createNode({
    id: "XL02",
    title: "Token types: enum design, `Copy` variants, and discriminant layout",
    language: "rust",
    track: "js-lexer",
    depthTarget: "D2",
    prerequisites: ["XL01", "A201"],
    keywords: ["token enum", "#[derive(Copy, Clone, PartialEq, Debug)]", "discriminant", "repr(u8)", "keyword token", "punctuation token", "literal token", "token kind", "unit variant"],
    misconceptionTags: ["rust.copy_trait_data_size", "rust.enum_discriminant_size", "rust.derive_copy_requirements"]
  }),
  createNode({
    id: "XL03",
    title: "Lexer struct: sliding window, `peek()`, and source position tracking",
    language: "rust",
    track: "js-lexer",
    depthTarget: "D2",
    prerequisites: ["XL02"],
    keywords: ["lexer struct", "source text", "current position", "peek ahead", "bump()", "Span", "start position", "end position", "source slice", "lookahead 1"],
    misconceptionTags: ["rust.lexer_cursor_semantics", "rust.span_byte_vs_char", "rust.peek_consume_pattern"]
  }),
  createNode({
    id: "XL04",
    title: "Scanning identifiers, keywords, and Unicode identStart/identPart",
    language: "rust",
    track: "js-lexer",
    depthTarget: "D2",
    prerequisites: ["XL03"],
    keywords: ["identifier start", "identifier part", "Unicode XID", "UnicodeIDStart", "UnicodeIDContinue", "keyword map", "phf_map!", "perfect hash", "reserved word", "contextual keyword"],
    misconceptionTags: ["rust.keyword_vs_reserved", "rust.unicode_ident_categories", "rust.phf_vs_hashmap_perf"]
  }),
  createNode({
    id: "XL05",
    title: "Lexing numbers: integer, float, BigInt, and numeric separators",
    language: "rust",
    track: "js-lexer",
    depthTarget: "D2",
    prerequisites: ["XL03"],
    keywords: ["integer literal", "float literal", "BigInt suffix n", "numeric separator _", "hex literal 0x", "octal 0o", "binary 0b", "exponent e", "f64::from_str", "parse error"],
    misconceptionTags: ["rust.float_parse_precision", "rust.bigint_vs_number_lex", "rust.numeric_separator_position"]
  }),
  createNode({
    id: "XL06",
    title: "Lexing strings, template literals, and escape sequences",
    language: "rust",
    track: "js-lexer",
    depthTarget: "D3",
    prerequisites: ["XL03"],
    keywords: ["string literal", "double quote", "template literal", "backtick", "template span", "template middle", "escape sequence", "\\n", "\\u{}", "\\x", "line continuation", "cooked vs raw"],
    misconceptionTags: ["rust.template_literal_nesting", "rust.escape_unicode_codepoint", "rust.raw_string_in_js_context"]
  }),
  createNode({
    id: "XL07",
    title: "Lexing regex tokens: state machine and slash ambiguity resolution",
    language: "rust",
    track: "js-lexer",
    depthTarget: "D3",
    prerequisites: ["XL06", "XP01"],
    keywords: ["regex literal", "slash ambiguity", "division vs regex", "lexer goal symbol", "regex body", "regex flags", "after-value context", "after-operator context", "lookahead token", "regex state"],
    misconceptionTags: ["rust.regex_slash_context", "rust.lexer_goal_symbols", "rust.regex_flag_validation"]
  })
];

// ---------------------------------------------------------------------------
// XP: Parser — recursive descent + Pratt for JS grammar
// Entry: XP01 — prereq XL03
// ---------------------------------------------------------------------------
const jsParserNodes = [
  createNode({
    id: "XP01",
    title: "Recursive descent: top-down parsing, grammar rules as Rust functions",
    language: "rust",
    track: "js-parser",
    depthTarget: "D2",
    prerequisites: ["XL03"],
    keywords: ["recursive descent", "top-down parser", "parse_stmt", "parse_expr", "expect(Token)", "peek", "advance", "grammar production", "left-to-right", "LL(1)"],
    misconceptionTags: ["rust.recursive_descent_stack_depth", "rust.parse_vs_lex_separation", "rust.expect_vs_check_token"]
  }),
  createNode({
    id: "XP02",
    title: "Parsing statements: var/let/const, if, while, for, return, block",
    language: "rust",
    track: "js-parser",
    depthTarget: "D2",
    prerequisites: ["XP01"],
    keywords: ["var declaration", "let declaration", "const declaration", "if statement", "else clause", "while loop", "for-in", "for-of", "return statement", "block statement", "semicolon insertion"],
    misconceptionTags: ["rust.for_of_vs_for_in", "rust.let_vs_var_hoisting", "rust.asi_ambiguity"]
  }),
  createNode({
    id: "XP03",
    title: "Pratt parsing: operator precedence, binding power, null/left denotation",
    language: "rust",
    track: "js-parser",
    depthTarget: "D3",
    prerequisites: ["XP01"],
    keywords: ["Pratt parser", "binding power", "null denotation", "left denotation", "parse_prefix", "parse_infix", "precedence table", "right-associative", "ternary operator", "comma operator"],
    misconceptionTags: ["rust.pratt_binding_power_table", "rust.right_assoc_vs_left_assoc", "rust.ternary_precedence"]
  }),
  createNode({
    id: "XP04",
    title: "Parsing function declarations, arrow functions, and parameter lists",
    language: "rust",
    track: "js-parser",
    depthTarget: "D2",
    prerequisites: ["XP02", "XP03"],
    keywords: ["function declaration", "function expression", "arrow function", "async function", "generator function", "parameter list", "rest parameter", "default parameter", "function body", "expression body"],
    misconceptionTags: ["rust.arrow_vs_function_this", "rust.async_generator_combo", "rust.default_param_scope"]
  }),
  createNode({
    id: "XP05",
    title: "Parsing classes: extends, constructor, methods, static, and private fields",
    language: "rust",
    track: "js-parser",
    depthTarget: "D3",
    prerequisites: ["XP04"],
    keywords: ["class declaration", "class expression", "extends", "super", "constructor", "method definition", "static method", "private field #", "computed property", "accessor method", "static block"],
    misconceptionTags: ["rust.class_private_field_syntax", "rust.static_vs_instance_method", "rust.super_call_requirement"]
  }),
  createNode({
    id: "XP06",
    title: "Parsing destructuring: object patterns, array patterns, and rest/spread",
    language: "rust",
    track: "js-parser",
    depthTarget: "D3",
    prerequisites: ["XP04"],
    keywords: ["destructuring pattern", "object pattern", "array pattern", "rest element", "spread element", "default value", "nested destructuring", "computed property key", "assignment pattern", "parameter destructuring"],
    misconceptionTags: ["rust.rest_vs_spread_parse", "rust.destructure_default_scope", "rust.nested_pattern_depth"]
  }),
  createNode({
    id: "XP07",
    title: "Parsing TypeScript annotations: types, generics, and type assertions",
    language: "rust",
    track: "js-parser",
    depthTarget: "D3",
    prerequisites: ["XP04", "XA01"],
    keywords: ["type annotation", "type parameter", "generic constraint", "as expression", "satisfies", "type predicate", "intersection type", "union type", "conditional type", "infer keyword"],
    misconceptionTags: ["rust.ts_type_vs_value_space", "rust.as_expression_safety", "rust.generic_vs_runtime_check"]
  }),
  createNode({
    id: "XP08",
    title: "Error recovery: synchronization points, error nodes, and partial ASTs",
    language: "rust",
    track: "js-parser",
    depthTarget: "D3",
    prerequisites: ["XP02", "XD01"],
    keywords: ["error recovery", "panic mode", "synchronization set", "error node", "partial AST", "statement boundary", "skip tokens", "multiple diagnostics", "parse after error", "resilient parser"],
    misconceptionTags: ["rust.error_recovery_vs_abort", "rust.sync_token_set", "rust.partial_ast_validity"]
  })
];

// ---------------------------------------------------------------------------
// XA: AST & Semantic Analysis — tree model, arena, visitor, scope
// Entry: XA01 — prereqs A200, B100
// ---------------------------------------------------------------------------
const jsAstSemanticsNodes = [
  createNode({
    id: "XA01",
    title: "AST node design: enums, Box<T>, and recursive tree types",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D2",
    prerequisites: ["A200", "B100"],
    keywords: ["enum Statement", "enum Expression", "Box<Expr>", "recursive type", "AST node", "NodeKind", "tagged union", "heap allocation for recursion", "PhantomData", "derive Debug"],
    misconceptionTags: ["rust.recursive_enum_without_box", "rust.box_vs_rc_in_ast", "rust.ast_enum_size"]
  }),
  createNode({
    id: "XA02",
    title: "Arena allocation: `bumpalo` arenas and lifetime-parameterized AST nodes",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D3",
    prerequisites: ["XA01", "B101"],
    keywords: ["bumpalo", "Bump arena", "arena allocation", "lifetime parameter", "'arena", "arena-allocated slice", "bump.alloc()", "bump.alloc_slice_copy()", "no-free allocator", "allocator API"],
    misconceptionTags: ["rust.arena_lifetime_escape", "rust.bump_vs_slab", "rust.arena_reset_vs_drop"]
  }),
  createNode({
    id: "XA03",
    title: "Visitor pattern in Rust: trait-based AST traversal and `walk_*` helpers",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D2",
    prerequisites: ["XA01", "G100"],
    keywords: ["Visitor trait", "visit_stmt", "visit_expr", "visit_decl", "default method", "walk_stmt", "walk_expr", "noop visitor", "dispatch", "double dispatch alternative"],
    misconceptionTags: ["rust.visitor_vs_pattern_match", "rust.walk_vs_visit_separation", "rust.visitor_trait_object"]
  }),
  createNode({
    id: "XA04",
    title: "Scope tree: lexical scoping, block scopes, and function scopes",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D3",
    prerequisites: ["XA03", "XP02"],
    keywords: ["scope tree", "ScopeId", "ScopeKind", "block scope", "function scope", "module scope", "global scope", "scope chain", "parent scope", "child scopes", "var hoisting scope"],
    misconceptionTags: ["rust.scope_tree_vs_symbol_table", "rust.var_hoist_scope_boundary", "rust.with_statement_scope"]
  }),
  createNode({
    id: "XA05",
    title: "Symbol binding: declarations, references, and shadowing resolution",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D3",
    prerequisites: ["XA04"],
    keywords: ["SymbolId", "symbol table", "declaration", "reference", "binding", "shadowing", "temporal dead zone", "hoisting", "unused binding", "write vs read reference"],
    misconceptionTags: ["rust.symbol_vs_identifier", "rust.tdz_check_at_bind", "rust.shadowing_in_scope_chain"]
  }),
  createNode({
    id: "XA06",
    title: "TypeScript type narrowing and control-flow analysis",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D3",
    prerequisites: ["XA05", "XP07"],
    keywords: ["type narrowing", "control-flow analysis", "type guard", "CFA graph", "narrowed type", "truthiness check", "typeof guard", "instanceof guard", "discriminated union", "never type"],
    misconceptionTags: ["rust.cfa_vs_dataflow", "rust.type_guard_soundness", "rust.never_narrowing"]
  }),
  createNode({
    id: "XA07",
    title: "Reference counting across the AST: `Rc<RefCell<T>>` vs arena approaches",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D3",
    prerequisites: ["XA02", "B102"],
    keywords: ["Rc<RefCell<T>>", "RefCell", "borrow()", "borrow_mut()", "interior mutability", "reference cycle", "weak reference", "arena tradeoff", "shared node", "Rc vs Box in AST"],
    misconceptionTags: ["rust.rc_refcell_borrow_panic", "rust.reference_cycle_leak", "rust.arena_vs_rc_perf"]
  }),
  createNode({
    id: "XA08",
    title: "AST diffing and incremental re-parse: changed subtree detection",
    language: "rust",
    track: "js-ast-semantics",
    depthTarget: "D3",
    prerequisites: ["XA03"],
    keywords: ["incremental parsing", "AST diff", "edit range", "changed subtree", "reuse unchanged nodes", "TextEdit", "syntax tree versioning", "delta parse", "tree-sitter approach", "invalidation"],
    misconceptionTags: ["rust.incremental_parse_correctness", "rust.subtree_reuse_safety", "rust.diff_vs_reparse_cost"]
  })
];

// ---------------------------------------------------------------------------
// XD: Diagnostics — span-aware error types and terminal rendering
// Entry: XD01 — prereq XL01
// ---------------------------------------------------------------------------
const jsDiagnosticsNodes = [
  createNode({
    id: "XD01",
    title: "Spans and source ranges: byte offsets, line/col conversion, and `Span` type",
    language: "rust",
    track: "js-diagnostics",
    depthTarget: "D2",
    prerequisites: ["XL01"],
    keywords: ["Span", "byte offset", "line number", "column number", "source text slice", "span start", "span end", "TextSize", "LineIndex", "offset to line col"],
    misconceptionTags: ["rust.span_byte_vs_char_offset", "rust.line_col_zero_indexed", "rust.span_exclusive_end"]
  }),
  createNode({
    id: "XD02",
    title: "Diagnostic struct: severity, code, message, and help text",
    language: "rust",
    track: "js-diagnostics",
    depthTarget: "D2",
    prerequisites: ["XD01", "A201"],
    keywords: ["Diagnostic", "Severity::Error", "Severity::Warning", "diagnostic code", "message string", "help text", "OxcDiagnostic", "primary span", "diagnostic builder", "chaining"],
    misconceptionTags: ["rust.diagnostic_code_uniqueness", "rust.warning_vs_error_severity", "rust.diagnostic_builder_pattern"]
  }),
  createNode({
    id: "XD03",
    title: "Labels and annotations: primary span, secondary spans, and underline rendering",
    language: "rust",
    track: "js-diagnostics",
    depthTarget: "D2",
    prerequisites: ["XD02"],
    keywords: ["primary label", "secondary label", "annotation", "underline", "caret ^", "label message", "multi-span", "related info", "note", "suggestion span"],
    misconceptionTags: ["rust.primary_vs_secondary_label", "rust.multi_span_rendering", "rust.label_overlap"]
  }),
  createNode({
    id: "XD04",
    title: "Implementing `std::error::Error` and `Display` for diagnostics",
    language: "rust",
    track: "js-diagnostics",
    depthTarget: "D2",
    prerequisites: ["XD02", "A204"],
    keywords: ["impl std::error::Error", "impl fmt::Display", "source()", "Error trait", "Display trait", "write!(f, ...)", "? operator on errors", "thiserror", "anyhow", "error chain"],
    misconceptionTags: ["rust.error_source_chain", "rust.display_vs_debug_for_errors", "rust.thiserror_vs_manual"]
  }),
  createNode({
    id: "XD05",
    title: "Diagnostic rendering: ANSI colours, source context, and caret display",
    language: "rust",
    track: "js-diagnostics",
    depthTarget: "D3",
    prerequisites: ["XD03", "A202"],
    keywords: ["ANSI escape code", "\\x1b[31m", "colour output", "source context line", "gutter", "caret ^", "squiggle ~~~", "line number prefix", "miette", "codespan-reporting", "owo-colors"],
    misconceptionTags: ["rust.ansi_terminal_detection", "rust.gutter_width_alignment", "rust.unicode_caret_column"]
  }),
  createNode({
    id: "XD06",
    title: "Diagnostic collection and error aggregation: reporting multiple errors",
    language: "rust",
    track: "js-diagnostics",
    depthTarget: "D2",
    prerequisites: ["XD05"],
    keywords: ["Vec<Diagnostic>", "diagnostic accumulator", "error aggregation", "Result<T, Vec<Diagnostic>>", "continue on error", "error limit", "sort diagnostics", "dedup diagnostics", "exit code from errors"],
    misconceptionTags: ["rust.error_accumulation_vs_fail_fast", "rust.diagnostic_ordering", "rust.result_vs_diagnostic_vec"]
  })
];

// ---------------------------------------------------------------------------
// XR: Lint Rules — rule infrastructure and concrete lint passes
// Entry: XR01 — prereqs XA03, G101
// ---------------------------------------------------------------------------
const jsLintRulesNodes = [
  createNode({
    id: "XR01",
    title: "Rule trait: `LintRule`, metadata, and the rule registry",
    language: "rust",
    track: "js-lint-rules",
    depthTarget: "D2",
    prerequisites: ["XA03", "G101"],
    keywords: ["LintRule trait", "rule metadata", "RuleCategory", "rule name", "rule docs", "Box<dyn LintRule>", "rule registry", "Vec<Box<dyn LintRule>>", "dynamic dispatch", "rule enable/disable"],
    misconceptionTags: ["rust.dyn_trait_object_size", "rust.rule_registry_ownership", "rust.trait_object_vs_enum_dispatch"]
  }),
  createNode({
    id: "XR02",
    title: "Context object: passing diagnostics and source through the lint pass",
    language: "rust",
    track: "js-lint-rules",
    depthTarget: "D2",
    prerequisites: ["XR01", "XD06"],
    keywords: ["LintContext", "ctx.diagnostic()", "ctx.source_text()", "ctx.symbols()", "ctx.scopes()", "borrow through context", "immutable context", "rule invocation", "pass context"],
    misconceptionTags: ["rust.context_borrow_conflict", "rust.lint_pass_mutability", "rust.context_lifetime_rule"]
  }),
  createNode({
    id: "XR03",
    title: "Implementing a value-unused rule: tracking declarations and references",
    language: "rust",
    track: "js-lint-rules",
    depthTarget: "D3",
    prerequisites: ["XR02", "XA05"],
    keywords: ["unused variable", "unused binding", "declaration without reference", "symbol table query", "write-only variable", "underscore prefix convention", "no-unused-vars", "parameter unused"],
    misconceptionTags: ["rust.unused_export_vs_local", "rust.destructure_always_used", "rust.typeof_counts_as_use"]
  }),
  createNode({
    id: "XR04",
    title: "Implementing a no-console rule: method call pattern matching",
    language: "rust",
    track: "js-lint-rules",
    depthTarget: "D2",
    prerequisites: ["XR02", "XA03"],
    keywords: ["CallExpression", "MemberExpression", "console.log", "method name match", "object name check", "callee pattern", "no-console rule", "allowlist pattern", "rule option"],
    misconceptionTags: ["rust.static_vs_computed_property", "rust.console_shadowing", "rust.callee_vs_arguments_visit"]
  }),
  createNode({
    id: "XR05",
    title: "Implementing an eq-eq-eq rule: binary expression detection and fixable hints",
    language: "rust",
    track: "js-lint-rules",
    depthTarget: "D2",
    prerequisites: ["XR02", "XA03"],
    keywords: ["BinaryExpression", "== operator", "=== operator", "eqeqeq rule", "fixable diagnostic", "suggestion fix", "operator kind", "null comparison", "typeof comparison"],
    misconceptionTags: ["rust.eq_null_exception", "rust.fixable_vs_suggestion", "rust.operator_token_span"]
  }),
  createNode({
    id: "XR06",
    title: "Auto-fix infrastructure: `Fix` type, text edits, and conflict resolution",
    language: "rust",
    track: "js-lint-rules",
    depthTarget: "D3",
    prerequisites: ["XR05", "XD06"],
    keywords: ["Fix struct", "TextEdit", "fix span", "fix replacement", "conflict detection", "overlapping edits", "apply fixes", "sorted edits", "fix applicability", "safe vs unsafe fix"],
    misconceptionTags: ["rust.fix_conflict_resolution", "rust.fix_span_alignment", "rust.unsafe_fix_semantics"]
  }),
  createNode({
    id: "XR07",
    title: "Parallelising lint passes with Rayon: `par_iter` over files",
    language: "rust",
    track: "js-lint-rules",
    depthTarget: "D3",
    prerequisites: ["XR01", "C100"],
    keywords: ["rayon", "par_iter()", "ParallelIterator", "into_par_iter()", "thread pool", "Send + Sync", "parallel lint", "work stealing", "lock-free accumulation", "Mutex<Vec<Diagnostic>>"],
    misconceptionTags: ["rust.rayon_send_requirement", "rust.parallel_diagnostic_order", "rust.rayon_vs_tokio_for_cpu"]
  })
];

// ---------------------------------------------------------------------------
// XT: Transformer — mutable AST passes and JS/TS transforms
// Entry: XT01 — prereqs XA03, G100
// ---------------------------------------------------------------------------
const jsTransformerNodes = [
  createNode({
    id: "XT01",
    title: "Transformer architecture: mutable AST traversal and `VisitMut`",
    language: "rust",
    track: "js-transformer",
    depthTarget: "D2",
    prerequisites: ["XA03", "G100"],
    keywords: ["VisitMut trait", "visit_mut_stmt", "visit_mut_expr", "in-place replacement", "std::mem::replace", "std::mem::take", "transformer pass", "pass ordering", "mutable visitor"],
    misconceptionTags: ["rust.visit_mut_ownership", "rust.mem_replace_in_place", "rust.transformer_vs_visitor"]
  }),
  createNode({
    id: "XT02",
    title: "TypeScript stripping: removing type annotations without semantic changes",
    language: "rust",
    track: "js-transformer",
    depthTarget: "D2",
    prerequisites: ["XT01", "XP07"],
    keywords: ["type annotation strip", "type-only import", "type parameter removal", "as expression erase", "satisfies erase", "declare keyword", "ambient declaration", "enum const", "namespace strip"],
    misconceptionTags: ["rust.ts_strip_side_effects", "rust.const_enum_inlining", "rust.type_only_import_strip"]
  }),
  createNode({
    id: "XT03",
    title: "JSX transform: `React.createElement` and automatic runtime (`_jsx`)",
    language: "rust",
    track: "js-transformer",
    depthTarget: "D3",
    prerequisites: ["XT01", "XP04"],
    keywords: ["JSX element", "JSXElement", "JSXFragment", "React.createElement", "_jsx", "_jsxs", "jsxImportSource", "automatic runtime", "pragma comment", "children spreading"],
    misconceptionTags: ["rust.jsx_fragment_vs_element", "rust.jsx_automatic_vs_classic", "rust.jsx_key_prop"]
  }),
  createNode({
    id: "XT04",
    title: "Class fields transform: static/instance initializers to constructor body",
    language: "rust",
    track: "js-transformer",
    depthTarget: "D3",
    prerequisites: ["XT01", "XP05"],
    keywords: ["class field", "instance field", "static field", "constructor injection", "class field initializer", "defineProperty", "static block transform", "private field WeakMap", "class decorator"],
    misconceptionTags: ["rust.class_field_order", "rust.static_vs_instance_init", "rust.private_field_transform_approach"]
  }),
  createNode({
    id: "XT05",
    title: "Optional chaining and nullish coalescing lowering",
    language: "rust",
    track: "js-transformer",
    depthTarget: "D3",
    prerequisites: ["XT01", "XP03"],
    keywords: ["optional chaining ?.", "nullish coalescing ??", "logical assignment ??=", "temp variable", "null check", "undefined check", "chain member", "chain call", "delete optional chain"],
    misconceptionTags: ["rust.optional_chain_short_circuit", "rust.nullish_vs_logical_or", "rust.chain_assignment_lhs"]
  }),
  createNode({
    id: "XT06",
    title: "Async/await downlevel: generator-based state machine desugaring",
    language: "rust",
    track: "js-transformer",
    depthTarget: "D3",
    prerequisites: ["XT01", "A700"],
    keywords: ["async function", "await expression", "generator function*", "yield", "state machine", "Promise wrapper", "generator runtime", "regenerator", "resumption point", "try-catch wrapping"],
    misconceptionTags: ["rust.async_desugar_error_handling", "rust.generator_state_encoding", "rust.async_iterable_vs_async_fn"]
  }),
  createNode({
    id: "XT07",
    title: "Module transform: ESM → CommonJS and named export rewriting",
    language: "rust",
    track: "js-transformer",
    depthTarget: "D3",
    prerequisites: ["XT01", "XN01"],
    keywords: ["ESM", "CommonJS", "require()", "module.exports", "exports.", "named export", "default export", "import rewrite", "live binding", "__esModule flag", "interop"],
    misconceptionTags: ["rust.esm_live_binding_cjs", "rust.default_import_interop", "rust.circular_cjs_require"]
  })
];

// ---------------------------------------------------------------------------
// XM: Minifier — constant folding, DCE, name mangling
// Entry: XM01 — prereqs XA03, XT01
// ---------------------------------------------------------------------------
const jsMinifierNodes = [
  createNode({
    id: "XM01",
    title: "Minifier pipeline: pass ordering and idempotence constraints",
    language: "rust",
    track: "js-minifier",
    depthTarget: "D2",
    prerequisites: ["XA03", "XT01"],
    keywords: ["minifier pass", "pass ordering", "idempotent transform", "fixed point", "multi-pass", "pass runner", "convergence check", "pass registry", "compress then mangle", "minifier options"],
    misconceptionTags: ["rust.minifier_pass_order_matters", "rust.idempotence_vs_convergence", "rust.compress_before_mangle"]
  }),
  createNode({
    id: "XM02",
    title: "Constant folding: literal arithmetic, boolean reduction, and string concat",
    language: "rust",
    track: "js-minifier",
    depthTarget: "D3",
    prerequisites: ["XM01"],
    keywords: ["constant folding", "literal arithmetic", "1 + 2 → 3", "boolean reduction", "true && x → x", "string concat", "typeof undefined", "NaN propagation", "Infinity", "dead literal branch"],
    misconceptionTags: ["rust.float_fold_precision", "rust.string_concat_vs_template", "rust.nan_fold_safety"]
  }),
  createNode({
    id: "XM03",
    title: "Dead code elimination: unreachable branches and unused bindings",
    language: "rust",
    track: "js-minifier",
    depthTarget: "D3",
    prerequisites: ["XM01", "XA05"],
    keywords: ["dead code elimination", "unreachable branch", "if (false)", "while (false)", "unused binding removal", "side-effect check", "pure annotation", "IIFE drop", "DCE pass"],
    misconceptionTags: ["rust.dce_side_effect_safety", "rust.unused_export_dce", "rust.iife_pure_assumption"]
  }),
  createNode({
    id: "XM04",
    title: "Name mangling: generating shortest unique identifiers and scope mapping",
    language: "rust",
    track: "js-minifier",
    depthTarget: "D3",
    prerequisites: ["XM03", "XA04"],
    keywords: ["name mangling", "identifier compression", "shortest identifier", "scope-aware rename", "alphabet sequence a-z aa-az", "mangle map", "reserved word avoidance", "eval scope safety"],
    misconceptionTags: ["rust.mangle_eval_hazard", "rust.mangle_scope_boundary", "rust.reserved_word_mangle_skip"]
  }),
  createNode({
    id: "XM05",
    title: "Property mangling: object key shortening with safe-name tracking",
    language: "rust",
    track: "js-minifier",
    depthTarget: "D3",
    prerequisites: ["XM04"],
    keywords: ["property mangling", "object key", "safe property", "computed property", "dynamic access", "property map", "mangle_props option", "keep_quoted option", "symbol property"],
    misconceptionTags: ["rust.property_mangle_dynamic_access", "rust.quoted_key_safety", "rust.symbol_property_mangle"]
  }),
  createNode({
    id: "XM06",
    title: "Peephole optimisations: `void 0`, `!0`, `!1`, and IIFE patterns",
    language: "rust",
    track: "js-minifier",
    depthTarget: "D2",
    prerequisites: ["XM02"],
    keywords: ["peephole optimisation", "void 0", "undefined replacement", "!0 === true", "!1 === false", "IIFE", "self-executing function", "sequence expression", "comma operator collapse", "return void"],
    misconceptionTags: ["rust.void_0_vs_undefined", "rust.double_negation_fold", "rust.iife_vs_block_scope"]
  }),
  createNode({
    id: "XM07",
    title: "Compression metrics: byte counting, pass convergence, and benchmarking",
    language: "rust",
    track: "js-minifier",
    depthTarget: "D2",
    prerequisites: ["XM06", "A700"],
    keywords: ["byte count", "compression ratio", "gzip estimate", "pass convergence", "benchmark", "criterion", "wall time", "throughput MB/s", "minifier comparison", "size regression test"],
    misconceptionTags: ["rust.gzip_size_vs_raw_size", "rust.benchmark_warm_cache", "rust.convergence_termination"]
  })
];

// ---------------------------------------------------------------------------
// XN: Module Resolution — node_modules walk, exports map, paths
// Entry: XN01 — prereqs XL01, A500
// ---------------------------------------------------------------------------
const jsModuleResolutionNodes = [
  createNode({
    id: "XN01",
    title: "Module specifier classification: bare, relative, absolute, and URL",
    language: "rust",
    track: "js-module-resolution",
    depthTarget: "D2",
    prerequisites: ["XL01", "A500"],
    keywords: ["bare specifier", "relative specifier", "./", "../", "absolute path", "URL specifier", "file:// URL", "specifier kind", "PathBuf", "starts_with check"],
    misconceptionTags: ["rust.bare_vs_relative_specifier", "rust.url_specifier_node", "rust.windows_path_separator"]
  }),
  createNode({
    id: "XN02",
    title: "`node_modules` resolution algorithm: directory walk and `main` field",
    language: "rust",
    track: "js-module-resolution",
    depthTarget: "D3",
    prerequisites: ["XN01", "A700"],
    keywords: ["node_modules", "directory walk", "LOAD_AS_DIRECTORY", "index.js fallback", "package.json main", "browser field", "module field", "parent directories", "async fs::read_to_string"],
    misconceptionTags: ["rust.node_modules_traversal_order", "rust.package_main_vs_module", "rust.async_fs_in_resolver"]
  }),
  createNode({
    id: "XN03",
    title: "`package.json` exports map: conditions, subpaths, and wildcard patterns",
    language: "rust",
    track: "js-module-resolution",
    depthTarget: "D3",
    prerequisites: ["XN02"],
    keywords: ["exports map", "package exports", "condition", "import condition", "require condition", "browser condition", "subpath pattern", "wildcard *", "exact match", "exports fallback array"],
    misconceptionTags: ["rust.exports_condition_order", "rust.exports_wildcard_trailing", "rust.exports_vs_main_priority"]
  }),
  createNode({
    id: "XN04",
    title: "`tsconfig.json` paths and `baseUrl` resolution",
    language: "rust",
    track: "js-module-resolution",
    depthTarget: "D3",
    prerequisites: ["XN02", "A500"],
    keywords: ["tsconfig.json", "paths map", "baseUrl", "path alias", "@alias/*", "composite project", "extends tsconfig", "rootDir", "outDir", "path substitution"],
    misconceptionTags: ["rust.tsconfig_paths_vs_node_modules", "rust.baseurl_resolution_order", "rust.tsconfig_extends_merge"]
  }),
  createNode({
    id: "XN05",
    title: "Caching resolved paths: `HashMap` memoisation and cache invalidation",
    language: "rust",
    track: "js-module-resolution",
    depthTarget: "D2",
    prerequisites: ["XN02", "A502"],
    keywords: ["HashMap memoisation", "cache key", "resolved path cache", "cache invalidation", "file watcher", "mtime check", "DashMap", "concurrent cache", "cache hit ratio"],
    misconceptionTags: ["rust.hashmap_vs_btreemap_cache", "rust.cache_key_normalization", "rust.stale_cache_detection"]
  }),
  createNode({
    id: "XN06",
    title: "Virtual file systems: resolver abstraction for in-memory testing",
    language: "rust",
    track: "js-module-resolution",
    depthTarget: "D3",
    prerequisites: ["XN05", "G101"],
    keywords: ["FileSystem trait", "dyn FileSystem", "in-memory FS", "MemoryFileSystem", "HashMap<PathBuf, String>", "mock resolver", "test fixture", "VFS abstraction", "dependency injection"],
    misconceptionTags: ["rust.dyn_trait_fs_overhead", "rust.vfs_path_normalization", "rust.trait_object_for_testing"]
  })
];

// ---------------------------------------------------------------------------
// XG: Code Generation — AST-to-source-text printing
// Entry: XG01 — prereqs XA01, A500
// ---------------------------------------------------------------------------
const jsCodegenNodes = [
  createNode({
    id: "XG01",
    title: "Printer struct: `String` buffer, indentation, and `write_str` helpers",
    language: "rust",
    track: "js-codegen",
    depthTarget: "D2",
    prerequisites: ["XA01", "A500"],
    keywords: ["printer struct", "String buffer", "write_str", "write_char", "indent level", "print_indent", "newline", "byte offset tracking", "output capacity", "formatter"],
    misconceptionTags: ["rust.string_push_vs_write", "rust.indent_tab_vs_space", "rust.printer_buffer_capacity"]
  }),
  createNode({
    id: "XG02",
    title: "Printing expressions: precedence-aware parenthesisation",
    language: "rust",
    track: "js-codegen",
    depthTarget: "D3",
    prerequisites: ["XG01", "XP03"],
    keywords: ["expression printer", "precedence", "needs_parens", "parent precedence", "binary expression print", "unary expression print", "conditional expression", "assignment print", "sequence print"],
    misconceptionTags: ["rust.over_parenthesise_safety", "rust.assignment_assoc_parens", "rust.unary_prefix_suffix"]
  }),
  createNode({
    id: "XG03",
    title: "Printing statements: block layout, semicolon inference, and ASI rules",
    language: "rust",
    track: "js-codegen",
    depthTarget: "D2",
    prerequisites: ["XG01", "XP02"],
    keywords: ["statement printer", "block statement", "semicolon", "ASI", "if-else layout", "single-statement body", "empty statement", "braces elision", "function body print"],
    misconceptionTags: ["rust.asi_codegen_safety", "rust.braces_elision_risk", "rust.empty_block_vs_empty_stmt"]
  }),
  createNode({
    id: "XG04",
    title: "Printing declarations: `let`/`const`/`var`, functions, and classes",
    language: "rust",
    track: "js-codegen",
    depthTarget: "D2",
    prerequisites: ["XG03", "XP04"],
    keywords: ["let declaration print", "const print", "var print", "function declaration print", "async function print", "generator print", "class print", "extends clause", "method print", "static print"],
    misconceptionTags: ["rust.function_vs_declaration_form", "rust.class_method_comma", "rust.async_generator_print"]
  }),
  createNode({
    id: "XG05",
    title: "Printing TypeScript: type annotations, generics, and `as` expressions",
    language: "rust",
    track: "js-codegen",
    depthTarget: "D3",
    prerequisites: ["XG04", "XP07"],
    keywords: ["type annotation print", "type parameter print", "generic print", "as expression print", "satisfies print", "interface print", "type alias print", "conditional type print", "mapped type print"],
    misconceptionTags: ["rust.ts_print_vs_strip", "rust.type_param_constraint_print", "rust.as_precedence_print"]
  }),
  createNode({
    id: "XG06",
    title: "Minified output mode: eliding whitespace, optional semicolons",
    language: "rust",
    track: "js-codegen",
    depthTarget: "D2",
    prerequisites: ["XG04", "XM01"],
    keywords: ["minified output", "whitespace elision", "optional semicolons", "newline elision", "single-line output", "compact mode", "minify option", "no indent", "brace elision in minify"],
    misconceptionTags: ["rust.minify_asi_correctness", "rust.whitespace_significance_js", "rust.semicolon_insertion_edge"]
  }),
  createNode({
    id: "XG07",
    title: "Source map integration: emitting mappings during code gen",
    language: "rust",
    track: "js-codegen",
    depthTarget: "D3",
    prerequisites: ["XG06", "XS01"],
    keywords: ["source map emit", "mapping entry", "generated position", "original position", "gen_pos", "orig_pos", "mapping flush", "name index", "source index", "sourceMappingURL comment"],
    misconceptionTags: ["rust.mapping_emit_on_token", "rust.source_map_name_entry", "rust.mapping_gen_col_tracking"]
  })
];

// ---------------------------------------------------------------------------
// XS: Source Maps — VLQ encoding, format, merge
// Entry: XS01 — prereqs XD01, A500
// ---------------------------------------------------------------------------
const jsSourcemapsNodes = [
  createNode({
    id: "XS01",
    title: "Source map format: JSON structure, `mappings`, `sources`, and `names`",
    language: "rust",
    track: "js-sourcemaps",
    depthTarget: "D2",
    prerequisites: ["XD01", "A500"],
    keywords: ["source map JSON", "version 3", "mappings string", "sources array", "names array", "sourceRoot", "sourcesContent", "file field", "JSON serialization", "serde_json"],
    misconceptionTags: ["rust.sourcemap_version_field", "rust.sources_content_optional", "rust.mappings_vs_names_relationship"]
  }),
  createNode({
    id: "XS02",
    title: "VLQ encoding: base64-VLQ algorithm and Rust implementation",
    language: "rust",
    track: "js-sourcemaps",
    depthTarget: "D3",
    prerequisites: ["XS01", "A201"],
    keywords: ["VLQ", "variable-length quantity", "base64-VLQ", "continuation bit", "sign bit", "encode VLQ", "decode VLQ", "base64 alphabet", "signed integer encoding", "group"],
    misconceptionTags: ["rust.vlq_sign_bit_position", "rust.vlq_continuation_vs_stop", "rust.base64_vlq_vs_standard_base64"]
  }),
  createNode({
    id: "XS03",
    title: "Mapping entries: generated position → original position tuples",
    language: "rust",
    track: "js-sourcemaps",
    depthTarget: "D2",
    prerequisites: ["XS02"],
    keywords: ["mapping tuple", "generated line", "generated column", "source file index", "original line", "original column", "name index", "segment", "group by line", "semicolon separator"],
    misconceptionTags: ["rust.mapping_delta_encoding", "rust.source_index_optional", "rust.name_index_optional"]
  }),
  createNode({
    id: "XS04",
    title: "Building a source map from a code gen pass",
    language: "rust",
    track: "js-sourcemaps",
    depthTarget: "D3",
    prerequisites: ["XS03", "XG01"],
    keywords: ["SourceMapBuilder", "add_mapping", "set_source", "set_source_content", "finalize", "SourceMap struct", "builder pattern", "mapping accumulation", "source index assignment"],
    misconceptionTags: ["rust.builder_vs_direct_struct", "rust.mapping_before_codegen", "rust.source_content_encoding"]
  }),
  createNode({
    id: "XS05",
    title: "Consuming source maps: lookup by generated line/col",
    language: "rust",
    track: "js-sourcemaps",
    depthTarget: "D2",
    prerequisites: ["XS04"],
    keywords: ["source map lookup", "binary search", "generated position", "find_token", "original position", "SourceMapConsumer", "decoded mappings", "sorted segments", "exact vs nearest match"],
    misconceptionTags: ["rust.binary_search_off_by_one", "rust.generated_col_byte_vs_char", "rust.nearest_mapping_semantics"]
  }),
  createNode({
    id: "XS06",
    title: "Source map merging: composing two maps (transpile → minify chain)",
    language: "rust",
    track: "js-sourcemaps",
    depthTarget: "D3",
    prerequisites: ["XS05"],
    keywords: ["source map merge", "map composition", "applySourceMap", "transpile map", "minify map", "intermediate map", "remapping", "transitive lookup", "oxc_sourcemap merge"],
    misconceptionTags: ["rust.merge_vs_concat_maps", "rust.intermediate_positions_accuracy", "rust.merge_sources_dedup"]
  }),
  createNode({
    id: "XS07",
    title: "Inline source maps: data-URI embedding and `sourceMappingURL`",
    language: "rust",
    track: "js-sourcemaps",
    depthTarget: "D2",
    prerequisites: ["XS06"],
    keywords: ["inline source map", "data URI", "data:application/json;base64,", "sourceMappingURL", "X-SourceMap header", "base64 encode", "append comment", "external vs inline", "hidden source map"],
    misconceptionTags: ["rust.inline_map_size_impact", "rust.sourcemappingurl_comment_syntax", "rust.data_uri_base64_newlines"]
  })
];

// ---------------------------------------------------------------------------
// Graph assembly
// ---------------------------------------------------------------------------
const nodes = [
  ...jsLexerNodes,
  ...jsParserNodes,
  ...jsAstSemanticsNodes,
  ...jsDiagnosticsNodes,
  ...jsLintRulesNodes,
  ...jsTransformerNodes,
  ...jsMinifierNodes,
  ...jsModuleResolutionNodes,
  ...jsCodegenNodes,
  ...jsSourcemapsNodes
];

const tracks = {
  "js-lexer": {
    id: "js-lexer",
    title: "JS Lexer",
    nodeIds: jsLexerNodes.map((n) => n.id)
  },
  "js-parser": {
    id: "js-parser",
    title: "JS Parser",
    nodeIds: jsParserNodes.map((n) => n.id)
  },
  "js-ast-semantics": {
    id: "js-ast-semantics",
    title: "JS AST and Semantic Analysis",
    nodeIds: jsAstSemanticsNodes.map((n) => n.id)
  },
  "js-diagnostics": {
    id: "js-diagnostics",
    title: "JS Diagnostics",
    nodeIds: jsDiagnosticsNodes.map((n) => n.id)
  },
  "js-lint-rules": {
    id: "js-lint-rules",
    title: "JS Lint Rules",
    nodeIds: jsLintRulesNodes.map((n) => n.id)
  },
  "js-transformer": {
    id: "js-transformer",
    title: "JS Transformer",
    nodeIds: jsTransformerNodes.map((n) => n.id)
  },
  "js-minifier": {
    id: "js-minifier",
    title: "JS Minifier",
    nodeIds: jsMinifierNodes.map((n) => n.id)
  },
  "js-module-resolution": {
    id: "js-module-resolution",
    title: "JS Module Resolution",
    nodeIds: jsModuleResolutionNodes.map((n) => n.id)
  },
  "js-codegen": {
    id: "js-codegen",
    title: "JS Code Generation",
    nodeIds: jsCodegenNodes.map((n) => n.id)
  },
  "js-sourcemaps": {
    id: "js-sourcemaps",
    title: "JS Source Maps",
    nodeIds: jsSourcemapsNodes.map((n) => n.id)
  }
};

export const rustToolchainCurriculum = createCurriculumGraph(nodes, tracks);
