# Local Runbook

## Prerequisites

- Node.js 20+
- Rust toolchain (`rustc`, `cargo`)
- Codex CLI authenticated locally

## Core Commands

- Run tests: `npm test`
- Run fixture validation: `npm run test:fixtures`
- Run seed A203 flow: `npm run seed:a203`
- Start a learning session: `npm run session start`
- Resume active session: `npm run session resume`
- End session and show summary: `npm run session end`
- Show session status: `npm run session status`

## Session Workflow

### Starting a new session

```
npm run session start
```

You will be prompted to:
1. Select **guided** (browse tracks and eligible nodes) or **custom** (type a topic)
2. Choose a specific node to study

The session is saved to `.state/sessions/active_session.json`.

### Guided mode

- Lists available tracks and shows eligible/blocked nodes
- Blocked nodes display missing prerequisite IDs
- Select from eligible nodes to start

### Custom topic mode

- Enter any Rust topic string (e.g. "mutable references", "async await")
- System maps to closest curriculum nodes and shows prerequisite gaps
- If no nodes match, suggests adjacent topic areas

### During a session

The session tracks:
- Attempts with `cargo test` output (stdout/stderr/exit code)
- Hint level usage (L1 → L2 → L3)
- Review outcomes (PASS/FAIL/score/dominant misconception tag)
- Mastery state per node

### Ending a session

```
npm run session end
```

Outputs session summary:
- Total attempts, pass/fail breakdown
- Dominant misconception tags
- Recommended next nodes

## Fallback Mode

Set `STAGE_FALLBACK=1` to disable live Codex execution:

```
STAGE_FALLBACK=1 node src/seed/a203Flow.js
```

In fallback mode:
- Stages require a `fallbackPayload` option to be provided
- Schema and policy checks still run on fallback payloads
- Use this when Codex CLI is unavailable or for deterministic testing

## Stage Retry Configuration

Per-stage retry behavior is controlled via `src/orchestration/retry.js`.

Defaults:
- `maxAttempts: 3`
- `baseDelayMs: 500`
- `backoffMultiplier: 2`

Only `EXECUTION_FAILED` results are retried. Schema and policy failures fail immediately.

## Audit Logs

Schema and policy failures are appended to `.state/audit/failures.jsonl` with:
- `at`: ISO timestamp
- `stage`: which stage failed
- `schemaName`: which schema
- `reason`: failure category
- `ruleIds`: policy rule identifiers triggered
- `packetId`, `nodeId`: for traceability

## Workspace Files

Per-session exercise workspaces are created in `.state/workspaces/`.

Sessions are ephemeral by default. To inspect generated files after a run, they remain on disk until the next session cleanup.

## Typical Session Flow

1. `npm run session start` — select mode and node
2. System runs planner → author → materializes files to workspace
3. Learner edits `src/lib.rs`, system runs `cargo test -q`
4. Coach provides progressive hints (L1 → L2 → L3)
5. Reviewer evaluates attempt evidence and updates mastery
6. Session ends with `npm run session end` → summary + next-node recommendations

## Troubleshooting

- **Schema validation fails**: inspect reported field path and compare to `src/schemas/*.schema.json`
- **Policy rejects output**: check rule ID in `.state/audit/failures.jsonl`
- **Custom topic maps to nothing**: expand node keywords in `src/curriculum/seed.js`
- **Codex CLI not available**: run with `STAGE_FALLBACK=1` and provide fixture payloads
- **`cargo test` fails to find workspace**: check `.state/workspaces/` and verify Cargo.toml is present
