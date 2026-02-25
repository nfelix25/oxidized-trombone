## ADDED Requirements

### Requirement: Zig High-Priority Composite Nodes Are Split Into Atomic Sub-Nodes
Zig nodes that conflate multiple unrelated utilities SHALL be replaced by atomic sub-nodes:

- **ZA03** (std.mem utilities: copy, eql, indexOf, sort, reverse — 5+ independent utilities) SHALL be split into: ZA03 (std.mem copy and equality: mem.copy, mem.eql, mem.copyForwards — the fundamental slice comparison and copy primitives), ZA03b (std.mem search: mem.indexOf, mem.indexOfScalar, mem.startsWith, mem.endsWith — slice search patterns), and ZA03c (std.mem sort: mem.sort, mem.reverse, lessThan comparators — in-place reordering).

#### Scenario: ZA03 covers only copy and equality
- **WHEN** a session targets node ZA03
- **THEN** the scaffold plans content exclusively on mem.copy, mem.eql, mem.copyForwards, and the dest/src length invariant — not search or sort operations

#### Scenario: ZA03b covers slice search
- **WHEN** a session targets node ZA03b
- **THEN** the scaffold plans content on mem.indexOf, mem.indexOfScalar, mem.startsWith, mem.endsWith, and optional return patterns for search results

#### Scenario: ZA03c covers sorting
- **WHEN** a session targets node ZA03c
- **THEN** the scaffold plans content on mem.sort, the comparator function signature, mem.reverse, and why Zig's sort requires a context parameter for custom ordering
