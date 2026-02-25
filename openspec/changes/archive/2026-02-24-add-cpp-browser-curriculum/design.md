## Context

The project has established a pattern for per-language curriculum seed files (`cSeed.js`, `zigSeed.js`, `pythonSeed.js`, `cppSeed.js`, `jsSeed.js`) each exporting a `createCurriculumGraph()` result that is spread into `allCurricula.js`. The JS runtime curriculum established the pattern of using `language: "c"` for all nodes regardless of track prefix, because exercises are implemented in the target language. The same pattern applies here: all browser curriculum nodes use `language: "cpp"`.

The existing `cppSeed.js` contains ~70 core C++ nodes (CF, CP, CM, CV, CS, CT, CK, CE, CO, CC, CW, CB tracks). The browser curriculum is a separate file `browserSeed.js` to avoid making `cppSeed.js` unwieldy.

## Goals / Non-Goals

**Goals:**
- Add 48 new `language: "cpp"` nodes in 6 Chromium-focused tracks
- All cross-track prerequisites resolve in `allCurricula`
- Tests verify node counts, track membership, cross-track prereqs, and no dangling prereqs
- `getCurriculumForLanguage("cpp")` returns all C++ nodes (core + browser)

**Non-Goals:**
- Actual Chromium source code exercises (exercises are synthetic C++ tasks that teach the concepts)
- Coverage of the full Chromium codebase — focused on the 4 subsystems named in the proposal
- Linux/Windows-specific APIs (macOS-compatible only, consistent with existing C systems curriculum)

## Node ID Scheme

`B` (Browser) + track-letter + 2-digit index:

| Prefix | Track | Count | ID Range |
|--------|-------|-------|----------|
| `BF`   | Chromium Foundations (base library, threading, Mojo) | 8  | BF01–BF08 |
| `BL`   | Blink Rendering (DOM, layout, paint, compositing) | 10 | BL01–BL10 |
| `BV`   | V8 API Embedding (Isolates, Handles, templates) | 7  | BV01–BV07 |
| `BN`   | Network Stack (URLRequest, HTTP, QUIC, TLS) | 8  | BN01–BN08 |
| `BA`   | Aura UI Framework (Views, layers, input, animation) | 8  | BA01–BA08 |
| `BP`   | Process Model & Mojo IPC (multi-process, sandbox) | 7  | BP01–BP07 |

Total: 48 nodes

## Track Design

### BF — Chromium Foundations (BF01–BF08)

Core base library patterns used pervasively in Chromium. Entry point: BF01 (no external prereqs). All other BF nodes build internally.

| ID | Title | Prerequisites |
|----|-------|---------------|
| BF01 | base::Thread and MessageLoop: Chromium's thread abstraction | CC01 |
| BF02 | Task runners: PostTask, SequencedTaskRunner, and thread affinity | BF01 |
| BF03 | base::BindOnce and base::BindRepeating: callback ownership model | BF02, CV02 |
| BF04 | scoped_refptr and base::RefCounted: intrusive reference counting | BF01, CM04 |
| BF05 | base::WeakPtr and WeakPtrFactory: safe cross-thread callbacks | BF04 |
| BF06 | base::Timer: one-shot, repeating, and OneShotTimer patterns | BF02 |
| BF07 | DCHECK, CHECK, and base::debug: Chromium assertion conventions | BF01 |
| BF08 | base::trace_event: TRACE_EVENT macros and tracing infrastructure | BF02 |

### BL — Blink Rendering (BL01–BL10)

Blink rendering pipeline from DOM to compositor. Entry: BL01 (prereq BF01).

| ID | Title | Prerequisites |
|----|-------|---------------|
| BL01 | DOM tree: Node, Element, and Document hierarchy in Blink | BF01, CP04 |
| BL02 | Layout objects: LayoutObject tree and box model mapping | BL01 |
| BL03 | Style resolution: StyleResolver, ComputedStyle, and cascade | BL01, CT02 |
| BL04 | PaintLayer and GraphicsContext: recording paint operations | BL02 |
| BL05 | cc::Layer and the compositor layer tree | BL04, BF02 |
| BL06 | Rendering pipeline: BeginMainFrame, commit, activation, and draw | BL05 |
| BL07 | WebIDL bindings: exposing C++ objects to JavaScript in Blink | BL01, BV03 |
| BL08 | Hit testing: LayoutObject::NodeAtPoint and pointer event routing | BL02 |
| BL09 | Accessibility tree: AXObject hierarchy and ARIA mapping | BL01 |
| BL10 | HTMLMediaElement and WebMediaPlayer: media pipeline plumbing | BL01, BF04 |

### BV — V8 API Embedding (BV01–BV07)

V8's C++ embedding API — how to host a JS engine from C++. Entry: BV01 (prereqs CT01, CM03).

| ID | Title | Prerequisites |
|----|-------|---------------|
| BV01 | Isolate and Context lifecycle: initialization and scope | CT01, CM03 |
| BV02 | Handle scopes: v8::Local, v8::Persistent, and v8::Global | BV01 |
| BV03 | Creating JS values from C++: String, Object, Array, and Number | BV02 |
| BV04 | FunctionCallbackInfo and ReturnValue: implementing native functions | BV03 |
| BV05 | ObjectTemplate and FunctionTemplate: defining JS class bindings | BV04, CT02 |
| BV06 | TryCatch and exception propagation across the C++/JS boundary | BV03, CE01 |
| BV07 | V8 snapshots and startup performance | BV05 |

### BN — Network Stack (BN01–BN08)

Chromium's network stack from URLRequest to TLS. Entry: BN01 (prereqs CC05, CE01).

| ID | Title | Prerequisites |
|----|-------|---------------|
| BN01 | URLRequest: creation, delegate pattern, and cancellation | BF03, CE01 |
| BN02 | HTTP transaction model: HttpNetworkTransaction and HttpStream | BN01 |
| BN03 | TCP sockets: TCPClientSocket and async I/O with CompletionOnceCallback | BN01, BF03 |
| BN04 | TLS: SSLClientSocket, BoringSSL handshake, and certificate verification | BN03 |
| BN05 | QUIC: QuicSession, stream multiplexing, and connection migration | BN04 |
| BN06 | DNS resolution: HostResolver, DnsTransaction, and DoH | BN01, BF02 |
| BN07 | HttpCache and DiskCache: caching policy and validation | BN02 |
| BN08 | NetLog: structured event logging for network debugging | BN01, BF08 |

### BA — Aura UI Framework (BA01–BA08)

Views, layers, input routing, and animation in Chrome's UI framework.

| ID | Title | Prerequisites |
|----|-------|---------------|
| BA01 | views::View: layout, painting, and event handling | BF03, CP04 |
| BA02 | Layout managers: FillLayout, BoxLayout, and TableLayout | BA01 |
| BA03 | views::Widget: window ownership and NativeWidget plumbing | BA01, BF04 |
| BA04 | Layer-backed views: ui::Layer and cc::Layer integration | BA03, BL05 |
| BA05 | Input event routing: EventHandler, EventTarget, and gesture detection | BA01 |
| BA06 | Drag and drop: DropTargetEvent and DragController | BA05 |
| BA07 | gfx::Animation and views::AnimationBuilder: implicit animations | BA04, BF06 |
| BA08 | Accessibility in Views: ViewAccessibility and AXNodeData | BA01, BL09 |

### BP — Process Model & Mojo IPC (BP01–BP07)

Chromium's multi-process architecture and Mojo IPC system.

| ID | Title | Prerequisites |
|----|-------|---------------|
| BP01 | Multi-process architecture: browser, renderer, GPU, and utility processes | BF01, CC07 |
| BP02 | Mojo message pipes: creating and transferring pipe endpoints | BF03 |
| BP03 | .mojom interface definitions: generating C++ bindings | BP02, CT01 |
| BP04 | Remote<T> and Receiver<T>: calling across process boundaries | BP03 |
| BP05 | Content API: WebContents, RenderFrameHost, and navigation | BP04, BL01 |
| BP06 | Sandbox policy: syscall filtering and RendererSandboxDelegate | BP01 |
| BP07 | Site isolation: SiteInstance, process locking, and OOPIF | BP05 |

## Cross-Track Prerequisite Links (Browser → C++ Core)

| Node | Prereq from C++ core | Rationale |
|------|---------------------|-----------|
| BF01 | CC01 (std::thread) | base::Thread wraps std::thread semantics |
| BF03 | CV02 (move constructor) | BindOnce moves the callback into the closure |
| BF04 | CM04 (shared_ptr) | scoped_refptr vs shared_ptr comparison |
| BL01 | CP04 (inheritance) | Blink DOM hierarchy uses deep virtual dispatch |
| BL03 | CT02 (class templates) | StyleResolver uses template specializations |
| BV01 | CT01, CM03 | V8 embedding uses templates and smart pointers heavily |
| BV05 | CT02 | ObjectTemplate/FunctionTemplate are C++ class templates |
| BV06 | CE01 (exceptions) | TryCatch wraps JS exceptions as C++ objects |
| BN01 | CE01 (exceptions) | Network errors use base::expected / callback error codes |
| BP01 | CC07 (thread-safe patterns) | Browser/renderer boundary requires DCHECK sequences |
| BP03 | CT01 (function templates) | Mojo-generated bindings use template dispatch |

## File Layout

```
src/curriculum/browserSeed.js   (new)
tests/cpp-browser-curriculum.test.js   (new)
```

`allCurricula.js` adds one import + one spread in each call, same pattern as `jsSeed.js`.

## test Strategy

Mirror `js-runtime-curriculum.test.js`:
1. All browser nodes have `language: "cpp"`
2. Exactly 48 nodes with B-prefixes
3. All 6 tracks present with correct node counts
4. Spot-check 6–8 cross-track prerequisite links
5. All prereq IDs resolve in `allCurricula`
6. `getCurriculumForLanguage("cpp")` returns core + browser = expected total
