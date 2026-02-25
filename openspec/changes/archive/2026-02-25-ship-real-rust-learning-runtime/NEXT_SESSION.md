# Next Session Handoff

## Active Change

- Change: `ship-real-rust-learning-runtime`
- Schema: `spec-driven`
- Artifact status: `4/4 complete`
- Implementation status: `0/41 tasks complete`

## Ready-to-Run Commands

From repo root:

```bash
# 1) Confirm active change and task queue
openspec list --json
openspec status --change "ship-real-rust-learning-runtime" --json
openspec instructions apply --change "ship-real-rust-learning-runtime" --json

# 2) Re-validate current baseline before starting implementation
npm test
npm run test:fixtures

# 3) Start implementation
# In Codex: /opsx:apply ship-real-rust-learning-runtime
```

## First Task Slice (recommended)

Start with Task Group 1 and 2 in this order:

1. `1.1` CLI entrypoint scaffolding (`start/resume/end/status`)
2. `1.2` guided/custom mode selection UX
3. `1.3` session bootstrap/load wiring
4. `2.1` live `codex exec` stage wiring (planner/author/coach/reviewer)
5. `2.4` schema+policy gate enforcement before state mutation

This creates the earliest end-to-end vertical slice.

## Files to Read First

- `openspec/changes/ship-real-rust-learning-runtime/tasks.md`
- `openspec/changes/ship-real-rust-learning-runtime/design.md`
- `src/orchestration/stages.js`
- `src/orchestration/codexExec.js`
- `src/runtime/commandRunner.js`
- `src/curriculum/selectors.js`

## Current Baseline Verification

As of handoff:

- `npm test` passed
- `npm run test:fixtures` passed
- Active change list contains only `ship-real-rust-learning-runtime`

## Notes

- Previous change is archived at `openspec/changes/archive/2026-02-24-personal-rust-learning-with-codex` and specs are synced to `openspec/specs`.
- OpenSpec telemetry calls may print network warnings (`edge.openspec.dev` DNS) in this environment; they did not block local workflow.
