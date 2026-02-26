import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { FileStorageAdapter } from "../../state/storage.js";
import { loadSessionById } from "../../session/session.js";

const router = Router();

function storage() {
  return new FileStorageAdapter(".state/sessions");
}

/**
 * Normalize the `filepath` wildcard param from Express 5.
 * path-to-regexp v8 splits `/*filepath` into an array per `/` segment,
 * so join them back into a single relative path string.
 */
function normalizeFilepathParam(param) {
  if (!param) return "";
  if (Array.isArray(param)) return param.join("/");
  return param;
}

/** Resolve a filepath param that may contain slashes (Express wildcard). */
function resolveFilePath(session, rawPath) {
  // Prevent path traversal
  const rel = path.normalize(rawPath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(session.workspaceDir, rel);
}

// ─── 8.1  GET /api/sessions/:id/workspace ────────────────────────────────────
// List all files in the workspace (excluding hidden dirs like .debug)

router.get("/:id/workspace", async (req, res, next) => {
  try {
    const session = await loadSessionById(storage(), req.params.id);
    if (!session.workspaceDir)
      return res.status(400).json({ error: "No workspace for this session" });

    const files = await walkDir(session.workspaceDir);
    res.json({ files });
  } catch (err) {
    err.status = 404;
    next(err);
  }
});

async function walkDir(dir, base = dir, results = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue; // skip .debug, .git etc.
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(full, base, results);
    } else {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

// ─── 8.2  GET /api/sessions/:id/workspace/*filepath ──────────────────────────

router.get("/:id/workspace/*filepath", async (req, res, next) => {
  try {
    const session = await loadSessionById(storage(), req.params.id);
    const rawPath = normalizeFilepathParam(req.params.filepath);
    const filePath = resolveFilePath(session, rawPath);
    const content = await fs.readFile(filePath, "utf8");
    res.type("text/plain").send(content);
  } catch (err) {
    if (err.code === "ENOENT") {
      err.status = 404;
      err.message = "File not found";
    }
    next(err);
  }
});

// ─── 8.3  PUT /api/sessions/:id/workspace/*filepath ──────────────────────────

router.put("/:id/workspace/*filepath", async (req, res, next) => {
  try {
    const session = await loadSessionById(storage(), req.params.id);
    const rawPath = normalizeFilepathParam(req.params.filepath);
    const filePath = resolveFilePath(session, rawPath);
    const { content } = req.body ?? {};
    if (typeof content !== "string") {
      return res
        .status(400)
        .json({ error: "Request body must include { content: string }" });
    }
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf8");
    res.json({ saved: true });
  } catch (err) {
    next(err);
  }
});

// ─── 8.4  GET /api/sessions/:id/lesson ───────────────────────────────────────

router.get("/:id/lesson", async (req, res, next) => {
  try {
    const session = await loadSessionById(storage(), req.params.id);
    if (!session.lessonFile)
      return res.status(404).json({ error: "No lesson file for this session" });
    const content = await fs.readFile(session.lessonFile, "utf8");
    res.type("text/plain").send(content);
  } catch (err) {
    if (err.code === "ENOENT") {
      err.status = 404;
      err.message = "Lesson file not found on disk";
    }
    next(err);
  }
});

export default router;
