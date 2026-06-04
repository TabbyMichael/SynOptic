import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForestryService } from './forestry.service';
import { weatherAiClient } from '../../../infrastructure/weather-ai/weather-ai.client';
import { db } from '../../../infrastructure/database/db.service';
import { farmService } from '../../farms/services/farm.service';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { mockForestryAnalysis } from '../../../../tests/fixtures/weather.fixture';
import { farmFactory } from '../../../../tests/factories/domain-factories';

vi.mock('../../../infrastructure/weather-ai/weather-ai.client', () => ({
  weatherAiClient: {
    analyzeForestry: vi.fn(),
  },
}));

vi.mock('../../../infrastructure/database/db.service', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}));

vi.mock('../../farms/services/farm.service', () => ({
  farmService: {
    getFarm: vi.fn(),
  },
}));

vi.mock('../../audit/services/audit-logger.service', () => ({
  auditLogger: {
    log: vi.fn(),
  },
}));

vi.mock('../../../infrastructure/logger/logger.service', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ForestryService', () => {
  let forestryService: ForestryService;

  beforeEach(() => {
    forestryService = new ForestryService();
    vi.clearAllMocks();
  });

  describe('analyzeFarmImage', () => {
    it('should authorize, call WeatherAI, store results and audit log', async () => {
      const mockFarm = farmFactory();
      const mockAnalysis = { id: 'analysis-1' };
      
      vi.mocked(farmService.getFarm).mockResolvedValue(mockFarm as any);
      vi.mocked(weatherAiClient.analyzeForestry).mockResolvedValue(mockForestryAnalysis);
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockAnalysis]),
        }),
      } as any);

      const result = await forestryService.analyzeFarmImage('user-1', 'FARMER', 'farm-1', 'https://example.com/image.jpg');

      expect(farmService.getFarm).toHaveBeenCalledWith('user-1', 'FARMER', 'farm-1');
      expect(weatherAiClient.analyzeForestry).toHaveBeenCalledWith('https://example.com/image.jpg');
      expect(db.insert).toHaveBeenCalled();
      expect(auditLogger.log).toHaveBeenCalledWith(expect.objectContaining({
        action: 'ANALYSIS_COMPLETED',
        entityId: 'analysis-1',
      }));
      expect(result).toEqual(mockAnalysis);
    });
  });
});
