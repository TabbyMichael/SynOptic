'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAdminUsers } from '@/features/admin/api/client'

export function useAdminUsers(limit = 20, offset = 0, search = '') {
  return useQuery({
    queryKey: ['admin', 'users', { limit, offset, search }],
    queryFn: () => fetchAdminUsers({ limit, offset, search }),
    placeholderData: (previousData: any) => previousData,
  })
}
