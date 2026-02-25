## Context

The scaffold stage plans three independent streams: `lesson_plan.section_intents[]`, `starter_plan.file_intents[]`, and `test_plan.case_intents[]`. The three expand loops then generate stubs, tests, and lesson sections by consuming those lists in isolation. The starter-expand loop receives no test context; the lesson-expand loop receives prior starter and test sections as raw JSON but has no structural map connecting a specific stub to the lesson section that teaches it or the test that asserts it.

The result is a workspace where the three artifacts are thematically related but structurally disconnected:

- Stub comments read as Codex implementation specs ("the learner must detect duplicates, record handle metadata, and surface -EEXIST") rather than learner orientations that say where to look and what principle is being practiced.
- Test files reference constants or flag values that are never defined in the stub header, so the learner must read test internals to understand the contract.
- Lesson sections are planned and written to cover the topic broadly rather than to directly enable a specific stub. A learner who reads the lesson first cannot tell which section prepares them for which stub.
- There is no natural ordering signal telling the learner which stub to tackle first or how the stubs compose.

The gap manifests as friction: a learner who opens the workspace must Google before making progress, because nothing in the generated files points them toward what they need to know.

## Goals / Non-Goals

**Goals:**

- Restructure scaffold planning so the unit of planning is an *exercise* — a first principle bound to one lesson section, one stub, and 1–2 test cases — with cross-references maintained by exercise ID throughout generation.
- Make stub comments learner-facing: state the first principle being practiced, name the relevant lesson section, and give a start-here cue.
- Make lesson sections directly enabling: each section is planned and written to prepare the learner for a named stub, including a worked example of the exact pattern they will apply.
- Make tests self-contained: any constant or flag required by a test is defined in the stub/header, visible to the learner before they open the test file.
- Order stubs progressively so stub N's output is an ingredient for stub N+1, giving the workspace a single linear root-to-composition path.
- Apply updated prompts to all five language configs (rust, c, zig, python, cpp).

**Non-Goals:**

- Changing the `scaffold_v1` JSON schema or adding a new `exercise_intents[]` field. This change is prompt-only: exercise IDs exist in the text of intents, not as a new structured field.
- Modifying the context packet schema (`context_packet_v1`) or expand loop orchestration beyond prompt text.
- Migrating or re-generating existing workspaces. Previously generated exercises are unaffected.
- Reducing exercise depth — the number of stubs and lesson sections per exercise is unchanged.

## Decisions

### Decision 1: Prompt-only — exercise IDs in intent text, not a schema field

The scaffold planner is instructed to assign IDs (`ex-1`, `ex-2`, etc.) to each exercise unit and embed those IDs inside the `intent` strings of `section_intents`, `file_intents`, and `case_intents`. For example:

```
lesson_plan.section_intents[1]: "[ex-1] Worked example: open(2) flags and O_CREAT | O_EXCL as atomic existence check"
starter_plan.file_intents[0]:   "[ex-1] stub: open_exclusive() — first principle: atomic file creation"
test_plan.case_intents[0]:      "[ex-1] assert: open_exclusive returns fd >= 0 on first call, -EEXIST on second"
```

Each expand call already receives the full scaffold as `scaffold_context`. The updated expand prompts instruct the model to echo the exercise ID from the intent it is covering and cross-reference the sibling artifacts. No change to `buildExpandPacket` or `context_packet_v1` is needed — `priorLoopSections` already carries earlier loops' output into later loops.

**Alternative considered:** Add a new `exercise_intents[]` array to `scaffold_v1` with structured `{ id, lesson_intent, starter_intent, test_intents[] }` objects. This is the cleaner long-term model but requires updating the schema validator, context packet assembly, and debug log structure. Deferred: the prompt-only approach delivers the same cross-referencing with no schema changes. If ID reliability proves a problem in practice (see Risks), graduating to structured exercise intents is the natural next step.

### Decision 2: Stub comments become learner orientations, not Codex specs

Current style: `/* the learner must detect duplicates, record handle metadata, and surface -EEXIST */`
New style:

```c
/*
 * ex-2 — First principle: duplicate detection with linear scan
 * Read: LESSON.md § "Tracking registered handles" before implementing.
 * Test: test_register_duplicate_returns_eexist (test_context.c)
 * Start here: scan ctx->transfer_entries for a handle matching desc->handle.
 */
```

Enforced entirely through the starter-expand prompt. The lesson-expand prompt mirrors this: each section must open with a worked example for the named stub, not a broad topic survey. The test-expand prompt requires any constants the test uses to be pre-defined in the corresponding stub file.

### Decision 3: "Focused and progressive" framing replaces "ambitious and comprehensive"

The scaffold prompt currently opens with "Be AMBITIOUS and COMPREHENSIVE — plan an exercise with real depth." This directly produces the problem: broad coverage at the expense of learner usability. The new framing: "Be FOCUSED and PROGRESSIVE — plan the workspace as a sequence of exercises that build from a single root concept, where each exercise is completable from the lesson and tests alone without external reference."

## Risks / Trade-offs

- **LLM may not reliably maintain exercise IDs across independent expand calls.** If the model ignores or invents exercise IDs in an expand call, cross-references break silently. Mitigation: expand prompts explicitly require echoing the exercise ID from the intent being covered; debug logs make mismatches observable. If unreliable, graduating to structured `exercise_intents[]` in the schema resolves this definitively.
- **Progressive ordering may reduce breadth at high depth targets.** Linear composition chains are harder to construct with 15+ stubs (D3). The "focused and progressive" framing is an intentional trade-off — a workspace where the learner can make forward progress is more valuable than a comprehensive one that leaves them stuck.
- **Existing workspaces are unaffected.** Prompt-only changes do not retroactively improve already-generated exercises. This is acceptable: workspaces are ephemeral per-session artifacts.
