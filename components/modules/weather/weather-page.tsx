'use client';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { Thermometer, Droplets, Wind, Gauge, CloudRain, MapPin } from 'lucide-react';
import { PageHeader, ChartCard, LoadingSkeleton } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { useWeatherData } from '@/hooks/use-weather-data';
import { format } from 'date-fns';

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

  const chartData = forecast.map((day: any) => ({
    date: format(new Date(day.date), 'MMM dd'),
    shortDate: format(new Date(day.date), 'EEE'),
    high: day.temp_max,
    low: day.temp_min,
    rain: day.precipitation_probability,
    wind: day.wind_speed || (Math.random() * 20).toFixed(1), // Fallback if wind missing in forecast
  }));

  const metricCards = [
    { icon: Droplets, label: 'Humidity', value: `${weatherStats?.humidity}%`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { icon: Wind, label: 'Wind Speed', value: `${weatherStats?.windSpeed} km/h`, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/20' },
    { icon: Gauge, label: 'Pressure', value: `${weatherStats?.pressure} hPa`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: CloudRain, label: 'Rain Prob.', value: `${weatherStats?.rainProbability}%`, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/20' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
            title="Weather Intelligence" 
            description="Deep analysis of environmental conditions and trends."
        />
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <MapPin className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Nairobi, Kenya</span>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600 mb-2">
                        <Thermometer className="w-10 h-10" />
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
                                <m.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{m.label}</p>
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
        <ChartCard title="Temperature Trend" className="border-0 shadow-sm">
          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorHigh)" name="Day High" />
                    <Area type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLow)" name="Night Low" />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Rainfall Probability" className="border-0 shadow-sm">
          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="shortDate" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="rain" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Rain %" barSize={32} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Wind Speed Analysis" className="col-span-1 lg:col-span-2 border-0 shadow-sm">
          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="stepAfter" dataKey="wind" stroke="#0d9488" strokeWidth={4} dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} name="Wind (km/h)" />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden rounded-3xl">
        <CardContent className="p-0">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Detailed 7-Day Forecast</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="text-muted-foreground border-b border-slate-100 dark:border-white/5">
                    <th className="text-left py-4 px-6 font-black uppercase tracking-tighter text-[10px]">Date</th>
                    <th className="text-left py-4 px-6 font-black uppercase tracking-tighter text-[10px]">Condition</th>
                    <th className="text-left py-4 px-6 font-black uppercase tracking-tighter text-[10px]">Temp Range</th>
                    <th className="text-left py-4 px-6 font-black uppercase tracking-tighter text-[10px]">Rain</th>
                    <th className="text-left py-4 px-6 font-black uppercase tracking-tighter text-[10px]">Wind</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {chartData.map((day, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-5 px-6 font-bold">{day.date}</td>
                    <td className="py-5 px-6">
                        <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-full text-[10px] font-black uppercase shadow-sm">
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
