## Why

The scaffold generator produces lesson sections, test cases, and stub functions as three independent parallel streams with no structural linkage between them. A stub that asks you to implement DFS cycle detection gives you no indication which lesson section teaches it or which test validates it. Comments read as Codex specs ("the learner must detect duplicates, record handle metadata..."), not learner orientations. The result: you can't make progress on a stub without Googling, because nothing in the workspace points you to what you need.

## What Changes

- **Exercise-unit planning**: The scaffold stage plans the workspace as a set of *exercises* — each exercise is a first principle with a lesson section that teaches it, 1–2 test cases that assert it, and a stub that implements it. Stubs, tests, and lesson sections are planned and generated with explicit cross-references so each piece points to the others.
- **Stub comments become learner orientations**: Instead of "the learner must X, Y, Z", each stub comment states the first principle being practiced, references the relevant lesson section, and gives a "start here" cue — not the implementation, but enough orientation to know where to look.
- **Lesson sections are directly enabling**: Each lesson section is planned to directly enable one or more specific stubs. Lesson content must include the exact pattern, data structure, or concept the learner will apply — worked example first, then the stub asks them to apply it.
- **Tests target individual stubs**: Each test case targets exactly one stub. Test names state the assertion, not just the function name. Constants and flags required by tests are pre-defined in the stub/header so the learner can see the contract without reading test internals.
- **Progressive composition within workspace**: Stubs are ordered such that each builds on the previous — the output of stub N becomes an ingredient for stub N+1. The sequence forms a linear progression from a single identifiable root concept.
- **Content re-evaluation**: All five language configs get updated prompts. The scaffold planner changes its output structure to plan exercises as units, not files+tests+lessons as separate lists.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `scaffold-generation`: The scaffold stage SHALL plan exercises as first-principle units — each with a lesson intent, 1–2 test case intents, and a stub intent that are explicitly cross-referenced. The "ambitious/comprehensive" framing is replaced with "focused and progressive from a single root concept."
- `expand-loop-generation`: Starter sections SHALL include stubs with learner-facing orientation comments that reference the relevant lesson section and test. Lesson sections SHALL be written to directly enable specific named stubs. Test cases SHALL target individual stubs with assertion-stating names and SHALL define any constants/flags they require.

## Impact

- `src/config/languages.js` — scaffold and all three expand prompts for all 5 languages (rust, c, zig, python, cpp)
- `src/session/exerciseLoop.js` — possibly the context packet structure to carry cross-references between loops
- Existing generated workspaces are unaffected
