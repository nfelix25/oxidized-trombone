Structured clone is the engine trick that lets postMessage behave like shared memory without the races: it lets you queue arbitrarily complex graphs while each Worker still believes it owns its own copy. JSON tops out at numbers, strings, and trees; any ArrayBuffer, TypedArray, Map, Set, or cyclic graph forces you to either flatten the data by hand or bounce through shared globals—both are bottlenecks once you need millions of messages per second. With structured clone, the runtime treats a message like a mini object file: typed tags, deterministic traversal order, and a transfer list that can move ownership of huge buffers rather than copying them. That is why browsers and JS shells rely on it to keep UI, network, and storage workers busy without blocking the main loop. In C you wire this up with a narrow API that JS shims call into, e.g.
```c
int postmessage_clone(struct sc_context *ctx, const struct sc_value *value,
                      struct sc_message_record *record)
{
    if (sc_context_init(ctx, 64 * 1024))
        return -1;
    if (sc_encode_value(ctx, value, &record->encoded))
        return sc_context_free(ctx);
    return sc_encode_postmessage_payload(ctx, record, &record->encoded);
}
```
Here the context becomes a scratch arena owned by the runtime, so any Worker can emit a high-volume stream of heterogeneous messages without allocating through the JS heap or stalling on JSON stringify/parse cycles.

Inside a runtime the structured clone path is three interlocking loops: tag emission, traversal bookkeeping, and transferable vetting. Tagging is the lingua franca between engine and Worker—the encoder maps every JS shape to a compact enum plus length prefix so the decoder never has to second-guess byte boundaries. The traversal stack is a deterministic DFS queue that remembers every edge you have already walked, allowing identity-preserving back-references without recursion depth blowups. Finally, the transfer list is a guarded side channel: every ArrayBuffer, SharedArrayBuffer, or MessagePort is validated once, annotated with ownership bits, and either duplicated or moved before the payload leaves the thread. A minimal C skeleton looks like this:
```c
int sc_clone(struct sc_context *ctx, const struct sc_value *root,
             struct sc_encoded_buffer *encoded,
             struct sc_transferable_desc *xfer, size_t xfer_count)
{
    if (sc_context_init(ctx, 64 * 1024))
        return -ENOMEM;
    if (sc_encode_value(ctx, root, encoded))
        return sc_context_free(ctx);
    if (sc_commit_transfer_list(ctx, &(struct sc_message_record){
            .root = root, .transfer_list = xfer, .transfer_count = xfer_count }))
        return sc_context_free(ctx);
    return 0;
}
```
Real engines split those calls across subsystems but the flow is identical: type tags are written as you pop items off the traversal stack, every new pointer is registered into the identity table, and the transfer validator either decorates the encoded stream with handles (SAB, ports) or copies bytes (ArrayBuffers) before the executor posts the message.

Transferables are a contract: once a buffer or port enters the transfer list, the sender must never touch it again, and the receiver must know whether it owns a byte copy or a handle. A structured clone context tracks this through three lifecycles. ArrayBuffer entries start as registered handles, get duplicated into the destination arena, and are marked detached so the JS engine reuses the backing store pointer slot but zeros its length. SharedArrayBuffer entries skip the copy; instead we log their OS handle plus atomic-capability flag and ensure the target worker increments the reference count before the source decrements. MessagePorts behave like duplex pipes: the sender marks the entangled endpoint as "closing", the executor enqueues a detach op, and only when the receiver installs its end do we toggle the committed bit. A minimal lifecycle helper might look like:
```c
int sc_track_transferable(struct sc_context *ctx, struct sc_transferable_desc *desc)
{
    switch (desc->flags & SC_KIND_MASK) {
    case SC_KIND_ARRAYBUFFER:
        memcpy(arena_alloc(ctx, desc->length), desc->handle, desc->length);
        return sc_mark_detached(desc);
    case SC_KIND_SHARED_ARRAYBUFFER:
        return sc_register_sab_handle(ctx, (int)(intptr_t)desc->handle, desc->length);
    case SC_KIND_MESSAGEPORT:
        return sc_queue_port_move(ctx, desc);
    default:
        return -EINVAL;
    }
}
```
These guardrails let workers exchange huge payloads without data races because the runtime records every ownership transition before the executor ever writes to an IPC queue.

To understand typed array cloning under load, imagine the JS payload `message = { matrix: new Float32Array(6), channels: [ { mask: new Uint8Array(4) }, new Uint8Array(4) ] }`. The encoder starts by pushing the root object onto its DFS stack. Each time a container (object or array) is popped, it emits a tag plus child-count header, then pushes the children in reverse so the wire format preserves insertion order without recursion. When a TypedArray leaf appears, it reserves space in the clone buffer, copies the backing store bytes, records the byte length, and flips the source descriptor into the detached state.

The worked program below mirrors that control flow. Frames in `stack` model the traversal stack used inside `sc_encode_value`. `emit_typed` stands in for the ArrayBuffer duplication step: it writes the typed tag, the byte length, then the payload itself. Container frames write deterministic headers before descending; when `next_child` equals the child count, the frame is popped, recreating the unwind that would normally trigger reference-table bookkeeping.

Running it pushes three container frames (`message`, `channels`, `layer0`) and three leaves; `write` flushes the contiguous buffer to STDOUT, while `dprintf` reports the byte length. Because each container header is 8 bytes (tag + child count) and each TypedArray contributes `8 + payload_length` bytes, the reported `used` equals `3*8 + (8+24) + (8+4) + (8+4) = 80`, proving that every buffer was duplicated exactly once before the traversal stack empties.

```c
#include <stdint.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>

enum node_kind {
    NODE_OBJECT = 0x10u,
    NODE_ARRAY = 0x11u,
    NODE_TYPED_FLOAT32 = 0x20u,
    NODE_TYPED_UINT8 = 0x21u
};

struct typed_view {
    const void *data;
    size_t length;
    uint32_t tag;
};

struct node {
    enum node_kind kind;
    const char *label;
    union {
        struct {
            const struct node *const *children;
            size_t child_count;
        } comp;
        struct typed_view typed;
    } as;
};

struct clone_frame {
    const struct node *node;
    size_t next_child;
};

static size_t emit_typed(uint8_t *dst, size_t cap, const struct typed_view *view)
{
    const size_t needed = sizeof(uint32_t) * 2 + view->length;
    if (cap < needed)
        return 0;
    memcpy(dst, &view->tag, sizeof(uint32_t));
    uint32_t bytes = (uint32_t)view->length;
    memcpy(dst + sizeof(uint32_t), &bytes, sizeof(uint32_t));
    memcpy(dst + sizeof(uint32_t) * 2, view->data, view->length);
    return needed;
}

int main(void)
{
    float matrix_data[6] = { 1.f, 0.f, 0.f, 0.f, 1.f, 0.f };
    uint8_t mask_data[4] = { 0, 1, 1, 0 };
    uint8_t gradient_data[4] = { 4, 5, 6, 7 };

    struct typed_view matrix_view = { matrix_data, sizeof(matrix_data), NODE_TYPED_FLOAT32 };
    struct typed_view mask_view = { mask_data, sizeof(mask_data), NODE_TYPED_UINT8 };
    struct typed_view gradient_view = { gradient_data, sizeof(gradient_data), NODE_TYPED_UINT8 };

    struct node matrix_node = { NODE_TYPED_FLOAT32, "matrix", .as.typed = matrix_view };
    struct node mask_node = { NODE_TYPED_UINT8, "mask", .as.typed = mask_view };
    struct node gradient_node = { NODE_TYPED_UINT8, "gradient", .as.typed = gradient_view };

    const struct node *const layer_children[] = { &mask_node };
    struct node layer_obj = { NODE_OBJECT, "layer0", .as.comp = { layer_children, 1 } };

    const struct node *const channel_children[] = { &layer_obj, &gradient_node };
    struct node channels = { NODE_ARRAY, "channels", .as.comp = { channel_children, 2 } };

    const struct node *const root_children[] = { &matrix_node, &channels };
    struct node root = { NODE_OBJECT, "message", .as.comp = { root_children, 2 } };

    struct clone_frame stack[16];
    size_t sp = 0;
    stack[sp++] = (struct clone_frame){ .node = &root, .next_child = 0 };

    uint8_t buffer[512];
    size_t used = 0;

    while (sp > 0) {
        struct clone_frame *frame = &stack[sp - 1];
        if (frame->node->kind == NODE_TYPED_FLOAT32 || frame->node->kind == NODE_TYPED_UINT8) {
            size_t wrote = emit_typed(buffer + used, sizeof(buffer) - used, &frame->node->as.typed);
            if (!wrote)
                return EXIT_FAILURE;
            used += wrote;
            --sp;
            continue;
        }

        if (frame->next_child == 0) {
            uint32_t header[2] = {
                (uint32_t)frame->node->kind,
                (uint32_t)frame->node->as.comp.child_count
            };
            if (sizeof(buffer) - used < sizeof(header))
                return EXIT_FAILURE;
            memcpy(buffer + used, header, sizeof(header));
            used += sizeof(header);
        }

        if (frame->next_child == frame->node->as.comp.child_count) {
            --sp;
            continue;
        }

        if (sp == sizeof(stack) / sizeof(stack[0]))
            return EXIT_FAILURE;

        const struct node *child = frame->node->as.comp.children[frame->next_child++];
        stack[sp++] = (struct clone_frame){ .node = child, .next_child = 0 };
    }

    if (write(STDOUT_FILENO, buffer, used) < 0)
        return EXIT_FAILURE;

    dprintf(STDERR_FILENO, "serialized %zu bytes\n", used);
    return EXIT_SUCCESS;
}
```


Moving a MessagePort and a SharedArrayBuffer in one transaction means the executor must juggle both ownership tables and OS handles. First, the encoder validates that the SAB was created with atomics (otherwise multiple workers could observe torn writes). Next it locks both port endpoints, marks the sender half as "detaching", and stages the SAB handle into the transfer list without copying any bytes. Once the payload bytes are queued, the executor emits an eventfd tick to wake the destination worker; only when the worker acks does the runtime flip both assets to the "committed" state.
```c
#include <errno.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/eventfd.h>
#include <unistd.h>

struct sc_transferable_desc { void *handle; size_t length; unsigned flags; };
struct sc_message_port { int queue_fd; int signal_fd; int state; };

static int move_port(struct sc_message_port *port)
{
    if (port->state != 0)
        return -EBUSY;
    port->state = 1; /* detaching */
    uint64_t tick = 1;
    if (write(port->signal_fd, &tick, sizeof(tick)) != sizeof(tick))
        return -EIO;
    return 0;
}

int main(void)
{
    int queue_pipe[2];
    pipe(queue_pipe);
    int signal_fd = eventfd(0, 0);
    struct sc_message_port port = { queue_pipe[1], signal_fd, 0 };

    struct sc_transferable_desc sab = {
        .handle = (void *)(intptr_t)42, /* shared memory handle */
        .length = 4096,
        .flags = 0x1u /* SAB_FLAG_HAS_ATOMICS */
    };

    if (move_port(&port) < 0)
        return 1;

    const char msg[] = "postMessage payload";
    write(port.queue_fd, msg, sizeof(msg));

    uint64_t ack;
    read(signal_fd, &ack, sizeof(ack));
    port.state = 2;      /* committed */
    sab.flags |= 0x2u;   /* mark transferred */

    dprintf(STDOUT_FILENO, "queued %zu bytes, handle=%p committed\n",
            sizeof(msg), sab.handle);
    return 0;
}
```
Here the sender moves the port by writing to its signal fd before the data hits `queue_fd`, mirroring how browsers gate MessagePort ownership. The SAB never copies; instead the descriptor’s `handle` is tagged as transferred so the receiver can map it with `mmap` and increment the shared refcount once its worker loop sees the wakeup tick.

A structured clone payload is a concatenation of tagged records, each starting with a 32-bit little-endian tag ID followed by a 32-bit length field describing the bytes that immediately follow. Containers (objects/arrays) store their child count first, then inlined child records; primitives store a byte span; transferables reserve space for bookkeeping. ArrayBuffer records therefore look like `[TAG_ARRAYBUFFER | byte_length | raw bytes]`, and the clone arena copies the backing store once before the writer advances the cursor. SharedArrayBuffers diverge right after the tag: instead of raw bytes, the writer emits a handle descriptor `[handle fd | shared_length | flags]`, because SAB ownership is shared, not copied. MessagePorts are similar but encode an entanglement slot plus endpoint IDs.
```c
#define TAG_ARRAYBUFFER        0x20u
#define TAG_SHARED_ARRAYBUFFER 0x21u

static int write_buffer_record(struct sc_encoded_buffer *out,
                               uint32_t tag, const void *data,
                               uint32_t length)
{
    uint32_t header[2] = { tag, length };
    if (buffer_write(out, header, sizeof(header)))
        return -EMSGSIZE;
    if (data && buffer_write(out, data, length))
        return -EMSGSIZE;
    return 0;
}

int sc_encode_sab(struct sc_encoded_buffer *out,
                  const struct sab_desc *sab)
{
    struct sab_record rec = {
        .handle = sab->os_handle,
        .length = sab->byte_length,
        .flags = sab->has_atomics ? SAB_FLAG_HAS_ATOMICS : 0
    };
    return write_buffer_record(out, TAG_SHARED_ARRAYBUFFER,
                               &rec, sizeof(rec));
}
```
Because SABs only stream metadata, their records stay fixed-width regardless of payload size, letting decoders remap handles lazily while ArrayBuffer records scale with every byte copied. This distinction keeps move-only resources from touching the wire while still allowing deep copies for regular buffers.

JSON.stringify is a lossy, tree-only format: everything becomes UTF-8 text, prototypes collapse to plain objects, and transferables turn into either base64 blobs or implicit globals. Structured clone keeps native fidelity by recording tags per node, so TypedArrays, Maps, cyclic graphs, and MessagePorts maintain shape while still allowing deep copies or ownership moves. Performance-wise, JSON forces a fresh heap allocation for the string plus a regex-grade parser on the receiving side, whereas structured clone writes directly into a pre-sized arena and can mark certain resources as moved instead of copied (SharedArrayBuffers, ports). The difference shows up even in C glue code:
```c
int send_json(int fd, const struct js_value *value)
{
    char json[4096];
    size_t len = js_stringify(value, json, sizeof(json));
    return write(fd, json, len) == (ssize_t)len ? 0 : -EIO;
}

int send_clone(struct sc_context *ctx, const struct sc_value *value, int fd)
{
    struct sc_encoded_buffer buf = { .data = arena_base(ctx), .capacity = arena_size(ctx) };
    if (sc_encode_value(ctx, value, &buf))
        return -EINVAL;
    return write(fd, buf.data, buf.length) == (ssize_t)buf.length ? 0 : -EIO;
}
```
Custom serializers often mimic the first function: fast to sketch, but brittle when new node types appear. Structured clone behaves more like Rust’s `serde` with borrowing modes or Zig’s std.json parser paired with `ArenaAllocator`; you can mix deep copies and zero-copy moves depending on tag semantics without rewriting every consumer. That balance between fidelity and controlled performance cost is why browsers standardize the clone path instead of letting each subsystem invent bespoke JSON shims.

Four patterns regularly destabilize structured clone pipelines: (1) non-cloneable inputs (functions, DOM nodes, opaque host wrappers) that should trigger -EINVAL but instead leak through; (2) ArrayBuffers that the engine forgets to mark detached, so JS keeps writing into freed memory; (3) cyclic prototype chains that never re-enter the identity table, causing exponential re-traversal; and (4) skipping slot sealing when embedding engines patch the transfer hook, exposing undefined behaviour because the receiver reads from partially initialized records. The broken helper below illustrates the first two—note the missing tag gate and the fact that the source buffer is neither detached nor seal-checked, which Clang correctly warns about (“warning: variable ‘desc’ is used uninitialized”).
```c
int sc_emit_leaf(struct sc_context *ctx, const struct sc_value *value)
{
    struct sc_arraybuffer_desc desc;
    if (value->tag == TAG_ARRAYBUFFER)
        memcpy(arena_alloc(ctx, desc.length), desc.data, desc.length); /* UB */
    /* falls through when tag == TAG_FUNCTION, so decoder sees garbage */
    return 0;
}
```
A safe variant rejects function-like tags up front, seals the slot before copying, detaches the source, and logs identity hits for cyclic graphs so the traversal stack never replays children.
```c
int sc_emit_leaf(struct sc_context *ctx, const struct sc_value *value)
{
    if (value->tag == TAG_FUNCTION)
        return -EINVAL;
    if (value->tag == TAG_ARRAYBUFFER) {
        const struct sc_arraybuffer_desc *desc = value->opaque;
        void *dst = arena_alloc(ctx, desc->length);
        if (!dst)
            return -ENOMEM;
        memcpy(dst, desc->data, desc->length);
        sc_mark_detached(desc);
        return sc_register_identity(ctx, value);
    }
    return sc_encode_transferable(ctx, value);
}
```
Always seal object slots before handing buffers to user hooks and ensure every cyclic prototype edge visits `sc_register_identity` exactly once; otherwise worker cancellation leaves transferables half-owned and readers dereference stale pointers.

Cloning only looks atomic to JavaScript; the runtime is juggling arenas, transfer registries, and kernel handles that can leak if a worker dies or a cancellation signal lands between syscalls. If `sc_encode_value` has copied half a gigabyte of ArrayBuffers when SIGTERM arrives, the arena pointers remain referenced by no worker, yet the backing stores stay mapped. Likewise, an in-flight SharedArrayBuffer transfer might have duplicated its file descriptor into the destination worker without clearing the sender’s ownership bit, so both ends try to free it when the scheduler next runs. To harden this path, keep an explicit rollback ledger (allocated pages, registered handles, eventfds) and mask asynchronous signals while the ledger is mutated so you never unwind with inconsistent bookkeeping. The skeleton below blocks SIGTERM/SIGUSR1 while staging the payload, installs a cleanup handler that detaches partially registered transferables, and ensures `sc_abort_pending_transfers` runs on every failure path:
```c
int sc_clone_safe(struct sc_context *ctx, struct sc_worker_endpoint *dst,
                  const struct sc_message_record *rec)
{
    sigset_t oldmask, mask;
    sigemptyset(&mask);
    sigaddset(&mask, SIGTERM);
    pthread_sigmask(SIG_BLOCK, &mask, &oldmask);

    if (sc_context_init(ctx, 128 * 1024))
        goto restore;
    pthread_cleanup_push(sc_cleanup_transfers, ctx);

    if (sc_encode_postmessage_payload(ctx, rec, &ctx->staged))
        goto fail;
    if (write(dst->queue_fd, ctx->staged.data, ctx->staged.length) < 0)
        goto fail;

    pthread_cleanup_pop(0);
    sc_context_free(ctx);
restore:
    pthread_sigmask(SIG_SETMASK, &oldmask, NULL);
    return 0;
fail:
    sc_abort_pending_transfers(ctx);
    pthread_cleanup_pop(1);
    sc_context_free(ctx);
    goto restore;
}
```
Pair this with periodic watchdog sweeps that call `sc_context_free` on abandoned contexts and close any queue/eventfd pair left in the detaching state; that keeps both memory usage and kernel-handle counts bounded even when workers crash mid-clone.

Transferable streams and zero-copy IPC schedulers are the natural sequel to structured clone: once every transferable is tagged, detached, and reference-counted, you can promise the scheduler that large payloads no longer need to bounce through clone arenas at all. The remaining constraint is bookkeeping—streams must sample the same ownership bits you already maintain for ArrayBuffers, SharedArrayBuffers, and MessagePorts, otherwise a supposedly zero-copy frame might still hold onto a stale JS heap pointer. When you prepare the handoff table for a streaming transport, you reuse the transfer registry as the authority that says which buffers are safe to present as scatter/gather vectors, which ports are still entangled, and which SAB handles require atomics to stay armed while the stream pumps data. That makes structured clone the feasibility gate: if a value cannot survive clone validation, the stream scheduler cannot trust it for zero-copy either. Embedding runtimes therefore add a thin shim that translates transferables into stream slots before the IPC layer wakes its poll loop:
```c
#include <stddef.h>
int sc_stage_transferable_stream(struct sc_context *ctx,
                                 struct sc_transferable_desc *desc,
                                 struct sc_stream_slot *slot)
{
    if (sc_context_register_transferable(ctx, desc))
        return -EEXIST;
    slot->handle = desc->handle;
    slot->length = desc->length;
    slot->flags = STREAM_FLAG_ZERO_COPY;
    return sc_schedule_zero_copy(slot);
}
```
By the time you dive into transferable streams, this shim is already doing most of the work: it enforces the clone invariants, then exposes the descriptors in a format the zero-copy scheduler can consume without revalidating JavaScript objects. That alignment keeps the next module focused on throughput (batching, back-pressure, DMA) instead of rehashing ownership rules you have already encoded in the clone context.