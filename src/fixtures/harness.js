import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { validateContextPacket } from "../context/validate.js";
import { validateRoleOutput } from "../validation/schemaValidator.js";
import { evaluatePolicy } from "../policy/engine.js";
import { summarizeFixtureResults, printFixtureReport } from "./reporter.js";

const ROOT = path.resolve("fixtures");

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function collectJsonFiles(dir) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(dir, name));
}

function collectJsonFilesRecursive(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectJsonFilesRecursive(fullPath));
    } else if (entry.name.endsWith(".json")) {
      results.push(fullPath);
    }
  }
  return results;
}

function validateValidFixtures() {
  const results = [];

  const contextDir = path.join(ROOT, "valid", "context");
  for (const file of collectJsonFiles(contextDir)) {
    const data = loadJson(file);
    const result = validateContextPacket(data);
    results.push({
      file,
      ok: result.ok,
      reason: result.ok ? "ok" : result.error,
      rule: result.ok ? null : "context_required_fields"
    });
  }

  const roleMap = {
    scaffold: "scaffold_v1",
    "starter-section": "starter_section_v1",
    "test-section": "test_section_v1",
    "lesson-section": "lesson_section_v1",
    coach: "hint_pack_v1",
    reviewer: "review_report_v1",
    "c-scaffold": "scaffold_v1",
    "c-starter-section": "starter_section_v1",
    "c-test-section": "test_section_v1",
    "c-lesson-section": "lesson_section_v1"
  };

  for (const [folder, schemaName] of Object.entries(roleMap)) {
    const dir = path.join(ROOT, "valid", folder);
    for (const file of collectJsonFiles(dir)) {
      const payload = loadJson(file);
      const schemaResult = validateRoleOutput(schemaName, payload);
      const policyResult = evaluatePolicy({ schemaName, payload, packet: {} });
      results.push({
        file,
        ok: schemaResult.ok && policyResult.ok,
        reason: !schemaResult.ok
          ? schemaResult.errors.join("; ")
          : !policyResult.ok
            ? policyResult.violations.map((v) => v.reason).join("; ")
            : "ok",
        rule: !schemaResult.ok
          ? "schema_validation"
          : !policyResult.ok
            ? policyResult.violations[0]?.rule
            : null
      });
    }
  }

  // Live-sequence fixtures: schema_version field determines schema
  const SCHEMA_VERSION_MAP = {
    scaffold_v1: "scaffold_v1",
    starter_section_v1: "starter_section_v1",
    test_section_v1: "test_section_v1",
    lesson_section_v1: "lesson_section_v1",
    hint_pack_v1: "hint_pack_v1",
    review_report_v1: "review_report_v1"
  };
  const liveSeqDir = path.join(ROOT, "valid", "live_sequence");
  for (const file of collectJsonFiles(liveSeqDir)) {
    const payload = loadJson(file);
    const schemaName = SCHEMA_VERSION_MAP[payload.schema_version];
    if (!schemaName) {
      results.push({ file, ok: false, rule: "unknown_schema", reason: `Unknown schema_version: ${payload.schema_version}` });
      continue;
    }
    const schemaResult = validateRoleOutput(schemaName, payload);
    const policyResult = evaluatePolicy({ schemaName, payload, packet: {} });
    results.push({
      file,
      ok: schemaResult.ok && policyResult.ok,
      reason: !schemaResult.ok
        ? schemaResult.errors.join("; ")
        : !policyResult.ok
          ? policyResult.violations.map((v) => v.reason).join("; ")
          : "ok",
      rule: !schemaResult.ok
        ? "schema_validation"
        : !policyResult.ok
          ? policyResult.violations[0]?.rule
          : null
    });
  }

  return results;
}

function validateInvalidFixtures() {
  const results = [];
  const invalidDir = path.join(ROOT, "invalid");

  for (const file of collectJsonFilesRecursive(invalidDir)) {
    const fixture = loadJson(file);
    const schemaResult = validateRoleOutput(fixture.schemaName, fixture.payload);

    let ok = false;
    let rule = "schema_validation";
    let reason = "expected failure";

    if (!schemaResult.ok) {
      ok = true;
      reason = "schema rejected as expected";
    } else {
      const policyResult = evaluatePolicy({
        schemaName: fixture.schemaName,
        payload: fixture.payload,
        packet: fixture.packet
      });

      if (!policyResult.ok) {
        const triggeredRule = policyResult.violations[0]?.rule;
        ok = fixture.expectedRule ? triggeredRule === fixture.expectedRule : true;
        rule = triggeredRule;
        reason = ok
          ? "policy rejected as expected"
          : `unexpected rule: ${triggeredRule}`;
      } else {
        ok = false;
        reason = "invalid fixture unexpectedly passed";
      }
    }

    results.push({ file, ok, rule, reason });
  }

  return results;
}

export function runFixtureValidation() {
  const results = [...validateValidFixtures(), ...validateInvalidFixtures()];
  const summary = summarizeFixtureResults(results);
  return { results, summary };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { summary } = runFixtureValidation();
  printFixtureReport(summary);
  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}
