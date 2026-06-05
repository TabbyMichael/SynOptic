import { logger } from '../logger/logger.service';
import { WeatherAiCurrentResponse, WeatherAiForestryResponse } from './weather-ai.types';
import { WeatherUnavailableError, AnalysisFailedError } from '../../shared/errors/domain-errors';
import { redisClient } from '../cache/redis.client';

export class WeatherAiClient {
  private readonly baseUrl = process.env.WEATHERAI_API_URL;
  private readonly apiKey = process.env.WEATHERAI_API_KEY;

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherAiCurrentResponse> {
    const path = `/weather/current?lat=${lat}&lon=${lon}`;
    const cacheKey = `weather:${path}`;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.fetch<WeatherAiCurrentResponse>(path);
    await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 300);
    return data;
  }

  async analyzeForestry(imageUrl: string): Promise<WeatherAiForestryResponse> {
    return this.fetch<WeatherAiForestryResponse>('/forestry/analyze', {
      method: 'POST',
      body: JSON.stringify({ image_url: imageUrl }),
    });
  }

  private async fetch<T>(path: string, init?: RequestInit, retries = 3, backoff = 1000): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const start = Date.now();

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });

      if (!response.ok) {
        if (retries > 0 && (response.status === 429 || response.status >= 500)) {
          await new Promise(r => setTimeout(r, backoff));
          return this.fetch(path, init, retries - 1, backoff * 2);
        }
        
        const errorData = await response.json().catch(() => ({}));
        logger.error({ msg: 'WeatherAI API error', url, status: response.status, errorData });
        
        if (path.includes('weather')) throw new WeatherUnavailableError();
        throw new AnalysisFailedError(errorData.error || 'Unknown WeatherAI error');
      }

      logger.info({ msg: 'WeatherAI API call', url, duration: Date.now() - start });
      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof WeatherUnavailableError || error instanceof AnalysisFailedError) {
        throw error;
      }
      
      if (retries > 0) {
        await new Promise(r => setTimeout(r, backoff));
        return this.fetch(path, init, retries - 1, backoff * 2);
      }

      logger.error({ msg: 'WeatherAI network error', url, error });
      throw new WeatherUnavailableError();
    }
  }
}

export const weatherAiClient = new WeatherAiClient();
