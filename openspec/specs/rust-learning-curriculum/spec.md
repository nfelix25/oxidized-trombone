## ADDED Requirements

### Requirement: Curriculum Graph Defines Prerequisite-Aware Navigation
The system SHALL represent Rust learning content as a graph of topic nodes with explicit prerequisite relationships, depth targets (`D1`, `D2`, `D3`), and node metadata required for progression decisions. The Rust curriculum includes both core language tracks and an advanced JS-toolchain compiler engineering tier (XL/XP/XA/XD/XR/XT/XM/XN/XG/XS tracks).

#### Scenario: Guided navigation only offers eligible nodes
- **WHEN** a learner requests the next guided topic
- **THEN** the system returns nodes whose prerequisite mastery requirements are satisfied

#### Scenario: Rust curriculum includes advanced toolchain tracks
- **WHEN** `getCurriculumForLanguage("rust")` is called
- **THEN** it returns all Rust nodes including both the core tracks (syntax-basics, foundations, collections, generics, smart-pointers, async, macros, concurrency) and the JS toolchain compiler-engineering tracks (XL/XP/XA/XD/XR/XT/XM/XN/XG/XS)

### Requirement: Rust Composite Nodes Are Split Into Atomic Sub-Nodes and Prerequisite Gaps Are Fixed
Node S105 SHALL be replaced by two atomic sub-nodes: S105a (closure syntax and capture rules, no trait bound context required) and S105b (Fn/FnMut/FnOnce trait bounds, requiring G101). Node A507 (Implementing the Iterator trait) SHALL list G102 (associated types) as a prerequisite. Nodes A210 and C101 SHALL list S105b (not S105) as a prerequisite. Node X101 SHALL be split into X101a (trait-based mocking, prereq G101+X100) and X101b (property-based testing with proptest, prereq X100). Node A701 SHALL include Send/Sync marker traits in its keywords.

#### Scenario: S105a teaches closure syntax without trait bounds
- **WHEN** a session targets node S105a
- **THEN** the scaffold plans content on closure syntax, capture-by-reference vs capture-by-move, type inference for closure parameters, and usage in map/filter — without requiring knowledge of Fn/FnMut/FnOnce trait names

#### Scenario: S105b teaches Fn trait hierarchy
- **WHEN** a session targets node S105b
- **THEN** the scaffold plans content on the Fn, FnMut, FnOnce trait distinction, which closures implement which traits, and how trait bounds constrain higher-order function parameters

#### Scenario: A507 requires associated types knowledge
- **WHEN** the curriculum is loaded
- **THEN** node A507 lists G102 as a prerequisite, ensuring learners understand associated types before implementing Iterator

#### Scenario: X101a covers trait-based mocking
- **WHEN** a session targets node X101a
- **THEN** the scaffold plans content on defining mock implementations of traits, dependency injection patterns, and test double strategies using Rust traits

#### Scenario: X101b covers property-based testing
- **WHEN** a session targets node X101b
- **THEN** the scaffold plans content on proptest strategies, arbitrary value generation, shrinking on failure, and invariant-based testing patterns

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

## MODIFIED Requirements

### Requirement: Curriculum Graph Defines Prerequisite-Aware Navigation
The system SHALL represent Rust learning content as a graph of topic nodes with explicit prerequisite relationships, depth targets (`D1`, `D2`, `D3`), and node metadata required for progression decisions, and SHALL support tiered curriculum expansion.

#### Scenario: Guided navigation only offers eligible nodes
- **WHEN** a learner requests the next guided topic
- **THEN** the system returns nodes whose prerequisite mastery requirements are satisfied

#### Scenario: Tier expansion preserves prerequisite integrity
- **WHEN** new nodes are added to a curriculum tier
- **THEN** each new node includes prerequisite metadata sufficient for eligibility filtering

### Requirement: Guided Learning Supports Progressive Narrowing
The system SHALL allow learners to navigate from broad tracks to specific nodes using a guided flow that preserves prerequisite integrity and exposes blocked-node reasons.

#### Scenario: Learner narrows from track to node
- **WHEN** a learner selects a broad area such as ownership or async
- **THEN** the system presents narrowed topic choices and excludes nodes blocked by unmet prerequisites

#### Scenario: Blocked node reason is shown
- **WHEN** a guided node is not eligible due to missing prerequisites
- **THEN** the system provides the missing prerequisite identifiers for that node

### Requirement: Custom Topic Requests Are Mapped to Curriculum Nodes
The system SHALL map custom learner topics to the closest curriculum node set and identify prerequisite gaps before lesson generation, and SHALL return empty mapping explicitly when no candidate is found.

#### Scenario: Custom topic has unmet prerequisites
- **WHEN** a learner requests a custom topic mapped to nodes with missing prerequisites
- **THEN** the system returns the mapped target and a prerequisite gap list

#### Scenario: No mapping candidate exists
- **WHEN** a learner provides a topic string with no curriculum match
- **THEN** the system returns an explicit empty mapped-node result

### Requirement: Curriculum Nodes Include Misconception Focus Tags
Each curriculum node SHALL define a bounded set of misconception tags used to guide diagnostics, hints, and remediation, and each node SHALL include at least one misconception tag.

#### Scenario: Node metadata retrieval includes misconception tags
- **WHEN** orchestration requests metadata for a node
- **THEN** the response includes at least one misconception tag associated with that node

#### Scenario: Node creation without tags is rejected
- **WHEN** curriculum data attempts to add a node without misconception tags
- **THEN** the node is rejected by curriculum validation
