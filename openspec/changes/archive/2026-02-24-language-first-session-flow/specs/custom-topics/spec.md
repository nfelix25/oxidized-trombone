## ADDED Requirements

### Requirement: Custom topics are stored per language
The system SHALL persist custom topics in a per-language JSON file at `.state/custom_topics/<language>.json`. Each entry SHALL contain at minimum: `id`, `name`, `language`, and `keywords`.

#### Scenario: Custom topic file is language-scoped
- **WHEN** a custom topic with `language: "c"` is saved
- **THEN** it appears in `.state/custom_topics/c.json` and not in `.state/custom_topics/rust.json`

#### Scenario: Custom topic entry has required fields
- **WHEN** a custom topic is read from storage
- **THEN** it has `id`, `name`, `language`, and `keywords` fields

### Requirement: Custom topics appear as a "Custom" entry in the track picker
The system SHALL inject a synthetic "Custom" track entry into the track picker when the selected language has at least one saved custom topic. Selecting "Custom" SHALL list all custom topics for that language.

#### Scenario: Custom entry appears when custom topics exist for language
- **WHEN** the learner selects a language and `.state/custom_topics/<language>.json` is non-empty
- **THEN** a "Custom" option appears in the track list alongside regular curriculum tracks

#### Scenario: Custom entry is absent when no custom topics exist
- **WHEN** the learner selects a language and no custom topics file exists (or it is empty) for that language
- **THEN** no "Custom" option appears in the track list

#### Scenario: Selecting Custom lists topics for the selected language
- **WHEN** the learner chooses the "Custom" entry
- **THEN** the system displays all custom topic names for that language as selectable options

### Requirement: A custom topic can be used as a session node
The system SHALL allow a custom topic to be selected and used as the basis for a session, with the same runtime behavior as a curriculum node (scaffold → expand loops → attempt/hint commands).

#### Scenario: Session created from custom topic has correct language
- **WHEN** the learner selects a custom topic and starts a session
- **THEN** the session has `language` set to the custom topic's language and proceeds through the full exercise loop

### Requirement: Custom topic storage does not block future topic generation
The custom topic storage schema SHALL be compatible with a future flow where the system generates a new topic node via AI and appends it to the per-language file, without requiring a storage migration.

#### Scenario: New entry can be appended to storage file without schema changes
- **WHEN** a future feature appends a new topic object to `.state/custom_topics/<language>.json`
- **THEN** the entry is valid custom topic storage without requiring a storage format change
