# Tasks: add-js-toolchain-rust-curriculum

## 1. Create rustToolchainSeed.js — Lexer track (XL)

- [x] 1.1 Scaffold `src/curriculum/rustToolchainSeed.js` with imports, track arrays, and export skeleton
- [x] 1.2 Add XL01 — `Byte scanning: u8 slices, &str, and UTF-8 safety in Rust` (D2, prereqs: S100, A200)
- [x] 1.3 Add XL02 — `Token types: enum design, Copy variants, and discriminant layout` (D2, prereqs: XL01, A201)
- [x] 1.4 Add XL03 — `Lexer struct: sliding window, peek(), and source position tracking` (D2, prereq: XL02)
- [x] 1.5 Add XL04 — `Scanning identifiers, keywords, and Unicode identStart/identPart` (D2, prereq: XL03)
- [x] 1.6 Add XL05 — `Lexing numbers: integer, float, BigInt, and numeric separators` (D2, prereq: XL03)
- [x] 1.7 Add XL06 — `Lexing strings, template literals, and escape sequences` (D3, prereq: XL03)
- [x] 1.8 Add XL07 — `Lexing regex tokens: state machine and slash ambiguity resolution` (D3, prereqs: XL06, XP01)

## 2. Add Parser track (XP)

- [x] 2.1 Add XP01 — `Recursive descent: top-down parsing, grammar rules as Rust functions` (D2, prereq: XL03)
- [x] 2.2 Add XP02 — `Parsing statements: var/let/const, if, while, for, return, block` (D2, prereq: XP01)
- [x] 2.3 Add XP03 — `Pratt parsing: operator precedence, binding power, null/left denotation` (D3, prereq: XP01)
- [x] 2.4 Add XP04 — `Parsing function declarations, arrow functions, and parameter lists` (D2, prereqs: XP02, XP03)
- [x] 2.5 Add XP05 — `Parsing classes: extends, constructor, methods, static, and private fields` (D3, prereq: XP04)
- [x] 2.6 Add XP06 — `Parsing destructuring: object patterns, array patterns, and rest/spread` (D3, prereq: XP04)
- [x] 2.7 Add XP07 — `Parsing TypeScript annotations: types, generics, and type assertions` (D3, prereqs: XP04, XA01)
- [x] 2.8 Add XP08 — `Error recovery: synchronization points, error nodes, and partial ASTs` (D3, prereqs: XP02, XD01)

## 3. Add AST & Semantic Analysis track (XA)

- [x] 3.1 Add XA01 — `AST node design: enums, Box<T>, and recursive tree types` (D2, prereqs: A200, B100)
- [x] 3.2 Add XA02 — `Arena allocation: bumpalo arenas and lifetime-parameterized AST nodes` (D3, prereqs: XA01, B101)
- [x] 3.3 Add XA03 — `Visitor pattern in Rust: trait-based AST traversal and walk_* helpers` (D2, prereqs: XA01, G100)
- [x] 3.4 Add XA04 — `Scope tree: lexical scoping, block scopes, and function scopes` (D3, prereqs: XA03, XP02)
- [x] 3.5 Add XA05 — `Symbol binding: declarations, references, and shadowing resolution` (D3, prereq: XA04)
- [x] 3.6 Add XA06 — `TypeScript type narrowing and control-flow analysis` (D3, prereqs: XA05, XP07)
- [x] 3.7 Add XA07 — `Reference counting across the AST: Rc<RefCell<T>> vs arena approaches` (D3, prereqs: XA02, B102)
- [x] 3.8 Add XA08 — `AST diffing and incremental re-parse: changed subtree detection` (D3, prereq: XA03)

## 4. Add Diagnostics track (XD)

- [x] 4.1 Add XD01 — `Spans and source ranges: byte offsets, line/col conversion, and Span type` (D2, prereq: XL01)
- [x] 4.2 Add XD02 — `Diagnostic struct: severity, code, message, and help text` (D2, prereqs: XD01, A201)
- [x] 4.3 Add XD03 — `Labels and annotations: primary span, secondary spans, and underline rendering` (D2, prereq: XD02)
- [x] 4.4 Add XD04 — `Implementing std::error::Error and Display for diagnostics` (D2, prereqs: XD02, A204)
- [x] 4.5 Add XD05 — `Diagnostic rendering: ANSI colours, source context, and caret display` (D3, prereqs: XD03, A202)
- [x] 4.6 Add XD06 — `Diagnostic collection and error aggregation: reporting multiple errors` (D2, prereq: XD05)

## 5. Add Lint Rules track (XR)

- [x] 5.1 Add XR01 — `Rule trait: LintRule, metadata, and the rule registry` (D2, prereqs: XA03, G101)
- [x] 5.2 Add XR02 — `Context object: passing diagnostics and source through the lint pass` (D2, prereqs: XR01, XD06)
- [x] 5.3 Add XR03 — `Implementing a value-unused rule: tracking declarations and references` (D3, prereqs: XR02, XA05)
- [x] 5.4 Add XR04 — `Implementing a no-console rule: method call pattern matching` (D2, prereqs: XR02, XA03)
- [x] 5.5 Add XR05 — `Implementing an eq-eq-eq rule: binary expression detection and fixable hints` (D2, prereqs: XR02, XA03)
- [x] 5.6 Add XR06 — `Auto-fix infrastructure: Fix type, text edits, and conflict resolution` (D3, prereqs: XR05, XD06)
- [x] 5.7 Add XR07 — `Parallelising lint passes with Rayon: par_iter over files` (D3, prereqs: XR01, C100)

## 6. Add Transformer track (XT)

- [x] 6.1 Add XT01 — `Transformer architecture: mutable AST traversal and VisitMut` (D2, prereqs: XA03, G100)
- [x] 6.2 Add XT02 — `TypeScript stripping: removing type annotations without semantic changes` (D2, prereqs: XT01, XP07)
- [x] 6.3 Add XT03 — `JSX transform: React.createElement and automatic runtime (_jsx)` (D3, prereqs: XT01, XP04)
- [x] 6.4 Add XT04 — `Class fields transform: static/instance initializers to constructor body` (D3, prereqs: XT01, XP05)
- [x] 6.5 Add XT05 — `Optional chaining and nullish coalescing lowering` (D3, prereqs: XT01, XP03)
- [x] 6.6 Add XT06 — `Async/await downlevel: generator-based state machine desugaring` (D3, prereqs: XT01, A700)
- [x] 6.7 Add XT07 — `Module transform: ESM → CommonJS and named export rewriting` (D3, prereqs: XT01, XN01)

## 7. Add Minifier track (XM)

- [x] 7.1 Add XM01 — `Minifier pipeline: pass ordering and idempotence constraints` (D2, prereqs: XA03, XT01)
- [x] 7.2 Add XM02 — `Constant folding: literal arithmetic, boolean reduction, and string concat` (D3, prereq: XM01)
- [x] 7.3 Add XM03 — `Dead code elimination: unreachable branches and unused bindings` (D3, prereqs: XM01, XA05)
- [x] 7.4 Add XM04 — `Name mangling: generating shortest unique identifiers and scope mapping` (D3, prereqs: XM03, XA04)
- [x] 7.5 Add XM05 — `Property mangling: object key shortening with safe-name tracking` (D3, prereq: XM04)
- [x] 7.6 Add XM06 — `Peephole optimisations: void 0, !0, !1, and IIFE patterns` (D2, prereq: XM02)
- [x] 7.7 Add XM07 — `Compression metrics: byte counting, pass convergence, and benchmarking` (D2, prereqs: XM06, A700)

## 8. Add Module Resolution track (XN)

- [x] 8.1 Add XN01 — `Module specifier classification: bare, relative, absolute, and URL` (D2, prereqs: XL01, A500)
- [x] 8.2 Add XN02 — `node_modules resolution algorithm: directory walk and main field` (D3, prereqs: XN01, A700)
- [x] 8.3 Add XN03 — `package.json exports map: conditions, subpaths, and wildcard patterns` (D3, prereq: XN02)
- [x] 8.4 Add XN04 — `tsconfig.json paths and baseUrl resolution` (D3, prereqs: XN02, A500)
- [x] 8.5 Add XN05 — `Caching resolved paths: HashMap memoisation and cache invalidation` (D2, prereqs: XN02, A502)
- [x] 8.6 Add XN06 — `Virtual file systems: resolver abstraction for in-memory testing` (D3, prereqs: XN05, G101)

## 9. Add Code Generation track (XG)

- [x] 9.1 Add XG01 — `Printer struct: String buffer, indentation, and write_str helpers` (D2, prereqs: XA01, A500)
- [x] 9.2 Add XG02 — `Printing expressions: precedence-aware parenthesisation` (D3, prereqs: XG01, XP03)
- [x] 9.3 Add XG03 — `Printing statements: block layout, semicolon inference, and ASI rules` (D2, prereqs: XG01, XP02)
- [x] 9.4 Add XG04 — `Printing declarations: let/const/var, functions, and classes` (D2, prereqs: XG03, XP04)
- [x] 9.5 Add XG05 — `Printing TypeScript: type annotations, generics, and as expressions` (D3, prereqs: XG04, XP07)
- [x] 9.6 Add XG06 — `Minified output mode: eliding whitespace, optional semicolons` (D2, prereqs: XG04, XM01)
- [x] 9.7 Add XG07 — `Source map integration: emitting mappings during code gen` (D3, prereqs: XG06, XS01)

## 10. Add Source Maps track (XS)

- [x] 10.1 Add XS01 — `Source map format: JSON structure, mappings, sources, and names` (D2, prereqs: XD01, A500)
- [x] 10.2 Add XS02 — `VLQ encoding: base64-VLQ algorithm and Rust implementation` (D3, prereqs: XS01, A201)
- [x] 10.3 Add XS03 — `Mapping entries: generated position → original position tuples` (D2, prereq: XS02)
- [x] 10.4 Add XS04 — `Building a source map from a code gen pass` (D3, prereqs: XS03, XG01)
- [x] 10.5 Add XS05 — `Consuming source maps: lookup by generated line/col` (D2, prereq: XS04)
- [x] 10.6 Add XS06 — `Source map merging: composing two maps (transpile → minify chain)` (D3, prereq: XS05)
- [x] 10.7 Add XS07 — `Inline source maps: data-URI embedding and sourceMappingURL` (D2, prereq: XS06)

## 11. Wire rustToolchainSeed.js into allCurricula.js

- [x] 11.1 Import `rustToolchainCurriculum` from `./rustToolchainSeed.js` in `allCurricula.js`
- [x] 11.2 Spread `rustToolchainCurriculum.nodes` into the `allCurricula` node array
- [x] 11.3 Spread `rustToolchainCurriculum.tracks` into the `allCurricula` tracks object
- [x] 11.4 Verify `npm test` passes (all existing tests still green, no dangling prereq errors)

## 12. Write tests/js-toolchain-rust-curriculum.test.js

- [x] 12.1 Test: all XL/XP/XA/XD/XR/XT/XM/XN/XG/XS nodes have `language: "rust"`
- [x] 12.2 Test: exactly 70 toolchain nodes exist in allCurricula (filter by two-letter X prefix)
- [x] 12.3 Test: all 10 tracks present (`js-lexer`, `js-parser`, `js-ast-semantics`, `js-diagnostics`, `js-lint-rules`, `js-transformer`, `js-minifier`, `js-module-resolution`, `js-codegen`, `js-sourcemaps`)
- [x] 12.4 Test: `js-lexer` has 7 nodes (XL01–XL07)
- [x] 12.5 Test: `js-parser` has 8 nodes (XP01–XP08)
- [x] 12.6 Test: `js-ast-semantics` has 8 nodes (XA01–XA08)
- [x] 12.7 Test: `js-diagnostics` has 6 nodes (XD01–XD06)
- [x] 12.8 Test: `js-lint-rules` has 7 nodes (XR01–XR07)
- [x] 12.9 Test: `js-transformer` has 7 nodes (XT01–XT07)
- [x] 12.10 Test: `js-minifier` has 7 nodes (XM01–XM07)
- [x] 12.11 Test: `js-module-resolution` has 6 nodes (XN01–XN06)
- [x] 12.12 Test: `js-codegen` has 7 nodes (XG01–XG07)
- [x] 12.13 Test: `js-sourcemaps` has 7 nodes (XS01–XS07)
- [x] 12.14 Test spot-check: XL01 has S100 as prerequisite
- [x] 12.15 Test spot-check: XL01 has A200 as prerequisite
- [x] 12.16 Test spot-check: XA01 has B100 as prerequisite
- [x] 12.17 Test spot-check: XA03 has G100 as prerequisite
- [x] 12.18 Test spot-check: XR01 has G101 as prerequisite
- [x] 12.19 Test spot-check: XR07 has C100 as prerequisite
- [x] 12.20 Test spot-check: XT06 has A700 as prerequisite
- [x] 12.21 Test spot-check: XN02 has A700 as prerequisite
- [x] 12.22 Test: all toolchain node prerequisite IDs resolve in allCurricula (no dangling prereqs)
- [x] 12.23 Test: `getCurriculumForLanguage("rust")` returns correct total (core 50 + toolchain 70 = 120)
- [x] 12.24 Run `npm test` — confirm all tests pass (green)

## 13. Manual smoke tests

- [x] 13.1 Verify toolchain node count via node CLI: prints 70
- [x] 13.2 Verify XL07 has both XL06 and XP01 as prerequisites (cross-section circular reference check)
- [x] 13.3 Verify no toolchain node has `language: "c"` or `language: "cpp"` (all must be "rust")
