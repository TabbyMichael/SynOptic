import type { ForestryResult } from '@/lib/types';
import { mockForestryResults } from '@/lib/mock-data';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const ForestryApi = {
  async getResults(farmId?: string): Promise<ForestryResult[]> {
    await delay(500);
    if (farmId) return mockForestryResults.filter((r) => r.farmId === farmId);
    return [...mockForestryResults];
  },
  async uploadImage(_file: File, _farmId: string): Promise<ForestryResult> {
    await delay(2000);
    return mockForestryResults[0];
  },
};
