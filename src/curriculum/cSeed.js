import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// C: Pointers
// ---------------------------------------------------------------------------
const cPointersNodes = [
  createNode({
    id: "C200",
    title: "Pointer arithmetic, decay, restrict, and const-correctness",
    track: "c-pointers",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["c.ptr_arithmetic_ub", "c.array_decay_confusion", "c.const_ptr_confusion"],
    keywords: ["pointer", "pointer arithmetic", "array decay", "restrict", "const", "const-correctness", "void*", "NULL"],
    language: "c"
  }),
  createNode({
    id: "C201",
    title: "Function pointers, callbacks, and dispatch tables",
    track: "c-pointers",
    depthTarget: "D2",
    prerequisites: ["C200"],
    misconceptionTags: ["c.fn_ptr_syntax_confusion", "c.callback_lifetime_confusion"],
    keywords: ["function pointer", "callback", "dispatch table", "typedef", "qsort", "signal handler", "vtable"],
    language: "c"
  }),
  createNode({
    id: "C202",
    title: "Dynamic memory: malloc, realloc, free, and the arena pattern",
    track: "c-pointers",
    depthTarget: "D2",
    prerequisites: ["C200"],
    misconceptionTags: ["c.double_free_confusion", "c.use_after_free_confusion", "c.arena_lifetime_confusion"],
    keywords: ["malloc", "calloc", "realloc", "free", "arena allocator", "memory leak", "valgrind", "heap"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: IPC (Inter-Process Communication)
// ---------------------------------------------------------------------------
const cIpcNodes = [
  createNode({
    id: "C210",
    title: "fork, waitpid, exec: process lifecycle and zombie/orphan processes",
    track: "c-ipc",
    depthTarget: "D2",
    prerequisites: ["C200"],
    misconceptionTags: ["c.fork_copy_on_write_confusion", "c.zombie_orphan_confusion", "c.exec_replaces_image"],
    keywords: ["fork", "waitpid", "exec", "execve", "zombie", "orphan", "SIGCHLD", "pid", "process"],
    language: "c"
  }),
  createNode({
    id: "C211",
    title: "Pipes and FIFOs: file descriptor management and blocking semantics",
    track: "c-ipc",
    depthTarget: "D2",
    prerequisites: ["C210"],
    misconceptionTags: ["c.pipe_fd_leak_confusion", "c.fifo_blocking_confusion"],
    keywords: ["pipe", "FIFO", "mkfifo", "read", "write", "close", "file descriptor", "blocking", "EOF", "O_NONBLOCK"],
    language: "c"
  }),
  createNode({
    id: "C212",
    title: "Shared memory: mmap MAP_SHARED, shm_open, and shm_unlink",
    track: "c-ipc",
    depthTarget: "D3",
    prerequisites: ["C210"],
    misconceptionTags: ["c.mmap_addr_confusion", "c.shm_unlink_timing_confusion"],
    keywords: ["mmap", "MAP_SHARED", "MAP_ANONYMOUS", "shm_open", "shm_unlink", "munmap", "ftruncate", "POSIX shared memory"],
    language: "c"
  }),
  createNode({
    id: "C213",
    title: "POSIX message queues: mq_open, mq_send, and mq_receive",
    track: "c-ipc",
    depthTarget: "D3",
    prerequisites: ["C210"],
    misconceptionTags: ["c.mq_priority_confusion", "c.mq_unlink_timing_confusion"],
    keywords: ["mq_open", "mq_send", "mq_receive", "mq_close", "mq_unlink", "message queue", "mq_attr", "priority"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: Signals
// ---------------------------------------------------------------------------
const cSignalsNodes = [
  createNode({
    id: "C220",
    title: "Signal handling: sigaction vs signal(), sigset_t, and common signals",
    track: "c-signals",
    depthTarget: "D3",
    prerequisites: ["C210"],
    misconceptionTags: ["c.signal_vs_sigaction_confusion", "c.signal_restart_confusion", "c.async_signal_unsafe"],
    keywords: ["sigaction", "signal", "sigset_t", "SIGINT", "SIGTERM", "SIGKILL", "SIGUSR1", "SA_RESTART", "siginfo_t"],
    language: "c"
  }),
  createNode({
    id: "C221",
    title: "Signal masking: sigprocmask, async-signal-safety, and the self-pipe trick",
    track: "c-signals",
    depthTarget: "D3",
    prerequisites: ["C220"],
    misconceptionTags: ["c.sigprocmask_inherit_confusion", "c.async_signal_unsafe", "c.self_pipe_race_confusion"],
    keywords: ["sigprocmask", "SIG_BLOCK", "SIG_UNBLOCK", "async-signal-safe", "self-pipe trick", "signalfd", "sigsuspend"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: Concurrency (POSIX threads)
// ---------------------------------------------------------------------------
const cConcurrencyNodes = [
  createNode({
    id: "C230",
    title: "POSIX threads: pthread_create, pthread_join, and pthread_detach",
    track: "c-concurrency",
    depthTarget: "D3",
    prerequisites: ["C200"],
    misconceptionTags: ["c.thread_stack_lifetime_confusion", "c.detach_vs_join_confusion"],
    keywords: ["pthread_create", "pthread_join", "pthread_detach", "pthread_t", "thread function", "thread argument", "errno"],
    language: "c"
  }),
  createNode({
    id: "C231",
    title: "Mutex and condition variables: producer-consumer pattern",
    track: "c-concurrency",
    depthTarget: "D3",
    prerequisites: ["C230"],
    misconceptionTags: ["c.pthread_mutex_deadlock", "c.spurious_wakeup_confusion", "c.cond_signal_before_wait"],
    keywords: ["pthread_mutex_t", "pthread_mutex_lock", "pthread_cond_t", "pthread_cond_wait", "pthread_cond_signal", "producer-consumer"],
    language: "c"
  }),
  createNode({
    id: "C232",
    title: "C11 atomics: _Atomic, atomic_fetch_add, and lock-free counters",
    track: "c-concurrency",
    depthTarget: "D3",
    prerequisites: ["C230"],
    misconceptionTags: ["c.atomic_memory_order_confusion", "c.lock_free_not_wait_free"],
    keywords: ["_Atomic", "atomic_fetch_add", "atomic_load", "atomic_store", "memory_order_relaxed", "memory_order_seq_cst", "lock-free"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: Networking (POSIX sockets)
// ---------------------------------------------------------------------------
const cNetworkingNodes = [
  createNode({
    id: "C240",
    title: "TCP sockets: socket, bind, listen, accept, connect — echo server",
    track: "c-networking",
    depthTarget: "D2",
    prerequisites: ["C200"],
    misconceptionTags: ["c.socket_close_vs_shutdown", "c.bind_already_in_use_confusion"],
    keywords: ["socket", "bind", "listen", "accept", "connect", "send", "recv", "TCP", "sockaddr_in", "htons", "inet_pton"],
    language: "c"
  }),
  createNode({
    id: "C241",
    title: "I/O multiplexing: select, poll, epoll, O_NONBLOCK, and event loops",
    track: "c-networking",
    depthTarget: "D3",
    prerequisites: ["C240"],
    misconceptionTags: ["c.select_fd_set_reuse_confusion", "c.epoll_edge_vs_level_confusion"],
    keywords: ["select", "poll", "epoll", "epoll_create", "epoll_ctl", "epoll_wait", "O_NONBLOCK", "fcntl", "event loop", "EPOLLIN"],
    language: "c"
  }),
  createNode({
    id: "C242",
    title: "UDP sockets: sendto, recvfrom, and datagram echo",
    track: "c-networking",
    depthTarget: "D2",
    prerequisites: ["C240"],
    misconceptionTags: ["c.udp_no_connection_confusion", "c.recvfrom_peer_addr"],
    keywords: ["UDP", "SOCK_DGRAM", "sendto", "recvfrom", "datagram", "connectionless", "broadcast", "multicast"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// Graph assembly
// ---------------------------------------------------------------------------

const nodes = [
  ...cPointersNodes,
  ...cIpcNodes,
  ...cSignalsNodes,
  ...cConcurrencyNodes,
  ...cNetworkingNodes
];

const tracks = {
  "c-pointers": {
    id: "c-pointers",
    title: "C Pointers and Memory",
    nodeIds: cPointersNodes.map((n) => n.id)
  },
  "c-ipc": {
    id: "c-ipc",
    title: "C Inter-Process Communication",
    nodeIds: cIpcNodes.map((n) => n.id)
  },
  "c-signals": {
    id: "c-signals",
    title: "C Signal Handling",
    nodeIds: cSignalsNodes.map((n) => n.id)
  },
  "c-concurrency": {
    id: "c-concurrency",
    title: "C POSIX Threads and Concurrency",
    nodeIds: cConcurrencyNodes.map((n) => n.id)
  },
  "c-networking": {
    id: "c-networking",
    title: "C POSIX Networking",
    nodeIds: cNetworkingNodes.map((n) => n.id)
  }
};

export const cCurriculum = createCurriculumGraph(nodes, tracks);
