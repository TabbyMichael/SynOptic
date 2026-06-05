import { useQuery } from '@tanstack/react-query';

export interface WeatherData {
  current: any;
  forecast: any;
  timestamp: string;
}

export function useWeatherData() {
  return useQuery<WeatherData>({
    queryKey: ['weather-data'],
    queryFn: async () => {
      const response = await fetch('/api/weather');
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}
