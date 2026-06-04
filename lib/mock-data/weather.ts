import type { WeatherCurrent, ForecastDay } from '@/lib/types';

export const mockWeatherCurrent: WeatherCurrent = {
  temperature: 24,
  humidity: 65,
  windSpeed: 12,
  windDirection: 'NE',
  pressure: 1013,
  rainProbability: 30,
  condition: 'Partly Cloudy',
  feelsLike: 26,
  updatedAt: '2026-06-04T08:00:00Z',
};

export const mockForecast: ForecastDay[] = [
  { date: '2026-06-04', high: 28, low: 14, rainProbability: 30, windSpeed: 12, condition: 'Partly Cloudy' },
  { date: '2026-06-05', high: 30, low: 16, rainProbability: 20, windSpeed: 8, condition: 'Sunny' },
  { date: '2026-06-06', high: 26, low: 15, rainProbability: 60, windSpeed: 18, condition: 'Rain' },
  { date: '2026-06-07', high: 22, low: 13, rainProbability: 80, windSpeed: 22, condition: 'Heavy Rain' },
  { date: '2026-06-08', high: 24, low: 14, rainProbability: 45, windSpeed: 15, condition: 'Showers' },
  { date: '2026-06-09', high: 27, low: 15, rainProbability: 15, windSpeed: 10, condition: 'Partly Cloudy' },
  { date: '2026-06-10', high: 29, low: 16, rainProbability: 10, windSpeed: 8, condition: 'Sunny' },
];
