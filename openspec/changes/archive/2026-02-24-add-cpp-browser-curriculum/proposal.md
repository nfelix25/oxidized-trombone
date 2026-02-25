## Why

The C++ curriculum covers core language mechanics but has no pathway into real-world, large-scale C++ systems. Chromium is the canonical modern C++ codebase — its base library, rendering pipeline, V8 embedding API, network stack, and UI framework represent production patterns used across the industry. Adding a browser-focused curriculum gives advanced C++ learners a target domain that ties together move semantics, templates, threading, IPC, and memory management in an integrated, meaningful context.

## What Changes

- Add `cpp-browser-curriculum` capability: ~48 new C++ curriculum nodes organized into 6 tracks covering Chromium Foundations, Blink Rendering, V8 API Embedding, Network Stack, Aura UI Framework, and Process Model & Mojo IPC.
- All nodes use `language: "cpp"` and build on prerequisites from the existing C++ core curriculum (CF, CP, CM, CV, CS, CT, CK, CC tracks).
- Nodes are stored in a new `browserSeed.js` file and spread into `allCurricula.js`.
- Node ID scheme: `B` + track-letter + 2-digit index (BF01–BP08).

## Capabilities

### New Capabilities
- `cpp-browser-curriculum`: 6 tracks (~48 nodes) teaching Chromium-style C++ through the lens of browser engine internals — base library patterns, rendering pipeline, V8 C++ API, network stack architecture, Aura UI, and multi-process IPC.

### Modified Capabilities
- `cpp-curriculum`: Add requirement that the C++ curriculum includes advanced browser-internals tracks (BF/BL/BV/BN/BA/BP) as its systems-programming tier, mirroring how the C curriculum has advanced systems tracks (C3xx–C8xx). Update node count.

## Impact

- New file: `src/curriculum/browserSeed.js`
- Modified: `src/curriculum/allCurricula.js` (import and spread `browserCurriculum`)
- New test file: `tests/cpp-browser-curriculum.test.js`
- New delta specs: `specs/cpp-browser-curriculum/spec.md` (new capability), `specs/cpp-curriculum/spec.md` (modified capability — adds node count update and browser-tier requirement)
- No breaking changes. All existing tests continue to pass. `getCurriculumForLanguage("cpp")` will now return both core (existing) and browser nodes.
