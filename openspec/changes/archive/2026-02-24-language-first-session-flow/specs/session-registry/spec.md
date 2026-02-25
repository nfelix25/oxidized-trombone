## ADDED Requirements

### Requirement: Sessions are stored as individual files with a shared index
The system SHALL save each session as a separate file at `.state/sessions/<uuid>.json` and maintain a `.state/sessions/index.json` that lists metadata for all known sessions. The index SHALL contain, for each entry: `id`, `nodeId`, `language`, `startedAt`, and `lastAccessedAt`.

#### Scenario: New session creates a per-session file and updates the index
- **WHEN** a new session is created and saved
- **THEN** a file named `<sessionId>.json` is written under `.state/sessions/` and an entry is added or updated in `index.json`

#### Scenario: Index entry contains required metadata fields
- **WHEN** a session is saved
- **THEN** its index entry includes `id`, `nodeId`, `language`, `startedAt`, and `lastAccessedAt`

### Requirement: Active session is the most recently accessed entry in the index
The system SHALL define "active session" as the session with the latest `lastAccessedAt` timestamp in the index. Loading or saving a session SHALL update its `lastAccessedAt`.

#### Scenario: Loading a session updates its lastAccessedAt
- **WHEN** an existing session is loaded via the resume flow
- **THEN** its `lastAccessedAt` is updated in the index

#### Scenario: Most recently touched session is returned as active
- **WHEN** multiple sessions exist in the index
- **THEN** the session with the latest `lastAccessedAt` is treated as the active session for resume purposes

### Requirement: Session loader falls back to legacy active_session.json
The system SHALL read `.state/sessions/active_session.json` as a fallback when the session index is empty or missing, for backward compatibility with sessions created before this change.

#### Scenario: Empty index falls back to legacy file
- **WHEN** the index is empty and `active_session.json` exists
- **THEN** the system loads the legacy session and treats it as the active session

#### Scenario: Non-empty index takes precedence over legacy file
- **WHEN** the index contains at least one entry
- **THEN** `active_session.json` is ignored in favour of the index

### Requirement: Stale index entries are silently skipped
The system SHALL validate that the session file referenced by each index entry exists before loading it. If the file is missing, that index entry SHALL be silently skipped.

#### Scenario: Missing session file is skipped gracefully
- **WHEN** an index entry references a session file that does not exist on disk
- **THEN** the system skips that entry without throwing and continues to the next entry
