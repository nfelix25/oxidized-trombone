#ifndef STRUCTURED_CLONE_EXECUTOR_H
#define STRUCTURED_CLONE_EXECUTOR_H

#include <stddef.h>
#include "structured_clone_context.h"
#include "structured_clone_encoder.h"

struct sc_worker_endpoint {
    int queue_fd;
    int signal_fd;
    unsigned int flags;
};

/* Dispatch the encoded payload to a worker so the learner must marshal the IPC frame, signal readiness to the worker loop, and propagate transport errors from the runtime. */
int sc_dispatch_to_worker(struct sc_context *ctx,
                          struct sc_worker_endpoint *target,
                          const struct sc_encoded_buffer *payload);

/* Transfer ownership of MessagePort instances so the learner must validate entanglement pairs, reject duplicates with -EBUSY, and close sender endpoints when transfers succeed. */
int sc_transfer_ports(struct sc_context *ctx,
                      struct sc_transferable_desc *ports,
                      size_t port_count);

/* Commit the transfer list so the learner must detach buffers, update handle tables atomically, and roll back state when any finalization step fails mid-commit. */
int sc_commit_transfer_list(struct sc_context *ctx,
                            const struct sc_message_record *record);

#endif /* STRUCTURED_CLONE_EXECUTOR_H */
