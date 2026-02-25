## MODIFIED Requirements

### Requirement: JL — Language Frontend track exists (JL01–JL09)
The system SHALL include a `js-language-frontend` track. Node JL06 SHALL be split into three atomic sub-nodes: JL06a (variable binding and scope chain resolution), JL06b (var hoisting and function-scope semantics), and JL06c (temporal dead zone and strict mode). Each sub-node SHALL teach exactly one first principle from the original JL06 scope.

#### Scenario: JL06a covers binding and scope chain
- **WHEN** a session targets node JL06a
- **THEN** the scaffold plans content on identifier resolution, scope chain walkup, and how the analysis pass records binding sites

#### Scenario: JL06b covers var hoisting
- **WHEN** a session targets node JL06b
- **THEN** the scaffold plans content on var declaration lifting, function-scope semantics, and how the bytecode emitter must account for hoisted bindings

#### Scenario: JL06c covers temporal dead zone and strict mode
- **WHEN** a session targets node JL06c
- **THEN** the scaffold plans content on let/const initialization constraints, TDZ error generation, and how strict mode changes scope semantics

#### Scenario: Original JL06 node no longer exists
- **WHEN** the curriculum is loaded
- **THEN** there is no node with id "JL06"; learners encounter JL06a, JL06b, JL06c in sequence

### Requirement: JP — Promises and Async track exists (JP01–JP06)
The system SHALL include a `js-promises-async` track. Node JP03 SHALL be split into two atomic sub-nodes: JP03a (generators as coroutines: yield, suspend, resume mechanics) and JP03b (async/await desugaring: promise-wrapped generator state machine). JP03a SHALL be a prerequisite for JP03b.

#### Scenario: JP03a covers generator coroutine mechanics
- **WHEN** a session targets node JP03a
- **THEN** the scaffold plans content on generator frame suspension, resumption, the yield expression as a two-way channel, and how the generator state machine is implemented in C

#### Scenario: JP03b covers async/await desugaring
- **WHEN** a session targets node JP03b
- **THEN** the scaffold plans content on how async functions desugar to generator + promise wrappers, PromiseReactionJob scheduling, and the relationship to JV06 generator frames

#### Scenario: Original JP03 node no longer exists
- **WHEN** the curriculum is loaded
- **THEN** there is no node with id "JP03"; learners encounter JP03a then JP03b

### Requirement: JC — Closures and Scope track exists (JC01–JC05)
The system SHALL include a `js-closures-scope` track. Node JC04 SHALL be split into three atomic sub-nodes: JC04a (live bindings: ES6 export binding semantics), JC04b (namespace objects: Module namespace exotic object), and JC04c (circular module dependencies: detection and resolution).

#### Scenario: JC04a covers live bindings
- **WHEN** a session targets node JC04a
- **THEN** the scaffold plans content on how ESM export bindings are live (not copies), indirect binding indirection in the module record, and why this differs from CommonJS

#### Scenario: JC04b covers namespace objects
- **WHEN** a session targets node JC04b
- **THEN** the scaffold plans content on the Module Namespace exotic object, its immutable prototype, and how property access is routed to the live binding

#### Scenario: JC04c covers circular dependencies
- **WHEN** a session targets node JC04c
- **THEN** the scaffold plans content on the module evaluation order, circular reference detection in the linking phase, and TDZ errors from uninitialized bindings in cycles

#### Scenario: Original JC04 node no longer exists
- **WHEN** the curriculum is loaded
- **THEN** there is no node with id "JC04"

### Requirement: JR — Runtime Internals track exists (JR01–JR06)
The system SHALL include a `js-runtime-internals` track. Node JR01 SHALL be split into three atomic sub-nodes: JR01a (string interning), JR01b (one-byte vs two-byte string encoding), and JR01c (string slices and cons strings). Node JR03 SHALL be split into three atomic sub-nodes: JR03a (module records), JR03b (dynamic import()), and JR03c (import.meta).

#### Scenario: JR01a covers string interning
- **WHEN** a session targets node JR01a
- **THEN** the scaffold plans content on hash-consing, the string table, and deduplication semantics

#### Scenario: JR01b covers string encoding
- **WHEN** a session targets node JR01b
- **THEN** the scaffold plans content on Latin-1 vs UTF-16 dual-encoding, the SeqOneByteString and SeqTwoByteString types, and when V8 promotes encoding

#### Scenario: JR01c covers string slices and cons strings
- **WHEN** a session targets node JR01c
- **THEN** the scaffold plans content on the rope data structure, SlicedString, ConsString, and flattening strategies

#### Scenario: JR03a covers module records
- **WHEN** a session targets node JR03a
- **THEN** the scaffold plans content on the Module Record abstract type, the [[RequestedModules]], [[ImportEntries]], and [[ExportEntries]] internal slots

#### Scenario: JR03b covers dynamic import()
- **WHEN** a session targets node JR03b
- **THEN** the scaffold plans content on the dynamic import() call, the promise it returns, and how the module loader integrates with the microtask queue

#### Scenario: JR03c covers import.meta
- **WHEN** a session targets node JR03c
- **THEN** the scaffold plans content on the import.meta object, its host-defined properties (url, resolve), and how Node.js populates it

### Requirement: JO — Object Model track exists (JO01–JO07)
The system SHALL include a `js-object-model` track. Node JO07 SHALL be split into two atomic sub-nodes: JO07a (Proxy: handler traps and operation interception) and JO07b (Reflect: standard object operations as first-class functions).

#### Scenario: JO07a covers Proxy trap mechanism
- **WHEN** a session targets node JO07a
- **THEN** the scaffold plans content on the Proxy handler object, the 13 fundamental operation traps, invariant enforcement, and revocable proxies

#### Scenario: JO07b covers Reflect API
- **WHEN** a session targets node JO07b
- **THEN** the scaffold plans content on Reflect as the default behavior mirror of Proxy traps, method-by-method correspondence, and why Reflect.apply is safer than Function.prototype.apply

#### Scenario: JO01 requires VM context
- **WHEN** the curriculum is loaded
- **THEN** node JO01 has JV01 listed as a prerequisite, ensuring learners understand the stack interpreter before studying hidden classes
