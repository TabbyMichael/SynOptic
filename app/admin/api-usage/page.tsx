'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/auth-provider'
import { AppShell } from '@/components/app-shell'
import { AdminApiUsage } from '@/components/modules/admin/admin-pages'

export default function AdminApiUsageRoute() {
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
      <AdminApiUsage />
    </AppShell>
  )
}
