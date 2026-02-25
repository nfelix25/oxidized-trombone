## MODIFIED Requirements

### Requirement: Exercise Loop Runs Scaffold Then Three Sequential Expand Loops at Session Start
The system SHALL automatically run the scaffold stage followed by three expand loops (starter → test → lesson) when a learning session starts, using the selected node and current learner state. The system SHALL persist workspace file paths and the lesson file path to session state before returning control to the learner. The former planner/teacher/author stage sequence is replaced entirely.

#### Scenario: Session start runs scaffold then all three loops
- **WHEN** a learner starts a session and selects a node
- **THEN** the system runs the scaffold stage, then the starter loop, then the test loop, then the lesson loop, writes all output to the workspace, and saves file paths to session state

#### Scenario: Stage failure at session start is surfaced and session is not persisted
- **WHEN** any stage or loop fails during session start (schema, policy, or execution failure)
- **THEN** the system prints a human-readable error with machine-readable reason and does not save an active session

### Requirement: Context Packets for Stages Are Built from Live Session State
The exercise loop SHALL construct the context packet for each stage call from the current session state at the moment of invocation, including current mastery, misconception history, and attempt evidence for coach and reviewer stages. Each expand loop SHALL additionally receive the accumulated output of all prior loops.

#### Scenario: Coach and reviewer receive current attempt evidence
- **WHEN** the coach or reviewer stage is called after at least one attempt
- **THEN** the context packet includes compiler diagnostics and test outcomes from the most recent attempt

#### Scenario: Scaffold receives mastery and misconception context
- **WHEN** the scaffold stage is called at session start
- **THEN** the context packet includes the learner's current mastery levels and top misconception tags for the selected node

#### Scenario: Lesson expand loop receives starter and test output
- **WHEN** the lesson expand loop is invoked
- **THEN** each lesson expand call's context packet includes the scaffold and summaries of generated starter and test sections

## REMOVED Requirements

### Requirement: Study Command Re-displays Stored Lesson Content
**Reason**: Lesson content is now a file (`LESSON.md`) written directly to the workspace alongside the exercise code. Learners open it in their editor; no CLI re-display command is needed.
**Migration**: Open `LESSON.md` in the workspace directory in your editor.
