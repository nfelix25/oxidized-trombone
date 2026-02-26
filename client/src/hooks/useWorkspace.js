import { useCallback, useEffect, useRef, useState } from "react";

const AUTOSAVE_DELAY_MS = 800;

/**
 * Manages workspace files for a session.
 * - Fetches file list from GET /api/sessions/:id/workspace
 * - Reads files on demand from GET /api/sessions/:id/workspace/*filepath
 * - Debounced auto-save via PUT /api/sessions/:id/workspace/*filepath
 */
export function useWorkspace(sessionId) {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState("saved"); // "saved" | "saving" | "dirty"
  const saveTimerRef = useRef(null);

  // Load file list
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions/${sessionId}/workspace`)
      .then((r) => r.json())
      .then(({ files: list }) => {
        setFiles(list ?? []);
        if (list?.length > 0 && !activeFile) setActiveFile(list[0]);
      })
      .catch(() => {});
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load active file content
  useEffect(() => {
    if (!sessionId || !activeFile) return;
    fetch(`/api/sessions/${sessionId}/workspace/${activeFile}`)
      .then((r) => r.text())
      .then((text) => {
        setContent(text);
        setSaveState("saved");
      })
      .catch(() => {});
  }, [sessionId, activeFile]);

  // Debounced auto-save
  const handleChange = useCallback(
    (newContent) => {
      setContent(newContent);
      setSaveState("dirty");
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        if (!activeFile) return;
        setSaveState("saving");
        try {
          await fetch(`/api/sessions/${sessionId}/workspace/${activeFile}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent }),
          });
          setSaveState("saved");
        } catch {
          setSaveState("dirty");
        }
      }, AUTOSAVE_DELAY_MS);
    },
    [sessionId, activeFile],
  );

  return { files, activeFile, setActiveFile, content, handleChange, saveState };
}
