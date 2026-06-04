import React from 'react'

export function SecurityOverviewCard({ overview }: { overview: any }) {
  if (!overview) return null
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">Security Overview</h3>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div>Total sessions: {overview.totalSessions}</div>
        <div>Trusted devices: {overview.trustedDevices}</div>
        <div>Security score: {overview.securityScore}</div>
        <div>Suspicious: {overview.suspiciousCount}</div>
      </div>
    </div>
  )
}

export default SecurityOverviewCard
