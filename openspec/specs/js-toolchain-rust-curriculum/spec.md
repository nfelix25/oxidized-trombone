## Purpose

Defines the curriculum requirements for the JS toolchain compiler-engineering tier in Rust, modeled on the OXC project. Covers 70 nodes across 10 tracks: lexer, parser, AST/semantics, diagnostics, lint rules, transformer, minifier, module resolution, code generation, and source maps.

## Requirements

### Requirement: JS toolchain curriculum provides an OXC-inspired compiler pipeline in Rust
The system SHALL provide 70 curriculum nodes (language: "rust") organized into 10 tracks that teach how to build a JS/TS compiler toolchain in Rust, modeled on the OXC project architecture. All node IDs use the pattern X + track-letter + 2-digit index (XL01–XS07). All nodes have `language: "rust"`. Prerequisites from the Rust core curriculum (syntax-basics, foundations, generics, smart-pointers, async, concurrency tracks) resolve in `allCurricula`.

#### Scenario: Toolchain curriculum nodes appear in Rust language graph
- **WHEN** `getCurriculumForLanguage("rust")` is called
- **THEN** all 70 toolchain nodes are included alongside the existing Rust core nodes

#### Scenario: All toolchain nodes use language="rust"
- **WHEN** any node with an X-prefixed two-letter track ID is retrieved
- **THEN** `node.language === "rust"`

#### Scenario: All 10 tracks are present in allCurricula.tracks
- **WHEN** `allCurricula.tracks` is inspected
- **THEN** keys `js-lexer`, `js-parser`, `js-ast-semantics`, `js-diagnostics`, `js-lint-rules`, `js-transformer`, `js-minifier`, `js-module-resolution`, `js-codegen`, `js-sourcemaps` all exist

---

### Requirement: Lexer track (XL) teaches byte-level JS tokenization in Rust
The system SHALL provide a `js-lexer` track with 7 nodes (XL01–XL07) covering byte scanning, token enum design, the lexer struct, identifier/keyword scanning, numeric literals, string/template literals, and regex token disambiguation.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XL01 | Byte scanning: u8 slices, `&str`, and UTF-8 safety in Rust | D2 | S100, A200 |
| XL02 | Token types: enum design, `Copy` variants, and discriminant layout | D2 | XL01, A201 |
| XL03 | Lexer struct: sliding window, `peek()`, and source position tracking | D2 | XL02 |
| XL04 | Scanning identifiers, keywords, and Unicode identStart/identPart | D2 | XL03 |
| XL05 | Lexing numbers: integer, float, BigInt, and numeric separators | D2 | XL03 |
| XL06 | Lexing strings, template literals, and escape sequences | D3 | XL03 |
| XL07 | Lexing regex tokens: state machine and slash ambiguity resolution | D3 | XL06, XP01 |

#### Scenario: XL01 is the lexer entry point, requiring only Rust syntax and ownership
- **WHEN** a learner has completed S100 and A200
- **THEN** XL01 becomes eligible

#### Scenario: Lexer struct node requires the token type node
- **WHEN** a learner completes XL02
- **THEN** XL03 becomes eligible

#### Scenario: Regex lexing is the most advanced lexer node, requiring both string lexing and a parser stub
- **WHEN** a learner has not completed XP01
- **THEN** XL07 is not eligible

---

### Requirement: Parser track (XP) teaches recursive descent and Pratt parsing for JS
The system SHALL provide a `js-parser` track with 8 nodes (XP01–XP08) covering recursive descent, statement parsing, Pratt operator precedence, function/arrow functions, classes, destructuring, TypeScript annotations, and error recovery.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XP01 | Recursive descent: top-down parsing, grammar rules as Rust functions | D2 | XL03 |
| XP02 | Parsing statements: var/let/const, if, while, for, return, block | D2 | XP01 |
| XP03 | Pratt parsing: operator precedence, binding power, null/left denotation | D3 | XP01 |
| XP04 | Parsing function declarations, arrow functions, and parameter lists | D2 | XP02, XP03 |
| XP05 | Parsing classes: extends, constructor, methods, static, and private fields | D3 | XP04 |
| XP06 | Parsing destructuring: object patterns, array patterns, and rest/spread | D3 | XP04 |
| XP07 | Parsing TypeScript annotations: types, generics, and type assertions | D3 | XP04, XA01 |
| XP08 | Error recovery: synchronization points, error nodes, and partial ASTs | D3 | XP02, XD01 |

#### Scenario: Recursive descent node requires the lexer struct foundation
- **WHEN** a learner has completed XL03
- **THEN** XP01 becomes eligible

#### Scenario: Pratt parsing is unlocked after basic statement parsing
- **WHEN** a learner completes XP01
- **THEN** XP03 becomes eligible in parallel with XP02

#### Scenario: Error recovery requires both statement parsing and diagnostics
- **WHEN** a learner has not completed XD01
- **THEN** XP08 is not eligible

---

### Requirement: AST & Semantic Analysis track (XA) covers the tree data model and scope analysis
The system SHALL provide a `js-ast-semantics` track with 8 nodes (XA01–XA08) covering AST node design, arena allocation, the visitor pattern, scope trees, symbol binding, TypeScript type narrowing, Rc/RefCell tradeoffs, and incremental re-parse.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XA01 | AST node design: enums, Box<T>, and recursive tree types | D2 | A200, B100 |
| XA02 | Arena allocation: `bumpalo` arenas and lifetime-parameterized AST nodes | D3 | XA01, B101 |
| XA03 | Visitor pattern in Rust: trait-based AST traversal and `walk_*` helpers | D2 | XA01, G100 |
| XA04 | Scope tree: lexical scoping, block scopes, and function scopes | D3 | XA03, XP02 |
| XA05 | Symbol binding: declarations, references, and shadowing resolution | D3 | XA04 |
| XA06 | TypeScript type narrowing and control-flow analysis | D3 | XA05, XP07 |
| XA07 | Reference counting across the AST: `Rc<RefCell<T>>` vs arena approaches | D3 | XA02, B102 |
| XA08 | AST diffing and incremental re-parse: changed subtree detection | D3 | XA03 |

#### Scenario: AST node design requires ownership and Box knowledge
- **WHEN** a learner has completed A200 and B100
- **THEN** XA01 is eligible

#### Scenario: Visitor trait requires generics knowledge
- **WHEN** a learner has not completed G100
- **THEN** XA03 is not eligible

#### Scenario: Symbol binding depends on scope tree
- **WHEN** a learner completes XA04
- **THEN** XA05 becomes eligible

---

### Requirement: Diagnostics track (XD) teaches span-aware error reporting
The system SHALL provide a `js-diagnostics` track with 6 nodes (XD01–XD06) covering span types, diagnostic structs, label/annotation rendering, `std::error::Error` implementation, ANSI terminal output, and multi-error aggregation.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XD01 | Spans and source ranges: byte offsets, line/col conversion, and `Span` type | D2 | XL01 |
| XD02 | Diagnostic struct: severity, code, message, and help text | D2 | XD01, A201 |
| XD03 | Labels and annotations: primary span, secondary spans, and underline rendering | D2 | XD02 |
| XD04 | Implementing `std::error::Error` and `Display` for diagnostics | D2 | XD02, A204 |
| XD05 | Diagnostic rendering: ANSI colours, source context, and caret display | D3 | XD03, A202 |
| XD06 | Diagnostic collection and error aggregation: reporting multiple errors | D2 | XD05 |

#### Scenario: Span type requires the lexer's byte-scanning foundation
- **WHEN** a learner has completed XL01
- **THEN** XD01 becomes eligible

#### Scenario: Error trait impl requires traits knowledge
- **WHEN** a learner has not completed A204 (traits)
- **THEN** XD04 is not eligible

#### Scenario: Diagnostic collection is the exit point for error reporting
- **WHEN** a learner completes XD05
- **THEN** XD06 becomes eligible

---

### Requirement: Lint Rules track (XR) teaches AST-based linting infrastructure
The system SHALL provide a `js-lint-rules` track with 7 nodes (XR01–XR07) covering the rule trait, context object, a value-unused rule, a no-console rule, an eq-eq-eq rule, auto-fix infrastructure, and parallel lint with Rayon.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XR01 | Rule trait: `LintRule`, metadata, and the rule registry | D2 | XA03, G101 |
| XR02 | Context object: passing diagnostics and source through the lint pass | D2 | XR01, XD06 |
| XR03 | Implementing a value-unused rule: tracking declarations and references | D3 | XR02, XA05 |
| XR04 | Implementing a no-console rule: method call pattern matching | D2 | XR02, XA03 |
| XR05 | Implementing an eq-eq-eq rule: binary expression detection and fixable hints | D2 | XR02, XA03 |
| XR06 | Auto-fix infrastructure: `Fix` type, text edits, and conflict resolution | D3 | XR05, XD06 |
| XR07 | Parallelising lint passes with Rayon: `par_iter` over files | D3 | XR01, C100 |

#### Scenario: Rule trait requires both visitor and trait objects
- **WHEN** a learner has completed XA03 and G101
- **THEN** XR01 becomes eligible

#### Scenario: Value-unused rule requires symbol binding knowledge
- **WHEN** a learner has not completed XA05
- **THEN** XR03 is not eligible

#### Scenario: Parallel lint requires both rule infrastructure and Rayon concurrency
- **WHEN** a learner has completed XR01 and C100
- **THEN** XR07 is eligible

---

### Requirement: Transformer track (XT) covers in-place AST mutation and JS/TS transforms
The system SHALL provide a `js-transformer` track with 7 nodes (XT01–XT07) covering mutable AST traversal, TypeScript stripping, JSX transform, class fields lowering, optional chaining/nullish coalescing, async/await downlevel, and ESM-to-CJS module transform.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XT01 | Transformer architecture: mutable AST traversal and `VisitMut` | D2 | XA03, G100 |
| XT02 | TypeScript stripping: removing type annotations without semantic changes | D2 | XT01, XP07 |
| XT03 | JSX transform: `React.createElement` and automatic runtime (`_jsx`) | D3 | XT01, XP04 |
| XT04 | Class fields transform: static/instance initializers to constructor body | D3 | XT01, XP05 |
| XT05 | Optional chaining and nullish coalescing lowering | D3 | XT01, XP03 |
| XT06 | Async/await downlevel: generator-based state machine desugaring | D3 | XT01, A700 |
| XT07 | Module transform: ESM → CommonJS and named export rewriting | D3 | XT01, XN01 |

#### Scenario: Transformer entry requires visitor trait and generics
- **WHEN** a learner has completed XA03 and G100
- **THEN** XT01 becomes eligible

#### Scenario: Async/await transform requires understanding of Rust async
- **WHEN** a learner has not completed A700 (async/await)
- **THEN** XT06 is not eligible

#### Scenario: Module transform requires module resolution classification
- **WHEN** a learner has completed XT01 and XN01
- **THEN** XT07 is eligible

---

### Requirement: Minifier track (XM) covers dead code elimination and size reduction
The system SHALL provide a `js-minifier` track with 7 nodes (XM01–XM07) covering the minifier pipeline, constant folding, dead code elimination, name mangling, property mangling, peephole optimisations, and compression benchmarking.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XM01 | Minifier pipeline: pass ordering and idempotence constraints | D2 | XA03, XT01 |
| XM02 | Constant folding: literal arithmetic, boolean reduction, and string concat | D3 | XM01 |
| XM03 | Dead code elimination: unreachable branches and unused bindings | D3 | XM01, XA05 |
| XM04 | Name mangling: generating shortest unique identifiers and scope mapping | D3 | XM03, XA04 |
| XM05 | Property mangling: object key shortening with safe-name tracking | D3 | XM04 |
| XM06 | Peephole optimisations: `void 0`, `!0`, `!1`, and IIFE patterns | D2 | XM02 |
| XM07 | Compression metrics: byte counting, pass convergence, and benchmarking | D2 | XM06, A700 |

#### Scenario: Minifier pipeline requires visitor and transformer foundation
- **WHEN** a learner has completed XA03 and XT01
- **THEN** XM01 becomes eligible

#### Scenario: Dead code elimination requires symbol binding knowledge
- **WHEN** a learner has not completed XA05
- **THEN** XM03 is not eligible

#### Scenario: Name mangling requires scope tree knowledge
- **WHEN** a learner has not completed XA04
- **THEN** XM04 is not eligible

---

### Requirement: Module Resolution track (XN) covers the JS module resolution algorithm
The system SHALL provide a `js-module-resolution` track with 6 nodes (XN01–XN06) covering module specifier classification, `node_modules` walk, `package.json` exports map, `tsconfig.json` paths, HashMap-based caching, and virtual file system abstraction.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XN01 | Module specifier classification: bare, relative, absolute, and URL | D2 | XL01, A500 |
| XN02 | `node_modules` resolution algorithm: directory walk and `main` field | D3 | XN01, A700 |
| XN03 | `package.json` exports map: conditions, subpaths, and wildcard patterns | D3 | XN02 |
| XN04 | `tsconfig.json` paths and `baseUrl` resolution | D3 | XN02, A500 |
| XN05 | Caching resolved paths: `HashMap` memoisation and cache invalidation | D2 | XN02, A502 |
| XN06 | Virtual file systems: resolver abstraction for in-memory testing | D3 | XN05, G101 |

#### Scenario: Module classification requires string/collection knowledge
- **WHEN** a learner has completed XL01 and A500
- **THEN** XN01 becomes eligible

#### Scenario: node_modules walk requires async I/O
- **WHEN** a learner has not completed A700 (async)
- **THEN** XN02 is not eligible

#### Scenario: Virtual file system requires trait object knowledge
- **WHEN** a learner has completed XN05 and G101
- **THEN** XN06 becomes eligible

---

### Requirement: Code Generation track (XG) covers AST-to-source-text printing
The system SHALL provide a `js-codegen` track with 7 nodes (XG01–XG07) covering the printer struct, expression printing with parenthesisation, statement layout, declaration printing, TypeScript output, minified output mode, and source map integration.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XG01 | Printer struct: `String` buffer, indentation, and `write_str` helpers | D2 | XA01, A500 |
| XG02 | Printing expressions: precedence-aware parenthesisation | D3 | XG01, XP03 |
| XG03 | Printing statements: block layout, semicolon inference, and ASI rules | D2 | XG01, XP02 |
| XG04 | Printing declarations: `let`/`const`/`var`, functions, and classes | D2 | XG03, XP04 |
| XG05 | Printing TypeScript: type annotations, generics, and `as` expressions | D3 | XG04, XP07 |
| XG06 | Minified output mode: eliding whitespace, optional semicolons | D2 | XG04, XM01 |
| XG07 | Source map integration: emitting mappings during code gen | D3 | XG06, XS01 |

#### Scenario: Printer struct requires AST node types and string knowledge
- **WHEN** a learner has completed XA01 and A500
- **THEN** XG01 becomes eligible

#### Scenario: Minified output requires both declaration printing and minifier architecture
- **WHEN** a learner has completed XG04 and XM01
- **THEN** XG06 becomes eligible

#### Scenario: Source map integration is the final codegen node
- **WHEN** a learner has completed XG06 and XS01
- **THEN** XG07 becomes eligible

---

### Requirement: Source Maps track (XS) covers the source map format and VLQ encoding
The system SHALL provide a `js-sourcemaps` track with 7 nodes (XS01–XS07) covering the JSON source map format, VLQ encoding in Rust, mapping entry tuples, building maps during code gen, consuming maps by position lookup, chained map merging, and inline data-URI embedding.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| XS01 | Source map format: JSON structure, `mappings`, `sources`, and `names` | D2 | XD01, A500 |
| XS02 | VLQ encoding: base64-VLQ algorithm and Rust implementation | D3 | XS01, A201 |
| XS03 | Mapping entries: generated position → original position tuples | D2 | XS02 |
| XS04 | Building a source map from a code gen pass | D3 | XS03, XG01 |
| XS05 | Consuming source maps: lookup by generated line/col | D2 | XS04 |
| XS06 | Source map merging: composing two maps (transpile → minify chain) | D3 | XS05 |
| XS07 | Inline source maps: data-URI embedding and `sourceMappingURL` | D2 | XS06 |

#### Scenario: Source map format requires span/offset foundation
- **WHEN** a learner has completed XD01 and A500
- **THEN** XS01 becomes eligible

#### Scenario: VLQ encoding requires struct/enum knowledge for bit manipulation
- **WHEN** a learner has completed XS01 and A201
- **THEN** XS02 becomes eligible

#### Scenario: Map merging is the final source-map composition step
- **WHEN** a learner completes XS05
- **THEN** XS06 becomes eligible

---

### Requirement: Cross-track prerequisite links from toolchain curriculum to Rust core resolve
The system SHALL ensure that all prerequisite IDs referenced by toolchain nodes (XL, XP, XA, XD, XR, XT, XM, XN, XG, XS) that point to Rust core nodes (S100–S107, A200–A211, A500–A507, G100–G103, B100–B103, A700–A704, C100–C103) resolve in `allCurricula.byId`.

#### Scenario: XL01 prerequisites S100 and A200 resolve
- **WHEN** `allCurricula.byId.get("S100")` and `allCurricula.byId.get("A200")` are called
- **THEN** both return defined nodes

#### Scenario: XA03 prerequisite G100 resolves
- **WHEN** `allCurricula.byId.get("G100")` is called
- **THEN** it returns a defined node

#### Scenario: All toolchain node prerequisite IDs resolve in allCurricula
- **WHEN** every prerequisite ID of every X-prefixed toolchain node is looked up in `allCurricula.byId`
- **THEN** no lookup returns undefined
