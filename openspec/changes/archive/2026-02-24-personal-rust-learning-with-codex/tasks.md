## 1. Project Foundation

- [x] 1.1 Create initial project layout for curriculum data, orchestration, schemas, runtime, state, and fixtures.
- [x] 1.2 Add configuration file for local runtime settings (strictness, reveal thresholds, session defaults).
- [x] 1.3 Define shared domain types for nodes, attempts, hints, reviews, mastery, and misconception tags.
- [x] 1.4 Add local persistence abstraction with pluggable backends (file-backed first).

## 2. Curriculum Graph and Topic Selection

- [x] 2.1 Implement curriculum node model with prerequisites, depth target, and misconception tag metadata.
- [x] 2.2 Seed initial Rust graph data including guided tracks and node dependency edges.
- [x] 2.3 Implement guided next-node selector that filters out nodes with unmet prerequisites.
- [x] 2.4 Implement guided narrowing flow from broad track to specific eligible nodes.
- [x] 2.5 Implement custom-topic mapping to nearest curriculum nodes.
- [x] 2.6 Implement prerequisite gap reporting for mapped custom topics.

## 3. Context Packet and Schema Contracts

- [x] 3.1 Implement `context_packet_v1` builder from learner state, node data, and attempt evidence.
- [x] 3.2 Implement required-field validator that fails closed on missing context fields.
- [x] 3.3 Add role adapters that derive filtered payloads for `planner`, `author`, `coach`, and `reviewer`.
- [x] 3.4 Add JSON schema files for `lesson_plan_v1`, `exercise_pack_v1`, `hint_pack_v1`, and `review_report_v1`.
- [x] 3.5 Implement schema validation step for all role outputs before downstream processing.

## 4. Codex Orchestration and Policy Engine

- [x] 4.1 Implement non-interactive Codex invocation wrapper (`codex exec`) with deterministic command assembly.
- [x] 4.2 Implement planner stage invocation and response handling.
- [x] 4.3 Implement author stage invocation and response handling.
- [x] 4.4 Implement coach stage invocation and response handling.
- [x] 4.5 Implement reviewer stage invocation and response handling.
- [x] 4.6 Implement policy engine checks for reveal gating and output consistency constraints.
- [x] 4.7 Implement rejection handling with machine-readable policy violation reasons.

## 5. Interactive Exercise Runtime

- [x] 5.1 Implement exercise materialization from `exercise_pack_v1` into local workspace files.
- [x] 5.2 Implement local command runner for exercise execution (`cargo test`) with captured stdout/stderr.
- [x] 5.3 Implement attempt lifecycle tracking (attempt index, hint level, elapsed time, run outcomes).
- [x] 5.4 Implement progressive hint ladder flow (`L1`, `L2`, `L3`) bound to policy checks.
- [x] 5.5 Implement reviewer feedback integration after each attempt with persisted outcomes.

## 6. Mastery and Misconception Adaptation

- [x] 6.1 Implement per-node mastery state storage and update rules for depth outcomes.
- [x] 6.2 Implement misconception tag recording from reviewer/coach outputs.
- [x] 6.3 Implement rolling tag-frequency tracking for remediation thresholds.
- [x] 6.4 Implement remediation scheduler for bridge lessons and narrower follow-up exercises.
- [x] 6.5 Implement next-node recommendation engine using prerequisites, mastery, and risk indicators.

## 7. Fixtures and Guardrail Validation

- [x] 7.1 Add golden valid fixtures for A203 (`D1`, `D2`, `D3`) context packets.
- [x] 7.2 Add golden valid role outputs for planner/author/coach/reviewer per A203 packet.
- [x] 7.3 Add invalid fixtures for schema and policy violations (including early full-solution reveal).
- [x] 7.4 Implement fixture test harness that runs schema and policy validations across all fixtures.
- [x] 7.5 Implement fixture result reporter with explicit failing rule and machine-readable reason.

## 8. End-to-End Seed Flow and Readiness

- [x] 8.1 Implement end-to-end seed lesson flow for A203 from planning through review and mastery update.
- [x] 8.2 Add integration test for guided selection -> exercise generation -> run -> hint -> review loop.
- [x] 8.3 Add integration test for custom-topic mapping with prerequisite gap handling.
- [x] 8.4 Document local runbook for generating lessons and running interactive sessions.
- [x] 8.5 Verify full change acceptance by mapping each spec requirement to at least one passing test or fixture.
