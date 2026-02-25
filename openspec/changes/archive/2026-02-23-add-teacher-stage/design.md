## Context

The current session pipeline runs two Codex stages at startup (planner → author) and assumes the learner already understands the material. Learners have no instruction before being handed a coding exercise.

The pipeline is implemented across three files:
- `src/orchestration/stages.js` — `STAGE_TO_SCHEMA` map, `runStage`, per-role exports
- `src/session/exerciseLoop.js` — `setupExercise` orchestrates planner → author; each stage gets a typed context packet
- `src/session/session.js` — CLI command handlers, session state schema, `createNewSession`

Adding the teacher stage means inserting one new Codex call between planner and author in `setupExercise`, defining a new `lesson_content_v1` schema, storing the output in session state, and adding a `study` CLI command.

## Goals / Non-Goals

**Goals:**
- Insert `teacher` stage between planner and author in `setupExercise`
- Define `lesson_content_v1` schema (lesson body, worked examples, misconception callouts, resources array)
- Store `lessonContent` in session state alongside `exercisePack`
- Add `study` CLI command to re-display lesson content
- Add valid and invalid fixtures for `lesson_content_v1`
- Add integration test covering the three-stage setup flow

**Non-Goals:**
- No policy engine rules for teacher output (it is informational; no pedagogical guardrails like reveal restrictions apply)
- No retry logic specific to the teacher stage (existing `withRetry` can wrap it if needed later)
- No streaming or incremental display of lesson content
- No persistent storage of lesson history across sessions

## Decisions

### 1. Teacher context packet includes planner output

The teacher needs to align lesson content with the planned objectives. The simplest approach is to pass `plannerResult.payload` as `lesson_plan` inside `curriculumContext`, mirroring how `buildAuthorPacket` already does this. A separate `plannerContext` field was considered but adds no value — the lesson plan is curriculum context.

### 2. `lesson_content_v1` schema uses a flat `resources` array with an enum `kind` field

Resources could be typed as separate arrays per kind (e.g., `book_links`, `playground_links`). A single flat `resources` array with a `kind` enum is simpler, extensible, and consistent with how `hint_pack_v1` uses a single `current_hint` object. Allowed kinds: `book`, `reference`, `playground`, `blog`.

Resources contain AI-generated URLs. These may be hallucinated — this is an accepted risk for a personal learning tool where the learner can verify links manually.

### 3. Schema must be OpenAI structured-output compatible

All four existing schemas were already patched to comply. `lesson_content_v1` will follow the same rules from the start:
- Every `const` field includes `"type": "string"`
- No union types (`["string", "null"]`) — use `anyOf: [{type: string}, {type: null}]` instead
- Every `object` type has explicit `properties` and `"additionalProperties": false`
- No `minItems` constraints

### 4. Teacher stage failure aborts setup (same contract as planner/author)

If the teacher stage fails, `setupExercise` returns `null` and sets `process.exitCode = 1`, identical to how planner and author failures are handled. There is no fallback to "skip the lesson" — a missing lesson would defeat the feature's purpose and leave `lessonContent: null` in a confusing state.

### 5. `study` command is a read-only display function, no new stage call

`studySession` reads `session.lessonContent` from stored session state and prints it. It does not invoke any Codex stage. This mirrors how `showSession` displays the exercise pack and `reviewSession` displays the stored reviewer verdict — all are read-only re-displays of already-stored AI output.

### 6. `lessonContent: null` added to `createNewSession`

Session state gets a `lessonContent: null` field so all sessions have a consistent shape regardless of whether teacher ran. `setupExercise` sets this field after teacher succeeds, alongside `exercisePack` and `workspaceDir`.

### 7. Test coverage via fallback payload in exercise-loop.test.js

The existing `setupExercise` test uses `plannerOptions` and `authorOptions` with `fallback: true`. A new `TEACHER_PAYLOAD` fixture and `teacherOptions` parameter will be added to `setupExercise`'s options object and threaded through. This keeps tests self-contained without real Codex calls.

## Risks / Trade-offs

**[Startup latency]** → Three Codex calls at session start (planner → teacher → author) instead of two. Mitigation: acceptable for a personal tool; no interactive user is waiting in a tight loop.

**[Hallucinated resource URLs]** → Codex generates resource links that may not exist or may be incorrect. Mitigation: the learner is expected to verify links; this is a personal tool, not a production system.

**[Lesson body length]** → `lesson_body` is a free-form markdown string with no length bounds enforced by schema. Mitigation: Codex prompt (in `buildTeacherPacket`) can instruct a target length; schema validation won't enforce it.

**[Fixture maintenance]** → Adding `lesson_content_v1` requires maintaining valid/invalid fixtures. Mitigation: fixtures are simple JSON files following the same pattern as existing ones.

## Migration Plan

No migration needed. `lessonContent: null` is backward-compatible with existing serialized sessions — sessions that predate the teacher stage will have `lessonContent` as `undefined` (treated as `null` by the `study` command).

## Open Questions

None — requirements and approach are fully specified by proposal and specs.
