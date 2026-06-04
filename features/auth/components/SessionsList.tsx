import React from 'react'
export function SessionsList({ sessions, onRevoke }: { sessions: any[]; onRevoke: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {sessions.map((s) => (
        <div key={s.id} className="p-3 bg-white rounded shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">{s.deviceName || s.browser || 'Unknown device'}</div>
            <div className="text-sm text-muted">{s.ipAddress} • {s.location?.city || s.location?.country || ''}</div>
          </div>
          <div>
            <button onClick={() => onRevoke(s.id)} className="text-sm text-red-600">Revoke</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SessionsList
