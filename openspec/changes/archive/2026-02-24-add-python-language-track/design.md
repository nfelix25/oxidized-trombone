## Context

The curriculum system merges language-specific seed files into `allCurricula` via `allCurricula.js`. Rust nodes live in `seedCurriculum.js`; C nodes in `cSeed.js`; Zig nodes in `zigSeed.js`. Language runtime config (test command, project file writer, stage prompts) lives in `src/config/languages.js`. A new language requires: (1) a seed file for nodes+tracks, (2) a runtime module that writes the project scaffold (analogous to `cRuntime.js` and `zigRuntime.js`), and (3) an entry in the REGISTRY.

Python is an interpreted language — unlike Rust (cargo), C (make/cc), and Zig (build.zig), Python requires no build step. The test harness is `pytest`, which discovers and runs tests by convention. The project layout uses `src/solution.py` as the learner's implementation file and `tests/` for pytest test files. A `conftest.py` at the workspace root adds `src/` to the Python path so tests can `from solution import ...` without installation.

## Goals / Non-Goals

**Goals:**
- ~100 nodes across 13 tracks covering the full Python language and standard library
- Full prerequisite graph so `runGuidedNav` can recommend eligible nodes and block locked ones
- Python-specific stage instructions (scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer) tuned to Python idioms and the `pytest` harness
- Keyword coverage on every node so custom topic search finds Python nodes
- Misconception tags capturing common Python learner errors (mutability confusion, late-binding closures, mutable default args, GIL misunderstandings, etc.)

**Non-Goals:**
- Web frameworks (Django, Flask, FastAPI) — application-level, not language-level
- Data science libraries beyond numpy basics (pandas, scikit-learn, etc.) — too specialized
- Async web servers or ASGI/WSGI internals — infrastructure, not curriculum
- Python 2 compatibility patterns — Python 2 is EOL
- CPython internals or bytecode — too deep for a curriculum tool
- Type checking toolchains (mypy, pyright configuration) — tooling, not language

## Decisions

### D1: New `src/curriculum/pythonSeed.js` file (same pattern as `zigSeed.js`)

**Decision:** Add `src/curriculum/pythonSeed.js` exporting a `pythonCurriculum` object. Wire it into `allCurricula.js` with a single spread, same as `cCurriculum` and `zigCurriculum`.

**Rationale:** Keeps language curricula isolated. `allCurricula.js` stays a simple merge. No changes to `getCurriculumForLanguage` or any session/mastery code.

---

### D2: Node ID scheme — 2-letter prefix + 2-digit number

**Decision:** Each track gets a 2-letter Python prefix:
- `PF` — Foundations
- `PD` — Data structures
- `PO` — OOP
- `PI` — Iterators/generators
- `PE` — Errors
- `PT` — Types/annotations
- `PM` — Modules/packages
- `PA` — Async/concurrency
- `PX` — functional (eXtra functional)
- `PS` — Standard library I/O
- `PK` — metaprogramming (decKorators)
- `PB` — testing (Build/test)
- `PH` — performance (Hotpath)

IDs: `PF01`, `PF02`, ..., `PD01`, `PD02`, etc. Two-digit suffixes allow up to 99 nodes per track.

**Rationale:** Prevents collision with existing Rust (S, A, B, C, M, G, X), C (C2xx), and Zig (ZF/ZP/ZM/ZA/ZE/ZO/ZC/ZL/ZI/ZT/ZX/ZB/ZU/ZG) node IDs. `P` prefix is immediately readable as Python.

---

### D3: New `src/runtime/pythonRuntime.js` for project scaffolding

**Decision:** Add `src/runtime/pythonRuntime.js` exporting `writePythonProjectConfig(dir)`. It writes:
- `conftest.py` — adds `src/` to `sys.path` so `from solution import ...` works in tests without installing a package
- `src/solution.py` — empty module entry point (the AI fills in stubs during starter-expand)
- `tests/` — empty directory created for pytest discovery

The test command is `["python", "-m", "pytest"]`, which pytest interprets via standard test discovery.

**Rationale:** Mirrors the C and Zig runtime patterns. `conftest.py` is the idiomatic pytest mechanism for path manipulation — it avoids requiring learners to set `PYTHONPATH` or install the package. The runtime module stays slim — just template strings, same as `zigRuntime.js`.

**Alternative considered:** Using `pyproject.toml` with an editable install (`pip install -e .`). Rejected because it requires pip, adds setup complexity, and is overkill for isolated exercise workspaces.

---

### D4: Python stage instructions as `PYTHON_INSTRUCTIONS` in `languages.js`

**Decision:** Add a `PYTHON_INSTRUCTIONS` constant to `languages.js` with keys: `scaffold`, `starter-expand`, `test-expand`, `lesson-expand`, `coach`, `reviewer`. Wire into the `python` REGISTRY entry as `stageInstructions: PYTHON_INSTRUCTIONS`.

Key instruction differences from Rust and Zig:
- **scaffold**: Python-aware; references `src/solution.py`, `tests/test_*.py`; mentions depth targets for Python (D1: 6-8 section_intents; D2: 8-12; D3: 10-15)
- **starter-expand**: Generates `solution.py`; stubs use `pass` or `raise NotImplementedError`; includes docstrings and type hints; no test files
- **test-expand**: Generates `tests/test_*.py`; uses `import pytest` and `from solution import ...`; tests use `def test_...` functions with plain `assert` statements or `pytest.raises`
- **lesson-expand**: Python educator persona; Python code in fences; pitfall sections show Python tracebacks; covers motivation, core concept, worked examples, pitfalls, comparison, bridge
- **coach/reviewer**: Python tutor and Python code reviewer personas; reviewer notes that errors appear as tracebacks with `Traceback (most recent call last):` format and test output uses `pytest` format

---

### D5: Prerequisite graph structure

**Decision:** Use a layered dependency graph:

```
PF (Foundations) — entry point, no prerequisites
  └─ PD (Data Structures) — needs PF06 (loops)
  └─ PO (OOP) — needs PF07 (functions)
  └─ PE (Error Handling) — needs PF05 (control flow)
  └─ PM (Modules) — needs PF01 (basics)
  └─ PH.PH01 — needs PF07
  └─ PX (Functional) — needs PF07, PF09, PF10
  └─ PI (Iterators) — needs PO01, PF07
  └─ PT (Types) — needs PF07
  └─ PS (I/O) — needs PE05 (context managers)
  └─ PK (Metaprogramming) — needs PF09, PO01
  └─ PA (Async) — needs PF07, PE01
  └─ PB (Testing) — needs PE01
```

Root entry node: `PF01` (variables, assignment, names) — no prerequisites, accessible immediately.

---

### D6: Depth target distribution

**Decision:**
- **D1** (6-8 lesson sections, 2-3 starter files, 7-10 tests): Pure syntax and first-use concepts — first ~4 Foundations nodes, first Data Structures nodes, basic error handling, basic imports, file open()
- **D2** (8-12 lesson sections, 3-4 starter files, 10-14 tests): Standard library usage, common patterns — most OOP, collections, type hints, async basics, testing
- **D3** (10-15 lesson sections, 4-6 starter files, 12-18 tests): Advanced Python idioms — metaclasses, descriptors, asyncio synchronization, yield from, hypothesis, ctypes, GIL analysis

---

### D7: conftest.py path injection strategy

**Decision:** The generated `conftest.py` uses `sys.path.insert(0, str(Path(__file__).parent / "src"))` so tests can do `from solution import my_function`. This is the standard pytest pattern for non-installed source.

**Rationale:** Avoids naming collisions with installed packages. The `conftest.py` is auto-discovered by pytest at the workspace root and takes effect before any test collection. No environment variables or command-line flags required.

## Risks / Trade-offs

**Python version differences** → Some features (union type syntax `X | Y`, `match`/`case`, `tomllib`) require Python 3.10+. Mitigation: Target Python 3.11+ (current stable as of 2024); note version in stage instructions; use `typing.Union` syntax in earlier nodes for broader compatibility notes.

**`pytest` vs `unittest` discovery** → Some learners may know unittest but not pytest. Mitigation: The PB track covers both, starting with unittest (PB01) then pytest (PB02). The test harness itself uses pytest (`python -m pytest`) for all nodes.

**~100 nodes is a large content task** → The `pythonSeed.js` file will be large. Mitigation: Split by track into separate constants (same pattern as `zigSeed.js` using per-track arrays), then merge at the end of the file.

**Mutable default argument misconception** → One of Python's most common pitfalls — `def f(x=[])` creates a shared list. Mitigation: Explicitly add `mutable-default-argument` as a misconception tag on PF08; the coach and reviewer instructions should call this out.

**Late-binding closures** → Another common Python footgun — `lambda` in a loop captures the loop variable by reference. Mitigation: Add `late-binding-closure` misconception tag on PF09 and PX01.

**GIL and threading confusion** → Learners often assume Python threading provides true parallelism for CPU-bound work. Mitigation: PA08 node explicitly addresses GIL implications; `gil-threading-confusion` misconception tag on PA05 and PA08.

## Open Questions

None — scope is fully defined.
