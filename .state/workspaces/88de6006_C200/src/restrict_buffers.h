#ifndef RESTRICT_BUFFERS_H
#define RESTRICT_BUFFERS_H

#include <stddef.h>
#include <stdbool.h>

float restrict_sum(const float *restrict lhs, const float *restrict rhs, size_t count);
void  restrict_scale(float *restrict dst, const float *restrict src, float multiplier, size_t count);
int   restrict_memcpy(void *restrict dst, const void *restrict src, size_t byte_len);
bool  restrict_alias_window(const void *restrict first, size_t first_len, const void *restrict second, size_t second_len);

#endif /* RESTRICT_BUFFERS_H */
