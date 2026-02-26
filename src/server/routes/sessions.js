import { Router } from "express";
import { FileStorageAdapter } from "../../state/storage.js";
import {
  createNewSession,
  saveSession,
  loadSessionById,
  listAllSessions,
  saveGlobalMastery
} from "../../session/session.js";
import { setupExercise, runAttempt, requestHint } from "../../session/exerciseLoop.js";
import { runExerciseStreaming } from "../../runtime/commandRunner.js";
import { recommendNextNodes } from "../../mastery/recommend.js";
import { allCurricula } from "../../curriculum/allCurricula.js";
import * as sessionBus from "../streaming/sessionBus.js";

const router = Router();

function storage() {
  return new FileStorageAdapter(".state/sessions");
}

/** Send a single SSE event frame */
function sseWrite(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

/** Set SSE headers and return a send helper */
function openSSE(res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  return (event) => sseWrite(res, event);
}

// ─── 7.1  GET /api/sessions ──────────────────────────────────────────────────

router.get("/", async (_req, res, next) => {
  try {
    const results = await listAllSessions(storage());
    res.json(results.map(({ entry, workspaceExists }) => ({ ...entry, workspaceExists })));
  } catch (err) {
    next(err);
  }
});

// ─── 7.2  GET /api/sessions/:id ──────────────────────────────────────────────

router.get("/:id", async (req, res, next) => {
  try {
    const session = await loadSessionById(storage(), req.params.id);
    res.json(session);
  } catch (err) {
    err.status = 404;
    next(err);
  }
});

// ─── 7.3  POST /api/sessions ─────────────────────────────────────────────────

router.post("/", async (req, res, next) => {
  try {
    const { nodeId, language = "rust", customNode = null, provider = "codex" } = req.body ?? {};

    const globalMasteryByNode = {}; // sessions start without merged global mastery for now
    const draft = createNewSession("guided", nodeId ?? null, globalMasteryByNode, language, provider);
    if (customNode) draft.customNode = customNode;

    // Save draft immediately so the session exists in the index
    await saveSession(storage(), draft);
    const { sessionId } = draft;

    // Register SSE bus before returning so clients can subscribe immediately
    sessionBus.create(sessionId);

    // Run setup in background — do not await
    (async () => {
      try {
        const onEvent = (event) => sessionBus.emit(sessionId, event);
        const updatedSession = await setupExercise(draft, { onEvent });
        if (updatedSession) {
          await saveSession(storage(), updatedSession);
          sessionBus.emit(sessionId, { type: "complete", sessionId });
        } else {
          sessionBus.emit(sessionId, { type: "error", message: "Setup failed" });
        }
      } catch (err) {
        sessionBus.emit(sessionId, { type: "error", message: err.message });
      } finally {
        sessionBus.destroy(sessionId);
      }
    })();

    res.status(202).json({ sessionId });
  } catch (err) {
    next(err);
  }
});

// ─── 7.4  GET /api/sessions/:id/events  (SSE) ────────────────────────────────

router.get("/:id/events", (req, res) => {
  const { id } = req.params;
  const send = openSSE(res);

  const handler = (event) => {
    send(event);
    if (event.type === "complete" || event.type === "error") {
      res.end();
    }
  };

  sessionBus.subscribe(id, handler);

  req.on("close", () => {
    sessionBus.unsubscribe(id, handler);
  });
});

// ─── 7.5  DELETE /api/sessions/:id ───────────────────────────────────────────

router.delete("/:id", async (req, res, next) => {
  try {
    const store = storage();
    const session = await loadSessionById(store, req.params.id);

    const recommendations = recommendNextNodes({
      graph: allCurricula,
      masteryState: session.masteryState,
      misconceptionState: session.misconceptionState
    });

    const ended = { ...session, status: "ended", endedAt: new Date().toISOString() };
    await saveSession(store, ended);
    await saveGlobalMastery(ended.masteryState);

    res.json({
      session: ended,
      recommendations
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
});

// ─── 7.6  POST /api/sessions/:id/attempt  (SSE) ──────────────────────────────

router.post("/:id/attempt", async (req, res, next) => {
  const send = openSSE(res);

  try {
    const store = storage();
    const session = await loadSessionById(store, req.params.id);

    // Stream test output lines as SSE events while the subprocess runs
    const exerciseRunner = (workspaceDir, lang) =>
      runExerciseStreaming(workspaceDir, lang, (line) =>
        send({ type: "test-output", line })
      );

    const updated = await runAttempt(session, {
      exerciseRunner,
      onEvent: send
    });

    if (updated) {
      await saveSession(store, updated);
    }

    send({ type: "done" });
    res.end();
  } catch (err) {
    send({ type: "error", message: err.message });
    res.end();
    next(err);
  }
});

// ─── 7.7  POST /api/sessions/:id/hint ────────────────────────────────────────

router.post("/:id/hint", async (req, res, next) => {
  try {
    const store = storage();
    const session = await loadSessionById(store, req.params.id);
    const { message: userMessage } = req.body ?? {};

    const updated = await requestHint(session, { userMessage: userMessage ?? null });
    if (!updated) {
      return res.status(400).json({ error: "Hint request failed or no exercise active" });
    }

    await saveSession(store, updated);

    const hintPack = updated.lastHintPack;
    const level = updated.attemptState?.hintLevelUsed ?? 1;
    const text = hintPack?.current_hint?.text ?? "(no hint text)";
    res.json({ level, text });
  } catch (err) {
    next(err);
  }
});

export default router;
