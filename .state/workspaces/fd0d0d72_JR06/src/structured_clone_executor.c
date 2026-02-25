#include "structured_clone_executor.h"

int sc_dispatch_to_worker(struct sc_context *ctx,
                          struct sc_worker_endpoint *target,
                          const struct sc_encoded_buffer *payload)
{
    (void)ctx;
    (void)target;
    (void)payload;

    /* Dispatch the encoded payload to a worker so the learner must enqueue IPC frames, signal readiness via eventfd-like handles, and surface transport failures from the runtime. */
    return 0;
}

int sc_transfer_ports(struct sc_context *ctx,
                      struct sc_transferable_desc *ports,
                      size_t port_count)
{
    (void)ctx;
    (void)ports;
    (void)port_count;

    /* Move MessagePort ownership so the learner must validate entanglement pairs, refuse duplicates with -EBUSY, and close the sender endpoint once transfer is committed. */
    return 0;
}

int sc_commit_transfer_list(struct sc_context *ctx,
                            const struct sc_message_record *record)
{
    (void)ctx;
    (void)record;

    /* Finalize the transfer list so the learner must detach buffers, update handle tables atomically, and roll back the entire commit if any resource finalization fails. */
    return 0;
}
