'use client';

import { Thermometer, Droplets, Wind, Gauge, CloudRain, MapPin } from 'lucide-react';
import { PageHeader, CSSChart, LoadingSkeleton } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { useWeatherData } from '@/hooks/use-weather-data';
import { format } from 'date-fns';

interface DailyForecastItem {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation_probability: number;
  wind_speed?: number;
  condition_code?: string;
}

export default function WeatherPage() {
  const { data, isLoading, error } = useWeatherData();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <PageHeader title="Weather Intelligence" />
        <LoadingSkeleton type="card" count={1} className="h-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={4} />
        </div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Sync Error</h2>
        <p className="text-slate-500">{(error as any).message}</p>
      </div>
    );
  }

  const current = data?.current;
  const forecast = data?.forecast?.daily || [];

  // Mappers
  const weatherStats = current ? {
    temperature: current.current?.temperature ?? current.temp ?? '--',
    condition: (current.current?.condition_code || current.condition || 'Clear').charAt(0).toUpperCase() + (current.current?.condition_code || current.condition || 'Clear').slice(1),
    feelsLike: current.current?.feels_like ?? current.feels_like ?? '--',
    humidity: current.current?.humidity ?? current.humidity ?? 0,
    windSpeed: current.current?.wind_speed ?? current.wind_speed ?? 0,
    pressure: current.current?.pressure ?? current.pressure ?? 1013,
    rainProbability: forecast[0]?.precipitation_probability ?? 0,
  } : null;

  const chartData = forecast.map((day: DailyForecastItem) => ({
    date: format(new Date(day.date), 'MMM dd'),
    shortDate: format(new Date(day.date), 'EEE'),
    high: day.temp_max,
    low: day.temp_min,
    rain: day.precipitation_probability,
    wind: day.wind_speed || 0,
  })) as any[];

  const metricCards = [
    { icon: Droplets, label: 'Humidity', value: `${weatherStats?.humidity}%`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { icon: Wind, label: 'Wind Speed', value: `${weatherStats?.windSpeed} km/h`, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/20' },
    { icon: Gauge, label: 'Pressure', value: `${weatherStats?.pressure} hPa`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: CloudRain, label: 'Rain Prob.', value: `${weatherStats?.rainProbability}%`, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/20' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
            title="Weather Intelligence" 
            description="Deep analysis of environmental conditions and trends."
        />
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <MapPin className="h-3 w-3 text-emerald-500" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-tighter text-slate-600 dark:text-slate-400">Nairobi, Kenya</span>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600 mb-2">
                        <Thermometer className="w-10 h-10" aria-hidden="true" />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-7xl font-black tracking-tighter">{weatherStats?.temperature}</span>
                        <span className="text-3xl font-light text-muted-foreground">°C</span>
                    </div>
                    <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{weatherStats?.condition}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Feels like {weatherStats?.feelsLike}°C</p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {metricCards.map((m) => (
                    <div key={m.label} className={`${m.bg} rounded-3xl p-6 border border-white dark:border-white/5 shadow-sm transition-transform hover:scale-[1.02]`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${m.color}`}>
                                <m.icon className="w-6 h-6" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-xs uppercase font-black tracking-widest text-slate-600 dark:text-slate-400 mb-1">{m.label}</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{m.value}</p>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
            </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CSSChart 
          title="Temperature Trend" 
          data={chartData.map(d => ({ label: d.date, value: d.high }))} 
          color="#ef4444" 
        />
        <CSSChart 
          title="Rainfall Probability" 
          data={chartData.map(d => ({ label: d.shortDate, value: d.rain }))} 
          color="#3b82f6" 
        />
        <CSSChart 
          title="Wind Speed Analysis" 
          data={chartData.map(d => ({ label: d.date, value: d.wind }))} 
          color="#0d9488" 
        />
      </div>


      <Card className="border-0 shadow-sm overflow-hidden rounded-3xl">
        <CardContent className="p-0">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Detailed 7-Day Forecast</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <caption className="sr-only">Detailed 7-day weather forecast table</caption>
                <thead>
                <tr className="text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-white/5">
                    <th scope="col" className="text-left py-4 px-6 font-black uppercase tracking-tighter text-xs">Date</th>
                    <th scope="col" className="text-left py-4 px-6 font-black uppercase tracking-tighter text-xs">Condition</th>
                    <th scope="col" className="text-left py-4 px-6 font-black uppercase tracking-tighter text-xs">Temp Range</th>
                    <th scope="col" className="text-left py-4 px-6 font-black uppercase tracking-tighter text-xs">Rain</th>
                    <th scope="col" className="text-left py-4 px-6 font-black uppercase tracking-tighter text-xs">Wind</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {chartData.map((day, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-5 px-6 font-bold">{day.date}</td>
                    <td className="py-5 px-6">
                        <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-full text-xs font-black uppercase shadow-sm text-slate-700 dark:text-slate-300">
                            {forecast[idx]?.condition_code || 'Clear'}
                        </span>
                    </td>
                    <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                            <span className="text-red-500 font-black">{day.high}°</span>
                            <div className="h-1 w-8 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400 w-1/2 mx-auto" />
                            </div>
                            <span className="text-blue-500 font-black">{day.low}°</span>
                        </div>
                    </td>
                    <td className="py-5 px-6 font-bold text-blue-500">{day.rain}%</td>
                    <td className="py-5 px-6 text-muted-foreground font-medium">{day.wind} km/h</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
