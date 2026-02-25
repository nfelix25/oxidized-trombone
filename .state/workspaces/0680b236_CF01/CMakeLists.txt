cmake_minimum_required(VERSION 3.20)
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
add_executable(exercise_tests ${TEST_SOURCES})
target_include_directories(exercise_tests PRIVATE src)
target_link_libraries(exercise_tests PRIVATE exercise GTest::gtest_main)

add_test(NAME exercise_tests COMMAND exercise_tests)
