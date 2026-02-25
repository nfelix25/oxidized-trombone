## MODIFIED Requirements

### Requirement: Exercise Loop Runs Planner, Teacher, and Author Stages at Session Start
The system SHALL automatically run the planner, teacher, and author stages in sequence when a learning session starts, using the selected node and current learner state, and SHALL persist the resulting exercise pack and lesson content to session state before returning control to the learner.

#### Scenario: Session start triggers lesson setup including teacher
- **WHEN** a learner starts a session and selects a node
- **THEN** the system runs the planner stage, then the teacher stage, then the author stage, materializes the resulting exercise files into a workspace, and saves the exercise pack, lesson content, and workspace path to session state

#### Scenario: Stage failure at session start is surfaced and session is not persisted
- **WHEN** a stage fails during session start (schema, policy, or execution failure) at any of the three stages
- **THEN** the system prints a human-readable error with machine-readable reason and does not save an active session

### Requirement: Context Packets for Stages Are Built from Live Session State
The exercise loop SHALL construct the context packet for each stage call from the current session state at the moment of invocation, including current mastery, misconception history, and attempt evidence for coach and reviewer stages. The teacher stage context packet SHALL include planner output in addition to mastery and misconception context.

#### Scenario: Coach and reviewer receive current attempt evidence
- **WHEN** the coach or reviewer stage is called after at least one attempt
- **THEN** the context packet includes compiler diagnostics and test outcomes from the most recent attempt

#### Scenario: Planner, teacher, and author receive current mastery and misconception context
- **WHEN** the planner, teacher, or author stage is called at session start
- **THEN** the context packet includes the learner's current mastery levels and top misconception tags for the selected node

#### Scenario: Teacher receives planner output in context packet
- **WHEN** the teacher stage is called after planner succeeds
- **THEN** the context packet includes the planner's lesson plan so the teacher can align lesson content with planned objectives

## ADDED Requirements

### Requirement: Study Command Re-displays Stored Lesson Content
The system SHALL provide a `study` command that retrieves the `lessonContent` stored in the active session state and displays it to the learner. The `study` command SHALL be available alongside `show`, `attempt`, `hint`, and `review`.

#### Scenario: Study command displays lesson when content is stored
- **WHEN** the learner runs the `study` command and the active session has `lessonContent` set
- **THEN** the system prints the lesson body, worked examples, misconception callouts, and curated resource links

#### Scenario: Study command reports when no lesson content is stored
- **WHEN** the learner runs the `study` command and `lessonContent` is null
- **THEN** the system prints a clear message that no lesson content is available for this session
