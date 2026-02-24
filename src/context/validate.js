const REQUIRED_FIELDS = [
  "schema_version",
  "role",
  "task_type",
  "curriculum_context.node_id",
  "curriculum_context.depth_target",
  "misconception_context.top_node_tags",
  "attempt_context.attempt_index",
  "policy_context.max_attempts_before_reveal",
  "output_contract.schema_name"
];

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function validateContextPacket(packet) {
  const missing = REQUIRED_FIELDS.filter((fieldPath) => {
    const value = getPath(packet, fieldPath);
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === undefined || value === null || value === "";
  });

  const hasEvidence =
    Boolean(packet?.evidence_context?.compiler?.error_codes?.length) ||
    Boolean(packet?.evidence_context?.tests?.failing?.length) ||
    Boolean(packet?.evidence_context?.tests?.passing?.length);

  if (!hasEvidence && ["coach", "reviewer"].includes(packet?.role)) {
    missing.push("evidence_context.compiler|tests");
  }

  return {
    ok: missing.length === 0,
    missing,
    error: missing.length ? "INVALID_CONTEXT" : null
  };
}
