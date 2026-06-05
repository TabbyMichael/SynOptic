import { NextResponse } from 'next/server';
import { weatherAiClient } from '@/src/infrastructure/weather-ai/weather-ai.client';
import { alertService } from '@/src/modules/alerts/services/alert.service';

export async function GET() {
  try {
    // In a real app, we'd get these from the user's selected farm or geolocation
    const lat = -1.2921;
    const lon = 36.8219;

    // Use Promise.allSettled to ensure one failing API doesn't break the whole dashboard
    // This provides resilience (Priority 8)
    const results = await Promise.allSettled([
      weatherAiClient.getCurrentWeather(lat, lon, true), // AI=true for Hero/Insight
      weatherAiClient.getForecast(lat, lon, false),     // AI=false for simple forecast widget
      weatherAiClient.getUsage(),
      alertService.getRecentAlerts(),
    ]);

    const weather = results[0].status === 'fulfilled' ? results[0].value : null;
    const forecast = results[1].status === 'fulfilled' ? results[1].value : null;
    const usage = results[2].status === 'fulfilled' ? results[2].value : null;
    const alerts = results[3].status === 'fulfilled' ? results[3].value : [];

    // Aggregated response (Priority 2)
    return NextResponse.json({
      weather,
      forecast,
      usage,
      alerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Dashboard API Error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard data',
      details: error.message 
    }, { status: 500 });
  }
}
