import { WeatherAiCurrentResponse } from '../../../infrastructure/weather-ai/weather-ai.types';
import { weatherSnapshots } from '../../../infrastructure/database/schema';

export type WeatherSnapshot = typeof weatherSnapshots.$inferSelect;
export type NewWeatherSnapshot = typeof weatherSnapshots.$inferInsert;

export class WeatherMapper {
  static toNewSnapshot(farmId: string, response: WeatherAiCurrentResponse): NewWeatherSnapshot {
    return {
      farmId,
      temperature: response.temp,
      humidity: response.humidity,
      windSpeed: response.wind_speed,
      rainfall: response.rain,
      pressure: response.pressure,
      capturedAt: new Date(response.timestamp),
    };
  }
}
