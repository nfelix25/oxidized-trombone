import { promises as fs } from "node:fs";
import path from "node:path";
import { getLanguageConfig } from "../config/languages.js";

function validFilePath(filePath) {
  return typeof filePath === "string" && filePath.trim().length > 0;
}

// Strip accidental leading "src/" or "tests/" prefix if model includes it
function stripDirPrefix(filePath, prefix) {
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.startsWith(prefix + "/") ? normalized.slice(prefix.length + 1) : normalized;
}

export async function assembleStarterFiles(workspaceDir, starterSections, language = "rust") {
  const { sourceDir } = getLanguageConfig(language);
  const byFile = new Map();
  for (const section of starterSections) {
    if (!validFilePath(section.file_path)) {
      console.warn(`[materialize] skipping starter section ${section.section_id}: empty or missing file_path`);
      continue;
    }
    const filePath = stripDirPrefix(section.file_path, sourceDir);
    if (!byFile.has(filePath)) byFile.set(filePath, []);
    byFile.get(filePath).push(section.content);
  }
  for (const [filePath, parts] of byFile) {
    const outPath = path.join(workspaceDir, sourceDir, filePath);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, parts.join("\n"));
  }
}

export async function assembleTestFiles(workspaceDir, testSections, language = "rust") {
  const { testsDir } = getLanguageConfig(language);
  const byFile = new Map();
  for (const section of testSections) {
    if (!validFilePath(section.file_path)) {
      console.warn(`[materialize] skipping test section ${section.section_id}: empty or missing file_path`);
      continue;
    }
    const filePath = stripDirPrefix(section.file_path, testsDir);
    if (!byFile.has(filePath)) byFile.set(filePath, []);
    byFile.get(filePath).push(section.content);
  }
  for (const [filePath, parts] of byFile) {
    const outPath = path.join(workspaceDir, testsDir, filePath);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, parts.join("\n"));
  }
}

export async function assembleLessonFile(workspaceDir, lessonSections) {
  const content = lessonSections.map((s) => {
    const heading = s.section_title ? `## ${s.section_title}\n\n` : "";
    return `${heading}${s.content}`;
  }).join("\n\n");
  const outPath = path.join(workspaceDir, "LESSON.md");
  await fs.mkdir(workspaceDir, { recursive: true });
  await fs.writeFile(outPath, content);
  return outPath;
}
