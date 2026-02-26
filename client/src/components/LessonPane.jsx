import { useEffect, useState } from "react";
import { Marked } from "marked";
import hljs from "highlight.js";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/tomorrow-night-bright.css";
import styles from "./LessonPane.module.css";

/** Configure marked to use highlight.js for code blocks */
const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-", // Add the correct class prefix for highlight.js styles
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

/** Parse LESSON.md into sections by splitting on ## headings */
function parseSections(markdown) {
  const lines = markdown.split("\n");
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.slice(3).trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections.map((s) => ({
    title: s.title,
    content: s.lines.join("\n").trim(),
  }));
}

export default function LessonPane({ sessionId, onCollapse, className }) {
  const [sections, setSections] = useState([]);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions/${sessionId}/lesson`)
      .then((r) => r.text())
      .then((md) => setSections(parseSections(md)))
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    const blocks = document.querySelectorAll(
      `.${styles.sectionContent} pre code`,
    );
    blocks.forEach((block) => hljs.highlightElement(block));
  }, [sections, collapsed]);

  function toggleAll(collapse) {
    const next = {};
    sections.forEach((_, i) => {
      next[i] = collapse;
    });
    setCollapsed(next);
  }

  function toggle(i) {
    setCollapsed((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div className={[styles.pane, className].join(" ")}>
      <div className={styles.toolbar}>
        <span className={styles.title}>Lesson</span>
        <button className={styles.toolBtn} onClick={() => toggleAll(false)}>
          Expand all
        </button>
        <button className={styles.toolBtn} onClick={() => toggleAll(true)}>
          Collapse all
        </button>
        <button
          className={styles.toolBtn}
          onClick={onCollapse}
          title="Hide lesson (Esc)"
        >
          ×
        </button>
      </div>
      <div className={styles.sections}>
        {sections.map((s, i) => (
          <div key={i} className={styles.section}>
            <button className={styles.sectionHeader} onClick={() => toggle(i)}>
              <span className={styles.chevron}>{collapsed[i] ? "▶" : "▼"}</span>
              {s.title}
            </button>
            {!collapsed[i] && (
              <div
                className={styles.sectionContent}
                dangerouslySetInnerHTML={{ __html: marked.parse(s.content) }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
