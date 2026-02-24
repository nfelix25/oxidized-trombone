# Local Runbook

## Prerequisites

- Node.js 20+
- Rust toolchain (`rustc`, `cargo`)
- Codex CLI authenticated locally

## Core Commands

- Run tests: `npm test`
- Run fixture validation: `npm run test:fixtures`
- Run seed A203 flow: `npm run seed:a203`

## Typical Session Flow

1. Build or load a `context_packet_v1` for the next stage.
2. Invoke stage pipeline (`planner`, `author`, `coach`, `reviewer`) with schema validation.
3. Materialize generated exercise files to workspace.
4. Run learner attempts with `cargo test` and capture outcomes.
5. Persist attempt/review state and update mastery + misconceptions.
6. Use recommendation output to pick next guided node or remediation path.

## Troubleshooting

- If schema validation fails, inspect reported field path and fixture examples.
- If policy rejects output, inspect rule id from fixture reporter.
- If custom-topic mapping returns no nodes, expand node keywords in curriculum seed.
