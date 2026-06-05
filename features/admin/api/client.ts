interface FetchAdminUsersOptions {
  limit?: number;
  offset?: number;
  search?: string;
}

export async function fetchAdminUsers({ limit = 20, offset = 0, search = '' }: FetchAdminUsersOptions = {}) {
  const url = `/api/admin/users?limit=${limit}&offset=${offset}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
  const res = await fetch(url, {
    headers: {
      'x-user-id': (typeof window !== 'undefined' && (window as any).__TEST_USER_ID) || '',
      'x-user-role': (typeof window !== 'undefined' && (window as any).__TEST_USER_ROLE) || 'ADMIN',
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to fetch admin users');
  }
  const payload = await res.json();
  return payload.data;
}

interface FetchAuditLogsOptions {
  limit?: number;
  offset?: number;
  userId?: string;
  action?: string;
  from?: string;
  to?: string;
}

export async function fetchAuditLogs({ limit = 50, offset = 0, userId, action, from, to }: FetchAuditLogsOptions = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  if (userId) params.set('userId', userId);
  if (action) params.set('action', action);
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
    headers: {
      'x-user-id': (typeof window !== 'undefined' && (window as any).__TEST_USER_ID) || '',
      'x-user-role': (typeof window !== 'undefined' && (window as any).__TEST_USER_ROLE) || 'ADMIN',
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to fetch audit logs');
  }
  return (await res.json()).data;
}

export async function fetchSystemMetrics() {
  const res = await fetch('/api/admin/system-metrics', {
    headers: {
      'x-user-id': (typeof window !== 'undefined' && (window as any).__TEST_USER_ID) || '',
      'x-user-role': (typeof window !== 'undefined' && (window as any).__TEST_USER_ROLE) || 'ADMIN',
    },
  });
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        message = (parsed.error as string) || (parsed.message as string) || text;
      }
    } catch {}
    throw new Error(`Failed to fetch system metrics: ${message}`);
  }
  return JSON.parse(text).data;
}

export async function fetchApiUsage() {
  const res = await fetch('/api/admin/api-usage', {
    headers: {
      'x-user-id': (typeof window !== 'undefined' && (window as any).__TEST_USER_ID) || '',
      'x-user-role': (typeof window !== 'undefined' && (window as any).__TEST_USER_ROLE) || 'ADMIN',
    },
  });
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        message = (parsed.error as string) || (parsed.message as string) || text;
      }
    } catch {}
    throw new Error(`Failed to fetch api usage: ${message}`);
  }
  return JSON.parse(text).data;
}
