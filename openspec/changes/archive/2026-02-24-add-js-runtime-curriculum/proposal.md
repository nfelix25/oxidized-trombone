## Why

The user is a JavaScript developer whose primary learning goal is to deeply understand how JS runtimes work — the event loop, garbage collector, JIT compiler, object model, bytecode VM, and all the machinery that makes JS fast. The OS/systems curriculum (C track) is the on-ramp providing prerequisite knowledge, but the JS runtime is the destination. This change adds ~70 nodes implementing minimal but real versions of each runtime subsystem in C, organized into 10 tracks that mirror the actual internal architecture of V8/JSC/libuv.

## What Changes

- Add ~70 new curriculum nodes, all `language: "c"`, using J-prefix IDs (JL/JB/JV/JO/JG/JE/JP/JC/JT/JR)
- 10 tracks: language frontend, bytecode, virtual machine, object model, garbage collection, event loop, promises/async, closures/scope, JIT and optimization, runtime internals
- Several nodes have cross-track prerequisites pointing into the C systems curriculum (C3xx–C8xx), establishing the OS → runtime learning sequence
- No changes to runtime infrastructure, schemas, or session tooling — pure curriculum data

## Capabilities

### New Capabilities

- `js-runtime-curriculum`: The 10 tracks covering JS engine internals implemented as C exercises, from lexer/parser through bytecode, VM, GC, event loop, JIT, and runtime APIs

### Modified Capabilities

<!-- none — all new -->

## Impact

- `src/curriculum/jsSeed.js` (new file): all ~70 nodes
- `src/curriculum/allCurricula.js`: import and spread `jsCurriculum`
- `tests/js-runtime-curriculum.test.js` (new file): isolation, entry point, node count, no dangling prereqs
