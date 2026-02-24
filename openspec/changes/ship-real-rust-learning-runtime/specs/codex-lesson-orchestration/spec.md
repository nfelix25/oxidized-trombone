## MODIFIED Requirements

### Requirement: Role-Based Orchestration Uses Dedicated Contracts
The system SHALL orchestrate lesson interactions through distinct roles (`planner`, `author`, `coach`, `reviewer`) with role-specific output schemas, and SHALL execute those roles through live `codex exec` invocations by default.

#### Scenario: Role output is routed by schema contract
- **WHEN** the system invokes a role for a lesson step
- **THEN** the invocation requires the corresponding schema for that role output

#### Scenario: Live stage execution is used in runtime sessions
- **WHEN** a learner runs a normal session mode
- **THEN** each stage is executed through live `codex exec` unless fallback mode is explicitly selected

### Requirement: Context Packet Is Mandatory for Codex Invocations
The system SHALL require a valid context packet for each Codex lesson invocation and SHALL fail closed if required packet fields are missing, including runtime evidence fields for coach/reviewer stages.

#### Scenario: Missing required context field
- **WHEN** an invocation payload omits a required context field
- **THEN** the system rejects the invocation before calling Codex

#### Scenario: Missing coach evidence field
- **WHEN** a coach or reviewer invocation lacks required attempt evidence
- **THEN** the system marks the invocation invalid and returns `INVALID_CONTEXT`

### Requirement: Role Outputs Must Pass Schema Validation
The system SHALL validate each role output against its declared JSON schema and SHALL reject non-conforming outputs before stage results are consumed by runtime state transitions.

#### Scenario: Schema mismatch in role output
- **WHEN** Codex returns output that violates the declared schema
- **THEN** the system marks the output invalid and prevents downstream consumption

#### Scenario: Valid stage output advances pipeline
- **WHEN** a stage output passes schema validation
- **THEN** the system allows it to proceed to policy checks and runtime integration

### Requirement: Policy Engine Enforces Pedagogical Guardrails
The system SHALL apply deterministic policy checks after schema validation, including reveal restrictions, pass/score consistency, and runtime safety rules for stage handoff decisions.

#### Scenario: Early reveal policy violation
- **WHEN** a coach output includes a full solution before reveal conditions are met
- **THEN** the policy engine rejects the output as non-compliant

#### Scenario: Policy rejection returns machine-readable reason
- **WHEN** a stage output violates policy
- **THEN** the system returns a machine-readable violation rule and reason for auditability
