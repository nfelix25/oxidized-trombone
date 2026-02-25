## 1. P0 — Critical Bug Fixes

- [x] 1.1 Fix C241 in cSeed.js: change apiNote/keywords from epoll to poll; update title if it references epoll
- [x] 1.2 Verify no other C node references epoll in title, apiNote, or keywords
- [x] 1.3 Split S105 in rustSeed.js: add S105a (closure syntax, prereq S101) and S105b (Fn/FnMut/FnOnce trait bounds, prereq G101)
- [x] 1.4 Remove original S105 node from rustSeed.js
- [x] 1.5 Update A210 prerequisites: replace "S105" with "S105b" in rustSeed.js
- [x] 1.6 Update C101 prerequisites: replace "S105" with "S105b" in rustSeed.js

## 2. P1 — JS Runtime Splits (jsSeed.js)

- [x] 2.1 Split JL06 into JL06a (binding/scope chain), JL06b (var hoisting), JL06c (TDZ/strict mode); chain prereqs JL05→JL06a→JL06b→JL06c
- [x] 2.2 Remove original JL06 node; update any downstream nodes that list JL06 as prereq to use JL06c
- [x] 2.3 Split JP03 into JP03a (generator coroutine mechanics, prereq JV06) and JP03b (async/await desugaring, prereqs JP01+JP03a)
- [x] 2.4 Remove original JP03 node; update downstream nodes referencing JP03 to use JP03b
- [x] 2.5 Split JC04 into JC04a (live bindings), JC04b (namespace objects, prereq JC04a), JC04c (circular deps, prereq JC04b); original prereqs of JC04 go to JC04a
- [x] 2.6 Remove original JC04 node; update JR03 prereq from JC04 to JC04c
- [x] 2.7 Split JR01 into JR01a (string interning), JR01b (encoding, prereq JR01a), JR01c (slices/cons, prereq JR01b); original prereqs go to JR01a
- [x] 2.8 Remove original JR01 node; update any nodes depending on JR01 to use JR01c
- [x] 2.9 Split JR03 into JR03a (module records), JR03b (dynamic import(), prereq JR03a), JR03c (import.meta, prereq JR03b); original prereqs go to JR03a
- [x] 2.10 Remove original JR03 node
- [x] 2.11 Split JO07 into JO07a (Proxy trap mechanism) and JO07b (Reflect API, prereq JO07a); original prereqs go to JO07a
- [x] 2.12 Remove original JO07 node
- [x] 2.13 Add JV01 to JO01's prerequisites list

## 3. P2 — C Systems Splits (cSeed.js)

- [x] 3.1 Split C200 into C200a (pointer arithmetic) and C200b (const/restrict qualifiers); C200a gets original prereqs, C200b prereqs C200a
- [x] 3.2 Remove original C200; update downstream nodes with C200 prereq to use C200b
- [x] 3.3 Split C221 into C221a (signal masks: sigprocmask) and C221b (self-pipe trick); C221a gets original prereqs, C221b prereqs C221a
- [x] 3.4 Remove original C221; update downstream nodes with C221 prereq to use C221b
- [x] 3.5 Split C400 into C400a (file descriptor basics) and C400b (dup2 and O_CLOEXEC); C400a gets original prereqs, C400b prereqs C400a
- [x] 3.6 Remove original C400; update downstream nodes with C400 prereq to use C400b
- [x] 3.7 Fix C212: correct its prerequisites AND split into two atomic sub-nodes per audit findings

## 4. P3 — C++ Critical Composite Splits (cppSeed.js)

- [x] 4.1 Split CV01 into CV01a (lvalue vs rvalue, move motivation) and CV01b (glvalue/prvalue/xvalue taxonomy); CV01a gets original prereqs, CV01b prereqs CV01a
- [x] 4.2 Remove original CV01; update downstream nodes to use CV01b
- [x] 4.3 Split CP07 into CP07a (virtual destructors) and CP07b (diamond inheritance + virtual bases); chain prereqs
- [x] 4.4 Remove original CP07; update downstream nodes
- [x] 4.5 Split CT04 into CT04a (variadic templates) and CT04b (fold expressions, prereq CT04a)
- [x] 4.6 Remove original CT04; update downstream nodes
- [x] 4.7 Split CT05 into CT05a (SFINAE) and CT05b (enable_if/type_traits, prereq CT05a); add template overload resolution note to CT05a keywords/prereqs
- [x] 4.8 Remove original CT05; update downstream nodes
- [x] 4.9 Split CC04 into CC04a (std::atomic lock-free operations) and CC04b (memory ordering semantics, prereq CC04a); add memory model concept to CC04b keywords
- [x] 4.10 Remove original CC04; update downstream nodes

## 5. P4 — Rust Prerequisite Fixes (rustSeed.js)

- [x] 5.1 Add G102 to A507's prerequisites list
- [x] 5.2 Add G101 to A505's prerequisites list (skipped — G101 already prereqs A505; adding G101 to A505 would create a cycle)
- [x] 5.3 Add "Send/Sync marker traits" to A700's or A701's keywords (or add a brief new node before A701 covering Send+Sync)
- [x] 5.4 Split X101 into X101a (trait-based mocking, prereq G101+X100) and X101b (proptest property testing, prereq X100)
- [x] 5.5 Remove original X101

## 6. P5 — Python Atomicity (pythonSeed.js)

- [x] 6.1 Split PD06 into PD06 (deque only), PD06b (Counter), PD06c (defaultdict); chain prereqs PD06→PD06b→PD06c
- [x] 6.2 Split PA04 into PA04 (asyncio.Queue) and PA04b (Lock/Event/Semaphore/Condition); PA04 gets original prereqs, PA04b prereqs PA04
- [x] 6.3 Split PA05 into PA05 (Thread+Lock) and PA05b (Event/Condition/RLock); chain prereqs
- [x] 6.4 Split PA06 into PA06 (Process), PA06b (Pool, prereq PA06), PA06c (Queue+shared_memory, prereq PA06b)
- [x] 6.5 Split PT07 into PT07 (TypedDict) and PT07b (Literal/Final/ClassVar); chain prereqs

## 7. P5 — Zig Atomicity (zigSeed.js)

- [x] 7.1 Split ZA03 into ZA03 (mem.copy + mem.eql), ZA03b (search functions), ZA03c (sort/reverse); chain prereqs ZA02→ZA03→ZA03b→ZA03c
- [x] 7.2 Update any downstream nodes with ZA03 as prereq to use ZA03c (no downstream nodes found)

## 8. Verification

- [x] 8.1 Run `npm test` — all curriculum tests pass (175/175)
- [x] 8.2 Verify no orphaned prerequisite IDs (no node lists a prereq that doesn't exist) — covered by "all prerequisite IDs resolve" tests in each track's test suite
- [x] 8.3 Spot-check one session generation for each track that had splits to confirm new node IDs work
