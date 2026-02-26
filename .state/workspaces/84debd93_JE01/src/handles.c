#include "handles.h"

/* ex-6 — First principle: close callbacks must wait until pending handles finish so cleanup never races in-flight I/O
 * Read: LESSON.md § "Comparison: differentiate check-phase callbacks from close callbacks"
 * Test: test_queue_close_handles_defers_cleanup_until_idle
 * Start here: scan pending_handles for ones marked closing, move them onto close_queue, and run close_cb only when pending_handle_count hits zero */
size_t queue_close_handles(struct loop_state *state)
{
    (void)state;
    return 0;
}

/* ex-7 — First principle: flag blocking regions when handler runtime exceeds the poll timeout budget to surface starvation risks early
 * Read: LESSON.md § "Common pitfalls"
 * Test: test_detect_blocking_region_flags_long_callbacks
 * Start here: compare callback_duration_ns against poll_timeout_ns, flip blocking_region_detected, and fire the warning hook once per offending callback */
bool detect_blocking_region(struct loop_state *state,
                            uint64_t callback_duration_ns,
                            uint64_t poll_timeout_ns)
{
    (void)state;
    (void)callback_duration_ns;
    (void)poll_timeout_ns;
    return false;
}
