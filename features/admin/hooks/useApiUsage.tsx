'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchApiUsage } from '@/features/admin/api/client'

export function useApiUsage() {
  return useQuery(['admin', 'api-usage'], fetchApiUsage, { staleTime: 30 * 1000 })
}
