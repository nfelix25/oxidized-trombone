#include "structured_clone_context.h"
#include <stddef.h>

int sc_context_init(struct sc_context *ctx, size_t arena_bytes)
{
    (void)ctx;
    (void)arena_bytes;

    /* Initialize the structured clone arena and traversal stacks so the learner must zero buffers, allocate traversal storage, and propagate -ENOMEM style failures. */
    return 0;
}

int sc_context_register_transferable(struct sc_context *ctx,
                                     const struct sc_transferable_desc *desc)
{
    (void)ctx;
    (void)desc;

    /* Track a transferable in the context registry so the learner must detect duplicates, record handle metadata, and surface -EEXIST when the same handle is registered twice. */
    return 0;
}

int sc_context_free(struct sc_context *ctx)
{
    (void)ctx;

    /* Release the structured clone context so the learner must walk registered transferables, detach buffers, free arenas, and keep the routine idempotent. */
    return 0;
}
