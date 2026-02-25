import { promises as fs } from "node:fs";
import { question } from "./modeSelect.js";

const SESSION_INDEX_KEY = "index";

function formatDate(isoStr) {
  if (!isoStr) return "unknown";
  return isoStr.slice(0, 10);
}

async function checkWorkspaceExists(workspaceDir) {
  if (!workspaceDir) return true; // no workspace recorded — don't flag as missing
  try {
    await fs.access(workspaceDir);
    return true;
  } catch {
    return false;
  }
}

export async function runSessionPicker(rl, storage) {
  const index = (await storage.read(SESSION_INDEX_KEY, null)) ?? [];

  if (index.length === 0) return null;

  // Sort by lastAccessedAt descending (most recent first)
  const sorted = [...index].sort((a, b) => {
    const ta = a.lastAccessedAt ?? a.startedAt ?? "";
    const tb = b.lastAccessedAt ?? b.startedAt ?? "";
    return tb > ta ? 1 : -1;
  });

  // Check workspace existence for each entry
  const entries = await Promise.all(
    sorted.map(async (entry) => ({
      entry,
      workspaceExists: await checkWorkspaceExists(entry.workspaceDir)
    }))
  );

  console.log("\nYour sessions:");
  entries.forEach(({ entry, workspaceExists }, i) => {
    const shortId = (entry.id ?? "").slice(0, 8);
    const date = formatDate(entry.lastAccessedAt ?? entry.startedAt);
    const missing = workspaceExists ? "" : " [workspace missing]";
    console.log(
      `  ${i + 1}) [${shortId}] ${entry.nodeId ?? "?"} (${entry.language ?? "?"}) — ${date}${missing}`
    );
  });
  console.log(`  ${entries.length + 1}) Start new session`);

  while (true) {
    const answer = (await question(rl, `Choice [1-${entries.length + 1}]: `)).trim();
    const idx = parseInt(answer, 10) - 1;

    if (idx === entries.length) return null; // "Start new session"

    if (idx >= 0 && idx < entries.length) {
      const { entry } = entries[idx];
      const session = await storage.read(entry.id, null);
      if (!session) {
        console.log("Session data not found. Please choose another.");
        continue;
      }
      // Update lastAccessedAt in the index
      const now = new Date().toISOString();
      const fullIndex = (await storage.read(SESSION_INDEX_KEY, null)) ?? [];
      const updatedIndex = fullIndex.map((e) =>
        e.id === entry.id ? { ...e, lastAccessedAt: now } : e
      );
      await storage.write(SESSION_INDEX_KEY, updatedIndex);
      return session;
    }

    console.log(`Please enter a number between 1 and ${entries.length + 1}.`);
  }
}
