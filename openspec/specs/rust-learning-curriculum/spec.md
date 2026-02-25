## ADDED Requirements

### Requirement: Curriculum Graph Defines Prerequisite-Aware Navigation
The system SHALL represent Rust learning content as a graph of topic nodes with explicit prerequisite relationships, depth targets (`D1`, `D2`, `D3`), and node metadata required for progression decisions. The Rust curriculum includes both core language tracks and an advanced JS-toolchain compiler engineering tier (XL/XP/XA/XD/XR/XT/XM/XN/XG/XS tracks).

#### Scenario: Guided navigation only offers eligible nodes
- **WHEN** a learner requests the next guided topic
- **THEN** the system returns nodes whose prerequisite mastery requirements are satisfied

#### Scenario: Rust curriculum includes advanced toolchain tracks
- **WHEN** `getCurriculumForLanguage("rust")` is called
- **THEN** it returns all Rust nodes including both the core tracks (syntax-basics, foundations, collections, generics, smart-pointers, async, macros, concurrency) and the JS toolchain compiler-engineering tracks (XL/XP/XA/XD/XR/XT/XM/XN/XG/XS)

### Requirement: Guided Learning Supports Progressive Narrowing
The system SHALL allow learners to navigate from broad tracks to specific nodes using a guided flow that preserves prerequisite integrity.

#### Scenario: Learner narrows from track to node
- **WHEN** a learner selects a broad area such as ownership or async
- **THEN** the system presents narrowed topic choices and excludes nodes blocked by unmet prerequisites

### Requirement: Custom Topic Requests Are Mapped to Curriculum Nodes
The system SHALL map custom learner topics to the closest curriculum node set and identify prerequisite gaps before lesson generation.

#### Scenario: Custom topic has unmet prerequisites
- **WHEN** a learner requests a custom topic mapped to nodes with missing prerequisites
- **THEN** the system returns the mapped target and a prerequisite gap list

### Requirement: Curriculum Nodes Include Misconception Focus Tags
Each curriculum node SHALL define a bounded set of misconception tags used to guide diagnostics, hints, and remediation.

#### Scenario: Node metadata retrieval includes misconception tags
- **WHEN** orchestration requests metadata for a node
- **THEN** the response includes at least one misconception tag associated with that node
