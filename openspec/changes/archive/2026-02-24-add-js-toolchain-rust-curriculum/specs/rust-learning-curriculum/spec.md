## MODIFIED Requirements

### Requirement: Curriculum Graph Defines Prerequisite-Aware Navigation
The system SHALL represent Rust learning content as a graph of topic nodes with explicit prerequisite relationships, depth targets (`D1`, `D2`, `D3`), and node metadata required for progression decisions. The Rust curriculum includes both core language tracks and an advanced JS-toolchain compiler engineering tier (XL/XP/XA/XD/XR/XT/XM/XN/XG/XS tracks).

#### Scenario: Guided navigation only offers eligible nodes
- **WHEN** a learner requests the next guided topic
- **THEN** the system returns nodes whose prerequisite mastery requirements are satisfied

#### Scenario: Rust curriculum includes advanced toolchain tracks
- **WHEN** `getCurriculumForLanguage("rust")` is called
- **THEN** it returns all Rust nodes including both the core tracks (syntax-basics, foundations, collections, generics, smart-pointers, async, macros, concurrency) and the JS toolchain compiler-engineering tracks (XL/XP/XA/XD/XR/XT/XM/XN/XG/XS)
