import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>oxidized-trombone</h1>
        <button onClick={() => navigate("/select")}>+ New session</button>
      </header>

      <main className={styles.main}>
        {loading && <p className={styles.muted}>Loading sessions…</p>}
        {!loading && sessions.length === 0 && (
          <p className={styles.muted}>No sessions yet. Start one above.</p>
        )}
        {sessions.map((s) => (
          <div
            key={s.id}
            className={styles.row}
            onClick={() => navigate(`/session/${s.id}`)}
          >
            <span className={styles.node}>{s.nodeId ?? "(custom)"}</span>
            <span className={styles.lang}>{s.language}</span>
            <span className={styles.date}>
              {new Date(s.lastAccessedAt ?? s.startedAt).toLocaleString()}
            </span>
            {!s.workspaceExists && (
              <span className={styles.missing} title="Workspace missing on disk">!</span>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
