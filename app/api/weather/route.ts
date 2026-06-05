import { NextResponse } from 'next/server';
import { weatherAiClient } from '@/src/infrastructure/weather-ai/weather-ai.client';

export async function GET() {
  try {
    // Hardcoded for now
    const lat = -1.2921;
    const lon = 36.8219;

    const [current, forecast] = await Promise.all([
      weatherAiClient.getCurrentWeather(lat, lon),
      weatherAiClient.getForecast(lat, lon, false),
    ]);

    return NextResponse.json({
      current,
      forecast,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Weather API Error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to fetch weather data',
      details: error.message 
    }, { status: 500 });
  }
}
