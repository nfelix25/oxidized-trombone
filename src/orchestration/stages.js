import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCodexExec } from "./codexExec.js";
import { validateRoleOutput } from "../validation/schemaValidator.js";
import { evaluatePolicy, toRejectionResult } from "../policy/engine.js";

const STAGE_TO_SCHEMA = {
  planner: "lesson_plan_v1",
  author: "exercise_pack_v1",
  coach: "hint_pack_v1",
  reviewer: "review_report_v1"
};

const SCHEMA_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../schemas"
);

function schemaPathFor(schemaName) {
  return path.join(SCHEMA_DIR, `${schemaName}.schema.json`);
}

export const FALLBACK_MODE = process.env.STAGE_FALLBACK === "1";

export async function runStage(stage, packet, options = {}) {
  const schemaName = STAGE_TO_SCHEMA[stage];
  if (!schemaName) {
    throw new Error(`Unknown stage: ${stage}`);
  }

  const useFallback = options.fallback ?? FALLBACK_MODE;

  if (useFallback) {
    if (!options.fallbackPayload) {
      return {
        accepted: false,
        schemaName,
        reason: "EXECUTION_FAILED",
        details: "fallback mode active but no fallbackPayload provided"
      };
    }
    return validateStagePayload(schemaName, options.fallbackPayload, packet);
  }

  const resolvedSchemaPath = options.schemaPath ?? schemaPathFor(schemaName);
  const prompt = options.prompt ?? JSON.stringify(packet, null, 2);
  const result = await runCodexExec({
    prompt,
    schemaPath: resolvedSchemaPath,
    outputPath: options.outputPath,
    cwd: options.cwd,
    model: options.model,
    sandbox: options.sandbox,
    approval: options.approval,
    command: options.command
  });

  if (result.code !== 0) {
    return {
      accepted: false,
      schemaName,
      reason: "EXECUTION_FAILED",
      details: result.stderr
    };
  }

  let payload;
  try {
    if (options.outputPath) {
      payload = JSON.parse(readFileSync(options.outputPath, "utf8"));
    } else {
      payload = JSON.parse(result.stdout.trim());
    }
  } catch (err) {
    return {
      accepted: false,
      schemaName,
      reason: "EXECUTION_FAILED",
      details: `Failed to parse stage output: ${err.message}`
    };
  }

  return validateStagePayload(schemaName, payload, packet);
}

function validateStagePayload(schemaName, payload, packet) {
  const schemaValidation = validateRoleOutput(schemaName, payload);
  if (!schemaValidation.ok) {
    return {
      accepted: false,
      schemaName,
      reason: "SCHEMA_VALIDATION_FAILED",
      errors: schemaValidation.errors
    };
  }

  const policyResult = evaluatePolicy({ schemaName, payload, packet });
  if (!policyResult.ok) {
    return toRejectionResult(schemaName, policyResult.violations);
  }

  return {
    accepted: true,
    schemaName,
    payload
  };
}

export const runPlannerStage = (packet, options) => runStage("planner", packet, options);
export const runAuthorStage = (packet, options) => runStage("author", packet, options);
export const runCoachStage = (packet, options) => runStage("coach", packet, options);
export const runReviewerStage = (packet, options) => runStage("reviewer", packet, options);

export function toMachineReadableError(stageResult) {
  if (!stageResult) return { error: "NULL_RESULT" };
  return {
    accepted: false,
    reason: stageResult.reason ?? "UNKNOWN",
    schemaName: stageResult.schemaName ?? null,
    violations: stageResult.violations ?? null,
    errors: stageResult.errors ?? null,
    details: stageResult.details ?? null,
    retryAttempt: stageResult.retryAttempt ?? null
  };
}
