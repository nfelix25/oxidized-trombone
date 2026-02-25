import { randomUUID } from "node:crypto";

export function buildContextPacket({
  role,
  taskType,
  learnerProfile,
  curriculumContext,
  scaffoldContext = null,
  priorLoopSections = null,
  currentSections = null,
  nextFocus = null,
  misconceptionContext,
  attemptContext,
  evidenceContext,
  policyContext,
  outputContract,
  memoryContext = {}
}) {
  const packet = {
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

  if (scaffoldContext !== null) packet.scaffold_context = scaffoldContext;
  if (priorLoopSections !== null) packet.prior_loop_sections = priorLoopSections;
  if (currentSections !== null) packet.current_sections = currentSections;
  if (nextFocus !== null) packet.next_focus = nextFocus;

  return packet;
}
