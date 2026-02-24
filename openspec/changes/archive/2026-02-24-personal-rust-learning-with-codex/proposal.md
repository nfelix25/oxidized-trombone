## Why

I want a personal Rust learning application that maximizes learning depth through hands-on practice, not passive reading. I need consistent Codex-driven lesson generation with strong guardrails, structured context, and test-based interactivity so each session adapts to what I actually understand or struggle with.

## What Changes

- Create a single-user Rust learning workflow with guided topic selection and custom-topic entry.
- Add a curriculum graph with prerequisite-aware navigation so lessons can narrow from broad tracks into specific skills.
- Add Codex orchestration contracts (planner/author/coach/reviewer roles) with strict JSON schema outputs and policy validation.
- Add an interactive exercise loop that uses generated starter code, tests, hint ladders, and evaluation feedback.
- Add a misconception-tag and mastery model to adapt future lessons, remediation, and progression.
- Add reusable scaffolding fixtures (golden packets, valid outputs, invalid policy cases) to harden prompt and guardrail behavior before full implementation.

## Capabilities

### New Capabilities

- `rust-learning-curriculum`: Topic graph and prerequisite model for Rust fundamentals through advanced practice, including guided and custom-topic selection.
- `codex-lesson-orchestration`: Non-interactive Codex pipeline with role-specific prompts, strict output schemas, and deterministic policy enforcement.
- `interactive-exercise-runtime`: Local learning loop for generated exercises, tests, hints, retries, and optional reveal flows.
- `mastery-and-misconception-model`: Per-node mastery tracking, misconception tagging, remediation strategy, and adaptive next-node selection.
- `learning-content-and-fixtures`: Canonical lesson/exercise/hint/review content formats plus golden valid/invalid fixtures for validation and regression checks.

### Modified Capabilities

- None.

## Impact

- Adds new project structure for curriculum data, orchestration configs, schemas, policy checks, lesson content, and runtime session state.
- Introduces dependency on local Rust tooling (`rustc`, `cargo`, `cargo test`) as a core runtime requirement.
- Introduces dependency on Codex CLI non-interactive execution (`codex exec`) and schema-based output validation.
- Establishes a spec-first contract for content quality, guardrails, and adaptive behavior before implementation begins.
