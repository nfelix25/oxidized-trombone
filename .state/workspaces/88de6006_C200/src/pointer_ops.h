#ifndef POINTER_OPS_H
#define POINTER_OPS_H

#include <stddef.h>

/* Compute the ptrdiff_t distance between two int pointers read from the same buffer so learners must verify cursor stays within element_count slots before subtracting. */
static inline ptrdiff_t pointer_offset_diff(const int *base,
                                            size_t element_count,
                                            const int *cursor)
{
    (void)base;
    (void)element_count;
    (void)cursor;

    return 0;
}

/* Add a signed byte offset to a POSIX read buffer without escaping its byte_len boundary, returning NULL when callers would wrap past the allocation. */
static inline unsigned char *safe_ptr_add(unsigned char *base,
                                          size_t byte_len,
                                          ptrdiff_t byte_offset)
{
    (void)base;
    (void)byte_len;
    (void)byte_offset;

    return NULL;
}

/* Demonstrate array-to-pointer decay by exposing a const view of a row while asserting the source has at least four rows before handing back the pointer. */
static inline const unsigned char *array_decay_to_const(const unsigned char (*grid)[4],
                                                        size_t rows,
                                                        size_t row_index)
{
    (void)grid;
    (void)rows;
    (void)row_index;

    return NULL;
}

/* Guard against pointer wraparound by reporting a signed distance: negative when candidate precedes base and positive only when it sits within span bytes. */
static inline ptrdiff_t wraparound_guard(const unsigned char *base,
                                         size_t span,
                                         const unsigned char *candidate)
{
    (void)base;
    (void)span;
    (void)candidate;

    return 0;
}

#endif /* POINTER_OPS_H */
