import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSessions, revokeSession, revokeAllSessions } from '../api/sessions'

export function useSessions(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['sessions', { limit, offset }],
    queryFn: () => fetchSessions(limit, offset),
    placeholderData: (previousData: any) => previousData,
  })
}

export function useRevokeSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => revokeSession(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['sessions'] })
      const previous = qc.getQueryData(['sessions'])
      // optimistic update: remove locally
      qc.setQueryData(['sessions'], (old: any) => ({ ...old, data: (old?.data || []).filter((s: any) => s.id !== id) }))
      return { previous }
    },
    onError: (_err, _id, context: any) => qc.setQueryData(['sessions'], context.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: ['sessions'] }),
  })
}

export function useRevokeAll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (exceptId?: string) => revokeAllSessions(exceptId),
    onMutate: async (exceptId) => {
      await qc.cancelQueries({ queryKey: ['sessions'] })
      const previous = qc.getQueryData(['sessions'])
      qc.setQueryData(['sessions'], { ...(previous as any), data: [] })
      return { previous }
    },
    onError: (_err, _vars, context: any) => qc.setQueryData(['sessions'], context.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: ['sessions'] }),
  })
}
