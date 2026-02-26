#include "loop.h"

/* ex-4 — First principle: epoll_wait must block only until either descriptors are ready or the next timer deadline arrives
 * Read: LESSON.md § "Worked example: implement poll phase around epoll_wait(2)"
 * Test: test_poll_io_events_clamps_timeout_and_enqueues_ready_fds
 * Start here: clamp timeout_ms against next_wakeup_ns, call epoll_wait(2), and push notified callbacks into the ready list */
int poll_io_events(struct loop_state *state, int timeout_ms)
{
    (void)state;
    (void)timeout_ms;
    return 0;
}

/* ex-5 — First principle: check-phase callbacks must run immediately after poll completion to model setImmediate semantics
 * Read: LESSON.md § "Worked example: contrast setTimeout vs setImmediate"
 * Test: test_dispatch_check_callbacks_runs_once_per_turn
 * Start here: drain the check_queue ring buffer in FIFO order and invoke each callback exactly once */
size_t dispatch_check_callbacks(struct loop_state *state)
{
    (void)state;
    return 0;
}
