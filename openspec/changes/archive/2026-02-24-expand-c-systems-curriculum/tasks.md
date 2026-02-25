## 1. Fix C241 (epoll → poll)

- [x] 1.1 In `src/curriculum/cSeed.js`, update node C241: change title to "I/O multiplexing: select/poll and O_NONBLOCK"; remove `epoll` from keywords and description; update misconceptionTags to remove "epoll-is-portable"; add a note that macOS-native event I/O is covered in the `c-kqueue-io` track (C5xx)

## 2. C3xx — Virtual Memory track (C300–C306)

- [x] 2.1 Add node C300 to cSeed.js: title "Address space layout: stack, heap, text, BSS segments", track `c-virtual-memory`, depthTarget 2, prerequisites [], keywords include "virtual memory", "mmap", "stack", "heap", "text segment"
- [x] 2.2 Add node C301: title "mmap anonymous: allocating pages from the OS", track `c-virtual-memory`, depthTarget 2, prerequisites ["C300"], keywords include "mmap", "MAP_ANONYMOUS", "MAP_PRIVATE", "page"
- [x] 2.3 Add node C302: title "mprotect: RWX page permissions and JIT code generation", track `c-virtual-memory`, depthTarget 3, prerequisites ["C301"], keywords include "mprotect", "PROT_READ", "PROT_WRITE", "PROT_EXEC", "W^X", "JIT"
- [x] 2.4 Add node C303: title "Implementing a bump-pointer allocator on mmap pages", track `c-virtual-memory`, depthTarget 3, prerequisites ["C301", "C202"], keywords include "bump pointer", "free list", "allocator", "arena", "mmap"
- [x] 2.5 Add node C304: title "madvise: MADV_DONTNEED and MADV_WILLNEED hints to the OS", track `c-virtual-memory`, depthTarget 2, prerequisites ["C301"], keywords include "madvise", "MADV_DONTNEED", "MADV_WILLNEED", "GC", "page reclaim"
- [x] 2.6 Add node C305: title "Copy-on-write: why fork() is cheap", track `c-virtual-memory`, depthTarget 2, prerequisites ["C300", "C210"], keywords include "copy-on-write", "COW", "fork", "page fault", "virtual memory"
- [x] 2.7 Add node C306: title "mlock: preventing GC heap pages from being swapped", track `c-virtual-memory`, depthTarget 2, prerequisites ["C301"], keywords include "mlock", "munlock", "page swap", "latency"

## 3. C4xx — Filesystem track (C400–C404)

- [x] 3.1 Add node C400: title "File descriptors: open flags, O_CLOEXEC, dup2, fd table", track `c-filesystem`, depthTarget 2, prerequisites [], keywords include "file descriptor", "O_CLOEXEC", "dup2", "open flags", "fd table"
- [x] 3.2 Add node C401: title "File metadata: stat, fstat, lstat, inodes, timestamps", track `c-filesystem`, depthTarget 2, prerequisites ["C400"], keywords include "stat", "fstat", "inode", "hardlink", "symlink", "timestamp"
- [x] 3.3 Add node C402: title "Directory traversal: opendir, readdir, recursive walk", track `c-filesystem`, depthTarget 2, prerequisites ["C401"], keywords include "opendir", "readdir", "dirent", "directory walk", "recursion"
- [x] 3.4 Add node C403: title "Atomic file operations: rename-as-swap, safe write patterns", track `c-filesystem`, depthTarget 2, prerequisites ["C400"], keywords include "rename", "atomic", "safe write", "temp file", "POSIX"
- [x] 3.5 Add node C404: title "Memory-mapped files: file-backed mmap, MAP_SHARED, msync", track `c-filesystem`, depthTarget 3, prerequisites ["C301", "C400"], keywords include "mmap", "MAP_SHARED", "msync", "file-backed", "shared memory"

## 4. C5xx — kqueue I/O track (C500–C506)

- [x] 4.1 Add node C500: title "Non-blocking I/O: O_NONBLOCK, fcntl, EAGAIN semantics", track `c-kqueue-io`, depthTarget 2, prerequisites ["C241"], keywords include "O_NONBLOCK", "fcntl", "EAGAIN", "EWOULDBLOCK", "non-blocking"
- [x] 4.2 Add node C501: title "kqueue fundamentals: kevent, EVFILT_READ/WRITE, edge vs level triggered", track `c-kqueue-io`, depthTarget 2, prerequisites ["C500"], keywords include "kqueue", "kevent", "EVFILT_READ", "EVFILT_WRITE", "event loop", "macOS"
- [x] 4.3 Add node C502: title "kqueue timers: EVFILT_TIMER and high-resolution timers", track `c-kqueue-io`, depthTarget 2, prerequisites ["C501"], keywords include "EVFILT_TIMER", "kqueue timer", "NOTE_MSECONDS", "setTimeout"
- [x] 4.4 Add node C503: title "kqueue process events: EVFILT_PROC and child process monitoring", track `c-kqueue-io`, depthTarget 2, prerequisites ["C501", "C210"], keywords include "EVFILT_PROC", "NOTE_EXIT", "child process", "kqueue", "libuv"
- [x] 4.5 Add node C504: title "kqueue vnode events: EVFILT_VNODE and filesystem watching", track `c-kqueue-io`, depthTarget 2, prerequisites ["C501", "C402"], keywords include "EVFILT_VNODE", "NOTE_WRITE", "NOTE_DELETE", "fs.watch", "file watch"
- [x] 4.6 Add node C505: title "Scatter-gather I/O: readv and writev for buffer chains", track `c-kqueue-io`, depthTarget 2, prerequisites ["C400"], keywords include "readv", "writev", "iovec", "scatter-gather", "buffer chain"
- [x] 4.7 Add node C506: title "Unix domain sockets: AF_UNIX for same-machine IPC", track `c-kqueue-io`, depthTarget 2, prerequisites ["C240"], keywords include "AF_UNIX", "unix socket", "IPC", "socketpair", "Node.js worker"

## 5. C6xx — Advanced Concurrency track (C600–C603)

- [x] 5.1 Add node C600: title "Thread pool pattern: fixed workers and work queue", track `c-advanced-concurrency`, depthTarget 3, prerequisites ["C230", "C231"], keywords include "thread pool", "work queue", "libuv", "UV_THREADPOOL_SIZE", "blocking I/O"
- [x] 5.2 Add node C601: title "Lock-free MPSC queue with C11 atomics", track `c-advanced-concurrency`, depthTarget 3, prerequisites ["C232", "C600"], keywords include "MPSC", "lock-free", "compare-exchange", "atomic", "Michael-Scott queue"
- [x] 5.3 Add node C602: title "Thread-local storage: __thread, pthread_key_create, per-thread GC roots", track `c-advanced-concurrency`, depthTarget 3, prerequisites ["C230"], keywords include "thread-local", "__thread", "_Thread_local", "pthread_key_create", "GC roots"
- [x] 5.4 Add node C603: title "Condition variable park/unpark: efficient thread sleeping", track `c-advanced-concurrency`, depthTarget 2, prerequisites ["C231"], keywords include "pthread_cond_wait", "park", "unpark", "spurious wakeup", "condition variable"

## 6. C7xx — Dynamic Linking track (C700–C703)

- [x] 6.1 Add node C700: title "dlopen and dlsym: loading shared libraries at runtime", track `c-dynamic-linking`, depthTarget 2, prerequisites [], keywords include "dlopen", "dlsym", "dlclose", "dlerror", "shared library", "dylib"
- [x] 6.2 Add node C701: title "DYLD_INSERT_LIBRARIES: macOS library injection", track `c-dynamic-linking`, depthTarget 3, prerequisites ["C700"], keywords include "DYLD_INSERT_LIBRARIES", "library injection", "symbol interposition", "macOS", "LD_PRELOAD"
- [x] 6.3 Add node C702: title "Symbol visibility: __attribute__((visibility)) and stable C ABI", track `c-dynamic-linking`, depthTarget 2, prerequisites ["C700"], keywords include "symbol visibility", "visibility hidden", "C ABI", "linker", "namespace"
- [x] 6.4 Add node C703: title "N-API pattern: versioned stable ABI for native addons", track `c-dynamic-linking`, depthTarget 3, prerequisites ["C700", "C702"], keywords include "N-API", "napi_value", "napi_env", "native addon", "stable ABI", "Node.js"

## 7. C8xx — Subprocess and Signals track (C800–C802)

- [x] 7.1 Add node C800: title "posix_spawn: safely spawning child processes", track `c-subprocess-signals`, depthTarget 2, prerequisites ["C210"], keywords include "posix_spawn", "posix_spawnp", "file actions", "spawn attr", "child process"
- [x] 7.2 Add node C802: title "Pipe-based IPC with children: stdin/stdout/stderr redirection", track `c-subprocess-signals`, depthTarget 2, prerequisites ["C211", "C800"], keywords include "pipe", "stdin redirect", "stdout redirect", "child_process", "IPC"
- [x] 7.3 Add node C803: title "Signal handling in runtimes: SIGTERM, SIGINT, SIGUSR2, graceful shutdown", track `c-subprocess-signals`, depthTarget 2, prerequisites ["C220", "C221"], keywords include "SIGTERM", "SIGINT", "SIGUSR2", "graceful shutdown", "runtime", "inspector"

## 8. Verification

- [x] 8.1 Run `npm test` — confirm all existing tests still pass (no regressions)
- [x] 8.2 Write a `tests/c-systems-curriculum.test.js` that verifies: the six new tracks are present, node counts per track match expectations, C241 has no "epoll" in its keywords, and all prerequisite IDs in new nodes resolve to existing nodes
- [x] 8.3 Run `npm test` again — confirm new tests pass
