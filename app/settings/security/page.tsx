"use client"
import React from 'react'
import { useSessions, useRevokeSession } from '@/features/auth/hooks/useSessions'
import SessionsList from '@/features/auth/components/SessionsList'
import SecurityOverviewCard from '@/features/auth/components/SecurityOverviewCard'

export default function SecurityPage() {
  const { data, isLoading } = useSessions()
  const revoke = useRevokeSession()

  const sessions = data?.data || []

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Security</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <SecurityOverviewCard overview={null} />
        </div>
        <div className="md:col-span-2">
          {isLoading ? <div>Loading...</div> : <SessionsList sessions={sessions} onRevoke={(id) => revoke.mutate(id)} />}
        </div>
      </div>
    </div>
  )
}
