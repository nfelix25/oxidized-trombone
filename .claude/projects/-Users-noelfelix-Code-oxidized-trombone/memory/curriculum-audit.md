# Full Curriculum Audit — 2026-02-25

Audit of all ~485 nodes across 5 language tracks + toolchain for atomicity, prerequisite gaps, and progression issues.
Goal: True atomicity from first principles, self-contained within the platform.

---

## TIER 1 — COMPOSITE-B (Egregious, Replace)

These nodes conflate fundamentally different concepts and should be replaced by separate nodes:

### C Systems
- **C241** — Uses epoll (Linux only). CRITICAL BUG on macOS. **Replace**: C241a (poll-based I/O on macOS/Linux) + C241b (kqueue-specific node in C5xx)
- **C200** — pointer arithmetic + restrict + const conflated → C200a (arithmetic) + C200b (const/restrict)
- **C221** — sigprocmask + self-pipe trick → C221a (signal masks) + C221b (self-pipe)
- **C400** — open + dup2 + O_CLOEXEC all in one → C400a (file descriptors) + C400b (O_CLOEXEC/dup2)
- **C212** — wrong prerequisites AND composite → fix prereqs + split

### C++
- **CV01** — 4 value categories conflated (lvalue, rvalue, glvalue, prvalue) → CV01a + CV01b
- **CP07** — virtual destructors + diamond inheritance → CP07a + CP07b
- **CT04** — variadic templates + fold expressions → CT04a + CT04b
- **CT05** — SFINAE + enable_if with missing prereqs → fix prereqs + split CT05a/b
- **CC04** — atomic operations + memory ordering (missing prereqs for ordering) → CC04a + CC04b
- **CC08** — coroutines (too broad, assumes too much) → split into coroutine fundamentals

### JS Runtime
- **JL06** — 4 separate scope concepts (binding, hoisting, TDZ, strict mode) → JL06a (binding/hoisting) + JL06b (TDZ/strict)
- **JP03** — async/await desugaring mixes generator frames + promise machinery → JP03a (generator desugaring) + JP03b (promise integration)
- **JC04** — live bindings + namespace objects + circular deps (3 distinct) → JC04a/b/c
- **JR01** — string interning + encoding + slices (3 distinct) → JR01a/b/c
- **JR03** — ESM records + dynamic import() + import.meta (3 distinct) → JR03a/b/c

### Rust Core
- **S105** — Closures teach Fn/FnMut/FnOnce traits but prereq is only S101 (no trait bounds) → S105a (closure syntax, prereq S101) + S105b (closure trait bounds, prereq G101). BLOCKS A210 and C101.

---

## TIER 2 — COMPOSITE-A (Add Sub-Nodes)

These nodes are broad but defensible; add sub-nodes to handle the overflow:

### C++
- CF09/CF10, CV04/CV05, CK05, CO01/CO03 — each conflates 2 related concepts
- BA01 (layout+painting+events), BL07 (WebIDL bindings), BN04/BN05, BP05/BP06/BP07

### Rust Core
- **A507** — Iterator trait impl uses associated types (G102) without prereq. Fix: add G102 to prereqs.
- **A505** — Trait objects come before static generics (G100). Fix: move after G101.
- **A701** — Async fn ownership assumes Send/Sync bounds without teaching. Fix: add Send/Sync intro before A701.
- **X101** — trait mocking + proptest conflated. Split: X101a (mocking, prereq G101) + X101b (proptest)
- **A207** — "Pattern matching" overlaps with S103. Rename to "Advanced patterns: if-let, guards, @-bindings"

### Rust Toolchain
- **XL07** — Slash ambiguity assumes lexer/parser cooperation not taught. Add context or XL00 overview.
- **XA04** — Scope tree references hoisting without teaching it. Add hoisting overview.
- **XA05** — Symbol binding references TDZ without explanation. Add TDZ context.
- **XT06** — async/await downlevel assumes generator semantics. Add generator overview.
- **XG03** — Printing statements assumes ASI knowledge. Add ASI overview.

### Zig
- **ZA03** — 5+ array utilities in one node (copy/eql, indexOf, sort, reverse) → ZA03 (copy/eql) + ZA03b (search) + ZA03c (sort)
- **ZF03** — Functions + recursion conflated → consider ZF03b for recursion patterns
- **ZA05** — format specifiers + allocPrint + bufPrint (two distinct concerns)
- **ZL01** — ArrayList append + two removal strategies → ZL01b for removal
- **ZL03** — HashMap CRUD + entry API → ZL03b for entry API
- **ZC09** — compile limits + errors conflated → ZC09b for debug logging
- **ZT01** — thread spawn/join + lifecycle/detach → consider ZT01b

### Python
- **PD06** — deque + Counter + defaultdict (3 unrelated). SPLIT into: PD06 (deque), PD06b (Counter), PD06c (defaultdict)
- **PA04** — 5 async sync primitives. SPLIT: PA04 (Queue), PA04b (Lock/Event/Semaphore/Condition)
- **PA05** — 5+ threading primitives. SPLIT similar to PA04
- **PA06** — 4+ multiprocessing concepts. SPLIT: PA06 (Process), PA06b (Pool), PA06c (Queue/IPC)
- **PT07** — 4 unrelated type annotations. SPLIT: PT07 (TypedDict), PT07b (Literal/Final/ClassVar)

### JS Runtime
- **JO07** — Proxy + Reflect (2 distinct APIs) → JO07a (Proxy), JO07b (Reflect)
- **JT07** — IR + machine code + platforms (optional split)

---

## TIER 3 — PREREQUISITE GAPS (Missing prerequisite nodes)

Concepts assumed but never explicitly taught anywhere in the curriculum:

### C Systems
- **Memory ordering semantics** — assumed in C232/C601 but never taught
  → Add: C3xx node "Memory ordering: acquire-release, happens-before"

### C++
- **Template overload resolution** — assumed, never taught → add node
- **Memory model / happens-before** — assumed in CC04 → add node (needed before C++ atomics)
- **Race conditions vs data races** — assumed, never taught → add node
- **Intrusive reference counting** — assumed, never taught → add node

### Rust Core
- **Send/Sync marker traits** — assumed in A701, never taught → add brief node or section in A700
- A210/C101 blocked until S105 is fixed

### Zig
- **C language knowledge** — assumed throughout ZX01-ZX06 interop track, never stated as prerequisite. Add explicit prereq note to all ZX nodes.
- **Memory model fundamentals** (addresses, virtual memory, pages) — assumed before ZP01, ZM02. Add prerequisite notes.
- **OS concepts** (virtual memory, pages, interrupts) — scattered throughout. Consider glossary or reference node.
- **Hardware concepts** (memory ordering, SIMD, register constraints) — assumed in ZT05, ZU04-ZU06
- **SoA vs AoS** — assumed in ZL06 (MultiArrayList)
- **Unicode fundamentals** — assumed in ZA07

### Python
- **C knowledge** — assumed in PH03 (ctypes/cffi), never stated. Add explicit prereq note.

### JS Runtime
- **JO01** — Hidden classes taught before any VM/memory context (JV). Should require JV01 first.
- **JR02** — Regex engine requires JL01 but DFA ≠ NFA; weak connection. Should add "automata theory basics" to prereqs or keywords.
- **JC03** — Variable hoisting overlaps with JL06 analysis-time behavior. Clarify or merge.

---

## TIER 4 — CRITICAL BUG (Must Fix Immediately)

- **C241** — epoll is Linux-only, WILL NOT COMPILE on macOS (our target platform). Replace with poll.

---

## SUMMARY STATISTICS

| Track | Total Nodes | COMPOSITE-B (replace) | COMPOSITE-A (sub-nodes) | Gap Issues | Overall Health |
|-------|-------------|----------------------|------------------------|------------|----------------|
| Rust Core | 44 | 1 (S105) | 5 | 3 | GOOD with gaps |
| Rust Toolchain | 70 | 0 | 5 | 0 | GOOD |
| C Systems | 14 | 5 | 0 | 1 | NEEDS WORK |
| C++ | 90 | 6 | 8 | 4 | NEEDS WORK |
| Zig | 102 | 0 | 7 | 5 | GOOD with gaps |
| Python | 87 | 0 | 5 | 1 | GOOD |
| JS Runtime | 62 | 7 | 2 | 3 | NEEDS ATTENTION |
| **TOTAL** | **~469** | **19** | **32** | **17** | |

---

## PRIORITIZED ACTION LIST

### P0 — Fix immediately (blocks compilation or is egregiously wrong)
1. Fix C241 epoll → poll
2. Fix S105 prerequisite ordering (blocks A210, C101 cascade)

### P1 — JS Runtime (primary learning goal, fix before new nodes)
3. Split JL06 → JL06a + JL06b
4. Split JP03 → JP03a + JP03b
5. Split JC04 → JC04a/b/c
6. Split JR01 → JR01a/b/c
7. Split JR03 → JR03a/b/c
8. Fix JO01 prereq (add JV01)
9. Split JO07 → JO07a + JO07b

### P2 — C Systems (foundation for JS runtime curriculum)
10. Replace C241 (after P0 fix confirm)
11. Split C200 → C200a + C200b
12. Split C221 → C221a + C221b
13. Split C400 → C400a + C400b
14. Fix C212 (prereqs + split)
15. Add memory ordering node

### P3 — C++ (most broken track by ratio)
16. Split CV01, CP07, CT04, CT05 (critical composites)
17. Fix CC04 (add memory model prereq)
18. Add missing prereq nodes (template overload, memory model, race vs data race)

### P4 — Rust improvements
19. Fix A507 (add G102 prereq)
20. Reorder A505 after G101
21. Add Send/Sync intro before A701
22. Add context keywords to XL07, XA04, XA05, XT06, XG03
23. Split X101 → X101a + X101b

### P5 — Python/Zig atomicity
24. Split PD06 (3 collections)
25. Split PA04/PA05/PA06 (sync primitives)
26. Split PT07
27. Add C prereq notes to ZX track and PH03
28. Split ZA03 (array utilities)
