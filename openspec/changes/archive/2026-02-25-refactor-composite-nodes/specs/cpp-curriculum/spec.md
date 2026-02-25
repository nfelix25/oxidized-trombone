## ADDED Requirements

### Requirement: C++ Critical Composite Nodes Are Split Into Atomic Sub-Nodes
Nodes that conflate two or more first principles SHALL be replaced by atomic sub-nodes. Specifically:

- **CV01** (value categories) SHALL be split into: CV01a (lvalue vs rvalue: the "has-an-address" rule and basic move semantics motivation) and CV01b (glvalue/prvalue/xvalue: the full taxonomy and decltype implications).
- **CP07** (virtual destructors + diamond problem) SHALL be split into: CP07a (virtual destructors: why non-virtual destructors in polymorphic base classes cause UB) and CP07b (diamond inheritance and virtual base classes: DDD pattern and constructor delegation).
- **CT04** (variadic templates + fold expressions) SHALL be split into: CT04a (variadic templates: parameter pack expansion, sizeof..., recursive unpacking) and CT04b (fold expressions: unary/binary folds, operator-based pack reduction, C++17).
- **CT05** (SFINAE + enable_if) SHALL be split into: CT05a (SFINAE: substitution failure and overload resolution, ill-formed expressions as non-errors) and CT05b (enable_if and type_traits: conditional template instantiation patterns). CT05a SHALL add "template overload resolution" to prerequisites.
- **CC04** (atomic operations + memory ordering) SHALL be split into: CC04a (std::atomic and lock-free operations: load, store, fetch_add, compare_exchange) and CC04b (memory ordering semantics: acquire-release, sequentially consistent, relaxed — why each level matters). CC04b SHALL have CC04a as a prerequisite and SHALL add a "memory model / happens-before" prerequisite concept.

#### Scenario: CV01a teaches lvalue vs rvalue only
- **WHEN** a session targets node CV01a
- **THEN** the scaffold plans content on the lvalue-has-address rule, move semantics motivation, rvalue references (&&), and std::move — without teaching the full glvalue/prvalue/xvalue taxonomy

#### Scenario: CV01b teaches the full value category tree
- **WHEN** a session targets node CV01b
- **THEN** the scaffold plans content on glvalue, prvalue, and xvalue, decltype on expressions, and C++17 guaranteed copy elision

#### Scenario: CP07a covers virtual destructors
- **WHEN** a session targets node CP07a
- **THEN** the scaffold plans content on why delete through a base pointer with non-virtual destructor is UB, the vtable entry for the destructor, and when to use virtual destructors

#### Scenario: CP07b covers diamond inheritance
- **WHEN** a session targets node CP07b
- **THEN** the scaffold plans content on the diamond problem, virtual base classes, the virtual base pointer, and constructor delegation order

#### Scenario: CT04a covers variadic templates
- **WHEN** a session targets node CT04a
- **THEN** the scaffold plans content on template parameter packs, pack expansion syntax, sizeof..., and recursive unpacking with base case specialization

#### Scenario: CT04b covers fold expressions
- **WHEN** a session targets node CT04b
- **THEN** the scaffold plans content on unary left/right folds, binary folds, operator selection, and C++17 compile-time reduction patterns

#### Scenario: CT05a covers SFINAE
- **WHEN** a session targets node CT05a
- **THEN** the scaffold plans content on substitution failure not being an error, ill-formed expressions in template argument deduction, and overload set pruning

#### Scenario: CT05b covers enable_if
- **WHEN** a session targets node CT05b
- **THEN** the scaffold plans content on std::enable_if, void_t, and conditional template specialization patterns using type_traits

#### Scenario: CC04a covers lock-free atomic operations
- **WHEN** a session targets node CC04a
- **THEN** the scaffold plans content on std::atomic<T>, compare_exchange_weak vs strong, fetch_add, and the ABA problem

#### Scenario: CC04b covers memory ordering
- **WHEN** a session targets node CC04b
- **THEN** the scaffold plans content on the C++ memory model, acquire-release semantics, sequentially consistent ordering, and why relaxed ordering is allowed for counters
