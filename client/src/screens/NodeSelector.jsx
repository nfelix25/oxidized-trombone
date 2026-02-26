import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NodeSelector.module.css";

const LANGUAGES = ["rust", "c", "cpp", "python", "zig", "typescript", "javascript"];
const DEPTH_LABELS = { 0: "D0", 1: "D1", 2: "D2", 3: "D3" };

export default function NodeSelector() {
  const [language, setLanguage] = useState("rust");
  const [provider, setProvider] = useState("codex");
  const [curriculum, setCurriculum] = useState({ nodes: [], tracks: {} });
  const [selected, setSelected] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelected(null);
    fetch(`/api/curriculum?language=${language}`)
      .then((r) => r.json())
      .then(setCurriculum)
      .catch(() => {});
  }, [language]);

  async function startSession(nodeId, lang, customNode = null) {
    setLoading(true);
    try {
      const body = { language: lang, nodeId, provider };
      if (customNode) body.customNode = customNode;
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const { sessionId } = await res.json();
      navigate(`/loading/${sessionId}`);
    } finally {
      setLoading(false);
    }
  }

  function handleCustomSubmit(e) {
    e.preventDefault();
    if (!customTopic.trim()) return;
    const customNode = {
      id: `custom-${Date.now()}`,
      title: customTopic.trim(),
      _custom: true,
      language,
      depthTarget: "D2",
      keywords: [],
      misconceptionTags: []
    };
    startSession(null, language, customNode);
  }

  const nodeMap = Object.fromEntries(curriculum.nodes.map((n) => [n.id, n]));
  const trackEntries = Object.entries(curriculum.tracks);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => navigate("/")} className={styles.back}>← Back</button>
        <h2>Choose a node</h2>
      </header>

      <div className={styles.langPicker}>
        {LANGUAGES.map((l) => (
          <button
            key={l}
            className={l === language ? styles.langActive : styles.langBtn}
            onClick={() => setLanguage(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className={styles.providerPicker}>
        <span className={styles.providerLabel}>AI provider:</span>
        {["codex", "claude"].map((p) => (
          <button
            key={p}
            className={p === provider ? styles.langActive : styles.langBtn}
            onClick={() => setProvider(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.tracks}>
          {trackEntries.map(([trackId, track]) => (
            <div key={trackId} className={styles.track}>
              <div className={styles.trackTitle}>{track.title ?? trackId}</div>
              {track.nodeIds.map((id) => {
                const node = nodeMap[id];
                if (!node) return null;
                const mastery = node.mastery ?? 0;
                return (
                  <div
                    key={id}
                    className={[
                      styles.node,
                      selected === id ? styles.nodeSelected : ""
                    ].join(" ")}
                    onClick={() => setSelected(id)}
                  >
                    <span className={styles.nodeId}>{id}</span>
                    <span className={styles.nodeTitle}>{node.title}</span>
                    <span className={styles.badge}>{DEPTH_LABELS[mastery] ?? "D0"}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <aside className={styles.sidebar}>
          {selected && nodeMap[selected] && (
            <div className={styles.detail}>
              <div className={styles.detailId}>{selected}</div>
              <div className={styles.detailTitle}>{nodeMap[selected].title}</div>
              <button
                className={styles.startBtn}
                disabled={loading}
                onClick={() => startSession(selected, language)}
              >
                {loading ? "Starting…" : "Start session"}
              </button>
            </div>
          )}

          <form className={styles.customForm} onSubmit={handleCustomSubmit}>
            <label>Custom topic</label>
            <input
              type="text"
              placeholder="e.g. Rust trait objects"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
            />
            <button type="submit" disabled={!customTopic.trim() || loading}>
              Start custom session
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
