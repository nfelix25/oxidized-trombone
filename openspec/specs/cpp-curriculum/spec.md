## ADDED Requirements

### Requirement: C++ is a selectable language in the curriculum system
The system SHALL register `cpp` as a supported language in the language registry with a test command of `["bash", "-c", "cmake -B build -S . -DCMAKE_BUILD_TYPE=Debug && cmake --build build && ctest --test-dir build -q"]`, a CMake-based project config writer, and C++-specific stage instructions (scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer).

#### Scenario: C++ appears in language selection
- **WHEN** a learner runs `session start`
- **THEN** "C++" appears as a selectable language alongside Rust, C, and Zig

#### Scenario: Selecting C++ scopes the curriculum to C++ nodes
- **WHEN** a learner selects C++
- **THEN** `getCurriculumForLanguage("cpp")` returns only nodes with `language: "cpp"` and tracks containing those nodes

#### Scenario: C++ exercise workspace is created with CMakeLists.txt
- **WHEN** a C++ session exercise is set up
- **THEN** the workspace contains a valid `CMakeLists.txt`, a `src/solution.cpp` stub, and a `tests/` directory

#### Scenario: C++ curriculum includes advanced browser-internals tracks
- **WHEN** a learner selects C++
- **THEN** `getCurriculumForLanguage("cpp")` returns all C++ nodes including both the core language tracks (CF/CP/CM/CV/CS/CT/CK/CE/CO/CC/CW/CB) and the Chromium browser-internals tracks (BF/BL/BV/BN/BA/BP), totaling the full combined node count

---

### Requirement: Language Foundations track (CF) provides core C++ syntax
The system SHALL provide a `cpp-foundations` track with 10 nodes (CF01–CF10) covering the fundamental building blocks of C++. CF01 has no prerequisites and serves as the entry point to the entire C++ curriculum.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CF01 | Variables, types, and type inference with auto | D1 | — |
| CF02 | Integer types, floating point, bool, and char | D1 | CF01 |
| CF03 | Functions: parameters, return types, and overloading | D1 | CF01 |
| CF04 | References: lvalue refs, const refs, and reference semantics | D1 | CF03 |
| CF05 | Control flow: if, switch, while, for, and range-for | D1 | CF02, CF03 |
| CF06 | Namespaces, using declarations, and argument-dependent lookup | D2 | CF03 |
| CF07 | Structs and classes: member variables and member functions | D1 | CF03 |
| CF08 | Enums and enum class: scoped vs unscoped enumerations | D1 | CF07 |
| CF09 | const and constexpr: compile-time constants and functions | D2 | CF07 |
| CF10 | Initialization: braced-init, default member init, and aggregate init | D2 | CF07 |

**Keywords covered:** `auto`, type deduction, `int`, `long`, `unsigned`, `float`, `double`, `bool`, `char`, `void`, function overloading, default arguments, lvalue reference, `const &`, reference vs copy, `if constexpr`, `switch`, `while`, `for`, range-based for, `namespace`, `using`, ADL, Koenig lookup, `struct`, `class`, access specifiers, `public`, `private`, `enum class`, scoped enum, `constexpr`, `const`, braced init, `{}`, uniform initialization, aggregate initialization, default member initializer

#### Scenario: CF01 is the curriculum entry point with no prerequisites
- **WHEN** a learner selects C++ and has no mastery
- **THEN** CF01 is the first eligible node shown in the guided navigator

#### Scenario: Foundations nodes unlock in prerequisite order
- **WHEN** a learner completes CF02 and CF03
- **THEN** CF05 becomes eligible

#### Scenario: Enum class node requires struct knowledge
- **WHEN** a learner has completed CF07
- **THEN** CF08 becomes eligible

#### Scenario: Initialization node requires struct knowledge
- **WHEN** a learner has completed CF07
- **THEN** CF10 becomes eligible

---

### Requirement: Classes and Polymorphism track (CP) teaches C++ OOP
The system SHALL provide a `cpp-classes` track with 9 nodes (CP01–CP09) covering constructors, RAII, copy semantics, inheritance, virtual dispatch, abstract classes, virtual destructors, operator overloading, and friend declarations.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CP01 | Constructors: default, parameterized, copy, and delegating | D2 | CF07 |
| CP02 | Destructors and RAII: deterministic cleanup and resource ownership | D2 | CP01 |
| CP03 | Copy semantics: copy constructor and copy assignment operator | D2 | CP01 |
| CP04 | Inheritance: public, protected, and private base classes | D2 | CP01 |
| CP05 | Virtual functions and dynamic dispatch | D2 | CP04 |
| CP06 | Abstract classes and pure virtual functions | D2 | CP05 |
| CP07 | Virtual destructors and the diamond problem | D3 | CP05, CP04 |
| CP08 | Operator overloading: arithmetic, comparison, and stream operators | D2 | CP03 |
| CP09 | friend functions and friend classes | D2 | CP01 |

**Keywords covered:** default constructor, parameterized constructor, copy constructor, delegating constructor, `explicit`, initializer list, destructor, RAII, scope-bound resource, `Rule of Three`, copy assignment, `operator=`, copy-and-swap, inheritance, `public:`, `protected:`, `private:`, derived class, `virtual`, vtable, dynamic dispatch, `override`, `final`, `= 0`, pure virtual, abstract class, virtual destructor, object slicing, diamond problem, virtual inheritance, `operator+`, `operator==`, `operator<<`, `friend`

#### Scenario: Constructor node requires struct knowledge
- **WHEN** a learner has completed CF07
- **THEN** CP01 is eligible

#### Scenario: Virtual dispatch requires inheritance foundation
- **WHEN** a learner completes CP04
- **THEN** CP05 becomes eligible

#### Scenario: Abstract class requires virtual function knowledge
- **WHEN** a learner completes CP05
- **THEN** CP06 becomes eligible

#### Scenario: Diamond problem node requires both virtual and inheritance knowledge
- **WHEN** a learner has completed CP05 and CP04
- **THEN** CP07 is eligible

---

### Requirement: Memory Management track (CM) covers C++ memory model
The system SHALL provide a `cpp-memory` track with 8 nodes (CM01–CM08) covering raw pointers, heap allocation, smart pointers, allocator customization, placement new, and memory debugging tools.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CM01 | Pointers: address-of, dereference, nullptr, and pointer arithmetic | D2 | CF04 |
| CM02 | new and delete: heap allocation and manual ownership | D2 | CM01 |
| CM03 | std::unique_ptr: exclusive ownership and move-only semantics | D2 | CM02, CP02 |
| CM04 | std::shared_ptr and std::weak_ptr: shared ownership and cycles | D2 | CM03 |
| CM05 | Stack vs heap: memory layout, lifetimes, and trade-offs | D2 | CM02 |
| CM06 | std::allocator and custom allocators | D3 | CM02, CS01 |
| CM07 | Placement new and manual object construction | D3 | CM02 |
| CM08 | Memory debugging: valgrind, AddressSanitizer, and UBSanitizer | D2 | CM02 |

**Keywords covered:** `*`, `&`, `nullptr`, pointer arithmetic, `->`, `new`, `delete`, `new[]`, `delete[]`, heap, ownership, `unique_ptr`, `make_unique`, `release`, `reset`, `get`, `shared_ptr`, `make_shared`, `weak_ptr`, `lock`, `expired`, reference count, stack allocation, heap allocation, RAII lifetime, `std::allocator`, `allocate`, `deallocate`, `construct`, `destroy`, allocator-aware, placement new, in-place construction, valgrind, AddressSanitizer, `-fsanitize=address`, UBSanitizer

#### Scenario: Pointer node requires reference knowledge
- **WHEN** a learner has completed CF04
- **THEN** CM01 is eligible

#### Scenario: unique_ptr requires both heap allocation and RAII knowledge
- **WHEN** a learner has completed CM02 and CP02
- **THEN** CM03 is eligible

#### Scenario: shared_ptr builds on unique_ptr knowledge
- **WHEN** a learner completes CM03
- **THEN** CM04 becomes eligible

#### Scenario: Custom allocator requires vector knowledge
- **WHEN** a learner has not completed CS01
- **THEN** CM06 is not eligible even if CM02 is complete

---

### Requirement: Move Semantics and Value Categories track (CV) covers C++11 move model
The system SHALL provide a `cpp-move-semantics` track with 7 nodes (CV01–CV07) covering value categories, move constructors and assignment, std::move/forward, perfect forwarding, return value optimization, noexcept guarantees, and the rule of 0/3/5.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CV01 | Value categories: lvalue, rvalue, xvalue, and prvalue | D2 | CF04, CP03 |
| CV02 | Move constructors and move assignment operator | D2 | CV01, CP03 |
| CV03 | std::move and std::forward: casting value categories | D2 | CV02 |
| CV04 | Perfect forwarding and universal references | D3 | CV03, CT01 |
| CV05 | Return value optimization: RVO, NRVO, and mandatory elision | D2 | CV02 |
| CV06 | noexcept: exception guarantees and move optimization | D2 | CV02, CE01 |
| CV07 | Rule of 0/3/5: choosing the right set of special members | D2 | CV02, CP02 |

**Keywords covered:** lvalue, rvalue, xvalue, prvalue, glvalue, value category, move constructor, move assignment, `&&`, rvalue reference, `std::move`, cast to rvalue, `std::forward`, forwarding reference, universal reference, `T&&`, perfect forwarding, RVO, NRVO, copy elision, mandatory elision, `noexcept`, exception specification, `noexcept(noexcept(...))`, Rule of Three, Rule of Five, Rule of Zero, special member functions

#### Scenario: Value categories node requires reference and copy semantics knowledge
- **WHEN** a learner has completed CF04 and CP03
- **THEN** CV01 is eligible

#### Scenario: Move constructor requires value category knowledge
- **WHEN** a learner completes CV01
- **THEN** CV02 becomes eligible (with CP03 already satisfied)

#### Scenario: Perfect forwarding requires template knowledge
- **WHEN** a learner has not completed CT01
- **THEN** CV04 is not eligible

#### Scenario: noexcept node requires both move and exception knowledge
- **WHEN** a learner has completed CV02 and CE01
- **THEN** CV06 is eligible

---

### Requirement: STL Containers and Algorithms track (CS) covers the standard library
The system SHALL provide a `cpp-stl` track with 9 nodes (CS01–CS09) covering all major STL container types, the algorithm library, iterator categories, and modern range/span facilities.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CS01 | std::vector: dynamic arrays, capacity, and iterator invalidation | D1 | CM01 |
| CS02 | std::array: fixed-size stack arrays and aggregate initialization | D1 | CF05 |
| CS03 | std::string and std::string_view: text handling and ownership | D2 | CS01 |
| CS04 | std::map and std::set: balanced BST and ordered associative containers | D2 | CS01, CM01 |
| CS05 | std::unordered_map and std::unordered_set: hash table containers | D2 | CS04 |
| CS06 | std::list, std::deque, std::queue, and std::stack: sequence adapters | D2 | CS01 |
| CS07 | STL algorithms: sort, find, transform, accumulate, and predicates | D2 | CS01, CT01 |
| CS08 | Iterators: categories, adapters, and std::back_inserter | D2 | CS07 |
| CS09 | std::span and ranges (C++20): non-owning views and composable pipelines | D2 | CS08, CK01 |

**Keywords covered:** `vector`, `push_back`, `emplace_back`, `reserve`, `shrink_to_fit`, `begin`, `end`, iterator invalidation, `array`, `fill`, `std::string`, `substr`, `find`, `c_str`, `string_view`, non-owning view, `map`, `set`, `lower_bound`, `upper_bound`, balanced BST, `unordered_map`, hash function, `bucket_count`, `list`, `deque`, `queue`, `stack`, `push`, `pop`, `sort`, `find_if`, `transform`, `accumulate`, `copy`, `count_if`, iterator category, input/output/forward/bidirectional/random-access, `back_inserter`, `istream_iterator`, `span`, ranges, `views::filter`, `views::transform`, lazy evaluation

#### Scenario: Vector node requires pointer knowledge for iterator semantics
- **WHEN** a learner has completed CM01
- **THEN** CS01 is eligible

#### Scenario: STL algorithms require template knowledge for predicates
- **WHEN** a learner has not completed CT01
- **THEN** CS07 is not eligible

#### Scenario: Ranges and span are the most modern STL nodes
- **WHEN** a learner has completed CS08 and CK01
- **THEN** CS09 is eligible

---

### Requirement: Templates track (CT) covers C++ generic programming
The system SHALL provide a `cpp-templates` track with 8 nodes (CT01–CT08) covering function and class templates, specialization, variadic templates, SFINAE, template template parameters, C++20 concepts, and type traits.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CT01 | Function templates: syntax, instantiation, and deduction | D2 | CF03 |
| CT02 | Class templates: member functions and explicit instantiation | D2 | CT01, CF07 |
| CT03 | Template specialization: full and partial specialization | D3 | CT02 |
| CT04 | Variadic templates and parameter packs | D3 | CT01, CF05 |
| CT05 | SFINAE and enable_if: conditional template selection | D3 | CT01 |
| CT06 | Template template parameters and policy-based design | D3 | CT02 |
| CT07 | Concepts (C++20): requires clauses and named concepts | D2 | CT01 |
| CT08 | std::type_traits: is_same, is_integral, conditional, and void_t | D2 | CT01 |

**Keywords covered:** `template<typename T>`, template parameter, type deduction, `typename`, `class`, explicit instantiation, class template, member template, `template<>`, full specialization, partial specialization, variadic template, `sizeof...`, parameter pack, pack expansion, fold expression, SFINAE, `enable_if`, `enable_if_t`, substitution failure, `template template`, policy class, `requires`, concept, `concept C = ...`, `std::same_as`, `std::integral`, `type_traits`, `is_same_v`, `is_integral_v`, `conditional_t`, `void_t`

#### Scenario: Function template entry requires function knowledge
- **WHEN** a learner has completed CF03
- **THEN** CT01 is eligible

#### Scenario: Concepts are accessible without full template expertise
- **WHEN** a learner has completed CT01
- **THEN** CT07 is eligible without requiring SFINAE knowledge

#### Scenario: SFINAE node requires function templates
- **WHEN** a learner has not completed CT01
- **THEN** CT05 is not eligible

---

### Requirement: Compile-time Programming track (CK) covers constexpr and metaprogramming
The system SHALL provide a `cpp-constexpr` track with 7 nodes (CK01–CK07) covering constexpr functions, consteval/constinit, if constexpr, static_assert, integral constants, template metaprogramming, and a preview of reflection.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CK01 | constexpr functions and variables: guaranteed compile-time evaluation | D2 | CF09 |
| CK02 | consteval and constinit: immediate functions and static initialization | D2 | CK01 |
| CK03 | if constexpr: compile-time conditional code selection | D2 | CK01, CT01 |
| CK04 | static_assert: compile-time precondition checks | D2 | CK01 |
| CK05 | std::integral_constant and type lists | D3 | CT08, CK01 |
| CK06 | Template metaprogramming: recursive templates and type computation | D3 | CK05, CT04 |
| CK07 | Reflection preview (C++26) and __builtin intrinsics | D3 | CK03 |

**Keywords covered:** `constexpr`, constant expression, `consteval`, immediate function, `constinit`, static initialization, `if constexpr`, compile-time branch, dead code elimination, `static_assert`, compile-time assertion, `integral_constant`, `true_type`, `false_type`, type list, `Cons<H,T>`, template recursion, TMP, `__builtin_clz`, `__builtin_popcount`, reflection, `std::meta` (C++26 preview)

#### Scenario: constexpr node requires const knowledge
- **WHEN** a learner has completed CF09
- **THEN** CK01 is eligible

#### Scenario: if constexpr requires both constexpr and template knowledge
- **WHEN** a learner has completed CK01 and CT01
- **THEN** CK03 is eligible

#### Scenario: Template metaprogramming requires integral_constant and variadic templates
- **WHEN** a learner has completed CK05 and CT04
- **THEN** CK06 is eligible

---

### Requirement: Error Handling track (CE) covers C++ exception and result types
The system SHALL provide a `cpp-error-handling` track with 6 nodes (CE01–CE06) covering exceptions, noexcept specifications, custom exception classes, RAII exception safety, std::optional for absence, and std::expected for error-or-value results.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CE01 | Exceptions: throw, try, catch, and exception types | D2 | CF05 |
| CE02 | Exception specifications: noexcept and std::terminate | D2 | CE01 |
| CE03 | Custom exception classes: inheriting from std::exception | D2 | CE01, CP04 |
| CE04 | RAII and exception safety: basic, strong, and no-throw guarantees | D2 | CE01, CP02 |
| CE05 | std::optional: representing optional values without null pointers | D2 | CF07 |
| CE06 | std::expected (C++23): error-or-value result type | D2 | CE05 |

**Keywords covered:** `throw`, `try`, `catch`, `catch(...)`, exception object, stack unwinding, `noexcept`, `std::terminate`, `noexcept(expr)`, `std::exception`, `what()`, `std::runtime_error`, `std::logic_error`, exception hierarchy, basic exception safety, strong exception safety, no-throw guarantee, exception-safe swap, `std::optional`, `std::nullopt`, `has_value()`, `value()`, `value_or()`, `std::expected`, `std::unexpected`, `error()`, monadic operations

#### Scenario: Exception node requires control flow knowledge
- **WHEN** a learner has completed CF05
- **THEN** CE01 is eligible

#### Scenario: Custom exceptions require both exceptions and inheritance
- **WHEN** a learner has completed CE01 and CP04
- **THEN** CE03 is eligible

#### Scenario: std::optional is accessible without exception knowledge
- **WHEN** a learner has completed CF07
- **THEN** CE05 is eligible independently of CE01

#### Scenario: std::expected builds on optional
- **WHEN** a learner completes CE05
- **THEN** CE06 becomes eligible

---

### Requirement: Operators and Type Conversions track (CO) covers implicit and explicit conversions
The system SHALL provide a `cpp-conversions` track with 5 nodes (CO01–CO05) covering the C++ implicit conversion sequence, explicit constructors and conversion operators, the four named casts, structured bindings, and std::variant.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CO01 | Implicit conversions and the standard conversion sequence | D2 | CF02, CP01 |
| CO02 | explicit constructors and conversion operators | D2 | CP01, CO01 |
| CO03 | The four casts: static_cast, dynamic_cast, reinterpret_cast, const_cast | D2 | CO01, CP05 |
| CO04 | Structured bindings (C++17): decomposing tuples, pairs, and structs | D2 | CF07 |
| CO05 | std::variant and std::visit: type-safe tagged union | D2 | CT02, CE05 |

**Keywords covered:** implicit conversion, integral promotion, floating-point conversion, user-defined conversion, overload resolution, `explicit`, conversion operator, `operator int()`, `static_cast`, `dynamic_cast`, `reinterpret_cast`, `const_cast`, RTTI, downcasting, structured binding, `auto [a, b]`, `std::tie`, `std::variant`, `std::get<>`, `std::visit`, `std::monostate`, overloaded visitor

#### Scenario: Implicit conversion node requires both type and constructor knowledge
- **WHEN** a learner has completed CF02 and CP01
- **THEN** CO01 is eligible

#### Scenario: dynamic_cast requires virtual function knowledge for RTTI
- **WHEN** a learner has not completed CP05
- **THEN** CO03 is not eligible

#### Scenario: Structured bindings are accessible early with only struct knowledge
- **WHEN** a learner has completed CF07
- **THEN** CO04 is eligible

---

### Requirement: Concurrency track (CC) covers C++ threading and synchronization
The system SHALL provide a `cpp-concurrency` track with 8 nodes (CC01–CC08) covering std::thread lifecycle, mutexes and lock guards, condition variables, atomics and memory ordering, futures/promises, std::async, thread-safe data structure patterns, and C++20 coroutines.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CC01 | std::thread: spawn, join, detach, and thread lifecycle | D2 | CF03 |
| CC02 | std::mutex, lock_guard, and unique_lock: exclusive access | D2 | CC01 |
| CC03 | std::condition_variable: wait, notify_one, and notify_all | D3 | CC02 |
| CC04 | std::atomic: operations, compare_exchange, and memory_order | D3 | CC01 |
| CC05 | std::future and std::promise: asynchronous value passing | D2 | CC01 |
| CC06 | std::async and launch policies | D2 | CC05 |
| CC07 | Thread-safe data structures and RAII locking patterns | D3 | CC02, CC03 |
| CC08 | Coroutines (C++20): co_await, co_yield, and co_return | D3 | CC05, CK01 |

**Keywords covered:** `std::thread`, `join`, `detach`, `get_id`, `hardware_concurrency`, `std::mutex`, `lock_guard`, `unique_lock`, `try_lock`, `scoped_lock`, deadlock avoidance, `condition_variable`, `wait`, `notify_one`, `notify_all`, spurious wakeup, predicate, `atomic`, `load`, `store`, `fetch_add`, `compare_exchange_strong`, `memory_order`, `relaxed`, `acquire`, `release`, `seq_cst`, `future`, `promise`, `get_future`, `set_value`, `set_exception`, `async`, `launch::async`, `launch::deferred`, thread-safe queue, `co_await`, `co_yield`, `co_return`, coroutine handle, promise type, awaitable

#### Scenario: Thread node requires basic function knowledge
- **WHEN** a learner has completed CF03
- **THEN** CC01 is eligible

#### Scenario: Condition variable requires mutex knowledge
- **WHEN** a learner completes CC02
- **THEN** CC03 becomes eligible

#### Scenario: Coroutines require both async and constexpr knowledge
- **WHEN** a learner has completed CC05 and CK01
- **THEN** CC08 is eligible

#### Scenario: Thread-safe patterns require both mutex and condition variable knowledge
- **WHEN** a learner has completed CC02 and CC03
- **THEN** CC07 is eligible

---

### Requirement: Streams and I/O track (CW) covers C++ I/O facilities
The system SHALL provide a `cpp-io` track with 6 nodes (CW01–CW06) covering iostream basics, file streams, stringstreams, std::format formatting, std::filesystem, and binary I/O operations.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CW01 | std::iostream: cin, cout, cerr, clog, and stream operators | D1 | CF03 |
| CW02 | std::fstream: file read/write modes and stream state | D2 | CW01 |
| CW03 | std::stringstream: in-memory string buffering and parsing | D2 | CW01 |
| CW04 | std::format (C++20): type-safe string formatting | D2 | CW01 |
| CW05 | std::filesystem: path, directory_iterator, and file status | D2 | CW02, CM03 |
| CW06 | Binary I/O: read(), write(), seekg(), and seekp() | D2 | CW02 |

**Keywords covered:** `std::cin`, `std::cout`, `std::cerr`, `std::clog`, `<<`, `>>`, `flush`, `endl`, `setw`, `setprecision`, `std::ifstream`, `std::ofstream`, `std::fstream`, open modes, `is_open`, `eof`, `fail`, `clear`, `std::istringstream`, `std::ostringstream`, `str()`, `std::format`, format string, `{}`, format specifiers, `std::filesystem::path`, `directory_iterator`, `recursive_directory_iterator`, `exists`, `file_size`, `read()`, `write()`, `seekg`, `seekp`, `tellg`, `tellp`

#### Scenario: iostream is accessible with only function knowledge
- **WHEN** a learner has completed CF03
- **THEN** CW01 is eligible early in the curriculum

#### Scenario: File streams require iostream foundation
- **WHEN** a learner completes CW01
- **THEN** CW02 and CW03 become eligible

#### Scenario: std::filesystem requires both file streams and smart pointer knowledge
- **WHEN** a learner has completed CW02 and CM03
- **THEN** CW05 is eligible

---

### Requirement: Build, Testing, and Tooling track (CB) covers CMake and C++ ecosystem
The system SHALL provide a `cpp-build-tools` track with 7 nodes (CB01–CB07) covering CMake project structure, library linking, compiler flags, Google Test/Catch2 testing frameworks, test parameterization, code style enforcement, and package managers.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| CB01 | CMake basics: CMakeLists.txt, targets, and build types | D1 | CF01 |
| CB02 | Linking: static/shared libraries and target_link_libraries | D2 | CB01 |
| CB03 | Compilation flags: warnings, sanitizers, and optimization levels | D2 | CB01 |
| CB04 | Google Test and Catch2: test macros and test fixtures | D2 | CF05 |
| CB05 | Test parameterization and mock objects | D2 | CB04 |
| CB06 | clang-format and clang-tidy: code style and static analysis | D1 | CF01 |
| CB07 | Package managers: Conan, vcpkg, and CMake FetchContent | D2 | CB01 |

**Keywords covered:** `CMakeLists.txt`, `cmake_minimum_required`, `project`, `add_executable`, `add_library`, `target_include_directories`, `target_compile_features`, `cmake --build`, `target_link_libraries`, `PRIVATE`, `PUBLIC`, `INTERFACE`, static library, shared library, `-Wall`, `-Wextra`, `-O2`, `-O3`, `-fsanitize=address`, `TEST`, `gtest`, `EXPECT_EQ`, `ASSERT_TRUE`, test fixture, `SetUp`, `TearDown`, `INSTANTIATE_TEST_SUITE_P`, mock, `.clang-format`, `.clang-tidy`, Conan, vcpkg, `FetchContent_Declare`, `FetchContent_MakeAvailable`

#### Scenario: CMake basics are accessible from the start
- **WHEN** a learner has completed CF01
- **THEN** CB01 and CB06 are eligible

#### Scenario: Library linking requires CMake foundation
- **WHEN** a learner completes CB01
- **THEN** CB02, CB03, and CB07 become eligible

#### Scenario: Testing framework node requires control flow knowledge
- **WHEN** a learner has completed CF05
- **THEN** CB04 is eligible
