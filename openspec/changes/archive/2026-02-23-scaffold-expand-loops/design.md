## Context

The current pipeline uses three single-shot Codex calls (planner → teacher → author) to set up a session. Each call produces a monolithic JSON blob. The teacher call produces `lesson_content_v1` stored in session state and re-displayed via `npm run session study`. The author call produces `exercise_pack_v1` with all starter and test files in a single payload.

This architecture limits output depth: each call has a single opportunity to generate its content, and schema constraints (especially OpenAI structured output compatibility) force content into typed fields rather than free-form depth.

The replacement is a scaffold-driven, self-terminating expand loop architecture. One scaffold call produces a master plan, then three sequential loops each iterate until Codex signals completion, generating richer content across multiple focused calls.

Key files: `src/orchestration/stages.js`, `src/session/exerciseLoop.js`, `src/session/session.js`, `src/session/cli.js`, `src/runtime/materialize.js`, `src/schemas/`, `src/validation/schemaValidator.js`.

## Goals / Non-Goals

**Goals:**
- Replace planner/teacher/author with scaffold + three self-terminating expand loops
- Lesson content written as LESSON.md to workspace (not session state)
- Codex drives loop termination via `is_complete` signal; hard cap is the safety net
- Lesson loop runs last with full context of generated code (enables coherent bridge section)
- Coach, reviewer, attempt loop, mastery model all unchanged

**Non-Goals:**
- No streaming or incremental display of generation progress
- No retry logic within the expand loop (a failed expand call terminates the loop gracefully)
- No parallel loop execution (sequential is simpler and context accumulation requires it)
- No changes to the guided nav, custom topic flow, or mastery persistence

## Decisions

### 1. Scaffold replaces planner entirely — no dual-planner approach

The planner produced a lesson-exercise plan. The scaffold produces the same information plus starter and test intents. Running both would be redundant. The scaffold's `exercise_description` replaces the planner's `objective`. The author-level exercise planning now lives inside the scaffold's `starter_plan` and `test_plan` intent arrays.

### 2. Self-termination via inline `is_complete` + `next_focus` — not a separate judge call

Alternative: after each expand call, run a separate "judge" call asking "is this loop complete?" — cleaner separation of concerns but doubles the call count. The inline approach (`is_complete` in the section schema) is more efficient and gives Codex full context to self-assess. For a personal project this is the right tradeoff.

### 3. Context accumulation passes full prior sections — not summaries

Each expand call receives all previously generated sections for its loop type, plus the scaffold. For lesson sections this means later calls have full markdown context (rich, coherent). For starter/test sections this means later calls see actual code (can avoid duplicating function signatures, ensure test names build on each other). The theoretical token cost is acceptable at flat-rate pricing and the quality benefit is significant.

### 4. `runExpandLoop` is a single shared function parameterized by loop type

```javascript
async function runExpandLoop(loopType, scaffold, priorSections, session, options = {}) {
  const max = MAX_ITERATIONS[session.depthTarget ?? "D2"][loopType];
  const sections = [];
  let nextFocus = null;
  while (sections.length < max) {
    const packet = buildExpandPacket(loopType, scaffold, priorSections, sections, nextFocus, session);
    const result = await runStage(loopType + "-expand", packet, options[loopType] ?? {});
    if (!result.accepted) { printStageError(loopType + "-expand", result); return null; }
    sections.push(result.payload);
    if (result.payload.is_complete) break;
    nextFocus = result.payload.next_focus ?? null;
  }
  return sections;
}
```

`priorSections` is the accumulated output of earlier loops (e.g. starter sections when running the test loop). `sections` is this loop's own accumulation.

### 5. Assembly is a pure formatting step — no additional Codex call

Lesson sections are concatenated in order into LESSON.md. Starter and test sections are merged by file path (sections targeting the same file path are appended). No extra "assemble" Codex call — the content arrives ready to write.

### 6. `exercise_pack_v1` replaced — `exerciseId` derived from scaffold

The current `exerciseId` comes from `exercise_pack_v1.exercise_id`. With the new architecture, `exerciseId` is derived from `scaffold_v1.scaffold_id` (same concept, different source). The attempt state and reviewer context packet use `exerciseId` — this field is preserved, just sourced differently.

### 7. `lessonContent` removed from session state; `lessonFile` added

The session state no longer stores the lesson blob. It stores the path to LESSON.md. The `study` command is removed — the file is the artifact.

### 8. Old schemas removed from registry but files kept temporarily

`lesson_plan_v1`, `lesson_content_v1`, and `exercise_pack_v1` schema files are removed from `SCHEMA_FILES` in `schemaValidator.js`. The JSON files can be deleted. Old fixtures in `fixtures/valid/planner/`, `fixtures/valid/author/`, and `fixtures/valid/teacher/` are removed.

## Risks / Trade-offs

**[Longer session startup]** → Three loops × up to 18 iterations each = potentially many Codex calls. At D3 max, this could be 39 calls. Mitigation: loops terminate early via `is_complete`; in practice expect 4-8 calls per loop. Flat-rate plan makes this acceptable.

**[Test coherence with starter code]** → Test sections reference the starter code, but the test loop runs as a separate set of calls that accumulate context from starter sections. If starter code is ambiguous, tests may reference wrong signatures. Mitigation: `next_focus` in test loop can be seeded with starter file summary; scaffold `exercise_description` provides the contract both loops work from.

**[LESSON.md bridge quality]** → The bridge section references "actual generated code" but only has markdown context of prior sections, not compiled output. Codex may generate plausible-but-wrong function names. Mitigation: acceptable for personal use; reviewer will catch if exercise diverges significantly.

**[Failed mid-loop expand call]** → If an expand call fails (EXECUTION_FAILED or schema fail) mid-loop, the current design returns null and aborts setup. Alternative: proceed with partial sections. Chosen approach (abort) is simpler and consistent with existing stage failure behavior.

## Migration Plan

1. Remove `study` command from CLI and session.js
2. Remove `lessonContent` from session state shape
3. Add four new schemas to `src/schemas/`
4. Register new schemas in schemaValidator.js, deregister old three
5. Rewrite `setupExercise` in exerciseLoop.js
6. Update `materialize.js` for new assembly approach
7. Update session state shape (`lessonFile` added)
8. Remove old schema files and fixtures
9. Add new fixtures for scaffold + three section schemas
10. Update tests

No database migrations. The `.state/` directory change is backward-incompatible for existing sessions (old sessions have `lessonContent`, not `lessonFile`) — a fresh start (`rm -rf .state/sessions .state/progress`) is the rollback.

## Open Questions

None — architecture fully specified in explore session.
