## 1. Runtime & Workspace Setup

- [x] 1.1 Create `src/runtime/typescriptRuntime.js` with `writeTypescriptProjectConfig(dir)` that writes `tsconfig.json` (strict + exactOptionalPropertyTypes + noUncheckedIndexedAccess + ES2022 + NodeNext), `tests/type-harness.ts` (Expect, Equal, ExpectFalse, Extends, IsAny, IsNever utilities), and `run-tests.sh` (tsc --noEmit && bun run tests/test.ts)
- [x] 1.2 Verify `tsconfig.json` includes both `src/**/*` and `tests/**/*`, sets `noEmit: false`, and enables all strict flags from the design
- [x] 1.3 Verify `tests/type-harness.ts` compiles clean with `tsc --noEmit` on a fresh workspace

## 2. Language Registry Entry

- [x] 2.1 Add `TYPESCRIPT_INSTRUCTIONS` object to `src/config/languages.js` with all 6 stage instruction sets: scaffold, starter-expand, test-expand, lesson-expand, coach, reviewer
- [x] 2.2 Write the `scaffold` instruction — specifies TypeScript exercise structure, type-only vs hybrid exercise distinction, node ID prefix conventions (TF/TN/TG/TV/TA/TL/TR/TP/TI), how to write section_intents that target type-system depth
- [x] 2.3 Write the `starter-expand` instruction — specifies TypeScript stub patterns (type aliases as `type Foo<T> = any`, function stubs, `// TODO: implement`), `src/solution.ts` as the primary file
- [x] 2.4 Write the `test-expand` instruction — specifies the `Expect<Equal<...>>` harness pattern, `@ts-expect-error` for negative tests, `import type` from type-harness, runtime throw-on-failure assertions for hybrid exercises
- [x] 2.5 Write the `lesson-expand` instruction — specifies TypeScript-specific lesson structure: lead with a compilable TS example demonstrating the exact type pattern, include tsc error output examples where relevant, close with "Now implement: <stub>"
- [x] 2.6 Write the `coach` instruction — explicitly states: do NOT paraphrase the tsc error message; ask Socratic questions about the type-theory property (distributivity, variance, inference site, covariance/contravariance, conditional type position); reference type-system vocabulary not syntax
- [x] 2.7 Write the `reviewer` instruction — specifies TypeScript-specific review criteria: type safety, avoidance of `any`, correctness of generic constraints, idiomatic use of type operators
- [x] 2.8 Add `typescript` entry to the REGISTRY with `name: "TypeScript"`, `testCommand: ["sh", "run-tests.sh"]`, `sourceDir: "src"`, `testsDir: "tests"`, `writeProjectConfig: writeTypescriptProjectConfig`, `stageInstructions: TYPESCRIPT_INSTRUCTIONS`

## 3. Curriculum Seed — TF, TN, TG Tracks

- [x] 3.1 Create `src/curriculum/typescriptSeed.js` with the file skeleton (imports, track map, export)
- [x] 3.2 Add TF track (6 nodes): TF01 structural typing depth, TF02 unknown/any/never algebra, TF03 type inference model, TF04 literal types + widening + as const, TF05 satisfies operator (4.9), TF06 using/await using (5.2)
- [x] 3.3 Add TN track (10 nodes): TN01 control flow graph, TN02 type guards, TN03 discriminated unions + exhaustiveness, TN04 assertion functions vs type predicates, TN05 aliased condition CFA (4.4), TN06 destructured discriminant narrowing (4.6), TN07 switch(true) narrowing (5.3), TN08 inferred type predicates (5.5), TN09 CFA limitations, TN10 NoInfer<T> (5.4)
- [x] 3.4 Add TG track (12 nodes): TG01 generic function inference, TG02 constraints, TG03 default type params, TG04 const type parameters (5.0), TG05 instantiation expressions (4.7), TG06 generic classes + polymorphic this, TG07 abstract construct signatures (4.2), TG08 HKT simulation, TG09 variance annotations in/out (4.7), TG10 inference from multiple positions, TG11 generic inference from conditional types, TG12 generic overloads

## 4. Curriculum Seed — TV, TA Tracks

- [x] 4.1 Add TV track (10 nodes): TV01 covariance, TV02 contravariance, TV03 bivariance (method shorthand), TV04 invariance, TV05 strictFunctionTypes mechanics, TV06 variance in generic types, TV07 CFA + variance interaction, TV08 variance + distributive conditional types, TV09 assignability algorithm, TV10 excess property checking + freshness
- [x] 4.2 Add TA track part 1 (TA01–TA11): keyof, typeof type-level, indexed access, conditional types basics, non-distributive conditionals, infer basics, infer covariant/contravariant position, infer extends constraint (4.7), multiple same-name infer, mapped types homomorphic/non-homomorphic, mapped type modifiers
- [x] 4.3 Add TA track part 2 (TA12–TA22): key remapping (4.1), template literal types (4.1), template literal + infer string parsing, intrinsic string types, recursive conditional types (4.1), tail recursion optimization (4.5), variadic tuple types (4.0), labeled tuple elements (4.0), leading/middle rest elements (4.2), getter/setter type independence (4.3), symbol + unique symbol

## 5. Curriculum Seed — TL, TR, TP, TI Tracks

- [x] 5.1 Add TL track medium tier (TL01–TL06): DeepReadonly, TupleToUnion, Awaited from scratch, UnionToIntersection, PickByValue, IsUnion
- [x] 5.2 Add TL track hard tier (TL07–TL12): Chunk, StringToTuple, CamelCase, FlattenDepth, ZipWith, TupleToObject with validation
- [x] 5.3 Add TL track extreme tier (TL13–TL18): ParseInt, type-level Add, type-level Compare, AllPermutations, type-level JSON parser, type-state machine
- [x] 5.4 Add TL track meta nodes (TL19–TL22): dissect Equal<A,B> implementation, recursion limits + workarounds, IsAny/IsNever/IsUnknown detection, UnionToTuple impossibility
- [x] 5.5 Add TR track (10 nodes): TR01 runtime validator (Zod-lite), TR02 branded types at runtime, TR03 type-safe event emitter, TR04 tagged template processors, TR05 overload resolution algorithm, TR06 stage 3 decorators (5.0), TR07 decorator metadata (5.2), TR08 auto-accessors (4.9), TR09 typed iterator protocol, TR10 compiler API
- [x] 5.6 Add TP track (10 nodes): TP01 interface extends vs type intersection performance, TP02 conditional type caching, TP03 recursive depth limits, TP04 union blowup patterns, TP05 isolatedModules constraints, TP06 declaration emit mechanics, TP07 project references, TP08 exactOptionalPropertyTypes + noUncheckedIndexedAccess, TP09 module resolution algorithms (node16 vs bundler), TP10 compiler internals overview (binder→checker→emitter)
- [x] 5.7 Add TI track (10 nodes): TI01 writing .d.ts files, TI02 module augmentation, TI03 declaration merging, TI04 ambient modules, TI05 overload authoring rules, TI06 import attributes (5.3), TI07 JSDoc TypeScript (@type, @satisfies, @import 5.5), TI08 const/regular enums vs union types, TI09 type-only imports/exports, TI10 resolution modes on import types

## 6. Curriculum Integration & Tests

- [x] 6.1 Update `src/curriculum/allCurricula.js` to import `typescriptCurriculum` from `./typescriptSeed.js` and merge it into the global curriculum graph
- [x] 6.2 Verify `getCurriculumForLanguage("typescript")` returns 100+ nodes and `getCurriculumForLanguage("rust")` is unchanged
- [x] 6.3 Create `tests/typescript-curriculum.test.js` using the same patterns as other language curriculum tests (validate node structure, unique IDs, track membership, no DAG cycles, all nodes have misconceptionTags)
- [x] 6.4 Run full test suite (`npm test`) and confirm all tests pass including the new typescript-curriculum test file
- [x] 6.5 Add `typescript` to `package.json` devDependencies if not already installed; verify `tsc --version` works in the project root
