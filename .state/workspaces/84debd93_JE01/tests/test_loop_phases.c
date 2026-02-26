#include "test.h"
#include "loop.h"
#include "handles.h"

#include <sys/epoll.h>
#include <string.h>

#define TEST_TIMER_CAP 8
#define TEST_CHECK_CAP 8
#define TEST_CLOSE_CAP 8

struct call_tracker {
    size_t call_count;
};

static char phase_log[16];
static size_t phase_log_len;
static bool g_capture_phase_log;

static void phase_log_reset(void)
{
    phase_log_len = 0;
    memset(phase_log, 0, sizeof(phase_log));
}

static void phase_log_append(char phase)
{
    if (phase_log_len < sizeof(phase_log) - 1) {
        phase_log[phase_log_len++] = phase;
        phase_log[phase_log_len] = '\0';
    }
}

static void maybe_log_phase(char phase)
{
    if (g_capture_phase_log) {
        phase_log_append(phase);
    }
}

static int fake_epoll_return_count;
static int fake_epoll_last_timeout_ms;
static struct epoll_event fake_epoll_events[4];

static void fake_epoll_configure(int return_events)
{
    fake_epoll_return_count = return_events;
    fake_epoll_last_timeout_ms = -1;
    memset(fake_epoll_events, 0, sizeof(fake_epoll_events));
}

int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout_ms)
{
    (void)epfd;
    fake_epoll_last_timeout_ms = timeout_ms;
    maybe_log_phase('P');
    int emit = fake_epoll_return_count;
    if (emit > maxevents) {
        emit = maxevents;
    }
    for (int i = 0; i < emit; ++i) {
        events[i] = fake_epoll_events[i];
    }
    return emit;
}

static void prepare_loop_state(struct loop_state *state,
                               struct loop_timer *timers,
                               size_t timer_capacity,
                               struct loop_queue_entry *check_entries,
                               size_t check_capacity,
                               struct loop_queue_entry *close_entries,
                               size_t close_capacity)
{
    int rc = loop_init_state(state,
                             timers,
                             timer_capacity,
                             check_entries,
                             check_capacity,
                             close_entries,
                             close_capacity);
    TEST_ASSERT_EQ(0, rc);
}

static void noop_cb(void *arg)
{
    (void)arg;
}

static void increment_counter_cb(void *arg)
{
    size_t *counter = arg;
    ++(*counter);
}

static void tracking_timer_cb(void *arg)
{
    struct call_tracker *tracker = arg;
    ++tracker->call_count;
}

static void phase_timer_cb(void *arg)
{
    struct call_tracker *tracker = arg;
    if (tracker) {
        tracker->call_count++;
    }
    maybe_log_phase('T');
}

static void phase_check_cb(void *arg)
{
    struct call_tracker *tracker = arg;
    if (tracker) {
        tracker->call_count++;
    }
    maybe_log_phase('C');
}

static void phase_close_cb(void *arg)
{
    struct call_tracker *tracker = arg;
    if (tracker) {
        tracker->call_count++;
    }
    maybe_log_phase('L');
}

static void test_loop_init_state_seeds_next_wakeup(void)
{
    struct loop_state state = {
        .timer_heap = (struct loop_timer *)0x1,
        .timer_count = 99,
        .timer_capacity = 99,
        .next_wakeup_ns = 42,
        .check_queue = (struct loop_queue_entry *)0x2,
        .check_head = 7,
        .check_tail = 7,
        .check_capacity = 7,
        .close_queue = (struct loop_queue_entry *)0x3,
        .close_head = 3,
        .close_tail = 3,
        .close_capacity = 3,
        .pending_handles = (struct loop_handle *)0x4,
        .pending_handle_count = 5,
        .epoll_fd = -1,
        .poll_timeout_ns = 11,
        .last_poll_duration_ns = 22,
        .blocking_region_detected = true,
    };

    struct loop_timer timers[TEST_TIMER_CAP];
    struct loop_queue_entry check_entries[TEST_CHECK_CAP];
    struct loop_queue_entry close_entries[TEST_CLOSE_CAP];

    int rc = loop_init_state(&state,
                             timers,
                             TEST_TIMER_CAP,
                             check_entries,
                             TEST_CHECK_CAP,
                             close_entries,
                             TEST_CLOSE_CAP);
    TEST_ASSERT_EQ(0, rc);
    TEST_ASSERT(state.timer_heap == timers);
    TEST_ASSERT(state.timer_count == 0);
    TEST_ASSERT(state.timer_capacity == TEST_TIMER_CAP);
    TEST_ASSERT(state.next_wakeup_ns == LOOP_INVALID_DEADLINE);
    TEST_ASSERT(state.check_queue == check_entries);
    TEST_ASSERT(state.check_head == 0);
    TEST_ASSERT(state.check_tail == 0);
    TEST_ASSERT(state.close_queue == close_entries);
    TEST_ASSERT(state.close_head == 0);
    TEST_ASSERT(state.close_tail == 0);
    TEST_ASSERT(state.pending_handles == NULL);
    TEST_ASSERT(state.pending_handle_count == 0);
    TEST_ASSERT(state.poll_timeout_ns == 0);
    TEST_ASSERT(state.last_poll_duration_ns == 0);
    TEST_ASSERT(!state.blocking_region_detected);
}

static void test_schedule_timer_orders_deadlines(void)
{
    struct loop_state state;
    struct loop_timer timers[TEST_TIMER_CAP];
    struct loop_queue_entry check_entries[TEST_CHECK_CAP];
    struct loop_queue_entry close_entries[TEST_CLOSE_CAP];

    prepare_loop_state(&state,
                       timers,
                       TEST_TIMER_CAP,
                       check_entries,
                       TEST_CHECK_CAP,
                       close_entries,
                       TEST_CLOSE_CAP);

    const uint64_t due_a = 3000;
    const uint64_t due_b = 1500;
    const uint64_t due_c = 5000;

    uint64_t earliest = schedule_timer(&state, noop_cb, NULL, due_a, 0, 0);
    TEST_ASSERT_EQ(due_a, earliest);
    earliest = schedule_timer(&state, noop_cb, NULL, due_b, 0, 0);
    TEST_ASSERT_EQ(due_b, earliest);
    earliest = schedule_timer(&state, noop_cb, NULL, due_c, 0, 0);
    TEST_ASSERT_EQ(due_b, earliest);

    TEST_ASSERT(state.timer_count == 3);
    TEST_ASSERT(state.timer_heap[0].deadline_ns == due_b);
    TEST_ASSERT(state.next_wakeup_ns == due_b);
}

static void test_drain_expired_timers_requeues_repeating(void)
{
    struct loop_state state;
    struct loop_timer timers[TEST_TIMER_CAP];
    struct loop_queue_entry check_entries[TEST_CHECK_CAP];
    struct loop_queue_entry close_entries[TEST_CLOSE_CAP];

    prepare_loop_state(&state,
                       timers,
                       TEST_TIMER_CAP,
                       check_entries,
                       TEST_CHECK_CAP,
                       close_entries,
                       TEST_CLOSE_CAP);

    struct call_tracker repeat_tracker = {0};
    struct call_tracker future_tracker = {0};

    state.timer_heap[0].deadline_ns = 100;
    state.timer_heap[0].repeat_ns = 25;
    state.timer_heap[0].cb = tracking_timer_cb;
    state.timer_heap[0].cb_arg = &repeat_tracker;
    state.timer_heap[0].flags = LOOP_TIMER_FLAG_REPEAT;

    state.timer_heap[1].deadline_ns = 400;
    state.timer_heap[1].repeat_ns = 0;
    state.timer_heap[1].cb = tracking_timer_cb;
    state.timer_heap[1].cb_arg = &future_tracker;
    state.timer_heap[1].flags = 0;

    state.timer_count = 2;
    state.next_wakeup_ns = 100;

    size_t ran = drain_expired_timers(&state, 130);
    TEST_ASSERT(ran == 1);
    TEST_ASSERT(repeat_tracker.call_count == 1);
    TEST_ASSERT(future_tracker.call_count == 0);
    TEST_ASSERT(state.timer_count == 2);
    TEST_ASSERT(state.timer_heap[0].deadline_ns == 125);
    TEST_ASSERT(state.next_wakeup_ns == 125);
}

static void test_poll_io_events_clamps_timeout_and_enqueues_ready_fds(void)
{
    struct loop_state state;
    struct loop_timer timers[TEST_TIMER_CAP];
    struct loop_queue_entry check_entries[TEST_CHECK_CAP];
    struct loop_queue_entry close_entries[TEST_CLOSE_CAP];

    prepare_loop_state(&state,
                       timers,
                       TEST_TIMER_CAP,
                       check_entries,
                       TEST_CHECK_CAP,
                       close_entries,
                       TEST_CLOSE_CAP);

    state.next_wakeup_ns = 0;
    state.epoll_fd = 7;
    fake_epoll_configure(2);
    fake_epoll_events[0].data.fd = 4;
    fake_epoll_events[1].data.fd = 5;

    int ready = poll_io_events(&state, 50);
    TEST_ASSERT_EQ(fake_epoll_return_count, ready);
    TEST_ASSERT_EQ(0, fake_epoll_last_timeout_ms);
    TEST_ASSERT(state.poll_timeout_ns == 0);
}

static void test_dispatch_check_callbacks_runs_once_per_turn(void)
{
    struct loop_state state;
    struct loop_timer timers[TEST_TIMER_CAP];
    struct loop_queue_entry check_entries[TEST_CHECK_CAP];
    struct loop_queue_entry close_entries[TEST_CLOSE_CAP];

    prepare_loop_state(&state,
                       timers,
                       TEST_TIMER_CAP,
                       check_entries,
                       TEST_CHECK_CAP,
                       close_entries,
                       TEST_CLOSE_CAP);

    size_t call_counter = 0;
    state.check_queue[0].cb = increment_counter_cb;
    state.check_queue[0].arg = &call_counter;
    state.check_queue[1].cb = increment_counter_cb;
    state.check_queue[1].arg = &call_counter;
    state.check_tail = 2;

    size_t ran = dispatch_check_callbacks(&state);
    TEST_ASSERT(ran == 2);
    TEST_ASSERT(call_counter == 2);
    TEST_ASSERT(state.check_head == state.check_tail);

    ran = dispatch_check_callbacks(&state);
    TEST_ASSERT(ran == 0);
    TEST_ASSERT(call_counter == 2);
}

static void record_close_cb(void *arg)
{
    size_t *counter = arg;
    ++(*counter);
}

static void test_queue_close_handles_defers_cleanup_until_idle(void)
{
    struct loop_state state;
    struct loop_timer timers[TEST_TIMER_CAP];
    struct loop_queue_entry check_entries[TEST_CHECK_CAP];
    struct loop_queue_entry close_entries[TEST_CLOSE_CAP];
    struct loop_handle handles[2];

    prepare_loop_state(&state,
                       timers,
                       TEST_TIMER_CAP,
                       check_entries,
                       TEST_CHECK_CAP,
                       close_entries,
                       TEST_CLOSE_CAP);

    memset(handles, 0, sizeof(handles));
    state.pending_handles = handles;
    state.pending_handle_count = 2;

    size_t close_calls = 0;
    handles[0].closing = true;
    handles[0].close_cb = record_close_cb;
    handles[0].close_arg = &close_calls;

    size_t ran = queue_close_handles(&state);
    TEST_ASSERT(ran == 0);
    TEST_ASSERT(close_calls == 0);
    TEST_ASSERT(state.close_tail == 1);
    TEST_ASSERT(state.close_queue[0].cb == record_close_cb);

    state.pending_handle_count = 0;
    ran = queue_close_handles(&state);
    TEST_ASSERT(ran == 1);
    TEST_ASSERT(close_calls == 1);
    TEST_ASSERT(state.close_head == state.close_tail);
}

static void test_detect_blocking_region_flags_long_callbacks(void)
{
    struct loop_state state;
    memset(&state, 0, sizeof(state));

    bool flagged = detect_blocking_region(&state, 2000000, 1000000);
    TEST_ASSERT(flagged);
    TEST_ASSERT(state.blocking_region_detected);

    flagged = detect_blocking_region(&state, 500000, 1000000);
    TEST_ASSERT(!flagged);
    TEST_ASSERT(state.blocking_region_detected);
}

static void test_step_loop_once_runs_all_phases(void)
{
    struct loop_state state;
    struct loop_timer timers[TEST_TIMER_CAP];
    struct loop_queue_entry check_entries[TEST_CHECK_CAP];
    struct loop_queue_entry close_entries[TEST_CLOSE_CAP];
    struct loop_handle handles[1];

    prepare_loop_state(&state,
                       timers,
                       TEST_TIMER_CAP,
                       check_entries,
                       TEST_CHECK_CAP,
                       close_entries,
                       TEST_CLOSE_CAP);

    phase_log_reset();
    g_capture_phase_log = true;

    const uint64_t now_ns = 1000;
    struct call_tracker timer_tracker = {0};
    struct call_tracker close_tracker = {0};

    schedule_timer(&state, phase_timer_cb, &timer_tracker, now_ns - 100, 0, 0);
    schedule_timer(&state, noop_cb, NULL, now_ns + 5000, 0, 0);

    state.check_queue[state.check_tail].cb = phase_check_cb;
    state.check_queue[state.check_tail].arg = NULL;
    state.check_tail = 1;

    memset(handles, 0, sizeof(handles));
    state.pending_handles = handles;
    state.pending_handle_count = 1;
    handles[0].closing = true;
    handles[0].close_cb = phase_close_cb;
    handles[0].close_arg = &close_tracker;

    size_t queued = queue_close_handles(&state);
    TEST_ASSERT(queued == 0);
    TEST_ASSERT(state.close_tail == 1);

    state.pending_handle_count = 0;
    fake_epoll_configure(0);

    bool more = step_loop_once(&state, now_ns, 5);
    g_capture_phase_log = false;

    TEST_ASSERT(more);
    TEST_ASSERT(timer_tracker.call_count == 1);
    TEST_ASSERT(close_tracker.call_count == 1);
    TEST_ASSERT(strcmp(phase_log, "TPCL") == 0);
    TEST_ASSERT(state.close_head == state.close_tail);
}

int main(void)
{
    RUN_TEST(test_loop_init_state_seeds_next_wakeup);
    RUN_TEST(test_schedule_timer_orders_deadlines);
    RUN_TEST(test_drain_expired_timers_requeues_repeating);
    RUN_TEST(test_poll_io_events_clamps_timeout_and_enqueues_ready_fds);
    RUN_TEST(test_dispatch_check_callbacks_runs_once_per_turn);
    RUN_TEST(test_queue_close_handles_defers_cleanup_until_idle);
    RUN_TEST(test_detect_blocking_region_flags_long_callbacks);
    RUN_TEST(test_step_loop_once_runs_all_phases);
    return TEST_SUMMARY();
}
