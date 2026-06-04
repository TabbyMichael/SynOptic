import create from 'zustand'

export interface AdminStoreState {
  filters: { search?: string; action?: string }
  selectedLog?: any | null
  setFilters: (f: Partial<AdminStoreState['filters']>) => void
  selectLog: (l?: any | null) => void
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  filters: {},
  selectedLog: null,
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  selectLog: (l) => set({ selectedLog: l ?? null }),
}))
