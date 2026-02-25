#include "test.h"
#include "structured_clone_context.h"
#include "structured_clone_encoder.h"
#include "structured_clone_executor.h"
#include <errno.h>
#include <limits.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <unistd.h>

#define TRANSFER_FLAG_REGISTERED 0x1u
#define TRANSFER_FLAG_DETACHED   0x2u
#define TRANSFER_FLAG_IDENTITY   0x4u
#define TRANSFER_FLAG_IN_PORT    0x8u
#define TRANSFER_FLAG_COMMITTED  0x10u
#define TRANSFER_FLAG_FAIL_COMMIT 0x20u

#define SAB_FLAG_HAS_ATOMICS 0x1u

#define TAG_PRIMITIVE 0x10u
#define TAG_SEQUENCE 0x11u
#define TAG_REFERENCE 0x12u
#define TAG_ARRAYBUFFER 0x20u
#define TAG_SHARED_ARRAYBUFFER 0x21u
#define TAG_UNSUPPORTED 0xFFFFu

struct sc_primitive_value {
    const uint8_t *bytes;
    size_t length;
};

struct sc_sequence_value {
    const struct sc_value *const *children;
    size_t child_count;
};

struct test_port {
    bool closed;
    int id;
};

struct commit_payload {
    bool committed;
};

static uint32_t read_u32(const uint8_t *base, size_t offset)
{
    uint32_t val = 0;
    memcpy(&val, base + offset, sizeof(val));
    return val;
}

static void assert_transfer_entry(const struct sc_context *ctx,
                                  size_t idx,
                                  const void *handle,
                                  size_t length,
                                  unsigned int flag_mask)
{
    TEST_ASSERT(ctx->transfer_entries != NULL);
    const struct sc_transferable_desc *entries =
        (const struct sc_transferable_desc *)ctx->transfer_entries;
    TEST_ASSERT(idx < ctx->transfer_count);
    TEST_ASSERT_EQ(handle, entries[idx].handle);
    TEST_ASSERT_EQ(length, entries[idx].length);
    TEST_ASSERT((entries[idx].flags & flag_mask) == flag_mask);
}

static void test_sc_context_init_zeroes_arena(void)
{
    struct sc_context ctx = {
        .arena_base = (void *)0xDEADBEEF,
        .arena_size = 123,
        .arena_used = 7,
        .transfer_count = 3,
        .transfer_entries = (void *)0xCAFEBABE
    };

    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 256));
    TEST_ASSERT(ctx.arena_base != NULL);
    TEST_ASSERT_EQ(256u, ctx.arena_size);
    TEST_ASSERT_EQ(0u, ctx.arena_used);
    TEST_ASSERT_EQ(0u, ctx.transfer_count);
    TEST_ASSERT(ctx.transfer_entries != NULL);

    const uint8_t *arena = (const uint8_t *)ctx.arena_base;
    for (size_t i = 0; i < 32; ++i) {
        TEST_ASSERT_EQ(0u, arena[i]);
    }

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_context_init_enomem_preserves_state(void)
{
    struct sc_context ctx = {
        .arena_base = (void *)0x1,
        .arena_size = 32,
        .arena_used = 4,
        .transfer_count = 2,
        .transfer_entries = (void *)0x2
    };

    int rc = sc_context_init(&ctx, SIZE_MAX);
    TEST_ASSERT_EQ(-ENOMEM, rc);
    TEST_ASSERT_EQ((void *)0x1, ctx.arena_base);
    TEST_ASSERT_EQ(32u, ctx.arena_size);
    TEST_ASSERT_EQ(4u, ctx.arena_used);
    TEST_ASSERT_EQ(2u, ctx.transfer_count);
    TEST_ASSERT_EQ((void *)0x2, ctx.transfer_entries);
}

static void test_sc_context_register_transferable_records_handle(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 512));

    uint8_t buffer[16] = {0};
    struct sc_transferable_desc desc = {
        .handle = buffer,
        .length = sizeof(buffer),
        .flags = 0
    };

    TEST_ASSERT_EQ(0, sc_context_register_transferable(&ctx, &desc));
    TEST_ASSERT_EQ(1u, ctx.transfer_count);
    assert_transfer_entry(&ctx, 0, buffer, sizeof(buffer), TRANSFER_FLAG_REGISTERED);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_context_register_transferable_duplicate_returns_eexist(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 512));

    uint8_t buffer[8] = {0};
    struct sc_transferable_desc desc = {
        .handle = buffer,
        .length = sizeof(buffer),
        .flags = 0
    };

    TEST_ASSERT_EQ(0, sc_context_register_transferable(&ctx, &desc));
    int rc = sc_context_register_transferable(&ctx, &desc);
    TEST_ASSERT_EQ(-EEXIST, rc);
    TEST_ASSERT_EQ(1u, ctx.transfer_count);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_context_free_idempotent(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 128));

    uint8_t buffer[4] = {0};
    struct sc_transferable_desc desc = {
        .handle = buffer,
        .length = sizeof(buffer),
        .flags = 0
    };
    TEST_ASSERT_EQ(0, sc_context_register_transferable(&ctx, &desc));

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
    TEST_ASSERT_EQ(NULL, ctx.arena_base);
    TEST_ASSERT_EQ(0u, ctx.arena_size);
    TEST_ASSERT_EQ(0u, ctx.arena_used);
    TEST_ASSERT_EQ(0u, ctx.transfer_count);
    TEST_ASSERT_EQ(NULL, ctx.transfer_entries);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_value_depth_first_identity(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 512));

    uint8_t encoded[256] = {0};
    struct sc_encoded_buffer out = {
        .data = encoded,
        .length = 0,
        .capacity = sizeof(encoded)
    };

    static const uint8_t left_bytes[] = { 'L' };
    static const uint8_t right_bytes[] = { 'R', 'T' };
    struct sc_primitive_value left_payload = { left_bytes, sizeof(left_bytes) };
    struct sc_primitive_value right_payload = { right_bytes, sizeof(right_bytes) };
    struct sc_value left = { &left_payload, TAG_PRIMITIVE };
    struct sc_value right = { &right_payload, TAG_PRIMITIVE };
    const struct sc_value *children[] = { &left, &right, &left };
    struct sc_sequence_value seq = { children, 3 };
    struct sc_value root = { &seq, TAG_SEQUENCE };

    TEST_ASSERT_EQ(0, sc_encode_value(&ctx, &root, &out));
    TEST_ASSERT(out.length > 0);
    TEST_ASSERT_EQ(3u, ctx.transfer_count);
    assert_transfer_entry(&ctx, 0, &root, 0, TRANSFER_FLAG_IDENTITY);
    assert_transfer_entry(&ctx, 1, &left, 0, TRANSFER_FLAG_IDENTITY);
    assert_transfer_entry(&ctx, 2, &right, 0, TRANSFER_FLAG_IDENTITY);

    const uint8_t *bytes = encoded;
    size_t offset = 0;
    TEST_ASSERT_EQ(TAG_SEQUENCE, read_u32(bytes, offset));
    offset += 4;
    uint32_t seq_len = read_u32(bytes, offset);
    offset += 4;
    size_t seq_end = offset + seq_len;
    TEST_ASSERT(seq_end <= out.length);

    uint32_t child_count = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(3u, child_count);

    TEST_ASSERT_EQ(TAG_PRIMITIVE, read_u32(bytes, offset));
    offset += 4;
    uint32_t child_len = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT(child_len >= 4);
    uint32_t payload_len = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(left_payload.length, payload_len);
    TEST_ASSERT_EQ(left_bytes[0], bytes[offset]);
    offset += payload_len;

    TEST_ASSERT_EQ(TAG_PRIMITIVE, read_u32(bytes, offset));
    offset += 4;
    child_len = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT(child_len >= 4);
    payload_len = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(right_payload.length, payload_len);
    TEST_ASSERT_EQ(right_bytes[0], bytes[offset]);
    TEST_ASSERT_EQ(right_bytes[1], bytes[offset + 1]);
    offset += payload_len;

    TEST_ASSERT_EQ(TAG_REFERENCE, read_u32(bytes, offset));
    offset += 4;
    child_len = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(sizeof(uint32_t), child_len);
    uint32_t ref_slot = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(1u, ref_slot);

    TEST_ASSERT_EQ(seq_end, offset);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_value_rejects_unknown_tag(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 128));

    uint8_t encoded[32] = {0};
    struct sc_encoded_buffer out = {
        .data = encoded,
        .length = 0,
        .capacity = sizeof(encoded)
    };
    struct sc_value invalid = { NULL, TAG_UNSUPPORTED };

    TEST_ASSERT_EQ(-EINVAL, sc_encode_value(&ctx, &invalid, &out));
    TEST_ASSERT_EQ(0u, out.length);
    TEST_ASSERT_EQ(0u, ctx.transfer_count);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_arraybuffer_copies_payload_and_marks_detached(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 128));

    uint8_t out_buf[128] = {0};
    struct sc_encoded_buffer out = { out_buf, 0, sizeof(out_buf) };

    uint8_t src_bytes[4] = { 1, 2, 3, 4 };
    uint8_t expected[4];
    memcpy(expected, src_bytes, sizeof(src_bytes));
    struct sc_arraybuffer_desc src = { src_bytes, sizeof(src_bytes), 0 };

    TEST_ASSERT_EQ(0, sc_encode_arraybuffer(&ctx, &src, &out));
    TEST_ASSERT(out.length > 0);

    const uint8_t *bytes = out_buf;
    size_t offset = 0;
    TEST_ASSERT_EQ(TAG_ARRAYBUFFER, read_u32(bytes, offset));
    offset += 4;
    uint32_t payload_len = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(sizeof(uint32_t) + sizeof(src_bytes), payload_len);
    uint32_t byte_length = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(src.length, byte_length);
    TEST_ASSERT_EQ(0, memcmp(bytes + offset, expected, sizeof(expected)));

    assert_transfer_entry(&ctx, 0, src_bytes, sizeof(src_bytes), TRANSFER_FLAG_DETACHED);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_arraybuffer_rejects_emsgsize(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 64));

    uint8_t out_buf[8] = {0};
    struct sc_encoded_buffer out = { out_buf, 0, sizeof(out_buf) };
    uint8_t src_bytes[16] = {0};
    struct sc_arraybuffer_desc src = { src_bytes, sizeof(src_bytes), 0 };

    TEST_ASSERT_EQ(-EMSGSIZE, sc_encode_arraybuffer(&ctx, &src, &out));
    TEST_ASSERT_EQ(0u, out.length);
    TEST_ASSERT_EQ(0u, ctx.transfer_count);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_shared_arraybuffer_handles_without_copy(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 128));

    uint8_t out_buf[128] = {0};
    struct sc_encoded_buffer out = { out_buf, 0, sizeof(out_buf) };

    struct sc_shared_arraybuffer_desc sab = {
        .handle = 42,
        .length = 2048,
        .flags = SAB_FLAG_HAS_ATOMICS
    };

    TEST_ASSERT_EQ(0, sc_encode_shared_arraybuffer(&ctx, &sab, &out));

    const uint8_t *bytes = out_buf;
    size_t offset = 0;
    TEST_ASSERT_EQ(TAG_SHARED_ARRAYBUFFER, read_u32(bytes, offset));
    offset += 4;
    uint32_t payload_len = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(sizeof(int32_t) + sizeof(uint32_t) + sizeof(uint32_t), payload_len);
    int32_t handle = (int32_t)read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(sab.handle, handle);
    uint32_t length = read_u32(bytes, offset);
    offset += 4;
    TEST_ASSERT_EQ(sab.length, length);

    assert_transfer_entry(&ctx, 0, (void *)(intptr_t)sab.handle,
                          sab.length, TRANSFER_FLAG_REGISTERED);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_shared_arraybuffer_requires_atomics(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 64));

    uint8_t out_buf[32] = {0};
    struct sc_encoded_buffer out = { out_buf, 0, sizeof(out_buf) };
    struct sc_shared_arraybuffer_desc sab = {
        .handle = 7,
        .length = 128,
        .flags = 0
    };

    TEST_ASSERT_EQ(-EPERM, sc_encode_shared_arraybuffer(&ctx, &sab, &out));
    TEST_ASSERT_EQ(0u, out.length);
    TEST_ASSERT_EQ(0u, ctx.transfer_count);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_postmessage_payload_builds_header(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 512));

    uint8_t out_buf[256] = {0};
    struct sc_encoded_buffer out = { out_buf, 0, sizeof(out_buf) };
    static const uint8_t bytes[] = { 'o', 'k' };
    struct sc_primitive_value prim = { bytes, sizeof(bytes) };
    struct sc_value root = { &prim, TAG_PRIMITIVE };
    struct sc_message_record record = {
        .root = &root,
        .transfer_list = NULL,
        .transfer_count = 0
    };

    TEST_ASSERT_EQ(0, sc_encode_postmessage_payload(&ctx, &record, &out));
    size_t header_len = sizeof(uint32_t) * 2;
    TEST_ASSERT(out.length >= header_len);

    const uint8_t *bytes_out = out_buf;
    uint32_t payload_len = read_u32(bytes_out, 0);
    uint32_t transfer_count = read_u32(bytes_out, sizeof(uint32_t));
    TEST_ASSERT_EQ(record.transfer_count, transfer_count);
    TEST_ASSERT_EQ(out.length - header_len, payload_len);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_encode_postmessage_payload_overflow_returns_emsgsize(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 128));

    uint8_t out_buf[8] = {0};
    struct sc_encoded_buffer out = { out_buf, 0, sizeof(out_buf) };
    static const uint8_t bytes[] = { 1, 2, 3, 4, 5, 6 };
    struct sc_primitive_value prim = { bytes, sizeof(bytes) };
    struct sc_value root = { &prim, TAG_PRIMITIVE };
    struct sc_message_record record = {
        .root = &root,
        .transfer_list = NULL,
        .transfer_count = 0
    };

    TEST_ASSERT_EQ(-EMSGSIZE, sc_encode_postmessage_payload(&ctx, &record, &out));
    TEST_ASSERT_EQ(0u, out.length);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_dispatch_to_worker_writes_and_signals(void)
{
    int queue_pipe[2];
    int signal_pipe[2];
    TEST_ASSERT_EQ(0, pipe(queue_pipe));
    TEST_ASSERT_EQ(0, pipe(signal_pipe));

    struct sc_worker_endpoint worker = {
        .queue_fd = queue_pipe[1],
        .signal_fd = signal_pipe[1],
        .flags = 0
    };

    uint8_t payload_bytes[] = { 'i', 'p', 'c' };
    struct sc_encoded_buffer payload = {
        .data = payload_bytes,
        .length = sizeof(payload_bytes),
        .capacity = sizeof(payload_bytes)
    };
    struct sc_context ctx = {0};

    TEST_ASSERT_EQ(0, sc_dispatch_to_worker(&ctx, &worker, &payload));

    uint8_t queue_buf[8] = {0};
    ssize_t n = read(queue_pipe[0], queue_buf, sizeof(queue_buf));
    TEST_ASSERT_EQ((ssize_t)payload.length, n);
    TEST_ASSERT_EQ(0, memcmp(queue_buf, payload_bytes, payload.length));

    uint8_t signal_byte = 0;
    TEST_ASSERT_EQ(1, read(signal_pipe[0], &signal_byte, 1));
    TEST_ASSERT_EQ(1u, signal_byte);

    close(queue_pipe[0]);
    close(queue_pipe[1]);
    close(signal_pipe[0]);
    close(signal_pipe[1]);
    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_transfer_ports_moves_handles_and_blocks_busy(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 256));

    struct test_port port_state[2] = {
        { .closed = false, .id = 1 },
        { .closed = false, .id = 2 }
    };

    struct sc_transferable_desc ports[2] = {
        { .handle = &port_state[0], .length = sizeof(struct test_port), .flags = 0 },
        { .handle = &port_state[1], .length = sizeof(struct test_port), .flags = 0 }
    };

    TEST_ASSERT_EQ(0, sc_transfer_ports(&ctx, ports, 2));
    TEST_ASSERT_EQ(NULL, ports[0].handle);
    TEST_ASSERT_EQ(NULL, ports[1].handle);
    TEST_ASSERT((ports[0].flags & TRANSFER_FLAG_IN_PORT) != 0);
    TEST_ASSERT((ports[1].flags & TRANSFER_FLAG_IN_PORT) != 0);

    struct sc_transferable_desc busy = {
        .handle = &port_state[0],
        .length = sizeof(struct test_port),
        .flags = TRANSFER_FLAG_IN_PORT
    };
    TEST_ASSERT_EQ(-EBUSY, sc_transfer_ports(&ctx, &busy, 1));
    TEST_ASSERT_EQ(&port_state[0], busy.handle);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_commit_transfer_list_finalizes_handles(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 256));

    struct commit_payload payloads[2] = {0};
    struct sc_transferable_desc transfers[2] = {
        { .handle = &payloads[0], .length = sizeof(payloads[0]), .flags = TRANSFER_FLAG_IN_PORT },
        { .handle = &payloads[1], .length = sizeof(payloads[1]), .flags = TRANSFER_FLAG_IN_PORT }
    };
    struct sc_message_record record = {
        .root = NULL,
        .transfer_list = transfers,
        .transfer_count = 2
    };

    TEST_ASSERT_EQ(0, sc_commit_transfer_list(&ctx, &record));
    TEST_ASSERT_EQ(NULL, transfers[0].handle);
    TEST_ASSERT_EQ(NULL, transfers[1].handle);
    TEST_ASSERT((transfers[0].flags & TRANSFER_FLAG_COMMITTED) != 0);
    TEST_ASSERT((transfers[1].flags & TRANSFER_FLAG_COMMITTED) != 0);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

static void test_sc_commit_transfer_list_rolls_back_on_failure(void)
{
    struct sc_context ctx;
    TEST_ASSERT_EQ(0, sc_context_init(&ctx, 256));

    struct commit_payload payloads[2] = {0};
    struct sc_transferable_desc transfers[2] = {
        { .handle = &payloads[0], .length = sizeof(payloads[0]), .flags = TRANSFER_FLAG_IN_PORT },
        { .handle = &payloads[1], .length = sizeof(payloads[1]),
          .flags = TRANSFER_FLAG_IN_PORT | TRANSFER_FLAG_FAIL_COMMIT }
    };
    struct sc_message_record record = {
        .root = NULL,
        .transfer_list = transfers,
        .transfer_count = 2
    };

    TEST_ASSERT_EQ(-EIO, sc_commit_transfer_list(&ctx, &record));
    TEST_ASSERT_EQ(&payloads[0], transfers[0].handle);
    TEST_ASSERT_EQ(&payloads[1], transfers[1].handle);
    TEST_ASSERT((transfers[0].flags & TRANSFER_FLAG_COMMITTED) == 0);

    TEST_ASSERT_EQ(0, sc_context_free(&ctx));
}

int main(void)
{
    RUN_TEST(test_sc_context_init_zeroes_arena);
    RUN_TEST(test_sc_context_init_enomem_preserves_state);
    RUN_TEST(test_sc_context_register_transferable_records_handle);
    RUN_TEST(test_sc_context_register_transferable_duplicate_returns_eexist);
    RUN_TEST(test_sc_context_free_idempotent);
    RUN_TEST(test_sc_encode_value_depth_first_identity);
    RUN_TEST(test_sc_encode_value_rejects_unknown_tag);
    RUN_TEST(test_sc_encode_arraybuffer_copies_payload_and_marks_detached);
    RUN_TEST(test_sc_encode_arraybuffer_rejects_emsgsize);
    RUN_TEST(test_sc_encode_shared_arraybuffer_handles_without_copy);
    RUN_TEST(test_sc_encode_shared_arraybuffer_requires_atomics);
    RUN_TEST(test_sc_encode_postmessage_payload_builds_header);
    RUN_TEST(test_sc_encode_postmessage_payload_overflow_returns_emsgsize);
    RUN_TEST(test_sc_dispatch_to_worker_writes_and_signals);
    RUN_TEST(test_sc_transfer_ports_moves_handles_and_blocks_busy);
    RUN_TEST(test_sc_commit_transfer_list_finalizes_handles);
    RUN_TEST(test_sc_commit_transfer_list_rolls_back_on_failure);
    return TEST_SUMMARY();
}
