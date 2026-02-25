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
