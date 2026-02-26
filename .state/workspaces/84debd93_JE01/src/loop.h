#ifndef LOOP_H
#define LOOP_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

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

struct loop_queue_entry {
    loop_work_cb cb;
    void *arg;
};

struct loop_handle {
    int fd;
    loop_work_cb close_cb;
    void *close_arg;
    bool closing;
};

struct loop_state {
    struct loop_timer *timer_heap;
    size_t timer_count;
    size_t timer_capacity;
    uint64_t next_wakeup_ns;

    struct loop_queue_entry *check_queue;
    size_t check_head;
    size_t check_tail;
    size_t check_capacity;

    struct loop_queue_entry *close_queue;
    size_t close_head;
    size_t close_tail;
    size_t close_capacity;

    struct loop_handle *pending_handles;
    size_t pending_handle_count;

    int epoll_fd;
    uint64_t poll_timeout_ns;
    uint64_t last_poll_duration_ns;
    bool blocking_region_detected;
};

/* ex-1 — First principle: single-threaded multiplexing stays deterministic only if the loop state resets to a known baseline
 * Read: LESSON.md § "Motivation/context"
 * Test: test_loop_init_state_seeds_next_wakeup
 * Start here: zero every counter, wire storage buffers, and set next_wakeup_ns to LOOP_INVALID_DEADLINE */
int loop_init_state(struct loop_state *state,
                    struct loop_timer *timer_storage,
                    size_t timer_capacity,
                    struct loop_queue_entry *check_storage,
                    size_t check_capacity,
                    struct loop_queue_entry *close_storage,
                    size_t close_capacity);

/* ex-2 — First principle: map setTimeout registrations onto a monotonic deadline heap derived from clock_gettime for deterministic ordering
 * Read: LESSON.md § "Monotonic timer heap"
 * Test: test_schedule_timer_orders_deadlines
 * Start here: push the callback into timer_heap via sift-up and return the smallest deadline present */
uint64_t schedule_timer(struct loop_state *state,
                        loop_work_cb cb,
                        void *cb_arg,
                        uint64_t due_ns,
                        uint64_t repeat_ns,
                        uint32_t flags);

/* ex-3 — First principle: drain expired timers before polling so CPU-bound callbacks cannot leapfrog ready I/O
 * Read: LESSON.md § "Drain timers before poll"
 * Test: test_drain_expired_timers_requeues_repeating
 * Start here: pop heap nodes with deadline <= now_ns, invoke cb, and if repeat_ns > 0 reinsert with the updated deadline */
size_t drain_expired_timers(struct loop_state *state, uint64_t now_ns);

/* ex-8 — First principle: compose timers → poll → check → close phases into a single step_loop_once turn
 * Read: LESSON.md § "Compose the phases"
 * Test: test_step_loop_once_runs_all_phases
 * Start here: call drain_expired_timers(), poll_io_events(), dispatch_check_callbacks(), then queue_close_handles() and report if any phase still has work */
bool step_loop_once(struct loop_state *state, uint64_t now_ns, int poll_timeout_ms);

#ifdef __cplusplus
}
#endif

#endif /* LOOP_H */
