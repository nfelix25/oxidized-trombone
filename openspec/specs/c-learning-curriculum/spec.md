## Purpose
Specifies the C systems-programming curriculum: 45 nodes across 11 tracks covering advanced pointer usage, IPC, signal handling, POSIX threads, networking, virtual memory, filesystem, kqueue I/O (macOS), advanced concurrency, dynamic linking, and subprocess/signal patterns.

## Requirements

### Requirement: C curriculum contains 45 nodes across 11 tracks
The system SHALL include a C curriculum with 45 nodes at D2–D3 depth covering advanced C systems-programming topics, organised into eleven tracks.

#### Scenario: C curriculum is accessible via getNode
- **WHEN** `getNode` is called with a C node ID (e.g. `"C200"`)
- **THEN** it returns the node with correct `language: "c"`, `track`, `depthTarget`, `keywords`, and `misconceptionTags`

#### Scenario: C tracks cover all eleven topic domains
- **WHEN** the C curriculum is loaded
- **THEN** nodes exist in tracks: `c-pointers`, `c-ipc`, `c-signals`, `c-concurrency`, `c-networking`, `c-virtual-memory`, `c-filesystem`, `c-kqueue-io`, `c-advanced-concurrency`, `c-dynamic-linking`, `c-subprocess-signals`

### Requirement: C-Pointers track (C200–C202)
The C-Pointers track SHALL contain three nodes covering advanced pointer usage.

#### Scenario: C200 covers pointer arithmetic and memory layout
- **WHEN** a session targets node C200
- **THEN** the scaffold plans content on pointer arithmetic, pointer decay from arrays, multi-dimensional arrays, `const`-correctness with pointers, and the `restrict` qualifier
- **THEN** exercise stubs require the learner to implement functions using pointer arithmetic rather than array indexing

#### Scenario: C201 covers function pointers and callbacks
- **WHEN** a session targets node C201
- **THEN** the scaffold plans content on function pointer syntax, `typedef` for readability, `qsort`/`bsearch` callback patterns, and dispatch tables
- **THEN** exercise stubs require the learner to implement and use function pointer arrays

#### Scenario: C202 covers dynamic memory management
- **WHEN** a session targets node C202
- **THEN** the scaffold plans content on `malloc`/`calloc`/`realloc`/`free`, common bugs (double-free, use-after-free, leak), and a simple arena allocator pattern
- **THEN** exercise stubs require the learner to allocate, resize, and free heap memory correctly

### Requirement: C-IPC track (C210–C213)
The C-IPC track SHALL contain four nodes covering inter-process communication.

#### Scenario: C210 covers the process model
- **WHEN** a session targets node C210
- **THEN** the scaffold plans content on `fork`/`waitpid`/`exec*`, process vs thread trade-offs, zombie and orphan processes, and exit code propagation

#### Scenario: C211 covers pipes and FIFOs
- **WHEN** a session targets node C211
- **THEN** the scaffold plans content on `pipe()`, anonymous pipe usage with `fork`, FIFO creation with `mkfifo`, and fd management

#### Scenario: C212 covers shared memory
- **WHEN** a session targets node C212
- **THEN** the scaffold plans content on `mmap` with `MAP_SHARED`, `shm_open`/`shm_unlink`, and synchronisation requirements when sharing memory between processes

#### Scenario: C213 covers POSIX message queues
- **WHEN** a session targets node C213
- **THEN** the scaffold plans content on `mq_open`/`mq_send`/`mq_receive`/`mq_close`/`mq_unlink` and message priority

### Requirement: C-Signals track (C220–C221)
The C-Signals track SHALL contain two nodes covering POSIX signal handling.

#### Scenario: C220 covers signal disposition and sigaction
- **WHEN** a session targets node C220
- **THEN** the scaffold plans content on default signal disposition, `sigaction` vs the deprecated `signal()`, `sigset_t` manipulation, and common signals (SIGINT, SIGTERM, SIGCHLD, SIGUSR1)

#### Scenario: C221 covers signal masking and async-signal safety
- **WHEN** a session targets node C221
- **THEN** the scaffold plans content on blocking signals with `sigprocmask`, async-signal-safe functions, the self-pipe trick for safe signal-to-event conversion

### Requirement: C-Concurrency track (C230–C232)
The C-Concurrency track SHALL contain three nodes covering POSIX threads and synchronisation.

#### Scenario: C230 covers POSIX thread lifecycle
- **WHEN** a session targets node C230
- **THEN** the scaffold plans content on `pthread_create`/`pthread_join`/`pthread_detach`, passing arguments, returning values, and thread vs process trade-offs

#### Scenario: C231 covers mutex and condition variables
- **WHEN** a session targets node C231
- **THEN** the scaffold plans content on `pthread_mutex_lock`/`unlock`, `pthread_cond_wait`/`signal`/`broadcast`, and the producer-consumer pattern

#### Scenario: C232 covers C11 atomics and memory ordering
- **WHEN** a session targets node C232
- **THEN** the scaffold plans content on `_Atomic`, `atomic_load`/`atomic_store`/`atomic_fetch_add`, memory order constants, and a lock-free counter example

### Requirement: C-Networking track (C240–C242) uses portable poll() not Linux epoll
The C-Networking track SHALL cover I/O multiplexing using POSIX `select`/`poll` for portability, with a note that macOS-native kqueue coverage is in the `c-kqueue-io` track.

#### Scenario: C240 covers TCP client-server with BSD sockets
- **WHEN** a session targets node C240
- **THEN** the scaffold plans content on `socket`/`bind`/`listen`/`accept`/`connect`/`send`/`recv`, `struct sockaddr_in`, and a complete echo server/client pair

#### Scenario: C241 covers I/O multiplexing with poll (not epoll)
- **WHEN** a session targets node C241
- **THEN** the scaffold plans content on `select`/`poll` (POSIX), `O_NONBLOCK`, and an event-loop pattern; it SHALL NOT reference Linux-only `epoll`; a note SHALL direct learners to the `c-kqueue-io` track for macOS-native event I/O

#### Scenario: C242 covers UDP sockets
- **WHEN** a session targets node C242
- **THEN** the scaffold plans content on `sendto`/`recvfrom`, UDP characteristics (no connection, no ordering), and a simple datagram echo example

### Requirement: C curriculum includes six systems-programming tracks (C3xx–C8xx)
The C curriculum SHALL include six additional tracks covering virtual memory management, filesystem internals, kqueue I/O, advanced concurrency primitives, dynamic linking, and subprocess/signal patterns — the OS foundations required for the JS runtime curriculum. These tracks are fully specified in `openspec/specs/c-systems-curriculum/spec.md`.

#### Scenario: New tracks are present in cSeed.js
- **WHEN** the C curriculum is loaded from `cSeed.js`
- **THEN** nodes exist with IDs C300–C306, C400–C404, C500–C506, C600–C603, C700–C703, and C800–C802

### Requirement: C Systems Composite Nodes Are Split Into Atomic Sub-Nodes
Nodes that conflate two or more first principles SHALL be replaced by atomic sub-nodes. C200 (pointer arithmetic and const/restrict qualifiers) SHALL be split into C200a (pointer arithmetic: address math, scaling, array traversal) and C200b (const and restrict qualifiers: compiler optimization hints and aliasing rules). C221 (signal masks and self-pipe) SHALL be split into C221a (signal masks: sigprocmask, sigset_t, signal blocking) and C221b (self-pipe trick: async-signal-safe write to fd pair). C400 (file descriptors, dup2, O_CLOEXEC) SHALL be split into C400a (file descriptor basics: open, close, read, write, fd as int) and C400b (dup2 and O_CLOEXEC: fd duplication and exec-time cleanup).

#### Scenario: C200a covers pointer arithmetic
- **WHEN** a session targets node C200a
- **THEN** the scaffold plans content on address arithmetic, pointer scaling by sizeof(T), array pointer equivalence, and pointer comparison

#### Scenario: C200b covers const and restrict
- **WHEN** a session targets node C200b
- **THEN** the scaffold plans content on const correctness, top-level vs pointer-target const, restrict as an aliasing promise, and the optimization implications

#### Scenario: C221a covers signal masks
- **WHEN** a session targets node C221a
- **THEN** the scaffold plans content on sigprocmask, sigset_t manipulation (sigemptyset, sigaddset), blocking signals during critical sections, and pending signal delivery

#### Scenario: C221b covers self-pipe trick
- **WHEN** a session targets node C221b
- **THEN** the scaffold plans content on creating a pipe pair, writing one byte in a signal handler (async-signal-safe), reading from the read end in the event loop, and why this is the canonical way to handle signals in select/poll loops

#### Scenario: C400a covers file descriptor basics
- **WHEN** a session targets node C400a
- **THEN** the scaffold plans content on the file descriptor as a small integer, the per-process fd table, open/close/read/write syscalls, and error handling with errno

#### Scenario: C400b covers dup2 and O_CLOEXEC
- **WHEN** a session targets node C400b
- **THEN** the scaffold plans content on dup2 for redirecting stdin/stdout, O_CLOEXEC to prevent fd leaks across exec, and the close-on-exec flag mechanics
