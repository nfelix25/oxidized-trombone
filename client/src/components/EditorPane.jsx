import Editor from "@monaco-editor/react";
import styles from "./EditorPane.module.css";

const EXT_LANG = {
  rs: "rust",
  c: "c",
  h: "c",
  cpp: "cpp",
  hpp: "cpp",
  py: "python",
  zig: "zig",
  ts: "typescript",
  js: "javascript",
};

function langForFile(filename) {
  const ext = filename?.split(".").pop()?.toLowerCase() ?? "";
  return EXT_LANG[ext] ?? "plaintext";
}

export default function EditorPane({ workspace, onExpand, className }) {
  const { files, activeFile, setActiveFile, content, handleChange, saveState } =
    workspace;

  return (
    <div className={[styles.pane, className].join(" ")}>
      <div className={styles.tabs}>
        {files.map((f) => (
          <button
            key={f}
            className={[
              styles.tab,
              f === activeFile ? styles.tabActive : "",
            ].join(" ")}
            onClick={() => setActiveFile(f)}
          >
            {f.split("/").pop()}
            {f === activeFile && saveState === "saving" && (
              <span className={styles.saving}> ●</span>
            )}
            {f === activeFile && saveState === "dirty" && (
              <span className={styles.dirty}> ○</span>
            )}
          </button>
        ))}
        <button
          className={styles.expandBtn}
          onClick={onExpand}
          title="Toggle fullscreen (Esc)"
        >
          {/* ⤢ */}⤢
        </button>
      </div>

      <div className={styles.editorWrap}>
        <Editor
          key={activeFile}
          value={content}
          language={langForFile(activeFile)}
          theme="vs-dark"
          onChange={(val) => handleChange(val ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            renderLineHighlight: "line",
          }}
        />
      </div>
    </div>
  );
}
