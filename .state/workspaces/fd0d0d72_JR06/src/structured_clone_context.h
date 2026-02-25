#ifndef STRUCTURED_CLONE_CONTEXT_H
#define STRUCTURED_CLONE_CONTEXT_H

#include <stddef.h>

struct sc_transferable_desc {
    void *handle;
    size_t length;
    unsigned int flags;
};

struct sc_context {
    void *arena_base;
    size_t arena_size;
    size_t arena_used;
    unsigned int transfer_count;
    void *transfer_entries;
};

/* Initialize the structured clone arena and traversal stacks so the learner must zero buffers, allocate traversal storage, and propagate -ENOMEM style failures. */
int sc_context_init(struct sc_context *ctx, size_t arena_bytes);

/* Track a transferable in the context registry so the learner must detect duplicates, record handle metadata, and surface -EEXIST when the same handle is registered twice. */
int sc_context_register_transferable(struct sc_context *ctx,
                                     const struct sc_transferable_desc *desc);

/* Release the structured clone context so the learner must walk registered transferables, detach buffers, free arenas, and keep the routine idempotent. */
int sc_context_free(struct sc_context *ctx);

#endif /* STRUCTURED_CLONE_CONTEXT_H */
