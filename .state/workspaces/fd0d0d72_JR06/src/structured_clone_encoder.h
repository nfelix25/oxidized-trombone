#ifndef STRUCTURED_CLONE_ENCODER_H
#define STRUCTURED_CLONE_ENCODER_H

#include <stddef.h>
#include "structured_clone_context.h"

struct sc_encoded_buffer {
    void *data;
    size_t length;
    size_t capacity;
};

struct sc_value {
    const void *opaque;
    unsigned int tag;
};

struct sc_arraybuffer_desc {
    const void *data;
    size_t length;
    unsigned int flags;
};

struct sc_shared_arraybuffer_desc {
    int handle;
    size_t length;
    unsigned int flags;
};

struct sc_message_record {
    const struct sc_value *root;
    const struct sc_transferable_desc *transfer_list;
    size_t transfer_count;
};

/* Encode an arbitrary worker message so the learner must walk the graph depth-first, attach type tags, and surface -EINVAL for unsupported constructs. */
int sc_encode_value(struct sc_context *ctx,
                    const struct sc_value *root,
                    struct sc_encoded_buffer *out);

/* Clone an ArrayBuffer payload so the learner must copy bytes, mark detachment out of band, and flag -EMSGSIZE when the buffer exceeds limits. */
int sc_encode_arraybuffer(struct sc_context *ctx,
                          const struct sc_arraybuffer_desc *src,
                          struct sc_encoded_buffer *out);

/* Serialize a SharedArrayBuffer handle so the learner must emit handle IDs, check atomics capability, and reject illegal transfers with -EPERM. */
int sc_encode_shared_arraybuffer(struct sc_context *ctx,
                                 const struct sc_shared_arraybuffer_desc *src,
                                 struct sc_encoded_buffer *out);

/* Assemble the final postMessage payload so the learner must stitch headers, body vectors, and enforce maximum IPC frame sizes before enqueueing. */
int sc_encode_postmessage_payload(struct sc_context *ctx,
                                  const struct sc_message_record *record,
                                  struct sc_encoded_buffer *out);

#endif /* STRUCTURED_CLONE_ENCODER_H */
