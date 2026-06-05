import { NewFarm } from '@/infrastructure/database/repositories/interfaces';
import { NewWeatherSnapshot } from '@/modules/weather/utils/weather.mapper';
import { UserRole } from '@/modules/auth/types/auth.types';

export const userFactory = (overrides?: Partial<any>) => ({
  id: crypto.randomUUID(),
  email: `farmer-${Math.random().toString(36).substring(7)}@example.com`,
  name: 'Test Farmer',
  role: 'FARMER' as UserRole,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const farmFactory = (overrides?: Partial<NewFarm>) => ({
  id: crypto.randomUUID(),
  ownerId: crypto.randomUUID(),
  name: 'Sunrise Valley Farm',
  county: 'Napa',
  latitude: 38.2975,
  longitude: -122.2869,
  acres: 50.5,
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const alertRuleFactory = (overrides?: Partial<any>) => ({
  id: crypto.randomUUID(),
  farmId: crypto.randomUUID(),
  metric: 'temperature',
  operator: '>',
  threshold: 32,
  severity: 'warning',
  active: true,
  createdAt: new Date(),
  ...overrides,
});

export const analysisFactory = (overrides?: Partial<any>) => ({
  id: crypto.randomUUID(),
  farmId: crypto.randomUUID(),
  analysisId: `analysis-${Math.random().toString(36).substring(7)}`,
  treeCount: 100,
  healthyCount: 85,
  needsCareCount: 10,
  needsReplacementCount: 5,
  canopyCoverage: 0.75,
  treeDensity: 0.45,
  confidenceScore: 0.92,
  overlayUrl: 'https://cdn.agroinsight.ai/overlays/123.png',
  createdAt: new Date(),
  ...overrides,
});
