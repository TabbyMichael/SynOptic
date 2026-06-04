import { vi } from 'vitest';
import { WeatherAiClient } from '@/infrastructure/weather-ai/weather-ai.client';
import { mockCurrentWeather, mockForestryAnalysis } from '../fixtures/weather.fixture';

export const mockWeatherAiClient = {
  getCurrentWeather: vi.fn().mockResolvedValue(mockCurrentWeather),
  analyzeForestry: vi.fn().mockResolvedValue(mockForestryAnalysis),
} as unknown as WeatherAiClient;
