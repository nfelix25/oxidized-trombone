## Context

The C track currently has 14 nodes (C200–C242) covering pointer mechanics, IPC, signals, concurrency, and networking. The upcoming `add-js-runtime-curriculum` change will add ~70 nodes implementing pieces of JS runtime machinery (GC, event loop, JIT, object model). Several of those nodes have hard prerequisites in the OS layer — mmap/mprotect for JIT executable pages, kqueue for the event loop backend, thread-local storage for GC root tracking, dynamic linking for native addons, etc. This change fills those gaps, expanding the C track to ~44 nodes.

Current state: `src/curriculum/cSeed.js` holds all C nodes in one file. The language registry, runtime, and session infrastructure require no changes — this is a pure curriculum data addition.

## Goals / Non-Goals

**Goals:**
- Add ~30 new nodes (C300–C802) covering: virtual memory, filesystem, kqueue I/O, advanced concurrency primitives, dynamic linking, subprocess/signal patterns
- Fix C241: replace epoll (Linux-only) with poll() and add a note pointing to the kqueue track for macOS
- Ensure all cross-track prerequisites from the upcoming JS runtime change are satisfied before that change starts
- Keep all content macOS-native (kqueue, DYLD, GCD where relevant) — the target machine is macOS Intel 2019

**Non-Goals:**
- Linux compatibility (no epoll, no inotify, no Linux-specific syscalls)
- Windows support
- Changing the runtime, schemas, or session infrastructure
- Adding a "teacher" or "coach" mode — those come from other changes

## Decisions

### Node ID scheme: C3xx–C8xx (one track per hundred)
Each new track gets its own prefix: C3xx = virtual memory, C4xx = filesystem, C5xx = kqueue I/O, C6xx = advanced concurrency, C7xx = dynamic linking, C8xx = subprocess/signals. This mirrors the existing C2xx (pointer/IPC/etc) pattern and leaves room for future expansion.

Alternatives considered: alphabetic suffixes (C-VM, C-FS) — rejected because the existing seed uses numeric suffixes and consistency is more important than mnemonic naming.

### macOS-native API selection
All I/O multiplexing uses kqueue (not epoll/io_uring). All dynamic linking uses dlopen/DYLD (not ld.so). This is intentional — the user runs macOS and the exercises need to compile and run locally.

### C241 fix: poll() not kqueue
C241 covers I/O multiplexing intro. Fixing it to use `poll()` (POSIX, works everywhere) keeps the node appropriately introductory. The C5xx track then goes deep on kqueue specifically. This separates "portable multiplexing" from "macOS-native event I/O."

### Single file: keep all C nodes in cSeed.js
30 additional nodes don't justify splitting the file. If the C curriculum eventually reaches 100+ nodes, splitting by track becomes worthwhile — not now.

### Prerequisite structure
New tracks form a topological order that mirrors learning dependencies:
- C3xx (virtual memory) builds on C202 (malloc/mmap)
- C4xx (filesystem) has no prerequisites beyond general C knowledge
- C5xx (kqueue) builds on C500 (non-blocking I/O) for its own progression; C501 → C502 → C503 → C504
- C6xx (advanced concurrency) builds on C230/C231 (pthread basics from existing track)
- C7xx (dynamic linking) is self-contained
- C8xx (subprocess) builds on C210 (fork/exec from existing track)

## Risks / Trade-offs

- [Risk: C5xx kqueue is macOS-only] → Mitigation: explicitly document this in node descriptions and titles; the user's machine is macOS only so no Linux learner is affected
- [Risk: C302 mprotect + executable pages may trigger macOS security restrictions] → Mitigation: note this in node description; exercises use a small mmap region and work fine on Intel macOS without SIP changes
- [Risk: cSeed.js becomes large] → This is acceptable; the file is data not logic. ~60 nodes is fine.
- [Risk: cross-track prerequisite references (JE02 → C501 etc.) are only valid after both changes are merged] → The JS runtime change will be created after this one lands, so the prereq IDs will exist.
