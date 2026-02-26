import express from "express";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { existsSync } from "node:fs";
import { errorHandler } from "./middleware/errorHandler.js";
import curriculumRouter from "./routes/curriculum.js";
import sessionsRouter from "./routes/sessions.js";
import workspaceRouter from "./routes/workspace.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 3001;

const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS — local dev only
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// API routes
app.use("/api/curriculum", curriculumRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/sessions", workspaceRouter);

// Serve built client from client/dist if it exists
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("/*any", (_req, res) =>
    res.sendFile(path.join(clientDist, "index.html")),
  );
}

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

export default app;
