export async function fetchSessions(limit = 20, offset = 0) {
  const url = `/api/v1/auth/sessions?limit=${limit}&offset=${offset}`;
  const res = await fetch(url, { headers: { 'x-user-id': (typeof window !== 'undefined' && (window as any).__TEST_USER_ID) || '' } });
  if (!res.ok) throw new Error('Failed to fetch sessions');
  const payload = await res.json();
  return payload.data;
}

export async function revokeSession(sessionId: string) {
  const res = await fetch(`/api/v1/auth/sessions/${sessionId}`, { method: 'DELETE', headers: { 'x-user-id': (typeof window !== 'undefined' && (window as any).__TEST_USER_ID) || '' } });
  if (!res.ok) throw new Error('Failed to revoke session');
  return res.json();
}

export async function revokeAllSessions(exceptSessionId?: string) {
  const res = await fetch('/api/v1/auth/revoke-all', { method: 'POST', headers: { 'content-type': 'application/json', 'x-user-id': (typeof window !== 'undefined' && (window as any).__TEST_USER_ID) || '' }, body: JSON.stringify({ exceptSessionId }) });
  if (!res.ok) throw new Error('Failed to revoke all sessions');
  return res.json();
}
