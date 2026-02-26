import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../hooks/useSession.js";
import { useWorkspace } from "../hooks/useWorkspace.js";
import LessonPane from "../components/LessonPane.jsx";
import EditorPane from "../components/EditorPane.jsx";
import FeedbackPane from "../components/FeedbackPane.jsx";
import CoachPanel from "../components/CoachPanel.jsx";
import styles from "./Exercise.module.css";

// layout modes: "reading" (lesson/editor split) | "coding" (editor full) | "reviewing" (feedback expanded)
function useLayout(initial = "reading") {
  const [mode, setMode] = useState(initial);
  return { mode, setMode };
}

export default function Exercise() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { session, loading, refresh, attempt, hint, end } = useSession(sessionId);
  const workspace = useWorkspace(sessionId);
  const { mode, setMode } = useLayout("reading");
  const [summary, setSummary] = useState(null);
  const [coachOpen, setCoachOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    function handler(e) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "r") { e.preventDefault(); setMode("reviewing"); }
      if (mod && e.key === "h") { e.preventDefault(); setCoachOpen((v) => !v); }
      if (e.key === "Escape") setMode((m) => m === "coding" ? "reading" : "coding");
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setMode]);

  async function handleEnd() {
    const result = await end();
    setSummary(result);
  }

  if (loading) return <div className={styles.loading}>Loading session…</div>;
  if (!session) return <div className={styles.loading}>Session not found.</div>;

  if (summary) {
    return <SessionSummary summary={summary} navigate={navigate} />;
  }

  const attemptCount = session.attemptState?.attemptIndex ?? 0;
  const hintLevel = session.attemptState?.hintLevelUsed ?? 0;

  return (
    <div className={styles.page}>
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.nodeId}>{session.nodeId ?? "custom"}</span>
        <span className={styles.lang}>{session.language}</span>
        <span className={styles.depth}>{session.depthTarget ?? "D2"}</span>
        <span className={styles.stat}>provider: {session.provider ?? "codex"}</span>
        <span className={styles.stat}>attempts: {attemptCount}</span>
        <span className={styles.stat}>hints: L{hintLevel}</span>
        <span className={styles.save}>{workspace.saveState}</span>
        <div className={styles.statusActions}>
          <button onClick={() => setCoachOpen((v) => !v)}>
            {coachOpen ? "Hide coach" : "Coach"}
          </button>
          <button onClick={handleEnd}>End session</button>
        </div>
      </div>

      {/* Main pane layout */}
      <div
        className={[
          styles.panes,
          mode === "coding" ? styles.coding : "",
          mode === "reviewing" ? styles.reviewing : ""
        ].join(" ")}
      >
        {mode !== "coding" && (
          <LessonPane
            sessionId={sessionId}
            onCollapse={() => setMode("coding")}
            className={styles.lessonPane}
          />
        )}
        <EditorPane
          workspace={workspace}
          onExpand={() => setMode(mode === "coding" ? "reading" : "coding")}
          className={styles.editorPane}
        />
        <FeedbackPane
          sessionId={sessionId}
          attemptUrl={attempt}
          onAttemptStart={() => setMode("reviewing")}
          onAttemptDone={refresh}
          className={styles.feedbackPane}
        />
      </div>

      {coachOpen && (
        <CoachPanel
          hint={hint}
          hintLevel={hintLevel}
          lastHintPack={session.lastHintPack}
          onClose={() => setCoachOpen(false)}
        />
      )}
    </div>
  );
}

function SessionSummary({ summary, navigate }) {
  const { session, recommendations } = summary;
  const attempts = session.attemptState?.attemptIndex ?? 0;
  const finalScore = session.attemptState?.latestReview?.score ?? "—";
  return (
    <div className={styles.summaryPage}>
      <h2>Session complete</h2>
      <p>Attempts: {attempts}</p>
      <p>Final score: {finalScore}</p>
      {recommendations?.length > 0 && (
        <div>
          <p>Recommended next nodes:</p>
          <ul>
            {recommendations.map((r) => (
              <li key={r.nodeId ?? r}>{r.nodeId ?? r}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate("/select")}>Start new session</button>
    </div>
  );
}
