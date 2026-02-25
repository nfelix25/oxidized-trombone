#include "test.h"
#include "pointer_ops.h"
#include "restrict_buffers.h"
#include "const_contracts.h"
#include <stddef.h>
#include <string.h>
#include <math.h>
#include <stdbool.h>

void test_pointer_offset_diff_in_range(void)
{
    int samples[] = {2, 4, 6, 8, 10, 12};
    ptrdiff_t diff = pointer_offset_diff(samples, 6, &samples[4]);
    TEST_ASSERT_EQ(4, diff);
}

void test_pointer_offset_diff_rejects_out_of_bounds(void)
{
    int samples[] = {5, 9, 14, 20, 25};
    ptrdiff_t diff = pointer_offset_diff(samples, 5, samples + 5);
    TEST_ASSERT(diff < 0);
}

void test_safe_ptr_add_within_bounds(void)
{
    unsigned char buffer[32] = {0};
    unsigned char *cursor = safe_ptr_add(buffer, sizeof(buffer), 12);
    TEST_ASSERT(cursor == buffer + 12);
}

void test_safe_ptr_add_rejects_escape(void)
{
    unsigned char buffer[16] = {0};
    TEST_ASSERT(safe_ptr_add(buffer, sizeof(buffer), 20) == NULL);
    TEST_ASSERT(safe_ptr_add(buffer, sizeof(buffer), -3) == NULL);
}

void test_array_decay_to_const_returns_row(void)
{
    unsigned char grid[4][4] = {
        {0x10, 0x11, 0x12, 0x13},
        {0x20, 0x21, 0x22, 0x23},
        {0x30, 0x31, 0x32, 0x33},
        {0x40, 0x41, 0x42, 0x43}
    };
    const unsigned char *row = array_decay_to_const(grid, 4, 2);
    TEST_ASSERT(row != NULL);
    TEST_ASSERT_EQ(0x30, row[0]);
    TEST_ASSERT_EQ(0x33, row[3]);
}

void test_array_decay_to_const_requires_min_rows(void)
{
    unsigned char short_grid[3][4] = {{0}};
    TEST_ASSERT(array_decay_to_const(short_grid, 3, 0) == NULL);

    unsigned char tall_grid[4][4] = {{0}};
    TEST_ASSERT(array_decay_to_const(tall_grid, 4, 4) == NULL);
}

void test_wraparound_guard_reports_positive_in_range(void)
{
    unsigned char buffer[64];
    ptrdiff_t delta = wraparound_guard(buffer, sizeof(buffer), buffer + 28);
    TEST_ASSERT_EQ(28, delta);
    TEST_ASSERT_EQ(0, wraparound_guard(buffer, sizeof(buffer), buffer));
}

void test_wraparound_guard_flags_before_or_beyond(void)
{
    unsigned char buffer[64];
    unsigned char *base = buffer + 10;
    ptrdiff_t before = wraparound_guard(base, 10, buffer + 6);
    TEST_ASSERT(before < 0);

    ptrdiff_t beyond = wraparound_guard(buffer, 16, buffer + 32);
    TEST_ASSERT(beyond < 0);
}

void test_restrict_sum_matches_manual(void)
{
    float lhs[] = {1.0f, 2.5f, -3.0f, 4.5f};
    float rhs[] = {0.5f, 1.0f, 3.0f, -1.5f};
    float total = restrict_sum(lhs, rhs, 4);
    float manual = 0.0f;
    for (size_t i = 0; i < 4; ++i) {
        manual += lhs[i] + rhs[i];
    }
    TEST_ASSERT(fabsf(total - manual) < 1e-5f);
}

void test_restrict_scale_multiplies_without_alias(void)
{
    float src[] = {1.0f, -2.0f, 0.5f, 8.0f};
    float dst[] = {10.0f, 10.0f, 10.0f, 10.0f};
    restrict_scale(dst, src, 3.0f, 4);
    for (size_t i = 0; i < 4; ++i) {
        TEST_ASSERT(fabsf(dst[i] - (src[i] * 3.0f)) < 1e-5f);
    }
}

void test_restrict_scale_noop_zero_count(void)
{
    float src[] = {5.0f};
    float dst[] = {42.0f};
    restrict_scale(dst, src, 7.0f, 0);
    TEST_ASSERT(fabsf(dst[0] - 42.0f) < 1e-5f);
}

void test_restrict_memcpy_success(void)
{
    char src[] = "socket-buffer";
    char dst[32];
    memset(dst, 0, sizeof(dst));
    int rc = restrict_memcpy(dst, src, strlen(src) + 1);
    TEST_ASSERT_EQ(0, rc);
    TEST_ASSERT_EQ(0, strcmp(dst, src));
}

void test_restrict_memcpy_detects_overlap(void)
{
    char buffer[32] = "ABCDEFGHIJKL";
    char snapshot[32];
    memcpy(snapshot, buffer, sizeof(buffer));
    int rc = restrict_memcpy(buffer + 2, buffer, 8);
    TEST_ASSERT(rc < 0);
    TEST_ASSERT_EQ(0, memcmp(buffer, snapshot, sizeof(buffer)));
}

void test_restrict_alias_window_disjoint(void)
{
    unsigned char first[8] = {0};
    unsigned char second[8] = {0};
    TEST_ASSERT(restrict_alias_window(first, sizeof(first), second, sizeof(second)));
}

void test_restrict_alias_window_overlap(void)
{
    unsigned char buffer[32];
    bool ok = restrict_alias_window(buffer, 12, buffer + 6, 10);
    TEST_ASSERT(!ok);
}

void test_expose_readonly_view_sets_length(void)
{
    const char payload[] = "read-buffer:alpha";
    size_t view_len = 0;
    const char *view = expose_readonly_view(payload, sizeof(payload) - 1, 5, 6, &view_len);
    TEST_ASSERT(view == payload + 5);
    TEST_ASSERT_EQ((sizeof(payload) - 1) - 5, view_len);
    TEST_ASSERT_EQ('b', view[1]);
}

void test_expose_readonly_view_rejects_short_window(void)
{
    const char payload[] = "abc";
    size_t view_len = 99;
    const char *view = expose_readonly_view(payload, sizeof(payload) - 1, 1, 4, &view_len);
    TEST_ASSERT(view == NULL);
    TEST_ASSERT_EQ(0, view_len);
}

void test_set_config_buffer_exact_copy(void)
{
    char dst[32];
    memset(dst, 0xAA, sizeof(dst));
    const char *value = "MODE=fast";
    size_t copied = set_config_buffer(dst, sizeof(dst), value);
    TEST_ASSERT_EQ(strlen(value), copied);
    TEST_ASSERT_EQ(0, strcmp(value, dst));
}

void test_set_config_buffer_truncates_and_terminates(void)
{
    char dst[5];
    memset(dst, 0xAA, sizeof(dst));
    size_t copied = set_config_buffer(dst, sizeof(dst), "LONGVALUE");
    TEST_ASSERT_EQ(sizeof(dst) - 1, copied);
    TEST_ASSERT_EQ('\0', dst[sizeof(dst) - 1]);
    TEST_ASSERT_EQ(0, strncmp("LONGVALUE", dst, sizeof(dst) - 1));
}

void test_mutable_from_void_allows_mutable_payload(void)
{
    int value = 17;
    int *restored = (int *)mutable_from_void(&value, false);
    TEST_ASSERT(restored != NULL);
    *restored = 99;
    TEST_ASSERT_EQ(99, value);
}

void test_mutable_from_void_rejects_const_payload(void)
{
    int value = 33;
    void *restored = mutable_from_void(&value, true);
    TEST_ASSERT(restored == NULL);
    TEST_ASSERT_EQ(33, value);
}

int main(void)
{
    RUN_TEST(test_pointer_offset_diff_in_range);
    RUN_TEST(test_pointer_offset_diff_rejects_out_of_bounds);
    RUN_TEST(test_safe_ptr_add_within_bounds);
    RUN_TEST(test_safe_ptr_add_rejects_escape);
    RUN_TEST(test_array_decay_to_const_returns_row);
    RUN_TEST(test_array_decay_to_const_requires_min_rows);
    RUN_TEST(test_wraparound_guard_reports_positive_in_range);
    RUN_TEST(test_wraparound_guard_flags_before_or_beyond);
    RUN_TEST(test_restrict_sum_matches_manual);
    RUN_TEST(test_restrict_scale_multiplies_without_alias);
    RUN_TEST(test_restrict_scale_noop_zero_count);
    RUN_TEST(test_restrict_memcpy_success);
    RUN_TEST(test_restrict_memcpy_detects_overlap);
    RUN_TEST(test_restrict_alias_window_disjoint);
    RUN_TEST(test_restrict_alias_window_overlap);
    RUN_TEST(test_expose_readonly_view_sets_length);
    RUN_TEST(test_expose_readonly_view_rejects_short_window);
    RUN_TEST(test_set_config_buffer_exact_copy);
    RUN_TEST(test_set_config_buffer_truncates_and_terminates);
    RUN_TEST(test_mutable_from_void_allows_mutable_payload);
    RUN_TEST(test_mutable_from_void_rejects_const_payload);
    TEST_SUMMARY();
}
