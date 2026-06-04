'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAuditLogs } from '@/features/admin/api/client'

export function useAdminAuditLogs(params: Record<string, any> = {}) {
  return useQuery(['admin', 'audit', params], () => fetchAuditLogs(params), { keepPreviousData: true })
}
