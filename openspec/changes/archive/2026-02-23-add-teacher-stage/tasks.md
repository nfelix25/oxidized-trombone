## 1. Schema

- [x] 1.1 Create `src/schemas/lesson_content_v1.schema.json` with required fields: `schema_version` (const "lesson_content_v1"), `role` (const "teacher"), `lesson_id`, `node_id`, `depth_target` (enum D1/D2/D3), `lesson_body`, `worked_examples` (array), `misconception_callouts` (array), `resources` (array)
- [x] 1.2 Define `worked_examples` items as objects with `additionalProperties: false` and required fields `title`, `code`, `explanation`
- [x] 1.3 Define `misconception_callouts` items as objects with `additionalProperties: false` and required fields `tag`, `description`
- [x] 1.4 Define `resources` items as objects with `additionalProperties: false` and required fields `title`, `url`, `kind` (enum: `book`, `reference`, `playground`, `blog`)
- [x] 1.5 Verify schema passes OpenAI structured-output constraints: no union types, all objects have explicit `properties` and `additionalProperties: false`, all `const` fields have `"type": "string"`

## 2. Stage Registration

- [x] 2.1 Add `teacher: "lesson_content_v1"` entry to `STAGE_TO_SCHEMA` in `src/orchestration/stages.js`
- [x] 2.2 Export `runTeacherStage` as a named export alongside `runPlannerStage`, `runAuthorStage`, etc.

## 3. Exercise Loop

- [x] 3.1 Add `buildTeacherPacket(session, node, lessonPlan)` to `src/session/exerciseLoop.js` — mirrors `buildAuthorPacket` but uses `taskType: "teaching_preparation"` and does not include exercise-specific fields; passes `lesson_plan: lessonPlan` in `curriculumContext`
- [x] 3.2 Import `runTeacherStage` at the top of `exerciseLoop.js`
- [x] 3.3 Insert teacher stage call in `setupExercise` between planner and author: build teacher packet from planner result, call `runTeacherStage`, abort with `printStageError` and `return null` on failure
- [x] 3.4 Add `teacherOptions` to `setupExercise` options (forwarded to `runTeacherStage`), defaulting to `{}`
- [x] 3.5 Include `lessonContent: teacherResult.payload` in the returned session state object from `setupExercise`

## 4. Session State and Study Command

- [x] 4.1 Add `lessonContent: null` field to the object returned by `createNewSession` in `src/session/session.js`
- [x] 4.2 Add `studySession` async function to `session.js` that loads the active session, reads `session.lessonContent`, and prints lesson body, worked examples, misconception callouts, and resources; prints a clear message if `lessonContent` is null

## 5. CLI Registration

- [x] 5.1 Import `studySession` in `src/session/cli.js` and add `study: studySession` to the `COMMANDS` map
- [x] 5.2 Add `study` to the usage text in `runSessionCli`

## 6. Fixtures

- [x] 6.1 Create `fixtures/valid/teacher/a200_d2_teacher.json` — a schema-valid `lesson_content_v1` payload for node A200 / D2 with at least one worked example, one misconception callout, and one resource
- [x] 6.2 Create `fixtures/invalid/teacher/missing_lesson_body.json` — a `lesson_content_v1` payload that omits `lesson_body` (should fail with SCHEMA_VALIDATION_FAILED)

## 7. Tests

- [x] 7.1 Add `TEACHER_PAYLOAD` fixture constant to `tests/exercise-loop.test.js`
- [x] 7.2 Update the `setupExercise` success test (Test 5.1) to pass `teacherOptions: { fallback: true, fallbackPayload: TEACHER_PAYLOAD }` and assert `updated.lessonContent` is not null
- [x] 7.3 Add a new test: `setupExercise` returns null when teacher stage fails (no `teacherOptions.fallbackPayload`)
- [x] 7.4 Add a test for `studySession`: verify it prints lesson body when `lessonContent` is set, and prints a "no lesson" message when `lessonContent` is null
