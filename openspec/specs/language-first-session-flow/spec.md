## Purpose
Specifies the language-first session start flow: language selection gates all curriculum navigation, tracks and nodes are filtered to the selected language, and the APIs that support this (`getCurriculumForLanguage`, `getAvailableLanguages`) are stable contracts.

## Requirements

### Requirement: Language is selected before curriculum navigation
The system SHALL prompt the learner to select a programming language as the first step when starting a new session, before presenting any curriculum tracks or nodes.

#### Scenario: New session prompts for language first
- **WHEN** the learner starts a new session
- **THEN** the system presents a numbered list of available languages derived from the language registry, and waits for selection before proceeding to curriculum navigation

#### Scenario: Available languages list is registry-driven
- **WHEN** the language selection prompt is displayed
- **THEN** only languages present in the language registry (e.g. `["rust", "c"]`) appear as choices, in the order they are registered

### Requirement: getCurriculumForLanguage returns a language-scoped graph
The system SHALL export a `getCurriculumForLanguage(lang)` function from `src/curriculum/allCurricula.js` that returns a curriculum graph containing only nodes and tracks matching the given language.

#### Scenario: Rust curriculum contains only Rust nodes
- **WHEN** `getCurriculumForLanguage("rust")` is called
- **THEN** the returned graph contains only nodes with `language === "rust"` and tracks with at least one such node; no C nodes appear

#### Scenario: C curriculum contains only C nodes
- **WHEN** `getCurriculumForLanguage("c")` is called
- **THEN** the returned graph contains only nodes with `language === "c"` and no Rust nodes appear

#### Scenario: Unknown language returns empty graph
- **WHEN** `getCurriculumForLanguage("zig")` is called and no Zig nodes exist
- **THEN** the returned graph has zero nodes and zero tracks

### Requirement: getAvailableLanguages returns registry language IDs
The system SHALL export a `getAvailableLanguages()` function from `src/config/languages.js` that returns an array of registered language ID strings.

#### Scenario: Available languages includes rust and c
- **WHEN** `getAvailableLanguages()` is called
- **THEN** the return value includes `"rust"` and `"c"`

#### Scenario: Available languages is registry-driven
- **WHEN** a new language entry is added to the registry
- **THEN** `getAvailableLanguages()` includes the new language ID without any other code changes

### Requirement: Curriculum navigation receives a language-filtered graph
The system SHALL pass a language-filtered curriculum graph to guided navigation, so that only tracks and nodes for the selected language are presented to the learner.

#### Scenario: Selecting Rust shows only Rust tracks
- **WHEN** the learner selects Rust and proceeds to track selection
- **THEN** only Rust-language tracks are shown; no C tracks appear

#### Scenario: Selecting C shows only C tracks
- **WHEN** the learner selects C and proceeds to track selection
- **THEN** only C-language tracks are shown; no Rust tracks appear
