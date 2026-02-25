## ADDED Requirements

### Requirement: Teacher Stage Generates Personalized Lesson Content
The system SHALL invoke a `teacher` Codex stage after the planner and before the author, producing a `lesson_content_v1` output that includes a markdown lesson body, worked code examples, misconception callouts, and a curated resources array. The teacher stage SHALL draw its context packet from live session state (mastery level, top misconception tags, node metadata, planner output).

#### Scenario: Teacher stage runs between planner and author
- **WHEN** a learner starts a session and the planner stage succeeds
- **THEN** the system runs the teacher stage next, using planner output and current learner state as context, before invoking the author stage

#### Scenario: Teacher stage failure aborts session setup
- **WHEN** the teacher stage returns an unaccepted result (schema, policy, or execution failure)
- **THEN** the system surfaces the error and does not proceed to the author stage, and no session is persisted

#### Scenario: Teacher output is stored in session state
- **WHEN** the teacher stage returns a valid `lesson_content_v1` payload
- **THEN** the system stores the lesson content in session state under `lessonContent` alongside the exercise pack

### Requirement: Lesson Content Includes Worked Examples and Misconception Callouts
The `lesson_content_v1` output SHALL contain at least one worked code example and at least one misconception callout targeting the node's common errors.

#### Scenario: Lesson content includes code example
- **WHEN** the teacher stage produces valid output
- **THEN** the `worked_examples` array contains at least one entry with a code snippet and explanation

#### Scenario: Lesson content targets dominant misconception
- **WHEN** the learner's session has a top misconception tag for the selected node
- **THEN** the teacher context packet includes that tag and the `misconception_callouts` array addresses it

### Requirement: Teacher Stage Produces Curated External Resource Links
The `lesson_content_v1` output SHALL include a `resources` array of curated external links (e.g., Rust Book chapters, reference documentation, Rust playground links) relevant to the node being studied.

#### Scenario: Resources array is present and non-empty
- **WHEN** the teacher stage produces valid output for a node
- **THEN** the `resources` array contains at least one entry with a `title`, `url`, and `kind` field

#### Scenario: Resource kinds are constrained to known types
- **WHEN** a resource entry is validated against `lesson_content_v1`
- **THEN** the `kind` field must be one of `book`, `reference`, `playground`, or `blog`

### Requirement: Study Command Re-displays Lesson Content
The system SHALL provide a `study` CLI command that retrieves the stored `lessonContent` from the active session and prints it to stdout, mirroring how `show` displays the exercise pack.

#### Scenario: Study command displays stored lesson
- **WHEN** the learner runs the `study` command with an active session that has lesson content
- **THEN** the system prints the lesson body, worked examples, misconception callouts, and resource links

#### Scenario: Study command fails gracefully when no lesson content
- **WHEN** the learner runs the `study` command and `lessonContent` is null
- **THEN** the system prints a clear message indicating no lesson is available for the current session
