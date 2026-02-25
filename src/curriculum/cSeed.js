import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// C: Pointers
// ---------------------------------------------------------------------------
const cPointersNodes = [
  createNode({
    id: "C200a",
    title: "Pointer arithmetic and array decay",
    track: "c-pointers",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["c.ptr_arithmetic_ub", "c.array_decay_confusion"],
    keywords: ["pointer", "pointer arithmetic", "pointer scaling", "array decay", "pointer comparison", "void*", "NULL", "sizeof"],
    language: "c"
  }),
  createNode({
    id: "C200b",
    title: "const and restrict qualifiers: aliasing rules and optimization hints",
    track: "c-pointers",
    depthTarget: "D2",
    prerequisites: ["C200a"],
    misconceptionTags: ["c.const_ptr_confusion"],
    keywords: ["const", "const-correctness", "restrict", "top-level const", "pointer-to-const", "aliasing", "compiler optimization", "restrict alias promise"],
    language: "c"
  }),
  createNode({
    id: "C201",
    title: "Function pointers, callbacks, and dispatch tables",
    track: "c-pointers",
    depthTarget: "D2",
    prerequisites: ["C200b"],
    misconceptionTags: ["c.fn_ptr_syntax_confusion", "c.callback_lifetime_confusion"],
    keywords: ["function pointer", "callback", "dispatch table", "typedef", "qsort", "signal handler", "vtable"],
    language: "c"
  }),
  createNode({
    id: "C202",
    title: "Dynamic memory: malloc, realloc, free, and the arena pattern",
    track: "c-pointers",
    depthTarget: "D2",
    prerequisites: ["C200b"],
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
    prerequisites: ["C200b"],
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
    id: "C212a",
    title: "Anonymous shared memory: mmap MAP_ANONYMOUS|MAP_SHARED between processes",
    track: "c-ipc",
    depthTarget: "D3",
    prerequisites: ["C210", "C301"],
    misconceptionTags: ["c.mmap_addr_confusion"],
    keywords: ["mmap", "MAP_SHARED", "MAP_ANONYMOUS", "anonymous shared memory", "fork shared memory", "munmap", "shared region"],
    language: "c"
  }),
  createNode({
    id: "C212b",
    title: "POSIX named shared memory: shm_open, ftruncate, and shm_unlink",
    track: "c-ipc",
    depthTarget: "D3",
    prerequisites: ["C212a"],
    misconceptionTags: ["c.shm_unlink_timing_confusion"],
    keywords: ["shm_open", "shm_unlink", "ftruncate", "POSIX shared memory", "named shared memory", "IPC", "/dev/shm", "mmap with fd"],
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
    id: "C221a",
    title: "Signal masks: sigprocmask, sigset_t, and blocking signals",
    track: "c-signals",
    depthTarget: "D3",
    prerequisites: ["C220"],
    misconceptionTags: ["c.sigprocmask_inherit_confusion"],
    keywords: ["sigprocmask", "sigset_t", "sigemptyset", "sigaddset", "SIG_BLOCK", "SIG_UNBLOCK", "SIG_SETMASK", "pending signals", "sigsuspend"],
    language: "c"
  }),
  createNode({
    id: "C221b",
    title: "Self-pipe trick: async-signal-safe I/O in event loops",
    track: "c-signals",
    depthTarget: "D3",
    prerequisites: ["C221a"],
    misconceptionTags: ["c.async_signal_unsafe", "c.self_pipe_race_confusion"],
    keywords: ["self-pipe trick", "async-signal-safe", "write in signal handler", "pipe pair", "event loop", "signalfd", "select/poll with signals"],
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
    prerequisites: ["C200b"],
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
    prerequisites: ["C200b"],
    misconceptionTags: ["c.socket_close_vs_shutdown", "c.bind_already_in_use_confusion"],
    keywords: ["socket", "bind", "listen", "accept", "connect", "send", "recv", "TCP", "sockaddr_in", "htons", "inet_pton"],
    language: "c"
  }),
  createNode({
    id: "C241",
    title: "I/O multiplexing: select/poll and O_NONBLOCK",
    track: "c-networking",
    depthTarget: "D3",
    prerequisites: ["C240"],
    misconceptionTags: ["c.select_fd_set_reuse_confusion", "c.poll_revents_confusion"],
    keywords: ["select", "poll", "O_NONBLOCK", "fcntl", "event loop", "POLLIN", "POLLOUT", "non-blocking I/O"],
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
// C: Virtual Memory
// ---------------------------------------------------------------------------
const cVirtualMemoryNodes = [
  createNode({
    id: "C300",
    title: "Address space layout: stack, heap, text, BSS segments",
    track: "c-virtual-memory",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["c.stack_heap_confusion", "c.virtual_vs_physical_confusion"],
    keywords: ["virtual memory", "address space", "stack segment", "heap", "text segment", "BSS", "mmap", "page"],
    language: "c"
  }),
  createNode({
    id: "C301",
    title: "mmap anonymous: allocating pages from the OS",
    track: "c-virtual-memory",
    depthTarget: "D2",
    prerequisites: ["C300"],
    misconceptionTags: ["c.mmap_anonymous_confusion", "c.page_alignment_confusion"],
    keywords: ["mmap", "MAP_ANONYMOUS", "MAP_PRIVATE", "page", "munmap", "sbrk", "brk", "virtual address"],
    language: "c"
  }),
  createNode({
    id: "C302",
    title: "mprotect: RWX page permissions and JIT code generation",
    track: "c-virtual-memory",
    depthTarget: "D3",
    prerequisites: ["C301"],
    misconceptionTags: ["c.mprotect_wx_confusion", "c.executable_page_confusion"],
    keywords: ["mprotect", "PROT_READ", "PROT_WRITE", "PROT_EXEC", "PROT_NONE", "W^X", "JIT", "executable memory", "code generation"],
    language: "c"
  }),
  createNode({
    id: "C303",
    title: "Implementing a bump-pointer allocator on mmap pages",
    track: "c-virtual-memory",
    depthTarget: "D3",
    prerequisites: ["C301", "C202"],
    misconceptionTags: ["c.bump_ptr_alignment_confusion", "c.free_list_coalescing_confusion"],
    keywords: ["bump pointer", "free list", "allocator", "arena", "mmap", "alignment", "fragmentation", "custom allocator"],
    language: "c"
  }),
  createNode({
    id: "C304",
    title: "madvise: MADV_DONTNEED and MADV_WILLNEED hints to the OS",
    track: "c-virtual-memory",
    depthTarget: "D2",
    prerequisites: ["C301"],
    misconceptionTags: ["c.madvise_not_guaranteed_confusion", "c.dontneed_vs_munmap_confusion"],
    keywords: ["madvise", "MADV_DONTNEED", "MADV_WILLNEED", "GC", "page reclaim", "prefetch hint", "memory pressure"],
    language: "c"
  }),
  createNode({
    id: "C305",
    title: "Copy-on-write: why fork() is cheap",
    track: "c-virtual-memory",
    depthTarget: "D2",
    prerequisites: ["C300", "C210"],
    misconceptionTags: ["c.fork_copies_memory_confusion", "c.cow_page_fault_confusion"],
    keywords: ["copy-on-write", "COW", "fork", "page fault", "virtual memory", "page sharing", "memory efficiency"],
    language: "c"
  }),
  createNode({
    id: "C306",
    title: "mlock: preventing GC heap pages from being swapped",
    track: "c-virtual-memory",
    depthTarget: "D2",
    prerequisites: ["C301"],
    misconceptionTags: ["c.mlock_quota_confusion", "c.mlock_vs_mlockall_confusion"],
    keywords: ["mlock", "munlock", "mlockall", "page swap", "latency", "resident set", "GC heap"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: Filesystem
// ---------------------------------------------------------------------------
const cFilesystemNodes = [
  createNode({
    id: "C400a",
    title: "File descriptor basics: open, close, read, write, and the fd table",
    track: "c-filesystem",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["c.fd_integer_confusion"],
    keywords: ["file descriptor", "open", "close", "read", "write", "fd table", "per-process fd", "errno", "O_RDONLY", "O_WRONLY", "O_CREAT"],
    language: "c"
  }),
  createNode({
    id: "C400b",
    title: "dup2 and O_CLOEXEC: fd duplication and exec-time cleanup",
    track: "c-filesystem",
    depthTarget: "D2",
    prerequisites: ["C400a"],
    misconceptionTags: ["c.fd_cloexec_confusion", "c.dup2_vs_dup_confusion"],
    keywords: ["dup2", "dup", "O_CLOEXEC", "FD_CLOEXEC", "fcntl", "close-on-exec", "fd redirect", "stdin redirect", "stdout redirect"],
    language: "c"
  }),
  createNode({
    id: "C401",
    title: "File metadata: stat, fstat, lstat, inodes, and timestamps",
    track: "c-filesystem",
    depthTarget: "D2",
    prerequisites: ["C400b"],
    misconceptionTags: ["c.stat_vs_fstat_confusion", "c.hardlink_inode_confusion"],
    keywords: ["stat", "fstat", "lstat", "inode", "hardlink", "symlink", "timestamp", "st_mode", "st_size"],
    language: "c"
  }),
  createNode({
    id: "C402",
    title: "Directory traversal: opendir, readdir, and recursive walk",
    track: "c-filesystem",
    depthTarget: "D2",
    prerequisites: ["C401"],
    misconceptionTags: ["c.readdir_thread_safety_confusion", "c.dot_dotdot_confusion"],
    keywords: ["opendir", "readdir", "closedir", "dirent", "d_type", "directory walk", "recursion", "scandir"],
    language: "c"
  }),
  createNode({
    id: "C403",
    title: "Atomic file operations: rename-as-swap and safe write patterns",
    track: "c-filesystem",
    depthTarget: "D2",
    prerequisites: ["C400b"],
    misconceptionTags: ["c.rename_not_atomic_confusion", "c.fsync_vs_fdatasync_confusion"],
    keywords: ["rename", "atomic", "safe write", "temp file", "POSIX", "fsync", "fdatasync", "write-then-rename"],
    language: "c"
  }),
  createNode({
    id: "C404",
    title: "Memory-mapped files: file-backed mmap, MAP_SHARED, and msync",
    track: "c-filesystem",
    depthTarget: "D3",
    prerequisites: ["C301", "C400b"],
    misconceptionTags: ["c.mmap_file_size_confusion", "c.msync_vs_fsync_confusion"],
    keywords: ["mmap", "MAP_SHARED", "MAP_PRIVATE", "msync", "file-backed", "shared memory", "ftruncate", "memory-mapped I/O"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: kqueue I/O (macOS-native)
// ---------------------------------------------------------------------------
const cKqueueIoNodes = [
  createNode({
    id: "C500",
    title: "Non-blocking I/O: O_NONBLOCK, fcntl, and EAGAIN semantics",
    track: "c-kqueue-io",
    depthTarget: "D2",
    prerequisites: ["C241"],
    misconceptionTags: ["c.eagain_vs_error_confusion", "c.nonblock_all_fds_confusion"],
    keywords: ["O_NONBLOCK", "fcntl", "EAGAIN", "EWOULDBLOCK", "non-blocking I/O", "F_GETFL", "F_SETFL"],
    language: "c"
  }),
  createNode({
    id: "C501",
    title: "kqueue fundamentals: kevent, EVFILT_READ/WRITE, edge vs level triggered",
    track: "c-kqueue-io",
    depthTarget: "D2",
    prerequisites: ["C500"],
    misconceptionTags: ["c.kqueue_edge_vs_level_confusion", "c.kevent_flags_confusion"],
    keywords: ["kqueue", "kevent", "EVFILT_READ", "EVFILT_WRITE", "EV_ADD", "EV_DELETE", "event loop", "macOS", "edge-triggered", "level-triggered"],
    language: "c"
  }),
  createNode({
    id: "C502",
    title: "kqueue timers: EVFILT_TIMER and high-resolution timers",
    track: "c-kqueue-io",
    depthTarget: "D2",
    prerequisites: ["C501"],
    misconceptionTags: ["c.kqueue_timer_oneshot_confusion", "c.note_mseconds_confusion"],
    keywords: ["EVFILT_TIMER", "kqueue timer", "NOTE_MSECONDS", "NOTE_USECONDS", "NOTE_NSECONDS", "NOTE_ABSOLUTE", "setTimeout", "high-resolution timer"],
    language: "c"
  }),
  createNode({
    id: "C503",
    title: "kqueue process events: EVFILT_PROC and child process monitoring",
    track: "c-kqueue-io",
    depthTarget: "D2",
    prerequisites: ["C501", "C210"],
    misconceptionTags: ["c.evfilt_proc_race_confusion", "c.note_exit_vs_waitpid_confusion"],
    keywords: ["EVFILT_PROC", "NOTE_EXIT", "NOTE_FORK", "NOTE_EXEC", "child process", "kqueue", "libuv", "process monitoring"],
    language: "c"
  }),
  createNode({
    id: "C504",
    title: "kqueue vnode events: EVFILT_VNODE and filesystem watching",
    track: "c-kqueue-io",
    depthTarget: "D2",
    prerequisites: ["C501", "C402"],
    misconceptionTags: ["c.vnode_watch_recursive_confusion", "c.note_rename_vs_delete_confusion"],
    keywords: ["EVFILT_VNODE", "NOTE_WRITE", "NOTE_DELETE", "NOTE_RENAME", "NOTE_ATTRIB", "fs.watch", "file watch", "filesystem events"],
    language: "c"
  }),
  createNode({
    id: "C505",
    title: "Scatter-gather I/O: readv and writev for buffer chains",
    track: "c-kqueue-io",
    depthTarget: "D2",
    prerequisites: ["C400b"],
    misconceptionTags: ["c.iovec_alignment_confusion", "c.writev_partial_write_confusion"],
    keywords: ["readv", "writev", "iovec", "scatter-gather", "buffer chain", "vectored I/O", "preadv", "pwritev"],
    language: "c"
  }),
  createNode({
    id: "C506",
    title: "Unix domain sockets: AF_UNIX for same-machine IPC",
    track: "c-kqueue-io",
    depthTarget: "D2",
    prerequisites: ["C240"],
    misconceptionTags: ["c.unix_socket_path_cleanup_confusion", "c.socketpair_half_close_confusion"],
    keywords: ["AF_UNIX", "unix socket", "IPC", "socketpair", "SOCK_STREAM", "SOCK_DGRAM", "Node.js worker", "abstract socket"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: Advanced Concurrency
// ---------------------------------------------------------------------------
const cAdvancedConcurrencyNodes = [
  createNode({
    id: "C600",
    title: "Thread pool pattern: fixed workers and work queue",
    track: "c-advanced-concurrency",
    depthTarget: "D3",
    prerequisites: ["C230", "C231"],
    misconceptionTags: ["c.thread_pool_queue_overflow_confusion", "c.blocking_task_starves_pool"],
    keywords: ["thread pool", "work queue", "libuv", "UV_THREADPOOL_SIZE", "blocking I/O", "worker thread", "task queue"],
    language: "c"
  }),
  createNode({
    id: "C601",
    title: "Lock-free MPSC queue with C11 atomics",
    track: "c-advanced-concurrency",
    depthTarget: "D3",
    prerequisites: ["C232", "C600"],
    misconceptionTags: ["c.mpsc_aba_confusion", "c.cas_spurious_failure_confusion"],
    keywords: ["MPSC", "lock-free", "compare-exchange", "atomic", "Michael-Scott queue", "CAS", "memory ordering", "producer-consumer"],
    language: "c"
  }),
  createNode({
    id: "C602",
    title: "Thread-local storage: __thread, pthread_key_create, and per-thread GC roots",
    track: "c-advanced-concurrency",
    depthTarget: "D3",
    prerequisites: ["C230"],
    misconceptionTags: ["c.tls_fork_confusion", "c.pthread_key_destructor_confusion"],
    keywords: ["thread-local", "__thread", "_Thread_local", "pthread_key_create", "pthread_getspecific", "pthread_setspecific", "GC roots", "TLS"],
    language: "c"
  }),
  createNode({
    id: "C603",
    title: "Condition variable park/unpark: efficient thread sleeping",
    track: "c-advanced-concurrency",
    depthTarget: "D2",
    prerequisites: ["C231"],
    misconceptionTags: ["c.spurious_wakeup_confusion", "c.cond_signal_lost_wakeup"],
    keywords: ["pthread_cond_wait", "park", "unpark", "spurious wakeup", "condition variable", "futex", "thread sleep", "wait loop"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: Dynamic Linking
// ---------------------------------------------------------------------------
const cDynamicLinkingNodes = [
  createNode({
    id: "C700",
    title: "dlopen and dlsym: loading shared libraries at runtime",
    track: "c-dynamic-linking",
    depthTarget: "D2",
    prerequisites: [],
    misconceptionTags: ["c.dlopen_rtld_lazy_confusion", "c.dlsym_null_handle_confusion"],
    keywords: ["dlopen", "dlsym", "dlclose", "dlerror", "RTLD_LAZY", "RTLD_NOW", "shared library", "dylib", "plugin"],
    language: "c"
  }),
  createNode({
    id: "C701",
    title: "DYLD_INSERT_LIBRARIES: macOS library injection",
    track: "c-dynamic-linking",
    depthTarget: "D3",
    prerequisites: ["C700"],
    misconceptionTags: ["c.dyld_sip_confusion", "c.interpose_vs_override_confusion"],
    keywords: ["DYLD_INSERT_LIBRARIES", "library injection", "symbol interposition", "macOS", "LD_PRELOAD", "DYLD_INTERPOSE", "dyld"],
    language: "c"
  }),
  createNode({
    id: "C702",
    title: "Symbol visibility: __attribute__((visibility)) and stable C ABI",
    track: "c-dynamic-linking",
    depthTarget: "D2",
    prerequisites: ["C700"],
    misconceptionTags: ["c.default_visibility_confusion", "c.abi_vs_api_confusion"],
    keywords: ["symbol visibility", "visibility hidden", "visibility default", "C ABI", "linker", "namespace", "__attribute__", "exported symbol"],
    language: "c"
  }),
  createNode({
    id: "C703",
    title: "N-API pattern: versioned stable ABI for native addons",
    track: "c-dynamic-linking",
    depthTarget: "D3",
    prerequisites: ["C700", "C702"],
    misconceptionTags: ["c.napi_vs_nan_confusion", "c.napi_handle_scope_confusion"],
    keywords: ["N-API", "napi_value", "napi_env", "native addon", "stable ABI", "Node.js", "napi_create_function", "napi_module"],
    language: "c"
  })
];

// ---------------------------------------------------------------------------
// C: Subprocess and Signals
// ---------------------------------------------------------------------------
const cSubprocessSignalsNodes = [
  createNode({
    id: "C800",
    title: "posix_spawn: safely spawning child processes",
    track: "c-subprocess-signals",
    depthTarget: "D2",
    prerequisites: ["C210"],
    misconceptionTags: ["c.posix_spawn_vs_fork_exec_confusion", "c.spawn_file_actions_confusion"],
    keywords: ["posix_spawn", "posix_spawnp", "posix_spawn_file_actions", "posix_spawnattr", "child process", "spawn", "fork-exec"],
    language: "c"
  }),
  createNode({
    id: "C801",
    title: "Pipe-based IPC with children: stdin/stdout/stderr redirection",
    track: "c-subprocess-signals",
    depthTarget: "D2",
    prerequisites: ["C211", "C800"],
    misconceptionTags: ["c.pipe_deadlock_confusion", "c.child_stdout_buffering_confusion"],
    keywords: ["pipe", "stdin redirect", "stdout redirect", "stderr redirect", "child process", "IPC", "child_process", "popen"],
    language: "c"
  }),
  createNode({
    id: "C802",
    title: "Signal handling in runtimes: SIGTERM, SIGINT, SIGUSR2, and graceful shutdown",
    track: "c-subprocess-signals",
    depthTarget: "D2",
    prerequisites: ["C220", "C221b"],
    misconceptionTags: ["c.sigusr2_default_action_confusion", "c.graceful_shutdown_race_confusion"],
    keywords: ["SIGTERM", "SIGINT", "SIGUSR2", "graceful shutdown", "runtime", "inspector", "signal handler", "process termination"],
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
  ...cNetworkingNodes,
  ...cVirtualMemoryNodes,
  ...cFilesystemNodes,
  ...cKqueueIoNodes,
  ...cAdvancedConcurrencyNodes,
  ...cDynamicLinkingNodes,
  ...cSubprocessSignalsNodes
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
  },
  "c-virtual-memory": {
    id: "c-virtual-memory",
    title: "C Virtual Memory",
    nodeIds: cVirtualMemoryNodes.map((n) => n.id)
  },
  "c-filesystem": {
    id: "c-filesystem",
    title: "C Filesystem",
    nodeIds: cFilesystemNodes.map((n) => n.id)
  },
  "c-kqueue-io": {
    id: "c-kqueue-io",
    title: "C kqueue I/O (macOS)",
    nodeIds: cKqueueIoNodes.map((n) => n.id)
  },
  "c-advanced-concurrency": {
    id: "c-advanced-concurrency",
    title: "C Advanced Concurrency",
    nodeIds: cAdvancedConcurrencyNodes.map((n) => n.id)
  },
  "c-dynamic-linking": {
    id: "c-dynamic-linking",
    title: "C Dynamic Linking",
    nodeIds: cDynamicLinkingNodes.map((n) => n.id)
  },
  "c-subprocess-signals": {
    id: "c-subprocess-signals",
    title: "C Subprocess and Signals",
    nodeIds: cSubprocessSignalsNodes.map((n) => n.id)
  }
};

export const cCurriculum = createCurriculumGraph(nodes, tracks);
