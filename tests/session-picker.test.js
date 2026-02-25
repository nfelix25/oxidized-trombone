import test from "node:test";
import assert from "node:assert/strict";
import { loadSessionById, listAllSessions, createNewSession, saveSession } from "../src/session/session.js";
import { MemoryStorageAdapter } from "../src/state/storage.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStorage(seed = {}) {
  return new MemoryStorageAdapter(seed);
}

function makeSession(overrides = {}) {
  return { ...createNewSession("guided", "A200", {}, "rust"), ...overrides };
}

// ---------------------------------------------------------------------------
// loadSessionById
// ---------------------------------------------------------------------------

test("loadSessionById: loads session matching exact prefix", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);

  const prefix = session.sessionId.slice(0, 8);
  const loaded = await loadSessionById(storage, prefix);
  assert.equal(loaded.sessionId, session.sessionId);
});

test("loadSessionById: updates lastAccessedAt for the matched entry", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);

  // Set a known old lastAccessedAt
  const index = await storage.read("index", null);
  index[0].lastAccessedAt = "2020-01-01T00:00:00.000Z";
  await storage.write("index", index);

  const prefix = session.sessionId.slice(0, 8);
  await loadSessionById(storage, prefix);

  const updatedIndex = await storage.read("index", null);
  assert.notEqual(
    updatedIndex[0].lastAccessedAt,
    "2020-01-01T00:00:00.000Z",
    "lastAccessedAt should be updated after loading by ID"
  );
});

test("loadSessionById: throws on unknown prefix", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);

  await assert.rejects(
    () => loadSessionById(storage, "00000000"),
    /No session found with ID starting with '00000000'/
  );
});

test("loadSessionById: throws on ambiguous prefix matching multiple sessions", async () => {
  const storage = makeStorage();

  // Seed two index entries with the same prefix
  const s1 = makeSession();
  const s2 = makeSession();
  await saveSession(storage, s1);
  await saveSession(storage, s2);

  // Manually set both IDs to share a prefix
  const commonPrefix = "aabbcc";
  const index = await storage.read("index", null);
  index[0].id = commonPrefix + "001";
  index[1].id = commonPrefix + "002";
  await storage.write("index", index);
  await storage.write(commonPrefix + "001", s1);
  await storage.write(commonPrefix + "002", s2);

  await assert.rejects(
    () => loadSessionById(storage, commonPrefix),
    /Ambiguous prefix/
  );
});

// ---------------------------------------------------------------------------
// listAllSessions
// ---------------------------------------------------------------------------

test("listAllSessions: returns empty array when index is empty", async () => {
  const storage = makeStorage();
  const result = await listAllSessions(storage);
  assert.deepEqual(result, []);
});

test("listAllSessions: returns entries sorted by lastAccessedAt descending", async () => {
  const storage = makeStorage();
  const older = makeSession();
  const newer = makeSession();

  // Save both sessions first
  await saveSession(storage, older);
  await saveSession(storage, newer);

  // Directly set known timestamps so the ordering is deterministic
  const index = await storage.read("index", null);
  index.find((e) => e.id === older.sessionId).lastAccessedAt = "2024-01-01T00:00:00.000Z";
  index.find((e) => e.id === newer.sessionId).lastAccessedAt = "2025-06-01T00:00:00.000Z";
  await storage.write("index", index);

  const result = await listAllSessions(storage);
  assert.equal(result.length, 2);
  assert.equal(result[0].entry.id, newer.sessionId, "most recent should come first");
  assert.equal(result[1].entry.id, older.sessionId);
});

test("listAllSessions: flags entries with missing workspaceDir", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);

  // Manually set a workspaceDir that doesn't exist
  const index = await storage.read("index", null);
  index[0].workspaceDir = "/nonexistent/path/that/does/not/exist/xyz123";
  await storage.write("index", index);

  const result = await listAllSessions(storage);
  assert.equal(result.length, 1);
  assert.equal(result[0].workspaceExists, false, "missing workspace should be flagged");
});

test("listAllSessions: does not flag entries with no workspaceDir set", async () => {
  const storage = makeStorage();
  const session = makeSession();
  await saveSession(storage, session);

  // Ensure workspaceDir is null (not set)
  const index = await storage.read("index", null);
  index[0].workspaceDir = null;
  await storage.write("index", index);

  const result = await listAllSessions(storage);
  assert.equal(result[0].workspaceExists, true, "null workspaceDir should not be flagged as missing");
});
