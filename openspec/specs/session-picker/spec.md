## Purpose
Specifies the session picker UI and related commands: a numbered list of all sessions at `session start`, a `session list` command for viewing all sessions, and `session resume` for loading a session by ID prefix or via the picker.

## Requirements

### Requirement: Session start shows a numbered session picker when sessions exist
The system SHALL replace the binary "Continue this session? [y/n]" prompt at `session start` with a numbered list of all sessions from the index (most recent first), followed by a "Start new session" option. Each row SHALL display: short ID, node, language, last-accessed date, and a `[workspace missing]` label if the workspace directory no longer exists on disk.

#### Scenario: Picker lists all sessions most-recent-first
- **WHEN** the learner runs `session start` and the index contains multiple sessions
- **THEN** the system displays a numbered list of all sessions ordered by `lastAccessedAt` descending, with "Start new session" as the last option

#### Scenario: Each picker row shows node, language, and date
- **WHEN** the session picker is displayed
- **THEN** each row includes the short session ID (first 8 chars), node ID, language, and last-accessed date

#### Scenario: Workspace-missing sessions are labelled
- **WHEN** a session's `workspaceDir` no longer exists on disk
- **THEN** its picker row includes a `[workspace missing]` label

#### Scenario: Selecting an existing session resumes it
- **WHEN** the learner enters the number of an existing session
- **THEN** the system loads that session, updates its `lastAccessedAt`, and shows the workspace/exercise info

#### Scenario: Selecting "Start new session" proceeds to new session flow
- **WHEN** the learner enters the number of the "Start new session" option
- **THEN** the system proceeds to language selection and the normal new-session flow

#### Scenario: No sessions shows no picker
- **WHEN** the index is empty
- **THEN** the system skips the picker entirely and proceeds directly to new session flow

### Requirement: session list command prints all sessions
The system SHALL provide a `session list` command that reads `index.json` and prints a human-readable table of all sessions with: short ID, node, language, last-accessed date, and workspace existence indicator.

#### Scenario: session list shows all index entries
- **WHEN** the learner runs `npm run session list`
- **THEN** the system prints one row per index entry ordered by `lastAccessedAt` descending

#### Scenario: session list marks missing workspaces
- **WHEN** a session's workspace directory does not exist
- **THEN** its row is marked with `[workspace missing]`

#### Scenario: session list with empty index
- **WHEN** the index is empty
- **THEN** the system prints "No sessions found."

### Requirement: session resume command loads a session by ID prefix
The system SHALL accept an optional short-ID argument to `session resume`. If provided, the system SHALL find the index entry whose `id` starts with that prefix and load it, updating `lastAccessedAt`. If no argument is given, the session picker SHALL be displayed.

#### Scenario: session resume with valid prefix loads that session
- **WHEN** the learner runs `session resume <prefix>` and exactly one index entry matches
- **THEN** the system loads that session and prints its workspace/exercise info

#### Scenario: session resume with ambiguous prefix reports error
- **WHEN** the learner runs `session resume <prefix>` and multiple entries match
- **THEN** the system prints an error listing the matching IDs and asks for a longer prefix

#### Scenario: session resume with unknown prefix reports error
- **WHEN** the learner runs `session resume <prefix>` and no entries match
- **THEN** the system prints "No session found with ID starting with '<prefix>'"

#### Scenario: session resume with no argument shows picker
- **WHEN** the learner runs `session resume` with no argument
- **THEN** the system displays the session picker
