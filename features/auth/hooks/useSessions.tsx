import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSessions, revokeSession, revokeAllSessions } from '../api/sessions'

export function useSessions(limit = 20, offset = 0) {
  return useQuery(['sessions', { limit, offset }], () => fetchSessions(limit, offset), { keepPreviousData: true })
}

export function useRevokeSession() {
  const qc = useQueryClient()
  return useMutation((id: string) => revokeSession(id), {
    onMutate: async (id) => {
      await qc.cancelQueries(['sessions'])
      const previous = qc.getQueryData(['sessions'])
      // optimistic update: remove locally
      qc.setQueryData(['sessions'], (old: any) => ({ ...old, data: (old?.data || []).filter((s: any) => s.id !== id) }))
      return { previous }
    },
    onError: (_err, _id, context: any) => qc.setQueryData(['sessions'], context.previous),
    onSettled: () => qc.invalidateQueries(['sessions']),
  })
}

export function useRevokeAll() {
  const qc = useQueryClient()
  return useMutation((exceptId?: string) => revokeAllSessions(exceptId), {
    onMutate: async (exceptId) => {
      await qc.cancelQueries(['sessions'])
      const previous = qc.getQueryData(['sessions'])
      qc.setQueryData(['sessions'], { ...previous, data: [] })
      return { previous }
    },
    onError: (_err, _vars, context: any) => qc.setQueryData(['sessions'], context.previous),
    onSettled: () => qc.invalidateQueries(['sessions']),
  })
}
