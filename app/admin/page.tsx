'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/providers/auth-provider'
import { LoginForm } from '@/components/login-form'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/shared'

export default function AdminIndexRoute() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <LoginForm />
  if (user?.role !== 'ADMIN') return <LoginForm />

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
