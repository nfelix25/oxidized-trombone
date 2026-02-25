## Why

The curriculum audit (2026-02-25) identified ~50 nodes across all language tracks that violate the atomic, self-contained-from-first-principles standard: they conflate 2–4 distinct concepts into a single exercise unit, making stubs too broad for learners to tackle without external reference. Additionally, one node (C241) uses a Linux-only API that won't compile on macOS (the sole deployment target), and one Rust node (S105) has a prerequisite ordering bug that blocks two downstream nodes.

## What Changes

- **Split JS Runtime composite nodes** into atomic sub-nodes (P1): JL06→3, JP03→2, JC04→3, JR01→3, JR03→3, JO07→2 — net +10 nodes in jsSeed.js
- **Fix C241 epoll bug** (P0): replace epoll with poll; WILL NOT COMPILE on macOS otherwise
- **Fix S105 prerequisite ordering** (P0): split S105 into S105a (closure syntax, prereq S101) and S105b (Fn/FnMut/FnOnce trait bounds, prereq G101); fixes blocked A210 and C101
- **Split C systems composite nodes** (P2): C200→2, C221→2, C400→2, C212 (fix prereqs + split)
- **Split C++ critical composite nodes** (P3): CV01→2, CP07→2, CT04→2, CT05→2, CC04→2
- **Fix Rust prerequisite issues** (P4): A507 (add G102 prereq), A505 (reorder after G101), add Send/Sync intro before A701, fix X101 split
- **Split Python/Zig high-priority composites** (P5): PD06→3, PA04/PA05/PA06 splits, PT07→2, ZA03→3
- Update all prerequisite references in seed files to point to the new sub-node IDs where needed

## Capabilities

### New Capabilities
*(none — these are structural improvements to existing curriculum data)*

### Modified Capabilities
- `js-runtime-curriculum`: 7 composite nodes split into atomic sub-nodes; ~10 new node IDs added
- `rust-learning-curriculum`: S105 split into S105a/b; A507/A505/A701 prerequisite fixes; X101 split
- `c-learning-curriculum`: C241 API fix (epoll→poll); C200/C221/C400/C212 splits
- `cpp-curriculum`: CV01/CP07/CT04/CT05/CC04 splits
- `python-curriculum`: PD06/PA04/PA05/PA06/PT07 splits
- `zig-curriculum`: ZA03 split

## Impact

- `src/curriculum/jsSeed.js` — ~10 new nodes, 7 nodes replaced/split
- `src/curriculum/rustSeed.js` — S105a/b split, prereq field changes on A507/A505/A701/C101, X101 split
- `src/curriculum/rustToolchainSeed.js` — no changes (audit found these in good shape)
- `src/curriculum/cSeed.js` — C241 apiNote field changed; C200/C221/C400/C212 split
- `src/curriculum/cppSeed.js` — CV01/CP07/CT04/CT05/CC04 split
- `src/curriculum/pythonSeed.js` — PD06/PA04/PA05/PA06/PT07 split
- `src/curriculum/zigSeed.js` — ZA03 split
- No API or schema changes; no runtime behavior changes; exercises are purely additive/restructured curriculum data
