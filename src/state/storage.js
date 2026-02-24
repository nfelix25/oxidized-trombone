import { promises as fs } from "node:fs";
import path from "node:path";

export class StorageAdapter {
  async read(_key, _fallback = null) {
    throw new Error("StorageAdapter.read not implemented");
  }

  async write(_key, _value) {
    throw new Error("StorageAdapter.write not implemented");
  }
}

export class FileStorageAdapter extends StorageAdapter {
  constructor(baseDir = ".state") {
    super();
    this.baseDir = baseDir;
  }

  filePathFor(key) {
    return path.join(this.baseDir, `${key}.json`);
  }

  async ensureBaseDir() {
    await fs.mkdir(this.baseDir, { recursive: true });
  }

  async read(key, fallback = null) {
    await this.ensureBaseDir();
    const filePath = this.filePathFor(key);

    try {
      const raw = await fs.readFile(filePath, "utf8");
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === "ENOENT") {
        return fallback;
      }
      throw error;
    }
  }

  async write(key, value) {
    await this.ensureBaseDir();
    const filePath = this.filePathFor(key);
    await fs.writeFile(filePath, JSON.stringify(value, null, 2));
    return filePath;
  }
}

export class MemoryStorageAdapter extends StorageAdapter {
  constructor(seed = {}) {
    super();
    this.store = new Map(Object.entries(seed));
  }

  async read(key, fallback = null) {
    return this.store.has(key) ? this.store.get(key) : fallback;
  }

  async write(key, value) {
    this.store.set(key, value);
    return key;
  }
}
