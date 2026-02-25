## 1. Remove Old Schemas and Fixtures

- [x] 1.1 Delete `src/schemas/lesson_plan_v1.schema.json`
- [x] 1.2 Delete `src/schemas/lesson_content_v1.schema.json`
- [x] 1.3 Delete `src/schemas/exercise_pack_v1.schema.json`
- [x] 1.4 Remove `lesson_plan_v1`, `lesson_content_v1`, `exercise_pack_v1` from `SCHEMA_FILES` in `src/validation/schemaValidator.js`
- [x] 1.5 Delete `fixtures/valid/planner/`, `fixtures/valid/author/`, `fixtures/valid/teacher/` directories
- [x] 1.6 Delete `fixtures/invalid/teacher/` directory

## 2. Add New Schemas

- [x] 2.1 Create `src/schemas/scaffold_v1.schema.json` — required fields: `schema_version` (const "scaffold_v1"), `role` (const "scaffold"), `scaffold_id`, `node_id`, `depth_target` (enum D1/D2/D3), `lesson_plan` (object with `section_intents` array), `starter_plan` (object with `file_intents` array), `test_plan` (object with `case_intents` array), `exercise_description`
- [x] 2.2 Create `src/schemas/starter_section_v1.schema.json` — required fields: `schema_version` (const "starter_section_v1"), `role` (const "starter-expand"), `section_id`, `type`, `file_path`, `content`, `is_complete` (boolean), `next_focus` (string)
- [x] 2.3 Create `src/schemas/test_section_v1.schema.json` — required fields: `schema_version` (const "test_section_v1"), `role` (const "test-expand"), `section_id`, `type`, `file_path`, `content`, `is_complete` (boolean), `next_focus` (string)
- [x] 2.4 Create `src/schemas/lesson_section_v1.schema.json` — required fields: `schema_version` (const "lesson_section_v1"), `role` (const "lesson-expand"), `section_id`, `type` (enum: concept, worked_example, comparison, pitfalls, bridge, resources), `content`, `is_complete` (boolean), `next_focus` (string)
- [x] 2.5 Verify all four new schemas are OpenAI structured-output compatible: all `const` fields have `"type": "string"`, all objects have explicit `properties` and `"additionalProperties": false`, no union types
- [x] 2.6 Register all four new schemas in `SCHEMA_FILES` in `src/validation/schemaValidator.js`

## 3. Register New Stages

- [x] 3.1 Add `scaffold: "scaffold_v1"`, `"starter-expand": "starter_section_v1"`, `"test-expand": "test_section_v1"`, `"lesson-expand": "lesson_section_v1"` to `STAGE_TO_SCHEMA` in `src/orchestration/stages.js`
- [x] 3.2 Remove `planner`, `teacher`, `author` from `STAGE_TO_SCHEMA`
- [x] 3.3 Export `runScaffoldStage`, `runStarterExpandStage`, `runTestExpandStage`, `runLessonExpandStage` named exports; remove `runPlannerStage`, `runTeacherStage`, `runAuthorStage`

## 4. Rewrite exerciseLoop.js

- [x] 4.1 Add `MAX_ITERATIONS` constant: `{ D1: { starter:6, test:8, lesson:12 }, D2: { starter:8, test:10, lesson:15 }, D3: { starter:9, test:12, lesson:18 } }`
- [x] 4.2 Add `buildScaffoldPacket(session, node)` — context packet with mastery, misconception context, node metadata; role "scaffold", taskType "session_scaffold"
- [x] 4.3 Add `buildExpandPacket(loopType, scaffold, priorLoopSections, currentSections, nextFocus, session, node)` — context packet with scaffold, prior loop output, accumulated sections for this loop, and nextFocus directive
- [x] 4.4 Add `runExpandLoop(loopType, scaffold, priorSections, session, node, options)` — iterates expand stage calls, accumulates sections, terminates on `is_complete` or MAX_ITERATIONS cap, returns sections array or null on failure
- [x] 4.5 Rewrite `setupExercise` to: run scaffold stage → run starter loop → run test loop → run lesson loop → assemble workspace; abort and return null on any failure
- [x] 4.6 Update `setupExercise` options parameter to accept `scaffoldOptions`, `starterOptions`, `testOptions`, `lessonOptions` (for test fallback overrides)
- [x] 4.7 Remove `buildPlannerPacket`, `buildTeacherPacket`, `buildAuthorPacket` functions
- [x] 4.8 Update imports at top of exerciseLoop.js (remove old stage imports, add new ones)

## 5. Update materialize.js

- [x] 5.1 Add `assembleStarterFiles(workspaceDir, starterSections)` — groups sections by `file_path`, appends content in order, writes each file under `workspaceDir/src/`
- [x] 5.2 Add `assembleTestFiles(workspaceDir, testSections)` — same pattern, writes under `workspaceDir/tests/`
- [x] 5.3 Add `assembleLessonFile(workspaceDir, lessonSections)` — concatenates all `content` fields in order, writes to `workspaceDir/LESSON.md`
- [x] 5.4 Remove or keep `materializeExercise` — it can be removed once nothing references `exercise_pack_v1` structure

## 6. Update Session State and CLI

- [x] 6.1 Remove `lessonContent` field from `createNewSession` in `src/session/session.js`; add `lessonFile: null`
- [x] 6.2 Update `setupExercise` return value to include `lessonFile` (path to LESSON.md) and `exerciseId` (derived from `scaffold.scaffold_id`) instead of `exercisePack` and `lessonContent`
- [x] 6.3 Remove `studySession` function from `src/session/session.js`
- [x] 6.4 Remove `study` import and command registration from `src/session/cli.js`
- [x] 6.5 Remove `study` from usage text in `runSessionCli`
- [x] 6.6 Update `showSession` in session.js to reference `lessonFile` instead of `exercisePack`/`lessonContent`
- [x] 6.7 Update `startSession` to print `lessonFile` path after setup completes

## 7. Add Fixtures

- [x] 7.1 Create `fixtures/valid/scaffold/a200_d2_scaffold.json` — valid `scaffold_v1` payload for node A200/D2 with at least one intent in each plan array
- [x] 7.2 Create `fixtures/valid/starter-section/a200_d2_starter_s1.json` — valid `starter_section_v1` with `is_complete: false` and non-empty `next_focus`
- [x] 7.3 Create `fixtures/valid/starter-section/a200_d2_starter_final.json` — valid `starter_section_v1` with `is_complete: true`
- [x] 7.4 Create `fixtures/valid/test-section/a200_d2_test_final.json` — valid `test_section_v1` with `is_complete: true`
- [x] 7.5 Create `fixtures/valid/lesson-section/a200_d2_lesson_s1.json` — valid `lesson_section_v1` of type `concept` with `is_complete: false`
- [x] 7.6 Create `fixtures/valid/lesson-section/a200_d2_lesson_bridge.json` — valid `lesson_section_v1` of type `bridge` with `is_complete: true`
- [x] 7.7 Create `fixtures/invalid/scaffold/missing_starter_plan.json` — scaffold payload missing `starter_plan` (should fail SCHEMA_VALIDATION_FAILED)
- [x] 7.8 Create `fixtures/invalid/lesson-section/invalid_type.json` — lesson section with `type` outside allowed enum (should fail SCHEMA_VALIDATION_FAILED)

## 8. Update Tests

- [x] 8.1 Add fallback payload constants `SCAFFOLD_PAYLOAD`, `STARTER_SECTION_PAYLOAD` (is_complete: false), `STARTER_SECTION_FINAL` (is_complete: true), `TEST_SECTION_FINAL`, `LESSON_SECTION_PAYLOAD` (is_complete: false), `LESSON_SECTION_FINAL` (is_complete: true) to `tests/exercise-loop.test.js`
- [x] 8.2 Update `setupExercise` success test to use new fallback options (`scaffoldOptions`, `starterOptions`, `testOptions`, `lessonOptions`) and assert `lessonFile` is set
- [x] 8.3 Add test: `runExpandLoop` terminates when `is_complete: true` returned on first call
- [x] 8.4 Add test: `runExpandLoop` respects MAX_ITERATIONS cap (loop with `is_complete: false` always terminates at cap)
- [x] 8.5 Add test: `runExpandLoop` returns null on expand stage failure
- [x] 8.6 Add test: `setupExercise` returns null when scaffold stage fails
- [x] 8.7 Remove test references to `PLANNER_PAYLOAD`, `AUTHOR_PAYLOAD`, `TEACHER_PAYLOAD`; remove test for `studySession`
- [x] 8.8 Update `tests/fallback-mode.test.js` to use scaffold fallback payload instead of planner/author payloads
- [x] 8.9 Update fixture harness test in `tests/cli-guided-flow.test.js` (curriculum validation test is unaffected; fixture path assertions need updating)
