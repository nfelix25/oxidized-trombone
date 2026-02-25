## MODIFIED Requirements

### Requirement: Role-Based Orchestration Uses Dedicated Contracts
The system SHALL orchestrate lesson interactions through distinct roles (`planner`, `teacher`, `author`, `coach`, `reviewer`) with role-specific output schemas.

#### Scenario: Role output is routed by schema contract
- **WHEN** the system invokes a role for a lesson step
- **THEN** the invocation requires the corresponding schema for that role output

#### Scenario: Teacher role output is routed by lesson_content_v1 schema
- **WHEN** the system invokes the `teacher` role
- **THEN** the invocation requires the `lesson_content_v1` schema for output validation
