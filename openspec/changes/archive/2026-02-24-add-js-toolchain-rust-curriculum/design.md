## Context

The project follows the pattern established by `jsSeed.js` (JS runtime, language:"c") and `browserSeed.js` (Chromium browser, language:"cpp") — a per-curriculum seed file exporting a `createCurriculumGraph()` result that is spread into `allCurricula.js`. This curriculum uses `language: "rust"` and parallels the OXC architecture: each track corresponds to a crate in a real toolchain (oxc_lexer, oxc_parser, oxc_ast, oxc_diagnostics, oxlint, oxc_transformer, oxc_minifier, oxc_resolver, oxc_codegen, oxc_sourcemap).

The existing Rust curriculum covers language mechanics. This curriculum assumes ownership of all parser/compiler concepts — learners work through a complete pipeline, producing a working JS-subset compiler by the end.

## Goals / Non-Goals

**Goals:**
- 70 `language: "rust"` nodes across 10 tracks
- Prerequisites from existing Rust core curriculum all resolve in `allCurricula`
- `getCurriculumForLanguage("rust")` returns core + toolchain nodes
- Tests verify node counts, track membership, cross-track prereqs, dangling prereq check

**Non-Goals:**
- Full ECMAScript spec coverage (nodes teach concepts, not spec compliance)
- TypeScript-specific nodes beyond what's needed for stripping types (TS is treated as a dialect, not a separate curriculum)
- WASM compilation or bundler output formats

## Node ID Scheme

`X` (toolchain) + track-letter + 2-digit index:

| Prefix | Track | Count | ID Range |
|--------|-------|-------|----------|
| `XL`   | Lexer (tokenizer) | 7  | XL01–XL07 |
| `XP`   | Parser | 8  | XP01–XP08 |
| `XA`   | AST & Semantic Analysis | 8  | XA01–XA08 |
| `XD`   | Diagnostics & Error Reporting | 6  | XD01–XD06 |
| `XR`   | Lint Rules (linter infrastructure) | 7  | XR01–XR07 |
| `XT`   | Transformer | 7  | XT01–XT07 |
| `XM`   | Minifier | 7  | XM01–XM07 |
| `XN`   | Module Resolution | 6  | XN01–XN06 |
| `XG`   | Code Generation | 7  | XG01–XG07 |
| `XS`   | Source Maps | 7  | XS01–XS07 |

Total: 70 nodes

## Track Design

### XL — Lexer (XL01–XL07)

Raw byte scanning → token stream. Entry: XL01 (prereqs: S100, A200 — basic syntax + ownership).

| ID | Title | Prerequisites |
|----|-------|---------------|
| XL01 | Byte scanning: u8 slices, `&str`, and UTF-8 safety in Rust | S100, A200 |
| XL02 | Token types: enum design, `Copy` variants, and discriminant layout | XL01, A201 |
| XL03 | Lexer struct: sliding window, `peek()`, and source position tracking | XL02 |
| XL04 | Scanning identifiers, keywords, and Unicode identStart/identPart | XL03 |
| XL05 | Lexing numbers: integer, float, BigInt, and numeric separators | XL03 |
| XL06 | Lexing strings, template literals, and escape sequences | XL03 |
| XL07 | Lexing regex tokens: state machine and slash ambiguity resolution | XL06, XP01 |

### XP — Parser (XP01–XP08)

Recursive descent + Pratt parser for JS grammar. Entry: XP01 (prereq XL03).

| ID | Title | Prerequisites |
|----|-------|---------------|
| XP01 | Recursive descent: top-down parsing, grammar rules as Rust functions | XL03 |
| XP02 | Parsing statements: var/let/const, if, while, for, return, block | XP01 |
| XP03 | Pratt parsing: operator precedence, binding power, null/left denotation | XP01 |
| XP04 | Parsing function declarations, arrow functions, and parameter lists | XP02, XP03 |
| XP05 | Parsing classes: extends, constructor, methods, static, and private fields | XP04 |
| XP06 | Parsing destructuring: object patterns, array patterns, and rest/spread | XP04 |
| XP07 | Parsing TypeScript annotations: types, generics, and type assertions | XP04, XA01 |
| XP08 | Error recovery: synchronization points, error nodes, and partial ASTs | XP02, XD01 |

### XA — AST & Semantic Analysis (XA01–XA08)

AST data model, arena allocation, traversal, and scope/binding analysis.

| ID | Title | Prerequisites |
|----|-------|---------------|
| XA01 | AST node design: enums, Box<T>, and recursive tree types | A200, B100 |
| XA02 | Arena allocation: `bumpalo` arenas and lifetime-parameterized AST nodes | XA01, B101 |
| XA03 | Visitor pattern in Rust: trait-based AST traversal and `walk_*` helpers | XA01, G100 |
| XA04 | Scope tree: lexical scoping, block scopes, and function scopes | XA03, XP02 |
| XA05 | Symbol binding: declarations, references, and shadowing resolution | XA04 |
| XA06 | TypeScript type narrowing and control-flow analysis | XA05, XP07 |
| XA07 | Reference counting across the AST: `Rc<RefCell<T>>` vs arena approaches | XA02, B102 |
| XA08 | AST diffing and incremental re-parse: changed subtree detection | XA03 |

### XD — Diagnostics & Error Reporting (XD01–XD06)

Span-aware error types, labels, and rich terminal output (miette/codespan style).

| ID | Title | Prerequisites |
|----|-------|---------------|
| XD01 | Spans and source ranges: byte offsets, line/col conversion, and `Span` type | XL01 |
| XD02 | Diagnostic struct: severity, code, message, and help text | XD01, A201 |
| XD03 | Labels and annotations: primary span, secondary spans, and underline rendering | XD02 |
| XD04 | Implementing `std::error::Error` and `Display` for diagnostics | XD02, A204 |
| XD05 | Diagnostic rendering: ANSI colours, source context, and caret display | XD03, A202 |
| XD06 | Diagnostic collection and error aggregation: reporting multiple errors | XD05 |

### XR — Lint Rules (XR01–XR07)

Rule infrastructure, AST traversal pass, and implementing concrete lint rules.

| ID | Title | Prerequisites |
|----|-------|---------------|
| XR01 | Rule trait: `LintRule`, metadata, and the rule registry | XA03, G101 |
| XR02 | Context object: passing diagnostics and source through the lint pass | XR01, XD06 |
| XR03 | Implementing a value-unused rule: tracking declarations and references | XR02, XA05 |
| XR04 | Implementing a no-console rule: method call pattern matching | XR02, XA03 |
| XR05 | Implementing an eq-eq-eq rule: binary expression detection and fixable hints | XR02, XA03 |
| XR06 | Auto-fix infrastructure: `Fix` type, text edits, and conflict resolution | XR05, XD06 |
| XR07 | Parallelising lint passes with Rayon: `par_iter` over files | XR01, C100 |

### XT — Transformer (XT01–XT07)

In-place AST mutation: JSX, TypeScript stripping, and downlevel transforms.

| ID | Title | Prerequisites |
|----|-------|---------------|
| XT01 | Transformer architecture: mutable AST traversal and `VisitMut` | XA03, G100 |
| XT02 | TypeScript stripping: removing type annotations without semantics | XT01, XP07 |
| XT03 | JSX transform: `React.createElement` and automatic runtime (`_jsx`) | XT01, XP04 |
| XT04 | Class fields transform: static/instance initializers to constructor body | XT01, XP05 |
| XT05 | Optional chaining and nullish coalescing lowering | XT01, XP03 |
| XT06 | Async/await downlevel: generator-based state machine desugaring | XT01, A700 |
| XT07 | Module transform: ESM → CommonJS and named export rewriting | XT01, XN01 |

### XM — Minifier (XM01–XM07)

Constant folding, dead code elimination, name mangling, and peephole optimisations.

| ID | Title | Prerequisites |
|----|-------|---------------|
| XM01 | Minifier pipeline: pass ordering and idempotence constraints | XA03, XT01 |
| XM02 | Constant folding: literal arithmetic, boolean reduction, and string concat | XM01 |
| XM03 | Dead code elimination: unreachable branches and unused bindings | XM01, XA05 |
| XM04 | Name mangling: generating shortest unique identifiers and scope mapping | XM03, XA04 |
| XM05 | Property mangling: object key shortening with safe-name tracking | XM04 |
| XM06 | Peephole optimisations: `void 0`, `!0`, `!1`, and iife patterns | XM02 |
| XM07 | Compression metrics: byte counting, pass convergence, and benchmarking | XM06, A700 |

### XN — Module Resolution (XN01–XN06)

`node_modules` walk, `package.json` exports map, `tsconfig` paths.

| ID | Title | Prerequisites |
|----|-------|---------------|
| XN01 | Module specifier classification: bare, relative, absolute, and URL | XL01, A500 |
| XN02 | `node_modules` resolution algorithm: directory walk and `main` field | XN01, A700 |
| XN03 | `package.json` exports map: conditions, subpaths, and wildcard patterns | XN02 |
| XN04 | `tsconfig.json` paths and `baseUrl` resolution | XN02, A500 |
| XN05 | Caching resolved paths: `HashMap` memoisation and cache invalidation | XN02, A502 |
| XN06 | Virtual file systems: resolver abstraction for in-memory testing | XN05, G101 |

### XG — Code Generation (XG01–XG07)

Pretty-printing an AST back to JavaScript source text.

| ID | Title | Prerequisites |
|----|-------|---------------|
| XG01 | Printer struct: `String` buffer, indentation, and `write_str` helpers | XA01, A500 |
| XG02 | Printing expressions: precedence-aware parenthesisation | XG01, XP03 |
| XG03 | Printing statements: block layout, semicolon inference, and ASI rules | XG01, XP02 |
| XG04 | Printing declarations: `let`/`const`/`var`, functions, and classes | XG03, XP04 |
| XG05 | Printing TypeScript: type annotations, generics, and `as` expressions | XG04, XP07 |
| XG06 | Minified output mode: eliding whitespace, optional semicolons | XG04, XM01 |
| XG07 | Source map integration: emitting mappings during code gen | XG06, XS01 |

### XS — Source Maps (XS01–XS07)

VLQ encoding, the source map format, and chained map merging.

| ID | Title | Prerequisites |
|----|-------|---------------|
| XS01 | Source map format: JSON structure, `mappings`, `sources`, and `names` | XD01, A500 |
| XS02 | VLQ encoding: base64-VLQ algorithm and Rust implementation | XS01, A201 |
| XS03 | Mapping entries: generated position → original position tuples | XS02 |
| XS04 | Building a source map from a code gen pass | XS03, XG01 |
| XS05 | Consuming source maps: lookup by generated line/col | XS04 |
| XS06 | Source map merging: composing two maps (transpile → minify chain) | XS05 |
| XS07 | Inline source maps: data-URI embedding and `sourceMappingURL` | XS06 |

## Cross-Track Prerequisite Links (Toolchain → Rust Core)

| Node | Prereq from Rust core | Rationale |
|------|----------------------|-----------|
| XL01 | S100 (syntax basics), A200 (ownership) | String slices and lifetime basics needed immediately |
| XL02 | A201 (structs/enums) | Token enum design requires enums and derives |
| XA01 | A200, B100 (Box/Rc) | Recursive AST types require Box<T> |
| XA02 | B101 (Rc/RefCell) | Comparing arena vs Rc approaches |
| XA03 | G100 (generics) | Visitor trait is generic over the node type |
| XA07 | B102 (RefCell) | Interior mutability for shared AST references |
| XD02 | A201 (structs/enums) | Diagnostic struct and severity enum |
| XD04 | A204 (traits) | Implementing `Error` and `Display` |
| XD05 | A202 (fmt/Display) | Custom Display for ANSI rendering |
| XR01 | G101 (trait objects) | `Box<dyn LintRule>` rule registry |
| XR07 | C100 (Rayon/threads) | Parallel lint with `par_iter` |
| XT06 | A700 (async/await) | Understanding async for the downlevel transform |
| XN02 | A700 (async I/O) | Async file system access for resolution |
| XN05 | A502 (HashMap) | Caching resolved paths in a HashMap |

## File Layout

```
src/curriculum/rustToolchainSeed.js   (new)
tests/js-toolchain-rust-curriculum.test.js   (new)
```

`allCurricula.js` adds one import + one spread, same pattern as `jsSeed.js` and `browserSeed.js`.

## Test Strategy

Mirror `js-runtime-curriculum.test.js` and `cpp-browser-curriculum.test.js`:
1. All XL/XP/XA/XD/XR/XT/XM/XN/XG/XS nodes have `language: "rust"`
2. Exactly 70 nodes with X-prefixes (excluding existing X100/X101)
3. All 10 tracks present with correct node counts
4. Spot-check 7–8 cross-track prerequisite links
5. All prereq IDs resolve in `allCurricula`
6. `getCurriculumForLanguage("rust")` returns core + toolchain = expected total
