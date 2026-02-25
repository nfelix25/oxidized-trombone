## 1. Python Runtime Module

- [x] 1.1 Create `src/runtime/pythonRuntime.js` — export `writePythonProjectConfig(dir)` that writes `conftest.py` (with `sys.path.insert(0, str(Path(__file__).parent / "src"))`) and creates an empty `src/solution.py` stub and `tests/` directory
- [x] 1.2 Confirm `python -m pytest` succeeds against the generated workspace template (manual or test)

## 2. Python Stage Instructions

- [x] 2.1 Write `PYTHON_INSTRUCTIONS.scaffold` prompt in `src/config/languages.js` — Python exercise planner persona; references `src/solution.py`, `tests/test_*.py`; depth guidance: D1: 6-8 section_intents / 2-3 file_intents / 7-10 case_intents; D2: 8-12 / 3-4 / 10-14; D3: 10-15 / 4-6 / 12-18
- [x] 2.2 Write `PYTHON_INSTRUCTIONS["starter-expand"]` — Python code writer; generates `src/solution.py`; uses `pass` or `raise NotImplementedError` stubs; includes docstrings and type hints per function; no test files
- [x] 2.3 Write `PYTHON_INSTRUCTIONS["test-expand"]` — Python test writer; generates `tests/test_*.py`; uses `import pytest` and `from solution import ...`; tests use `def test_...` functions with `assert` statements and `pytest.raises` for exceptions
- [x] 2.4 Write `PYTHON_INSTRUCTIONS["lesson-expand"]` — Python educator; Python code in fences; pitfall sections show Python tracebacks; covers motivation, core concept, worked examples, pitfalls, comparison, bridge
- [x] 2.5 Write `PYTHON_INSTRUCTIONS.coach` and `PYTHON_INSTRUCTIONS.reviewer` — Python tutor and Python code reviewer personas; reviewer notes that errors appear as tracebacks with `Traceback (most recent call last):` format and test output uses `pytest` format

## 3. Language Registry Entry

- [x] 3.1 Add `python` entry to `REGISTRY` in `src/config/languages.js` with `name: "Python"`, `testCommand: ["python", "-m", "pytest"]`, `sourceDir: "src"`, `testsDir: "tests"`, `writeProjectConfig` pointing to `pythonRuntime.js`, `stageInstructions: PYTHON_INSTRUCTIONS`
- [x] 3.2 Verify `getAvailableLanguages()` returns `["rust", "c", "zig", "python"]` and `getLanguageConfig("python")` does not throw

## 4. Curriculum Seed — Foundations and Data Structures

- [x] 4.1 Create `src/curriculum/pythonSeed.js` — scaffold file with imports (`createCurriculumGraph`, `createNode`), per-track node arrays, track definitions, and a final `export const pythonCurriculum = createCurriculumGraph(...)` merging all nodes and tracks
- [x] 4.2 Add Language Foundations track (`python-foundations`): nodes PF01–PF10 with titles, depth targets, prerequisites, keywords, misconception tags (including `mutable-default-argument` on PF08, `late-binding-closure` on PF09), and `language: "python"` per spec
- [x] 4.3 Add Data Structures track (`python-data-structures`): nodes PD01–PD08 per spec
- [x] 4.4 Add OOP track (`python-oop`): nodes PO01–PO09 per spec

## 5. Curriculum Seed — Error Handling, Types, Modules

- [x] 5.1 Add Error Handling track (`python-errors`): nodes PE01–PE06 per spec
- [x] 5.2 Add Type System track (`python-types`): nodes PT01–PT07 per spec
- [x] 5.3 Add Modules and Packages track (`python-modules`): nodes PM01–PM05 per spec

## 6. Curriculum Seed — Iterators, Functional, I/O

- [x] 6.1 Add Iterators and Generators track (`python-iterators`): nodes PI01–PI06 per spec
- [x] 6.2 Add Functional Programming track (`python-functional`): nodes PX01–PX05 per spec
- [x] 6.3 Add Standard Library I/O track (`python-stdlib-io`): nodes PS01–PS07 per spec

## 7. Curriculum Seed — Async, Metaprogramming, Testing, Performance

- [x] 7.1 Add Async and Concurrency track (`python-async`): nodes PA01–PA08 with `gil-threading-confusion` misconception tag on PA05 and PA08 per spec
- [x] 7.2 Add Decorators and Metaprogramming track (`python-metaprogramming`): nodes PK01–PK06 per spec
- [x] 7.3 Add Testing track (`python-testing`): nodes PB01–PB05 per spec
- [x] 7.4 Add Performance and Profiling track (`python-performance`): nodes PH01–PH05 per spec

## 8. Wire Curriculum into allCurricula

- [x] 8.1 Import `pythonCurriculum` from `./pythonSeed.js` in `src/curriculum/allCurricula.js`
- [x] 8.2 Spread Python nodes and tracks into the `allCurricula` merge: `[...seedCurriculum.nodes, ...cCurriculum.nodes, ...zigCurriculum.nodes, ...pythonCurriculum.nodes]` and corresponding tracks

## 9. Verification and Tests

- [x] 9.1 Add test: `getCurriculumForLanguage("python")` returns only nodes with `language === "python"` and no Rust, C, or Zig nodes
- [x] 9.2 Add test: PF01 exists with no prerequisites (the Python curriculum entry point)
- [x] 9.3 Add test: total Python node count is 87 (10+8+9+6+6+7+5+8+5+7+6+5+5)
- [x] 9.4 Add test: all prerequisite node IDs in the Python curriculum resolve to existing Python nodes (internal consistency — no dangling prerequisite references)
- [x] 9.5 Add test: `getAvailableLanguages()` includes "python"
- [x] 9.6 Run full test suite and confirm all tests pass
