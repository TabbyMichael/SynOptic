'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchAuditLogs } from '@/features/admin/api/client'

export function useAdminAuditLogs(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['admin', 'audit', params],
    queryFn: () => fetchAuditLogs(params),
    placeholderData: keepPreviousData,
  })
}
