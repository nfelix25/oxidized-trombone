import { useCallback, useEffect, useState } from "react";

/**
 * Fetches session data for `sessionId` and exposes actions:
 *   attempt()  — POST /api/sessions/:id/attempt (returns SSE url for caller to open)
 *   hint(msg?) — POST /api/sessions/:id/hint
 *   end()      — DELETE /api/sessions/:id
 */
export function useSession(sessionId) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSession(await res.json());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const attempt = useCallback(() => {
    // Returns the SSE URL — caller opens it with useSSE or EventSource
    return `/api/sessions/${sessionId}/attempt`;
  }, [sessionId]);

  const hint = useCallback(async (message = null) => {
    const body = message ? { message } : {};
    const res = await fetch(`/api/sessions/${sessionId}/hint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json(); // { level, text }
  }, [sessionId]);

  const end = useCallback(async () => {
    const res = await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json(); // { session, recommendations }
  }, [sessionId]);

  return { session, loading, error, refresh: fetch_, attempt, hint, end };
}
