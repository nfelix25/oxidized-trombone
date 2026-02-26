/**
 * Extract raw JSON from a string that may be wrapped in markdown code fences
 * or have trailing text after the JSON object.
 *
 * Strategy:
 *   1. If there's a ```json fence, extract its contents.
 *   2. Otherwise find the first '{' and walk braces (respecting strings and
 *      escape sequences) to find the matching '}', ignoring any trailing text.
 */
export function extractJson(text) {
  const jsonFence = text.match(/```json\s*\n?([\s\S]*?)\n?```/);
  if (jsonFence) return jsonFence[1].trim();
  return extractJsonObject(text);
}

function extractJsonObject(text) {
  const start = text.indexOf("{");
  if (start === -1) return text.trim();

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }

  // Unbalanced — fall back to everything from start
  return text.slice(start).trim();
}
