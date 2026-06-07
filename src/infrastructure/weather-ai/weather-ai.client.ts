import { logger } from '../logger/logger.service';
import { WeatherAiCurrentResponse, WeatherAiForecastResponse, WeatherAiUsageResponse, WeatherAiForestryResponse } from './weather-ai.types';
import { WeatherUnavailableError, AnalysisFailedError } from '../../shared/errors/domain-errors';
import { redisClient } from '../cache/redis.client';
import { cacheManager } from '../cache/cache.service';
import { CachePolicies } from '../cache/CachePolicies';

export class WeatherAiClient {
  private readonly baseUrl = process.env.WEATHER_AI_BASE_URL || 'https://api.weather-ai.co';
  private readonly apiKey = process.env.WEATHERAI_API_KEY;

  private isMockMode(): boolean {
    return !this.apiKey || this.apiKey === 'your-weatherai-key' || this.apiKey.includes('your-');
  }

  async getCurrentWeather(lat: number, lon: number, ai = true): Promise<WeatherAiCurrentResponse> {
    if (this.isMockMode()) return this.getMockCurrentWeather();

    const path = `/v1/weather?lat=${lat}&lon=${lon}${ai ? '' : '&ai=false'}`;
    const cacheKey = `weather:current:${lat}:${lon}:${ai}`;
    
    return cacheManager.getOrSet(
      cacheKey,
      () => this.fetch<WeatherAiCurrentResponse>(path),
      CachePolicies.forWeatherCurrent()
    );
  }

  async getForecast(lat: number, lon: number, ai = true): Promise<WeatherAiForecastResponse> {
    if (this.isMockMode()) return this.getMockForecast();

    const path = `/v1/forecast?lat=${lat}&lon=${lon}${ai ? '' : '&ai=false'}`;
    const cacheKey = `weather:forecast:${lat}:${lon}:${ai}`;
    
    return cacheManager.getOrSet(
      cacheKey,
      () => this.fetch<WeatherAiForecastResponse>(path),
      CachePolicies.forWeatherForecast()
    );
  }

  async getUsage(): Promise<WeatherAiUsageResponse> {
    if (this.isMockMode()) return {
        plan: 'Free (Demo)',
        requests_used: 52,
        requests_remaining: 948,
        ai_requests_used: 4,
        ai_requests_remaining: 96,
        billing_period_start: new Date().toISOString(),
        billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const path = '/v1/usage';
    const cacheKey = 'weather:usage';
    
    return cacheManager.getOrSet(
      cacheKey,
      () => this.fetch<WeatherAiUsageResponse>(path),
      CachePolicies.forWeatherUsage()
    );
  }

  async analyzeForestry(input: string | FormData): Promise<WeatherAiForestryResponse> {
    if (this.isMockMode()) return {
        id: 'mock-analysis',
        tree_stats: { total: 1284, healthy: 1102, unhealthy: 142, dead: 40 },
        coverage: { canopy: 82, density: 0.85 },
        score: 87,
        overlay: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    };

    if (typeof input === 'string') {
      return this.fetch<WeatherAiForestryResponse>('/v1/trees/analyze', {
        method: 'POST',
        body: JSON.stringify({ image_url: input }),
      });
    }

    return this.fetch<WeatherAiForestryResponse>('/v1/trees/analyze', {
      method: 'POST',
      body: input,
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
          ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
          ...init?.headers,
        },
      });

      if (!response.ok) {
        if (retries > 0 && (response.status === 429 || response.status >= 500)) {
          logger.warn({ msg: 'WeatherAI API retry', url, status: response.status, retriesLeft: retries });
          await new Promise(r => setTimeout(r, backoff));
          return this.fetch(path, init, retries - 1, backoff * 2);
        }
        
        const errorData = await response.json().catch(() => ({}));
        logger.error({ msg: 'WeatherAI API error', url, status: response.status, errorData });
        
        if (response.status === 401 && process.env.NODE_ENV === 'development') {
            if (path.includes('forecast')) return this.getMockForecast() as unknown as T;
            if (path.includes('weather')) return this.getMockCurrentWeather() as unknown as T;
        }

        if (path.includes('weather') || path.includes('forecast')) throw new WeatherUnavailableError();
        throw new AnalysisFailedError(errorData.error || 'Unknown WeatherAI error');
      }

      logger.info({ msg: 'WeatherAI API call', url, duration: Date.now() - start });
      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof WeatherUnavailableError || error instanceof AnalysisFailedError) throw error;
      
      if (retries > 0) {
        logger.warn({ msg: 'WeatherAI network error retry', url, error, retriesLeft: retries });
        await new Promise(r => setTimeout(r, backoff));
        return this.fetch(path, init, retries - 1, backoff * 2);
      }
      
      if (retries > 0) {
        await new Promise(r => setTimeout(r, backoff));
        return this.fetch(path, init, retries - 1, backoff * 2);
      }

      logger.error({ msg: 'WeatherAI network error', url, error });
      throw new WeatherUnavailableError();
    }
  }

  private getMockCurrentWeather(): WeatherAiCurrentResponse {
      return {
          temp: 24.5, humidity: 65, wind_speed: 12.4, rain: 0, pressure: 1012, timestamp: new Date().toISOString(),
          condition: 'Partly Cloudy',
          current: { temperature: 24, condition_code: 'partly-cloudy', humidity: 62, wind_speed: 14, feels_like: 26, icon: '🌤️' },
          insight: "Conditions are optimal for mid-day irrigation."
      };
  }

  private getMockForecast(): WeatherAiForecastResponse {
      return {
          daily: Array.from({ length: 7 }).map((_, i) => ({
              date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
              temp_min: 16 + i, temp_max: 22 + i, precipitation_probability: 10 * i,
              wind_speed: 10 + (i * 2),
              condition_code: 'sunny', icon: '☀️'
          }))
      };
  }
}

export const weatherAiClient = new WeatherAiClient();
