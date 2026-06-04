import { logger } from '../logger/logger.service';
import { WeatherAiCurrentResponse, WeatherAiForestryResponse } from './weather-ai.types';
import { WeatherUnavailableError, AnalysisFailedError } from '../../shared/errors/domain-errors';

export class WeatherAiClient {
  private readonly baseUrl = process.env.WEATHERAI_API_URL;
  private readonly apiKey = process.env.WEATHERAI_API_KEY;

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherAiCurrentResponse> {
    return this.fetch<WeatherAiCurrentResponse>(`/weather/current?lat=${lat}&lon=${lon}`);
  }

  async analyzeForestry(imageUrl: string): Promise<WeatherAiForestryResponse> {
    return this.fetch<WeatherAiForestryResponse>('/forestry/analyze', {
      method: 'POST',
      body: JSON.stringify({ image_url: imageUrl }),
    });
  }

  private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
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

      const duration = Date.now() - start;
      logger.info({ msg: 'WeatherAI API call', url, duration, status: response.status });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error({ msg: 'WeatherAI API error', url, status: response.status, errorData });
        
        if (path.includes('weather')) throw new WeatherUnavailableError();
        throw new AnalysisFailedError(errorData.error || 'Unknown WeatherAI error');
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof WeatherUnavailableError || error instanceof AnalysisFailedError) {
        throw error;
      }
      logger.error({ msg: 'WeatherAI network error', url, error });
      throw new WeatherUnavailableError();
    }
  }
}

export const weatherAiClient = new WeatherAiClient();
