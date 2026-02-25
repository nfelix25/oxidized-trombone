## Why

C++ is one of the most widely used languages in systems programming, game development, embedded systems, and high-performance computing, yet the tutor currently offers no C++ curriculum. Learners who select C++ at session start get no tracks or nodes. C++ has a large and complex surface area — RAII, templates, move semantics, the STL, concurrency, and modern C++17/20 features — that benefits from structured, prerequisite-ordered learning. A comprehensive curriculum closes this gap and makes the tutor useful for the large audience of C++ learners.

## What Changes

- Register `cpp` in `src/config/languages.js` with a cmake-based project config writer, test command, and C++-specific stage instructions
- Add ~100 C++ curriculum nodes organized into 13 tracks with a full prerequisite dependency graph
- Each node carries keywords for custom topic search, misconception tags for common C++ learner errors, and appropriate depth targets (D1/D2/D3)
- Create `src/runtime/cppRuntime.js` to write the CMake project scaffold (`CMakeLists.txt`, `src/solution.cpp`, and `tests/` directory)
- No changes to session flow, picker, mastery, or exercise loop — all are language-agnostic

**Tracks (planned):**
1. **Language Foundations** (10 nodes, D1-D2) — auto, primitive types, functions, references, control flow, namespaces, structs, enums, const/constexpr, initialization
2. **Classes and Polymorphism** (9 nodes, D2-D3) — constructors, destructors/RAII, copy semantics, inheritance, virtual dispatch, abstract classes, virtual destructors, operator overloading, friend
3. **Memory Management** (8 nodes, D2-D3) — raw pointers, new/delete, unique_ptr, shared_ptr/weak_ptr, stack vs heap, custom allocators, placement new, memory debugging
4. **Move Semantics and Value Categories** (7 nodes, D2-D3) — value categories, move constructor/assignment, std::move/forward, perfect forwarding, RVO, noexcept, rule of 0/3/5
5. **STL Containers and Algorithms** (9 nodes, D1-D2) — vector, array, string/string_view, map/set, unordered_map/set, list/deque/queue/stack, algorithms, iterators, span/ranges
6. **Templates** (8 nodes, D2-D3) — function templates, class templates, specialization, variadic templates, SFINAE, template template params, concepts, type_traits
7. **Compile-time Programming** (7 nodes, D2-D3) — constexpr, consteval/constinit, if constexpr, static_assert, integral_constant, template metaprogramming, reflection preview
8. **Error Handling** (6 nodes, D2) — exceptions, noexcept/terminate, custom exception classes, RAII exception safety, std::optional, std::expected
9. **Operators and Type Conversions** (5 nodes, D2) — implicit conversions, explicit constructors/operators, casts, structured bindings, std::variant/visit
10. **Concurrency** (8 nodes, D2-D3) — std::thread, mutex/lock_guard, condition_variable, atomic, future/promise, async, thread-safe patterns, coroutines
11. **Streams and I/O** (6 nodes, D1-D2) — iostream, fstream, stringstream, std::format, std::filesystem, binary I/O
12. **Build, Testing, and Tooling** (7 nodes, D1-D2) — CMake basics, linking, compiler flags, Google Test/Catch2, test parameterization, clang-format/tidy, package managers

Total: 10+9+8+7+9+8+7+6+5+8+6+7 = 100 nodes

## Capabilities

### New Capabilities
- `cpp-curriculum`: Comprehensive C++ learning curriculum — 13 tracks, ~100 nodes, full prerequisite dependency graph, keyword coverage for topic search, misconception tags, and depth targets covering C++ through C++20

### Modified Capabilities
<!-- none — existing spec-level behavior is language-agnostic; no requirement changes -->

## Impact

- `src/config/languages.js` — add `cpp` entry with CMake project config, test command, and C++-specific stage instructions
- `src/runtime/cppRuntime.js` — new file: writes `CMakeLists.txt`, `src/solution.cpp` stub, and `tests/` directory scaffold
- `src/curriculum/cppSeed.js` — new file: ~100 C++ node definitions; track arrays and `cppCurriculum` export
- `src/curriculum/allCurricula.js` — import `cppCurriculum` and merge nodes/tracks
- `getCurriculumForLanguage("cpp")` returns nodes once registered — no code changes to session or mastery
- No session, picker, mastery, or orchestration changes
