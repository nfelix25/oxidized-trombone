import { promises as fs } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Makefile
// ---------------------------------------------------------------------------

const MAKEFILE_CONTENT = `CC = cc
CFLAGS = -Wall -Wextra -g -I src -I tests
LDFLAGS = -lpthread

SRC_FILES := $(wildcard src/*.c)
TEST_FILES := $(wildcard tests/*.c)
TEST_BINS  := $(patsubst tests/%.c,.build/%,$(TEST_FILES))

.PHONY: test clean

test: $(TEST_BINS)
\t@failed=0; \\
\tfor bin in $(TEST_BINS); do \\
\t\t./$$bin || failed=$$((failed + 1)); \\
\tdone; \\
\texit $$failed

.build/%: tests/%.c $(SRC_FILES) | .build
\t$(CC) $(CFLAGS) $^ $(LDFLAGS) -o $@

.build:
\tmkdir -p .build

clean:
\trm -rf .build
`;

export async function writeCMakefile(dir) {
  await fs.writeFile(path.join(dir, "Makefile"), MAKEFILE_CONTENT);
}

// ---------------------------------------------------------------------------
// Test header
// ---------------------------------------------------------------------------

const TEST_H_CONTENT = `#ifndef TEST_H
#define TEST_H

#include <stdio.h>
#include <string.h>
#include <math.h>
#include <setjmp.h>

static int _tests_run    = 0;
static int _tests_failed = 0;
static jmp_buf _test_jmpbuf;
static int _test_failed_flag = 0;

#define TEST_ASSERT(expr) \\
  do { if (!(expr)) { \\
    fprintf(stderr, "  assertion failed: %s (%s:%d)\\n", #expr, __FILE__, __LINE__); \\
    _test_failed_flag = 1; \\
    longjmp(_test_jmpbuf, 1); \\
  } } while (0)

#define TEST_ASSERT_EQ(a, b) TEST_ASSERT((a) == (b))

#define TEST_ASSERT_STR_EQ(a, b) \\
  do { if (strcmp((a), (b)) != 0) { \\
    fprintf(stderr, "  assertion failed: strcmp(\\"%s\\", \\"%s\\") != 0 (%s:%d)\\n", \\
            (a), (b), __FILE__, __LINE__); \\
    _test_failed_flag = 1; \\
    longjmp(_test_jmpbuf, 1); \\
  } } while (0)

#define TEST_ASSERT_FLOAT_EQ(a, b, eps) \\
  do { if (fabs((double)(a) - (double)(b)) > (double)(eps)) { \\
    fprintf(stderr, "  assertion failed: |%f - %f| > %f (%s:%d)\\n", \\
            (double)(a), (double)(b), (double)(eps), __FILE__, __LINE__); \\
    _test_failed_flag = 1; \\
    longjmp(_test_jmpbuf, 1); \\
  } } while (0)

#define RUN_TEST(fn) \\
  do { \\
    _tests_run++; \\
    _test_failed_flag = 0; \\
    printf("test " #fn " ... "); \\
    fflush(stdout); \\
    if (setjmp(_test_jmpbuf) == 0) { \\
      fn(); \\
    } \\
    if (_test_failed_flag) { \\
      printf("FAILED\\n"); \\
      _tests_failed++; \\
    } else { \\
      printf("ok\\n"); \\
    } \\
  } while (0)

#define TEST_SUMMARY() \\
  do { \\
    printf("\\ntest result: %s. %d passed; %d failed\\n", \\
           _tests_failed == 0 ? "ok" : "FAILED", \\
           _tests_run - _tests_failed, _tests_failed); \\
    return _tests_failed > 0 ? 1 : 0; \\
  } while (0)

#endif /* TEST_H */
`;

export async function writeTestHeader(dir) {
  const testsDir = path.join(dir, "tests");
  await fs.mkdir(testsDir, { recursive: true });
  await fs.writeFile(path.join(testsDir, "test.h"), TEST_H_CONTENT);
}

// ---------------------------------------------------------------------------
// Output parser
// ---------------------------------------------------------------------------

export function parseCTestOutput(stdout, stderr) {
  const passingTests = [];
  const failingTests = [];
  const compilerErrors = [];

  for (const line of (stdout + "\n" + stderr).split("\n")) {
    if (/^test .+ \.\.\. ok$/.test(line.trim())) {
      passingTests.push(line.trim());
    } else if (/^test .+ \.\.\. FAILED$/.test(line.trim())) {
      failingTests.push(line.trim());
    } else if (/:[0-9]+:[0-9]+: error:/.test(line)) {
      compilerErrors.push(line.trim());
    }
  }

  return { passingTests, failingTests, compilerErrors };
}

