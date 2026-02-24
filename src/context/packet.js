import { randomUUID } from "node:crypto";

export function buildContextPacket({
  role,
  taskType,
  learnerProfile,
  curriculumContext,
  misconceptionContext,
  attemptContext,
  evidenceContext,
  policyContext,
  outputContract,
  memoryContext = {}
}) {
  return {
    schema_version: "context_packet_v1",
    packet_id: randomUUID(),
    timestamp_utc: new Date().toISOString(),
    role,
    task_type: taskType,
    learner_profile: learnerProfile,
    curriculum_context: curriculumContext,
    misconception_context: misconceptionContext,
    attempt_context: attemptContext,
    evidence_context: evidenceContext,
    policy_context: policyContext,
    output_contract: outputContract,
    memory_context: memoryContext
  };
}
