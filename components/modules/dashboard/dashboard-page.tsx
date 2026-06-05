'use client';

import { useEffect, useState } from 'react';
import { Heart, Cloud, Bell, Activity, Zap, Thermometer, Wind, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard, LoadingSkeleton, ErrorState } from '@/components/shared';
import { mockHealthTrend, mockWeatherTrend, mockRecentActivity } from '@/lib/mock-data';
import { PageHeader } from '@/components/shared';
import { WeatherHeroCard } from './widgets/weather-hero-card';
import { WeatherAIInsightCard } from './widgets/weather-ai-insight-card';
import { WeatherForecastWidget } from './widgets/weather-forecast-widget';
import { ForestryStatusWidget } from './widgets/forestry-status-widget';
import { ForestryPreviewWidget } from './widgets/forestry-preview-widget';
import { AnalyticsChart } from './widgets/analytics-chart';
import { WeatherAlertsPanel } from './widgets/weather-alerts-panel';
import { APIUsageWidget } from './widgets/api-usage-widget';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  // Resilient Mappers
  const weather = data?.weather;
  const weatherData = weather ? {
    location: weather.location?.name || 'Nairobi, Kenya',
    temp: weather.current?.temperature ?? weather.temp ?? '--',
    condition: (weather.current?.condition_code || weather.condition || 'Clear').charAt(0).toUpperCase() + (weather.current?.condition_code || weather.condition || 'Clear').slice(1),
    lastUpdated: data.timestamp ? format(new Date(data.timestamp), 'h:mm a') : 'Just now',
    humidity: weather.current?.humidity ?? weather.humidity ?? 0,
    windSpeed: weather.current?.wind_speed ?? weather.wind_speed ?? 0,
    rainChance: data.forecast?.daily?.[0]?.precipitation_probability || weather.rain || 0,
    feelsLike: weather.current?.feels_like ?? weather.feels_like ?? '--',
  } : {
    location: 'Nairobi, Kenya',
    temp: 24,
    condition: 'Sunny',
    lastUpdated: 'Just now',
    humidity: 62,
    windSpeed: 12,
    rainChance: 15,
    feelsLike: 26,
  };

  const defaultForecast = [
    { day: 'Mon', icon: '☀️', high: 24, low: 18, rainChance: 5 },
    { day: 'Tue', icon: '🌤️', high: 23, low: 17, rainChance: 10 },
    { day: 'Wed', icon: '🌧️', high: 20, low: 16, rainChance: 80 },
    { day: 'Thu', icon: '🌦️', high: 21, low: 16, rainChance: 40 },
    { day: 'Fri', icon: '☀️', high: 25, low: 18, rainChance: 10 },
    { day: 'Sat', icon: '☀️', high: 27, low: 19, rainChance: 5 },
    { day: 'Sun', icon: '🌤️', high: 26, low: 18, rainChance: 15 },
  ];

  const defaultAnalytics = [
    { day: 'Mon', temp: 22 }, { day: 'Tue', temp: 23 }, { day: 'Wed', temp: 20 },
    { day: 'Thu', temp: 21 }, { day: 'Fri', temp: 24 }, { day: 'Sat', temp: 26 }, { day: 'Sun', temp: 25 },
  ];

  const forecastData = (data?.forecast?.daily && data.forecast.daily.length > 0) 
    ? data.forecast.daily.map((day: any) => ({
        day: format(new Date(day.date), 'EEE'),
        icon: day.icon || '☀️',
        high: day.temp_max,
        low: day.temp_min,
        rainChance: day.precipitation_probability,
      }))
    : defaultForecast;

  const usageData = data?.usage ? {
    remaining: data.usage.requests_remaining,
    total: (data.usage.requests_used || 0) + (data.usage.requests_remaining || 0),
  } : { remaining: 948, total: 1000 };

  const alertsData = (data?.alerts && data.alerts.length > 0)
    ? data.alerts.map((alert: any) => ({
        message: alert.message || `Rule ${alert.ruleId?.split('-')[0]} Threshold Exceeded`,
        severity: alert.severity || (alert.status === 'OPEN' ? 'High' : 'Low'),
      }))
    : [
        { message: 'Potential Frost Risk Detected', severity: 'Medium' },
        { message: 'Low Soil Moisture Warning', severity: 'High' }
      ];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <PageHeader title="Weather Intelligence Dashboard" />
        <LoadingSkeleton type="card" count={1} className="h-[280px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={1} className="h-[350px] col-span-3" />
            <LoadingSkeleton type="card" count={1} className="h-[350px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center space-y-6 max-w-lg mx-auto">
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
            <h2 className="text-2xl font-black text-red-600 mb-2">Sync Error</h2>
            <p className="text-slate-500 text-sm">{(error as any).message || 'Failed to establish connection with AgroInsight services.'}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-colors"
            >
                Retry Connection
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
            title="Weather Intelligence" 
            description="Real-time agricultural monitoring and predictive analytics."
        />
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Live Sync Enabled</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <WeatherHeroCard data={weatherData} />
        <WeatherAIInsightCard insight={weather?.insight || "Your crops are looking healthy. Optimal conditions for irrigation detected for the next 48 hours."} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherForecastWidget data={forecastData} />
        <WeatherAlertsPanel alerts={alertsData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsChart data={defaultAnalytics} />
        <APIUsageWidget usage={usageData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ForestryStatusWidget stats={{ total: 42, healthy: 1284, coverage: 82 }} />
        <ForestryPreviewWidget analysis={{ treeCount: 84, confidence: 87 }} />
      </div>
    </div>
  );
}
