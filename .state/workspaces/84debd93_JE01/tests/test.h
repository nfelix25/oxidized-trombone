#ifndef TEST_H
#define TEST_H

#include <stdio.h>
#include <string.h>
#include <math.h>
#include <setjmp.h>

static int _tests_run    = 0;
static int _tests_failed = 0;
static jmp_buf _test_jmpbuf;
static int _test_failed_flag = 0;

#define TEST_ASSERT(expr) \
  do { if (!(expr)) { \
    fprintf(stderr, "  assertion failed: %s (%s:%d)\n", #expr, __FILE__, __LINE__); \
    _test_failed_flag = 1; \
    longjmp(_test_jmpbuf, 1); \
  } } while (0)

#define TEST_ASSERT_EQ(a, b) TEST_ASSERT((a) == (b))

#define TEST_ASSERT_STR_EQ(a, b) \
  do { if (strcmp((a), (b)) != 0) { \
    fprintf(stderr, "  assertion failed: strcmp(\"%s\", \"%s\") != 0 (%s:%d)\n", \
            (a), (b), __FILE__, __LINE__); \
    _test_failed_flag = 1; \
    longjmp(_test_jmpbuf, 1); \
  } } while (0)

#define TEST_ASSERT_FLOAT_EQ(a, b, eps) \
  do { if (fabs((double)(a) - (double)(b)) > (double)(eps)) { \
    fprintf(stderr, "  assertion failed: |%f - %f| > %f (%s:%d)\n", \
            (double)(a), (double)(b), (double)(eps), __FILE__, __LINE__); \
    _test_failed_flag = 1; \
    longjmp(_test_jmpbuf, 1); \
  } } while (0)

#define RUN_TEST(fn) \
  do { \
    _tests_run++; \
    _test_failed_flag = 0; \
    printf("test " #fn " ... "); \
    fflush(stdout); \
    if (setjmp(_test_jmpbuf) == 0) { \
      fn(); \
    } \
    if (_test_failed_flag) { \
      printf("FAILED\n"); \
      _tests_failed++; \
    } else { \
      printf("ok\n"); \
    } \
  } while (0)

#define TEST_SUMMARY() \
  do { \
    printf("\ntest result: %s. %d passed; %d failed\n", \
           _tests_failed == 0 ? "ok" : "FAILED", \
           _tests_run - _tests_failed, _tests_failed); \
    return _tests_failed > 0 ? 1 : 0; \
  } while (0)

#endif /* TEST_H */
