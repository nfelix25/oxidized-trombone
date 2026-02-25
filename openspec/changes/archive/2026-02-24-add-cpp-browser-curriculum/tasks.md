# Tasks: add-cpp-browser-curriculum

## 1. Create browserSeed.js — Chromium Foundations track (BF)

- [x] 1.1 Scaffold `src/curriculum/browserSeed.js` with imports, track arrays, and export skeleton
- [x] 1.2 Add BF01 — `base::Thread and MessageLoop: Chromium's thread abstraction` (D2, prereq: CC01)
- [x] 1.3 Add BF02 — `Task runners: PostTask, SequencedTaskRunner, and thread affinity` (D2, prereq: BF01)
- [x] 1.4 Add BF03 — `base::BindOnce and base::BindRepeating: callback ownership model` (D3, prereqs: BF02, CV02)
- [x] 1.5 Add BF04 — `scoped_refptr and base::RefCounted: intrusive reference counting` (D2, prereqs: BF01, CM04)
- [x] 1.6 Add BF05 — `base::WeakPtr and WeakPtrFactory: safe cross-thread callbacks` (D3, prereq: BF04)
- [x] 1.7 Add BF06 — `base::Timer: one-shot, repeating, and OneShotTimer patterns` (D2, prereq: BF02)
- [x] 1.8 Add BF07 — `DCHECK, CHECK, and base::debug: Chromium assertion conventions` (D1, prereq: BF01)
- [x] 1.9 Add BF08 — `base::trace_event: TRACE_EVENT macros and tracing infrastructure` (D2, prereq: BF02)

## 2. Add Blink Rendering track (BL)

- [x] 2.1 Add BL01 — `DOM tree: Node, Element, and Document hierarchy in Blink` (D2, prereqs: BF01, CP04)
- [x] 2.2 Add BL02 — `Layout objects: LayoutObject tree and box model mapping` (D3, prereq: BL01)
- [x] 2.3 Add BL03 — `Style resolution: StyleResolver, ComputedStyle, and cascade` (D3, prereqs: BL01, CT02)
- [x] 2.4 Add BL04 — `PaintLayer and GraphicsContext: recording paint operations` (D3, prereq: BL02)
- [x] 2.5 Add BL05 — `cc::Layer and the compositor layer tree` (D3, prereqs: BL04, BF02)
- [x] 2.6 Add BL06 — `Rendering pipeline: BeginMainFrame, commit, activation, and draw` (D3, prereq: BL05)
- [x] 2.7 Add BL07 — `WebIDL bindings: exposing C++ objects to JavaScript in Blink` (D3, prereqs: BL01, BV03)
- [x] 2.8 Add BL08 — `Hit testing: LayoutObject::NodeAtPoint and pointer event routing` (D2, prereq: BL02)
- [x] 2.9 Add BL09 — `Accessibility tree: AXObject hierarchy and ARIA mapping` (D2, prereq: BL01)
- [x] 2.10 Add BL10 — `HTMLMediaElement and WebMediaPlayer: media pipeline plumbing` (D3, prereqs: BL01, BF04)

## 3. Add V8 API Embedding track (BV)

- [x] 3.1 Add BV01 — `Isolate and Context lifecycle: initialization and scope` (D2, prereqs: CT01, CM03)
- [x] 3.2 Add BV02 — `Handle scopes: v8::Local, v8::Persistent, and v8::Global` (D3, prereq: BV01)
- [x] 3.3 Add BV03 — `Creating JS values from C++: String, Object, Array, and Number` (D2, prereq: BV02)
- [x] 3.4 Add BV04 — `FunctionCallbackInfo and ReturnValue: implementing native functions` (D3, prereq: BV03)
- [x] 3.5 Add BV05 — `ObjectTemplate and FunctionTemplate: defining JS class bindings` (D3, prereqs: BV04, CT02)
- [x] 3.6 Add BV06 — `TryCatch and exception propagation across the C++/JS boundary` (D3, prereqs: BV03, CE01)
- [x] 3.7 Add BV07 — `V8 snapshots and startup performance` (D3, prereq: BV05)

## 4. Add Network Stack track (BN)

- [x] 4.1 Add BN01 — `URLRequest: creation, delegate pattern, and cancellation` (D2, prereqs: BF03, CE01)
- [x] 4.2 Add BN02 — `HTTP transaction model: HttpNetworkTransaction and HttpStream` (D3, prereq: BN01)
- [x] 4.3 Add BN03 — `TCP sockets: TCPClientSocket and async I/O with CompletionOnceCallback` (D3, prereqs: BN01, BF03)
- [x] 4.4 Add BN04 — `TLS: SSLClientSocket, BoringSSL handshake, and certificate verification` (D3, prereq: BN03)
- [x] 4.5 Add BN05 — `QUIC: QuicSession, stream multiplexing, and connection migration` (D3, prereq: BN04)
- [x] 4.6 Add BN06 — `DNS resolution: HostResolver, DnsTransaction, and DoH` (D3, prereqs: BN01, BF02)
- [x] 4.7 Add BN07 — `HttpCache and DiskCache: caching policy and validation` (D3, prereq: BN02)
- [x] 4.8 Add BN08 — `NetLog: structured event logging for network debugging` (D2, prereqs: BN01, BF08)

## 5. Add Aura UI Framework track (BA)

- [x] 5.1 Add BA01 — `views::View: layout, painting, and event handling` (D2, prereqs: BF03, CP04)
- [x] 5.2 Add BA02 — `Layout managers: FillLayout, BoxLayout, and TableLayout` (D2, prereq: BA01)
- [x] 5.3 Add BA03 — `views::Widget: window ownership and NativeWidget plumbing` (D3, prereqs: BA01, BF04)
- [x] 5.4 Add BA04 — `Layer-backed views: ui::Layer and cc::Layer integration` (D3, prereqs: BA03, BL05)
- [x] 5.5 Add BA05 — `Input event routing: EventHandler, EventTarget, and gesture detection` (D3, prereq: BA01)
- [x] 5.6 Add BA06 — `Drag and drop: DropTargetEvent and DragController` (D2, prereq: BA05)
- [x] 5.7 Add BA07 — `gfx::Animation and views::AnimationBuilder: implicit animations` (D3, prereqs: BA04, BF06)
- [x] 5.8 Add BA08 — `Accessibility in Views: ViewAccessibility and AXNodeData` (D2, prereqs: BA01, BL09)

## 6. Add Process Model & Mojo IPC track (BP)

- [x] 6.1 Add BP01 — `Multi-process architecture: browser, renderer, GPU, and utility processes` (D2, prereqs: BF01, CC07)
- [x] 6.2 Add BP02 — `Mojo message pipes: creating and transferring pipe endpoints` (D3, prereq: BF03)
- [x] 6.3 Add BP03 — `.mojom interface definitions: generating C++ bindings` (D3, prereqs: BP02, CT01)
- [x] 6.4 Add BP04 — `Remote<T> and Receiver<T>: calling across process boundaries` (D3, prereq: BP03)
- [x] 6.5 Add BP05 — `Content API: WebContents, RenderFrameHost, and navigation` (D3, prereqs: BP04, BL01)
- [x] 6.6 Add BP06 — `Sandbox policy: syscall filtering and RendererSandboxDelegate` (D3, prereq: BP01)
- [x] 6.7 Add BP07 — `Site isolation: SiteInstance, process locking, and OOPIF` (D3, prereq: BP05)

## 7. Wire browserSeed.js into allCurricula.js

- [x] 7.1 Import `browserCurriculum` from `./browserSeed.js` in `allCurricula.js`
- [x] 7.2 Spread `browserCurriculum.nodes` into the `allCurricula` node array
- [x] 7.3 Spread `browserCurriculum.tracks` into the `allCurricula` tracks object
- [x] 7.4 Verify `npm test` passes (all existing tests still green, no dangling prereq errors)

## 8. Write tests/cpp-browser-curriculum.test.js

- [x] 8.1 Test: all B-prefixed nodes have `language: "cpp"`
- [x] 8.2 Test: exactly 48 B-prefixed nodes exist in allCurricula
- [x] 8.3 Test: all 6 tracks present (`chromium-foundations`, `blink-rendering`, `v8-embedding`, `network-stack`, `aura-ui`, `process-model`)
- [x] 8.4 Test: `chromium-foundations` has 8 nodes (BF01–BF08)
- [x] 8.5 Test: `blink-rendering` has 10 nodes (BL01–BL10)
- [x] 8.6 Test: `v8-embedding` has 7 nodes (BV01–BV07)
- [x] 8.7 Test: `network-stack` has 8 nodes (BN01–BN08)
- [x] 8.8 Test: `aura-ui` has 8 nodes (BA01–BA08)
- [x] 8.9 Test: `process-model` has 7 nodes (BP01–BP07)
- [x] 8.10 Test spot-check: BF01 has CC01 as prerequisite
- [x] 8.11 Test spot-check: BF03 has CV02 as prerequisite
- [x] 8.12 Test spot-check: BV01 has CT01 as prerequisite
- [x] 8.13 Test spot-check: BV06 has CE01 as prerequisite
- [x] 8.14 Test spot-check: BL07 has BV03 as prerequisite
- [x] 8.15 Test spot-check: BP05 has BL01 as prerequisite
- [x] 8.16 Test spot-check: BA04 has BL05 as prerequisite
- [x] 8.17 Test: all browser node prerequisite IDs resolve in allCurricula (no dangling prereqs)
- [x] 8.18 Test: `getCurriculumForLanguage("cpp")` returns correct total node count (existing core + 48 browser)
- [x] 8.19 Run `npm test` — confirm all tests pass (green)

## 9. Manual smoke tests

- [x] 9.1 Verify `node -e "import('./src/curriculum/allCurricula.js').then(m => console.log(m.allCurricula.nodes.filter(n=>n.id.startsWith('B')).length))"` prints 48
- [x] 9.2 Verify BL07's prerequisites include both BL01 and BV03 (cross-track check)
- [x] 9.3 Verify no B-prefixed node has `language: "c"` (all must be "cpp")
