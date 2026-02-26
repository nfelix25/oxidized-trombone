## Context

The tutor supports five language tracks (Rust, C, Zig, Python, C++). Each track consists of three components: a language registry entry in `src/config/languages.js` (with 6 stage instruction sets), a runtime module in `src/runtime/` (workspace scaffolding), and a curriculum seed in `src/curriculum/`. Adding TypeScript follows this same pattern with one structural difference: TypeScript exercises require a two-phase test command (type checking via `tsc --noEmit` + optional runtime execution via `bun run`) rather than a single compile-and-run command.

The user is an experienced JS/TS developer. The curriculum is intentionally depth-first: ~6 foundation nodes establish correct mental models, then ~106 nodes cover intermediate through extreme-difficulty content across narrowing/CFA, generics, variance, advanced type operators, type-level challenges, runtime bridges, compiler performance, and declarations. Every notable TypeScript feature from 4.0 through 5.5 is covered as a primary topic in a dedicated node.

## Goals / Non-Goals

**Goals:**
- Add TypeScript as a fully supported language in the registry, runtime, and curriculum pipeline
- Implement a type-level test harness (`Expect<Equal<A,B>>` pattern) that makes `tsc --noEmit` the primary test runner for type-only exercises
- Support hybrid exercises (type + runtime) with a two-phase test command
- Provide ~112 curriculum nodes weighted ~95% toward intermediate/advanced/extreme content
- Cover every notable TS 4.x–5.x feature as a primary exercise topic

**Non-Goals:**
- Teaching JavaScript runtime semantics (the user already knows JS)
- Beginner TypeScript coverage (basic annotations, primitive types as main topics)
- CI or deployment changes — this is a local personal tutor
- npm package publishing or workspace management changes beyond adding `typescript` as a devDependency

## Decisions

### Decision: tsc --noEmit as primary test runner for type-level exercises

**Chosen:** `tsc --noEmit` for type-only exercises; `tsc --noEmit && bun run tests/test.ts` (via shell script) for hybrid exercises.

**Alternatives considered:**
- `vitest` with `expect-type` plugin — rejected: heavy dependency, not needed for a personal tutor
- `tsd` — rejected: separate npm package with its own test format; `Expect<Equal<>>` is simpler and more instructive
- `ts-node` only — rejected: doesn't type-check, just strips types and runs; defeats the purpose

**Rationale:** The TypeScript compiler IS the test runner for type-level exercises. Passing `tsc --noEmit` means all type assertions compiled; failing means something is wrong. This requires zero extra infrastructure beyond `typescript` itself. For hybrid exercises, `bun run` is used since bun is already available on the user's system and executes TypeScript fast with zero setup.

### Decision: Type-level test harness lives in the workspace as type-harness.ts

**Chosen:** `writeTypescriptProjectConfig()` writes a `tests/type-harness.ts` containing `Expect<Equal<A,B>>`, `ExpectFalse`, `IsAny`, `IsNever`, and `Extends` utilities. Test files import from this file.

**Rationale:** The harness is tiny (~20 lines), changes almost never, and making it a workspace file means the learner can read it and understand it — understanding `Equal<A,B>` itself becomes a TL-tier exercise (TL19).

### Decision: Single tsconfig.json with maximum strict settings

**Chosen:** `strict: true`, `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`, `target: "ES2022"`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`.

**Rationale:** Maximum strictness surfaces more type errors and teaches the full surface area. `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are covered as dedicated nodes (TP08) — having them enabled means exercises naturally encounter their effects. `ES2022` / `NodeNext` is the current real-world default for Node.js TypeScript projects.

**Alternative considered:** Default-strict (just `strict: true`) to match most real codebases. Rejected because the user wants to hit every edge case; max-strict is the right teaching environment even if production projects sometimes relax it.

### Decision: Node ID prefix TF/TN/TG/TV/TA/TL/TR/TP/TI

**Chosen:** Two-character prefixes per track: TF (foundations), TN (narrowing), TG (generics), TV (variance), TA (advanced type ops), TL (type-level challenges), TR (runtime bridges), TP (performance), TI (declarations/internals).

**Rationale:** Follows the Python pattern (PF, PA, PT, etc.). Two characters keeps IDs at 4 characters total (TF01), consistent with other language tracks.

### Decision: Curriculum is depth-first, skip basics

**Chosen:** TF track is 6 nodes covering mental model corrections (structural vs nominal depth, top/bottom type algebra, inference model, widening/`satisfies`/`using`), not syntax tutorials. The remaining 106 nodes are intermediate through extreme.

**Rationale:** The user has production TypeScript experience. Spending nodes on "what is a type annotation" wastes their time. The foundation nodes exist to correct subtle misconceptions (e.g., excess property checking is not structural, bivariant method shorthand is intentional), not to introduce the language.

### Decision: Stage 3 decorators only (not legacy experimental)

**Chosen:** TR06/TR07 cover TS 5.0 stage 3 decorators and TS 5.2 decorator metadata exclusively. The legacy `experimentalDecorators` system is not taught.

**Rationale:** The legacy system is deprecated and being removed from popular frameworks. Teaching the new system is more valuable. The tsconfig will NOT set `experimentalDecorators: true`.

## Risks / Trade-offs

- **tsc error verbosity** → For the TF/TG foundation exercises, TypeScript's error messages can be very revealing ("Type 'string' is not assignable to type 'number'" essentially tells you the fix). Mitigation: foundation exercises are intentionally fast-moving; the coach stage instructions will be written to ask about type theory, not syntax, and to never paraphrase the tsc error. The problem self-resolves at the TL tier where errors become opaque.

- **Recursion depth limits in TL extreme tier** → Some type-level exercises will hit `Type instantiation is excessively deep and possibly infinite`. This is intentional — TP03 is specifically about this limit. The TL20 node teaches workarounds. Mitigation: scaffold hints for extreme-tier exercises note the depth limit upfront.

- **bun run vs tsc type checking independence** → `bun run` strips types without checking them. The two-phase command (`tsc --noEmit && bun run`) means type errors always fail first. If `tsc --noEmit` passes but the runtime test throws, that's a genuine runtime bug. Mitigation: hybrid exercises (TR track) should have clearly separated type assertion blocks and runtime assertion blocks so the source of failure is unambiguous.

- **tsconfig strictness surprises** → `noUncheckedIndexedAccess` in particular produces errors that confuse people ("index access returns T | undefined even though I checked the length"). This is a teaching moment, not a bug. Mitigation: TP08 is dedicated to this; the TF/TN exercises don't do heavy array indexing.

## Migration Plan

No migration needed — new files only. The change does not modify any existing language's behavior.

Order of implementation:
1. `src/runtime/typescriptRuntime.js` — workspace scaffolding (tsconfig, type-harness, run script)
2. `src/config/languages.js` — registry entry + 6 stage instruction sets
3. `src/curriculum/typescriptSeed.js` — 112 nodes across 9 tracks
4. `src/curriculum/allCurricula.js` — import and merge
5. `tests/typescript-curriculum.test.js` — validation tests
6. `package.json` — add `typescript` devDependency if absent

## Open Questions

- None — all design decisions are resolved. The curriculum node list is fully enumerated in the explore session.
