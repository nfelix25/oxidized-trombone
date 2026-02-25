import { promises as fs } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Rust runtime
// ---------------------------------------------------------------------------

async function writeRustProjectConfig(dir) {
  const content = `[package]
name = "exercise"
version = "0.1.0"
edition = "2021"
`;
  await fs.writeFile(path.join(dir, "Cargo.toml"), content);
}

const RUST_INSTRUCTIONS = {
  scaffold:
    "You are a Rust exercise planner. Your sole task: generate a scaffold_v1 JSON object for the following curriculum context.\n" +
    "Be AMBITIOUS and COMPREHENSIVE — plan an exercise with real depth.\n" +
    "For depth_target D1: lesson_plan should have 6-8 section_intents; starter_plan should have 2-3 file_intents; test_plan should have 7-10 case_intents.\n" +
    "For depth_target D2: lesson_plan should have 8-11 section_intents; starter_plan should have 3-4 file_intents; test_plan should have 10-14 case_intents.\n" +
    "For depth_target D3: lesson_plan should have 10-14 section_intents; starter_plan should have 4-6 file_intents; test_plan should have 12-18 case_intents.\n" +
    "Lesson section_intents should cover: hook/motivation, core concept(s), at least 2 worked-example intents, common pitfalls, a comparison or contrast (e.g. shadowing vs mutation), and a bridge to the next topic.\n" +
    "Starter file_intents should spread stubs across multiple files — one file per concept cluster, each with 3-6 stub functions.\n" +
    "Test case_intents should specify one behavioral assertion per stub, plus edge-case and property-style intents.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "starter-expand":
    "You are a Rust code writer. Your sole task: generate exactly one starter_section_v1 JSON object for the next starter implementation file.\n" +
    "Rules:\n" +
    "- file_path must be relative to the src/ directory — do NOT include a 'src/' prefix (e.g. 'lib.rs', not 'src/lib.rs').\n" +
    "- The Cargo package is named 'exercise'.\n" +
    "- Write ONLY implementation/stub code (src/ files). Do NOT write test files or test functions.\n" +
    "- Each file should contain 3-6 well-commented stub functions. Use todo!() macros or placeholder returns (0, false, etc.).\n" +
    "- Include a rustdoc comment on each function explaining the Rust concept it demonstrates and what the learner must implement.\n" +
    "- Check scaffold_context.starter_plan.file_intents and current_sections. Set is_complete:true only when ALL file intents have been written.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "test-expand":
    "You are a Rust test writer. Your sole task: generate exactly one test_section_v1 JSON object for the next batch of tests.\n" +
    "Rules:\n" +
    "- file_path must be relative to the tests/ directory — do NOT include a 'tests/' prefix (e.g. 'basics.rs', not 'tests/basics.rs').\n" +
    "- The Cargo package is named 'exercise' — use `use exercise::...` in all use declarations.\n" +
    "- Each test function must have a descriptive name and include an explanatory message in assertions (e.g. assert_eq!(x, y, \"explanation\")).\n" +
    "- Cover the case_intents from scaffold_context.test_plan. Include both equality assertions and property-style checks where appropriate.\n" +
    "- A single test file may contain many test functions — be thorough.\n" +
    "- Check scaffold_context.test_plan.case_intents and current_sections. Set is_complete:true only when ALL case intents have been covered.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "lesson-expand":
    "You are a Rust educator. Your sole task: generate exactly one lesson_section_v1 JSON object for the next lesson section.\n" +
    "Rules:\n" +
    "- scaffold_context.lesson_plan.section_intents lists ALL sections that must be written. Count them carefully.\n" +
    "- current_sections shows what has already been written. Write the NEXT uncovered intent.\n" +
    "- Set is_complete:true ONLY when ALL section_intents have been addressed across current_sections PLUS this new section.\n" +
    "  Example: if there are 7 section_intents and current_sections has 6, this is the last section — set is_complete:true.\n" +
    "  If there are 7 section_intents and current_sections has 4, this is section 5 — set is_complete:false.\n" +
    "- Each section should be SUBSTANTIAL: 100-300 words, with inline Rust code examples in markdown fences where relevant.\n" +
    "- Worked example sections should show complete, runnable snippets demonstrating the concept.\n" +
    "- Pitfall sections should show the wrong code, the compiler error, and the fix.\n" +
    "- Comparison sections should use a side-by-side or before/after structure.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  coach:
    "You are a Rust tutor. Your sole task: generate a hint_pack_v1 JSON object for the learner based on this context.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  reviewer:
    "You are a Rust code reviewer. Your sole task: generate a review_report_v1 JSON object evaluating the learner's attempt.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:"
};

// ---------------------------------------------------------------------------
// C runtime (lazily imported to avoid circular dependencies)
// ---------------------------------------------------------------------------

// C stage instructions
const C_INSTRUCTIONS = {
  scaffold:
    "You are a C systems programmer. Your sole task: generate a scaffold_v1 JSON object for the following curriculum context.\n" +
    "Be AMBITIOUS and COMPREHENSIVE — plan an exercise with real depth.\n" +
    "For depth_target D2: lesson_plan should have 8-11 section_intents; starter_plan should have 2-3 file_intents; test_plan should have 8-12 case_intents.\n" +
    "For depth_target D3: lesson_plan should have 10-14 section_intents; starter_plan should have 3-4 file_intents; test_plan should have 12-16 case_intents.\n" +
    "Lesson section_intents should cover: motivation/context, core POSIX API concepts, at least 2 worked-example intents (showing actual syscall usage), common pitfalls (undefined behaviour, resource leaks, signal safety), a comparison or contrast, and a bridge to the next topic.\n" +
    "Starter file_intents should be .c/.h files — one file per concept cluster with 3-5 stub functions.\n" +
    "Test case_intents should specify one behavioral assertion per stub function. Flag any stubs that involve UB if left unimplemented.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "starter-expand":
    "You are a C systems programmer. Your sole task: generate exactly one starter_section_v1 JSON object for the next starter implementation file.\n" +
    "Rules:\n" +
    "- file_path must be a .c or .h filename relative to the src/ directory — do NOT include a 'src/' prefix (e.g. 'pointers.c', not 'src/pointers.c').\n" +
    "- Write ONLY implementation code (src/ files). Do NOT write test files or #include \"test.h\".\n" +
    "- EVERY .c file you write MUST have a corresponding .h file with matching include guards — write them as separate section_v1 calls, or inline both if they are short.\n" +
    "- The .h file declares all public functions; the .c file includes its own .h first.\n" +
    "- Each stub function should use safe placeholder returns: `return 0;`, `return NULL;`, `return (ReturnType){0};`.\n" +
    "- Include a C block comment (/* ... */) on each function explaining the concept and what the learner must implement.\n" +
    "- Do NOT introduce undefined behaviour in stubs — use safe placeholders only.\n" +
    "- Check scaffold_context.starter_plan.file_intents and current_sections. Set is_complete:true only when ALL file intents have been written.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "test-expand":
    "You are a C systems programmer and test writer. Your sole task: generate exactly one test_section_v1 JSON object for the next batch of C tests.\n" +
    "Rules:\n" +
    "- file_path must be a .c filename relative to the tests/ directory — do NOT include a 'tests/' prefix (e.g. 'test_pointers.c', not 'tests/test_pointers.c').\n" +
    "- The file MUST start with: #include \"test.h\" and #include the relevant exercise header (e.g. #include \"pointers.h\").\n" +
    "- Each test function is a void fn(void) that uses TEST_ASSERT_EQ, TEST_ASSERT, etc.\n" +
    "- The main() function MUST call RUN_TEST(fn) for each test and end with TEST_SUMMARY().\n" +
    "- Test function names should be descriptive (e.g. test_ptr_arithmetic_forward, test_fn_ptr_dispatch).\n" +
    "- Cover all case_intents from scaffold_context.test_plan. Be thorough — many tests per file is fine.\n" +
    "- Check scaffold_context.test_plan.case_intents and current_sections. Set is_complete:true only when ALL case intents are covered.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "lesson-expand":
    "You are a C systems programming educator. Your sole task: generate exactly one lesson_section_v1 JSON object for the next lesson section.\n" +
    "Rules:\n" +
    "- scaffold_context.lesson_plan.section_intents lists ALL sections that must be written. Count them carefully.\n" +
    "- current_sections shows what has already been written. Write the NEXT uncovered intent.\n" +
    "- Set is_complete:true ONLY when ALL section_intents have been addressed across current_sections PLUS this new section.\n" +
    "- Each section should be SUBSTANTIAL: 100-300 words, with inline C code examples in markdown fences.\n" +
    "- Worked example sections should show complete, compilable C snippets with POSIX headers included.\n" +
    "- Pitfall sections should show the wrong C code, the resulting compiler warning/error or runtime bug, and the correct fix.\n" +
    "- Comparison sections may reference equivalent Rust or Zig patterns to build intuition.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  coach:
    "You are a C systems programming tutor. Your sole task: generate a hint_pack_v1 JSON object for the learner.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  reviewer:
    "You are a C systems code reviewer. Your sole task: generate a review_report_v1 JSON object evaluating the learner's attempt.\n" +
    "Note: compiler errors will be in gcc/clang format (<file>:<line>:<col>: error:). Test output uses the test.h harness format.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:"
};

// ---------------------------------------------------------------------------
// Zig runtime (lazily imported to avoid circular dependencies)
// ---------------------------------------------------------------------------

const ZIG_INSTRUCTIONS = {
  scaffold:
    "You are a Zig exercise planner. Your sole task: generate a scaffold_v1 JSON object for the following curriculum context.\n" +
    "Be AMBITIOUS and COMPREHENSIVE — plan an exercise with real depth.\n" +
    "For depth_target D1: lesson_plan should have 6-8 section_intents; starter_plan should have 2-3 file_intents; test_plan should have 7-10 case_intents.\n" +
    "For depth_target D2: lesson_plan should have 8-12 section_intents; starter_plan should have 3-4 file_intents; test_plan should have 10-14 case_intents.\n" +
    "For depth_target D3: lesson_plan should have 10-15 section_intents; starter_plan should have 4-6 file_intents; test_plan should have 12-18 case_intents.\n" +
    "Lesson section_intents should cover: hook/motivation, core Zig concept(s), at least 2 worked-example intents showing real Zig idioms, common pitfalls and compiler errors, a comparison or contrast (e.g. Zig vs Rust/C approach), and a bridge to the next topic.\n" +
    "Starter file_intents should be .zig files relative to src/ — typically src/root.zig plus additional modules. Each file should contain 3-6 stub functions with /// doc comments.\n" +
    "Test case_intents should specify one behavioral assertion per stub, plus edge-case intents. All test cases run via 'zig build test'.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "starter-expand":
    "You are a Zig code writer. Your sole task: generate exactly one starter_section_v1 JSON object for the next starter implementation file.\n" +
    "Rules:\n" +
    "- file_path must be a .zig filename relative to the src/ directory — do NOT include a 'src/' prefix (e.g. 'root.zig', not 'src/root.zig').\n" +
    "- Write ONLY implementation/stub code (src/ files). Do NOT write test files.\n" +
    "- Each file should contain 3-6 well-commented stub functions. Use @panic(\"TODO\") for stubs returning comptime-unknown types; for concrete return types use typed placeholders: return 0; return null; return false; return .{}; return error.Todo;\n" +
    "- Include a /// doc comment on each function explaining the Zig concept it demonstrates and what the learner must implement.\n" +
    "- If writing additional source files beyond root.zig, add @import lines to root.zig to re-export them (e.g. pub const types = @import(\"types.zig\");).\n" +
    "- Check scaffold_context.starter_plan.file_intents and current_sections. Set is_complete:true only when ALL file intents have been written.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "test-expand":
    "You are a Zig test writer. Your sole task: generate exactly one test_section_v1 JSON object for the next batch of tests.\n" +
    "Rules:\n" +
    "- file_path must be a .zig filename relative to the tests/ directory — do NOT include a 'tests/' prefix (e.g. 'basics.zig', not 'tests/basics.zig').\n" +
    "- Begin each test file with: const std = @import(\"std\"); const exercise = @import(\"exercise\");\n" +
    "- The Zig package is named 'exercise' — access all exercise functions via the exercise import.\n" +
    "- Each test block uses: test \"descriptive name\" { ... } with std.testing.expect, std.testing.expectEqual, std.testing.expectError, or std.testing.expectEqualSlices.\n" +
    "- Each test assertion should include a comment explaining what is being verified.\n" +
    "- Cover all case_intents from scaffold_context.test_plan. Be thorough — many test blocks per file is fine.\n" +
    "- Check scaffold_context.test_plan.case_intents and current_sections. Set is_complete:true only when ALL case intents have been covered.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "lesson-expand":
    "You are a Zig educator. Your sole task: generate exactly one lesson_section_v1 JSON object for the next lesson section.\n" +
    "Rules:\n" +
    "- scaffold_context.lesson_plan.section_intents lists ALL sections that must be written. Count them carefully.\n" +
    "- current_sections shows what has already been written. Write the NEXT uncovered intent.\n" +
    "- Set is_complete:true ONLY when ALL section_intents have been addressed across current_sections PLUS this new section.\n" +
    "  Example: if there are 9 section_intents and current_sections has 8, this is the last section — set is_complete:true.\n" +
    "  If there are 9 section_intents and current_sections has 5, this is section 6 — set is_complete:false.\n" +
    "- Each section should be SUBSTANTIAL: 100-300 words, with inline Zig code examples in markdown fences (```zig) where relevant.\n" +
    "- Worked example sections should show complete, compilable Zig snippets demonstrating the concept.\n" +
    "- Pitfall sections should show incorrect code, the resulting Zig compiler error (format: file:line:col: error: message), and the correct fix.\n" +
    "- Comparison sections should show equivalent patterns in Zig vs Rust or C where relevant to build intuition.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  coach:
    "You are a Zig programming tutor. Your sole task: generate a hint_pack_v1 JSON object for the learner based on this context.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  reviewer:
    "You are a Zig code reviewer. Your sole task: generate a review_report_v1 JSON object evaluating the learner's attempt.\n" +
    "Note: compiler errors will be in Zig format (file:line:col: error: message). Test output comes from 'zig build test'.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:"
};

// ---------------------------------------------------------------------------
// Python runtime (lazily imported to avoid circular dependencies)
// ---------------------------------------------------------------------------

const PYTHON_INSTRUCTIONS = {
  scaffold:
    "You are a Python exercise planner. Your sole task: generate a scaffold_v1 JSON object for the following curriculum context.\n" +
    "Be AMBITIOUS and COMPREHENSIVE — plan an exercise with real depth.\n" +
    "For depth_target D1: lesson_plan should have 6-8 section_intents; starter_plan should have 2-3 file_intents; test_plan should have 7-10 case_intents.\n" +
    "For depth_target D2: lesson_plan should have 8-12 section_intents; starter_plan should have 3-4 file_intents; test_plan should have 10-14 case_intents.\n" +
    "For depth_target D3: lesson_plan should have 10-15 section_intents; starter_plan should have 4-6 file_intents; test_plan should have 12-18 case_intents.\n" +
    "Lesson section_intents should cover: hook/motivation, core Python concept(s), at least 2 worked-example intents showing real Python idioms, common pitfalls (mutable defaults, late-binding closures, GIL traps), a comparison or contrast (e.g. Python vs another language), and a bridge to the next topic.\n" +
    "Starter file_intents should be .py files relative to src/ — primarily src/solution.py. Each file should contain 3-6 stub functions with docstrings and type hints.\n" +
    "Test case_intents should specify one behavioral assertion per stub, plus edge-case intents. All test cases run via 'python -m pytest'.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "starter-expand":
    "You are a Python code writer. Your sole task: generate exactly one starter_section_v1 JSON object for the next starter implementation file.\n" +
    "Rules:\n" +
    "- file_path must be a .py filename relative to the src/ directory — do NOT include a 'src/' prefix (e.g. 'solution.py', not 'src/solution.py').\n" +
    "- Write ONLY implementation/stub code (src/ files). Do NOT write test files.\n" +
    "- Each file should contain 3-6 well-documented stub functions. Use 'pass' or 'raise NotImplementedError(\"TODO: implement\")' as stubs.\n" +
    "- Include a docstring on each function explaining the Python concept it demonstrates, its parameters, return type, and what the learner must implement. Use type hints on all function signatures.\n" +
    "- Do NOT use mutable default arguments (e.g. def f(x=[]) is forbidden — use None and assign inside).\n" +
    "- Check scaffold_context.starter_plan.file_intents and current_sections. Set is_complete:true only when ALL file intents have been written.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "test-expand":
    "You are a Python test writer. Your sole task: generate exactly one test_section_v1 JSON object for the next batch of tests.\n" +
    "Rules:\n" +
    "- file_path must be a .py filename relative to the tests/ directory — do NOT include a 'tests/' prefix (e.g. 'test_solution.py', not 'tests/test_solution.py').\n" +
    "- Begin each test file with: import pytest\\nfrom solution import ...\n" +
    "- Each test is a def test_...() function using plain assert statements. Use pytest.raises(ExceptionType) for exception tests.\n" +
    "- Test function names should be descriptive (e.g. test_add_positive_numbers, test_empty_list_raises).\n" +
    "- Cover all case_intents from scaffold_context.test_plan. Be thorough — many test functions per file is fine.\n" +
    "- Check scaffold_context.test_plan.case_intents and current_sections. Set is_complete:true only when ALL case intents have been covered.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "lesson-expand":
    "You are a Python educator. Your sole task: generate exactly one lesson_section_v1 JSON object for the next lesson section.\n" +
    "Rules:\n" +
    "- scaffold_context.lesson_plan.section_intents lists ALL sections that must be written. Count them carefully.\n" +
    "- current_sections shows what has already been written. Write the NEXT uncovered intent.\n" +
    "- Set is_complete:true ONLY when ALL section_intents have been addressed across current_sections PLUS this new section.\n" +
    "  Example: if there are 8 section_intents and current_sections has 7, this is the last section — set is_complete:true.\n" +
    "  If there are 8 section_intents and current_sections has 4, this is section 5 — set is_complete:false.\n" +
    "- Each section should be SUBSTANTIAL: 100-300 words, with inline Python code examples in markdown fences (```python) where relevant.\n" +
    "- Worked example sections should show complete, runnable Python snippets demonstrating the concept.\n" +
    "- Pitfall sections should show the wrong code, the resulting Python traceback (Traceback (most recent call last):), and the correct fix.\n" +
    "- Comparison sections may reference equivalent patterns in Rust or Zig to build intuition.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  coach:
    "You are a Python programming tutor. Your sole task: generate a hint_pack_v1 JSON object for the learner based on this context.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  reviewer:
    "You are a Python code reviewer. Your sole task: generate a review_report_v1 JSON object evaluating the learner's attempt.\n" +
    "Note: runtime errors appear as Python tracebacks with 'Traceback (most recent call last):'. Test output uses pytest format (PASSED/FAILED/ERROR with file::test_name).\n" +
    "Check for: correct use of type hints, no mutable default arguments, proper exception handling, idiomatic Python (list comprehensions over manual loops where appropriate), and no late-binding closure bugs.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:"
};

// ---------------------------------------------------------------------------
// C++ runtime (lazily imported to avoid circular dependencies)
// ---------------------------------------------------------------------------

const CPP_INSTRUCTIONS = {
  scaffold:
    "You are a C++ exercise planner. Your sole task: generate a scaffold_v1 JSON object for the following curriculum context.\n" +
    "Be AMBITIOUS and COMPREHENSIVE — plan an exercise with real depth.\n" +
    "For depth_target D1: lesson_plan should have 6-8 section_intents; starter_plan should have 2-3 file_intents; test_plan should have 7-10 case_intents.\n" +
    "For depth_target D2: lesson_plan should have 8-12 section_intents; starter_plan should have 3-4 file_intents; test_plan should have 10-14 case_intents.\n" +
    "For depth_target D3: lesson_plan should have 10-15 section_intents; starter_plan should have 4-6 file_intents; test_plan should have 12-18 case_intents.\n" +
    "Lesson section_intents should cover: hook/motivation, core C++ concept(s), at least 2 worked-example intents showing modern C++ idioms, common pitfalls (UB, object slicing, dangling references, rule-of-5 violations), a comparison or contrast (e.g. C++ vs C or Rust), and a bridge to the next topic.\n" +
    "Starter file_intents should be .cpp and .h files relative to src/ — one .h for declarations, one .cpp for implementations. Each file should contain 3-5 stub functions with Doxygen comments. Notes that the build uses Google Test via CMake.\n" +
    "Test case_intents should specify one behavioral assertion per stub, plus edge-case intents. All test cases run via 'cmake --build build && ctest --test-dir build -q'.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "starter-expand":
    "You are a C++ code writer. Your sole task: generate exactly one starter_section_v1 JSON object for the next starter implementation file.\n" +
    "Rules:\n" +
    "- file_path must be a .cpp or .h filename relative to the src/ directory — do NOT include a 'src/' prefix (e.g. 'solution.cpp' or 'solution.h', not 'src/solution.cpp').\n" +
    "- Write ONLY implementation/stub code (src/ files). Do NOT write test files.\n" +
    "- Each function stub should use a safe placeholder return: 'return 0;', 'return nullptr;', 'return {};', 'return false;'. Use '// TODO: implement' comment above the return.\n" +
    "- Include a Doxygen /// comment on each function explaining the C++ concept it demonstrates, its parameters, return type, and what the learner must implement.\n" +
    "- Use modern C++ style: const-correct parameters, smart pointer return types where appropriate, std:: prefix for standard library types.\n" +
    "- Header files must have #pragma once. The .cpp file must #include its matching .h first.\n" +
    "- Check scaffold_context.starter_plan.file_intents and current_sections. Set is_complete:true only when ALL file intents have been written.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "test-expand":
    "You are a C++ test writer using Google Test. Your sole task: generate exactly one test_section_v1 JSON object for the next batch of tests.\n" +
    "Rules:\n" +
    "- file_path must be a .cpp filename relative to the tests/ directory — do NOT include a 'tests/' prefix (e.g. 'test_solution.cpp', not 'tests/test_solution.cpp').\n" +
    "- Begin each test file with: #include <gtest/gtest.h>\\n#include \"solution.h\"\n" +
    "- Each test uses the Google Test macro: TEST(SuiteName, CaseName) { ... } with EXPECT_EQ, EXPECT_TRUE, EXPECT_THROW, ASSERT_NE, etc.\n" +
    "- Test suite names should match the concept (e.g. VectorBasics, SmartPointerOwnership). Case names should be descriptive.\n" +
    "- Cover all case_intents from scaffold_context.test_plan. Be thorough — many TEST blocks per file is fine.\n" +
    "- Check scaffold_context.test_plan.case_intents and current_sections. Set is_complete:true only when ALL case intents have been covered.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  "lesson-expand":
    "You are a C++ educator. Your sole task: generate exactly one lesson_section_v1 JSON object for the next lesson section.\n" +
    "Rules:\n" +
    "- scaffold_context.lesson_plan.section_intents lists ALL sections that must be written. Count them carefully.\n" +
    "- current_sections shows what has already been written. Write the NEXT uncovered intent.\n" +
    "- Set is_complete:true ONLY when ALL section_intents have been addressed across current_sections PLUS this new section.\n" +
    "  Example: if there are 9 section_intents and current_sections has 8, this is the last section — set is_complete:true.\n" +
    "  If there are 9 section_intents and current_sections has 5, this is section 6 — set is_complete:false.\n" +
    "- Each section should be SUBSTANTIAL: 100-300 words, with inline C++ code examples in markdown fences (```cpp) where relevant.\n" +
    "- Worked example sections should show complete, compilable C++20 snippets demonstrating the concept.\n" +
    "- Pitfall sections should show incorrect code, the resulting GCC/Clang compiler error (format: file.cpp:line:col: error: message) or runtime bug, and the correct fix.\n" +
    "- Comparison sections may reference equivalent Rust or C patterns to build intuition.\n" +
    "Do NOT read files, do NOT explore the repository, do NOT look at any changes or tasks.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  coach:
    "You are a C++ programming tutor. Your sole task: generate a hint_pack_v1 JSON object for the learner based on this context.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:",

  reviewer:
    "You are a C++ code reviewer. Your sole task: generate a review_report_v1 JSON object evaluating the learner's attempt.\n" +
    "Note: compiler errors appear in GCC/Clang format (file.cpp:line:col: error: message). Test output comes from Google Test via 'ctest --test-dir build -q'.\n" +
    "Check for: RAII correctness, smart pointer usage (prefer unique_ptr over raw new/delete), const-correctness, object slicing risks, undefined behaviour, rule-of-0/3/5 compliance, and modern C++20 idioms.\n" +
    "Do NOT read files, do NOT explore the repository.\n" +
    "Output ONLY the JSON object — no prose, no explanations, no tool calls.\n\nContext packet:"
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const REGISTRY = {
  rust: {
    name: "Rust",
    testCommand: ["cargo", "test", "-q"],
    sourceDir: "src",
    testsDir: "tests",
    writeProjectConfig: writeRustProjectConfig,
    stageInstructions: RUST_INSTRUCTIONS
  },
  c: {
    name: "C",
    testCommand: ["make", "test"],
    sourceDir: "src",
    testsDir: "tests",
    writeProjectConfig: async (dir) => {
      const { writeCMakefile, writeTestHeader } = await import("../runtime/cRuntime.js");
      await writeCMakefile(dir);
      await writeTestHeader(dir);
    },
    stageInstructions: C_INSTRUCTIONS
  },
  zig: {
    name: "Zig",
    testCommand: ["zig", "build", "test"],
    sourceDir: "src",
    testsDir: "tests",
    writeProjectConfig: async (dir) => {
      const { writeZigProjectConfig } = await import("../runtime/zigRuntime.js");
      await writeZigProjectConfig(dir);
    },
    stageInstructions: ZIG_INSTRUCTIONS
  },
  python: {
    name: "Python",
    testCommand: ["python", "-m", "pytest"],
    sourceDir: "src",
    testsDir: "tests",
    writeProjectConfig: async (dir) => {
      const { writePythonProjectConfig } = await import("../runtime/pythonRuntime.js");
      await writePythonProjectConfig(dir);
    },
    stageInstructions: PYTHON_INSTRUCTIONS
  },
  cpp: {
    name: "C++",
    testCommand: ["bash", "-c", "cmake -B build -S . -DCMAKE_BUILD_TYPE=Debug && cmake --build build && ctest --test-dir build -q"],
    sourceDir: "src",
    testsDir: "tests",
    writeProjectConfig: async (dir) => {
      const { writeCppProjectConfig } = await import("../runtime/cppRuntime.js");
      await writeCppProjectConfig(dir);
    },
    stageInstructions: CPP_INSTRUCTIONS
  }
};

export function getLanguageConfig(lang) {
  const config = REGISTRY[lang ?? "rust"];
  if (!config) throw new Error(`Unknown language: ${lang}`);
  return config;
}

export function getAvailableLanguages() {
  return Object.keys(REGISTRY);
}
