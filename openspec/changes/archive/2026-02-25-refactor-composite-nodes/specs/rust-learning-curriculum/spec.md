## MODIFIED Requirements

### Requirement: Curriculum Graph Defines Prerequisite-Aware Navigation
The system SHALL represent Rust learning content as a graph of topic nodes with explicit prerequisite relationships, depth targets (`D1`, `D2`, `D3`), and node metadata required for progression decisions. Node S105 SHALL be replaced by two atomic sub-nodes: S105a (closure syntax and capture rules, no trait bound context required) and S105b (Fn/FnMut/FnOnce trait bounds, requiring G101). Node A507 (Implementing the Iterator trait) SHALL list G102 (associated types) as a prerequisite. Node A505 (Trait objects and dynamic dispatch) SHALL list G101 as a prerequisite. Nodes A210 and C101 SHALL list S105b (not S105) as a prerequisite. Node X101 SHALL be split into X101a (trait-based mocking, prereq G101) and X101b (property-based testing with proptest, prereq X100).

#### Scenario: S105a teaches closure syntax without trait bounds
- **WHEN** a session targets node S105a
- **THEN** the scaffold plans content on closure syntax, capture-by-reference vs capture-by-move, type inference for closure parameters, and usage in map/filter — without requiring knowledge of Fn/FnMut/FnOnce trait names

#### Scenario: S105b teaches Fn trait hierarchy
- **WHEN** a session targets node S105b
- **THEN** the scaffold plans content on the Fn, FnMut, FnOnce trait distinction, which closures implement which traits, and how trait bounds constrain higher-order function parameters

#### Scenario: A507 requires associated types knowledge
- **WHEN** the curriculum is loaded
- **THEN** node A507 lists G102 as a prerequisite, ensuring learners understand associated types before implementing Iterator

#### Scenario: A505 comes after static generics
- **WHEN** the curriculum is loaded
- **THEN** node A505 lists G101 as a prerequisite, ensuring learners can compare dynamic dispatch to static dispatch they already know

#### Scenario: Guided navigation only offers eligible nodes
- **WHEN** a learner requests the next guided topic
- **THEN** the system returns nodes whose prerequisite mastery requirements are satisfied

#### Scenario: Rust curriculum includes advanced toolchain tracks
- **WHEN** `getCurriculumForLanguage("rust")` is called
- **THEN** it returns all Rust nodes including both the core tracks and the JS toolchain compiler-engineering tracks
