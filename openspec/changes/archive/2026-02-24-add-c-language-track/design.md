## Context

The platform is currently hardwired to Rust at six points: workspace generation (Cargo.toml), test execution (`cargo test`), file layout (`src/`/`tests/`), Codex stage instructions ("You are a Rust code writer…"), test output parsing (cargo test format), and the curriculum (all Rust nodes). Adding C requires decoupling each of these while keeping Rust behavior identical — no regressions, no breaking changes to existing sessions.

## Goals / Non-Goals

**Goals:**
- Add a language registry that captures all language-specific config in one place
- Add full C runtime support: Makefile workspace, `test.h` harness, clang/gcc compilation
- Add 14-node C curriculum (advanced pointers → IPC → signals → concurrency → networking)
- Thread `language` through session state so the correct runtime is chosen automatically
- Keep Rust working exactly as before (language defaults to `"rust"`)

**Non-Goals:**
- Supporting more than two languages in this change (Zig, Python, Go are future work)
- Abstracting the curriculum model itself (each language keeps its own seed file)
- Cross-language sessions (a session is always one language)
- Package manager integration for C (no conan/vcpkg; exercises use only the C standard library + POSIX)

## Decisions

### Decision 1: Language Registry (`src/config/languages.js`)

A single registry object keyed by language ID contains everything language-specific: test command, source/test directory names, project config writer, test output parser, and stage instructions. All six language-coupled files import from here instead of having their own hardcoded values.

**Alternative considered:** Per-file `if (language === 'rust') { ... }` guards. Rejected because it scatters the language surface area and makes adding a third language require changes in six files again.

### Decision 2: Minimal `test.h` harness, output mimics cargo test

The C workspace includes a generated `tests/test.h` header with `TEST_ASSERT`, `TEST_ASSERT_EQ`, `RUN_TEST`, and `TEST_SUMMARY` macros. The output format is deliberately chosen to match cargo test:

```
test constant_is_positive ... ok
test pointer_arithmetic_roundtrip ... ok

test result: ok. 3 passed; 0 failed
```

This means `reviewIntegration.js` needs only a small additional parser for C — the line patterns are essentially the same.

**Alternative considered:** Using Unity or CMocka. Rejected because they require installation (breaks zero-dependency constraint) and add a learning curve for Codex.

### Decision 3: Makefile as build system

Each C workspace gets a generated Makefile. `make test` compiles all `tests/test_*.c` files against `src/*.c` and runs them. Linker flags (`-lpthread`, `-lrt`) are included by default since IPC and threading topics need them.

```makefile
CC      = cc
CFLAGS  = -Wall -Wextra -g -I src -I tests
LDFLAGS = -lpthread -lrt
SRCS    = $(wildcard src/*.c)
TESTS   = $(wildcard tests/test_*.c)

.PHONY: test
test:
	@EXIT=0; for t in $(TESTS); do \
		$(CC) $(CFLAGS) $(SRCS) $$t -o /tmp/_ex_test $(LDFLAGS) && /tmp/_ex_test || EXIT=1; \
	done; exit $$EXIT
```

**Alternative considered:** CMake. Rejected for same reason as test frameworks — extra tooling, complexity Codex doesn't need.

### Decision 4: `language` as a session state field, defaulting to `"rust"`

`createNewSession` gains a `language` field. The curriculum node carries a `language` property (already exists for Rust as an implicit default). When a node is selected, `language` is set on the session and persists.

Existing sessions without a `language` field treat `null` as `"rust"` — zero migration needed.

**Alternative considered:** Derive language from the node ID prefix (C-prefixed nodes → C). Rejected because it couples naming convention to runtime behavior; explicit is better.

### Decision 5: Separate C curriculum seed, merged at runtime

C nodes live in `src/curriculum/cSeed.js` and Rust nodes stay in `src/curriculum/seed.js`. Both are imported and merged in a `src/curriculum/allCurricula.js` module. This keeps each language's curriculum independently readable.

**Alternative considered:** Adding C nodes directly to seed.js. Rejected because seed.js is already large and mixing two languages' curricula would make it hard to read and maintain.

## Risks / Trade-offs

- **`-lrt` not available on macOS** — `librt` is merged into libc on macOS. Mitigation: Makefile uses `-lrt` only on Linux (detected via `$(shell uname)`), or we simply omit it and note that `shm_open` on macOS doesn't need it.
- **Codex quality for C** — C exercises involve raw memory and undefined behavior; Codex may generate stubs that compile but have subtle UB. Mitigation: prompt instructions explicitly warn against UB in stubs and ask for safe placeholder returns.
- **test.h coverage gaps** — floating-point comparisons, struct comparisons need extra macros. Mitigation: include `TEST_ASSERT_FLOAT_EQ` and `TEST_ASSERT_MEM_EQ` in the generated header.

## Migration Plan

1. Add `src/config/languages.js` with Rust config first, verify all existing tests pass
2. Refactor the six Rust-coupled files to use the registry (Rust behavior unchanged)
3. Add C config to the registry
4. Add C curriculum nodes
5. Run fixtures test suite against C fixtures
6. Manual smoke test: `npm run session start -- --debug` with a C node
