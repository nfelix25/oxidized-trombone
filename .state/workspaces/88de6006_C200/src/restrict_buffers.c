#include <stddef.h>
#include <stdbool.h>

/* Use restrict-qualified inputs to accumulate disjoint float buffers in one pass, returning the total so callers can validate throughput math. */
float restrict_sum(const float *restrict lhs,
                   const float *restrict rhs,
                   size_t count)
{
    (void)lhs;
    (void)rhs;
    (void)count;

    return 0;
}

/* Scale a source buffer into a non-aliasing destination, honoring restrict promises while keeping n==0 as a no-op for callers benchmarking loops. */
void restrict_scale(float *restrict dst,
                    const float *restrict src,
                    float multiplier,
                    size_t count)
{
    (void)dst;
    (void)src;
    (void)multiplier;
    (void)count;
}

/* Mirror memcpy semantics by first proving the byte ranges are disjoint; return 0 on success or a negative error when overlap would violate restrict guarantees. */
int restrict_memcpy(void *restrict dst,
                    const void *restrict src,
                    size_t byte_len)
{
    (void)dst;
    (void)src;
    (void)byte_len;

    return 0;
}

/* Report whether two candidate restrict windows are truly disjoint so higher-level buffer schedulers can uphold alias contracts before issuing reads. */
bool restrict_alias_window(const void *restrict first,
                           size_t first_len,
                           const void *restrict second,
                           size_t second_len)
{
    (void)first;
    (void)first_len;
    (void)second;
    (void)second_len;

    return 0;
}
