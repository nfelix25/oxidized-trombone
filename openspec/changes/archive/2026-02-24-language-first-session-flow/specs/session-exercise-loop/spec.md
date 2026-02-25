## MODIFIED Requirements

### Requirement: Session state carries a language field
The system SHALL store a `language` string field on session state, set explicitly from the learner's language selection at session creation time (not derived from the node), and persist it across commands.

#### Scenario: New session from a C node has language = "c"
- **WHEN** a learner starts a session, selects C as the language, and selects a C curriculum node (e.g. C200)
- **THEN** the created session has `language: "c"`

#### Scenario: New session from a Rust node has language = "rust"
- **WHEN** a learner starts a session, selects Rust as the language, and selects a Rust curriculum node
- **THEN** the created session has `language: "rust"`

#### Scenario: Existing session without language field is treated as Rust
- **WHEN** a session is loaded from disk that has no `language` property
- **THEN** all subsequent operations treat it as `language = "rust"`

#### Scenario: Session created from a custom topic carries the custom topic's language
- **WHEN** a learner selects a language, then selects a custom topic for that language, and starts a session
- **THEN** the created session has `language` matching the custom topic's language
