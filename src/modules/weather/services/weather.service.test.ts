import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherService } from './weather.service';
import { weatherAiClient } from '../../../infrastructure/weather-ai/weather-ai.client';
import { db } from '../../../infrastructure/database/db.service';
import { mockCurrentWeather } from '../../../../tests/fixtures/weather.fixture';

vi.mock('../../../infrastructure/weather-ai/weather-ai.client', () => ({
  weatherAiClient: {
    getCurrentWeather: vi.fn(),
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

vi.mock('../../../infrastructure/logger/logger.service', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('WeatherService', () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
    vi.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather from weatherAiClient', async () => {
      vi.mocked(weatherAiClient.getCurrentWeather).mockResolvedValue(mockCurrentWeather);

      const result = await weatherService.getCurrentWeather('farm-1', 38.2975, -122.2869);

      expect(weatherAiClient.getCurrentWeather).toHaveBeenCalledWith(38.2975, -122.2869);
      expect(result).toEqual(mockCurrentWeather);
    });
  });

  describe('storeWeatherSnapshot', () => {
    it('should fetch weather and store it in the database', async () => {
      const mockSnapshot = { id: 'snap-1', farmId: 'farm-1', temp: 28.5 };
      vi.mocked(weatherAiClient.getCurrentWeather).mockResolvedValue(mockCurrentWeather);
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockSnapshot]),
        }),
      } as any);

      const result = await weatherService.storeWeatherSnapshot('farm-1', 38.2975, -122.2869);

      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual(mockSnapshot);
    });
  });
});
