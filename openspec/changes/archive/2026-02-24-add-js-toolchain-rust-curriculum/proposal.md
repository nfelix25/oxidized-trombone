## Why

The JS runtime curriculum (language: "c") covers engine internals — bytecode, GC, event loop. The complementary gap is the *toolchain* layer: how JS/TS source text is parsed, analysed, linted, transformed, minified, bundled, and mapped back to original sources. OXC (github.com/oxc-project/oxc) is the canonical modern reference: a blazing-fast JS/TS toolchain written in Rust with a parser, linter, transformer, minifier, and module resolver — all composable crates. This curriculum teaches learners to build each piece from scratch in Rust, so they understand exactly what a production toolchain does at every stage.

## What Changes

- Add `js-toolchain-rust-curriculum` capability: ~70 new Rust curriculum nodes across 10 tracks — lexer, parser, AST & semantics, diagnostics, lint rules, transformer, minifier, module resolution, code generation, and source maps.
- All nodes use `language: "rust"` and build on prerequisites from the existing Rust core curriculum (syntax-basics, foundations, collections, generics, smart-pointers, async, macros tracks).
- Nodes are stored in a new `rustToolchainSeed.js` file and spread into `allCurricula.js`.
- Node ID scheme: `X` + track-letter + 2-digit index (XL01–XS07).

## Capabilities

### New Capabilities
- `js-toolchain-rust-curriculum`: 10 tracks (~70 nodes) teaching how to build a JS/TS compiler toolchain in Rust, from raw bytes to output source with source maps — modeled on OXC's architecture.

### Modified Capabilities
- `rust-learning-curriculum`: Add requirement that the Rust curriculum includes advanced JS-toolchain tracks (XL/XP/XA/XD/XR/XT/XM/XN/XG/XS) as its compiler-engineering tier. Update node count.

## Impact

- New file: `src/curriculum/rustToolchainSeed.js`
- Modified: `src/curriculum/allCurricula.js` (import and spread `rustToolchainCurriculum`)
- New test file: `tests/js-toolchain-rust-curriculum.test.js`
- New delta specs: `specs/js-toolchain-rust-curriculum/spec.md` (new), `specs/rust-learning-curriculum/spec.md` (modified — node count + toolchain-tier requirement)
- No breaking changes. `getCurriculumForLanguage("rust")` will return both core Rust nodes and toolchain nodes.
