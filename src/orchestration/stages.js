import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCodexExec } from "./codexExec.js";
import { runClaudeExec } from "./claudeExec.js";
import { extractJson } from "./extractJson.js";
import { validateRoleOutput } from "../validation/schemaValidator.js";
import { evaluatePolicy, toRejectionResult } from "../policy/engine.js";
import { getLanguageConfig } from "../config/languages.js";

const STAGE_TO_SCHEMA = {
  scaffold: "scaffold_v1",
  "starter-expand": "starter_section_v1",
  "test-expand": "test_section_v1",
  "lesson-expand": "lesson_section_v1",
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

  const provider = options.provider ?? "codex";
  const resolvedSchemaPath = options.schemaPath ?? schemaPathFor(schemaName);
  const langInstructions = getLanguageConfig(options.language ?? "rust").stageInstructions;
  const instruction = langInstructions[stage] ?? "Generate a JSON object for the following context. Output ONLY the JSON object.\n\nContext packet:";

  let prompt;
  if (options.prompt) {
    prompt = options.prompt;
  } else if (provider === "claude") {
    const schemaJson = readFileSync(resolvedSchemaPath, "utf8");
    prompt = `You must output ONLY a raw JSON object with no markdown fences, no explanation, and no extra text. The JSON must strictly conform to this schema (all required fields present, no additional properties):\n\n${schemaJson}\n\n${instruction}\n\n${JSON.stringify(packet, null, 2)}`;
  } else {
    prompt = `${instruction}\n\n${JSON.stringify(packet, null, 2)}`;
  }

  let result;
  if (provider === "claude") {
    result = await runClaudeExec({
      prompt,
      model: options.model ?? "claude-sonnet-4-6",
      command: options.command
    });
  } else {
    result = await runCodexExec({
      prompt,
      schemaPath: resolvedSchemaPath,
      outputPath: options.outputPath,
      cwd: options.cwd,
      model: options.model,
      sandbox: options.sandbox,
      approval: options.approval,
      command: options.command
    });
  }

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
    if (provider === "claude") {
      payload = JSON.parse(extractJson(result.stdout));
    } else if (options.outputPath) {
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

export const runScaffoldStage = (packet, options) => runStage("scaffold", packet, options);
export const runStarterExpandStage = (packet, options) => runStage("starter-expand", packet, options);
export const runTestExpandStage = (packet, options) => runStage("test-expand", packet, options);
export const runLessonExpandStage = (packet, options) => runStage("lesson-expand", packet, options);
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
