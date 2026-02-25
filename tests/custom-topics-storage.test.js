import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";

// ---------------------------------------------------------------------------
// We need to test loadCustomTopics / saveCustomTopic with a temp directory.
// The module hard-codes ".state/custom_topics", so we test behaviour through
// the actual functions using a real temp dir.  We override the working
// directory for the duration of each test to keep the real .state untouched.
// ---------------------------------------------------------------------------

async function withTempCwd(fn) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ox-ct-test-"));
  const originalCwd = process.cwd();
  try {
    process.chdir(tmpDir);
    return await fn(tmpDir);
  } finally {
    process.chdir(originalCwd);
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

// Dynamic import needed because module is loaded once; we work around the
// hard-coded path by running tests inside the temp dir.
async function importModule() {
  // Node caches modules, so we need a fresh import for each test when cwd changes.
  // For simplicity, import once — the temp dir approach means the files land
  // in the right relative location regardless.
  const { loadCustomTopics, saveCustomTopic } = await import("../src/session/customTopics.js");
  return { loadCustomTopics, saveCustomTopic };
}

// ---------------------------------------------------------------------------

test("customTopics: loadCustomTopics returns empty array when no file exists", async () => {
  await withTempCwd(async () => {
    const { loadCustomTopics } = await importModule();
    const topics = await loadCustomTopics("rust");
    assert.deepEqual(topics, []);
  });
});

test("customTopics: saveCustomTopic creates file and returns topic with id", async () => {
  await withTempCwd(async () => {
    const { saveCustomTopic, loadCustomTopics } = await importModule();
    const saved = await saveCustomTopic({ name: "Pointer Arithmetic", language: "c", keywords: ["pointer", "arithmetic"] });
    assert.ok(saved.id.startsWith("custom_"), "id should start with custom_");
    assert.equal(saved.name, "Pointer Arithmetic");
    assert.equal(saved.language, "c");
    assert.deepEqual(saved.keywords, ["pointer", "arithmetic"]);

    const loaded = await loadCustomTopics("c");
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].id, saved.id);
  });
});

test("customTopics: multiple saves append to the same file", async () => {
  await withTempCwd(async () => {
    const { saveCustomTopic, loadCustomTopics } = await importModule();
    await saveCustomTopic({ name: "Topic A", language: "rust" });
    await saveCustomTopic({ name: "Topic B", language: "rust" });
    const topics = await loadCustomTopics("rust");
    assert.equal(topics.length, 2);
    const names = topics.map((t) => t.name);
    assert.ok(names.includes("Topic A"));
    assert.ok(names.includes("Topic B"));
  });
});

test("customTopics: topics are language-scoped (c topics not in rust file)", async () => {
  await withTempCwd(async () => {
    const { saveCustomTopic, loadCustomTopics } = await importModule();
    await saveCustomTopic({ name: "C Topic", language: "c" });
    await saveCustomTopic({ name: "Rust Topic", language: "rust" });

    const cTopics = await loadCustomTopics("c");
    const rustTopics = await loadCustomTopics("rust");
    assert.equal(cTopics.length, 1);
    assert.equal(rustTopics.length, 1);
    assert.equal(cTopics[0].name, "C Topic");
    assert.equal(rustTopics[0].name, "Rust Topic");
  });
});

test("customTopics: saveCustomTopic uses empty keywords array when not provided", async () => {
  await withTempCwd(async () => {
    const { saveCustomTopic, loadCustomTopics } = await importModule();
    await saveCustomTopic({ name: "No Keywords", language: "rust" });
    const topics = await loadCustomTopics("rust");
    assert.deepEqual(topics[0].keywords, []);
  });
});
