# oxidized-trombone

A personal interactive Rust learning environment powered by Codex. Select a topic, get a generated coding exercise, submit attempts with `cargo test`, and receive progressive hints and AI-reviewed feedback — all from the terminal.

## How it works

Each session runs a four-stage AI pipeline:

```
planner → author → [you write code] → cargo test → reviewer
                                  ↑
                               coach (hints on demand)
```

- **Planner** designs a lesson plan for the selected node and your current mastery level
- **Author** generates starter Rust files and tests tailored to that plan
- **You** edit the files in the materialized workspace and run `npm run session attempt`
- **Reviewer** evaluates your `cargo test` output and updates your mastery
- **Coach** provides progressive hints (L1 nudge → L2 example → L3 solution) when you're stuck

Your mastery state persists across sessions, so each new exercise builds on what you've already learned.

## Prerequisites

- Node.js 20+
- Rust toolchain (`rustc`, `cargo`)
- Codex CLI installed and authenticated

## Session commands

```
npm run session start     Select a topic and generate your exercise
npm run session show      Re-display the exercise objective and file paths
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
# → Codex generates exercise, files written to .state/workspaces/<id>/

# The workspace path is printed — open it in your editor
code .state/workspaces/<session-prefix>_A200/src/lib.rs

# Work on the exercise, then test
npm run session attempt
# → runs cargo test → reviewer gives PASS/FAIL + score

# Stuck? Get a hint
npm run session hint      # L1 nudge
npm run session hint      # L2 example
npm run session hint      # L3 solution

npm run session end
# → summary + recommended next nodes
```

## Curriculum

35 nodes across 7 tracks, ordered by prerequisite dependency.

| Track | Nodes | Topics |
|-------|-------|--------|
| Ownership and Borrowing | A200–A209 | Ownership, moves, borrowing, lifetimes, structs, pattern matching, error handling |
| Collections, Iterators, and Traits | A500–A506 | Vec, HashMap, slices, iterators, trait objects, Display/From |
| Async and Concurrency | A700–A704 | Futures, async fn, Arc/Mutex, channels, Pin |
| Smart Pointers | B100–B103 | Box, Rc, RefCell, Deref coercions |
| OS Threads and Shared State | C100–C103 | std::thread, move closures, mpsc, Mutex+Arc |
| Macros | M100–M102 | macro_rules!, derive macros, proc macros |
| Generics and Type System | G100–G103 | Type params, trait bounds, associated types, generic lifetimes |

In guided mode, nodes blocked by unmet prerequisites are shown but not selectable. In custom mode, type any Rust topic (e.g. "interior mutability", "channels") and the system maps it to the closest nodes.

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
npm test              # run all tests (34 specs)
npm run test:fixtures # validate fixture files against schemas and policy
```

Stage calls can be tested without Codex using fallback mode:

```bash
STAGE_FALLBACK=1 node src/seed/a203Flow.js
```

In fallback mode, schema and policy checks still run — only live Codex execution is bypassed. See `docs/runbook.md` for troubleshooting and retry configuration.
