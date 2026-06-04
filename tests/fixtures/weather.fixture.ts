import { WeatherAiCurrentResponse, WeatherAiForestryResponse } from '@/infrastructure/weather-ai/weather-ai.types';

export const mockCurrentWeather: WeatherAiCurrentResponse = {
  temp: 28.5,
  humidity: 45,
  wind_speed: 12.5,
  rain: 0,
  pressure: 1013,
  timestamp: new Date().toISOString(),
};

export const mockForestryAnalysis: WeatherAiForestryResponse = {
  id: 'weather-ai-123',
  tree_stats: {
    total: 150,
    healthy: 130,
    unhealthy: 15,
    dead: 5,
  },
  coverage: {
    canopy: 0.65,
    density: 0.4,
  },
  score: 0.88,
  overlay: 'https://cdn.agroinsight.ai/overlays/abc.png',
};
