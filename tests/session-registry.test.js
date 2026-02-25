import test from "node:test";
import assert from "node:assert/strict";
import { loadSession, saveSession, createNewSession } from "../src/session/session.js";
import { MemoryStorageAdapter } from "../src/state/storage.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStorage(seed = {}) {
  return new MemoryStorageAdapter(seed);
}

function makeSession() {
  return createNewSession("guided", "A200", {}, "rust");
}

// ---------------------------------------------------------------------------
// saveSession: writes per-session file and creates index entry
// ---------------------------------------------------------------------------

test("session registry: saveSession writes session file keyed by sessionId", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);

  const stored = await storage.read(session.sessionId, null);
  assert.ok(stored !== null, "session file should be written");
  assert.equal(stored.sessionId, session.sessionId);
});

test("session registry: saveSession creates index entry with required fields", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);

  const index = await storage.read("index", null);
  assert.ok(Array.isArray(index), "index should be an array");
  assert.equal(index.length, 1);

  const entry = index[0];
  assert.equal(entry.id, session.sessionId);
  assert.equal(entry.nodeId, session.nodeId);
  assert.equal(entry.language, session.language);
  assert.ok(entry.startedAt, "startedAt should be set");
  assert.ok(entry.lastAccessedAt, "lastAccessedAt should be set");
});

test("session registry: saveSession with two sessions creates two index entries", async () => {
  const storage = makeStorage();
  const s1 = makeSession();
  const s2 = makeSession();
  await saveSession(storage, s1);
  await saveSession(storage, s2);

  const index = await storage.read("index", null);
  assert.equal(index.length, 2);
  const ids = index.map((e) => e.id);
  assert.ok(ids.includes(s1.sessionId));
  assert.ok(ids.includes(s2.sessionId));
});

test("session registry: saveSession updates existing index entry (no duplicates)", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);
  await saveSession(storage, { ...session, status: "ended" });

  const index = await storage.read("index", null);
  assert.equal(index.length, 1, "should not duplicate index entry");
});

// ---------------------------------------------------------------------------
// loadSession: picks most recently accessed session
// ---------------------------------------------------------------------------

test("session registry: loadSession returns most recently accessed session", async () => {
  const storage = makeStorage();
  const older = makeSession();
  const newer = makeSession();

  await saveSession(storage, older);
  // Small delay not needed — manipulate lastAccessedAt directly in index
  const index = await storage.read("index", null);
  index[0].lastAccessedAt = "2025-01-01T00:00:00.000Z"; // older
  await storage.write("index", index);

  await saveSession(storage, newer); // newer gets current timestamp

  const loaded = await loadSession(storage);
  assert.equal(loaded.sessionId, newer.sessionId, "should load the more recently accessed session");
});

test("session registry: loadSession skips stale index entries (missing file)", async () => {
  const storage = makeStorage();
  const session = makeSession();

  // Write index entry pointing to a non-existent session file
  await storage.write("index", [
    {
      id: "ghost-session-id",
      nodeId: "A200",
      language: "rust",
      startedAt: "2025-01-01T00:00:00.000Z",
      lastAccessedAt: "2030-01-01T00:00:00.000Z" // most recent
    }
  ]);
  // Write real session with older timestamp
  await saveSession(storage, session);
  const index = await storage.read("index", null);
  const sessionEntry = index.find((e) => e.id === session.sessionId);
  if (sessionEntry) sessionEntry.lastAccessedAt = "2025-06-01T00:00:00.000Z";
  await storage.write("index", index);

  // Should skip ghost-session-id (file missing) and load the real session
  const loaded = await loadSession(storage);
  assert.ok(loaded !== null, "should load the valid session");
  assert.equal(loaded.sessionId, session.sessionId, "should skip stale entry");
});

// ---------------------------------------------------------------------------
// loadSession: legacy fallback
// ---------------------------------------------------------------------------

test("session registry: loadSession falls back to active_session when index is empty", async () => {
  const legacySession = createNewSession("guided", "A200", {}, "rust");
  const storage = makeStorage({
    active_session: legacySession
  });

  const loaded = await loadSession(storage);
  assert.ok(loaded !== null, "should load legacy session");
  assert.equal(loaded.sessionId, legacySession.sessionId);
});

test("session registry: loadSession ignores active_session when index is non-empty", async () => {
  const legacySession = createNewSession("guided", "A200", {}, "rust");
  const newSession = createNewSession("guided", "S100", {}, "rust");
  const storage = makeStorage({
    active_session: legacySession
  });
  await saveSession(storage, newSession);

  const loaded = await loadSession(storage);
  assert.equal(loaded.sessionId, newSession.sessionId, "should load from index, not legacy file");
});
