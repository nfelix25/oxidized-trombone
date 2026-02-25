## Context

The curriculum is represented as JS arrays of node objects in `src/curriculum/*Seed.js` files. Each node has: `id`, `title`, `track`, `prerequisites` (array of node IDs), `depth`, `language`, and metadata fields (`keywords`, `misconceptions`, `apiNote`). All edits are pure data: no runtime code changes, no schema changes, no UI changes.

A "composite node" is one that bundles 2+ distinct first principles into a single exercise unit. The fix is always: replace the single node with N sub-nodes at new IDs (e.g. JL06 → JL06a, JL06b, JL06c), update each sub-node's prerequisites to form the correct chain, and update any downstream nodes that listed the original as a prerequisite.

## Goals / Non-Goals

**Goals:**
- Every modified track has no composite nodes at P0-P1 priority levels
- C241 compiles on macOS
- S105/A210/C101 prerequisite chain is unblocked in Rust core
- All new sub-node IDs follow the `<parent>a`, `<parent>b`, `<parent>c` naming convention

**Non-Goals:**
- No changes to runtime code, session flow, or exercise generation
- Not fixing every borderline node (only COMPOSITE-A and COMPOSITE-B categories from the audit)
- Not adding entirely new curriculum content (that's the separate expand-c-systems and add-js-runtime changes)
- Not touching the Rust Toolchain track (XL/XP/XA/etc.) — already in good shape

## Decisions

**Decision: Sub-node chaining pattern**
When splitting node X into Xa, Xb, Xc:
- Xa gets X's original prerequisites
- Xb gets `[Xa]` as its prerequisite (plus any other original prereqs it uniquely needs)
- Xc gets `[Xb]`
- Downstream nodes that required X now require the *last* sub-node in the chain (Xc), to ensure all concepts are covered before progression
- Rationale: preserves original learning order while ensuring each sub-node is independently exercisable

**Decision: Preserve original node IDs where possible (Bug fixes only)**
For C241, we fix in-place: same ID, just change `apiNote` from epoll to poll. No ID change needed.
For S105, we introduce S105a + S105b, and S105 itself is removed. Downstream nodes A210 and C101 update their prereqs from `"S105"` to `"S105b"`.
Rationale: minimal downstream impact.

**Decision: Depth targets on sub-nodes**
Sub-nodes inherit the parent's depth target unless one sub-concept is clearly simpler than the other. In practice most splits keep the same depth for both children.

**Decision: Track assignment**
All sub-nodes stay in the same track as the original node. Track metadata doesn't change.

## Risks / Trade-offs

**[Risk] Existing sessions reference old node IDs**
→ Mitigation: Sessions in `.state/` are ephemeral per user (single user). No migration needed — old sessions simply won't match new node IDs, but since there's only one user, this is acceptable. Confirm with user if needed.

**[Risk] Missing a downstream prereq reference**
→ Mitigation: For each split, grep the seed file for uses of the old node ID as a prerequisite before saving the changes, to catch all downstream references.

**[Risk] Sub-node content overlap**
→ Mitigation: Write distinct titles and keyword sets that don't overlap. The first principle in each sub-node's title must be uniquely nameable.

## Migration Plan

1. Implement in priority order P0 → P5 (C241 fix, S105 fix, JS splits, C splits, C++ splits, Rust/Python/Zig)
2. After each phase, run `npm test` to ensure seed file tests pass
3. No deployment steps needed (personal local CLI)
4. Rollback: git revert the relevant commit(s)

## Open Questions

- None — audit findings are definitive, scope is clear.
