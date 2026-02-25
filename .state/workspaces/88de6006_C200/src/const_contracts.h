#ifndef CONST_CONTRACTS_H
#define CONST_CONTRACTS_H

#include <stddef.h>
#include <stdbool.h>

const char *expose_readonly_view(const char *buffer, size_t buffer_len, size_t offset, size_t min_view, size_t *view_len);
size_t      set_config_buffer(char *restrict dst, size_t dst_len, const char *restrict value);
void       *mutable_from_void(void *payload, bool original_was_const);

#endif /* CONST_CONTRACTS_H */
