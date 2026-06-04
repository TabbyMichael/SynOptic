import type { Farm } from '@/lib/types';
import { mockFarms } from '@/lib/mock-data';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const FarmApi = {
  async list(): Promise<Farm[]> {
    await delay(400);
    return [...mockFarms];
  },
  async getById(id: string): Promise<Farm | null> {
    await delay(300);
    return mockFarms.find((f) => f.id === id) ?? null;
  },
  async create(data: Omit<Farm, 'id' | 'healthScore' | 'lastAnalysis' | 'status' | 'createdAt'>): Promise<Farm> {
    await delay(500);
    return {
      ...data,
      id: `farm-${Date.now()}`,
      healthScore: 0,
      lastAnalysis: null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },
  async delete(id: string): Promise<void> {
    await delay(300);
  },
};
