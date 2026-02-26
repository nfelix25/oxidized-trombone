import { useState } from "react";
import styles from "./CoachPanel.module.css";

export default function CoachPanel({ hint, hintLevel, onClose }) {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestHint(msg = null) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await hint(msg || null);
      setHistory((prev) => [...prev, result]);
      setMessage("");
    } catch (e) {
      setHistory((prev) => [...prev, { level: hintLevel, text: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  const isExhausted = hintLevel >= 3;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Coach</span>
        <span className={styles.level}>Hint L{hintLevel}/3</span>
        <button className={styles.close} onClick={onClose}>×</button>
      </div>

      <div className={styles.history}>
        {history.length === 0 && (
          <p className={styles.empty}>Request a hint or ask a specific question.</p>
        )}
        {history.map((h, i) => (
          <div key={i} className={styles.hintEntry}>
            <span className={styles.hintLevel}>L{h.level}</span>
            <p className={styles.hintText}>{h.text}</p>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        {isExhausted ? (
          <p className={styles.exhausted}>Hint ladder exhausted (L3 reached)</p>
        ) : (
          <button
            className={styles.hintBtn}
            onClick={() => requestHint()}
            disabled={loading}
          >
            {loading ? "…" : `Request hint (L${hintLevel + 1})`}
          </button>
        )}

        <div className={styles.askRow}>
          <textarea
            rows={2}
            placeholder="Ask a specific question…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (message.trim()) requestHint(message.trim());
              }
            }}
          />
          <button
            onClick={() => requestHint(message.trim())}
            disabled={!message.trim() || loading}
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
