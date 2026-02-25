## Why

Python is among the most widely used programming languages in the world, spanning data science, web development, scripting, automation, and academic instruction — yet the curriculum system currently offers no structured, mastery-based Python practice. Learners who want to build Python fluency from first principles have no guided path through the system.

## What Changes

- Register `python` fully in `src/config/languages.js` with the correct test command (`python -m pytest`), source/test dir paths, and project config (conftest.py-based, no build file needed)
- Add ~100 Python curriculum nodes organized into 13 tracks with a full prerequisite graph
- Each node carries keywords for custom topic search, misconception tags for common Python learner errors, and appropriate depth targets (D1/D2/D3)
- Add a `src/runtime/pythonRuntime.js` module that writes `src/solution.py` (stub) and `conftest.py` for pytest
- Add Python-specific stage instructions (scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer) tuned to Python idioms and the `pytest` harness
- No changes to session flow, picker, mastery, or exercise loop — all are language-agnostic

**Tracks (planned):**
1. **Language Foundations** (~10 nodes, D1-D2) — variables, numeric types, strings, booleans/None, if/elif/else, for/while loops, functions, default args/*args/**kwargs, lambda/closures, comprehensions
2. **Data Structures** (~8 nodes, D1-D2) — lists, tuples, dicts, sets, namedtuple/NamedTuple, deque/Counter/defaultdict, OrderedDict/ChainMap, heapq/bisect
3. **OOP** (~9 nodes, D2) — classes, instance/class/static methods, inheritance/super, multiple inheritance/MRO, dunder methods (__str__/__repr__/__eq__/__hash__), sequence protocol, @property, __slots__, ABCs
4. **Iterators and Generators** (~6 nodes, D2-D3) — iterator protocol, generator functions/yield, yield from, generator expressions, itertools, functools
5. **Error Handling** (~6 nodes, D1-D2) — try/except/else/finally, exception hierarchy, raise/raise from, custom exceptions, context managers, contextlib
6. **Type System** (~7 nodes, D2) — type hints, Optional/Union, List/Dict/Tuple/Set generics, TypeVar/generics, Protocol, dataclasses, TypedDict/Literal
7. **Modules and Packages** (~5 nodes, D1-D2) — import/from import, packages/__init__.py, __all__, importlib, virtual environments
8. **Async and Concurrency** (~8 nodes, D2-D3) — asyncio event loop, async def/for/with, tasks/gather, queues/sync, threading, multiprocessing, concurrent.futures, GIL implications
9. **Functional Programming** (~5 nodes, D2) — first-class functions/HOF, map/filter/zip, sorted with key=/operator, functools.wraps/decorator factories, immutable patterns
10. **Standard Library I/O** (~7 nodes, D1-D2) — open()/modes/with, pathlib.Path, os/os.path, shutil, json, csv, struct/binary I/O
11. **Decorators and Metaprogramming** (~6 nodes, D2-D3) — function decorators, class decorators, __getattr__/__setattr__, descriptors, metaclasses, __class_getitem__
12. **Testing** (~5 nodes, D2) — unittest, pytest fixtures/parametrize, Mock/patch, hypothesis, coverage
13. **Performance and Profiling** (~5 nodes, D2-D3) — timeit/cProfile, tracemalloc, Cython/ctypes basics, numpy vs Python lists, __slots__/__weakref__/object size

## Capabilities

### New Capabilities
- `python-curriculum`: Comprehensive Python learning curriculum — 13 tracks, ~100 nodes, full prerequisite dependency graph, keyword coverage for topic search, misconception tags, and depth targets

### Modified Capabilities
<!-- none — existing spec-level behavior is language-agnostic; no requirement changes -->

## Impact

- `src/config/languages.js` — add `python` entry with conftest.py project config, `python -m pytest` test command, and depth targets
- `src/runtime/pythonRuntime.js` — new module writing `src/solution.py` stub and `conftest.py`
- `src/curriculum/` — new Python node definitions (~100 nodes); update track/node index and `allCurricula.js`
- `getCurriculumForLanguage("python")` already works once nodes are registered — no code changes needed there
- `fixtures/` — new exercise seed fixtures for Python scaffold/test/lesson templates
- No session, picker, mastery, or orchestration changes
