import { z } from 'zod';

const WeatherApiResponseSchema = z.object({
  forecast: z.array(z.object({
    date: z.string(),
    temperature: z.number(),
    rainfall: z.number(),
    windSpeed: z.number(),
    humidity: z.number(),
  })),
});

export async function getWeatherData(lat: number, lon: number, days: number = 7) {
  const apiKey = process.env.WEATHERAI_API_KEY;
  if (!apiKey) throw new Error('WEATHERAI_API_KEY is not configured');

  const res = await fetch(
    `https://api.weather-ai.co/v1/forecast?lat=${lat}&lon=${lon}&days=${days}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch weather data');
  
  const data = await res.json();
  return WeatherApiResponseSchema.parse(data);
}
