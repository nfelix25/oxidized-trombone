import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// Track: Language Foundations (PF01–PF10)
// Entry point for the entire Python curriculum. PF01 has no prerequisites.
// ---------------------------------------------------------------------------
const foundationsNodes = [
  createNode({
    id: "PF01",
    title: "Variables, assignment, and names",
    language: "python",
    track: "python-foundations",
    depthTarget: "D1",
    prerequisites: [],
    keywords: ["variable", "assignment", "rebinding", "name", "identifier", "object", "reference", "dynamic typing"],
    misconceptionTags: ["python.variables_are_labels_not_boxes", "python.assignment_does_not_copy"]
  }),
  createNode({
    id: "PF02",
    title: "Numeric types: int, float, complex, and arithmetic operators",
    language: "python",
    track: "python-foundations",
    depthTarget: "D1",
    prerequisites: ["PF01"],
    keywords: ["int", "float", "complex", "//", "**", "%", "divmod", "abs", "round", "arithmetic", "integer division", "modulo"],
    misconceptionTags: ["python.integer_division_truncates_toward_negative_infinity", "python.float_precision_is_limited"]
  }),
  createNode({
    id: "PF03",
    title: "Strings: literals, indexing, slicing, and common methods",
    language: "python",
    track: "python-foundations",
    depthTarget: "D1",
    prerequisites: ["PF01"],
    keywords: ["str", "f-string", "format", "slice", ".upper", ".lower", ".strip", ".split", ".join", ".replace", "indexing", "string literal"],
    misconceptionTags: ["python.strings_are_immutable", "python.fstring_requires_python36"]
  }),
  createNode({
    id: "PF04",
    title: "Booleans, None, truthiness, and comparison operators",
    language: "python",
    track: "python-foundations",
    depthTarget: "D1",
    prerequisites: ["PF01"],
    keywords: ["bool", "None", "truthiness", "falsy", "and", "or", "not", "is", "==", "comparison", "identity"],
    misconceptionTags: ["python.is_checks_identity_not_equality", "python.none_is_not_false"]
  }),
  createNode({
    id: "PF05",
    title: "Control flow: if, elif, else, and conditional expressions",
    language: "python",
    track: "python-foundations",
    depthTarget: "D1",
    prerequisites: ["PF04"],
    keywords: ["if", "elif", "else", "ternary", "conditional expression", "control flow", "branching"],
    misconceptionTags: ["python.elif_not_else_if", "python.ternary_order_is_value_if_condition_else_other"]
  }),
  createNode({
    id: "PF06",
    title: "Loops: for, while, break, continue, and else on loops",
    language: "python",
    track: "python-foundations",
    depthTarget: "D1",
    prerequisites: ["PF05"],
    keywords: ["for", "while", "break", "continue", "range", "enumerate", "loop else", "iteration"],
    misconceptionTags: ["python.loop_else_runs_when_no_break", "python.range_is_lazy"]
  }),
  createNode({
    id: "PF07",
    title: "Functions: def, parameters, return values, and scope",
    language: "python",
    track: "python-foundations",
    depthTarget: "D1",
    prerequisites: ["PF05"],
    keywords: ["def", "return", "global", "local", "nonlocal", "scope", "parameter", "argument", "function call"],
    misconceptionTags: ["python.functions_return_none_implicitly", "python.scope_is_lexical_not_dynamic"]
  }),
  createNode({
    id: "PF08",
    title: "Default arguments, *args, and **kwargs",
    language: "python",
    track: "python-foundations",
    depthTarget: "D2",
    prerequisites: ["PF07"],
    keywords: ["default argument", "*args", "**kwargs", "keyword argument", "positional argument", "variadic", "unpacking"],
    misconceptionTags: ["python.mutable_default_argument_is_shared", "python.args_is_a_tuple_not_list"]
  }),
  createNode({
    id: "PF09",
    title: "Lambda functions, closures, and nonlocal",
    language: "python",
    track: "python-foundations",
    depthTarget: "D2",
    prerequisites: ["PF07"],
    keywords: ["lambda", "closure", "free variable", "nonlocal", "higher-order", "anonymous function"],
    misconceptionTags: ["python.lambda_captures_by_reference", "python.closure_cell_is_mutable"]
  }),
  createNode({
    id: "PF10",
    title: "Comprehensions: list, dict, set, and generator expressions",
    language: "python",
    track: "python-foundations",
    depthTarget: "D2",
    prerequisites: ["PF06", "PF07"],
    keywords: ["list comprehension", "dict comprehension", "set comprehension", "generator expression", "filter", "nested comprehension"],
    misconceptionTags: ["python.generator_expression_is_lazy", "python.comprehension_has_own_scope"]
  })
];

// ---------------------------------------------------------------------------
// Track: Data Structures (PD01–PD08)
// ---------------------------------------------------------------------------
const dataStructuresNodes = [
  createNode({
    id: "PD01",
    title: "Lists: indexing, slicing, mutation, and list methods",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D1",
    prerequisites: ["PF06"],
    keywords: ["list", "append", "extend", "insert", "remove", "pop", "sort", "reverse", "negative index", "slice step", "in"],
    misconceptionTags: ["python.list_sort_is_in_place", "python.list_copy_is_shallow"]
  }),
  createNode({
    id: "PD02",
    title: "Tuples: immutability, packing, unpacking, and starred assignment",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D1",
    prerequisites: ["PD01"],
    keywords: ["tuple", "immutable", "packing", "unpacking", "starred", "*rest", "destructuring"],
    misconceptionTags: ["python.tuple_with_one_element_needs_trailing_comma", "python.tuple_immutability_is_shallow"]
  }),
  createNode({
    id: "PD03",
    title: "Dictionaries: CRUD operations, iteration, and dict merging (| and **)",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D2",
    prerequisites: ["PF06"],
    keywords: ["dict", "get", "setdefault", "items", "keys", "values", "update", "| merge", "** unpack", "CRUD", "iteration"],
    misconceptionTags: ["python.dict_preserves_insertion_order_py37", "python.dict_get_returns_none_not_keyerror"]
  }),
  createNode({
    id: "PD04",
    title: "Sets: creation, frozenset, and set operations (union, intersection, difference)",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D1",
    prerequisites: ["PF06"],
    keywords: ["set", "frozenset", "add", "discard", "union", "intersection", "difference", "symmetric_difference", "set literal"],
    misconceptionTags: ["python.empty_braces_make_dict_not_set", "python.set_elements_must_be_hashable"]
  }),
  createNode({
    id: "PD05",
    title: "collections.namedtuple and typing.NamedTuple",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D2",
    prerequisites: ["PD02"],
    keywords: ["namedtuple", "NamedTuple", "_replace", "_asdict", "_fields", "collections", "typed fields"],
    misconceptionTags: ["python.namedtuple_is_immutable_like_tuple", "python.namedtuple_vs_dataclass_tradeoffs"]
  }),
  createNode({
    id: "PD06",
    title: "collections.deque, Counter, and defaultdict",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D2",
    prerequisites: ["PD01", "PD03"],
    keywords: ["deque", "appendleft", "popleft", "rotate", "Counter", "most_common", "defaultdict", "collections"],
    misconceptionTags: ["python.deque_is_O1_for_both_ends", "python.counter_inherits_from_dict"]
  }),
  createNode({
    id: "PD07",
    title: "collections.OrderedDict and ChainMap",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D2",
    prerequisites: ["PD03"],
    keywords: ["OrderedDict", "move_to_end", "ChainMap", "layered lookup", "collections"],
    misconceptionTags: ["python.ordereddict_remembers_insertion_order_explicitly", "python.chainmap_does_not_merge_dicts"]
  }),
  createNode({
    id: "PD08",
    title: "heapq and bisect: priority queues and binary search",
    language: "python",
    track: "python-data-structures",
    depthTarget: "D2",
    prerequisites: ["PD01"],
    keywords: ["heapq", "heappush", "heappop", "heapify", "bisect_left", "bisect_right", "insort", "priority queue", "binary search"],
    misconceptionTags: ["python.heapq_is_min_heap", "python.bisect_requires_sorted_list"]
  })
];

// ---------------------------------------------------------------------------
// Track: OOP (PO01–PO09)
// ---------------------------------------------------------------------------
const oopNodes = [
  createNode({
    id: "PO01",
    title: "Classes: __init__, self, instance attributes, and class attributes",
    language: "python",
    track: "python-oop",
    depthTarget: "D1",
    prerequisites: ["PF07"],
    keywords: ["class", "__init__", "self", "instance attribute", "class attribute", "object", "instantiation"],
    misconceptionTags: ["python.self_is_not_special_keyword", "python.class_attributes_are_shared"]
  }),
  createNode({
    id: "PO02",
    title: "Instance methods, class methods (@classmethod), and static methods (@staticmethod)",
    language: "python",
    track: "python-oop",
    depthTarget: "D2",
    prerequisites: ["PO01"],
    keywords: ["@classmethod", "cls", "@staticmethod", "instance method", "isinstance", "issubclass", "method types"],
    misconceptionTags: ["python.classmethod_receives_class_not_instance", "python.staticmethod_has_no_implicit_first_arg"]
  }),
  createNode({
    id: "PO03",
    title: "Inheritance, super(), and method resolution",
    language: "python",
    track: "python-oop",
    depthTarget: "D2",
    prerequisites: ["PO01"],
    keywords: ["inheritance", "super", "method resolution", "subclass", "override", "isinstance", "issubclass"],
    misconceptionTags: ["python.super_is_not_parent_class_directly", "python.super_uses_mro"]
  }),
  createNode({
    id: "PO04",
    title: "Multiple inheritance and the Method Resolution Order (MRO)",
    language: "python",
    track: "python-oop",
    depthTarget: "D2",
    prerequisites: ["PO03"],
    keywords: ["multiple inheritance", "__mro__", "method resolution order", "C3 linearization", "diamond inheritance", "mro()"],
    misconceptionTags: ["python.mro_is_depth_first_left_to_right_with_c3", "python.diamond_problem_is_resolved_by_mro"]
  }),
  createNode({
    id: "PO05",
    title: "Dunder methods: __str__, __repr__, __eq__, __hash__, and __bool__",
    language: "python",
    track: "python-oop",
    depthTarget: "D2",
    prerequisites: ["PO01"],
    keywords: ["__str__", "__repr__", "__eq__", "__hash__", "__bool__", "dunder", "magic method", "operator overloading"],
    misconceptionTags: ["python.defining_eq_without_hash_makes_unhashable", "python.repr_is_for_developers_str_for_users"]
  }),
  createNode({
    id: "PO06",
    title: "Sequence protocol: __len__, __getitem__, __iter__, __contains__, and __reversed__",
    language: "python",
    track: "python-oop",
    depthTarget: "D2",
    prerequisites: ["PO01", "PD01"],
    keywords: ["__len__", "__getitem__", "__setitem__", "__delitem__", "__iter__", "__next__", "__contains__", "__reversed__", "sequence protocol"],
    misconceptionTags: ["python.sequence_protocol_enables_for_loop", "python.iter_and_next_are_separate_protocols"]
  }),
  createNode({
    id: "PO07",
    title: "@property: getters, setters, and deleters",
    language: "python",
    track: "python-oop",
    depthTarget: "D2",
    prerequisites: ["PO01"],
    keywords: ["@property", "getter", "setter", "deleter", "property descriptor", "encapsulation"],
    misconceptionTags: ["python.property_setter_must_use_same_name", "python.property_is_a_descriptor"]
  }),
  createNode({
    id: "PO08",
    title: "__slots__: restricting instance attributes and memory savings",
    language: "python",
    track: "python-oop",
    depthTarget: "D2",
    prerequisites: ["PO01"],
    keywords: ["__slots__", "instance attributes", "memory", "__dict__", "slot descriptor", "memory optimization"],
    misconceptionTags: ["python.slots_disables_instance_dict", "python.slots_require_explicit_list"]
  }),
  createNode({
    id: "PO09",
    title: "Abstract base classes: abc module, ABC, abstractmethod, and register",
    language: "python",
    track: "python-oop",
    depthTarget: "D3",
    prerequisites: ["PO03"],
    keywords: ["ABC", "abstractmethod", "register", "@abc.abstractmethod", "abc module", "abstract class", "virtual subclass"],
    misconceptionTags: ["python.abc_cannot_be_instantiated_directly", "python.register_does_not_check_implementation"]
  })
];

// ---------------------------------------------------------------------------
// Track: Iterators and Generators (PI01–PI06)
// ---------------------------------------------------------------------------
const iteratorsNodes = [
  createNode({
    id: "PI01",
    title: "The iterator protocol: __iter__ and __next__, and StopIteration",
    language: "python",
    track: "python-iterators",
    depthTarget: "D2",
    prerequisites: ["PO01"],
    keywords: ["iterator", "iterable", "__iter__", "__next__", "StopIteration", "protocol", "for loop internals"],
    misconceptionTags: ["python.iterable_is_not_iterator", "python.stopiteration_signals_exhaustion"]
  }),
  createNode({
    id: "PI02",
    title: "Generator functions: yield, generator state, and send()",
    language: "python",
    track: "python-iterators",
    depthTarget: "D2",
    prerequisites: ["PF07", "PF06"],
    keywords: ["generator", "yield", "send", "throw", "close", "generator state", "lazy evaluation", "coroutine"],
    misconceptionTags: ["python.yield_suspends_function_execution", "python.generator_is_single_use"]
  }),
  createNode({
    id: "PI03",
    title: "yield from and generator delegation",
    language: "python",
    track: "python-iterators",
    depthTarget: "D3",
    prerequisites: ["PI02"],
    keywords: ["yield from", "delegation", "sub-generator", "generator chaining", "transparent delegation"],
    misconceptionTags: ["python.yield_from_propagates_send_and_throw", "python.yield_from_captures_stopiteration_value"]
  }),
  createNode({
    id: "PI04",
    title: "Generator expressions and lazy evaluation",
    language: "python",
    track: "python-iterators",
    depthTarget: "D2",
    prerequisites: ["PF10", "PI02"],
    keywords: ["generator expression", "lazy", "memory efficient", "genexpr", "deferred computation"],
    misconceptionTags: ["python.genexpr_is_not_evaluated_eagerly", "python.genexpr_vs_list_comprehension_memory"]
  }),
  createNode({
    id: "PI05",
    title: "itertools: chain, product, combinations, permutations, and groupby",
    language: "python",
    track: "python-iterators",
    depthTarget: "D2",
    prerequisites: ["PI02"],
    keywords: ["itertools.chain", "itertools.product", "itertools.combinations", "itertools.permutations", "itertools.groupby", "itertools.islice", "itertools.takewhile", "itertools.dropwhile"],
    misconceptionTags: ["python.groupby_requires_sorted_input", "python.itertools_functions_are_lazy"]
  }),
  createNode({
    id: "PI06",
    title: "functools: reduce, partial, lru_cache, and cached_property",
    language: "python",
    track: "python-iterators",
    depthTarget: "D2",
    prerequisites: ["PF09", "PI02"],
    keywords: ["functools.reduce", "functools.partial", "functools.lru_cache", "functools.cached_property", "@cache", "memoization", "partial application"],
    misconceptionTags: ["python.lru_cache_requires_hashable_arguments", "python.partial_creates_new_callable"]
  })
];

// ---------------------------------------------------------------------------
// Track: Error Handling (PE01–PE06)
// ---------------------------------------------------------------------------
const errorsNodes = [
  createNode({
    id: "PE01",
    title: "try, except, else, and finally: exception handling flow",
    language: "python",
    track: "python-errors",
    depthTarget: "D1",
    prerequisites: ["PF05"],
    keywords: ["try", "except", "else", "finally", "exception", "traceback", "error handling"],
    misconceptionTags: ["python.finally_always_runs", "python.except_else_runs_when_no_exception"]
  }),
  createNode({
    id: "PE02",
    title: "Exception hierarchy: BaseException, Exception, and catching multiple types",
    language: "python",
    track: "python-errors",
    depthTarget: "D2",
    prerequisites: ["PE01"],
    keywords: ["BaseException", "Exception", "ValueError", "TypeError", "KeyError", "IndexError", "AttributeError", "OSError", "RuntimeError", "StopIteration", "exception hierarchy"],
    misconceptionTags: ["python.catching_baseexception_catches_keyboard_interrupt", "python.bare_except_is_different_from_except_exception"]
  }),
  createNode({
    id: "PE03",
    title: "raise, raise from, and exception chaining",
    language: "python",
    track: "python-errors",
    depthTarget: "D2",
    prerequisites: ["PE02"],
    keywords: ["raise", "raise ... from", "__cause__", "__context__", "__suppress_context__", "exception chaining", "re-raise"],
    misconceptionTags: ["python.raise_from_none_suppresses_context", "python.bare_raise_reraises_current_exception"]
  }),
  createNode({
    id: "PE04",
    title: "Custom exception classes: subclassing Exception and adding attributes",
    language: "python",
    track: "python-errors",
    depthTarget: "D2",
    prerequisites: ["PE02", "PO01"],
    keywords: ["custom exception", "__init__", "args", "exception subclass", "error hierarchy", "domain exceptions"],
    misconceptionTags: ["python.custom_exceptions_should_inherit_exception", "python.exception_args_is_a_tuple"]
  }),
  createNode({
    id: "PE05",
    title: "Context managers: with statement, __enter__, __exit__, and exception suppression",
    language: "python",
    track: "python-errors",
    depthTarget: "D2",
    prerequisites: ["PO01", "PE01"],
    keywords: ["with", "__enter__", "__exit__", "context manager", "exception suppression", "resource management", "RAII"],
    misconceptionTags: ["python.exit_returning_true_suppresses_exception", "python.enter_return_value_is_as_target"]
  }),
  createNode({
    id: "PE06",
    title: "contextlib: @contextmanager, suppress, nullcontext, and ExitStack",
    language: "python",
    track: "python-errors",
    depthTarget: "D2",
    prerequisites: ["PE05", "PI02"],
    keywords: ["contextlib", "@contextmanager", "suppress", "nullcontext", "ExitStack", "generator-based context manager"],
    misconceptionTags: ["python.contextmanager_yield_must_be_single", "python.exitstack_calls_exit_in_reverse_order"]
  })
];

// ---------------------------------------------------------------------------
// Track: Type System (PT01–PT07)
// ---------------------------------------------------------------------------
const typesNodes = [
  createNode({
    id: "PT01",
    title: "Type hints: variable annotations, function annotations, and the typing module",
    language: "python",
    track: "python-types",
    depthTarget: "D2",
    prerequisites: ["PF07"],
    keywords: ["type hint", "annotation", "typing", "Any", "function annotation", "variable annotation", "get_type_hints"],
    misconceptionTags: ["python.type_hints_are_not_enforced_at_runtime", "python.annotations_are_stored_in_annotations"]
  }),
  createNode({
    id: "PT02",
    title: "Optional, Union, and the X | Y union syntax (Python 3.10+)",
    language: "python",
    track: "python-types",
    depthTarget: "D2",
    prerequisites: ["PT01"],
    keywords: ["Optional", "Union", "X | Y", "None", "nullable", "union type", "Python 3.10"],
    misconceptionTags: ["python.optional_is_union_with_none", "python.pipe_union_requires_python310"]
  }),
  createNode({
    id: "PT03",
    title: "Generic collections: List, Dict, Tuple, Set, and Sequence from typing",
    language: "python",
    track: "python-types",
    depthTarget: "D2",
    prerequisites: ["PT01", "PD01"],
    keywords: ["List", "Dict", "Tuple", "Set", "Sequence", "Mapping", "Iterable", "Iterator", "generic collections", "typing"],
    misconceptionTags: ["python.typing_list_vs_builtin_list_py39", "python.sequence_is_read_only_mutablesequence_is_not"]
  }),
  createNode({
    id: "PT04",
    title: "TypeVar and writing generic functions",
    language: "python",
    track: "python-types",
    depthTarget: "D3",
    prerequisites: ["PT03"],
    keywords: ["TypeVar", "generic", "bound", "covariant", "contravariant", "Generic", "type parameter"],
    misconceptionTags: ["python.typevar_is_not_a_type_itself", "python.bound_restricts_allowed_types"]
  }),
  createNode({
    id: "PT05",
    title: "Protocol and structural subtyping",
    language: "python",
    track: "python-types",
    depthTarget: "D3",
    prerequisites: ["PT01", "PO03"],
    keywords: ["Protocol", "structural subtyping", "duck typing", "@runtime_checkable", "structural compatibility", "nominal vs structural"],
    misconceptionTags: ["python.protocol_does_not_require_explicit_inheritance", "python.runtime_checkable_only_checks_method_existence"]
  }),
  createNode({
    id: "PT06",
    title: "@dataclass: field, default_factory, __post_init__, and frozen",
    language: "python",
    track: "python-types",
    depthTarget: "D2",
    prerequisites: ["PO01", "PT01"],
    keywords: ["@dataclass", "field", "default_factory", "__post_init__", "frozen", "eq", "order", "dataclass"],
    misconceptionTags: ["python.dataclass_frozen_makes_instances_hashable", "python.default_factory_avoids_mutable_default"]
  }),
  createNode({
    id: "PT07",
    title: "TypedDict, Literal, Final, and ClassVar",
    language: "python",
    track: "python-types",
    depthTarget: "D2",
    prerequisites: ["PT01", "PD03"],
    keywords: ["TypedDict", "Literal", "Final", "ClassVar", "typed dictionary", "constant type", "class variable annotation"],
    misconceptionTags: ["python.typeddict_is_not_enforced_at_runtime", "python.final_prevents_reassignment_only_in_type_checkers"]
  })
];

// ---------------------------------------------------------------------------
// Track: Modules and Packages (PM01–PM05)
// ---------------------------------------------------------------------------
const modulesNodes = [
  createNode({
    id: "PM01",
    title: "import, from import, aliasing, and __name__ == \"__main__\"",
    language: "python",
    track: "python-modules",
    depthTarget: "D1",
    prerequisites: ["PF01"],
    keywords: ["import", "from ... import", "as", "__name__", "__main__", "__file__", "__package__", "module", "aliasing"],
    misconceptionTags: ["python.import_runs_module_code_once", "python.name_main_guard_purpose"]
  }),
  createNode({
    id: "PM02",
    title: "Packages: __init__.py, relative imports, and package structure",
    language: "python",
    track: "python-modules",
    depthTarget: "D2",
    prerequisites: ["PM01"],
    keywords: ["package", "__init__.py", "relative import", "from . import", "from .. import", "package structure", "namespace"],
    misconceptionTags: ["python.relative_imports_require_package_context", "python.init_py_initializes_package"]
  }),
  createNode({
    id: "PM03",
    title: "__all__, module-level API design, and re-exports",
    language: "python",
    track: "python-modules",
    depthTarget: "D2",
    prerequisites: ["PM02"],
    keywords: ["__all__", "re-export", "public API", "module interface", "star import", "encapsulation"],
    misconceptionTags: ["python.all_controls_star_import_not_access", "python.reexport_pattern_in_init_py"]
  }),
  createNode({
    id: "PM04",
    title: "importlib: dynamic imports, import_module, and reload",
    language: "python",
    track: "python-modules",
    depthTarget: "D2",
    prerequisites: ["PM02"],
    keywords: ["importlib", "import_module", "reload", "find_module", "dynamic import", "plugin system"],
    misconceptionTags: ["python.reload_does_not_update_existing_references", "python.importlib_is_for_advanced_import_control"]
  }),
  createNode({
    id: "PM05",
    title: "Virtual environments: venv, pip, requirements.txt, and pyproject.toml",
    language: "python",
    track: "python-modules",
    depthTarget: "D1",
    prerequisites: ["PM01"],
    keywords: ["venv", "pip", "requirements.txt", "pyproject.toml", "site-packages", "virtual environment", "dependency management"],
    misconceptionTags: ["python.venv_isolates_packages_per_project", "python.pyproject_toml_replaces_setup_py"]
  })
];

// ---------------------------------------------------------------------------
// Track: Async and Concurrency (PA01–PA08)
// ---------------------------------------------------------------------------
const asyncNodes = [
  createNode({
    id: "PA01",
    title: "asyncio: event loop, coroutines, and await",
    language: "python",
    track: "python-async",
    depthTarget: "D2",
    prerequisites: ["PF07", "PE01"],
    keywords: ["asyncio", "event loop", "coroutine", "await", "asyncio.run", "asyncio.sleep", "async programming"],
    misconceptionTags: ["python.await_does_not_create_thread", "python.asyncio_is_single_threaded_concurrency"]
  }),
  createNode({
    id: "PA02",
    title: "async def, async for, async with, and asynchronous iterators",
    language: "python",
    track: "python-async",
    depthTarget: "D2",
    prerequisites: ["PA01"],
    keywords: ["async def", "async for", "async with", "__aiter__", "__anext__", "__aenter__", "__aexit__", "asynchronous iterator"],
    misconceptionTags: ["python.async_for_requires_aiter_and_anext", "python.async_with_calls_aenter_aexit"]
  }),
  createNode({
    id: "PA03",
    title: "asyncio tasks: create_task, gather, and TaskGroup",
    language: "python",
    track: "python-async",
    depthTarget: "D2",
    prerequisites: ["PA01"],
    keywords: ["asyncio.create_task", "asyncio.gather", "asyncio.TaskGroup", "Task", "concurrent tasks", "structured concurrency"],
    misconceptionTags: ["python.create_task_schedules_immediately", "python.gather_cancels_all_on_error"]
  }),
  createNode({
    id: "PA04",
    title: "asyncio queues: Queue, Lock, Event, Semaphore, and Condition",
    language: "python",
    track: "python-async",
    depthTarget: "D3",
    prerequisites: ["PA03"],
    keywords: ["asyncio.Queue", "asyncio.Lock", "asyncio.Event", "asyncio.Semaphore", "asyncio.Condition", "async synchronization", "producer-consumer"],
    misconceptionTags: ["python.asyncio_queue_is_not_thread_safe", "python.asyncio_lock_prevents_concurrent_coroutine_access"]
  }),
  createNode({
    id: "PA05",
    title: "threading: Thread, Lock, Event, Condition, and RLock",
    language: "python",
    track: "python-async",
    depthTarget: "D2",
    prerequisites: ["PE05"],
    keywords: ["threading.Thread", "threading.Lock", "threading.RLock", "threading.Event", "threading.Condition", "threading.Semaphore", "daemon thread"],
    misconceptionTags: ["python.thread_safety_requires_explicit_locking", "python.rlock_allows_reentrant_acquisition"]
  }),
  createNode({
    id: "PA06",
    title: "multiprocessing: Process, Pool, Queue, and shared memory",
    language: "python",
    track: "python-async",
    depthTarget: "D2",
    prerequisites: ["PA05", "PM01"],
    keywords: ["multiprocessing.Process", "Pool.map", "Pool.starmap", "multiprocessing.Queue", "shared_memory", "subprocess", "fork"],
    misconceptionTags: ["python.multiprocessing_bypasses_gil", "python.pool_map_blocks_until_complete"]
  }),
  createNode({
    id: "PA07",
    title: "concurrent.futures: ThreadPoolExecutor and ProcessPoolExecutor",
    language: "python",
    track: "python-async",
    depthTarget: "D2",
    prerequisites: ["PA05", "PA06"],
    keywords: ["concurrent.futures", "ThreadPoolExecutor", "ProcessPoolExecutor", "submit", "Future", "as_completed", "executor"],
    misconceptionTags: ["python.future_result_blocks_until_done", "python.threadpoolexecutor_reuses_threads"]
  }),
  createNode({
    id: "PA08",
    title: "GIL implications: CPU-bound vs I/O-bound workload selection",
    language: "python",
    track: "python-async",
    depthTarget: "D3",
    prerequisites: ["PA05", "PA06", "PA07"],
    keywords: ["GIL", "Global Interpreter Lock", "CPU-bound", "I/O-bound", "concurrency model", "parallelism", "workload selection"],
    misconceptionTags: ["python.gil_blocks_cpu_bound_threads", "python.io_bound_tasks_benefit_from_threading_despite_gil"]
  })
];

// ---------------------------------------------------------------------------
// Track: Functional Programming (PX01–PX05)
// ---------------------------------------------------------------------------
const functionalNodes = [
  createNode({
    id: "PX01",
    title: "First-class functions and higher-order functions",
    language: "python",
    track: "python-functional",
    depthTarget: "D2",
    prerequisites: ["PF07", "PF09"],
    keywords: ["first-class function", "higher-order function", "callable", "function as argument", "function as return value"],
    misconceptionTags: ["python.functions_are_objects", "python.callable_check_with_callable_builtin"]
  }),
  createNode({
    id: "PX02",
    title: "map, filter, zip, and zip_longest",
    language: "python",
    track: "python-functional",
    depthTarget: "D2",
    prerequisites: ["PF10", "PI02"],
    keywords: ["map", "filter", "zip", "zip_longest", "itertools.zip_longest", "lazy evaluation", "functional transformation"],
    misconceptionTags: ["python.map_returns_iterator_not_list", "python.zip_stops_at_shortest_sequence"]
  }),
  createNode({
    id: "PX03",
    title: "sorted, key= functions, and the operator module",
    language: "python",
    track: "python-functional",
    depthTarget: "D2",
    prerequisites: ["PD01", "PF09"],
    keywords: ["sorted", "key=", "reverse=", "operator.itemgetter", "operator.attrgetter", "operator.methodcaller", "stable sort"],
    misconceptionTags: ["python.sorted_returns_new_list_sort_is_in_place", "python.key_function_applied_once_not_per_comparison"]
  }),
  createNode({
    id: "PX04",
    title: "functools.wraps and building decorator factories",
    language: "python",
    track: "python-functional",
    depthTarget: "D2",
    prerequisites: ["PF09", "PI06"],
    keywords: ["functools.wraps", "decorator factory", "parameterized decorator", "@wraps", "decorator pattern", "metadata preservation"],
    misconceptionTags: ["python.wraps_preserves_wrapped_function_metadata", "python.decorator_factory_is_triple_nested"]
  }),
  createNode({
    id: "PX05",
    title: "Immutable patterns: tuples, frozensets, frozen dataclasses, and avoiding side effects",
    language: "python",
    track: "python-functional",
    depthTarget: "D2",
    prerequisites: ["PD02", "PD04", "PI06"],
    keywords: ["immutable", "side effect", "pure function", "frozenset", "frozen dataclass", "tuple", "functional style"],
    misconceptionTags: ["python.immutable_container_can_hold_mutable_elements", "python.pure_functions_have_no_side_effects"]
  })
];

// ---------------------------------------------------------------------------
// Track: Standard Library I/O (PS01–PS07)
// ---------------------------------------------------------------------------
const stdlibIoNodes = [
  createNode({
    id: "PS01",
    title: "open(), file modes, reading/writing, and the with statement",
    language: "python",
    track: "python-stdlib-io",
    depthTarget: "D1",
    prerequisites: ["PE05"],
    keywords: ["open", "r", "w", "a", "rb", "wb", "read", "readline", "readlines", "write", "seek", "tell", "with", "file mode"],
    misconceptionTags: ["python.open_must_be_closed_or_use_with", "python.text_vs_binary_mode_difference"]
  }),
  createNode({
    id: "PS02",
    title: "pathlib.Path: construction, glob, stat, mkdir, unlink, and iterdir",
    language: "python",
    track: "python-stdlib-io",
    depthTarget: "D2",
    prerequisites: ["PS01"],
    keywords: ["pathlib.Path", "Path.glob", "Path.rglob", "Path.stat", "Path.mkdir", "Path.unlink", "Path.rename", "Path.iterdir", "cross-platform paths"],
    misconceptionTags: ["python.pathlib_is_preferred_over_os_path", "python.path_glob_patterns_vs_regex"]
  }),
  createNode({
    id: "PS03",
    title: "os and os.path: walk, environ, getcwd, and path utilities",
    language: "python",
    track: "python-stdlib-io",
    depthTarget: "D2",
    prerequisites: ["PS01"],
    keywords: ["os.walk", "os.environ", "os.getcwd", "os.listdir", "os.path.join", "os.path.exists", "environment variables"],
    misconceptionTags: ["python.os_walk_yields_tuples", "python.environ_returns_strings_not_typed_values"]
  }),
  createNode({
    id: "PS04",
    title: "shutil: copy, copy2, move, copytree, rmtree, and disk_usage",
    language: "python",
    track: "python-stdlib-io",
    depthTarget: "D2",
    prerequisites: ["PS02"],
    keywords: ["shutil.copy", "shutil.copy2", "shutil.move", "shutil.copytree", "shutil.rmtree", "shutil.disk_usage", "file operations"],
    misconceptionTags: ["python.copy2_preserves_metadata_copy_does_not", "python.rmtree_is_recursive_no_warning"]
  }),
  createNode({
    id: "PS05",
    title: "json: load, loads, dump, dumps, and custom JSONEncoder/JSONDecoder",
    language: "python",
    track: "python-stdlib-io",
    depthTarget: "D2",
    prerequisites: ["PD03", "PE01"],
    keywords: ["json.load", "json.loads", "json.dump", "json.dumps", "JSONEncoder", "JSONDecoder", "serialization", "deserialization"],
    misconceptionTags: ["python.json_load_reads_file_loads_reads_string", "python.json_keys_are_always_strings"]
  }),
  createNode({
    id: "PS06",
    title: "csv: reader, writer, DictReader, and DictWriter",
    language: "python",
    track: "python-stdlib-io",
    depthTarget: "D2",
    prerequisites: ["PS01", "PD03"],
    keywords: ["csv.reader", "csv.writer", "DictReader", "DictWriter", "delimiter", "quoting", "newline handling"],
    misconceptionTags: ["python.csv_newline_must_be_empty_string", "python.dictreader_uses_first_row_as_fieldnames"]
  }),
  createNode({
    id: "PS07",
    title: "struct: pack, unpack, calcsize, and binary I/O patterns",
    language: "python",
    track: "python-stdlib-io",
    depthTarget: "D2",
    prerequisites: ["PS01", "PF02"],
    keywords: ["struct.pack", "struct.unpack", "struct.calcsize", "format string", "binary I/O", "endianness", "byte order"],
    misconceptionTags: ["python.struct_format_string_determines_byte_layout", "python.unpack_returns_tuple"]
  })
];

// ---------------------------------------------------------------------------
// Track: Decorators and Metaprogramming (PK01–PK06)
// ---------------------------------------------------------------------------
const metaprogrammingNodes = [
  createNode({
    id: "PK01",
    title: "Function decorators: syntax, mechanics, and stacking decorators",
    language: "python",
    track: "python-metaprogramming",
    depthTarget: "D2",
    prerequisites: ["PF09", "PO01"],
    keywords: ["decorator", "@", "wrapping", "functools.wraps", "stacking", "decorator syntax", "wrapper function"],
    misconceptionTags: ["python.decorator_replaces_original_function", "python.stacked_decorators_apply_bottom_up"]
  }),
  createNode({
    id: "PK02",
    title: "Class decorators: transforming class objects and adding behavior",
    language: "python",
    track: "python-metaprogramming",
    depthTarget: "D2",
    prerequisites: ["PK01", "PO03"],
    keywords: ["class decorator", "class transformation", "adding methods", "class modification", "decorator pattern"],
    misconceptionTags: ["python.class_decorator_called_after_class_creation", "python.class_decorator_can_return_different_class"]
  }),
  createNode({
    id: "PK03",
    title: "__getattr__, __setattr__, __delattr__, and __getattribute__",
    language: "python",
    track: "python-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["PO01"],
    keywords: ["__getattr__", "__setattr__", "__delattr__", "__getattribute__", "attribute lookup", "attribute access hook"],
    misconceptionTags: ["python.getattr_only_called_when_attribute_not_found", "python.getattribute_called_for_every_access"]
  }),
  createNode({
    id: "PK04",
    title: "Descriptors: __get__, __set__, and __delete__ protocol",
    language: "python",
    track: "python-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["PK03", "PO07"],
    keywords: ["descriptor", "__get__", "__set__", "__delete__", "data descriptor", "non-data descriptor", "descriptor protocol"],
    misconceptionTags: ["python.data_descriptor_overrides_instance_dict", "python.property_is_implemented_as_descriptor"]
  }),
  createNode({
    id: "PK05",
    title: "Metaclasses: type, __new__, __init__, and __init_subclass__",
    language: "python",
    track: "python-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["PO03", "PO09"],
    keywords: ["metaclass", "type", "__new__", "__init_subclass__", "__prepare__", "class creation", "metaclass hook"],
    misconceptionTags: ["python.type_is_metaclass_of_all_classes", "python.metaclass_new_receives_class_not_instance"]
  }),
  createNode({
    id: "PK06",
    title: "__class_getitem__ and runtime generic subscriptions",
    language: "python",
    track: "python-metaprogramming",
    depthTarget: "D3",
    prerequisites: ["PK05", "PT03"],
    keywords: ["__class_getitem__", "runtime generic", "Generic", "__orig_bases__", "subscription", "generic alias"],
    misconceptionTags: ["python.class_getitem_enables_list_int_syntax", "python.generic_alias_is_not_a_type_check"]
  })
];

// ---------------------------------------------------------------------------
// Track: Testing (PB01–PB05)
// ---------------------------------------------------------------------------
const testingNodes = [
  createNode({
    id: "PB01",
    title: "unittest: TestCase, setUp, tearDown, and assertions",
    language: "python",
    track: "python-testing",
    depthTarget: "D2",
    prerequisites: ["PE01", "PO01"],
    keywords: ["unittest", "TestCase", "setUp", "tearDown", "assertEqual", "assertRaises", "assertAlmostEqual", "subTest"],
    misconceptionTags: ["python.test_methods_must_start_with_test", "python.assertraises_as_context_manager"]
  }),
  createNode({
    id: "PB02",
    title: "pytest: test discovery, fixtures, parametrize, and marks",
    language: "python",
    track: "python-testing",
    depthTarget: "D2",
    prerequisites: ["PE01"],
    keywords: ["pytest", "test_", "fixture", "@pytest.fixture", "@pytest.mark.parametrize", "@pytest.mark.skip", "conftest.py", "test discovery"],
    misconceptionTags: ["python.pytest_fixtures_are_dependency_injected", "python.parametrize_runs_test_multiple_times"]
  }),
  createNode({
    id: "PB03",
    title: "unittest.mock: Mock, MagicMock, patch, and side_effect",
    language: "python",
    track: "python-testing",
    depthTarget: "D2",
    prerequisites: ["PB01"],
    keywords: ["unittest.mock", "Mock", "MagicMock", "patch", "@patch", "side_effect", "return_value", "assert_called_with", "assert_called_once"],
    misconceptionTags: ["python.patch_target_is_where_name_is_used", "python.magicmock_supports_dunder_methods"]
  }),
  createNode({
    id: "PB04",
    title: "Property-based testing with hypothesis: @given, strategies, and shrinking",
    language: "python",
    track: "python-testing",
    depthTarget: "D3",
    prerequisites: ["PB02"],
    keywords: ["hypothesis", "@given", "strategies", "st.integers", "st.text", "shrinking", "property-based testing", "fuzzing"],
    misconceptionTags: ["python.hypothesis_shrinks_failing_examples", "python.given_generates_many_examples"]
  }),
  createNode({
    id: "PB05",
    title: "Coverage measurement, test organization, and CI patterns",
    language: "python",
    track: "python-testing",
    depthTarget: "D2",
    prerequisites: ["PB02"],
    keywords: ["coverage", ".coveragerc", "--cov", "conftest.py", "test organization", "CI", "continuous integration", "test suite"],
    misconceptionTags: ["python.coverage_measures_lines_not_correctness", "python.100_percent_coverage_does_not_mean_bug_free"]
  })
];

// ---------------------------------------------------------------------------
// Track: Performance and Profiling (PH01–PH05)
// ---------------------------------------------------------------------------
const performanceNodes = [
  createNode({
    id: "PH01",
    title: "timeit and cProfile: measuring execution time and call graph profiling",
    language: "python",
    track: "python-performance",
    depthTarget: "D2",
    prerequisites: ["PF07"],
    keywords: ["timeit", "cProfile", "pstats", "profile", "call graph", "hot path", "benchmarking", "profiling"],
    misconceptionTags: ["python.timeit_runs_multiple_times_for_accuracy", "python.cprofile_measures_cumulative_time"]
  }),
  createNode({
    id: "PH02",
    title: "tracemalloc: tracking memory allocations and finding leaks",
    language: "python",
    track: "python-performance",
    depthTarget: "D2",
    prerequisites: ["PH01"],
    keywords: ["tracemalloc", "Snapshot", "statistics", "take_snapshot", "memory leak", "memory allocation", "top_by"],
    misconceptionTags: ["python.tracemalloc_tracks_python_allocations_not_c_ext", "python.snapshot_comparison_shows_growth"]
  }),
  createNode({
    id: "PH03",
    title: "ctypes and cffi: calling C libraries from Python",
    language: "python",
    track: "python-performance",
    depthTarget: "D3",
    prerequisites: ["PF07", "PM01"],
    keywords: ["ctypes", "cdll", "CDLL", "ctypes.c_int", "cffi", "ffi.cdef", "foreign function interface", "C extension"],
    misconceptionTags: ["python.ctypes_requires_correct_type_mapping", "python.cffi_is_safer_than_ctypes_for_complex_apis"]
  }),
  createNode({
    id: "PH04",
    title: "numpy arrays vs Python lists: vectorized operations and performance",
    language: "python",
    track: "python-performance",
    depthTarget: "D2",
    prerequisites: ["PD01", "PF06"],
    keywords: ["numpy", "ndarray", "dtype", "vectorized", "broadcasting", "np.array", "np.zeros", "np.arange", "axis"],
    misconceptionTags: ["python.numpy_operations_are_element_wise_by_default", "python.broadcasting_rules_can_be_surprising"]
  }),
  createNode({
    id: "PH05",
    title: "__slots__, __weakref__, sys.getsizeof, and reducing object memory overhead",
    language: "python",
    track: "python-performance",
    depthTarget: "D2",
    prerequisites: ["PO01", "PO08"],
    keywords: ["__slots__", "__weakref__", "sys.getsizeof", "__sizeof__", "weakref", "reference counting", "object overhead", "memory optimization"],
    misconceptionTags: ["python.getsizeof_does_not_count_referenced_objects", "python.weakref_does_not_prevent_garbage_collection"]
  })
];

// ---------------------------------------------------------------------------
// Tracks metadata
// ---------------------------------------------------------------------------
const tracks = {
  "python-foundations": {
    id: "python-foundations",
    title: "Language Foundations",
    nodeIds: foundationsNodes.map((n) => n.id)
  },
  "python-data-structures": {
    id: "python-data-structures",
    title: "Data Structures",
    nodeIds: dataStructuresNodes.map((n) => n.id)
  },
  "python-oop": {
    id: "python-oop",
    title: "OOP",
    nodeIds: oopNodes.map((n) => n.id)
  },
  "python-iterators": {
    id: "python-iterators",
    title: "Iterators and Generators",
    nodeIds: iteratorsNodes.map((n) => n.id)
  },
  "python-errors": {
    id: "python-errors",
    title: "Error Handling",
    nodeIds: errorsNodes.map((n) => n.id)
  },
  "python-types": {
    id: "python-types",
    title: "Type System",
    nodeIds: typesNodes.map((n) => n.id)
  },
  "python-modules": {
    id: "python-modules",
    title: "Modules and Packages",
    nodeIds: modulesNodes.map((n) => n.id)
  },
  "python-async": {
    id: "python-async",
    title: "Async and Concurrency",
    nodeIds: asyncNodes.map((n) => n.id)
  },
  "python-functional": {
    id: "python-functional",
    title: "Functional Programming",
    nodeIds: functionalNodes.map((n) => n.id)
  },
  "python-stdlib-io": {
    id: "python-stdlib-io",
    title: "Standard Library I/O",
    nodeIds: stdlibIoNodes.map((n) => n.id)
  },
  "python-metaprogramming": {
    id: "python-metaprogramming",
    title: "Decorators and Metaprogramming",
    nodeIds: metaprogrammingNodes.map((n) => n.id)
  },
  "python-testing": {
    id: "python-testing",
    title: "Testing",
    nodeIds: testingNodes.map((n) => n.id)
  },
  "python-performance": {
    id: "python-performance",
    title: "Performance and Profiling",
    nodeIds: performanceNodes.map((n) => n.id)
  }
};

// ---------------------------------------------------------------------------
// Graph
// ---------------------------------------------------------------------------
const allNodes = [
  ...foundationsNodes,
  ...dataStructuresNodes,
  ...oopNodes,
  ...iteratorsNodes,
  ...errorsNodes,
  ...typesNodes,
  ...modulesNodes,
  ...asyncNodes,
  ...functionalNodes,
  ...stdlibIoNodes,
  ...metaprogrammingNodes,
  ...testingNodes,
  ...performanceNodes
];

export const pythonCurriculum = createCurriculumGraph(allNodes, tracks);
