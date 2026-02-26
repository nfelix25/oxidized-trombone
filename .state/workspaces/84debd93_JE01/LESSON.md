## Loop Motivation

Stubs prepared: loop_init_state.
```c
#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>

#define LOOP_INVALID_DEADLINE UINT64_MAX

typedef void (*loop_work_cb)(void *arg);

struct loop_timer {
    uint64_t deadline_ns;
    loop_work_cb cb;
};

struct loop_queue_entry {
    loop_work_cb cb;
    void *arg;
};

struct loop_handle {
    int fd;
    int closing;
};

struct loop_state {
    struct loop_timer *timer_heap;
    size_t timer_count;
    size_t timer_capacity;
    uint64_t next_wakeup_ns;
    struct loop_queue_entry *check_queue;
    size_t check_head, check_tail;
    struct loop_queue_entry *close_queue;
    size_t close_head, close_tail;
    struct loop_handle *pending_handles;
};

void bootstrap_loop(struct loop_state *state,
                    struct loop_timer *timers,
                    size_t timer_capacity,
                    struct loop_queue_entry *check_entries,
                    struct loop_queue_entry *close_entries)
{
    memset(state, 0, sizeof(*state));
    state->timer_heap = timers;
    state->timer_capacity = timer_capacity;
    state->next_wakeup_ns = LOOP_INVALID_DEADLINE;
    state->check_queue = check_entries;
    state->close_queue = close_entries;
}

int main(void)
{
    struct loop_state state;
    struct loop_timer timers[8];
    struct loop_queue_entry check_entries[8];
    struct loop_queue_entry close_entries[8];
    bootstrap_loop(&state, timers, 8, check_entries, close_entries);
    printf("next wakeup: %llu\n", (unsigned long long)state.next_wakeup_ns);
    return 0;
}
```
This snippet demonstrates why single-threaded multiplexing must begin from a deterministic baseline: every pointer, counter, and sentinel deadline is cleared before the loop ever processes timers, polls, or cleanup work. By zeroing the loop state and explicitly seeding `next_wakeup_ns` with `LOOP_INVALID_DEADLINE`, the runtime guarantees that the very first call to `clock_gettime` or `epoll_wait` is bounded by known data, not stale stack garbage. Initializing the ring buffers for check and close phases up front also mirrors libuv’s promise that callbacks will enqueue in FIFO order without heap allocations inside the hot path. Deterministic bootstrap code like this is what lets higher-order JavaScript constructs trust that timer registration, I/O polling, and deferred cleanup will not starve one another before the loop even spins. Now implement: loop_init_state.

## Monotonic Timer Heap

Stubs prepared: schedule_timer.
```c
#include <stdio.h>
#include <stdint.h>
#include <time.h>

#define LOOP_INVALID_DEADLINE UINT64_MAX

typedef void (*loop_work_cb)(void *arg);

struct loop_timer {
    uint64_t deadline_ns;
    uint64_t repeat_ns;
    loop_work_cb cb;
    void *cb_arg;
};

struct loop_state {
    struct loop_timer timers[8];
    size_t timer_count;
    uint64_t next_wakeup_ns;
};

static uint64_t monotonic_now_ns(void)
{
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return (uint64_t)ts.tv_sec * 1000000000ull + (uint64_t)ts.tv_nsec;
}

static void heap_sift_up(struct loop_timer *heap, size_t child)
{
    while (child > 0) {
        size_t parent = (child - 1u) / 2u;
        if (heap[parent].deadline_ns <= heap[child].deadline_ns) {
            break;
        }
        struct loop_timer tmp = heap[parent];
        heap[parent] = heap[child];
        heap[child] = tmp;
        child = parent;
    }
}

static uint64_t enqueue_timer(struct loop_state *state,
                              uint64_t delay_ns,
                              loop_work_cb cb,
                              void *arg)
{
    uint64_t due = monotonic_now_ns() + delay_ns;
    struct loop_timer *node = &state->timers[state->timer_count];
    node->deadline_ns = due;
    node->repeat_ns = 0;
    node->cb = cb;
    node->cb_arg = arg;
    heap_sift_up(state->timers, state->timer_count);
    state->timer_count++;
    state->next_wakeup_ns = state->timers[0].deadline_ns;
    return state->next_wakeup_ns;
}

static void log_cb(void *arg)
{
    const char *label = arg;
    printf("timer %s armed\n", label);
}

int main(void)
{
    struct loop_state state = { .timer_count = 0, .next_wakeup_ns = LOOP_INVALID_DEADLINE };
    enqueue_timer(&state, 5 * 1000000ull, log_cb, "slow");
    uint64_t next = enqueue_timer(&state, 1 * 1000000ull, log_cb, "fast");
    printf("earliest deadline: %llu\n", (unsigned long long)next);
    return 0;
}
```
This example builds a fixed-size timer heap backed by CLOCK_MONOTONIC so every setTimeout-style registration is ordered by absolute nanoseconds. `monotonic_now_ns` avoids `CLOCK_REALTIME` skew, while `heap_sift_up` performs the minimal parent swap to keep the smallest deadline at index 0. `enqueue_timer` mirrors the eventual `schedule_timer` stub: compute `due` by adding the caller’s delay to the monotonic timestamp, stash the callback and argument in the next free slot, sift toward the root, and refresh `next_wakeup_ns`.

In `main`, inserting a slow timer followed by a fast one still reports the faster deadline because the heap enforces deterministic ordering independent of call sequence. Returning the updated `next_wakeup_ns` allows the loop to clamp `epoll_wait` immediately, guaranteeing that timers cannot drift later than pending I/O. Because pushes run in O(log n) and use only monotonic time, CPU-bound callbacks cannot starve later registrations or observe time going backwards. Now implement: schedule_timer.

## Drain Timers First

Stubs prepared: drain_expired_timers.
```c
#include <stdint.h>
#include <stdio.h>
#include <stdbool.h>

#define LOOP_INVALID_DEADLINE UINT64_MAX
#define LOOP_TIMER_FLAG_REPEAT 0x1u

typedef void (*loop_work_cb)(void *arg);

struct loop_timer {
    uint64_t deadline_ns;
    uint64_t repeat_ns;
    loop_work_cb cb;
    void *cb_arg;
    uint32_t flags;
};

struct loop_state {
    struct loop_timer heap[8];
    size_t count;
    uint64_t next_wakeup_ns;
};

static void heap_swap(struct loop_timer *a, struct loop_timer *b)
{
    struct loop_timer tmp = *a;
    *a = *b;
    *b = tmp;
}

static void sift_down(struct loop_timer *heap, size_t count, size_t idx)
{
    while (true) {
        size_t left = 2 * idx + 1, right = left + 1, smallest = idx;
        if (left < count && heap[left].deadline_ns < heap[smallest].deadline_ns) {
            smallest = left;
        }
        if (right < count && heap[right].deadline_ns < heap[smallest].deadline_ns) {
            smallest = right;
        }
        if (smallest == idx) {
            break;
        }
        heap_swap(&heap[idx], &heap[smallest]);
        idx = smallest;
    }
}

static void sift_up(struct loop_timer *heap, size_t idx)
{
    while (idx > 0) {
        size_t parent = (idx - 1u) / 2u;
        if (heap[parent].deadline_ns <= heap[idx].deadline_ns) {
            break;
        }
        heap_swap(&heap[parent], &heap[idx]);
        idx = parent;
    }
}

size_t drain_ready_timers(struct loop_state *state, uint64_t now_ns)
{
    size_t ran = 0;
    while (state->count && state->heap[0].deadline_ns <= now_ns) {
        struct loop_timer fired = state->heap[0];
        state->heap[0] = state->heap[state->count - 1];
        state->count--;
        sift_down(state->heap, state->count, 0);
        fired.cb(fired.cb_arg);
        ran++;
        if ((fired.flags & LOOP_TIMER_FLAG_REPEAT) && fired.repeat_ns) {
            fired.deadline_ns += fired.repeat_ns;
            state->heap[state->count] = fired;
            sift_up(state->heap, state->count);
            state->count++;
        }
    }
    state->next_wakeup_ns = state->count ? state->heap[0].deadline_ns : LOOP_INVALID_DEADLINE;
    return ran;
}

static void log_cb(void *arg)
{
    puts(arg);
}

int main(void)
{
    struct loop_state state = {.count = 0, .next_wakeup_ns = LOOP_INVALID_DEADLINE};
    state.heap[state.count++] = (struct loop_timer){.deadline_ns = 1, .repeat_ns = 0, .cb = log_cb, .cb_arg = "expired", .flags = 0};
    state.heap[state.count++] = (struct loop_timer){.deadline_ns = 5, .repeat_ns = 2, .cb = log_cb, .cb_arg = "repeat", .flags = LOOP_TIMER_FLAG_REPEAT};
    sift_down(state.heap, state.count, 0);
    size_t ran = drain_ready_timers(&state, 3);
    printf("ran %zu callbacks, next deadline %llu\n", ran, (unsigned long long)state.next_wakeup_ns);
    return 0;
}
```
Even in a single-threaded runtime, timers can outrun I/O readiness unless you empty the heap before calling `epoll_wait`. `drain_ready_timers` mirrors the required stub: pop the root while its deadline is `<= now_ns`, execute the callback, then repair the heap by moving the last node to the root and sifting down. Repeating timers stay deterministic by adding `repeat_ns` to the fired deadline and pushing the updated node back through a `sift_up`, ensuring the rearmed alarm cannot leapfrog newer registrations. Updating `next_wakeup_ns` to either the new root deadline or `LOOP_INVALID_DEADLINE` communicates the exact delta poll should clamp against, so CPU-bound callbacks never stall an imminent timer. The `main` harness proves expired callbacks run immediately, the repeating timer requeues for the next period, and the loop retains the earliest outstanding deadline for the poll phase. Now implement: drain_expired_timers.

## Epoll Poll Phase

Stubs prepared: poll_io_events.
```c
#include <stdio.h>
#include <stdint.h>
#include <sys/epoll.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>

typedef void (*loop_work_cb)(void *arg);

struct loop_state {
    int epoll_fd;
    struct epoll_event ready[8];
    int ready_count;
    uint64_t next_wakeup_ns;
    uint64_t poll_timeout_ns;
    uint64_t last_poll_duration_ns;
};

static uint64_t monotonic_now_ns(void)
{
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return (uint64_t)ts.tv_sec * 1000000000ull + (uint64_t)ts.tv_nsec;
}

static int clamp_timeout_ms(const struct loop_state *state, uint64_t now_ns, int fallback_ms)
{
    if (state->next_wakeup_ns == UINT64_MAX || state->next_wakeup_ns <= now_ns) {
        return 0;
    }
    uint64_t delta_ns = state->next_wakeup_ns - now_ns;
    int deadline_ms = (int)(delta_ns / 1000000ull);
    if (deadline_ms > fallback_ms) {
        deadline_ms = fallback_ms;
    }
    if (deadline_ms < 0) {
        deadline_ms = 0;
    }
    return deadline_ms;
}

int poll_phase_run(struct loop_state *state, int fallback_ms)
{
    uint64_t start_ns = monotonic_now_ns();
    int timeout_ms = clamp_timeout_ms(state, start_ns, fallback_ms);
    struct epoll_event events[8];
    int ready = epoll_wait(state->epoll_fd, events, 8, timeout_ms);
    uint64_t end_ns = monotonic_now_ns();
    state->poll_timeout_ns = (uint64_t)timeout_ms * 1000000ull;
    state->last_poll_duration_ns = end_ns - start_ns;
    if (ready < 0 && errno == EINTR) {
        return 0;
    }
    if (ready < 0) {
        perror("epoll_wait");
        return -1;
    }
    state->ready_count = ready;
    for (int i = 0; i < ready; ++i) {
        state->ready[i] = events[i];
    }
    return ready;
}

int main(void)
{
    int epfd = epoll_create1(0);
    struct epoll_event ev = {.events = EPOLLIN, .data.fd = STDIN_FILENO};
    epoll_ctl(epfd, EPOLL_CTL_ADD, STDIN_FILENO, &ev);
    struct loop_state state = {.epoll_fd = epfd, .next_wakeup_ns = UINT64_MAX};
    printf("ready=%d\n", poll_phase_run(&state, 50));
    close(epfd);
    return 0;
}
```
This example mirrors the poll phase stub: compute a timeout by clamping the next timer deadline against a caller-supplied fallback, then hand that timeout to `epoll_wait`. Capturing both `poll_timeout_ns` and `last_poll_duration_ns` lets later phases detect starvation if callbacks run longer than the budget they were granted. Copying the kernel-returned `epoll_event` array into the loop state decouples the rest of the runtime from the syscall buffer so check and close phases can iterate descriptors without touching `epoll_wait` again. Handling `EINTR` by simply returning zero ready events keeps the loop responsive to signals without discarding pending fds. Because the timeout shrinks to zero whenever a timer is due, I/O readiness can never delay an expired callback, yet idle loops still block efficiently until either descriptors fire or the next monotonic deadline arrives. Now implement: poll_io_events.

## Check Phase Dispatch

Stubs prepared: dispatch_check_callbacks.
```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

typedef void (*loop_work_cb)(void *arg);

struct loop_queue_entry {
    loop_work_cb cb;
    void *arg;
};

#define CHECK_CAP 8

struct loop_state {
    struct loop_queue_entry check_queue[CHECK_CAP];
    size_t check_head;
    size_t check_tail;
};

static size_t dispatch_check_phase(struct loop_state *state)
{
    size_t ran = 0;
    while (state->check_head != state->check_tail) {
        struct loop_queue_entry entry = state->check_queue[state->check_head];
        state->check_head = (state->check_head + 1) % CHECK_CAP;
        entry.cb(entry.arg);
        ran++;
    }
    return ran;
}

static void log_cb(void *arg)
{
    puts(arg);
}

int main(void)
{
    struct loop_state state = {.check_head = 0, .check_tail = 0};
    state.check_queue[state.check_tail++] = (struct loop_queue_entry){log_cb, "poll finished"};
    state.check_tail %= CHECK_CAP;
    state.check_queue[state.check_tail++] = (struct loop_queue_entry){log_cb, "setImmediate"};
    state.check_tail %= CHECK_CAP;
    printf("ran %zu callbacks\n", dispatch_check_phase(&state));
    return 0;
}
```
The check phase models `setImmediate`: callbacks enter a FIFO ring only after the poll phase reports descriptors, ensuring they observe every I/O completion before long-delay timers fire again. `dispatch_check_phase` drains until `head == tail`, invoking each entry exactly once, so newly enqueued setTimeout timers cannot jump ahead—those return to the timer heap for the next turn. Because the ring buffer is advanced modulo `CHECK_CAP`, the code remains allocation-free and safe under wraparound, matching libuv’s guarantee that check callbacks run immediately after poll but before close processing. The `main` harness simulates a single loop turn: an I/O completion queues “poll finished,” a JavaScript `setImmediate` queues another message, and the dispatcher drains both back-to-back, illustrating that these callbacks run later than timers scheduled before poll yet earlier than cleanup work. Now implement: dispatch_check_callbacks.

## Check vs Close

Stubs prepared: queue_close_handles.
```c
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>

#define CHECK_CAP 4
#define CLOSE_CAP 4
#define HANDLE_CAP 2

typedef void (*loop_work_cb)(void *arg);

struct loop_queue_entry { loop_work_cb cb; void *arg; };
struct loop_handle {
    int fd;
    loop_work_cb close_cb;
    void *close_arg;
    bool closing;
};

struct loop_state {
    struct loop_queue_entry check_queue[CHECK_CAP];
    size_t check_head, check_tail;
    struct loop_queue_entry close_queue[CLOSE_CAP];
    size_t close_head, close_tail;
    struct loop_handle handles[HANDLE_CAP];
    size_t pending_handle_count;
};

static size_t dispatch_check_phase(struct loop_state *state)
{
    size_t ran = 0;
    while (state->check_head != state->check_tail) {
        struct loop_queue_entry entry = state->check_queue[state->check_head];
        state->check_head = (state->check_head + 1) % CHECK_CAP;
        entry.cb(entry.arg);
        ran++;
    }
    return ran;
}

static size_t queue_close_phase(struct loop_state *state)
{
    for (size_t i = 0; i < HANDLE_CAP; ++i) {
        if (state->handles[i].closing) {
            state->close_queue[state->close_tail] = (struct loop_queue_entry){ state->handles[i].close_cb, state->handles[i].close_arg };
            state->close_tail = (state->close_tail + 1) % CLOSE_CAP;
            state->handles[i].closing = false;
        }
    }
    size_t ran = 0;
    if (state->pending_handle_count == 0) {
        while (state->close_head != state->close_tail) {
            struct loop_queue_entry entry = state->close_queue[state->close_head];
            state->close_head = (state->close_head + 1) % CLOSE_CAP;
            entry.cb(entry.arg);
            ran++;
        }
    }
    return ran;
}

static void check_cb(void *arg) { puts(arg); }
static void close_cb(void *arg) { puts(arg); }

int main(void)
{
    struct loop_state state = {0};
    state.check_queue[state.check_tail++] = (struct loop_queue_entry){ check_cb, "poll complete" };
    state.handles[0] = (struct loop_handle){ .fd = 3, .close_cb = close_cb, .close_arg = "closing socket", .closing = true };
    state.pending_handle_count = 1;

    printf("check callbacks: %zu\n", dispatch_check_phase(&state));
    printf("close callbacks (busy): %zu\n", queue_close_phase(&state));

    state.pending_handle_count = 0;
    printf("close callbacks (idle): %zu\n", queue_close_phase(&state));
    return 0;
}
```
This sample drives both the check and close phases in a single-threaded loop to expose why they cannot share the same queue. `dispatch_check_phase` drains the ready ring immediately after poll, so the `setImmediate`-style callback prints even while `state.pending_handle_count` remains non-zero. `queue_close_phase` still scans every handle for `closing`, queues their `close_cb` into a dedicated ring, but refuses to invoke them until `pending_handle_count` drops to zero, guaranteeing that no cleanup races an in-flight read or write. On the first call the close queue receives “closing socket” yet returns zero, while the second call (after decrementing `pending_handle_count`) runs the deferred callback and empties the queue. This ordering mirrors libuv’s contract: check callbacks respond to fresh I/O completions, whereas close callbacks respect resource liveness and only execute once the descriptor is quiescent. Keeping the rings separate means stalled I/O cannot block `setImmediate`, and high-frequency check work cannot accidentally free structures still referenced by epoll. Now implement: queue_close_handles.

## Blocking Pitfalls

Stubs prepared: detect_blocking_region.
```c
#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>
#include <time.h>
#include <unistd.h>

struct loop_state {
    uint64_t poll_timeout_ns;
    uint64_t last_poll_duration_ns;
    bool blocking_region_detected;
};

static uint64_t monotonic_now_ns(void)
{
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return (uint64_t)ts.tv_sec * 1000000000ull + (uint64_t)ts.tv_nsec;
}

bool detect_blocking_region(struct loop_state *state,
                            uint64_t callback_duration_ns,
                            uint64_t poll_timeout_ns)
{
    state->poll_timeout_ns = poll_timeout_ns;
    if (callback_duration_ns <= poll_timeout_ns) {
        state->blocking_region_detected = false;
        return false;
    }
    state->blocking_region_detected = true;
    state->last_poll_duration_ns = callback_duration_ns;
    return true;
}

static void cpu_task(void)
{
    usleep(8000); /* simulate blocking syscall */
}

int main(void)
{
    struct loop_state state = {.poll_timeout_ns = 5 * 1000000ull};
    uint64_t start = monotonic_now_ns();
    cpu_task();
    uint64_t elapsed = monotonic_now_ns() - start;
    if (detect_blocking_region(&state, elapsed, state.poll_timeout_ns)) {
        const char msg[] = "handler exceeded budget\n";
        write(STDERR_FILENO, msg, sizeof(msg) - 1);
    }
    return 0;
}
```
The example wraps every callback with a monotonic timestamp so the loop can compare execution time against the poll budget and log with `write(2, ...)`, which remains signal-safe unlike `printf`. Recording both `poll_timeout_ns` and `last_poll_duration_ns` equips later diagnostics to attribute starvation to a specific handler instead of guessing at kernel latency, while keeping the warning path free of heap allocations avoids introducing new blocking hazards. Because the demonstration closes over no descriptors, it also models the requirement that any fd touched inside the handler must be closed or re-armed elsewhere before the close phase to avoid leaks that would pin the loop forever.
```c
bool detect_blocking_region_bad(struct loop_state *state)
{
    uint64_t elapsed_ns;              /* uninitialized */
    char buf[64];
    read(state->poll_timeout_ns, buf, sizeof(buf)); /* may block forever */
    if (elapsed_ns > state->poll_timeout_ns) {
        printf("slow handler\n");   /* signal-unsafe */
        state->blocking_region_detected = 1;
        return true;
    }
    return false;
}
```
Compiling this faulty variant triggers `warning: 'elapsed_ns' is used uninitialized`, and at runtime the blocking `read` on a non-ready fd causes an infinite stall while the leaked descriptor number stored in `poll_timeout_ns` is never closed. Even if it returns, calling `printf` from a signal context can deadlock the libc stdio lock, cascading undefined behaviour across the loop. Resist these bugs by timing callbacks explicitly, comparing against the poll budget you actually handed to `epoll_wait`, closing or re-arming every fd outside of detect_blocking_region, and emitting warnings with async-signal-safe primitives only once per offending callback. Now implement: detect_blocking_region.

## Compose Loop Turn

Stubs prepared: step_loop_once.
```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

struct loop_state {
    size_t timer_runs;
    size_t poll_ready;
    size_t check_runs;
    size_t close_runs;
};

static size_t drain_ready_timers(struct loop_state *state, uint64_t now_ns)
{
    (void)now_ns;
    return state->timer_runs; /* pretend timers fired earlier */
}

static int poll_io_events(struct loop_state *state, int timeout_ms)
{
    (void)timeout_ms;
    return (int)state->poll_ready;
}

static size_t dispatch_check_callbacks(struct loop_state *state)
{
    return state->check_runs;
}

static size_t queue_close_handles(struct loop_state *state)
{
    return state->close_runs;
}

bool step_loop_once_demo(struct loop_state *state, uint64_t now_ns, int poll_timeout_ms)
{
    size_t timers = drain_ready_timers(state, now_ns);
    int ready = poll_io_events(state, poll_timeout_ms);
    size_t checks = dispatch_check_callbacks(state);
    size_t closes = queue_close_handles(state);
    return (timers + ready + checks + closes) != 0;
}

int main(void)
{
    struct loop_state state = {.timer_runs = 1, .poll_ready = 0, .check_runs = 1, .close_runs = 1};
    bool more = step_loop_once_demo(&state, 1000, 5);
    printf("loop turn did work: %s\n", more ? "yes" : "no");
    return 0;
}
```
Every call to `step_loop_once` must drive the canonical timer → poll → check → close order because each phase feeds data into the next: `drain_ready_timers` consumes deadline-ordered callbacks and updates the next poll timeout, `poll_io_events` blocks only until a descriptor or timer demands attention, `dispatch_check_callbacks` flushes `setImmediate` work that depends on fresh I/O, and `queue_close_handles` finally retires handles that the previous phases proved idle. The demo keeps each helper deterministic so the top-level loop can sum their outputs and report whether another turn is necessary, mirroring libuv’s guarantee that the runtime stops only when every queue drains. By structuring the bridge function this way you give higher-level async layers a single entry point that enforces sequencing while still exposing per-phase metrics (like `poll_timeout_ns` or `blocking_region_detected`) for diagnostics. Now implement: step_loop_once.