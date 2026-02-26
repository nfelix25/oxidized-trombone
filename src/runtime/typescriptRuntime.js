import { promises as fs } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// tsconfig.json — maximum strict, ES2022, NodeNext
// ---------------------------------------------------------------------------

const TSCONFIG_CONTENT = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      strict: true,
      exactOptionalPropertyTypes: true,
      noUncheckedIndexedAccess: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: true,
      noEmit: false,
      outDir: ".build",
      declaration: false,
      skipLibCheck: false,
    },
    include: ["src/**/*", "tests/**/*"],
  },
  null,
  2
);

// ---------------------------------------------------------------------------
// tests/type-harness.ts — Expect<Equal<A,B>> and related utilities
// ---------------------------------------------------------------------------

const TYPE_HARNESS_CONTENT = `// type-harness.ts — type-level test utilities for TypeScript curriculum exercises
// This file is intentionally kept short. Understanding Equal<A,B> is itself
// a curriculum exercise (TL19).

// The two-generic-function form is the only Equal<> implementation that correctly
// distinguishes: string vs string & {}, any vs unknown, never vs never.
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

// Fails to type-check if T is not exactly true — use as: type _t = Expect<Equal<A, B>>
export type Expect<T extends true> = T;

// Fails to type-check if T is not exactly false
export type ExpectFalse<T extends false> = T;

// True when A extends B
export type Extends<A, B> = A extends B ? true : false;

// Detecting any: the only type for which 0 extends (1 & T)
export type IsAny<T> = 0 extends 1 & T ? true : false;

// Detecting never: must wrap in a tuple to prevent conditional distributivity
export type IsNever<T> = [T] extends [never] ? true : false;

// Detecting unknown: unknown extends T only when T is unknown or any
export type IsUnknown<T> = unknown extends T
  ? IsAny<T> extends true ? false : true
  : false;
`;

// ---------------------------------------------------------------------------
// src/solution.ts — stub entry point written by starter-expand stage
// ---------------------------------------------------------------------------

const SOLUTION_TS_CONTENT = `// src/solution.ts — exercise implementation entry point
// The starter-expand stage will fill in the type definitions and functions here.
`;

// ---------------------------------------------------------------------------
// run-tests.sh — two-phase: type check then runtime
// ---------------------------------------------------------------------------

const RUN_TESTS_SH_CONTENT = `#!/bin/sh
# run-tests.sh — two-phase TypeScript test runner
# Phase 1: type check (tsc --noEmit). Fails fast on any type error.
# Phase 2: runtime execution via bun (no-op for type-only exercises).
set -e
npx tsc --noEmit --project tsconfig.json
bun run tests/test.ts
`;

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

export async function writeTypescriptProjectConfig(dir) {
  const srcDir = path.join(dir, "src");
  const testsDir = path.join(dir, "tests");
  await fs.mkdir(srcDir, { recursive: true });
  await fs.mkdir(testsDir, { recursive: true });

  await fs.writeFile(path.join(dir, "tsconfig.json"), TSCONFIG_CONTENT);
  await fs.writeFile(path.join(testsDir, "type-harness.ts"), TYPE_HARNESS_CONTENT);
  await fs.writeFile(path.join(srcDir, "solution.ts"), SOLUTION_TS_CONTENT);

  const runTestsPath = path.join(dir, "run-tests.sh");
  await fs.writeFile(runTestsPath, RUN_TESTS_SH_CONTENT);
  await fs.chmod(runTestsPath, 0o755);
}
