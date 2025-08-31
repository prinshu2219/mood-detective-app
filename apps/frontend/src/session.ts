const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

export async function ensureSessionId(): Promise<string> {
  let id = localStorage.getItem('mdSessionId');
  if (id) return id;
  try {
    const res = await fetch(`${API_BASE}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.sessionId) {
      id = String(data.sessionId);
      localStorage.setItem('mdSessionId', id);
      return id;
    }
  } catch {}
  // fallback client-generated id (will be rejected by server-secured routes, but keeps UI responsive)
  id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem('mdSessionId', id);
  return id;
}

export function getSessionId(): string {
  let id = localStorage.getItem('mdSessionId');
  if (!id) {
    id =
      'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('mdSessionId', id);
  }
  return id;
}
