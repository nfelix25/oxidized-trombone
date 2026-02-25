High-throughput network daemons live or die by how efficiently they churn through POSIX `read()` buffers. Every extra copy between kernel-provided bytes and user-level parsers increases cache pressure and latency, so systems engineers lean on pointer arithmetic to carve zero-copy slices of the exact payload regions they need. Picture an edge proxy that batches TLS records arriving over a non-blocking socket. It pulls as many bytes as possible into a pre-allocated window, then advances lightweight cursors that mark frame boundaries without ever reallocating. That approach only works if you can reason precisely about how far each cursor sits from the base of the buffer and whether a micro-slice stays inside the data returned by the last syscall. ```c
#include <unistd.h>
#include <stddef.h>
#include <stdint.h>

ssize_t fill_window(int fd, uint8_t *buf, size_t cap)
{
    ssize_t bytes = read(fd, buf, cap);
    if (bytes <= 0) {
        return bytes; /* errno already set */
    }

    uint8_t *cursor = buf;
    uint8_t *limit = buf + bytes;
    while (cursor + 64 <= limit) {
        process_frame(cursor, 64); /* zero-copy slice */
        cursor += 64;              /* pointer arithmetic drives batching */
    }
    stash_partial(cursor, (size_t)(limit - cursor));
    return bytes;
}
```Every pointer increment, subtraction, and comparison inside this loop replaces what would otherwise be expensive `memcpy()` calls. Getting comfortable with those operations is the gateway to designing DMA-friendly pipelines, scatter/gather I/O, and buffer pools that keep up with modern NICs.

C’s pointer model is anchored in byte-addressed memory, so every object you hand to POSIX I/O has an addressable first byte, a size in bytes, and a lifetime that must still be active when the kernel touches it. When you call `ssize_t read(int fd, void *buf, size_t count)`, the kernel assumes `buf` points to at least `count` contiguous bytes of live storage. If the buffer was allocated on the stack and the function returns before the data is consumed, dereferencing that pointer later means you are reading from reclaimed stack slots—pure undefined behavior. The same thinking applies to `write()`: the kernel copies from user space only while the call is in flight, so the bytes must remain stable for the duration of the syscall. ```c
#include <unistd.h>
#include <stdint.h>
#include <sys/uio.h>

ssize_t read_frame(int fd, uint8_t *storage, size_t cap)
{
    if (cap < 1500) {
        return -1; /* reject undersized lifetime */
    }

    ssize_t n = read(fd, storage, cap);
    if (n <= 0) {
        return n;
    }

    /* safe: storage still lives, and every byte up to n-1 was written */
    return write(STDOUT_FILENO, storage, (size_t)n);
}
```Notice how both `read()` and `write()` receive explicit byte counts; neither API infers length from the pointer itself. Keeping track of which object a pointer came from, how many bytes were promised, and whether that storage still exists is the bedrock for the arithmetic-heavy techniques we’ll need later.

C17 6.5.6 only blesses pointer arithmetic when the operands refer to elements of the same array object (or the sentinel one-past-the-end). Adding an integer `n` to `T *p` conceptually walks `n` slots of size `sizeof(T)`; if the walk escapes the allocation the behavior is undefined even before you dereference. Subtracting two compatible pointers yields a `ptrdiff_t`, a signed difference type large enough to describe how many elements separate them. That result is only meaningful when both pointers originated from the same live array, making `ptrdiff_t` the canonical way to talk about cursor gaps inside POSIX buffers. Pointer comparisons follow the same rule: only perform relational operators on pointers into the same object. Attempting to compare or subtract unrelated pointers, or straying more than one slot past the allocation, forfeits all guarantees. ```c
#include <stddef.h>
#include <stdint.h>

size_t frame_bytes_remaining(uint8_t *base, size_t filled)
{
    uint8_t *cursor = base;
    uint8_t *limit = base + filled; /* valid one-past */
    while ((cursor + 64) <= limit) {
        process_frame(cursor, 64);
        cursor += 64; /* stays within the buffer */
    }
    ptrdiff_t diff = limit - cursor; /* defined: both in same object */
    return (diff >= 0) ? (size_t)diff : 0u;
}
```This snippet keeps every pointer addition inside the `base[0..filled]` allocation, then casts the `ptrdiff_t` difference to an unsigned size only after confirming it is non-negative. That is the disciplined pattern you need whenever you advance cursors through kernel-filled storage: add offsets cautiously, subtract only matching pointers, and treat `ptrdiff_t` as the authoritative measure of safe distance.

At every POSIX boundary, arrays silently decay to pointers, so the callee sees only the address of element zero and must rely on an explicit size argument to bound access. When you pass `uint8_t window[2048]` to `read()`, it becomes `uint8_t *` automatically, preserving element type so pointer arithmetic still advances a byte at a time. Decay does not carry the array’s length, nor does it extend the object’s lifetime—those responsibilities stay with the caller. This is why buffer APIs nearly always take `void *buf, size_t len`: the pointer may come from any array type, but the byte count enforces how much storage is actually valid. If you need to expose only a sub-row of a multi-dimensional array, decay again yields the first element of that row, so you must ensure the subarray remains in scope. ```c
#include <unistd.h>
#include <stdint.h>
#include <stddef.h>

ssize_t recv_payload(int fd, uint8_t (*grid)[512], size_t rows)
{
    if (rows == 0) {
        return -1;
    }

    uint8_t *row0 = grid[0];           /* array-to-pointer decay */
    ssize_t n = read(fd, row0, sizeof(grid[0]));
    if (n <= 0) {
        return n;
    }

    const void *row1_view = grid[1];    /* void* accepts any element type */
    return write(STDOUT_FILENO, row1_view, (size_t)n);
}
```Whenever you cast to `void *`, the element size information disappears entirely, so treat all offsets as raw bytes and reintroduce the correct element type before performing typed arithmetic.

We now turn the rules into practice by walking an `int` buffer filled via `read()` and computing distances between cursors using `ptrdiff_t`. The example below performs one blocking read from a sensor pipe, scans the resulting integers until their cumulative sum breaches a threshold, and reports how many elements were consumed. Every pointer arithmetic step stays inside the allocation, and subtracting pointers only happens when they originate from that same block.
```c
#include <unistd.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <errno.h>

#define SAMPLE_CAP 256
#define TRIPWIRE   1000

int main(void)
{
    static int samples[SAMPLE_CAP];
    ssize_t bytes = read(STDIN_FILENO, samples, sizeof(samples));
    if (bytes < 0) {
        perror("read");
        return 1;
    }
    size_t filled = (size_t)bytes / sizeof(samples[0]);

    int *cursor = samples;
    int *limit  = samples + filled; /* one-past-the-last written element */
    int *trip   = cursor;
    long total  = 0;

    while (cursor < limit && total < TRIPWIRE) {
        total += *cursor;
        cursor += 1; /* advances one int at a time */
    }

    ptrdiff_t consumed = cursor - trip; /* well-defined difference */
    printf("sum=%ld across %td ints\n", total, consumed);

    if (cursor < limit) {
        ptrdiff_t remaining = limit - cursor;
        printf("%td ints remain for later processing\n", remaining);
    }
    return 0;
}
```
Key takeaways: (1) convert the byte count returned by `read()` into an element count before stepping through the buffer, (2) keep a stable `trip` pointer anchored to the same object so the subtraction `cursor - trip` yields an accurate `ptrdiff_t`, and (3) treat the `limit` pointer as the sole guard for every increment, ensuring no cursor walks past the region the kernel actually populated.

`restrict` tells the compiler that, for the lifetime of a pointer, no other pointer will access the same storage. When you decorate memcpy-style helpers with `restrict`, you are promising the same non-overlap preconditions that POSIX’s `memcpy()` requires, letting the optimizer vectorize loads and stores without inserting defensive reloads. In contrast, `memmove()` can tolerate aliases, so it cannot take advantage of `restrict`. The contract matters most inside throughput-critical buffer shuttles where every redundant read burns cache bandwidth. The helper below mirrors the guarantees `read()` consumers often need: the destination and source byte ranges never overlap, the byte count is explicit, and we can compile with `-O3` confident that the compiler will not assume aliasing between `dst` and `src`.
```c
#include <string.h>
#include <stddef.h>
#include <errno.h>

int copy_frame(void *restrict dst,
               const void *restrict src,
               size_t len)
{
    const unsigned char *s = src;
    unsigned char *d = dst;
    if (!dst || !src) {
        return EINVAL;
    }
    if ((d <= s && d + len > s) || (s <= d && s + len > d)) {
        return EOVERFLOW; /* would violate restrict */
    }
    memcpy(d, s, len);
    return 0;
}
```
By policing overlaps up front, the function keeps the `restrict` promise intact, matching the model of high-speed logging daemons that copy snapshot buffers into disjoint ring slots before dispatching to worker threads.

`const` can bind either the data a pointer sees or the pointer value itself, and POSIX-facing wrappers need both flavors to model shared read-only buffers. A *pointer-to-const* (`const uint8_t *p`) forbids mutating the bytes but lets the pointer move; a *const pointer* (`uint8_t * const p`) freezes the address while still allowing writes through it. When you map a diagnostics page with `PROT_READ`, you should publish a pointer-to-const so callers cannot scribble over kernel-owned bytes, yet you may still keep a const pointer to track the base of a window that must never retarget. ```c
#include <sys/mman.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

struct readonly_slice {
    const uint8_t *data;   /* pointer-to-const: data immutable */
    size_t length;
};

static uint8_t * const snapshot_base = (uint8_t *)0x7f0000000000ULL;

struct readonly_slice expose_ro_window(const uint8_t *page,
                                       size_t page_len,
                                       size_t offset,
                                       size_t span)
{
    if (offset + span > page_len) {
        return (struct readonly_slice){NULL, 0};
    }
    const uint8_t *cursor = page + offset; /* cursor may move */
    return (struct readonly_slice){cursor, span};
}

void log_first_byte(const struct readonly_slice *view)
{
    if (view->data && view->length) {
        printf("0x%02x\n", view->data[0]);
    }
}
```
Here `page` points to immutable shared memory, so the wrapper only exposes const-qualified views, while `snapshot_base` remains a const pointer anchoring bookkeeping for the mapping address. This split lets you build layered APIs where writes are statically rejected yet pointer values stay stable enough to coordinate DMA fences and cache invalidations.

Scatter/gather reads let a daemon refill cache-friendly windows in one syscall while keeping metadata const so scheduling logic cannot accidentally retarget buffers mid-flight. Each descriptor records a `uint8_t *restrict` destination plus the length that `readv()` should honor, and the table of descriptors itself is passed as `const struct span *restrict` to guarantee the helper never alters layout. Before hitting the kernel we must prove the windows are disjoint so the `restrict` promises stay true; otherwise the compiler could vectorize overlapping stores and corrupt the stream.
```c
#include <sys/uio.h>
#include <unistd.h>
#include <stdint.h>
#include <stddef.h>
#include <errno.h>
#include <stdio.h>

#define MAX_SPANS 4

struct span {
    uint8_t *restrict dst;
    size_t len;
};

static int spans_disjoint(const struct span *restrict spans, size_t count)
{
    for (size_t i = 0; i < count; ++i) {
        const uint8_t *start_i = spans[i].dst;
        const uint8_t *end_i = start_i + spans[i].len;
        for (size_t j = i + 1; j < count; ++j) {
            const uint8_t *start_j = spans[j].dst;
            const uint8_t *end_j = start_j + spans[j].len;
            if (!(end_i <= start_j || end_j <= start_i)) {
                return 0;
            }
        }
    }
    return 1;
}

ssize_t read_scatter(int fd,
                     const struct span *restrict spans,
                     size_t count)
{
    if (!spans || count == 0 || count > MAX_SPANS) {
        errno = EINVAL;
        return -1;
    }
    if (!spans_disjoint(spans, count)) {
        errno = EOVERFLOW;
        return -1;
    }

    struct iovec vecs[MAX_SPANS];
    for (size_t i = 0; i < count; ++i) {
        vecs[i].iov_base = spans[i].dst;
        vecs[i].iov_len = spans[i].len;
    }

    ssize_t bytes = readv(fd, vecs, (int)count);
    if (bytes < 0) {
        perror("readv");
    }
    return bytes;
}
```
After the call we only inspect the returned byte count; the buffer contents remain mutable via their `restrict` cursors, while the descriptor array stays immutable, making it safe to reuse across event-loop iterations. This pattern mirrors `readv()`-powered TLS terminators that predeclare handshake, payload, and log regions yet refuse to relax aliasing rules, enabling aggressive compiler optimizations without sacrificing const correctness.

Four classic traps wait inside POSIX buffer plumbing. Overrunning the array returned by `read()` triggers AddressSanitizer’s “stack-buffer-overflow” the instant `buf[32]` is touched, because the legal index range is `0..31`. Subtracting unrelated pointers provokes UBSan’s “pointer overflow” diagnostic even before dereference, since `&stack_byte - heap_pool` crosses objects. Returning a decayed pointer to a stack row makes Clang warn with `-Wreturn-stack-address`, and dereferencing it later is a time bomb. Finally, letting an async signal handler mutate a `restrict` cursor breaks the aliasing promise and ThreadSanitizer flags a data race, since the handler runs concurrently with the main loop that assumed exclusive writes. 
```c
#include <unistd.h>
#include <stddef.h>
#include <signal.h>
#include <stdint.h>

ssize_t grab(int fd, uint8_t buf[32]) {
    ssize_t n = read(fd, buf, sizeof buf);
    return buf[32]; /* UB: ASan stack-buffer-overflow */
}

ptrdiff_t nonsensical_gap(void) {
    uint8_t stack_byte;
    extern uint8_t *heap_pool;
    return &stack_byte - heap_pool; /* UBSan pointer overflow */
}

const char *bad_decay(void) {
    char row[16] = "tmp";
    return row; /* clang -Wreturn-stack-address */
}

uint8_t *restrict log_cursor;
void handler(int sig) { (void)sig; log_cursor += 64; } /* TSAN data race */
```
```c
ssize_t grab_safe(int fd, uint8_t buf[32]) {
    ssize_t n = read(fd, buf, sizeof buf);
    if (n <= 0 || (size_t)n > sizeof buf) { return n; }
    return buf[(size_t)n - 1];
}

ptrdiff_t gap_within(const uint8_t *base, size_t len, const uint8_t *cursor) {
    const uint8_t *end = base + len;
    return (cursor >= base && cursor <= end) ? (cursor - base) : -1;
}

const char *stable_decay(const char (*grid)[16], size_t rows, size_t row) {
    return (row < rows) ? grid[row] : NULL;
}

volatile sig_atomic_t bump_requested;
void handler(int sig) { (void)sig; bump_requested = 1; }
void pump_log_cursor(uint8_t *restrict cursor, size_t stride) {
    if (bump_requested) {
        cursor += stride; /* single-threaded update preserves restrict */
        bump_requested = 0;
    }
}
```
Guarding indices, subtracting only within the same object, returning storage that outlives the caller, and confining `restrict` state to signal-safe rendezvous keep these bugs—and their sanitizer screams—out of your labs.

Typed pointers bake element size into every addition, while `void *` is a byte-address only after you cast it. ISO C prohibits arithmetic directly on `void *`, so POSIX interfaces that traffic in erased addresses (`read()`, `write()`, `aio_read()`) require you to cast back to a concrete type before incrementing. The upside of typed pointers is stride safety: advancing `int *` by `+1` always skips exactly `sizeof(int)` bytes, which matches how kernel-filled sensor frames are laid out. The erased `void *` view shines when the same pointer must hop between APIs with differing element types, but you must manually scale offsets. Importantly, qualifiers survive the round-trip: casting `const void *` to `const uint8_t *` preserves immutability, and the `restrict` promise continues to hold so long as you do not create overlapping aliases after the cast.
```c
#include <stddef.h>
#include <stdint.h>

void demo(const void *restrict raw, size_t len)
{
    const uint8_t *restrict bytes = raw;      /* preserves const+restrict */
    for (size_t i = 0; i < len; ++i) {
        uint8_t value = bytes[i];             /* typed stride == 1 byte */
        consume(value);
    }

    const uint8_t *cursor = (const uint8_t *)raw;
    const uint8_t *end = cursor + len;        /* arithmetic now legal */
    const void *one_past = (const void *)end; /* erase again for POSIX */
    submit_buffer(one_past, len);             /* still honors qualifiers */
}
```
Whenever you must compute byte offsets before reintroducing type, cast the `void *` to `unsigned char *` (the only type guaranteed to address individual bytes), perform the arithmetic there, and then cast to the eventual element type. That keeps arithmetic defined while maintaining `const` and `restrict` guarantees across conversions.

Everything we explored—staying inside the original allocation, honoring decay semantics, threading const and restrict—sets the stage for resilient buffer pools and ownership protocols in the upcoming memory-management module. Those pools juggle dozens of outstanding POSIX reads, so the allocator must know, at any instant, which slices remain owned, which can be recycled, and which are quarantined for zero-copy handoff to other threads. Pointer arithmetic underpins that bookkeeping: a pool tag may only compare or subtract cursors tied to the same slab, while const qualifiers document that inspection APIs cannot mutate bytes still in-flight. Restrict gates overlap so reclamation logic never races with DMA completion. Consider the skeleton below, which stitches these guarantees together before we add explicit lifetimes and hazard tracking next lesson:
```c
#include <stddef.h>
#include <stdint.h>

typedef struct {
    uint8_t *restrict base;
    size_t span;
    const uint8_t *cursor;
} pool_slot;

void release_slot(pool_slot *slot, const uint8_t *restrict consumer)
{
    if (consumer >= slot->base && consumer <= slot->base + slot->span) {
        ptrdiff_t used = consumer - slot->base;
        slot->cursor = slot->base + used;
    }
}
```
Here the pool only subtracts pointers that share ownership, records progress through a const view, and keeps the base/destination alias-free, precisely the habits we will generalize when layering reference counts, freelists, and cache-aware reclaimers.