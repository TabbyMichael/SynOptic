import type { WeatherCurrent, ForecastDay } from '@/lib/types';
import { mockWeatherCurrent, mockForecast } from '@/lib/mock-data';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const WeatherApi = {
  async getCurrent(_farmId?: string): Promise<WeatherCurrent> {
    await delay(300);
    return { ...mockWeatherCurrent };
  },
  async getForecast(_farmId?: string): Promise<ForecastDay[]> {
    await delay(400);
    return [...mockForecast];
  },
};
