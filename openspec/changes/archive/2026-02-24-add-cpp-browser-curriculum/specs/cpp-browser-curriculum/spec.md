## ADDED Requirements

### Requirement: C++ browser curriculum provides a Chromium-focused advanced track
The system SHALL provide 48 curriculum nodes (language: "cpp") organized into 6 tracks that teach Chromium-style C++ through browser engine internals. All node IDs use the pattern B + track-letter + 2-digit index (BF01–BP07). All nodes have `language: "cpp"`. Prerequisites from the C++ core curriculum (CF, CP, CM, CV, CS, CT, CK, CE, CO, CC, CW tracks) resolve in `allCurricula`.

#### Scenario: Browser curriculum nodes appear in C++ language graph
- **WHEN** `getCurriculumForLanguage("cpp")` is called
- **THEN** all 48 browser curriculum nodes are included alongside the existing C++ core nodes

#### Scenario: All browser nodes use language="cpp"
- **WHEN** any node with a B-prefixed ID is retrieved
- **THEN** `node.language === "cpp"`

#### Scenario: All 6 tracks are present in allCurricula.tracks
- **WHEN** `allCurricula.tracks` is inspected
- **THEN** keys `chromium-foundations`, `blink-rendering`, `v8-embedding`, `network-stack`, `aura-ui`, and `process-model` all exist

---

### Requirement: Chromium Foundations track (BF) provides base library patterns
The system SHALL provide a `chromium-foundations` track with 8 nodes (BF01–BF08) covering base::Thread, task runners, BindOnce/BindRepeating, scoped_refptr, WeakPtr, Timer, DCHECK assertions, and tracing infrastructure. BF01's only prerequisite is CC01 (std::thread) from the C++ core curriculum.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| BF01 | base::Thread and MessageLoop: Chromium's thread abstraction | D2 | CC01 |
| BF02 | Task runners: PostTask, SequencedTaskRunner, and thread affinity | D2 | BF01 |
| BF03 | base::BindOnce and base::BindRepeating: callback ownership model | D3 | BF02, CV02 |
| BF04 | scoped_refptr and base::RefCounted: intrusive reference counting | D2 | BF01, CM04 |
| BF05 | base::WeakPtr and WeakPtrFactory: safe cross-thread callbacks | D3 | BF04 |
| BF06 | base::Timer: one-shot, repeating, and OneShotTimer patterns | D2 | BF02 |
| BF07 | DCHECK, CHECK, and base::debug: Chromium assertion conventions | D1 | BF01 |
| BF08 | base::trace_event: TRACE_EVENT macros and tracing infrastructure | D2 | BF02 |

**Keywords covered:** `base::Thread`, `MessageLoop`, `MessagePumpType`, `SequencedTaskRunner`, `SingleThreadTaskRunner`, `PostTask`, `PostDelayedTask`, `base::BindOnce`, `base::BindRepeating`, `base::Callback`, `base::OnceClosure`, closure semantics, `scoped_refptr`, `base::RefCounted`, `base::RefCountedThreadSafe`, intrusive ref count, `base::WeakPtr`, `base::WeakPtrFactory`, `GetWeakPtr`, invalidation, `base::OneShotTimer`, `base::RepeatingTimer`, `DCHECK`, `CHECK`, `NOTREACHED`, `DCHECK_CALLED_ON_VALID_SEQUENCE`, `TRACE_EVENT0`, `TRACE_EVENT1`, `TRACE_EVENT_ASYNC_BEGIN0`, perfetto

#### Scenario: BF01 is the entry point with only std::thread as prerequisite
- **WHEN** a learner has completed CC01 (std::thread)
- **THEN** BF01 becomes eligible

#### Scenario: Task runner nodes require BF01
- **WHEN** a learner completes BF01
- **THEN** BF02 becomes eligible

#### Scenario: BindOnce requires both task runners and move semantics
- **WHEN** a learner has not completed CV02 (move constructors)
- **THEN** BF03 is not eligible

---

### Requirement: Blink Rendering track (BL) teaches the DOM-to-compositor pipeline
The system SHALL provide a `blink-rendering` track with 10 nodes (BL01–BL10) covering Blink's DOM hierarchy, layout objects, style resolution, paint recording, compositor layer tree, rendering pipeline phases, WebIDL bindings, hit testing, accessibility tree, and media element plumbing.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| BL01 | DOM tree: Node, Element, and Document hierarchy in Blink | D2 | BF01, CP04 |
| BL02 | Layout objects: LayoutObject tree and box model mapping | D3 | BL01 |
| BL03 | Style resolution: StyleResolver, ComputedStyle, and cascade | D3 | BL01, CT02 |
| BL04 | PaintLayer and GraphicsContext: recording paint operations | D3 | BL02 |
| BL05 | cc::Layer and the compositor layer tree | D3 | BL04, BF02 |
| BL06 | Rendering pipeline: BeginMainFrame, commit, activation, and draw | D3 | BL05 |
| BL07 | WebIDL bindings: exposing C++ objects to JavaScript in Blink | D3 | BL01, BV03 |
| BL08 | Hit testing: LayoutObject::NodeAtPoint and pointer event routing | D2 | BL02 |
| BL09 | Accessibility tree: AXObject hierarchy and ARIA mapping | D2 | BL01 |
| BL10 | HTMLMediaElement and WebMediaPlayer: media pipeline plumbing | D3 | BL01, BF04 |

**Keywords covered:** `Node`, `Element`, `Document`, `NodeType`, tree walker, `LayoutObject`, `LayoutBox`, `LayoutBlockFlow`, containment, `StyleResolver`, `ComputedStyle`, cascade, specificity, `PaintLayer`, `GraphicsContext`, paint recorder, display list, `cc::Layer`, `cc::PictureLayer`, `LayerTreeHost`, `BeginMainFrame`, commit, activation, draw, tile rasterization, WebIDL, `[Exposed=Window]`, `ExceptionState`, hit test result, `HitTestRequest`, `AXObject`, `AXNodeData`, ARIA role, `HTMLMediaElement`, `WebMediaPlayer`, `MediaStream`

#### Scenario: Blink DOM node requires both Chromium threading and C++ inheritance
- **WHEN** a learner has completed BF01 and CP04
- **THEN** BL01 is eligible

#### Scenario: Compositor pipeline requires paint layer knowledge
- **WHEN** a learner completes BL04 and BF02
- **THEN** BL05 is eligible

#### Scenario: WebIDL bindings require both DOM knowledge and V8 value creation
- **WHEN** a learner has not completed BV03
- **THEN** BL07 is not eligible

---

### Requirement: V8 API Embedding track (BV) covers hosting a JS engine from C++
The system SHALL provide a `v8-embedding` track with 7 nodes (BV01–BV07) covering Isolate/Context lifecycle, handle scopes, creating JS values, function callbacks, ObjectTemplate/FunctionTemplate, TryCatch exception handling, and V8 snapshots.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| BV01 | Isolate and Context lifecycle: initialization and scope | D2 | CT01, CM03 |
| BV02 | Handle scopes: v8::Local, v8::Persistent, and v8::Global | D3 | BV01 |
| BV03 | Creating JS values from C++: String, Object, Array, and Number | D2 | BV02 |
| BV04 | FunctionCallbackInfo and ReturnValue: implementing native functions | D3 | BV03 |
| BV05 | ObjectTemplate and FunctionTemplate: defining JS class bindings | D3 | BV04, CT02 |
| BV06 | TryCatch and exception propagation across the C++/JS boundary | D3 | BV03, CE01 |
| BV07 | V8 snapshots and startup performance | D3 | BV05 |

**Keywords covered:** `v8::Isolate`, `v8::Context`, `Isolate::CreateParams`, `v8::HandleScope`, `v8::EscapableHandleScope`, `v8::Local<T>`, `v8::Persistent<T>`, `v8::Global<T>`, handle invalidation, `v8::String::NewFromUtf8`, `v8::Object::New`, `v8::Array::New`, `v8::Number::New`, `v8::FunctionCallback`, `v8::FunctionCallbackInfo<v8::Value>`, `info.GetReturnValue().Set()`, `v8::ObjectTemplate`, `v8::FunctionTemplate`, `InstanceTemplate`, `PrototypeTemplate`, `v8::TryCatch`, `HasCaught()`, `Message()`, `v8::SnapshotCreator`, blob serialization

#### Scenario: V8 Isolate node requires template and smart pointer knowledge
- **WHEN** a learner has completed CT01 and CM03
- **THEN** BV01 is eligible

#### Scenario: ObjectTemplate requires both function callbacks and class templates
- **WHEN** a learner has completed BV04 and CT02
- **THEN** BV05 is eligible

#### Scenario: TryCatch node requires both V8 values and C++ exception knowledge
- **WHEN** a learner has completed BV03 and CE01
- **THEN** BV06 is eligible

---

### Requirement: Network Stack track (BN) teaches Chromium's HTTP/TLS/QUIC pipeline
The system SHALL provide a `network-stack` track with 8 nodes (BN01–BN08) covering URLRequest/delegate pattern, HTTP transaction model, TCP sockets, TLS/BoringSSL, QUIC sessions, DNS resolution, HttpCache, and NetLog.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| BN01 | URLRequest: creation, delegate pattern, and cancellation | D2 | BF03, CE01 |
| BN02 | HTTP transaction model: HttpNetworkTransaction and HttpStream | D3 | BN01 |
| BN03 | TCP sockets: TCPClientSocket and async I/O with CompletionOnceCallback | D3 | BN01, BF03 |
| BN04 | TLS: SSLClientSocket, BoringSSL handshake, and certificate verification | D3 | BN03 |
| BN05 | QUIC: QuicSession, stream multiplexing, and connection migration | D3 | BN04 |
| BN06 | DNS resolution: HostResolver, DnsTransaction, and DoH | D3 | BN01, BF02 |
| BN07 | HttpCache and DiskCache: caching policy and validation | D3 | BN02 |
| BN08 | NetLog: structured event logging for network debugging | D2 | BN01, BF08 |

**Keywords covered:** `URLRequest`, `URLRequest::Delegate`, `OnResponseStarted`, `OnReadCompleted`, `Cancel()`, `HttpNetworkTransaction`, `HttpStream`, `HttpResponseInfo`, `TCPClientSocket`, `CompletionOnceCallback`, `ERR_IO_PENDING`, `SSLClientSocket`, BoringSSL, X.509 verification, `CertVerifier`, `QuicSession`, stream ID, connection migration, `HostResolver`, `DnsTransaction`, `ResolveHostRequest`, DoH (DNS-over-HTTPS), `HttpCache`, `DiskCache`, cache key, `NetLog`, `NetLogEventType`, `NetLogSource`

#### Scenario: URLRequest entry requires Chromium callbacks and error handling
- **WHEN** a learner has completed BF03 and CE01
- **THEN** BN01 is eligible

#### Scenario: TLS node requires TCP socket knowledge
- **WHEN** a learner completes BN03
- **THEN** BN04 becomes eligible

#### Scenario: QUIC requires TLS knowledge as a foundation
- **WHEN** a learner has not completed BN04
- **THEN** BN05 is not eligible

---

### Requirement: Aura UI Framework track (BA) covers Chrome's desktop UI system
The system SHALL provide an `aura-ui` track with 8 nodes (BA01–BA08) covering views::View hierarchy, layout managers, views::Widget, layer-backed views, input event routing, drag-and-drop, animation, and accessibility in Views.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| BA01 | views::View: layout, painting, and event handling | D2 | BF03, CP04 |
| BA02 | Layout managers: FillLayout, BoxLayout, and TableLayout | D2 | BA01 |
| BA03 | views::Widget: window ownership and NativeWidget plumbing | D3 | BA01, BF04 |
| BA04 | Layer-backed views: ui::Layer and cc::Layer integration | D3 | BA03, BL05 |
| BA05 | Input event routing: EventHandler, EventTarget, and gesture detection | D3 | BA01 |
| BA06 | Drag and drop: DropTargetEvent and DragController | D2 | BA05 |
| BA07 | gfx::Animation and views::AnimationBuilder: implicit animations | D3 | BA04, BF06 |
| BA08 | Accessibility in Views: ViewAccessibility and AXNodeData | D2 | BA01, BL09 |

**Keywords covered:** `views::View`, `OnPaint()`, `Layout()`, `GetPreferredSize()`, `AddChildView()`, `FillLayout`, `BoxLayout`, `BoxLayout::Orientation`, `TableLayout`, `views::Widget`, `Widget::InitParams`, `NativeWidget`, `Widget::Show()`, `ui::Layer`, layer tree, `cc::Layer`, `ui::EventHandler`, `ui::EventTarget`, `GestureEvent`, `DropTargetEvent`, `DragController`, `gfx::Animation`, `AnimationBuilder`, layer animation, `ViewAccessibility`, `AXNodeData`, `AccessibleViewInterface`

#### Scenario: Views entry requires Chromium callbacks and C++ inheritance
- **WHEN** a learner has completed BF03 and CP04
- **THEN** BA01 is eligible

#### Scenario: Layer-backed views require compositor layer knowledge
- **WHEN** a learner has not completed BL05
- **THEN** BA04 is not eligible

#### Scenario: Animation requires both layer and timer knowledge
- **WHEN** a learner has completed BA04 and BF06
- **THEN** BA07 is eligible

---

### Requirement: Process Model & Mojo IPC track (BP) covers Chromium's multi-process architecture
The system SHALL provide a `process-model` track with 7 nodes (BP01–BP07) covering the multi-process architecture, Mojo message pipes, .mojom interface definitions, Remote<T>/Receiver<T>, Content API, sandbox policy, and site isolation.

**Nodes:**

| ID | Title | Depth | Prerequisites |
|----|-------|-------|---------------|
| BP01 | Multi-process architecture: browser, renderer, GPU, and utility processes | D2 | BF01, CC07 |
| BP02 | Mojo message pipes: creating and transferring pipe endpoints | D3 | BF03 |
| BP03 | .mojom interface definitions: generating C++ bindings | D3 | BP02, CT01 |
| BP04 | Remote<T> and Receiver<T>: calling across process boundaries | D3 | BP03 |
| BP05 | Content API: WebContents, RenderFrameHost, and navigation | D3 | BP04, BL01 |
| BP06 | Sandbox policy: syscall filtering and RendererSandboxDelegate | D3 | BP01 |
| BP07 | Site isolation: SiteInstance, process locking, and OOPIF | D3 | BP05 |

**Keywords covered:** `BrowserProcess`, `RenderProcess`, `GpuProcess`, IPC channel, `mojo::MessagePipe`, `mojo::ScopedMessagePipeHandle`, pipe endpoint, `.mojom` file, Mojo IDL, `interface`, `method`, `struct`, code generation, `mojo::Remote<T>`, `mojo::Receiver<T>`, `mojo::PendingRemote`, `mojo::PendingReceiver`, `WebContents`, `WebContentsObserver`, `RenderFrameHost`, `NavigationHandle`, `SandboxDelegate`, seccomp-bpf, pledge, `SiteInstance`, `SiteInfo`, OOPIF, process lock

#### Scenario: Multi-process node requires threading and thread-safe patterns
- **WHEN** a learner has completed BF01 and CC07
- **THEN** BP01 is eligible

#### Scenario: Mojo bindings require Chromium callbacks as foundation
- **WHEN** a learner has not completed BF03
- **THEN** BP02 is not eligible

#### Scenario: mojom code generation requires template knowledge for dispatch
- **WHEN** a learner has completed BP02 and CT01
- **THEN** BP03 is eligible

#### Scenario: Content API requires both Mojo IPC and Blink DOM knowledge
- **WHEN** a learner has completed BP04 and BL01
- **THEN** BP05 is eligible

---

### Requirement: Cross-track prerequisite links from browser curriculum to C++ core resolve
The system SHALL ensure that all prerequisite IDs referenced by browser curriculum nodes (BF, BL, BV, BN, BA, BP) that point to C++ core nodes (CF, CP, CM, CV, CS, CT, CK, CE, CO, CC tracks) resolve in `allCurricula.byId`.

#### Scenario: BF01 prerequisite CC01 resolves
- **WHEN** `allCurricula.byId.get("CC01")` is called
- **THEN** it returns a defined node

#### Scenario: BV01 prerequisites CT01 and CM03 resolve
- **WHEN** `allCurricula.byId.get("CT01")` and `allCurricula.byId.get("CM03")` are called
- **THEN** both return defined nodes

#### Scenario: All browser node prerequisite IDs resolve in allCurricula
- **WHEN** every prerequisite ID of every B-prefixed node is looked up in `allCurricula.byId`
- **THEN** no lookup returns undefined
