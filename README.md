# oxidized-trombone

A personal interactive learning environment for systems programming and JS runtime internals, powered by Codex. Select a topic, get a personalized lesson and coding exercise, submit attempts, and receive progressive hints and AI-reviewed feedback — from the terminal or a local web UI.

**Supported languages:** Rust · C · C++ · Python · Zig

## How it works

Each session runs a scaffold-driven expand loop pipeline:

```
scaffold → starter loop → test loop → lesson loop → [you write code] → run tests → reviewer
                                                                    ↑
                                                                 coach (hints on demand)
```

- **Scaffold** produces a master plan: lesson section intents, starter file intents, test case intents, and an exercise description
- **Starter loop** iterates Codex calls to write starter code, section by section, until Codex signals completion or a depth-based cap is hit
- **Test loop** does the same for test files, with full context of the generated starter code
- **Lesson loop** runs last, generating lesson sections (concept, worked examples, pitfalls, bridge, resources) that can reference the actual exercise code — output written to `LESSON.md` in your workspace
- **You** read `LESSON.md`, edit the files, and run `npm run session attempt`
- **Reviewer** evaluates your test output and updates your mastery
- **Coach** provides progressive hints (L1 nudge → L2 example → L3 solution) when you're stuck

Your mastery state persists across sessions, so each new exercise builds on what you've already learned.

## Prerequisites

- Node.js 20+
- Rust toolchain (`rustc`, `cargo`) — for Rust exercises
- C compiler (`cc`, `make`) — for C and C exercises; on macOS use Xcode Command Line Tools
- C++ compiler — for C++ exercises
- Python 3.11+ — for Python exercises
- Zig toolchain — for Zig exercises
- Codex CLI installed and authenticated

## Session commands

```
npm run session start     Select a topic and generate your lesson + exercise
npm run session show      Re-display the exercise ID, workspace path, and lesson file path
npm run session attempt   Run tests and get reviewer feedback
npm run session hint      Request a progressive hint (L1 → L2 → L3)
npm run session review    Show the latest reviewer verdict
npm run session end       End the session and see recommendations
npm run session status    Show current session state (JSON)
npm run session resume    Re-display an existing active session
```

## Typical workflow

```bash
npm run session start
# → choose language, then guided or custom topic
# → Codex runs scaffold + three expand loops, writes files to .state/workspaces/<id>/
# → prints workspace path and LESSON.md path

# Read the lesson (written to your workspace by the lesson loop)
open .state/workspaces/<session-prefix>_S100/LESSON.md

# Edit the starter files, then test
npm run session attempt
# → runs cargo test / make test / python -m pytest / zig test → reviewer gives PASS/FAIL + score

# Stuck? Get a hint
npm run session hint      # L1 nudge
npm run session hint      # L2 example
npm run session hint      # L3 solution

npm run session end
# → summary + recommended next nodes
```

## Curriculum

**592 nodes** across all language tracks. Each track is ordered by prerequisite dependency.

### Rust (122 nodes)

Core language track (52 nodes) covering syntax basics, ownership and borrowing, collections and iterators, generics and type system, async and concurrency, smart pointers, OS threads, macros, and testing.

JS Toolchain track (70 nodes, XL/XP/XA/XD/XR/XT/XM/XN/XG/XS) — build a JS toolchain in Rust: lexer, parser, AST semantics, diagnostics, lint rules, transformer, minifier, module resolution, code generation, and source maps.

### C (129 nodes)

C Systems track (49 nodes) covering pointers and memory, IPC, signal handling, POSIX threads, POSIX networking, filesystems, memory mapping, process scheduling, timers, and advanced syscalls.

JS Runtime track (80 nodes, J-prefix) — implement a JS runtime in C: language frontend, bytecode, virtual machine, object model, garbage collection, event loop, promises and async, closures and scope, JIT optimization, and runtime internals.

### C++ (143 nodes)

Core C++ track (95 nodes) covering fundamentals, classes and OOP, templates, STL, modern C++ features, concurrency, performance, patterns, and testing.

Browser/Chromium track (48 nodes) covering Chromium foundations, Blink rendering, V8 embedding, network stack, Aura UI, and the multi-process model.

### Python (94 nodes, 13 tracks)

Data structures, algorithms, OOP and design patterns, async and concurrency, type system, testing, systems interfaces, and performance.

### Zig (104 nodes, 14 tracks)

Language fundamentals, memory management, comptime, error handling, systems programming, concurrency, interop with C, WASM targets, and build system.

---

In guided mode, nodes blocked by unmet prerequisites are shown but not selectable. In custom mode, type any topic and the system maps it to the closest nodes.

## Progress

Mastery is tracked per-node at three depth levels (D1 surface → D3 fluent) and persists across sessions in `.state/progress/global_mastery.json`. Each new session loads your prior mastery so exercises are appropriately scoped. Misconception tags from coaching and review are recorded per attempt and drive remediation scheduling when a pattern repeats.

## State layout

```
.state/
  sessions/           active_session.json
  workspaces/         per-session project directories
  progress/           global_mastery.json
  audit/              failures.jsonl (schema/policy rejection log)
```

## Web frontend

A local web UI is available as an alternative to the CLI — same sessions, same state.

**Start the API server:**
```bash
npm run serve        # production (serves client/dist/ statically)
npm run dev:server   # development (hot-reload server via node --watch)
```

**Start the Vite dev client (in a second terminal):**
```bash
cd client
npm run dev
# → opens http://localhost:5173, proxies /api to localhost:3001
```

**Build the client for static serving:**
```bash
cd client
npm run build
# → output in client/dist/, served automatically by npm run serve
```

The UI provides: session list, guided node selector, real-time setup progress (SSE), Monaco editor with debounced auto-save, collapsible lesson pane, streaming test output, reviewer feedback, and coach panel with free-form questions.

## Development

```bash
npm test              # run all tests (175 specs)
npm run test:fixtures # validate fixture files against schemas and policy
```

Stage calls can be tested without Codex using fallback mode:

```bash
STAGE_FALLBACK=1 node src/seed/a203Flow.js
```

In fallback mode, schema and policy checks still run — only live Codex execution is bypassed.
