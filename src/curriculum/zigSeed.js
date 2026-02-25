import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// Track 1: Language Foundations (ZF01–ZF10)
// Entry point for the entire Zig curriculum. ZF01 has no prerequisites.
// ---------------------------------------------------------------------------
const zigFoundationsNodes = [
  createNode({
    id: "ZF01",
    title: "Variables, constants, and type inference",
    track: "zig-foundations",
    depthTarget: "D1",
    prerequisites: [],
    misconceptionTags: ["zig.const_not_deep_immutable", "zig.comptime_int_overflow_is_error"],
    keywords: ["const", "var", "type inference", "@as", "comptime_int", "comptime_float", "undefined", "shadowing"],
    language: "zig"
  }),
  createNode({
    id: "ZF02",
    title: "Primitive types: integers, floats, bool, and void",
    track: "zig-foundations",
    depthTarget: "D1",
    prerequisites: ["ZF01"],
    misconceptionTags: ["zig.integer_overflow_runtime_safety", "zig.void_vs_noreturn_confusion"],
    keywords: ["u8", "u16", "u32", "u64", "u128", "i8", "i16", "i32", "i64", "i128", "usize", "isize", "f32", "f64", "f128", "bool", "void", "noreturn", "type coercion", "integer overflow"],
    language: "zig"
  }),
  createNode({
    id: "ZF03",
    title: "Functions: parameters, return types, and recursion",
    track: "zig-foundations",
    depthTarget: "D1",
    prerequisites: ["ZF01"],
    misconceptionTags: ["zig.fn_must_use_return_value", "zig.callconv_default_is_unspecified"],
    keywords: ["fn", "return", "inline", "callconv", "anytype", "void", "function call", "recursion", "pub", "comptime parameter"],
    language: "zig"
  }),
  createNode({
    id: "ZF04",
    title: "Control flow: if, while, for, break, continue, and labeled loops",
    track: "zig-foundations",
    depthTarget: "D1",
    prerequisites: ["ZF02", "ZF03"],
    misconceptionTags: ["zig.for_iterates_slices_not_ranges", "zig.labeled_break_vs_break"],
    keywords: ["if", "else", "while", "for", "break", "continue", "labeled loop", "blk:", "inline for", "range", "sentinel loop"],
    language: "zig"
  }),
  createNode({
    id: "ZF05",
    title: "switch expressions and exhaustiveness checking",
    track: "zig-foundations",
    depthTarget: "D2",
    prerequisites: ["ZF04"],
    misconceptionTags: ["zig.switch_must_be_exhaustive", "zig.switch_range_syntax_confusion"],
    keywords: ["switch", "prong", "exhaustiveness", "else prong", "inline switch", "comptime switch", "range prong", "switch expression"],
    language: "zig"
  }),
  createNode({
    id: "ZF06",
    title: "Blocks as expressions and labeled breaks with values",
    track: "zig-foundations",
    depthTarget: "D2",
    prerequisites: ["ZF04"],
    misconceptionTags: ["zig.block_expression_semicolon_confusion", "zig.labeled_break_value_type"],
    keywords: ["block expression", "labeled break", "comptime block", "blk:", "break :label value", "block value", "noreturn in block"],
    language: "zig"
  }),
  createNode({
    id: "ZF07",
    title: "Structs: fields, methods, and the self parameter",
    track: "zig-foundations",
    depthTarget: "D1",
    prerequisites: ["ZF03"],
    misconceptionTags: ["zig.struct_method_self_is_by_value", "zig.anonymous_struct_vs_named"],
    keywords: ["struct", "self", "method", "field", "anonymous struct", ".{}", "init pattern", "pub", "field default", "comptime field"],
    language: "zig"
  }),
  createNode({
    id: "ZF08",
    title: "Enums: declarations, methods, and integer representation",
    track: "zig-foundations",
    depthTarget: "D1",
    prerequisites: ["ZF07"],
    misconceptionTags: ["zig.enum_not_flags_by_default", "zig.int_from_enum_vs_enum_from_int"],
    keywords: ["enum", "@intFromEnum", "@enumFromInt", "enum method", "std.meta.stringToEnum", "enum field", "packed enum", "nonexhaustive enum"],
    language: "zig"
  }),
  createNode({
    id: "ZF09",
    title: "Tagged unions: union(enum) and exhaustive switch",
    track: "zig-foundations",
    depthTarget: "D2",
    prerequisites: ["ZF08"],
    misconceptionTags: ["zig.union_active_field_only", "zig.tagged_union_switch_exhaustive"],
    keywords: ["union", "union(enum)", "tagged union", "switch exhaustiveness", "active field", "payload", "bare union", "extern union"],
    language: "zig"
  }),
  createNode({
    id: "ZF10",
    title: "defer and errdefer: scope-exit resource cleanup",
    track: "zig-foundations",
    depthTarget: "D2",
    prerequisites: ["ZF04", "ZF07"],
    misconceptionTags: ["zig.defer_lifo_order", "zig.errdefer_only_on_error_return"],
    keywords: ["defer", "errdefer", "LIFO", "resource cleanup", "scope exit", "error path", "defer in loop", "stack unwinding"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 2: Pointers and Slices (ZP01–ZP08)
// ---------------------------------------------------------------------------
const zigPointersNodes = [
  createNode({
    id: "ZP01",
    title: "Single-item pointers: *T, address-of, and dereferencing",
    track: "zig-pointers",
    depthTarget: "D2",
    prerequisites: ["ZF07"],
    misconceptionTags: ["zig.pointer_const_not_value_const", "zig.deref_nullable_pointer_panic"],
    keywords: ["*T", "&", ".*", "*const T", "?*T", "address-of", "dereference", "pointer to const", "optional pointer"],
    language: "zig"
  }),
  createNode({
    id: "ZP02",
    title: "Slices: []T, ptr+len model, and slice expressions",
    track: "zig-pointers",
    depthTarget: "D2",
    prerequisites: ["ZP01"],
    misconceptionTags: ["zig.slice_is_fat_pointer", "zig.slice_bounds_checked_at_runtime"],
    keywords: ["slice", "[]T", ".len", ".ptr", "slice expression", "arr[a..b]", "arr[a..]", "arr[..b]", "open-ended slice", "fat pointer", "[]const T"],
    language: "zig"
  }),
  createNode({
    id: "ZP03",
    title: "Many-item pointers: [*]T and pointer arithmetic",
    track: "zig-pointers",
    depthTarget: "D2",
    prerequisites: ["ZP02"],
    misconceptionTags: ["zig.many_item_ptr_no_bounds", "zig.ptr_arith_vs_slice_arith"],
    keywords: ["[*]T", "many-item pointer", "pointer arithmetic", "index", "std.mem.span", "pointer addition", "ptr[n]"],
    language: "zig"
  }),
  createNode({
    id: "ZP04",
    title: "Sentinel-terminated arrays and pointers: [N:0]T and [*:0]T",
    track: "zig-pointers",
    depthTarget: "D2",
    prerequisites: ["ZP03"],
    misconceptionTags: ["zig.sentinel_not_counted_in_len", "zig.sentinel_terminator_value"],
    keywords: ["sentinel", "[*:0]T", "[N:0]T", "null terminator", "C string", "std.mem.span", "std.mem.len", "sentinel-terminated slice"],
    language: "zig"
  }),
  createNode({
    id: "ZP05",
    title: "C pointers: [*c]T and interoperability implications",
    track: "zig-pointers",
    depthTarget: "D2",
    prerequisites: ["ZP04"],
    misconceptionTags: ["zig.cpointer_implicitly_nullable", "zig.cpointer_no_bounds_or_sentinel"],
    keywords: ["[*c]T", "C pointer", "nullable", "C ABI", "@cImport", "translate-c", "null check", "C pointer cast"],
    language: "zig"
  }),
  createNode({
    id: "ZP06",
    title: "Pointer alignment: @alignOf, @alignCast, @ptrFromInt, @intFromPtr",
    track: "zig-pointers",
    depthTarget: "D3",
    prerequisites: ["ZP03"],
    misconceptionTags: ["zig.aligncast_runtime_safety", "zig.ptrint_alignment_assumption"],
    keywords: ["@alignOf", "@alignCast", "@ptrFromInt", "@intFromPtr", "alignment", "SIMD alignment", "hardware register", "over-aligned", "under-aligned"],
    language: "zig"
  }),
  createNode({
    id: "ZP07",
    title: "Pointer and slice coercion rules",
    track: "zig-pointers",
    depthTarget: "D2",
    prerequisites: ["ZP02", "ZP04"],
    misconceptionTags: ["zig.coercion_one_way_only", "zig.sentinel_ptr_coerces_to_many_item"],
    keywords: ["coercion", "implicit cast", "*[N]T", "pointer widening", "sentinel coercion", "const coercion", "slice coercion", "auto-deref"],
    language: "zig"
  }),
  createNode({
    id: "ZP08",
    title: "anyopaque: type-erased pointers and vtable patterns",
    track: "zig-pointers",
    depthTarget: "D3",
    prerequisites: ["ZP06", "ZF07"],
    misconceptionTags: ["zig.anyopaque_requires_ptrcast", "zig.vtable_lifetime_responsibility"],
    keywords: ["anyopaque", "*anyopaque", "@ptrCast", "type erasure", "vtable", "interface", "dynamic dispatch", "fat pointer interface"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 3: Memory and Allocators (ZM01–ZM09)
// ---------------------------------------------------------------------------
const zigMemoryNodes = [
  createNode({
    id: "ZM01",
    title: "The std.mem.Allocator interface: alloc, free, create, destroy",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZP02", "ZF10"],
    misconceptionTags: ["zig.allocator_is_interface_not_type", "zig.alloc_returns_slice_not_ptr"],
    keywords: ["std.mem.Allocator", "alloc", "free", "create", "destroy", "realloc", "allocator interface", "dupe", "dupeZ"],
    language: "zig"
  }),
  createNode({
    id: "ZM02",
    title: "std.heap.page_allocator: direct OS-level allocation",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZM01"],
    misconceptionTags: ["zig.page_allocator_rounds_to_page", "zig.page_allocator_not_for_small_allocs"],
    keywords: ["page_allocator", "mmap", "virtual memory", "page size", "system allocator", "OS allocation"],
    language: "zig"
  }),
  createNode({
    id: "ZM03",
    title: "std.testing.allocator and automatic leak detection",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZM01"],
    misconceptionTags: ["zig.test_allocator_debug_only", "zig.leak_detection_is_debug_feature"],
    keywords: ["std.testing.allocator", "detectLeaks", "memory leak", "test allocator", "leak detection", "deinit check"],
    language: "zig"
  }),
  createNode({
    id: "ZM04",
    title: "std.heap.GeneralPurposeAllocator: safety and double-free detection",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZM02"],
    misconceptionTags: ["zig.gpa_debug_only_overhead", "zig.gpa_backing_allocator"],
    keywords: ["GeneralPurposeAllocator", "GPA", "double-free", "use-after-free", "safety check", "debug allocator", "backing allocator", "gpa.deinit"],
    language: "zig"
  }),
  createNode({
    id: "ZM05",
    title: "std.heap.ArenaAllocator: bulk allocation and reset",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZM01"],
    misconceptionTags: ["zig.arena_no_individual_free", "zig.arena_reset_vs_deinit"],
    keywords: ["ArenaAllocator", "arena.reset", "bulk allocation", "arena.allocator", "deinit", "child allocator", "request-scoped allocation"],
    language: "zig"
  }),
  createNode({
    id: "ZM06",
    title: "std.heap.FixedBufferAllocator: stack-backed allocation with no heap",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZM01"],
    misconceptionTags: ["zig.fixed_buffer_oom_is_error", "zig.fixed_buffer_no_free"],
    keywords: ["FixedBufferAllocator", "stack allocation", "fixed buffer", "OOM", "no heap", "stack memory", "buffer backed"],
    language: "zig"
  }),
  createNode({
    id: "ZM07",
    title: "std.heap.StackFallbackAllocator: prefer stack, spill to heap",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZM05", "ZM06"],
    misconceptionTags: ["zig.stack_fallback_threshold", "zig.stack_fallback_alignment"],
    keywords: ["StackFallbackAllocator", "stack fallback", "small buffer optimization", "hybrid allocator", "spill to heap"],
    language: "zig"
  }),
  createNode({
    id: "ZM08",
    title: "Allocator ownership patterns: passing, deinit, and caller-owned data",
    track: "zig-memory",
    depthTarget: "D2",
    prerequisites: ["ZM01", "ZF10"],
    misconceptionTags: ["zig.caller_owns_returned_slice", "zig.deinit_ordering_with_defer"],
    keywords: ["allocator ownership", "deinit", "caller owns", "container allocator", "errdefer free", "allocator field", "init/deinit pattern"],
    language: "zig"
  }),
  createNode({
    id: "ZM09",
    title: "Multi-resource cleanup: errdefer ordering and safe teardown",
    track: "zig-memory",
    depthTarget: "D3",
    prerequisites: ["ZM08"],
    misconceptionTags: ["zig.errdefer_vs_defer_cleanup", "zig.multi_resource_partial_init"],
    keywords: ["errdefer", "defer ordering", "multi-resource", "cleanup", "resource acquisition", "partial initialization", "rollback pattern"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 4: Arrays and Strings (ZA01–ZA07)
// ---------------------------------------------------------------------------
const zigArraysStringsNodes = [
  createNode({
    id: "ZA01",
    title: "Arrays: [N]T literals, multi-dimensional arrays, and comptime length",
    track: "zig-arrays-strings",
    depthTarget: "D1",
    prerequisites: ["ZF02"],
    misconceptionTags: ["zig.array_length_must_be_comptime", "zig.array_concat_comptime_only"],
    keywords: ["array", "[N]T", "array literal", "++", "**", "multi-dimensional", "comptime length", "array initialization"],
    language: "zig"
  }),
  createNode({
    id: "ZA02",
    title: "Slicing arrays: arr[a..b], mutable vs const slices, open-ended",
    track: "zig-arrays-strings",
    depthTarget: "D1",
    prerequisites: ["ZA01", "ZP02"],
    misconceptionTags: ["zig.slice_from_array_borrows", "zig.open_slice_requires_known_len"],
    keywords: ["slice", "arr[a..b]", ".len", "mutable slice", "const slice", "sentinel slice", "arr[0..]", "open-ended slice"],
    language: "zig"
  }),
  createNode({
    id: "ZA03",
    title: "std.mem utilities: copy, eql, indexOf, sort, and reverse",
    track: "zig-arrays-strings",
    depthTarget: "D2",
    prerequisites: ["ZA02"],
    misconceptionTags: ["zig.mem_copy_noalias", "zig.mem_sort_comparison_fn"],
    keywords: ["std.mem.copy", "std.mem.eql", "std.mem.indexOf", "std.mem.sort", "std.mem.reverse", "std.mem.startsWith", "std.mem.endsWith", "std.mem.indexOfScalar"],
    language: "zig"
  }),
  createNode({
    id: "ZA04",
    title: "Strings as []const u8: literals, comparison, and comptime concatenation",
    track: "zig-arrays-strings",
    depthTarget: "D1",
    prerequisites: ["ZA02"],
    misconceptionTags: ["zig.string_is_u8_slice_not_type", "zig.string_concat_is_comptime_only"],
    keywords: ["string", "[]const u8", "string literal", "std.mem.eql", "++ concatenation", "string comparison", "string slice", "string length in bytes"],
    language: "zig"
  }),
  createNode({
    id: "ZA05",
    title: "std.fmt: format, allocPrint, bufPrint, and format specifiers",
    track: "zig-arrays-strings",
    depthTarget: "D2",
    prerequisites: ["ZA04", "ZM01"],
    misconceptionTags: ["zig.allocprint_caller_must_free", "zig.bufprint_returns_slice_not_ptr"],
    keywords: ["std.fmt", "std.debug.print", "allocPrint", "bufPrint", "format specifier", "{d}", "{s}", "{x}", "{any}", "{}", "comptimePrint"],
    language: "zig"
  }),
  createNode({
    id: "ZA06",
    title: "Parsing strings: std.fmt.parseInt, parseFloat, and charToDigit",
    track: "zig-arrays-strings",
    depthTarget: "D2",
    prerequisites: ["ZA05", "ZE02"],
    misconceptionTags: ["zig.parseint_returns_error_union", "zig.parseint_radix_parameter"],
    keywords: ["std.fmt.parseInt", "parseFloat", "charToDigit", "parse", "string to number", "radix", "ParseIntError", "error union"],
    language: "zig"
  }),
  createNode({
    id: "ZA07",
    title: "Unicode: std.unicode, code points vs bytes, and Utf8View",
    track: "zig-arrays-strings",
    depthTarget: "D2",
    prerequisites: ["ZA04"],
    misconceptionTags: ["zig.string_len_is_bytes_not_codepoints", "zig.utf8_variable_width_encoding"],
    keywords: ["unicode", "UTF-8", "code point", "std.unicode", "Utf8View", "utf8ByteSequenceLength", "grapheme", "codePointAt", "utf8ValidateSlice"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 5: Error Handling (ZE01–ZE07)
// ---------------------------------------------------------------------------
const zigErrorsNodes = [
  createNode({
    id: "ZE01",
    title: "Error sets: declaring error types and the anyerror catch-all",
    track: "zig-errors",
    depthTarget: "D2",
    prerequisites: ["ZF04", "ZF07"],
    misconceptionTags: ["zig.anyerror_is_open_set", "zig.error_set_not_enum"],
    keywords: ["error set", "error.Something", "anyerror", "error type", "error declaration", "error set literal", "error value"],
    language: "zig"
  }),
  createNode({
    id: "ZE02",
    title: "Error unions: !T, try, and catch",
    track: "zig-errors",
    depthTarget: "D2",
    prerequisites: ["ZE01"],
    misconceptionTags: ["zig.try_propagates_not_panics", "zig.catch_does_not_unwrap"],
    keywords: ["!T", "error union", "try", "catch", "catch unreachable", "error handling", "error propagation", "T!E"],
    language: "zig"
  }),
  createNode({
    id: "ZE03",
    title: "Inferred error sets and the !ReturnType shorthand",
    track: "zig-errors",
    depthTarget: "D2",
    prerequisites: ["ZE02"],
    misconceptionTags: ["zig.inferred_error_set_grows", "zig.anyerror_vs_inferred"],
    keywords: ["inferred error set", "!ReturnType", "error set inference", "function error set", "explicit vs inferred"],
    language: "zig"
  }),
  createNode({
    id: "ZE04",
    title: "Error set coercion and combining sets with ||",
    track: "zig-errors",
    depthTarget: "D2",
    prerequisites: ["ZE01", "ZE03"],
    misconceptionTags: ["zig.error_set_merge_operator", "zig.coercion_to_superset_only"],
    keywords: ["error set coercion", "||", "error set union", "superset", "subset coercion", "merged error set"],
    language: "zig"
  }),
  createNode({
    id: "ZE05",
    title: "errdefer: conditional cleanup on error return",
    track: "zig-errors",
    depthTarget: "D2",
    prerequisites: ["ZE02", "ZF10"],
    misconceptionTags: ["zig.errdefer_only_runs_on_error", "zig.errdefer_capture_syntax"],
    keywords: ["errdefer", "conditional cleanup", "error capture", "errdefer |err|", "error path cleanup", "resource cleanup on failure"],
    language: "zig"
  }),
  createNode({
    id: "ZE06",
    title: "Error return traces: how Zig tracks error propagation through calls",
    track: "zig-errors",
    depthTarget: "D2",
    prerequisites: ["ZE02"],
    misconceptionTags: ["zig.error_trace_debug_only", "zig.try_adds_trace_frame"],
    keywords: ["error return trace", "@errorReturnTrace", "trace frame", "try adds trace", "stack trace", "debug info", "error propagation trace"],
    language: "zig"
  }),
  createNode({
    id: "ZE07",
    title: "Choosing between error unions, optionals, and sentinel values",
    track: "zig-errors",
    depthTarget: "D2",
    prerequisites: ["ZE03", "ZO01"],
    misconceptionTags: ["zig.error_vs_null_vs_sentinel_choice", "zig.error_for_recoverable_null_for_absence"],
    keywords: ["error vs null", "error union", "optional", "sentinel", "design choice", "recoverable error", "absence vs failure"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 6: Optionals (ZO01–ZO05)
// ---------------------------------------------------------------------------
const zigOptionalsNodes = [
  createNode({
    id: "ZO01",
    title: "The ?T type: optional declaration and the null literal",
    track: "zig-optionals",
    depthTarget: "D1",
    prerequisites: ["ZF02"],
    misconceptionTags: ["zig.null_is_not_zero", "zig.optional_wraps_any_type"],
    keywords: ["?T", "null", "optional", "optional declaration", "null literal", "optional equality", "non-null"],
    language: "zig"
  }),
  createNode({
    id: "ZO02",
    title: "if-capture and while-capture: if (opt) |val| syntax",
    track: "zig-optionals",
    depthTarget: "D1",
    prerequisites: ["ZO01", "ZF04"],
    misconceptionTags: ["zig.capture_is_by_value", "zig.while_capture_advances_optional"],
    keywords: ["if-capture", "if (opt) |val|", "while-capture", "optional else", "capture syntax", "payload capture", "mutable capture"],
    language: "zig"
  }),
  createNode({
    id: "ZO03",
    title: "orelse: default values, early return, and break patterns",
    track: "zig-optionals",
    depthTarget: "D1",
    prerequisites: ["ZO01", "ZF04"],
    misconceptionTags: ["zig.orelse_evaluates_right_side", "zig.orelse_vs_catch"],
    keywords: ["orelse", "default value", "early return", "orelse return", "orelse break", "orelse continue", "fallback value"],
    language: "zig"
  }),
  createNode({
    id: "ZO04",
    title: ".? unwrap: asserting non-null and panic on null",
    track: "zig-optionals",
    depthTarget: "D2",
    prerequisites: ["ZO02"],
    misconceptionTags: ["zig.unwrap_panics_in_safe_mode", "zig.unwrap_vs_catch_unreachable"],
    keywords: [".?", "unwrap", "@panic", "safety check", "unreachable", "null assertion", "forced unwrap"],
    language: "zig"
  }),
  createNode({
    id: "ZO05",
    title: "Optional pointers: ?*T, null-pointer optimization, and @sizeOf",
    track: "zig-optionals",
    depthTarget: "D2",
    prerequisites: ["ZO01", "ZP01"],
    misconceptionTags: ["zig.optional_ptr_same_size_as_ptr", "zig.null_ptr_not_zero_for_nonptr"],
    keywords: ["?*T", "null-pointer optimization", "@sizeOf", "optional pointer", "null check", "pointer nullability", "fat optional vs pointer optional"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 7: Comptime (ZC01–ZC09)
// ---------------------------------------------------------------------------
const zigComptimeNodes = [
  createNode({
    id: "ZC01",
    title: "comptime keyword: forcing compile-time evaluation",
    track: "zig-comptime",
    depthTarget: "D2",
    prerequisites: ["ZF07", "ZF08"],
    misconceptionTags: ["zig.comptime_not_like_cpp_templates", "zig.comptime_var_is_compile_time_mutable"],
    keywords: ["comptime", "comptime variable", "comptime parameter", "comptime block", "compile-time evaluation", "comptime assertion"],
    language: "zig"
  }),
  createNode({
    id: "ZC02",
    title: "type as a first-class value: anytype, type, and @TypeOf",
    track: "zig-comptime",
    depthTarget: "D2",
    prerequisites: ["ZC01"],
    misconceptionTags: ["zig.anytype_erased_at_runtime", "zig.type_value_comptime_only"],
    keywords: ["anytype", "type", "@TypeOf", "type value", "comptime type", "type parameter", "type inference"],
    language: "zig"
  }),
  createNode({
    id: "ZC03",
    title: "@typeInfo, TypeInfo, and struct field reflection",
    track: "zig-comptime",
    depthTarget: "D3",
    prerequisites: ["ZC02"],
    misconceptionTags: ["zig.typeinfo_comptime_only", "zig.typeinfo_switch_all_variants"],
    keywords: ["@typeInfo", "std.builtin.Type", "TypeInfo", "struct reflection", "field info", "declaration info", "type metadata", "std.meta"],
    language: "zig"
  }),
  createNode({
    id: "ZC04",
    title: "@hasField, @hasDecl, @field, and runtime-computed field names",
    track: "zig-comptime",
    depthTarget: "D3",
    prerequisites: ["ZC03"],
    misconceptionTags: ["zig.field_access_requires_comptime_name", "zig.hasdecl_vs_hasfield"],
    keywords: ["@hasField", "@hasDecl", "@field", "field access", "runtime field name", "declaration check", "field name string", "@hasDecl comptime"],
    language: "zig"
  }),
  createNode({
    id: "ZC05",
    title: "Generic functions: fn(comptime T: type, ...) patterns",
    track: "zig-comptime",
    depthTarget: "D2",
    prerequisites: ["ZC02"],
    misconceptionTags: ["zig.generic_fn_monomorphized", "zig.anytype_vs_comptime_T"],
    keywords: ["generic function", "comptime T: type", "monomorphization", "concrete instantiation", "anytype parameter", "generic container", "type parameter"],
    language: "zig"
  }),
  createNode({
    id: "ZC06",
    title: "Comptime duck typing: checking interface conformance at comptime",
    track: "zig-comptime",
    depthTarget: "D3",
    prerequisites: ["ZC05", "ZC04"],
    misconceptionTags: ["zig.duck_typing_no_vtable_overhead", "zig.comptime_interface_vs_tagged_union"],
    keywords: ["duck typing", "@hasDecl", "interface conformance", "comptime assertion", "std.meta.hasFn", "structural typing", "comptime check"],
    language: "zig"
  }),
  createNode({
    id: "ZC07",
    title: "inline for: iterating over comptime-known sequences",
    track: "zig-comptime",
    depthTarget: "D2",
    prerequisites: ["ZC01", "ZF04"],
    misconceptionTags: ["zig.inline_for_unrolls_loop", "zig.inline_for_tuple_vs_slice"],
    keywords: ["inline for", "comptime sequence", "tuple iteration", "std.meta.fields", "unrolled loop", "comptime array", "inline for with type"],
    language: "zig"
  }),
  createNode({
    id: "ZC08",
    title: "@embedFile: loading resources at compile time",
    track: "zig-comptime",
    depthTarget: "D2",
    prerequisites: ["ZC01"],
    misconceptionTags: ["zig.embedfile_path_relative_to_source", "zig.embedfile_returns_const_slice"],
    keywords: ["@embedFile", "compile-time resource", "embedded data", "binary embedding", "certificate embedding", "comptime data"],
    language: "zig"
  }),
  createNode({
    id: "ZC09",
    title: "Comptime evaluation limits, @compileError, and @compileLog",
    track: "zig-comptime",
    depthTarget: "D3",
    prerequisites: ["ZC05", "ZC07"],
    misconceptionTags: ["zig.compile_error_terminates_compilation", "zig.compilelog_debug_output"],
    keywords: ["@compileError", "@compileLog", "comptime limit", "evaluation depth", "compile-time assertion", "comptime debugging", "@compileError formatting"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 8: Collections (ZL01–ZL07)
// ---------------------------------------------------------------------------
const zigCollectionsNodes = [
  createNode({
    id: "ZL01",
    title: "std.ArrayList: dynamic arrays, append, remove, and toOwnedSlice",
    track: "zig-collections",
    depthTarget: "D2",
    prerequisites: ["ZM01", "ZA02"],
    misconceptionTags: ["zig.arraylist_owns_backing_memory", "zig.arraylist_invalidates_on_grow"],
    keywords: ["ArrayList", "append", "appendSlice", "orderedRemove", "swapRemove", "pop", "toOwnedSlice", "capacity", "ensureTotalCapacity"],
    language: "zig"
  }),
  createNode({
    id: "ZL02",
    title: "std.ArrayListUnmanaged: ownership-separated dynamic array",
    track: "zig-collections",
    depthTarget: "D2",
    prerequisites: ["ZL01"],
    misconceptionTags: ["zig.unmanaged_explicit_allocator_every_call", "zig.unmanaged_vs_managed_tradeoff"],
    keywords: ["ArrayListUnmanaged", "explicit allocator", "toManaged", "fromOwnedSlice", "unmanaged pattern", "ownership separation"],
    language: "zig"
  }),
  createNode({
    id: "ZL03",
    title: "std.AutoHashMap: hash tables, getOrPut, and the entry API",
    track: "zig-collections",
    depthTarget: "D2",
    prerequisites: ["ZM01", "ZF07"],
    misconceptionTags: ["zig.hashmap_invalidates_ptrs_on_grow", "zig.getorput_pointer_stability"],
    keywords: ["AutoHashMap", "put", "get", "getOrPut", "remove", "Entry", "count", "iterator", "hash map", "key-value"],
    language: "zig"
  }),
  createNode({
    id: "ZL04",
    title: "std.StringHashMap: string-keyed maps and key ownership",
    track: "zig-collections",
    depthTarget: "D2",
    prerequisites: ["ZL03", "ZA04"],
    misconceptionTags: ["zig.stringhashmap_does_not_own_keys", "zig.string_key_lifetime"],
    keywords: ["StringHashMap", "string key", "key ownership", "key lifetime", "deinit with key cleanup", "string map"],
    language: "zig"
  }),
  createNode({
    id: "ZL05",
    title: "std.ArrayHashMap: insertion-order-preserving hash map",
    track: "zig-collections",
    depthTarget: "D2",
    prerequisites: ["ZL03"],
    misconceptionTags: ["zig.arrayhashmap_ordered_by_insertion", "zig.arrayhashmap_index_access"],
    keywords: ["ArrayHashMap", "ordered iteration", "insertion order", "index-based access", "swapRemove vs orderedRemove", "array hash map"],
    language: "zig"
  }),
  createNode({
    id: "ZL06",
    title: "std.MultiArrayList: structure-of-arrays layout for cache performance",
    track: "zig-collections",
    depthTarget: "D3",
    prerequisites: ["ZL01", "ZF07"],
    misconceptionTags: ["zig.multiarraylist_soa_not_aos", "zig.multiarraylist_field_slices"],
    keywords: ["MultiArrayList", "SoA", "structure-of-arrays", "cache-friendly", "field slice", "AoS vs SoA", "per-field access"],
    language: "zig"
  }),
  createNode({
    id: "ZL07",
    title: "std.BoundedArray: fixed-capacity stack-allocated buffer",
    track: "zig-collections",
    depthTarget: "D2",
    prerequisites: ["ZA01"],
    misconceptionTags: ["zig.bounded_array_no_allocator", "zig.bounded_array_overflow_error"],
    keywords: ["BoundedArray", "fixed capacity", "stack allocated", "overflow protection", "no allocator", "slice access", "bounded buffer"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 9: I/O and Filesystem (ZI01–ZI08)
// ---------------------------------------------------------------------------
const zigIoNodes = [
  createNode({
    id: "ZI01",
    title: "std.io.Writer and Reader: the generic I/O interface model",
    track: "zig-io",
    depthTarget: "D2",
    prerequisites: ["ZP08", "ZF07"],
    misconceptionTags: ["zig.writer_is_anywriter_not_vtable", "zig.generic_writer_zero_cost"],
    keywords: ["std.io.Writer", "AnyWriter", "GenericWriter", "std.io.Reader", "I/O interface", "writer vtable", "reader context", "write method"],
    language: "zig"
  }),
  createNode({
    id: "ZI02",
    title: "Standard streams: stdout, stderr, stdin with locking",
    track: "zig-io",
    depthTarget: "D2",
    prerequisites: ["ZI01"],
    misconceptionTags: ["zig.stdout_needs_lock_for_safety", "zig.stderr_unbuffered_by_default"],
    keywords: ["std.io.getStdOut", "std.io.getStdErr", "std.io.getStdIn", ".writer()", ".lock()", "print", "stderr diagnostics", "stdout buffered"],
    language: "zig"
  }),
  createNode({
    id: "ZI03",
    title: "std.io.BufferedWriter and BufferedReader",
    track: "zig-io",
    depthTarget: "D2",
    prerequisites: ["ZI02"],
    misconceptionTags: ["zig.buffered_writer_must_flush", "zig.buffer_size_tradeoff"],
    keywords: ["BufferedWriter", "flush", "BufferedReader", "buffer size", "buffered I/O", "write batching", "read buffering"],
    language: "zig"
  }),
  createNode({
    id: "ZI04",
    title: "File I/O: openFile, createFile, reader(), writer(), and readAll",
    track: "zig-io",
    depthTarget: "D2",
    prerequisites: ["ZI02", "ZM01"],
    misconceptionTags: ["zig.file_must_be_closed", "zig.readall_allocates_caller_frees"],
    keywords: ["std.fs.cwd", "openFile", "createFile", "File.reader", "File.writer", "readAll", "writeAll", "file.close", "OpenFlags", "CreateFlags"],
    language: "zig"
  }),
  createNode({
    id: "ZI05",
    title: "Directory iteration: Dir.iterate() and recursive Walker",
    track: "zig-io",
    depthTarget: "D2",
    prerequisites: ["ZI04"],
    misconceptionTags: ["zig.dir_iterator_entry_lifetime", "zig.walker_allocation_per_entry"],
    keywords: ["Dir.openDir", "Dir.iterate", "IterableDir", "Walker", "recursive walk", "dir entry", "entry.kind", "entry.name"],
    language: "zig"
  }),
  createNode({
    id: "ZI06",
    title: "std.fs.path: join, dirname, basename, extension, and resolve",
    track: "zig-io",
    depthTarget: "D2",
    prerequisites: ["ZA04", "ZM01"],
    misconceptionTags: ["zig.path_join_allocates", "zig.path_resolve_vs_join"],
    keywords: ["std.fs.path.join", "dirname", "basename", "extension", "isAbsolute", "resolve", "path manipulation", "path separator"],
    language: "zig"
  }),
  createNode({
    id: "ZI07",
    title: "std.process: args, ArgIterator, getEnvVarOwned, and exit",
    track: "zig-io",
    depthTarget: "D2",
    prerequisites: ["ZA04", "ZM01"],
    misconceptionTags: ["zig.args_first_is_executable", "zig.env_var_owned_must_free"],
    keywords: ["std.process.args", "ArgIterator", "getEnvVarOwned", "std.process.exit", "command-line args", "environment variable", "process args"],
    language: "zig"
  }),
  createNode({
    id: "ZI08",
    title: "Spawning child processes: std.process.Child and stdio pipes",
    track: "zig-io",
    depthTarget: "D3",
    prerequisites: ["ZI07", "ZM01"],
    misconceptionTags: ["zig.child_process_must_wait", "zig.pipe_deadlock_buffering"],
    keywords: ["std.process.Child", "stdin pipe", "stdout pipe", "stderr pipe", "wait", "kill", "Term", "child.spawn", "child.wait"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 10: Concurrency (ZT01–ZT07)
// ---------------------------------------------------------------------------
const zigConcurrencyNodes = [
  createNode({
    id: "ZT01",
    title: "std.Thread: spawn, join, detach, and thread lifecycle",
    track: "zig-concurrency",
    depthTarget: "D2",
    prerequisites: ["ZM01", "ZF07"],
    misconceptionTags: ["zig.thread_stack_size_default", "zig.detach_means_no_join"],
    keywords: ["Thread.spawn", "Thread.join", "Thread.detach", "thread function", "thread ID", "SpawnConfig", "thread lifecycle"],
    language: "zig"
  }),
  createNode({
    id: "ZT02",
    title: "std.Thread.Mutex: exclusive access and deadlock avoidance",
    track: "zig-concurrency",
    depthTarget: "D2",
    prerequisites: ["ZT01"],
    misconceptionTags: ["zig.mutex_not_recursive", "zig.mutex_lock_blocks_thread"],
    keywords: ["Mutex.lock", "Mutex.unlock", "Mutex.tryLock", "deadlock", "protected data", "critical section", "mutex guard pattern"],
    language: "zig"
  }),
  createNode({
    id: "ZT03",
    title: "std.Thread.Condition: condition variables and signalling",
    track: "zig-concurrency",
    depthTarget: "D3",
    prerequisites: ["ZT02"],
    misconceptionTags: ["zig.spurious_wakeup_condition", "zig.signal_before_wait_missed"],
    keywords: ["Condition.wait", "Condition.signal", "Condition.broadcast", "spurious wakeup", "predicate loop", "producer-consumer", "condition variable"],
    language: "zig"
  }),
  createNode({
    id: "ZT04",
    title: "std.Thread.RwLock: reader-writer locking",
    track: "zig-concurrency",
    depthTarget: "D3",
    prerequisites: ["ZT02"],
    misconceptionTags: ["zig.rwlock_writer_starvation", "zig.shared_lock_multiple_readers"],
    keywords: ["RwLock.lockShared", "lockExclusive", "tryLockShared", "reader-writer lock", "shared access", "exclusive access", "write starvation"],
    language: "zig"
  }),
  createNode({
    id: "ZT05",
    title: "std.atomic.Value: atomic operations and memory ordering",
    track: "zig-concurrency",
    depthTarget: "D3",
    prerequisites: ["ZT01"],
    misconceptionTags: ["zig.atomic_memory_ordering_confusion", "zig.lock_free_not_wait_free"],
    keywords: ["std.atomic.Value", "load", "store", "compareAndSwap", "fetchAdd", "memory ordering", ".SeqCst", ".Acquire", ".Release", "lock-free"],
    language: "zig"
  }),
  createNode({
    id: "ZT06",
    title: "std.Thread.WaitGroup: fan-out/fan-in coordination",
    track: "zig-concurrency",
    depthTarget: "D2",
    prerequisites: ["ZT01"],
    misconceptionTags: ["zig.waitgroup_start_before_spawn", "zig.waitgroup_finish_from_thread"],
    keywords: ["WaitGroup.start", "WaitGroup.finish", "WaitGroup.wait", "fan-out", "fan-in", "parallel tasks", "barrier synchronization"],
    language: "zig"
  }),
  createNode({
    id: "ZT07",
    title: "Thread pool patterns: fixed pool with work queue dispatch",
    track: "zig-concurrency",
    depthTarget: "D3",
    prerequisites: ["ZT02", "ZT03", "ZL01"],
    misconceptionTags: ["zig.thread_pool_queue_backpressure", "zig.poison_pill_shutdown_pattern"],
    keywords: ["thread pool", "work queue", "fixed pool", "dispatch", "shutdown signal", "poison pill", "worker thread", "task queue"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 11: C Interop (ZX01–ZX06)
// ---------------------------------------------------------------------------
const zigCInteropNodes = [
  createNode({
    id: "ZX01",
    title: "@cImport and @cInclude: consuming C headers in Zig",
    track: "zig-c-interop",
    depthTarget: "D2",
    prerequisites: ["ZF07", "ZP04"],
    misconceptionTags: ["zig.cimport_translate_not_wrap", "zig.cimport_comptime_only"],
    keywords: ["@cImport", "@cInclude", "@cDefine", "translate-c", "C header", "C types", "C constants", "C functions from Zig"],
    language: "zig"
  }),
  createNode({
    id: "ZX02",
    title: "extern functions and variables: linking to C libraries",
    track: "zig-c-interop",
    depthTarget: "D2",
    prerequisites: ["ZX01"],
    misconceptionTags: ["zig.extern_fn_no_body", "zig.link_libc_required"],
    keywords: ["extern fn", "extern var", "linkage", "-lc", "shared library", "link library", "symbol resolution", "extern declaration"],
    language: "zig"
  }),
  createNode({
    id: "ZX03",
    title: "C calling convention: callconv(.C), export fn, and ABI matching",
    track: "zig-c-interop",
    depthTarget: "D2",
    prerequisites: ["ZX02", "ZP06"],
    misconceptionTags: ["zig.callconv_c_for_ffi", "zig.export_exposes_to_c"],
    keywords: ["callconv(.C)", "export fn", "ABI", "calling convention", "C ABI", "function export", "FFI", "cdecl"],
    language: "zig"
  }),
  createNode({
    id: "ZX04",
    title: "C strings vs Zig slices: std.mem.span and null termination",
    track: "zig-c-interop",
    depthTarget: "D2",
    prerequisites: ["ZX01", "ZP04"],
    misconceptionTags: ["zig.cstring_needs_span_to_slice", "zig.zig_slice_not_null_terminated"],
    keywords: ["[*:0]u8", "std.mem.span", "std.mem.sliceTo", "C string", "null-terminated", "Zig-to-C string", "C-to-Zig string"],
    language: "zig"
  }),
  createNode({
    id: "ZX05",
    title: "Packed and extern structs: C-compatible data layouts",
    track: "zig-c-interop",
    depthTarget: "D3",
    prerequisites: ["ZX03", "ZP06"],
    misconceptionTags: ["zig.extern_struct_c_layout", "zig.packed_struct_bit_level_layout"],
    keywords: ["extern struct", "packed struct", "C-compatible", "data layout", "bitOffsetOf", "bit-field", "struct alignment", "ABI compatibility"],
    language: "zig"
  }),
  createNode({
    id: "ZX06",
    title: "translate-c: automatic C-to-Zig translation and wrapping",
    track: "zig-c-interop",
    depthTarget: "D2",
    prerequisites: ["ZX02", "ZX04"],
    misconceptionTags: ["zig.translate_c_imperfect", "zig.wrapping_c_with_zig_idioms"],
    keywords: ["translate-c", "zig translate-c", "C-to-Zig", "wrapper", "idiomatic wrapping", "macro translation", "header translation"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 12: Build and Testing (ZB01–ZB07)
// ---------------------------------------------------------------------------
const zigBuildTestNodes = [
  createNode({
    id: "ZB01",
    title: "std.testing: expect, expectEqual, expectError, and expectEqualSlices",
    track: "zig-build-test",
    depthTarget: "D1",
    prerequisites: ["ZF04"],
    misconceptionTags: ["zig.testing_expect_returns_error", "zig.expectequal_deep_vs_pointer"],
    keywords: ["std.testing.expect", "expectEqual", "expectEqualStrings", "expectError", "expectEqualSlices", "test assertion", "testing framework"],
    language: "zig"
  }),
  createNode({
    id: "ZB02",
    title: "Test blocks, test names, selective running, and refAllDecls",
    track: "zig-build-test",
    depthTarget: "D1",
    prerequisites: ["ZB01", "ZE02"],
    misconceptionTags: ["zig.test_block_must_handle_errors", "zig.refalldecls_for_dead_code"],
    keywords: ["test \"name\"", "zig build test", "test filter", "refAllDecls", "test organization", "selective testing", "test binary"],
    language: "zig"
  }),
  createNode({
    id: "ZB03",
    title: "std.testing.allocator and automatic memory leak detection in tests",
    track: "zig-build-test",
    depthTarget: "D2",
    prerequisites: ["ZB01", "ZM01"],
    misconceptionTags: ["zig.test_allocator_panics_on_leak", "zig.test_allocator_debug_builds_only"],
    keywords: ["std.testing.allocator", "detectLeaks", "memory leak", "test allocator", "leak detection", "allocator in test", "deinit in test"],
    language: "zig"
  }),
  createNode({
    id: "ZB04",
    title: "build.zig fundamentals: addExecutable, addStaticLibrary, installArtifact",
    track: "zig-build-test",
    depthTarget: "D2",
    prerequisites: ["ZF07"],
    misconceptionTags: ["zig.build_zig_is_zig_code", "zig.artifact_not_built_without_install"],
    keywords: ["b.addExecutable", "b.addStaticLibrary", "b.installArtifact", "std.Build", "root_source_file", "b.path", "artifact", "build graph"],
    language: "zig"
  }),
  createNode({
    id: "ZB05",
    title: "Build steps and dependencies: b.step and step.dependOn",
    track: "zig-build-test",
    depthTarget: "D2",
    prerequisites: ["ZB04"],
    misconceptionTags: ["zig.step_dependon_ordering", "zig.run_step_vs_install_step"],
    keywords: ["b.step", "dependOn", "custom step", "run step", "install step", "build dependency", "build DAG", "phased build"],
    language: "zig"
  }),
  createNode({
    id: "ZB06",
    title: "Optimize modes: Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall",
    track: "zig-build-test",
    depthTarget: "D2",
    prerequisites: ["ZB04"],
    misconceptionTags: ["zig.releasesafe_still_checks_overflow", "zig.releasefast_disables_safety"],
    keywords: ["Debug", "ReleaseSafe", "ReleaseFast", "ReleaseSmall", "b.standardOptimizeOption", "-Doptimize=", "optimization", "safety checks", "undefined behavior"],
    language: "zig"
  }),
  createNode({
    id: "ZB07",
    title: "build.zig.zon: package manifests, b.dependency, and zig fetch",
    track: "zig-build-test",
    depthTarget: "D2",
    prerequisites: ["ZB04"],
    misconceptionTags: ["zig.zon_hash_required", "zig.dependency_module_vs_artifact"],
    keywords: [".zig-pkg", "build.zig.zon", "b.dependency", "zig fetch", "package manager", "dependency hash", "module import", "upstream package"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 13: Low-Level and Unsafe (ZU01–ZU07)
// ---------------------------------------------------------------------------
const zigUnsafeNodes = [
  createNode({
    id: "ZU01",
    title: "@bitCast: reinterpreting bytes between same-size types",
    track: "zig-unsafe",
    depthTarget: "D3",
    prerequisites: ["ZP06", "ZF02"],
    misconceptionTags: ["zig.bitcast_requires_same_size", "zig.bitcast_endianness_dependent"],
    keywords: ["@bitCast", "byte reinterpretation", "integer-float reinterpret", "endianness", "same-size types", "type punning"],
    language: "zig"
  }),
  createNode({
    id: "ZU02",
    title: "@ptrCast and @alignCast: unsafe pointer reinterpretation",
    track: "zig-unsafe",
    depthTarget: "D3",
    prerequisites: ["ZP06", "ZU01"],
    misconceptionTags: ["zig.ptrcast_skips_type_safety", "zig.aligncast_runtime_trap"],
    keywords: ["@ptrCast", "@alignCast", "unsafe cast", "pointer reinterpretation", "alignment assertion", "type safety bypass"],
    language: "zig"
  }),
  createNode({
    id: "ZU03",
    title: "Packed integers and packed structs: bit-field layout patterns",
    track: "zig-unsafe",
    depthTarget: "D3",
    prerequisites: ["ZU01", "ZF07"],
    misconceptionTags: ["zig.packed_struct_alignment_1", "zig.packed_int_range_u1_to_u127"],
    keywords: ["packed integer", "u1", "u3", "u7", "packed struct", "@bitSizeOf", "bit-field", "bitOffsetOf", "layout guarantee"],
    language: "zig"
  }),
  createNode({
    id: "ZU04",
    title: "@Vector and SIMD: data-parallel arithmetic operations",
    track: "zig-unsafe",
    depthTarget: "D3",
    prerequisites: ["ZU01", "ZA01"],
    misconceptionTags: ["zig.vector_element_count_power_of_two", "zig.vector_shuffle_index_semantics"],
    keywords: ["@Vector(N, T)", "SIMD", "element-wise", "@shuffle", "@select", "vector reduction", "std.simd", "vectorized arithmetic"],
    language: "zig"
  }),
  createNode({
    id: "ZU05",
    title: "Volatile and memory-mapped I/O: hardware register access",
    track: "zig-unsafe",
    depthTarget: "D3",
    prerequisites: ["ZP06", "ZU01"],
    misconceptionTags: ["zig.volatile_not_atomic", "zig.volatile_prevents_optimization"],
    keywords: ["volatile", "memory-mapped I/O", "hardware register", "@as(*volatile T)", "barrier", "mmio", "embedded register"],
    language: "zig"
  }),
  createNode({
    id: "ZU06",
    title: "Inline assembly: asm volatile() syntax, inputs, outputs, and clobbers",
    track: "zig-unsafe",
    depthTarget: "D3",
    prerequisites: ["ZU05"],
    misconceptionTags: ["zig.asm_constraint_syntax", "zig.asm_clobber_register"],
    keywords: ["asm volatile()", "inline assembly", "input constraint", "output constraint", "clobber", "register constraint", "x86 asm", "ARM asm"],
    language: "zig"
  }),
  createNode({
    id: "ZU07",
    title: "@memcpy, @memset, @memmove, and noalias semantics",
    track: "zig-unsafe",
    depthTarget: "D2",
    prerequisites: ["ZP03", "ZM01"],
    misconceptionTags: ["zig.memcpy_noalias_requirement", "zig.memset_value_is_u8"],
    keywords: ["@memcpy", "@memset", "@memmove", "noalias", "bulk memory", "memory copy", "memory set", "overlap semantics"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Track 14: Advanced Metaprogramming (ZG01–ZG05)
// ---------------------------------------------------------------------------
const zigMetaprogrammingNodes = [
  createNode({
    id: "ZG01",
    title: "Comptime interfaces: defining and enforcing trait-like contracts",
    track: "zig-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["ZC06"],
    misconceptionTags: ["zig.comptime_interface_vs_vtable", "zig.interface_checked_per_instantiation"],
    keywords: ["comptime interface", "@hasDecl", "interface assertion", "trait-like", "structural typing", "interface checking", "comptime contract"],
    language: "zig"
  }),
  createNode({
    id: "ZG02",
    title: "Automatic struct generation with @Type and TypeInfo.Struct",
    track: "zig-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["ZC03", "ZG01"],
    misconceptionTags: ["zig.type_construction_comptime_only", "zig.generated_struct_field_names"],
    keywords: ["@Type", "TypeInfo.Struct", "struct generation", "field merging", "generated type", "comptime struct builder", "synthesized type"],
    language: "zig"
  }),
  createNode({
    id: "ZG03",
    title: "Struct field reflection and comptime string manipulation",
    track: "zig-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["ZC04", "ZC07"],
    misconceptionTags: ["zig.field_name_is_comptime_string", "zig.meta_fields_returns_comptime_slice"],
    keywords: ["std.meta.fields", "field name string", "comptime string", "field iteration", "field type", "declaration iteration", "comptime reflection"],
    language: "zig"
  }),
  createNode({
    id: "ZG04",
    title: "Tagged union dispatch via comptime: type-indexed switch tables",
    track: "zig-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["ZF09", "ZC05", "ZG01"],
    misconceptionTags: ["zig.union_dispatch_vs_vtable", "zig.comptime_switch_generates_code"],
    keywords: ["tagged union dispatch", "type-indexed switch", "comptime switch table", "exhaustive dispatch", "union(enum) dispatch", "sum type dispatch"],
    language: "zig"
  }),
  createNode({
    id: "ZG05",
    title: "@compileError, @compileLog, and compile-time assertion strategies",
    track: "zig-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["ZC09"],
    misconceptionTags: ["zig.compileerror_stops_all_compilation", "zig.compilelog_not_print"],
    keywords: ["@compileError", "@compileLog", "compile-time assertion", "static assertion", "comptime debugging", "build-time validation", "type constraint enforcement"],
    language: "zig"
  })
];

// ---------------------------------------------------------------------------
// Graph assembly
// ---------------------------------------------------------------------------

const nodes = [
  ...zigFoundationsNodes,
  ...zigPointersNodes,
  ...zigMemoryNodes,
  ...zigArraysStringsNodes,
  ...zigErrorsNodes,
  ...zigOptionalsNodes,
  ...zigComptimeNodes,
  ...zigCollectionsNodes,
  ...zigIoNodes,
  ...zigConcurrencyNodes,
  ...zigCInteropNodes,
  ...zigBuildTestNodes,
  ...zigUnsafeNodes,
  ...zigMetaprogrammingNodes
];

const tracks = {
  "zig-foundations": {
    id: "zig-foundations",
    title: "Zig Language Foundations",
    nodeIds: zigFoundationsNodes.map((n) => n.id)
  },
  "zig-pointers": {
    id: "zig-pointers",
    title: "Zig Pointers and Slices",
    nodeIds: zigPointersNodes.map((n) => n.id)
  },
  "zig-memory": {
    id: "zig-memory",
    title: "Zig Memory and Allocators",
    nodeIds: zigMemoryNodes.map((n) => n.id)
  },
  "zig-arrays-strings": {
    id: "zig-arrays-strings",
    title: "Zig Arrays and Strings",
    nodeIds: zigArraysStringsNodes.map((n) => n.id)
  },
  "zig-errors": {
    id: "zig-errors",
    title: "Zig Error Handling",
    nodeIds: zigErrorsNodes.map((n) => n.id)
  },
  "zig-optionals": {
    id: "zig-optionals",
    title: "Zig Optionals",
    nodeIds: zigOptionalsNodes.map((n) => n.id)
  },
  "zig-comptime": {
    id: "zig-comptime",
    title: "Zig Comptime",
    nodeIds: zigComptimeNodes.map((n) => n.id)
  },
  "zig-collections": {
    id: "zig-collections",
    title: "Zig Collections",
    nodeIds: zigCollectionsNodes.map((n) => n.id)
  },
  "zig-io": {
    id: "zig-io",
    title: "Zig I/O and Filesystem",
    nodeIds: zigIoNodes.map((n) => n.id)
  },
  "zig-concurrency": {
    id: "zig-concurrency",
    title: "Zig Concurrency",
    nodeIds: zigConcurrencyNodes.map((n) => n.id)
  },
  "zig-c-interop": {
    id: "zig-c-interop",
    title: "Zig C Interop",
    nodeIds: zigCInteropNodes.map((n) => n.id)
  },
  "zig-build-test": {
    id: "zig-build-test",
    title: "Zig Build System and Testing",
    nodeIds: zigBuildTestNodes.map((n) => n.id)
  },
  "zig-unsafe": {
    id: "zig-unsafe",
    title: "Zig Low-Level and Unsafe",
    nodeIds: zigUnsafeNodes.map((n) => n.id)
  },
  "zig-metaprogramming": {
    id: "zig-metaprogramming",
    title: "Zig Advanced Metaprogramming",
    nodeIds: zigMetaprogrammingNodes.map((n) => n.id)
  }
};

export const zigCurriculum = createCurriculumGraph(nodes, tracks);
