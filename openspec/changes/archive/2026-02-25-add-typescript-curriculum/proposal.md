## Why

The tutor currently covers Rust, C, Zig, Python, and C++ but has no TypeScript track. The user is a JS developer by trade whose primary learning goal is systems programming and JS runtime internals — TypeScript's advanced type system and its runtime bridges are directly relevant to understanding how type checkers, parsers, and language runtimes work. Adding a comprehensive, depth-first TypeScript track fills this gap and gives the user mastery of the type system they use daily.

## What Changes

- Add a new `typescript` language entry to the language registry (`src/config/languages.js`) with all 6 stage instruction sets
- Add `src/runtime/typescriptRuntime.js` to scaffold TypeScript workspaces (tsconfig.json, type-harness, test setup)
- Add `src/curriculum/typescriptSeed.js` with ~112 nodes across 9 tracks
- Update `src/curriculum/allCurricula.js` to import and merge the new curriculum
- Add per-language curriculum test file `tests/typescript-curriculum.test.js`
- Update `package.json` devDependencies to include `typescript` (for `tsc`) if not already present

## Capabilities

### New Capabilities

- `typescript-curriculum`: The full ~112-node TypeScript curriculum covering foundations, narrowing/CFA, generics, variance, advanced type operators, type-level challenges, runtime bridges, compiler performance, and declarations — weighted heavily toward intermediate/advanced content with every notable feature from TS 4.0 through 5.5 covered
- `typescript-language-runtime`: Workspace scaffolding and test execution for TypeScript exercises, including a custom type-level test harness (`Expect<Equal<A,B>>` pattern), tsconfig with strict settings, and a hybrid test command covering both `tsc --noEmit` (type checks) and `bun run` (runtime execution for hybrid exercises)

### Modified Capabilities

- `multi-language-support`: TypeScript is added as a supported language; the registry gains a new entry and the materialize/commandRunner pipelines are exercised with a new `testCommand` shape (shell script for two-phase type + runtime testing)

## Impact

- `src/config/languages.js` — new TYPESCRIPT_INSTRUCTIONS object + registry entry
- `src/runtime/typescriptRuntime.js` — new file
- `src/curriculum/typescriptSeed.js` — new file, ~112 nodes
- `src/curriculum/allCurricula.js` — import added
- `tests/typescript-curriculum.test.js` — new test file
- `package.json` — add `typescript` as devDependency if absent
- No breaking changes; all existing language tracks are unaffected
