import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

const SESSIONS_BASE = path.resolve(".state/workspaces");

export function workspacePath(sessionId, nodeId) {
  const label = `${sessionId.slice(0, 8)}_${nodeId}`;
  return path.join(SESSIONS_BASE, label);
}

export async function createWorkspace(sessionId, nodeId) {
  const dir = workspacePath(sessionId, nodeId);
  await fs.mkdir(dir, { recursive: true });
  await writeCargotoml(dir, nodeId);
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

async function writeCargotoml(dir, nodeId) {
  const name = nodeId.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const content = `[package]
name = "${name}_exercise"
version = "0.1.0"
edition = "2021"
`;
  const srcDir = path.join(dir, "src");
  await fs.mkdir(srcDir, { recursive: true });
  const testsDir = path.join(dir, "tests");
  await fs.mkdir(testsDir, { recursive: true });
  await fs.writeFile(path.join(dir, "Cargo.toml"), content);
}
