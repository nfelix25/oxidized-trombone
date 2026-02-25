## MODIFIED Requirements

## ADDED Requirements

### Requirement: C Systems Curriculum Uses macOS-Compatible APIs Only
All C curriculum nodes SHALL use APIs and system calls that compile and run on macOS. Node C241 SHALL reference poll(2) rather than epoll(7), which is Linux-only. The node's apiNote and keywords SHALL reflect poll/kqueue-based I/O multiplexing patterns appropriate for macOS.

#### Scenario: C241 compiles on macOS
- **WHEN** a learner generates the C241 workspace on macOS
- **THEN** the generated starter code uses poll() or kqueue, not epoll_create/epoll_ctl/epoll_wait, and the workspace compiles without error

#### Scenario: No C curriculum node references epoll
- **WHEN** all C curriculum nodes are inspected
- **THEN** no node's apiNote, keywords, or title references epoll, EPOLLXXX constants, or epoll_create/epoll_ctl/epoll_wait

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
