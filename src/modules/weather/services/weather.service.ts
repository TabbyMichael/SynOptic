import { weatherAiClient } from '../../../infrastructure/weather-ai/weather-ai.client';
import { db } from '../../../infrastructure/database/db.service';
import { weatherSnapshots } from '../../../infrastructure/database/schema';
import { WeatherMapper, WeatherSnapshot } from '../utils/weather.mapper';
import { logger } from '../../../infrastructure/logger/logger.service';

export class WeatherService {
  async getCurrentWeather(farmId: string, lat: number, lon: number): Promise<WeatherAiCurrentResponse> {
    logger.info({ msg: 'Fetching current weather', farmId, lat, lon });
    return weatherAiClient.getCurrentWeather(lat, lon);
  }

  async storeWeatherSnapshot(farmId: string, lat: number, lon: number): Promise<WeatherSnapshot> {
    const weatherData = await this.getCurrentWeather(farmId, lat, lon);
    const snapshotData = WeatherMapper.toNewSnapshot(farmId, weatherData);
    
    const [snapshot] = await db.insert(weatherSnapshots).values(snapshotData).returning();
    
    logger.info({ msg: 'Stored weather snapshot', farmId, snapshotId: snapshot.id });
    return snapshot;
  }
}

import { WeatherAiCurrentResponse } from '../../../infrastructure/weather-ai/weather-ai.types';
export const weatherService = new WeatherService();
