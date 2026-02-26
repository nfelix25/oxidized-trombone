import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSSE } from "../hooks/useSSE.js";
import styles from "./Loading.module.css";

const STAGE_LABELS = {
  setup: "Initializing",
  scaffold: "Scaffolding exercise",
  starter: "Generating starter code",
  test: "Generating tests",
  lesson: "Generating lesson",
  workspace: "Writing workspace"
};

function stageLabel(event) {
  const base = STAGE_LABELS[event.stage] ?? event.stage;
  if (event.iteration != null && event.of != null) {
    return `${base} — ${event.iteration} / ${event.of}`;
  }
  return base;
}

export default function Loading() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [showLog, setShowLog] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("Connecting…");
  const logEndRef = useRef(null);

  const { events, status } = useSSE(sessionId ? `/api/sessions/${sessionId}/events` : null);

  // Update current label from latest event
  useEffect(() => {
    if (events.length === 0) return;
    const last = events[events.length - 1];
    if (last.type === "complete") {
      navigate(`/session/${sessionId}`, { replace: true });
      return;
    }
    if (last.type === "error") {
      setCurrentLabel(`Error: ${last.message}`);
      return;
    }
    setCurrentLabel(stageLabel(last));
  }, [events, sessionId, navigate]);

  // Auto-scroll log
  useEffect(() => {
    if (showLog) logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events, showLog]);

  // Fallback polling if SSE disconnects unexpectedly
  useEffect(() => {
    if (status !== "error" && status !== "closed") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        const data = await res.json();
        if (data.workspaceDir) {
          navigate(`/session/${sessionId}`, { replace: true });
        }
      } catch {
        // ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [status, sessionId, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p className={styles.label}>{currentLabel}</p>
        <button className={styles.toggle} onClick={() => setShowLog((v) => !v)}>
          {showLog ? "Hide" : "Show"} log
        </button>
      </div>

      {showLog && (
        <div className={styles.log}>
          {events.map((e, i) => (
            <div key={i} className={styles.logLine}>
              <span className={styles.logTime}>{new Date().toLocaleTimeString()}</span>
              <span>{JSON.stringify(e)}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
