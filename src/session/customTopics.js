import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const CUSTOM_TOPICS_DIR = ".state/custom_topics";

function topicsFilePath(language) {
  return path.join(CUSTOM_TOPICS_DIR, `${language}.json`);
}

/**
 * Load custom topics for a given language.
 * Returns an empty array if no file exists.
 *
 * @param {string} language  Language ID (e.g. "rust", "c")
 * @returns {Promise<Array<{id: string, name: string, language: string, keywords: string[]}>>}
 */
export async function loadCustomTopics(language) {
  try {
    const raw = await fs.readFile(topicsFilePath(language), "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

/**
 * Save a new custom topic, appending it to the per-language file.
 * Topic shape: { id, name, language, keywords }
 *
 * @param {{ name: string, language: string, keywords?: string[] }} topic
 * @returns {Promise<{ id: string, name: string, language: string, keywords: string[] }>}
 */
export async function saveCustomTopic({ name, language, keywords = [] }) {
  await fs.mkdir(CUSTOM_TOPICS_DIR, { recursive: true });
  const existing = await loadCustomTopics(language);
  const entry = { id: `custom_${randomUUID()}`, name, language, keywords };
  existing.push(entry);
  await fs.writeFile(topicsFilePath(language), JSON.stringify(existing, null, 2));
  return entry;
}
