## MODIFIED Requirements

### Requirement: Active session is the most recently accessed entry in the index
The system SHALL define "active session" as the session with the latest `lastAccessedAt` timestamp in the index. Loading or saving a session SHALL update its `lastAccessedAt`. Any session in the index MAY be explicitly loaded by ID, which also updates its `lastAccessedAt` and makes it the new active session.

#### Scenario: Loading a session updates its lastAccessedAt
- **WHEN** an existing session is loaded via the resume flow
- **THEN** its `lastAccessedAt` is updated in the index

#### Scenario: Most recently touched session is returned as active
- **WHEN** multiple sessions exist in the index
- **THEN** the session with the latest `lastAccessedAt` is treated as the active session for resume purposes

#### Scenario: Loading a session by ID makes it the active session
- **WHEN** the learner selects or resumes a specific session by ID
- **THEN** that session's `lastAccessedAt` is updated to now, making it the most recently accessed session
