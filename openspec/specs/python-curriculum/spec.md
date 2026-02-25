## ADDED Requirements

### Requirement: Python is a selectable language in the curriculum system
The system SHALL register `python` as a supported language in the language registry with a test command of `["python", "-m", "pytest"]`, a `conftest.py`-based project config writer, and Python-specific stage instructions (scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer).

#### Scenario: Python appears in language selection
- **WHEN** a learner runs `session start`
- **THEN** "Python" appears as a selectable language alongside Rust, C, and Zig

#### Scenario: Selecting Python scopes the curriculum to Python nodes
- **WHEN** a learner selects Python
- **THEN** `getCurriculumForLanguage("python")` returns only nodes with `language: "python"` and tracks containing those nodes

#### Scenario: Python exercise workspace is created with conftest and solution stub
- **WHEN** a Python session exercise is set up
- **THEN** the workspace contains a `conftest.py` at the root, a `src/solution.py` stub, and a `tests/` directory for pytest test files

---

### Requirement: Language Foundations track (PF) provides core Python syntax
The system SHALL provide a `python-foundations` track with 10 nodes (PF01–PF10) covering the fundamental building blocks of Python. PF01 has no prerequisites and serves as the entry point to the entire Python curriculum.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PF01 | Variables, assignment, and names | D1 | — |
| PF02 | Numeric types: int, float, complex, and arithmetic operators | D1 | PF01 |
| PF03 | Strings: literals, indexing, slicing, and common methods | D1 | PF01 |
| PF04 | Booleans, None, truthiness, and comparison operators | D1 | PF01 |
| PF05 | Control flow: if, elif, else, and conditional expressions | D1 | PF04 |
| PF06 | Loops: for, while, break, continue, and else on loops | D1 | PF05 |
| PF07 | Functions: def, parameters, return values, and scope | D1 | PF05 |
| PF08 | Default arguments, *args, and **kwargs | D2 | PF07 |
| PF09 | Lambda functions, closures, and nonlocal | D2 | PF07 |
| PF10 | Comprehensions: list, dict, set, and generator expressions | D2 | PF06, PF07 |

**Keywords covered:** variable, assignment, rebinding, name, `int`, `float`, `complex`, `//`, `**`, `%`, `divmod`, `abs`, `round`, `str`, `f-string`, `format`, slice, `.upper`, `.lower`, `.strip`, `.split`, `.join`, `.replace`, `bool`, `None`, truthiness, falsy, `and`, `or`, `not`, `is`, `==`, `if`, `elif`, `else`, ternary, `for`, `while`, `break`, `continue`, `range`, `enumerate`, loop `else`, `def`, `return`, `global`, `local`, `nonlocal`, default argument, `*args`, `**kwargs`, `lambda`, closure, free variable, list comprehension, dict comprehension, set comprehension, generator expression

#### Scenario: PF01 is the curriculum entry point with no prerequisites
- **WHEN** a learner selects Python and has no mastery
- **THEN** PF01 is the first eligible node shown in the guided navigator

#### Scenario: Foundations nodes unlock in prerequisite order
- **WHEN** a learner completes PF06 and PF07
- **THEN** PF10 becomes eligible

#### Scenario: Advanced function features require basic function knowledge
- **WHEN** a learner has not completed PF07
- **THEN** PF08 and PF09 are not eligible

---

### Requirement: Data Structures track (PD) covers Python's built-in collection types
The system SHALL provide a `python-data-structures` track with 8 nodes (PD01–PD08) covering all major Python built-in and standard library collection types.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PD01 | Lists: indexing, slicing, mutation, and list methods | D1 | PF06 |
| PD02 | Tuples: immutability, packing, unpacking, and starred assignment | D1 | PD01 |
| PD03 | Dictionaries: CRUD operations, iteration, and dict merging (| and **) | D2 | PF06 |
| PD04 | Sets: creation, frozenset, and set operations (union, intersection, difference) | D1 | PF06 |
| PD05 | collections.namedtuple and typing.NamedTuple | D2 | PD02 |
| PD06 | collections.deque, Counter, and defaultdict | D2 | PD01, PD03 |
| PD07 | collections.OrderedDict and ChainMap | D2 | PD03 |
| PD08 | heapq and bisect: priority queues and binary search | D2 | PD01 |

**Keywords covered:** list, `append`, `extend`, `insert`, `remove`, `pop`, `sort`, `reverse`, negative index, slice step, `in`, tuple, immutable, packing, unpacking, starred, `*rest`, dict, `get`, `setdefault`, `items`, `keys`, `values`, `update`, `|` merge, `**` unpack, set, `frozenset`, `add`, `discard`, `union`, `intersection`, `difference`, `symmetric_difference`, `namedtuple`, `NamedTuple`, `_replace`, `_asdict`, `deque`, `appendleft`, `popleft`, `rotate`, `Counter`, `most_common`, `defaultdict`, `OrderedDict`, `move_to_end`, `ChainMap`, `heapq`, `heappush`, `heappop`, `heapify`, `bisect_left`, `bisect_right`, `insort`

#### Scenario: List node requires loop knowledge
- **WHEN** a learner has completed PF06
- **THEN** PD01 is eligible

#### Scenario: Counter and defaultdict require both list and dict knowledge
- **WHEN** a learner has completed PD01 and PD03
- **THEN** PD06 is eligible

#### Scenario: heapq requires only list knowledge
- **WHEN** a learner has completed PD01
- **THEN** PD08 is eligible

---

### Requirement: OOP track (PO) covers Python's object-oriented features
The system SHALL provide a `python-oop` track with 9 nodes (PO01–PO09) covering classes, inheritance, dunder methods, the sequence protocol, properties, slots, and abstract base classes.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PO01 | Classes: __init__, self, instance attributes, and class attributes | D1 | PF07 |
| PO02 | Instance methods, class methods (@classmethod), and static methods (@staticmethod) | D2 | PO01 |
| PO03 | Inheritance, super(), and method resolution | D2 | PO01 |
| PO04 | Multiple inheritance and the Method Resolution Order (MRO) | D2 | PO03 |
| PO05 | Dunder methods: __str__, __repr__, __eq__, __hash__, and __bool__ | D2 | PO01 |
| PO06 | Sequence protocol: __len__, __getitem__, __iter__, __contains__, and __reversed__ | D2 | PO01, PD01 |
| PO07 | @property: getters, setters, and deleters | D2 | PO01 |
| PO08 | __slots__: restricting instance attributes and memory savings | D2 | PO01 |
| PO09 | Abstract base classes: abc module, ABC, abstractmethod, and register | D3 | PO03 |

**Keywords covered:** `class`, `__init__`, `self`, instance attribute, class attribute, `@classmethod`, `cls`, `@staticmethod`, `isinstance`, `issubclass`, `super`, `__mro__`, method resolution order, C3 linearization, diamond inheritance, `__str__`, `__repr__`, `__eq__`, `__hash__`, `__bool__`, `__len__`, `__getitem__`, `__setitem__`, `__delitem__`, `__iter__`, `__next__`, `__contains__`, `__reversed__`, `@property`, getter, setter, deleter, `__slots__`, ABC, `abstractmethod`, `register`, `@abc.abstractmethod`

#### Scenario: OOP entry requires function knowledge
- **WHEN** a learner has completed PF07
- **THEN** PO01 is eligible

#### Scenario: MRO node requires inheritance knowledge
- **WHEN** a learner has not completed PO03
- **THEN** PO04 is not eligible

#### Scenario: Sequence protocol requires both class and list knowledge
- **WHEN** a learner has completed PO01 and PD01
- **THEN** PO06 is eligible

#### Scenario: ABCs are the most advanced OOP node
- **WHEN** a learner has completed PO03
- **THEN** PO09 becomes eligible

---

### Requirement: Iterators and Generators track (PI) covers Python's iteration model
The system SHALL provide a `python-iterators` track with 6 nodes (PI01–PI06) covering the iterator protocol, generator functions, generator delegation, generator expressions, itertools, and functools.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PI01 | The iterator protocol: __iter__ and __next__, and StopIteration | D2 | PO01 |
| PI02 | Generator functions: yield, generator state, and send() | D2 | PF07, PF06 |
| PI03 | yield from and generator delegation | D3 | PI02 |
| PI04 | Generator expressions and lazy evaluation | D2 | PF10, PI02 |
| PI05 | itertools: chain, product, combinations, permutations, and groupby | D2 | PI02 |
| PI06 | functools: reduce, partial, lru_cache, and cached_property | D2 | PF09, PI02 |

**Keywords covered:** iterator, iterable, `__iter__`, `__next__`, `StopIteration`, generator, `yield`, `send`, `throw`, `close`, generator state, `yield from`, delegation, sub-generator, lazy, `itertools.chain`, `itertools.product`, `itertools.combinations`, `itertools.permutations`, `itertools.groupby`, `itertools.islice`, `itertools.takewhile`, `itertools.dropwhile`, `functools.reduce`, `functools.partial`, `functools.lru_cache`, `functools.cached_property`, `@cache`, memoization

#### Scenario: Iterator protocol requires class knowledge
- **WHEN** a learner has completed PO01
- **THEN** PI01 is eligible

#### Scenario: Generator functions require function and loop knowledge
- **WHEN** a learner has completed PF07 and PF06
- **THEN** PI02 is eligible

#### Scenario: yield from requires generator foundation
- **WHEN** a learner has not completed PI02
- **THEN** PI03 is not eligible

---

### Requirement: Error Handling track (PE) covers Python's exception model
The system SHALL provide a `python-errors` track with 6 nodes (PE01–PE06) covering try/except/else/finally, the exception hierarchy, raise and exception chaining, custom exceptions, context managers, and contextlib.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PE01 | try, except, else, and finally: exception handling flow | D1 | PF05 |
| PE02 | Exception hierarchy: BaseException, Exception, and catching multiple types | D2 | PE01 |
| PE03 | raise, raise from, and exception chaining | D2 | PE02 |
| PE04 | Custom exception classes: subclassing Exception and adding attributes | D2 | PE02, PO01 |
| PE05 | Context managers: with statement, __enter__, __exit__, and exception suppression | D2 | PO01, PE01 |
| PE06 | contextlib: @contextmanager, suppress, nullcontext, and ExitStack | D2 | PE05, PI02 |

**Keywords covered:** `try`, `except`, `else`, `finally`, exception, traceback, `BaseException`, `Exception`, `ValueError`, `TypeError`, `KeyError`, `IndexError`, `AttributeError`, `OSError`, `RuntimeError`, `StopIteration`, `raise`, `raise ... from`, `__cause__`, `__context__`, `__suppress_context__`, exception chaining, custom exception, `__init__`, `args`, `with`, `__enter__`, `__exit__`, context manager, `contextlib`, `@contextmanager`, `suppress`, `nullcontext`, `ExitStack`

#### Scenario: Basic error handling requires control flow knowledge
- **WHEN** a learner has completed PF05
- **THEN** PE01 is eligible

#### Scenario: Exception chaining requires hierarchy knowledge
- **WHEN** a learner has completed PE02
- **THEN** PE03 is eligible

#### Scenario: Context managers require class and exception knowledge
- **WHEN** a learner has completed PO01 and PE01
- **THEN** PE05 is eligible

#### Scenario: contextlib requires context managers and generators
- **WHEN** a learner has completed PE05 and PI02
- **THEN** PE06 is eligible

---

### Requirement: Type System track (PT) covers Python's type annotation system
The system SHALL provide a `python-types` track with 7 nodes (PT01–PT07) covering type annotations, Optional/Union, generic collection types, TypeVar, Protocol, dataclasses, and TypedDict/Literal.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PT01 | Type hints: variable annotations, function annotations, and the typing module | D2 | PF07 |
| PT02 | Optional, Union, and the X \| Y union syntax (Python 3.10+) | D2 | PT01 |
| PT03 | Generic collections: List, Dict, Tuple, Set, and Sequence from typing | D2 | PT01, PD01 |
| PT04 | TypeVar and writing generic functions | D3 | PT03 |
| PT05 | Protocol and structural subtyping | D3 | PT01, PO03 |
| PT06 | @dataclass: field, default_factory, __post_init__, and frozen | D2 | PO01, PT01 |
| PT07 | TypedDict, Literal, Final, and ClassVar | D2 | PT01, PD03 |

**Keywords covered:** type hint, annotation, `typing`, `Any`, `Optional`, `Union`, `X | Y`, `List`, `Dict`, `Tuple`, `Set`, `Sequence`, `Mapping`, `Iterable`, `Iterator`, `TypeVar`, generic, `Protocol`, structural subtyping, duck typing, `@runtime_checkable`, `@dataclass`, `field`, `default_factory`, `__post_init__`, `frozen`, `eq`, `order`, `TypedDict`, `Literal`, `Final`, `ClassVar`, `get_type_hints`

#### Scenario: Type hints require function knowledge
- **WHEN** a learner has completed PF07
- **THEN** PT01 is eligible

#### Scenario: Generic functions require TypeVar which requires collection generics
- **WHEN** a learner has completed PT03
- **THEN** PT04 is eligible

#### Scenario: Protocol requires type hints and inheritance knowledge
- **WHEN** a learner has completed PT01 and PO03
- **THEN** PT05 is eligible

#### Scenario: dataclasses combine OOP and type hint knowledge
- **WHEN** a learner has completed PO01 and PT01
- **THEN** PT06 is eligible

---

### Requirement: Modules and Packages track (PM) covers Python's module system
The system SHALL provide a `python-modules` track with 5 nodes (PM01–PM05) covering imports, packages, public API design, dynamic imports, and virtual environments.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PM01 | import, from import, aliasing, and __name__ == "__main__" | D1 | PF01 |
| PM02 | Packages: __init__.py, relative imports, and package structure | D2 | PM01 |
| PM03 | __all__, module-level API design, and re-exports | D2 | PM02 |
| PM04 | importlib: dynamic imports, import_module, and reload | D2 | PM02 |
| PM05 | Virtual environments: venv, pip, requirements.txt, and pyproject.toml | D1 | PM01 |

**Keywords covered:** `import`, `from ... import`, `as`, `__name__`, `__main__`, `__file__`, `__package__`, package, `__init__.py`, relative import, `from . import`, `from .. import`, `__all__`, re-export, `importlib`, `import_module`, `reload`, `find_module`, virtual environment, `venv`, `pip`, `requirements.txt`, `pyproject.toml`, `site-packages`

#### Scenario: Basic import node has minimal prerequisites
- **WHEN** a learner has completed PF01
- **THEN** PM01 is eligible early in the curriculum

#### Scenario: Package structure requires import basics
- **WHEN** a learner has completed PM01
- **THEN** PM02 is eligible

#### Scenario: Virtual environments require only basic import knowledge
- **WHEN** a learner has completed PM01
- **THEN** PM05 is eligible

---

### Requirement: Async and Concurrency track (PA) covers Python's async model and threading
The system SHALL provide a `python-async` track with 8 nodes (PA01–PA08) covering asyncio, async syntax, tasks, synchronization, threading, multiprocessing, concurrent.futures, and GIL implications.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PA01 | asyncio: event loop, coroutines, and await | D2 | PF07, PE01 |
| PA02 | async def, async for, async with, and asynchronous iterators | D2 | PA01 |
| PA03 | asyncio tasks: create_task, gather, and TaskGroup | D2 | PA01 |
| PA04 | asyncio queues: Queue, Lock, Event, Semaphore, and Condition | D3 | PA03 |
| PA05 | threading: Thread, Lock, Event, Condition, and RLock | D2 | PE05 |
| PA06 | multiprocessing: Process, Pool, Queue, and shared memory | D2 | PA05, PM01 |
| PA07 | concurrent.futures: ThreadPoolExecutor and ProcessPoolExecutor | D2 | PA05, PA06 |
| PA08 | GIL implications: CPU-bound vs I/O-bound workload selection | D3 | PA05, PA06, PA07 |

**Keywords covered:** `asyncio`, event loop, coroutine, `await`, `async def`, `async for`, `async with`, `__aiter__`, `__anext__`, `__aenter__`, `__aexit__`, `asyncio.run`, `asyncio.sleep`, `asyncio.create_task`, `asyncio.gather`, `asyncio.TaskGroup`, `asyncio.Queue`, `asyncio.Lock`, `asyncio.Event`, `asyncio.Semaphore`, `asyncio.Condition`, `threading.Thread`, `threading.Lock`, `threading.RLock`, `threading.Event`, `threading.Condition`, `threading.Semaphore`, `multiprocessing.Process`, `Pool.map`, `Pool.starmap`, `multiprocessing.Queue`, `shared_memory`, `concurrent.futures`, `ThreadPoolExecutor`, `ProcessPoolExecutor`, `submit`, `Future`, `as_completed`, GIL, Global Interpreter Lock, CPU-bound, I/O-bound

#### Scenario: asyncio requires function and error handling knowledge
- **WHEN** a learner has completed PF07 and PE01
- **THEN** PA01 is eligible

#### Scenario: Tasks and gather build on the coroutine foundation
- **WHEN** a learner has completed PA01
- **THEN** PA03 is eligible

#### Scenario: threading requires context manager knowledge
- **WHEN** a learner has completed PE05
- **THEN** PA05 is eligible

#### Scenario: GIL analysis is the capstone concurrent node
- **WHEN** a learner has completed PA05, PA06, and PA07
- **THEN** PA08 is eligible

---

### Requirement: Functional Programming track (PX) covers functional Python patterns
The system SHALL provide a `python-functional` track with 5 nodes (PX01–PX05) covering first-class functions, map/filter/zip, sorting with key functions, decorator factories, and immutable patterns.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PX01 | First-class functions and higher-order functions | D2 | PF07, PF09 |
| PX02 | map, filter, zip, and zip_longest | D2 | PF10, PI02 |
| PX03 | sorted, key= functions, and the operator module | D2 | PD01, PF09 |
| PX04 | functools.wraps and building decorator factories | D2 | PF09, PI06 |
| PX05 | Immutable patterns: tuples, frozensets, frozen dataclasses, and avoiding side effects | D2 | PD02, PD04, PI06 |

**Keywords covered:** first-class function, higher-order function, callable, `map`, `filter`, `zip`, `zip_longest`, `itertools.zip_longest`, lazy evaluation, `sorted`, `key=`, `reverse=`, `operator.itemgetter`, `operator.attrgetter`, `operator.methodcaller`, `functools.wraps`, decorator factory, parameterized decorator, `@wraps`, immutable, side effect, pure function, `frozenset`, frozen dataclass

#### Scenario: HOF node requires function and closure knowledge
- **WHEN** a learner has completed PF07 and PF09
- **THEN** PX01 is eligible

#### Scenario: map/filter/zip require comprehensions and generators
- **WHEN** a learner has completed PF10 and PI02
- **THEN** PX02 is eligible

#### Scenario: Decorator factories require both closures and functools knowledge
- **WHEN** a learner has completed PF09 and PI06
- **THEN** PX04 is eligible

---

### Requirement: Standard Library I/O track (PS) covers Python's file and data I/O
The system SHALL provide a `python-stdlib-io` track with 7 nodes (PS01–PS07) covering file I/O, pathlib, os/os.path, shutil, json, csv, and binary struct I/O.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PS01 | open(), file modes, reading/writing, and the with statement | D1 | PE05 |
| PS02 | pathlib.Path: construction, glob, stat, mkdir, unlink, and iterdir | D2 | PS01 |
| PS03 | os and os.path: walk, environ, getcwd, and path utilities | D2 | PS01 |
| PS04 | shutil: copy, copy2, move, copytree, rmtree, and disk_usage | D2 | PS02 |
| PS05 | json: load, loads, dump, dumps, and custom JSONEncoder/JSONDecoder | D2 | PD03, PE01 |
| PS06 | csv: reader, writer, DictReader, and DictWriter | D2 | PS01, PD03 |
| PS07 | struct: pack, unpack, calcsize, and binary I/O patterns | D2 | PS01, PF02 |

**Keywords covered:** `open`, `r`, `w`, `a`, `rb`, `wb`, `read`, `readline`, `readlines`, `write`, `seek`, `tell`, `with`, `pathlib.Path`, `Path.glob`, `Path.rglob`, `Path.stat`, `Path.mkdir`, `Path.unlink`, `Path.rename`, `Path.iterdir`, `os.walk`, `os.environ`, `os.getcwd`, `os.listdir`, `os.path.join`, `os.path.exists`, `shutil.copy`, `shutil.copy2`, `shutil.move`, `shutil.copytree`, `shutil.rmtree`, `shutil.disk_usage`, `json.load`, `json.loads`, `json.dump`, `json.dumps`, `JSONEncoder`, `JSONDecoder`, `csv.reader`, `csv.writer`, `DictReader`, `DictWriter`, `struct.pack`, `struct.unpack`, `struct.calcsize`, format string

#### Scenario: File I/O requires context manager knowledge
- **WHEN** a learner has completed PE05
- **THEN** PS01 is eligible

#### Scenario: pathlib requires file I/O foundations
- **WHEN** a learner has completed PS01
- **THEN** PS02 is eligible

#### Scenario: JSON requires dict and error handling knowledge
- **WHEN** a learner has completed PD03 and PE01
- **THEN** PS05 is eligible

---

### Requirement: Decorators and Metaprogramming track (PK) covers Python's meta-level features
The system SHALL provide a `python-metaprogramming` track with 6 nodes (PK01–PK06) covering function decorators, class decorators, attribute access hooks, descriptors, metaclasses, and runtime generics.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PK01 | Function decorators: syntax, mechanics, and stacking decorators | D2 | PF09, PO01 |
| PK02 | Class decorators: transforming class objects and adding behavior | D2 | PK01, PO03 |
| PK03 | __getattr__, __setattr__, __delattr__, and __getattribute__ | D3 | PO01 |
| PK04 | Descriptors: __get__, __set__, and __delete__ protocol | D3 | PK03, PO07 |
| PK05 | Metaclasses: type, __new__, __init__, and __init_subclass__ | D3 | PO03, PO09 |
| PK06 | __class_getitem__ and runtime generic subscriptions | D3 | PK05, PT03 |

**Keywords covered:** decorator, `@`, wrapping, `functools.wraps`, stacking, class decorator, `__getattr__`, `__setattr__`, `__delattr__`, `__getattribute__`, attribute lookup, descriptor, `__get__`, `__set__`, `__delete__`, data descriptor, non-data descriptor, metaclass, `type`, `__new__`, `__init_subclass__`, `__prepare__`, class creation, `__class_getitem__`, `__class_getitem__`, runtime generic, `Generic`, `__orig_bases__`

#### Scenario: Function decorators require closure and class knowledge
- **WHEN** a learner has completed PF09 and PO01
- **THEN** PK01 is eligible

#### Scenario: Descriptors require attribute hooks and property knowledge
- **WHEN** a learner has completed PK03 and PO07
- **THEN** PK04 is eligible

#### Scenario: Metaclasses require inheritance and ABC knowledge
- **WHEN** a learner has completed PO03 and PO09
- **THEN** PK05 is eligible

#### Scenario: Runtime generics require metaclass and typing knowledge
- **WHEN** a learner has completed PK05 and PT03
- **THEN** PK06 is eligible

---

### Requirement: Testing track (PB) covers Python testing patterns and tools
The system SHALL provide a `python-testing` track with 5 nodes (PB01–PB05) covering unittest, pytest, mocking, property-based testing, and coverage/test organization.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PB01 | unittest: TestCase, setUp, tearDown, and assertions | D2 | PE01, PO01 |
| PB02 | pytest: test discovery, fixtures, parametrize, and marks | D2 | PE01 |
| PB03 | unittest.mock: Mock, MagicMock, patch, and side_effect | D2 | PB01 |
| PB04 | Property-based testing with hypothesis: @given, strategies, and shrinking | D3 | PB02 |
| PB05 | Coverage measurement, test organization, and CI patterns | D2 | PB02 |

**Keywords covered:** `unittest`, `TestCase`, `setUp`, `tearDown`, `assertEqual`, `assertRaises`, `assertAlmostEqual`, `subTest`, `pytest`, `test_`, fixture, `@pytest.fixture`, `@pytest.mark.parametrize`, `@pytest.mark.skip`, `conftest.py`, `unittest.mock`, `Mock`, `MagicMock`, `patch`, `@patch`, `side_effect`, `return_value`, `assert_called_with`, `assert_called_once`, `hypothesis`, `@given`, `strategies`, `st.integers`, `st.text`, shrinking, coverage, `.coveragerc`, `--cov`, `conftest.py`

#### Scenario: unittest requires exception handling and class knowledge
- **WHEN** a learner has completed PE01 and PO01
- **THEN** PB01 is eligible

#### Scenario: pytest requires only exception handling knowledge
- **WHEN** a learner has completed PE01
- **THEN** PB02 is eligible

#### Scenario: Mocking requires unittest foundation
- **WHEN** a learner has completed PB01
- **THEN** PB03 is eligible

#### Scenario: Hypothesis requires pytest knowledge
- **WHEN** a learner has completed PB02
- **THEN** PB04 is eligible

---

### Requirement: Performance and Profiling track (PH) covers Python performance analysis
The system SHALL provide a `python-performance` track with 5 nodes (PH01–PH05) covering timing, memory profiling, native extension basics, numpy integration, and object-level optimization.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| PH01 | timeit and cProfile: measuring execution time and call graph profiling | D2 | PF07 |
| PH02 | tracemalloc: tracking memory allocations and finding leaks | D2 | PH01 |
| PH03 | ctypes and cffi: calling C libraries from Python | D3 | PF07, PM01 |
| PH04 | numpy arrays vs Python lists: vectorized operations and performance | D2 | PD01, PF06 |
| PH05 | __slots__, __weakref__, sys.getsizeof, and reducing object memory overhead | D2 | PO01, PO08 |

**Keywords covered:** `timeit`, `cProfile`, `pstats`, `profile`, call graph, hot path, `tracemalloc`, `Snapshot`, `statistics`, `take_snapshot`, memory leak, `ctypes`, `cdll`, `CDLL`, `ctypes.c_int`, `cffi`, `ffi.cdef`, `numpy`, `ndarray`, `dtype`, vectorized, broadcasting, `np.array`, `np.zeros`, `np.arange`, `sys.getsizeof`, `__sizeof__`, `__slots__`, `__weakref__`, `weakref`, reference counting, object overhead

#### Scenario: Timing profiling requires function knowledge
- **WHEN** a learner has completed PF07
- **THEN** PH01 is eligible

#### Scenario: Memory profiling builds on timing profiling knowledge
- **WHEN** a learner has completed PH01
- **THEN** PH02 is eligible

#### Scenario: Object memory optimization requires class and slots knowledge
- **WHEN** a learner has completed PO01 and PO08
- **THEN** PH05 is eligible

#### Scenario: numpy coverage requires list and loop fundamentals
- **WHEN** a learner has completed PD01 and PF06
- **THEN** PH04 is eligible

### Requirement: Python High-Priority Composite Nodes Are Split Into Atomic Sub-Nodes
Python nodes that conflate multiple unrelated utilities or primitives SHALL be replaced by atomic sub-nodes:

- **PD06** (deque + Counter + defaultdict — 3 unrelated collections) SHALL be split into: PD06 (collections.deque: double-ended queue, appendleft, rotate, maxlen), PD06b (collections.Counter: counting hashables, most_common, arithmetic operators), and PD06c (collections.defaultdict: missing-key factory, use cases vs dict.setdefault).
- **PA04** (5 async synchronization primitives) SHALL be split into: PA04 (asyncio.Queue: producer-consumer patterns, get/put, task_done/join) and PA04b (asyncio.Lock, Event, Semaphore, Condition: the coordination primitive family).
- **PA05** (5+ threading primitives) SHALL be split into: PA05 (threading.Thread and Lock: the basic thread creation and mutual exclusion pattern) and PA05b (threading.Event, Condition, RLock: signalling and re-entrant locking).
- **PA06** (4+ multiprocessing concepts) SHALL be split into: PA06 (multiprocessing.Process: fork semantics, start/join, daemon processes), PA06b (multiprocessing.Pool: map/starmap/apply_async, worker pool pattern), and PA06c (multiprocessing.Queue and shared memory: IPC between processes).
- **PT07** (4 unrelated type annotations: TypedDict, Literal, Final, ClassVar) SHALL be split into: PT07 (typing.TypedDict: total/partial typed dicts, inheritance) and PT07b (Literal, Final, ClassVar: value-constrained types and class-level annotations).

#### Scenario: PD06 covers only deque
- **WHEN** a session targets node PD06
- **THEN** the scaffold plans content exclusively on collections.deque, O(1) append/pop from both ends, maxlen for bounded queues, and rotate

#### Scenario: PD06b covers Counter
- **WHEN** a session targets node PD06b
- **THEN** the scaffold plans content on Counter construction, most_common(), arithmetic operations (+, -, &, |), and typical frequency analysis patterns

#### Scenario: PD06c covers defaultdict
- **WHEN** a session targets node PD06c
- **THEN** the scaffold plans content on the default_factory callable, grouping patterns, and when to use defaultdict vs dict.setdefault vs collections.Counter

#### Scenario: PA04 covers asyncio.Queue only
- **WHEN** a session targets node PA04
- **THEN** the scaffold plans content on asyncio.Queue, producer/consumer coroutines, put/get, task_done, and join for backpressure

#### Scenario: PA06b covers Pool
- **WHEN** a session targets node PA06b
- **THEN** the scaffold plans content on Pool.map, Pool.starmap, Pool.apply_async, chunksize, and the process pool as a higher-level abstraction over multiprocessing.Process
