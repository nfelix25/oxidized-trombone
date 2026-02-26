## Purpose
Specifies the TypeScript curriculum seed — a depth-first, 112-node curriculum covering intermediate through extreme TypeScript type-system content across 9 tracks.

## Requirements

### Requirement: TypeScript curriculum seed exports ~112 nodes across 9 tracks
The system SHALL provide a `src/curriculum/typescriptSeed.js` module that exports a `typescriptCurriculum` object (a curriculum graph) containing approximately 112 nodes organized into 9 named tracks. Every node SHALL have `language: "typescript"`, a unique ID following the two-character prefix convention (TF, TN, TG, TV, TA, TL, TR, TP, TI), a `depthTarget`, `keywords`, and at least one `misconceptionTag`.

#### Scenario: Seed exports a valid curriculum graph
- **WHEN** `typescriptSeed.js` is imported
- **THEN** the exported `typescriptCurriculum` passes `createCurriculumGraph` validation with no errors and all node IDs are unique

#### Scenario: All nodes carry the typescript language tag
- **WHEN** `getCurriculumForLanguage("typescript")` is called on the merged graph
- **THEN** every returned node has `language === "typescript"`

#### Scenario: Node count is approximately 112
- **WHEN** the typescript curriculum graph is loaded
- **THEN** the node count is between 100 and 125

### Requirement: Curriculum is organized into 9 named tracks
The system SHALL organize TypeScript nodes into exactly 9 tracks: `ts-foundations` (TF), `ts-narrowing` (TN), `ts-generics` (TG), `ts-variance` (TV), `ts-advanced-types` (TA), `ts-type-challenges` (TL), `ts-runtime-bridges` (TR), `ts-performance` (TP), `ts-declarations` (TI).

#### Scenario: All 9 tracks are present in the curriculum graph
- **WHEN** the typescript curriculum graph is inspected
- **THEN** all 9 track IDs are present in the tracks map and each contains at least 5 nodes

#### Scenario: Nodes belong to exactly one track
- **WHEN** any node ID is looked up in the tracks map
- **THEN** it appears in exactly one track's nodeIds array

### Requirement: Curriculum is weighted toward intermediate and advanced content
The system SHALL allocate no more than 10 nodes to the TF (foundations) track. The remaining 100+ nodes SHALL cover intermediate through extreme-difficulty content, including every notable TypeScript feature from versions 4.0 through 5.5 as a primary topic in a dedicated node.

#### Scenario: Foundation track is minimal
- **WHEN** the `ts-foundations` track is inspected
- **THEN** it contains 6 or fewer nodes

#### Scenario: Recent TypeScript features have dedicated nodes
- **WHEN** the curriculum is searched for keywords
- **THEN** nodes exist with keywords covering: satisfies, using/await using, const type parameters, infer extends, variadic tuples, template literal types, variance annotations in/out, stage 3 decorators, decorator metadata, NoInfer, inferred type predicates, instantiation expressions, import attributes

### Requirement: Type-level challenges track (TL) spans medium through extreme difficulty
The system SHALL provide a `ts-type-challenges` track with at least 18 nodes organized into difficulty tiers: medium (implement standard utility types from scratch), hard (tuple/string/type manipulation requiring multiple advanced concepts), and extreme (type-level arithmetic, parsing, state machines).

#### Scenario: Medium tier includes utility type implementations from scratch
- **WHEN** the TL01–TL06 range of nodes is inspected
- **THEN** keywords include: DeepReadonly, TupleToUnion, UnionToIntersection, PickByValue, IsUnion

#### Scenario: Extreme tier includes type-level computation
- **WHEN** the TL13–TL22 range of nodes is inspected
- **THEN** keywords include: ParseInt, type-level arithmetic, recursion limits, UnionToTuple, IsAny, Equal implementation

### Requirement: Curriculum passes all-curriculum validation tests
The system SHALL include a `tests/typescript-curriculum.test.js` file that validates the TypeScript curriculum using the same patterns as other language curriculum tests. All tests SHALL pass.

#### Scenario: Curriculum test file runs without errors
- **WHEN** `node --test tests/typescript-curriculum.test.js` is executed
- **THEN** all test cases pass with exit code 0

#### Scenario: Prerequisite graph has no cycles
- **WHEN** the curriculum graph is validated
- **THEN** no cycle is detected in the node prerequisite DAG
