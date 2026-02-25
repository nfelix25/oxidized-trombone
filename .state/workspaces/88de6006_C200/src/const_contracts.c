#include <stddef.h>
#include <stdbool.h>

/* Provide a const-correct slice over immutable storage so callers can peek at read()-produced buffers without mutating them; implement by bounds-checking the offset/length and recording the exposed length via view_len. */
const char *expose_readonly_view(const char *buffer,
                                 size_t buffer_len,
                                 size_t offset,
                                 size_t min_view,
                                 size_t *view_len)
{
    (void)buffer;
    (void)buffer_len;
    (void)offset;
    (void)min_view;
    (void)view_len;

    return NULL;
}

/* Copy an ASCII configuration token into a mutable buffer while honoring const inputs, truncating safely, and always terminating with '\'0'. */
size_t set_config_buffer(char *restrict dst,
                         size_t dst_len,
                         const char *restrict value)
{
    (void)dst;
    (void)dst_len;
    (void)value;

    return 0;
}

/* Convert an erased pointer from POSIX APIs back to a mutable view only when the original allocation was non-const; otherwise return NULL to preserve const-correctness guarantees. */
void *mutable_from_void(void *payload,
                        bool original_was_const)
{
    (void)payload;
    (void)original_was_const;

    return NULL;
}
