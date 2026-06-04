import type { ForestryResult } from '@/lib/types';

export const mockForestryResults: ForestryResult[] = [
  {
    id: 'fr-1',
    farmId: 'farm-1',
    imageUrl: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800',
    treeCount: 342,
    canopyCoverage: 68.5,
    density: 76,
    confidenceScore: 94,
    healthDistribution: { healthy: 72, moderate: 20, poor: 8 },
    analyzedAt: '2026-05-28T10:00:00Z',
  },
  {
    id: 'fr-2',
    farmId: 'farm-4',
    imageUrl: 'https://images.pexels.com/photos/1421904/pexels-photo-1421904.jpeg?auto=compress&cs=tinysrgb&w=800',
    treeCount: 518,
    canopyCoverage: 82.1,
    density: 88,
    confidenceScore: 97,
    healthDistribution: { healthy: 85, moderate: 12, poor: 3 },
    analyzedAt: '2026-06-01T11:00:00Z',
  },
  {
    id: 'fr-3',
    farmId: 'farm-3',
    imageUrl: 'https://images.pexels.com/photos/1678064/pexels-photo-1678064.jpeg?auto=compress&cs=tinysrgb&w=800',
    treeCount: 156,
    canopyCoverage: 34.2,
    density: 42,
    confidenceScore: 89,
    healthDistribution: { healthy: 22, moderate: 35, poor: 43 },
    analyzedAt: '2026-04-15T08:00:00Z',
  },
];
