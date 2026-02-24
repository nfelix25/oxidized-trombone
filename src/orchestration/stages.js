import { readFileSync } from "node:fs";
import { runCodexExec } from "./codexExec.js";
import { validateRoleOutput } from "../validation/schemaValidator.js";
import { evaluatePolicy, toRejectionResult } from "../policy/engine.js";

const STAGE_TO_SCHEMA = {
  planner: "lesson_plan_v1",
  author: "exercise_pack_v1",
  coach: "hint_pack_v1",
  reviewer: "review_report_v1"
};

export async function runStage(stage, packet, options = {}) {
  const schemaName = STAGE_TO_SCHEMA[stage];
  if (!schemaName) {
    throw new Error(`Unknown stage: ${stage}`);
  }

  const prompt = options.prompt ?? JSON.stringify(packet, null, 2);
  const result = await runCodexExec({
    prompt,
    schemaPath: options.schemaPath,
    outputPath: options.outputPath,
    cwd: options.cwd,
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
  if (options.outputPath) {
    payload = JSON.parse(readFileSync(options.outputPath, "utf8"));
  } else {
    payload = JSON.parse(result.stdout.trim());
  }

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
