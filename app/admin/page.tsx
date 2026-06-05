'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/providers/auth-provider'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/shared'

export default function AdminIndexRoute() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else if (user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Admin" description="System observability & control" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/users" className="rounded-lg border p-4 hover:shadow">Users</Link>
          <Link href="/admin/audit-logs" className="rounded-lg border p-4 hover:shadow">Audit Logs</Link>
          <Link href="/admin/system-metrics" className="rounded-lg border p-4 hover:shadow">System Metrics</Link>
          <Link href="/admin/api-usage" className="rounded-lg border p-4 hover:shadow">API Usage</Link>
        </div>
      </div>
    </AppShell>
  )
}
