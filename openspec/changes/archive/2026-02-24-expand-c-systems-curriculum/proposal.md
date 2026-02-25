## Why

The existing C track has 14 nodes covering only introductory-level pointers, IPC, concurrency, and networking — enough to introduce C but not enough to build a real understanding of how OS facilities work at the systems level. The primary long-term goal is a JS runtime curriculum (building V8/JSC/libuv concepts), and that curriculum depends heavily on OS primitives (mmap, mprotect, kqueue, thread pools, dynamic linking) that are not yet covered. This change expands the C track from 14 to ~44 nodes, covering all OS foundations the JS runtime curriculum will require, plus key macOS-specific APIs that the existing C241 node incorrectly references as Linux-only.

## What Changes

- Add ~30 new C curriculum nodes across 6 new tracks: `c-virtual-memory`, `c-filesystem`, `c-kqueue-io`, `c-advanced-concurrency`, `c-dynamic-linking`, `c-subprocess-signals`
- Fix C241: remove Linux-specific `epoll` reference; replace with `poll()` and a note pointing to the kqueue track for macOS-native event I/O
- All new nodes use `language: "c"` and target macOS (kqueue instead of epoll; DYLD instead of LD_PRELOAD)
- No changes to the runtime, schemas, or session infrastructure — pure curriculum expansion

## Capabilities

### New Capabilities

- `c-systems-curriculum`: The six new tracks and their nodes covering virtual memory, filesystem internals, kqueue I/O multiplexing, advanced concurrency primitives, dynamic linking, and subprocess/signal patterns

### Modified Capabilities

- `c-learning-curriculum`: Add the six new tracks to the C curriculum node set; update C241 to remove epoll and reference poll() + kqueue

## Impact

- `src/curriculum/cSeed.js`: Add ~30 new nodes; update C241 node content
- No other files change
