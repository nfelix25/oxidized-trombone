import { promises as fs } from "node:fs";
import path from "node:path";
import { getLanguageConfig } from "../config/languages.js";

const SESSIONS_BASE = path.resolve(".state/workspaces");

export function workspacePath(sessionId, nodeId) {
  const label = `${sessionId.slice(0, 8)}_${nodeId}`;
  return path.join(SESSIONS_BASE, label);
}

export async function createWorkspace(sessionId, nodeId, language = "rust") {
  const dir = workspacePath(sessionId, nodeId);
  const langConfig = getLanguageConfig(language);
  await fs.mkdir(dir, { recursive: true });
  await fs.mkdir(path.join(dir, langConfig.sourceDir), { recursive: true });
  await fs.mkdir(path.join(dir, langConfig.testsDir), { recursive: true });
  await langConfig.writeProjectConfig(dir);
  return { dir, sessionId, nodeId };
}

export async function cleanupWorkspace(wsDir, { keepOnDisk = false } = {}) {
  if (keepOnDisk) return;
  try {
    await fs.rm(wsDir, { recursive: true, force: true });
  } catch {
    // best-effort cleanup
  }
}

export async function workspaceExists(wsDir) {
  try {
    await fs.access(wsDir);
    return true;
  } catch {
    return false;
  }
}
