import { useRef, useState } from "react";
import styles from "./FeedbackPane.module.css";

export default function FeedbackPane({ attemptUrl, onAttemptStart, onAttemptDone, className }) {
  const [attempts, setAttempts] = useState([]);
  const [running, setRunning] = useState(false);
  const scrollRef = useRef(null);

  function scrollBottom() {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }

  async function runAttempt() {
    if (running) return;
    setRunning(true);
    onAttemptStart?.();

    const attemptEntry = {
      index: attempts.length + 1,
      lines: [],
      testDone: null,
      reviewer: null
    };
    setAttempts((prev) => [...prev, attemptEntry]);

    const url = typeof attemptUrl === "function" ? attemptUrl() : attemptUrl;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      let event;
      try { event = JSON.parse(e.data); } catch { return; }

      setAttempts((prev) => {
        const updated = [...prev];
        const entry = { ...updated[updated.length - 1] };
        if (event.type === "test-output") {
          entry.lines = [...entry.lines, event.line];
        } else if (event.stage === "test-done") {
          entry.testDone = event;
        } else if (event.stage === "reviewer-done") {
          entry.reviewer = event;
        } else if (event.type === "done") {
          // stream closed
        }
        updated[updated.length - 1] = entry;
        return updated;
      });

      if (event.type === "done" || event.type === "error") {
        es.close();
        setRunning(false);
        onAttemptDone?.();
      }
      scrollBottom();
    };

    es.onerror = () => {
      es.close();
      setRunning(false);
    };
  }

  return (
    <div className={[styles.pane, className].join(" ")}>
      <div className={styles.toolbar}>
        <span className={styles.title}>Tests &amp; Feedback</span>
        <button onClick={runAttempt} disabled={running} className={styles.runBtn}>
          {running ? "Running…" : "▶ Run tests"}
        </button>
      </div>

      <div className={styles.output} ref={scrollRef}>
        {attempts.map((a) => (
          <div key={a.index} className={styles.attempt}>
            <div className={styles.attemptHeader}>— Attempt {a.index} —</div>

            {/* Streaming test lines */}
            {a.lines.map((l, i) => (
              <span key={i} className={styles.line}>{l}</span>
            ))}

            {/* Test result badge */}
            {a.testDone && (
              <div className={[styles.badge, a.testDone.ok ? styles.pass : styles.fail].join(" ")}>
                {a.testDone.ok ? "PASS" : "FAIL"} (exit {a.testDone.exitCode})
              </div>
            )}

            {/* Reviewer result */}
            {a.reviewer && (
              <div className={styles.review}>
                <span className={[styles.badge, a.reviewer.passFail === "PASS" ? styles.pass : styles.fail].join(" ")}>
                  Reviewer: {a.reviewer.passFail} (score: {a.reviewer.score})
                </span>
                {a.reviewer.remediation?.reason && (
                  <div className={styles.feedback}>{a.reviewer.remediation.reason}</div>
                )}
              </div>
            )}
          </div>
        ))}

        {attempts.length === 0 && (
          <p className={styles.empty}>Run tests to see output here.</p>
        )}
      </div>
    </div>
  );
}
