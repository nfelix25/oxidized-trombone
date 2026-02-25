import { promises as fs } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// src/solution.py stub
// ---------------------------------------------------------------------------

const SOLUTION_PY_CONTENT = `# src/solution.py — exercise module entry point
# The starter-expand stage will fill in the exercise functions here.
`;

// ---------------------------------------------------------------------------
// conftest.py (root)
// ---------------------------------------------------------------------------

const CONFTEST_PY_CONTENT = `import sys
from pathlib import Path

# Make src/ importable so tests can do: from solution import ...
sys.path.insert(0, str(Path(__file__).parent / "src"))
`;

// ---------------------------------------------------------------------------
// tests/__init__.py (empty — makes tests a package)
// ---------------------------------------------------------------------------

const TESTS_INIT_PY_CONTENT = ``;

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

export async function writePythonProjectConfig(dir) {
  const srcDir = path.join(dir, "src");
  const testsDir = path.join(dir, "tests");
  await fs.mkdir(srcDir, { recursive: true });
  await fs.mkdir(testsDir, { recursive: true });
  await fs.writeFile(path.join(srcDir, "solution.py"), SOLUTION_PY_CONTENT);
  await fs.writeFile(path.join(dir, "conftest.py"), CONFTEST_PY_CONTENT);
  await fs.writeFile(path.join(testsDir, "__init__.py"), TESTS_INIT_PY_CONTENT);
}
