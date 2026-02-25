## MODIFIED Requirements

### Requirement: Scaffold Stage Produces Master Plan for All Downstream Loops
The system SHALL invoke a `scaffold` Codex stage as the single entry point for session setup, producing a `scaffold_v1` output that contains the master plan for all three expand loops: lesson section intents, starter code intents, test case intents, and an exercise description. The scaffold stage SHALL replace the former `planner` stage.

The scaffold stage SHALL plan the workspace as a sequence of *exercise units* — each exercise unit is a first principle bound to one lesson section intent, one or more starter stub intents, and 1–2 test case intents. Exercise units SHALL be identified by IDs (`ex-1`, `ex-2`, etc.) embedded in the intent strings of `section_intents`, `file_intents`, and `case_intents`, creating explicit cross-references across the three plan lists.

The scaffold prompt SHALL use "focused and progressive" framing: exercises are ordered so each builds on the previous from a single root concept, and the workspace as a whole is completable from the generated lesson and tests alone without external reference.

#### Scenario: Scaffold produces all required plan sections
- **WHEN** the scaffold stage is invoked with a valid context packet
- **THEN** the output includes `lesson_plan`, `starter_plan`, `test_plan`, and `exercise_description` with intent arrays for each

#### Scenario: Scaffold failure aborts session setup
- **WHEN** the scaffold stage returns an unaccepted result
- **THEN** the system surfaces the error and does not proceed to any expand loop, and no session is persisted

#### Scenario: Scaffold intents are proportional to depth target
- **WHEN** the scaffold stage is invoked for a D1 node
- **THEN** the intent arrays are shorter than those for an equivalent D3 node

#### Scenario: Scaffold intents carry exercise unit cross-references
- **WHEN** the scaffold stage produces its output
- **THEN** each lesson section intent, starter file intent, and test case intent includes an exercise unit ID (ex-1, ex-2, etc.) linking it to the sibling intents that cover the same first principle

#### Scenario: Scaffold exercise units are ordered progressively
- **WHEN** the scaffold stage plans the exercise sequence
- **THEN** the stubs are ordered so that the output of ex-N is an ingredient for ex-N+1, forming a single progression from a root concept

### Requirement: Scaffold_v1 Schema Is OpenAI Structured-Output Compatible
The `scaffold_v1` schema SHALL define all required fields with explicit types, no union types, and all nested objects with explicit `properties` and `additionalProperties: false`, consistent with OpenAI structured output constraints.

#### Scenario: Valid scaffold payload passes schema validation
- **WHEN** a `scaffold_v1` payload is validated
- **THEN** all required fields (`scaffold_id`, `node_id`, `depth_target`, `lesson_plan`, `starter_plan`, `test_plan`, `exercise_description`) are present and well-formed

#### Scenario: Missing intent array fails schema validation
- **WHEN** a scaffold payload omits `starter_plan`
- **THEN** schema validation rejects it with SCHEMA_VALIDATION_FAILED
