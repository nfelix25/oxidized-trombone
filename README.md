# oxidized-trombone

A personal interactive learning environment for **Rust** and **C** powered by Codex. Select a topic, get a personalized lesson and coding exercise, submit attempts with `cargo test` (Rust) or `make test` (C), and receive progressive hints and AI-reviewed feedback — all from the terminal.

## How it works

Each session runs a scaffold-driven expand loop pipeline:

```
scaffold → starter loop → test loop → lesson loop → [you write code] → cargo test → reviewer
                                                                    ↑
                                                                 coach (hints on demand)
```

- **Scaffold** produces a master plan: lesson section intents, starter file intents, test case intents, and an exercise description
- **Starter loop** iterates Codex calls to write starter Rust code, section by section, until Codex signals completion or a depth-based cap is hit
- **Test loop** does the same for test files, with full context of the generated starter code
- **Lesson loop** runs last, generating lesson sections (concept, worked examples, pitfalls, bridge, resources) that can reference the actual exercise code — output written to `LESSON.md` in your workspace
- **You** read `LESSON.md`, edit the files, and run `npm run session attempt`
- **Reviewer** evaluates your `cargo test` output and updates your mastery
- **Coach** provides progressive hints (L1 nudge → L2 example → L3 solution) when you're stuck

Your mastery state persists across sessions, so each new exercise builds on what you've already learned.

## Prerequisites

- Node.js 20+
- Rust toolchain (`rustc`, `cargo`) — for Rust exercises
- C compiler (`cc`, `make`) — for C exercises; on macOS use Xcode Command Line Tools
- Codex CLI installed and authenticated

## Session commands

```
npm run session start     Select a topic and generate your lesson + exercise
npm run session show      Re-display the exercise ID, workspace path, and lesson file path
npm run session attempt   Run cargo test and get reviewer feedback
npm run session hint      Request a progressive hint (L1 → L2 → L3)
npm run session review    Show the latest reviewer verdict
npm run session end       End the session and see recommendations
npm run session status    Show current session state (JSON)
npm run session resume    Re-display an existing active session
```

## Typical workflow

```bash
npm run session start
# → choose guided or custom topic
# → Codex runs scaffold + three expand loops, writes files to .state/workspaces/<id>/
# → prints workspace path and LESSON.md path

# Read the lesson (written to your workspace by the lesson loop)
open .state/workspaces/<session-prefix>_S100/LESSON.md
# or: code .state/workspaces/<session-prefix>_S100/LESSON.md

# Edit the starter files, then test
npm run session attempt
# → runs cargo test (Rust) or make test (C) → reviewer gives PASS/FAIL + score

# Stuck? Get a hint
npm run session hint      # L1 nudge
npm run session hint      # L2 example
npm run session hint      # L3 solution

npm run session end
# → summary + recommended next nodes
```

## Curriculum

**61 nodes** across 14 tracks — 47 Rust nodes and 14 C nodes. Each track is ordered by prerequisite dependency.

### Rust learning path

```
Rust Syntax Basics (S100–S107)
         ↓
Ownership and Borrowing (A200–A211)  ←  also unlocks Smart Pointers, Concurrency
         ↓
Collections, Iterators, and Traits (A500–A507)
         ↓
Generics and Type System (G100–G103)
         ↓
Async and Concurrency (A700–A704)
```

Testing (X100–X101) and Macros (M100–M102) unlock in parallel once you have the basics. With no prior mastery, start at **S100**.

### C learning path

```
C Pointers and Memory (C200–C202)   ← entry point; no prerequisites
         ↓
C IPC (C210–C213) · C Signals (C220–C221) · C Concurrency (C230–C232) · C Networking (C240–C242)
```

Each C track is independent once C200 is underway. C exercises use `make test` with a lightweight `tests/test.h` harness whose output format mirrors `cargo test`.

### Track reference

| Language | Track | Nodes | Topics |
|---|---|---|---|
| Rust | Syntax Basics | S100–S107 | Variables/types, functions/control flow, structs/impl, enums/match, String vs &str, closures, traits, modules/Cargo |
| Rust | Ownership and Borrowing | A200–A211 | Ownership model, moves, Copy types, shared/mutable borrowing, NLL, lifetimes, error handling, pattern matching, structs, closures × ownership, custom errors |
| Rust | Collections, Iterators, and Traits | A500–A507 | Vec, HashMap, slices, iterator modes, adaptor chaining, trait objects, Display/From, implementing Iterator |
| Rust | Testing | X100–X101 | Unit tests, integration tests, mocking with traits |
| Rust | Async and Concurrency | A700–A704 | Futures, async fn, Arc/Mutex, channels, Pin |
| Rust | Smart Pointers | B100–B103 | Box, Rc, RefCell, Deref coercions |
| Rust | OS Threads and Shared State | C100–C103 | std::thread, move closures, mpsc channels, Mutex+Arc |
| Rust | Macros | M100–M102 | macro_rules!, derive macros, proc macros |
| Rust | Generics and Type System | G100–G103 | Type params, trait bounds, associated types, generic lifetimes |
| C | Pointers and Memory | C200–C202 | Pointer arithmetic, array decay, restrict, const-correctness, function pointers, callbacks, malloc/realloc/free, arena allocator |
| C | IPC | C210–C213 | fork/waitpid/exec, zombie/orphan, pipes/FIFOs, mmap MAP_SHARED, shm_open, POSIX message queues |
| C | Signal Handling | C220–C221 | sigaction, sigset_t, SA_RESTART, sigprocmask, async-signal-safety, self-pipe trick |
| C | POSIX Threads | C230–C232 | pthread_create/join/detach, mutex, cond_wait, producer-consumer, _Atomic, lock-free counter |
| C | POSIX Networking | C240–C242 | TCP socket/bind/listen/accept, select/poll/epoll, O_NONBLOCK, UDP sendto/recvfrom |

In guided mode, nodes blocked by unmet prerequisites are shown but not selectable. In custom mode, type any topic and the system maps it to the closest nodes.

## Progress

Mastery is tracked per-node at three depth levels (D1 surface → D3 fluent) and persists across sessions in `.state/progress/global_mastery.json`. Each new session loads your prior mastery so exercises are appropriately scoped.

## State layout

```
.state/
  sessions/           active_session.json
  workspaces/         per-session Rust project directories
  progress/           global_mastery.json
  audit/              failures.jsonl (schema/policy rejection log)
```

## Development

```bash
npm test              # run all tests (38 specs)
npm run test:fixtures # validate fixture files against schemas and policy
```

Stage calls can be tested without Codex using fallback mode:

```bash
STAGE_FALLBACK=1 node src/seed/a203Flow.js
```

In fallback mode, schema and policy checks still run — only live Codex execution is bypassed.
