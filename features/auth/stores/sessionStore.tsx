import { create } from 'zustand'

interface SessionStoreState {
  selectedSessionId?: string | null
  revokeDialogOpen: boolean
  revokeAllDialogOpen: boolean
  selectedRiskLevel?: string | null
  filters: Record<string, any>
  sorting: { by: string; direction: 'asc' | 'desc' }
  searchQuery: string
  openDialog: () => void
  closeDialog: () => void
  selectSession: (id?: string | null) => void
  clearSelection: () => void
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  selectedSessionId: null,
  revokeDialogOpen: false,
  revokeAllDialogOpen: false,
  selectedRiskLevel: null,
  filters: {},
  sorting: { by: 'lastUsedAt', direction: 'desc' },
  searchQuery: '',
  openDialog: () => set({ revokeDialogOpen: true }),
  closeDialog: () => set({ revokeDialogOpen: false, revokeAllDialogOpen: false }),
  selectSession: (id) => set({ selectedSessionId: id ?? null }),
  clearSelection: () => set({ selectedSessionId: null }),
}))
