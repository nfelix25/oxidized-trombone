import { createCurriculumGraph, createNode } from "./model.js";

// ---------------------------------------------------------------------------
// BF: Chromium Foundations (base library, threading, Mojo)
// Entry: BF01 — prereq CC01 (std::thread) from C++ core
// ---------------------------------------------------------------------------
const chromiumFoundationsNodes = [
  createNode({
    id: "BF01",
    title: "base::Thread and MessageLoop: Chromium's thread abstraction",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D2",
    prerequisites: ["CC01"],
    keywords: ["base::Thread", "MessageLoop", "MessagePumpType", "thread name", "task runner", "IO thread", "thread lifecycle", "Start()", "Stop()"],
    misconceptionTags: ["chromium.base_thread_vs_std_thread", "chromium.message_loop_vs_event_loop"]
  }),
  createNode({
    id: "BF02",
    title: "Task runners: PostTask, SequencedTaskRunner, and thread affinity",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D2",
    prerequisites: ["BF01"],
    keywords: ["SequencedTaskRunner", "SingleThreadTaskRunner", "PostTask", "PostDelayedTask", "thread affinity", "DCHECK_CALLED_ON_VALID_SEQUENCE", "task runner handle"],
    misconceptionTags: ["chromium.sequenced_vs_single_thread", "chromium.task_runner_lifetime"]
  }),
  createNode({
    id: "BF03",
    title: "base::BindOnce and base::BindRepeating: callback ownership model",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D3",
    prerequisites: ["BF02", "CV02"],
    keywords: ["base::BindOnce", "base::BindRepeating", "base::Callback", "base::OnceClosure", "base::Passed", "base::Unretained", "closure", "callback ownership", "move-only callback"],
    misconceptionTags: ["chromium.bind_once_vs_repeating", "chromium.unretained_lifetime_hazard", "chromium.passed_vs_owned"]
  }),
  createNode({
    id: "BF04",
    title: "scoped_refptr and base::RefCounted: intrusive reference counting",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D2",
    prerequisites: ["BF01", "CM04"],
    keywords: ["scoped_refptr", "base::RefCounted", "base::RefCountedThreadSafe", "AddRef", "Release", "intrusive ref count", "adopt ref", "make_scoped_refptr"],
    misconceptionTags: ["chromium.scoped_refptr_vs_shared_ptr", "chromium.ref_counted_thread_safety"]
  }),
  createNode({
    id: "BF05",
    title: "base::WeakPtr and WeakPtrFactory: safe cross-thread callbacks",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D3",
    prerequisites: ["BF04"],
    keywords: ["base::WeakPtr", "base::WeakPtrFactory", "GetWeakPtr", "invalidation", "use-after-free prevention", "cross-thread weak ptr", "WeakPtr<T>"],
    misconceptionTags: ["chromium.weak_ptr_thread_safe", "chromium.weak_ptr_vs_raw_ptr", "chromium.factory_lifetime"]
  }),
  createNode({
    id: "BF06",
    title: "base::Timer: one-shot, repeating, and OneShotTimer patterns",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D2",
    prerequisites: ["BF02"],
    keywords: ["base::OneShotTimer", "base::RepeatingTimer", "base::RetainingOneShotTimer", "Start()", "Stop()", "Reset()", "timer callback", "delayed task"],
    misconceptionTags: ["chromium.timer_vs_post_delayed_task", "chromium.timer_restart_semantics"]
  }),
  createNode({
    id: "BF07",
    title: "DCHECK, CHECK, and base::debug: Chromium assertion conventions",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D1",
    prerequisites: ["BF01"],
    keywords: ["DCHECK", "CHECK", "NOTREACHED", "DCHECK_EQ", "CHECK_NE", "DCHECK_CALLED_ON_VALID_SEQUENCE", "base::debug::StackTrace", "crash key"],
    misconceptionTags: ["chromium.dcheck_vs_check", "chromium.dcheck_release_strip", "chromium.notreached_semantics"]
  }),
  createNode({
    id: "BF08",
    title: "base::trace_event: TRACE_EVENT macros and tracing infrastructure",
    language: "cpp",
    track: "chromium-foundations",
    depthTarget: "D2",
    prerequisites: ["BF02"],
    keywords: ["TRACE_EVENT0", "TRACE_EVENT1", "TRACE_EVENT_ASYNC_BEGIN0", "TRACE_EVENT_ASYNC_END0", "trace category", "trace argument", "perfetto", "chrome://tracing", "TraceLog"],
    misconceptionTags: ["chromium.trace_event_overhead", "chromium.trace_category_enable", "chromium.async_trace_id"]
  })
];

// ---------------------------------------------------------------------------
// BL: Blink Rendering (DOM → layout → paint → compositor)
// Entry: BL01 — prereqs BF01, CP04
// ---------------------------------------------------------------------------
const blinkRenderingNodes = [
  createNode({
    id: "BL01",
    title: "DOM tree: Node, Element, and Document hierarchy in Blink",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D2",
    prerequisites: ["BF01", "CP04"],
    keywords: ["Node", "Element", "Document", "NodeType", "ContainerNode", "TreeScope", "shadow DOM", "flat tree", "NodeTraversal", "ElementTraversal"],
    misconceptionTags: ["blink.dom_node_vs_layout_object", "blink.shadow_root_composition", "blink.tree_scope_vs_document"]
  }),
  createNode({
    id: "BL02",
    title: "Layout objects: LayoutObject tree and box model mapping",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D3",
    prerequisites: ["BL01"],
    keywords: ["LayoutObject", "LayoutBox", "LayoutBlockFlow", "LayoutInline", "anonymous box", "containment", "PhysicalBoxFragment", "fragmentation", "intrinsic size"],
    misconceptionTags: ["blink.layout_object_vs_dom_node", "blink.anonymous_box_creation", "blink.fragmentation_context"]
  }),
  createNode({
    id: "BL03",
    title: "Style resolution: StyleResolver, ComputedStyle, and cascade",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D3",
    prerequisites: ["BL01", "CT02"],
    keywords: ["StyleResolver", "ComputedStyle", "cascade", "specificity", "inheritance", "CSS property", "style recalc", "matching rules", "StyleEngine"],
    misconceptionTags: ["blink.computed_vs_used_style", "blink.style_recalc_scope", "blink.cascade_layers"]
  }),
  createNode({
    id: "BL04",
    title: "PaintLayer and GraphicsContext: recording paint operations",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D3",
    prerequisites: ["BL02"],
    keywords: ["PaintLayer", "GraphicsContext", "DisplayItem", "DisplayItemList", "paint invalidation", "PaintController", "Skia", "SkCanvas", "paint phase"],
    misconceptionTags: ["blink.paint_vs_raster", "blink.paint_invalidation_scope", "blink.display_list_recording"]
  }),
  createNode({
    id: "BL05",
    title: "cc::Layer and the compositor layer tree",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D3",
    prerequisites: ["BL04", "BF02"],
    keywords: ["cc::Layer", "cc::PictureLayer", "LayerTreeHost", "cc::LayerImpl", "compositing reasons", "will-change", "layer promotion", "tile manager", "raster worker"],
    misconceptionTags: ["blink.layer_vs_paint_layer", "chromium.compositor_thread_ownership", "blink.compositing_triggers"]
  }),
  createNode({
    id: "BL06",
    title: "Rendering pipeline: BeginMainFrame, commit, activation, and draw",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D3",
    prerequisites: ["BL05"],
    keywords: ["BeginMainFrame", "commit", "activation", "draw", "vsync", "frame budget", "impl thread", "main thread", "LayerTreeHostImpl", "scheduler"],
    misconceptionTags: ["blink.commit_vs_activation", "blink.impl_side_painting", "chromium.frame_pipeline_stages"]
  }),
  createNode({
    id: "BL07",
    title: "WebIDL bindings: exposing C++ objects to JavaScript in Blink",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D3",
    prerequisites: ["BL01", "BV03"],
    keywords: ["WebIDL", "IDL file", "bindings generator", "Exposed=Window", "ExceptionState", "ScriptWrappable", "V8DOMWrapper", "DOMDataStore", "wrapper object"],
    misconceptionTags: ["blink.webidl_vs_v8_template", "blink.script_wrappable_lifetime", "blink.idl_attribute_types"]
  }),
  createNode({
    id: "BL08",
    title: "Hit testing: LayoutObject::NodeAtPoint and pointer event routing",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D2",
    prerequisites: ["BL02"],
    keywords: ["HitTestRequest", "HitTestResult", "NodeAtPoint", "hit test phase", "pointer-events", "event target", "composited hit test", "HitTestLocation"],
    misconceptionTags: ["blink.hit_test_vs_event_dispatch", "blink.pointer_events_none", "blink.composited_hit_testing"]
  }),
  createNode({
    id: "BL09",
    title: "Accessibility tree: AXObject hierarchy and ARIA mapping",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D2",
    prerequisites: ["BL01"],
    keywords: ["AXObject", "AXObjectCache", "AXNodeData", "ARIA role", "accessible name", "AXTreeID", "AXPlatformNode", "accessibility tree update"],
    misconceptionTags: ["blink.ax_object_vs_dom_node", "blink.aria_vs_html_semantics", "blink.ax_tree_serialization"]
  }),
  createNode({
    id: "BL10",
    title: "HTMLMediaElement and WebMediaPlayer: media pipeline plumbing",
    language: "cpp",
    track: "blink-rendering",
    depthTarget: "D3",
    prerequisites: ["BL01", "BF04"],
    keywords: ["HTMLMediaElement", "WebMediaPlayer", "MediaSource", "MediaStream", "readyState", "load algorithm", "media pipeline", "VideoFrame", "AudioRenderer"],
    misconceptionTags: ["blink.media_element_vs_web_player", "blink.media_load_algorithm", "blink.mse_vs_src_attribute"]
  })
];

// ---------------------------------------------------------------------------
// BV: V8 API Embedding (Isolates, Handles, Templates)
// Entry: BV01 — prereqs CT01, CM03
// ---------------------------------------------------------------------------
const v8EmbeddingNodes = [
  createNode({
    id: "BV01",
    title: "Isolate and Context lifecycle: initialization and scope",
    language: "cpp",
    track: "v8-embedding",
    depthTarget: "D2",
    prerequisites: ["CT01", "CM03"],
    keywords: ["v8::Isolate", "v8::Context", "Isolate::CreateParams", "ArrayBuffer::Allocator", "Locker", "Unlocker", "context scope", "isolate scope", "microtask policy"],
    misconceptionTags: ["v8.isolate_vs_context", "v8.context_vs_realm", "v8.locker_single_thread"]
  }),
  createNode({
    id: "BV02",
    title: "Handle scopes: v8::Local, v8::Persistent, and v8::Global",
    language: "cpp",
    track: "v8-embedding",
    depthTarget: "D3",
    prerequisites: ["BV01"],
    keywords: ["v8::Local<T>", "v8::Persistent<T>", "v8::Global<T>", "v8::HandleScope", "v8::EscapableHandleScope", "handle lifetime", "GC root", "MakeWeak", "handle invalidation"],
    misconceptionTags: ["v8.local_vs_persistent", "v8.handle_scope_stack", "v8.persistent_reset"]
  }),
  createNode({
    id: "BV03",
    title: "Creating JS values from C++: String, Object, Array, and Number",
    language: "cpp",
    track: "v8-embedding",
    depthTarget: "D2",
    prerequisites: ["BV02"],
    keywords: ["v8::String::NewFromUtf8", "v8::Object::New", "v8::Array::New", "v8::Number::New", "v8::Boolean::New", "v8::Null", "v8::Undefined", "v8::Value", "v8::Name"],
    misconceptionTags: ["v8.string_encoding", "v8.value_type_check", "v8.null_vs_undefined_cpp"]
  }),
  createNode({
    id: "BV04",
    title: "FunctionCallbackInfo and ReturnValue: implementing native functions",
    language: "cpp",
    track: "v8-embedding",
    depthTarget: "D3",
    prerequisites: ["BV03"],
    keywords: ["v8::FunctionCallback", "v8::FunctionCallbackInfo<v8::Value>", "info.Length()", "info[0]", "info.GetReturnValue().Set()", "info.This()", "info.Data()", "native function"],
    misconceptionTags: ["v8.callback_return_value", "v8.callback_info_this", "v8.callback_argument_count"]
  }),
  createNode({
    id: "BV05",
    title: "ObjectTemplate and FunctionTemplate: defining JS class bindings",
    language: "cpp",
    track: "v8-embedding",
    depthTarget: "D3",
    prerequisites: ["BV04", "CT02"],
    keywords: ["v8::ObjectTemplate", "v8::FunctionTemplate", "InstanceTemplate()", "PrototypeTemplate()", "SetAccessor", "SetNativeDataProperty", "NewInstance", "GetFunction", "internal field"],
    misconceptionTags: ["v8.object_vs_function_template", "v8.instance_vs_prototype_template", "v8.internal_field_count"]
  }),
  createNode({
    id: "BV06",
    title: "TryCatch and exception propagation across the C++/JS boundary",
    language: "cpp",
    track: "v8-embedding",
    depthTarget: "D3",
    prerequisites: ["BV03", "CE01"],
    keywords: ["v8::TryCatch", "HasCaught()", "Exception()", "Message()", "ThrowException", "v8::Exception::Error", "stack trace", "rethrow", "StackTrace::CurrentStackTrace"],
    misconceptionTags: ["v8.try_catch_scope", "v8.exception_vs_cpp_throw", "v8.rethrow_vs_reset"]
  }),
  createNode({
    id: "BV07",
    title: "V8 snapshots and startup performance",
    language: "cpp",
    track: "v8-embedding",
    depthTarget: "D3",
    prerequisites: ["BV05"],
    keywords: ["v8::SnapshotCreator", "StartupData", "blob serialization", "embedded blob", "snapshot warm-up", "custom snapshot", "deserialize context", "V8::CreateSnapshotDataBlob"],
    misconceptionTags: ["v8.snapshot_vs_cache", "v8.snapshot_context_inclusion", "v8.blob_size_tradeoff"]
  })
];

// ---------------------------------------------------------------------------
// BN: Network Stack (URLRequest → HTTP → TLS → QUIC)
// Entry: BN01 — prereqs BF03, CE01
// ---------------------------------------------------------------------------
const networkStackNodes = [
  createNode({
    id: "BN01",
    title: "URLRequest: creation, delegate pattern, and cancellation",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D2",
    prerequisites: ["BF03", "CE01"],
    keywords: ["URLRequest", "URLRequest::Delegate", "OnResponseStarted", "OnReadCompleted", "Cancel()", "NetworkDelegate", "URLRequestContext", "URLRequestContextBuilder", "net::Error"],
    misconceptionTags: ["chromium.url_request_lifetime", "chromium.delegate_vs_callback", "chromium.cancel_vs_abort"]
  }),
  createNode({
    id: "BN02",
    title: "HTTP transaction model: HttpNetworkTransaction and HttpStream",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D3",
    prerequisites: ["BN01"],
    keywords: ["HttpNetworkTransaction", "HttpStream", "HttpResponseInfo", "HttpRequestInfo", "HttpNetworkSession", "HttpServerProperties", "SPDY", "HTTP/2 stream", "request headers"],
    misconceptionTags: ["chromium.http_transaction_reuse", "chromium.stream_vs_connection", "chromium.http2_multiplexing"]
  }),
  createNode({
    id: "BN03",
    title: "TCP sockets: TCPClientSocket and async I/O with CompletionOnceCallback",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D3",
    prerequisites: ["BN01", "BF03"],
    keywords: ["TCPClientSocket", "CompletionOnceCallback", "ERR_IO_PENDING", "Connect()", "Read()", "Write()", "IOBuffer", "DrainableIOBuffer", "net::OK"],
    misconceptionTags: ["chromium.completion_callback_threading", "chromium.err_io_pending_async", "chromium.io_buffer_lifetime"]
  }),
  createNode({
    id: "BN04",
    title: "TLS: SSLClientSocket, BoringSSL handshake, and certificate verification",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D3",
    prerequisites: ["BN03"],
    keywords: ["SSLClientSocket", "SSLInfo", "SSLConfig", "CertVerifier", "X509Certificate", "BoringSSL", "TLS handshake", "certificate chain", "OCSP stapling", "CT log"],
    misconceptionTags: ["chromium.ssl_vs_tls_naming", "chromium.cert_verification_async", "chromium.ct_policy"]
  }),
  createNode({
    id: "BN05",
    title: "QUIC: QuicSession, stream multiplexing, and connection migration",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D3",
    prerequisites: ["BN04"],
    keywords: ["QuicSession", "QuicStream", "QuicConnection", "stream ID", "connection migration", "0-RTT", "QUIC crypto", "HttpStreamPool", "QUIC ALPN"],
    misconceptionTags: ["chromium.quic_vs_tcp_head_of_line", "chromium.quic_migration_trigger", "chromium.quic_0rtt_replay"]
  }),
  createNode({
    id: "BN06",
    title: "DNS resolution: HostResolver, DnsTransaction, and DoH",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D3",
    prerequisites: ["BN01", "BF02"],
    keywords: ["HostResolver", "ResolveHostRequest", "DnsTransaction", "DnsResponse", "DoH", "DNS-over-HTTPS", "HostCache", "HostResolverManager", "AddressFamily"],
    misconceptionTags: ["chromium.host_resolver_cache", "chromium.doh_vs_dot", "chromium.dns_secure_mode"]
  }),
  createNode({
    id: "BN07",
    title: "HttpCache and DiskCache: caching policy and validation",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D3",
    prerequisites: ["BN02"],
    keywords: ["HttpCache", "DiskCache", "HttpCacheTransaction", "cache key", "cache entry", "conditional request", "ETag", "Last-Modified", "Cache-Control", "vary header"],
    misconceptionTags: ["chromium.cache_validation_vs_reload", "chromium.disk_cache_backend", "chromium.vary_header_cache_key"]
  }),
  createNode({
    id: "BN08",
    title: "NetLog: structured event logging for network debugging",
    language: "cpp",
    track: "network-stack",
    depthTarget: "D2",
    prerequisites: ["BN01", "BF08"],
    keywords: ["NetLog", "NetLogEventType", "NetLogSource", "NetLogEntry", "NetLogWithSource", "net-internals", "NetLogCaptureMode", "BIND_SOURCE", "net log observer"],
    misconceptionTags: ["chromium.netlog_performance_impact", "chromium.net_log_capture_mode", "chromium.source_vs_event_id"]
  })
];

// ---------------------------------------------------------------------------
// BA: Aura UI Framework (Views, layers, input, animation)
// Entry: BA01 — prereqs BF03, CP04
// ---------------------------------------------------------------------------
const auraUiNodes = [
  createNode({
    id: "BA01",
    title: "views::View: layout, painting, and event handling",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D2",
    prerequisites: ["BF03", "CP04"],
    keywords: ["views::View", "OnPaint()", "Layout()", "GetPreferredSize()", "AddChildView()", "RemoveChildView()", "SchedulePaint()", "bounds", "visible", "gfx::Rect"],
    misconceptionTags: ["views.view_vs_widget", "views.layout_vs_paint_order", "views.preferred_size_override"]
  }),
  createNode({
    id: "BA02",
    title: "Layout managers: FillLayout, BoxLayout, and TableLayout",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D2",
    prerequisites: ["BA01"],
    keywords: ["FillLayout", "BoxLayout", "BoxLayout::Orientation::kHorizontal", "TableLayout", "FlexLayout", "SetLayoutManager", "LayoutManager", "LayoutInvalidated"],
    misconceptionTags: ["views.layout_manager_vs_manual", "views.fill_layout_single_child", "views.flex_rule"]
  }),
  createNode({
    id: "BA03",
    title: "views::Widget: window ownership and NativeWidget plumbing",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D3",
    prerequisites: ["BA01", "BF04"],
    keywords: ["views::Widget", "Widget::InitParams", "NativeWidget", "WidgetDelegate", "Widget::Show()", "Widget::Close()", "widget ownership", "TYPE_WINDOW", "TYPE_POPUP"],
    misconceptionTags: ["views.widget_vs_view", "views.widget_ownership", "views.native_widget_platform"]
  }),
  createNode({
    id: "BA04",
    title: "Layer-backed views: ui::Layer and cc::Layer integration",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D3",
    prerequisites: ["BA03", "BL05"],
    keywords: ["ui::Layer", "cc::Layer", "SetPaintToLayer()", "layer bounds", "layer transform", "layer opacity", "layer compositor", "viz::SurfaceId", "DirectRenderer"],
    misconceptionTags: ["views.layer_backed_vs_not", "views.layer_transform_vs_bounds", "chromium.ui_layer_vs_cc_layer"]
  }),
  createNode({
    id: "BA05",
    title: "Input event routing: EventHandler, EventTarget, and gesture detection",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D3",
    prerequisites: ["BA01"],
    keywords: ["ui::EventHandler", "ui::EventTarget", "ui::Event", "ui::MouseEvent", "ui::KeyEvent", "ui::GestureEvent", "OnMousePressed()", "EventProcessor", "aura::Window"],
    misconceptionTags: ["views.event_handler_vs_listener", "aura.event_target_chain", "views.gesture_vs_mouse"]
  }),
  createNode({
    id: "BA06",
    title: "Drag and drop: DropTargetEvent and DragController",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D2",
    prerequisites: ["BA05"],
    keywords: ["ui::DropTargetEvent", "aura::client::DragDropDelegate", "OSExchangeData", "DragOperation", "GetDropFormats()", "OnDragEntered()", "OnPerformDrop()", "DragController"],
    misconceptionTags: ["views.drag_drop_vs_clipboard", "views.drop_formats_registration", "aura.drag_image_source"]
  }),
  createNode({
    id: "BA07",
    title: "gfx::Animation and views::AnimationBuilder: implicit animations",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D3",
    prerequisites: ["BA04", "BF06"],
    keywords: ["gfx::LinearAnimation", "gfx::SlideAnimation", "views::AnimationBuilder", "ui::LayerAnimator", "ui::LayerAnimationElement", "Tween", "AnimationDelegate", "SetAnimator()"],
    misconceptionTags: ["views.animation_vs_transition", "chromium.layer_animator_threading", "views.tween_type_selection"]
  }),
  createNode({
    id: "BA08",
    title: "Accessibility in Views: ViewAccessibility and AXNodeData",
    language: "cpp",
    track: "aura-ui",
    depthTarget: "D2",
    prerequisites: ["BA01", "BL09"],
    keywords: ["ViewAccessibility", "AXNodeData", "AccessibleViewInterface", "GetAccessibleNodeData()", "ax::mojom::Role", "AccessibleName()", "NotifyAccessibilityEvent()", "AXEventGenerator"],
    misconceptionTags: ["views.ax_node_vs_ax_object", "views.accessible_name_sources", "views.focus_vs_accessibility"]
  })
];

// ---------------------------------------------------------------------------
// BP: Process Model & Mojo IPC (multi-process, sandbox, site isolation)
// Entry: BP01 — prereqs BF01, CC07
// ---------------------------------------------------------------------------
const processModelNodes = [
  createNode({
    id: "BP01",
    title: "Multi-process architecture: browser, renderer, GPU, and utility processes",
    language: "cpp",
    track: "process-model",
    depthTarget: "D2",
    prerequisites: ["BF01", "CC07"],
    keywords: ["BrowserProcess", "RenderProcess", "GpuProcess", "UtilityProcess", "process type", "child process", "zygote", "launch process", "process lifetime", "chrome.exe"],
    misconceptionTags: ["chromium.process_model_one_per_tab", "chromium.renderer_trusted", "chromium.gpu_process_purpose"]
  }),
  createNode({
    id: "BP02",
    title: "Mojo message pipes: creating and transferring pipe endpoints",
    language: "cpp",
    track: "process-model",
    depthTarget: "D3",
    prerequisites: ["BF03"],
    keywords: ["mojo::MessagePipe", "mojo::ScopedMessagePipeHandle", "mojo::CreateMessagePipe", "pipe endpoint", "message queue", "cross-process pipe", "MojoHandle", "MojoWriteMessage", "MojoReadMessage"],
    misconceptionTags: ["mojo.pipe_vs_channel", "mojo.endpoint_transfer", "mojo.buffer_vs_message"]
  }),
  createNode({
    id: "BP03",
    title: ".mojom interface definitions: generating C++ bindings",
    language: "cpp",
    track: "process-model",
    depthTarget: "D3",
    prerequisites: ["BP02", "CT01"],
    keywords: [".mojom file", "Mojo IDL", "interface", "method", "struct", "union", "pending_remote", "pending_receiver", "mojom codegen", "Associated interface"],
    misconceptionTags: ["mojo.mojom_vs_idl", "mojo.associated_vs_non_associated", "mojo.sync_vs_async_method"]
  }),
  createNode({
    id: "BP04",
    title: "Remote<T> and Receiver<T>: calling across process boundaries",
    language: "cpp",
    track: "process-model",
    depthTarget: "D3",
    prerequisites: ["BP03"],
    keywords: ["mojo::Remote<T>", "mojo::Receiver<T>", "mojo::PendingRemote<T>", "mojo::PendingReceiver<T>", "BindNewPipeAndPassReceiver", "FlushForTesting", "ResetWithReason", "disconnect handler"],
    misconceptionTags: ["mojo.remote_vs_receiver_ownership", "mojo.pending_vs_bound", "mojo.flush_vs_run_loop"]
  }),
  createNode({
    id: "BP05",
    title: "Content API: WebContents, RenderFrameHost, and navigation",
    language: "cpp",
    track: "process-model",
    depthTarget: "D3",
    prerequisites: ["BP04", "BL01"],
    keywords: ["WebContents", "WebContentsObserver", "WebContentsDelegate", "RenderFrameHost", "NavigationHandle", "NavigationController", "FrameTreeNode", "LoadURL()", "DidFinishNavigation"],
    misconceptionTags: ["content.webcontents_vs_tab", "content.rfh_lifetime", "content.committed_vs_started"]
  }),
  createNode({
    id: "BP06",
    title: "Sandbox policy: syscall filtering and RendererSandboxDelegate",
    language: "cpp",
    track: "process-model",
    depthTarget: "D3",
    prerequisites: ["BP01"],
    keywords: ["sandbox policy", "seccomp-bpf", "RendererSandboxDelegate", "SandboxType", "broker", "syscall filter", "pledge (macOS sandbox)", "entitlement", "sandbox profile"],
    misconceptionTags: ["chromium.sandbox_vs_site_isolation", "chromium.macOS_sandbox_profile", "chromium.broker_process"]
  }),
  createNode({
    id: "BP07",
    title: "Site isolation: SiteInstance, process locking, and OOPIF",
    language: "cpp",
    track: "process-model",
    depthTarget: "D3",
    prerequisites: ["BP05"],
    keywords: ["SiteInstance", "SiteInfo", "process lock", "OOPIF", "out-of-process iframe", "cross-origin", "BrowsingInstance", "WebExposedIsolationInfo", "OriginAgentCluster"],
    misconceptionTags: ["chromium.site_vs_origin_isolation", "chromium.oopif_vs_same_process", "chromium.browsing_instance_scope"]
  })
];

// ---------------------------------------------------------------------------
// Graph assembly
// ---------------------------------------------------------------------------
const nodes = [
  ...chromiumFoundationsNodes,
  ...blinkRenderingNodes,
  ...v8EmbeddingNodes,
  ...networkStackNodes,
  ...auraUiNodes,
  ...processModelNodes
];

const tracks = {
  "chromium-foundations": {
    id: "chromium-foundations",
    title: "Chromium Foundations",
    nodeIds: chromiumFoundationsNodes.map((n) => n.id)
  },
  "blink-rendering": {
    id: "blink-rendering",
    title: "Blink Rendering",
    nodeIds: blinkRenderingNodes.map((n) => n.id)
  },
  "v8-embedding": {
    id: "v8-embedding",
    title: "V8 API Embedding",
    nodeIds: v8EmbeddingNodes.map((n) => n.id)
  },
  "network-stack": {
    id: "network-stack",
    title: "Network Stack",
    nodeIds: networkStackNodes.map((n) => n.id)
  },
  "aura-ui": {
    id: "aura-ui",
    title: "Aura UI Framework",
    nodeIds: auraUiNodes.map((n) => n.id)
  },
  "process-model": {
    id: "process-model",
    title: "Process Model and Mojo IPC",
    nodeIds: processModelNodes.map((n) => n.id)
  }
};

export const browserCurriculum = createCurriculumGraph(nodes, tracks);
