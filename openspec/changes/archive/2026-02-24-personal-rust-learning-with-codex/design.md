## Context

This change introduces a personal-use Rust learning application whose primary value is high-quality learning content and tight interactive practice loops, not multi-user productization. The current repository has no existing runtime implementation, so this design defines a greenfield architecture that prioritizes:

- Strong Codex context contracts for every lesson interaction.
- Deterministic guardrails and validation over free-form generation.
- Fast local feedback through generated exercises and tests.
- Adaptive progression using misconception and mastery tracking.

Key constraints:

- Single-user and local-first operation.
- Rust toolchain (`cargo test`) is the interactive execution backbone.
- Codex CLI non-interactive mode (`codex exec`) is the generation and coaching engine.
- Outputs must be machine-validated with JSON schema and policy checks.

## Goals / Non-Goals

**Goals:**

- Build a curriculum graph that supports guided navigation and custom-topic mapping.
- Standardize role-based Codex orchestration (`planner`, `author`, `coach`, `reviewer`) with strict JSON outputs.
- Provide an interactive lesson loop: generate exercise -> run tests -> evaluate -> hint/remediate -> retry.
- Persist mastery and misconception state to adapt upcoming lessons.
- Ship reusable fixtures (golden valid/invalid packets) to harden prompts and guardrails before broad implementation.

**Non-Goals:**

- Multi-user accounts, auth, collaboration, or cloud sync.
- Public content marketplace or polished distribution platform features.
- Fully autonomous code execution without policy validation gates.
- Generic language-learning support beyond Rust in this change.

## Decisions

### 1) Curriculum as a prerequisite graph, not a linear syllabus

Decision:

- Model topics as nodes with dependencies, depth targets (`D1/D2/D3`), and top misconception tags.
- Allow both guided traversal and custom-topic entry that maps to nearest nodes and prerequisite gaps.

Rationale:

- Rust learning quality depends on prerequisite integrity (ownership and borrowing concepts compound).
- Graph structure supports remediation and detours better than a strict chapter sequence.

Alternatives considered:

- Linear course modules: simpler initially, but weak at adaptive remediation.
- Purely free-form prompting: flexible but too inconsistent for reliable progression.

### 2) Role-separated Codex pipeline with strict schemas

Decision:

- Use separate Codex roles:
  - `planner` -> `lesson_plan_v1`
  - `author` -> `exercise_pack_v1`
  - `coach` -> `hint_pack_v1`
  - `reviewer` -> `review_report_v1`
- Every role output is validated against JSON schema before use.

Rationale:

- Role isolation reduces prompt drift and makes failures diagnosable.
- Schema validation creates deterministic contracts and enables fixture-based regression checks.

Alternatives considered:

- Single general tutor prompt: faster to start, but high drift and poor debuggability.
- Partially structured JSON: less setup, but weaker enforcement and harder automation.

### 3) Context Packet v1 as mandatory input contract

Decision:

- Use one canonical context packet format for all role calls with role-specific filtered views.
- Include node/depth, top misconception tags, recent failures, attempt/hint state, compiler/test evidence, and reveal policy.
- Fail closed on missing required fields.

Rationale:

- Codex quality depends on context completeness; ad hoc prompts degrade quickly.
- Single packet model keeps orchestration predictable and auditable.

Alternatives considered:

- Per-role custom payloads only: can optimize size but increases divergence and maintenance risk.
- Minimal context prompts: lower token usage but poor adaptation and coaching quality.

### 4) Policy engine gate after schema validation

Decision:

- Apply deterministic policy rules after schema validation and before accepting outputs.
- Examples: no early full-solution reveal in Phase A, no advancement on prereq failure, reject logical contradictions (e.g., PASS with failing evidence).

Rationale:

- JSON schema catches structure, not pedagogical safety or behavioral consistency.
- Policy gates enforce learning intent and strictness mode.

Alternatives considered:

- Prompt-only guardrails: insufficiently reliable.
- Human-only review: too slow for interactive loops.

### 5) Tests-first exercise runtime with local execution

Decision:

- Exercises include starter code + tests; learner iterates locally with `cargo test`.
- Reviewer/coach consume real compiler/test outputs for diagnosis and hints.

Rationale:

- Rust learning is strongest when tied to compiler behavior and test outcomes.
- Local runs keep iteration fast and personal.

Alternatives considered:

- Theory-first sessions with sparse coding: weaker retention.
- Browser-based remote runner: unnecessary complexity for personal local use.

### 6) Hybrid strictness policy with strict Phase A foundations

Decision:

- Enforce strict reveal/hint policy in foundational Rust topics.
- Use misconception-tag repetition to trigger bridge lessons and narrower exercises.

Rationale:

- Foundational misunderstanding compounds heavily in Rust.
- Strictness early with adaptive remediation maximizes long-term learning depth.

Alternatives considered:

- Always flexible mode: better short-term flow, worse conceptual rigor.
- Always strict mode: potentially too frustrating and brittle for regular use.

## Risks / Trade-offs

- [Prompt/schema maintenance overhead] -> Mitigation: keep versioned schemas (`*_v1`), fixture suite, and incremental schema evolution.
- [Over-constraining Codex output reduces creativity] -> Mitigation: constrain structure/policy, leave lesson narrative fields open.
- [Policy false positives block useful responses] -> Mitigation: log rejection reasons and allow explicit override mode for manual review sessions.
- [Context packet bloat increases cost/latency] -> Mitigation: support `micro`, `standard`, `deep` packet tiers while preserving required fields.
- [Misconception tagging drift over time] -> Mitigation: track tag confidence and add periodic taxonomy review.
- [Generated tests might overfit or under-assess] -> Mitigation: require at least one trap condition and one transfer check per node depth.

## Migration Plan

1. Establish repository structure for curriculum data, schemas, orchestration prompts, fixtures, and runtime state.
2. Implement context packet builder/validator and role adapters.
3. Add role schemas and policy engine with fixture-driven validation.
4. Stand up the first interactive loop for one seed node (`A203`) using golden packets/outputs.
5. Expand to broader Phase A nodes and misconception mapping once loop reliability is proven.
6. Enable full progression flow: guided + custom-topic entry + mastery updates.

Rollback strategy:

- Keep all artifacts and schema versions additive.
- If orchestration becomes unstable, revert to last known-good schema/prompt versions and fixture baseline.
- Disable advanced adaptation features (custom-topic mapping, transfer checks) while preserving basic guided flow.

## Open Questions

- Should custom-topic mapping be purely heuristic in v1, or use embedding-based similarity later?
- What is the minimum viable persistence format for mastery/misconception history (flat files vs local DB)?
- How strict should policy be when user explicitly requests a full solution before threshold?
- Do we require hidden tests for every D3 node in v1, or allow optional transfer checks for early rollout?
- What telemetry (local-only) is needed to improve prompts without over-instrumenting a personal project?
