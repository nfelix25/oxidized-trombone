## ADDED Requirements

### Requirement: Role-Based Orchestration Uses Dedicated Contracts
The system SHALL orchestrate lesson interactions through distinct roles (`planner`, `author`, `coach`, `reviewer`) with role-specific output schemas.

#### Scenario: Role output is routed by schema contract
- **WHEN** the system invokes a role for a lesson step
- **THEN** the invocation requires the corresponding schema for that role output

### Requirement: Context Packet Is Mandatory for Codex Invocations
The system SHALL require a valid context packet for each Codex lesson invocation and SHALL fail closed if required packet fields are missing.

#### Scenario: Missing required context field
- **WHEN** an invocation payload omits a required context field
- **THEN** the system rejects the invocation before calling Codex

### Requirement: Role Outputs Must Pass Schema Validation
The system SHALL validate each role output against its declared JSON schema and SHALL reject non-conforming outputs.

#### Scenario: Schema mismatch in role output
- **WHEN** Codex returns output that violates the declared schema
- **THEN** the system marks the output invalid and prevents downstream consumption

### Requirement: Policy Engine Enforces Pedagogical Guardrails
The system SHALL apply deterministic policy checks after schema validation, including reveal restrictions and consistency checks.

#### Scenario: Early reveal policy violation
- **WHEN** a coach output includes a full solution before reveal conditions are met
- **THEN** the policy engine rejects the output as non-compliant
