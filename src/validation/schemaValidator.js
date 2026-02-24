import { readFileSync } from "node:fs";
import path from "node:path";

const SCHEMA_DIR = path.resolve("src/schemas");

const SCHEMA_FILES = {
  lesson_plan_v1: "lesson_plan_v1.schema.json",
  exercise_pack_v1: "exercise_pack_v1.schema.json",
  hint_pack_v1: "hint_pack_v1.schema.json",
  review_report_v1: "review_report_v1.schema.json"
};

const schemaCache = new Map();

function loadSchema(name) {
  if (schemaCache.has(name)) {
    return schemaCache.get(name);
  }

  const fileName = SCHEMA_FILES[name];
  if (!fileName) {
    throw new Error(`Unknown schema: ${name}`);
  }

  const schema = JSON.parse(readFileSync(path.join(SCHEMA_DIR, fileName), "utf8"));
  schemaCache.set(name, schema);
  return schema;
}

function validateValue(value, schema, field = "$") {
  const errors = [];

  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${field}: expected const ${schema.const}`);
    return errors;
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const valueType = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
    const normalizedType = valueType === "object" && !Array.isArray(value) && value !== null ? "object" : valueType;
    const allowsInteger = types.includes("integer");
    const typeMatched = types.includes(normalizedType) || (allowsInteger && normalizedType === "number");
    if (!typeMatched) {
      errors.push(`${field}: expected type ${types.join("|")}, got ${normalizedType}`);
      return errors;
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${field}: expected one of ${schema.enum.join(", ")}`);
  }

  if (schema.type === "integer") {
    if (!Number.isInteger(value)) {
      errors.push(`${field}: expected integer`);
    }
  }

  if (schema.minimum !== undefined && typeof value === "number" && value < schema.minimum) {
    errors.push(`${field}: expected >= ${schema.minimum}`);
  }

  if (schema.maximum !== undefined && typeof value === "number" && value > schema.maximum) {
    errors.push(`${field}: expected <= ${schema.maximum}`);
  }

  if (schema.type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
    const required = schema.required ?? [];
    for (const key of required) {
      if (!(key in value)) {
        errors.push(`${field}.${key}: missing required property`);
      }
    }

    const properties = schema.properties ?? {};
    for (const [key, entry] of Object.entries(value)) {
      if (schema.additionalProperties === false && !(key in properties)) {
        errors.push(`${field}.${key}: unexpected property`);
        continue;
      }
      if (key in properties) {
        errors.push(...validateValue(entry, properties[key], `${field}.${key}`));
      }
    }
  }

  if (schema.type === "array" && Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${field}: expected at least ${schema.minItems} items`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validateValue(item, schema.items, `${field}[${index}]`));
      });
    }
  }

  return errors;
}

export function validateAgainstSchema(schemaName, payload) {
  const schema = loadSchema(schemaName);
  const errors = validateValue(payload, schema);
  return {
    ok: errors.length === 0,
    errors
  };
}

export function validateRoleOutput(schemaName, payload) {
  return validateAgainstSchema(schemaName, payload);
}
