import { promises as fs } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// CMakeLists.txt template
// ---------------------------------------------------------------------------

const CMAKE_LISTS_CONTENT = `cmake_minimum_required(VERSION 3.20)
project(exercise CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Static library from exercise implementation
add_library(exercise STATIC src/solution.cpp)
target_include_directories(exercise PUBLIC src)

# Fetch Google Test
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.tar.gz
)
# For Windows: prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

# Glob test sources from tests/
file(GLOB TEST_SOURCES tests/*.cpp)
add_executable(exercise_tests \${TEST_SOURCES})
target_include_directories(exercise_tests PRIVATE src)
target_link_libraries(exercise_tests PRIVATE exercise GTest::gtest_main)

add_test(NAME exercise_tests COMMAND exercise_tests)
`;

// ---------------------------------------------------------------------------
// src/solution.cpp stub
// ---------------------------------------------------------------------------

const SOLUTION_CPP_CONTENT = `// src/solution.cpp — exercise implementation
// The starter-expand stage will fill in the exercise functions here.
#include "solution.h"
`;

// ---------------------------------------------------------------------------
// src/solution.h stub
// ---------------------------------------------------------------------------

const SOLUTION_H_CONTENT = `#pragma once
// solution.h — exercise declarations
// The starter-expand stage will fill in declarations here.
`;

// ---------------------------------------------------------------------------
// tests/test_main.cpp stub
// ---------------------------------------------------------------------------

const TEST_MAIN_CPP_CONTENT = `#include <gtest/gtest.h>
#include "solution.h"
// The test-expand stage will fill in test cases here.
`;

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

export async function writeCppProjectConfig(dir) {
  const srcDir = path.join(dir, "src");
  const testsDir = path.join(dir, "tests");
  await fs.mkdir(srcDir, { recursive: true });
  await fs.mkdir(testsDir, { recursive: true });
  await fs.writeFile(path.join(dir, "CMakeLists.txt"), CMAKE_LISTS_CONTENT);
  await fs.writeFile(path.join(srcDir, "solution.cpp"), SOLUTION_CPP_CONTENT);
  await fs.writeFile(path.join(srcDir, "solution.h"), SOLUTION_H_CONTENT);
  await fs.writeFile(path.join(testsDir, "test_main.cpp"), TEST_MAIN_CPP_CONTENT);
}
