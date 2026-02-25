## ADDED Requirements

### Requirement: C-Virtual-Memory track exists (C300–C306)
The system SHALL include a `c-virtual-memory` track with seven nodes covering process address space layout, anonymous mmap, mprotect, allocator implementation, madvise, copy-on-write, and mlock — the OS primitives required to understand JS engine memory management and JIT code generation.

#### Scenario: C300 covers address space layout
- **WHEN** a session targets node C300
- **THEN** the scaffold plans content on stack/heap/text/BSS segments, virtual vs physical addresses, and how the kernel manages the process address space

#### Scenario: C301 covers anonymous mmap
- **WHEN** a session targets node C301
- **THEN** the scaffold plans content on mmap with MAP_ANONYMOUS|MAP_PRIVATE, obtaining raw pages from the OS, and the relationship between mmap and malloc internals

#### Scenario: C302 covers mprotect and page permissions
- **WHEN** a session targets node C302
- **THEN** the scaffold plans content on PROT_READ/WRITE/EXEC flags, the W^X (write xor execute) security policy, and why JIT compilers need mprotect to switch a page from writable to executable

#### Scenario: C303 covers implementing a simple allocator
- **WHEN** a session targets node C303
- **THEN** the scaffold plans content on bump-pointer allocation on mmap pages, a free list, and why this is the pattern V8's heap zones use

#### Scenario: C304 covers madvise
- **WHEN** a session targets node C304
- **THEN** the scaffold plans content on MADV_DONTNEED (return pages to OS), MADV_WILLNEED (prefetch hint), and how a GC uses these to release swept memory

#### Scenario: C305 covers copy-on-write
- **WHEN** a session targets node C305
- **THEN** the scaffold plans content on fork() page sharing, the COW page fault, and implications for process spawning cost in runtimes

#### Scenario: C306 covers mlock
- **WHEN** a session targets node C306
- **THEN** the scaffold plans content on mlock/munlock, preventing heap pages from being paged out, and when a runtime might use this for latency-sensitive GC regions

### Requirement: C-Filesystem track exists (C400–C404)
The system SHALL include a `c-filesystem` track with five nodes covering file descriptors, metadata, directory traversal, atomic file operations, and memory-mapped files.

#### Scenario: C400 covers file descriptor mechanics
- **WHEN** a session targets node C400
- **THEN** the scaffold plans content on open flags (O_RDONLY, O_WRONLY, O_CREAT, O_CLOEXEC), dup2 for fd redirection, and the per-process fd table

#### Scenario: C401 covers file metadata
- **WHEN** a session targets node C401
- **THEN** the scaffold plans content on stat/fstat/lstat, the inode concept, file timestamps, and hardlinks vs symlinks

#### Scenario: C402 covers directory traversal
- **WHEN** a session targets node C402
- **THEN** the scaffold plans content on opendir/readdir/closedir, the dirent struct, and a recursive directory walker

#### Scenario: C403 covers atomic file operations
- **WHEN** a session targets node C403
- **THEN** the scaffold plans content on rename-as-swap (write to tmp, rename into place), why this is atomic on POSIX, and safe log/config writing patterns

#### Scenario: C404 covers memory-mapped files
- **WHEN** a session targets node C404
- **THEN** the scaffold plans content on file-backed mmap (MAP_SHARED vs MAP_PRIVATE), msync, and how shared memory segments between processes work

### Requirement: C-Kqueue-IO track exists (C500–C506) — macOS-native
The system SHALL include a `c-kqueue-io` track with seven nodes covering non-blocking I/O, kqueue event notification, timers, process monitoring, vnode events, scatter-gather I/O, and Unix domain sockets — the macOS event I/O system that underlies libuv's backend.

#### Scenario: C500 covers non-blocking I/O fundamentals
- **WHEN** a session targets node C500
- **THEN** the scaffold plans content on O_NONBLOCK via fcntl, EAGAIN/EWOULDBLOCK semantics, and why blocking vs non-blocking matters for single-threaded event loops

#### Scenario: C501 covers kqueue fundamentals
- **WHEN** a session targets node C501
- **THEN** the scaffold plans content on kqueue()/kevent() system calls, EVFILT_READ/EVFILT_WRITE filters, edge-triggered vs level-triggered semantics, and a minimal event loop

#### Scenario: C502 covers kqueue timers
- **WHEN** a session targets node C502
- **THEN** the scaffold plans content on EVFILT_TIMER, high-resolution timer creation, NOTE_MSECONDS/NOTE_USECONDS units, and implementing setTimeout semantics without threads

#### Scenario: C503 covers kqueue process events
- **WHEN** a session targets node C503
- **THEN** the scaffold plans content on EVFILT_PROC, NOTE_EXIT for child process monitoring, and how libuv's uv_process_t uses this to detect child exit

#### Scenario: C504 covers kqueue vnode events
- **WHEN** a session targets node C504
- **THEN** the scaffold plans content on EVFILT_VNODE, NOTE_WRITE/NOTE_DELETE/NOTE_RENAME flags, and how this implements Node.js fs.watch on macOS

#### Scenario: C505 covers scatter-gather I/O
- **WHEN** a session targets node C505
- **THEN** the scaffold plans content on readv/writev, the iovec struct, and why buffer chains in stream implementations use scatter-gather instead of copying to a contiguous buffer

#### Scenario: C506 covers Unix domain sockets
- **WHEN** a session targets node C506
- **THEN** the scaffold plans content on AF_UNIX sockets, SOCK_STREAM vs SOCK_DGRAM, and how Node.js parent/worker IPC uses a Unix socket pair

### Requirement: C-Advanced-Concurrency track exists (C600–C603)
The system SHALL include a `c-advanced-concurrency` track with four nodes covering thread pool patterns, lock-free queues, thread-local storage, and condition variable park/unpark — the concurrency primitives used by libuv's thread pool.

#### Scenario: C600 covers the thread pool pattern
- **WHEN** a session targets node C600
- **THEN** the scaffold plans content on a fixed-size worker thread pool with a shared work queue, how libuv's UV_THREADPOOL_SIZE works, and posting blocking work from the event loop thread

#### Scenario: C601 covers a lock-free MPSC queue
- **WHEN** a session targets node C601
- **THEN** the scaffold plans content on the Michael-Scott queue algorithm, C11 atomic compare-exchange, and why a lock-free MPSC queue is used for thread pool result delivery

#### Scenario: C602 covers thread-local storage
- **WHEN** a session targets node C602
- **THEN** the scaffold plans content on __thread / _Thread_local, pthread_key_create/pthread_getspecific, and how per-thread GC roots are maintained in V8

#### Scenario: C603 covers condition variable park/unpark
- **WHEN** a session targets node C603
- **THEN** the scaffold plans content on pthread_cond_wait/signal as a park/unpark primitive, the spurious-wakeup pattern, and how worker threads sleep efficiently when the queue is empty

### Requirement: C-Dynamic-Linking track exists (C700–C703)
The system SHALL include a `c-dynamic-linking` track with four nodes covering dlopen/dlsym, library injection, symbol visibility, and the N-API ABI pattern — required for understanding native Node.js addons.

#### Scenario: C700 covers dlopen and dlsym
- **WHEN** a session targets node C700
- **THEN** the scaffold plans content on dlopen(path, RTLD_LAZY|RTLD_NOW), dlsym for symbol lookup, dlclose, and the dlerror error reporting pattern

#### Scenario: C701 covers DYLD_INSERT_LIBRARIES
- **WHEN** a session targets node C701
- **THEN** the scaffold plans content on macOS library injection via DYLD_INSERT_LIBRARIES, interposing existing symbols, and how this is used in profilers and test harnesses

#### Scenario: C702 covers symbol visibility
- **WHEN** a session targets node C702
- **THEN** the scaffold plans content on __attribute__((visibility("default"/"hidden"))), building a stable C ABI for a shared library, and why unexported symbols don't pollute the linker namespace

#### Scenario: C703 covers the N-API stable ABI pattern
- **WHEN** a session targets node C703
- **THEN** the scaffold plans content on the motivation for a versioned stable ABI, how napi_value and napi_env abstract the runtime, and the pattern for calling C functions from JavaScript via a native addon

### Requirement: C-Subprocess-Signals track exists (C800–C802)
The system SHALL include a `c-subprocess-signals` track with three nodes covering posix_spawn, pipe-based IPC, and signal handling in runtimes.

#### Scenario: C800 covers posix_spawn
- **WHEN** a session targets node C800
- **THEN** the scaffold plans content on posix_spawn/posix_spawnp, posix_spawn_file_actions for fd setup, posix_spawnattr for process attributes, and why posix_spawn is safer than fork+exec in multithreaded programs

#### Scenario: C801 covers pipe-based IPC with child processes
- **WHEN** a session targets node C801
- **THEN** the scaffold plans content on redirecting stdin/stdout/stderr of a child process through pipes, reading child output asynchronously, and how Node.js child_process.spawn uses this pattern

#### Scenario: C802 covers signal handling in runtimes
- **WHEN** a session targets node C802
- **THEN** the scaffold plans content on SIGTERM/SIGINT/SIGUSR2 handling in a runtime process, graceful shutdown patterns, and why SIGUSR2 is used for inspector protocol activation in Node.js
