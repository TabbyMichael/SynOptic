'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchSystemMetrics } from '@/features/admin/api/client'

export function useSystemMetrics() {
  return useQuery(['admin', 'metrics'], fetchSystemMetrics, { staleTime: 30 * 1000 })
}
