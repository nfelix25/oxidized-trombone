## 1. Scaffold Prompt: Exercise Unit Planning

- [x] 1.1 Update Rust scaffold prompt: replace "Be AMBITIOUS and COMPREHENSIVE" with "Be FOCUSED and PROGRESSIVE — plan the workspace as a sequence of exercises that build from a single root concept." Add instruction to assign exercise IDs (ex-1, ex-2...) and embed them in each intent string across section_intents, file_intents, and case_intents so lesson/stub/test are cross-referenced.
- [x] 1.2 Update C scaffold prompt with the same framing change and exercise ID instruction (C-specific: each exercise unit maps to one concept cluster with corresponding .c/.h stubs)
- [x] 1.3 Update Zig scaffold prompt with the same framing change and exercise ID instruction
- [x] 1.4 Update Python scaffold prompt with the same framing change and exercise ID instruction
- [x] 1.5 Update C++ scaffold prompt with the same framing change and exercise ID instruction

## 2. Starter-Expand Prompt: Learner-Facing Orientation Comments

- [x] 2.1 Update Rust starter-expand prompt: replace "explaining the Rust concept it demonstrates and what the learner must implement" with instructions to: (a) echo the exercise ID from the file_intent, (b) write a comment stating the first principle, the LESSON.md section that teaches it, the test function name that will assert it, and a "start here" cue. Do NOT use "the learner must" phrasing.
- [x] 2.2 Update C starter-expand prompt with the same orientation comment requirement (C-specific: the block comment `/* ... */` must include exercise ID, first principle, lesson section reference, test function name, start-here cue)
- [x] 2.3 Update Zig starter-expand prompt with the same orientation comment requirement (`///` doc comment style)
- [x] 2.4 Update Python starter-expand prompt with the same orientation comment requirement (docstring style)
- [x] 2.5 Update C++ starter-expand prompt with the same orientation comment requirement

## 3. Starter-Expand Prompt: Pre-Define Test-Required Constants

- [x] 3.1 Update Rust starter-expand prompt: add rule that any constant, enum variant, or flag value that test cases will reference must be defined in the stub source file — the learner must be able to read the full contract from the stub alone
- [x] 3.2 Update C starter-expand prompt with the same rule (C-specific: `#define SOME_FLAG 0x1u` or `enum` constants in the .h file, not only in the test file)
- [x] 3.3 Update Zig starter-expand prompt with the same rule
- [x] 3.4 Update Python starter-expand prompt with the same rule
- [x] 3.5 Update C++ starter-expand prompt with the same rule

## 4. Test-Expand Prompt: Assertion-Stating Names and Individual Stub Targeting

- [x] 4.1 Update Rust test-expand prompt: require test names to follow `test_<function>_<assertion>` pattern (e.g. `test_context_init_zeroes_arena`); require each test to target exactly one stub function; require that any constants the test uses are already defined in the starter file (do not redefine them in the test)
- [x] 4.2 Update C test-expand prompt with the same requirements (C-specific: test function names like `test_sc_context_init_zeroes_arena`, no re-definition of constants from headers)
- [x] 4.3 Update Zig test-expand prompt with the same requirements
- [x] 4.4 Update Python test-expand prompt with the same requirements
- [x] 4.5 Update C++ test-expand prompt with the same requirements

## 5. Lesson-Expand Prompt: Directly Enabling Sections with Worked Examples

- [x] 5.1 Update Rust lesson-expand prompt: add rule that each section must (a) name the stub function(s) it directly enables, (b) include a complete worked example demonstrating the exact pattern the learner will apply in that stub — not a broad survey; (c) end with a "now implement: <function_name>" cue pointing to the stub
- [x] 5.2 Update C lesson-expand prompt with the same requirements (C-specific: compilable C snippets with POSIX headers; worked example shows the exact syscall pattern before learner applies it)
- [x] 5.3 Update Zig lesson-expand prompt with the same requirements
- [x] 5.4 Update Python lesson-expand prompt with the same requirements
- [x] 5.5 Update C++ lesson-expand prompt with the same requirements

## 6. Verification

- [x] 6.1 Run test suite (`npm test` or equivalent) and confirm all existing tests still pass — prompt changes have no effect on curriculum or runtime tests
