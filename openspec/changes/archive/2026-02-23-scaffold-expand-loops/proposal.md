## Why

The current pipeline generates lesson content and exercise files from single monolithic Codex calls, producing shallow output that doesn't reflect the depth or coherence a real learning experience requires. Replacing these with a scaffold-driven, self-terminating expand loop architecture allows Codex to iteratively build comprehensive, mutually-reinforcing lesson and exercise content — with Codex itself judging when each artifact is complete.

## What Changes

- **BREAKING** Remove `planner` stage and `lesson_plan_v1` schema
- **BREAKING** Remove `teacher` stage and `lesson_content_v1` schema
- **BREAKING** Remove `author` stage and `exercise_pack_v1` schema
- Add `scaffold` stage producing `scaffold_v1` — master plan driving all downstream loops (lesson intents, starter intents, test intents, exercise description)
- Add `starter-expand` loop: self-terminating Codex calls generating `starter_section_v1` payloads, assembled into workspace `src/` files
- Add `test-expand` loop: self-terminating Codex calls generating `test_section_v1` payloads (with starter code as context), assembled into workspace `tests/` files
- Add `lesson-expand` loop: self-terminating Codex calls generating `lesson_section_v1` payloads (with scaffold + starter + test context), assembled into `LESSON.md` in workspace
- Each expand call returns `is_complete` + `next_focus` — Codex drives its own termination; hard `MAX_ITERATIONS` cap per depth target and loop type is the safety guard
- Remove `study` CLI command — lesson is a file in the workspace, opened in the editor
- Remove `lessonContent` from session state; add `lessonFile` path
- Loop order: scaffold → starter → test → lesson (lesson last so bridge section references actual generated code)
- `MAX_ITERATIONS` per depth target: `D1 { starter:6, test:8, lesson:12 }`, `D2 { starter:8, test:10, lesson:15 }`, `D3 { starter:9, test:12, lesson:18 }`

## Capabilities

### New Capabilities

- `scaffold-generation`: The `scaffold` stage and `scaffold_v1` schema — single entry point that replaces the planner, produces the master plan for all three expand loops
- `expand-loop-generation`: The three self-terminating expand loops (starter, test, lesson) and their schemas (`starter_section_v1`, `test_section_v1`, `lesson_section_v1`); the `is_complete` + `next_focus` continuation contract; `MAX_ITERATIONS` safety guard; workspace assembly (LESSON.md + code files)

### Modified Capabilities

- `codex-lesson-orchestration`: Roles `planner`, `teacher`, `author` removed; roles `scaffold`, `starter-expand`, `test-expand`, `lesson-expand` added with their schema contracts
- `session-exercise-loop`: `setupExercise` replaced by scaffold + three sequential expand loops; `lessonContent` removed from session state; `study` command removed
- `learning-content-and-fixtures`: `lesson_plan_v1`, `lesson_content_v1`, `exercise_pack_v1` schemas removed; four new schemas added; fixtures updated accordingly
- `lesson-delivery`: lesson delivered as `LESSON.md` in workspace rather than via session state + CLI command; `study` requirement removed; lesson comprehensiveness requirement expanded

## Impact

- `src/orchestration/stages.js`: remove planner/teacher/author registrations; add scaffold + three expand stage registrations
- `src/session/exerciseLoop.js`: full rewrite of `setupExercise`; new `runExpandLoop` function
- `src/session/session.js`: remove `studySession`, remove `lessonContent` from session shape, add `lessonFile`
- `src/session/cli.js`: remove `study` command
- `src/schemas/`: remove `lesson_plan_v1`, `lesson_content_v1`, `exercise_pack_v1`; add `scaffold_v1`, `starter_section_v1`, `test_section_v1`, `lesson_section_v1`
- `src/validation/schemaValidator.js`: update schema registry
- `src/runtime/materialize.js`: update or replace to handle lesson file + code files from section arrays
- `tests/exercise-loop.test.js`: update `setupExercise` tests for new loop architecture
- `fixtures/`: remove author/planner fixtures; add scaffold + expand section fixtures
