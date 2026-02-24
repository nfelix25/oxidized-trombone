import { promises as fs } from "node:fs";
import path from "node:path";

const AUDIT_DIR = path.resolve(".state/audit");

export function buildAuditEntry({ stage, schemaName, reason, violations, errors, packet }) {
  return {
    at: new Date().toISOString(),
    stage: stage ?? null,
    schemaName: schemaName ?? null,
    reason,
    ruleIds: violations ? violations.map((v) => v.rule) : [],
    violations: violations ?? null,
    errors: errors ?? null,
    packetId: packet?.packet_id ?? null,
    nodeId: packet?.curriculum_context?.node_id ?? null
  };
}

export async function appendAuditLog(entry) {
  await fs.mkdir(AUDIT_DIR, { recursive: true });
  const filePath = path.join(AUDIT_DIR, "failures.jsonl");
  const line = JSON.stringify(entry) + "\n";
  await fs.appendFile(filePath, line, "utf8");
  return filePath;
}

export async function logStageFailure({ stage, stageResult, packet }) {
  if (!stageResult || stageResult.accepted === true) return;
  const entry = buildAuditEntry({
    stage,
    schemaName: stageResult.schemaName,
    reason: stageResult.reason,
    violations: stageResult.violations,
    errors: stageResult.errors,
    packet
  });
  return appendAuditLog(entry);
}
