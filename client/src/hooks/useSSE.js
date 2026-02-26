import { useEffect, useRef, useState } from "react";

/**
 * Opens an EventSource to `url` and collects parsed JSON events.
 * Cleans up on unmount or when url changes.
 *
 * Returns { events, status } where status is "connecting" | "open" | "closed" | "error".
 */
export function useSSE(url) {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("connecting");
  const esRef = useRef(null);

  useEffect(() => {
    if (!url) return;
    setEvents([]);
    setStatus("connecting");

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setStatus("open");

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setEvents((prev) => [...prev, parsed]);
      } catch {
        // non-JSON frame — ignore
      }
    };

    es.onerror = () => {
      setStatus("error");
      es.close();
    };

    return () => {
      es.close();
      setStatus("closed");
    };
  }, [url]);

  return { events, status };
}
