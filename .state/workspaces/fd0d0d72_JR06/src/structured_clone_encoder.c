#include "structured_clone_encoder.h"

int sc_encode_value(struct sc_context *ctx,
                    const struct sc_value *root,
                    struct sc_encoded_buffer *out)
{
    (void)ctx;
    (void)root;
    (void)out;

    /* Encode an arbitrary worker message so the learner must walk the graph depth-first, attach type tags, and surface -EINVAL for unsupported constructs. */
    return 0;
}

int sc_encode_arraybuffer(struct sc_context *ctx,
                          const struct sc_arraybuffer_desc *src,
                          struct sc_encoded_buffer *out)
{
    (void)ctx;
    (void)src;
    (void)out;

    /* Clone an ArrayBuffer payload so the learner must copy bytes, mark detachment out of band, and flag -EMSGSIZE when the buffer exceeds limits. */
    return 0;
}

int sc_encode_shared_arraybuffer(struct sc_context *ctx,
                                 const struct sc_shared_arraybuffer_desc *src,
                                 struct sc_encoded_buffer *out)
{
    (void)ctx;
    (void)src;
    (void)out;

    /* Serialize a SharedArrayBuffer handle so the learner must emit handle IDs, check atomics capability, and reject illegal transfers with -EPERM. */
    return 0;
}

int sc_encode_postmessage_payload(struct sc_context *ctx,
                                  const struct sc_message_record *record,
                                  struct sc_encoded_buffer *out)
{
    (void)ctx;
    (void)record;
    (void)out;

    /* Assemble the final postMessage payload so the learner must stitch headers, body vectors, and enforce maximum IPC frame sizes before enqueueing. */
    return 0;
}
