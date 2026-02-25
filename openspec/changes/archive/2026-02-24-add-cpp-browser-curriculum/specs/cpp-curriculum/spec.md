## MODIFIED Requirements

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
