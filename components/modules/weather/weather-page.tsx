'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Thermometer, Droplets, Wind, Gauge, CloudRain } from 'lucide-react';
import { PageHeader, ChartCard, LoadingSkeleton } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { mockWeatherCurrent, mockForecast } from '@/lib/mock-data';

export default function WeatherPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Weather Intelligence" />
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  const { temperature, condition, feelsLike, humidity, windSpeed, windDirection, pressure, rainProbability } = mockWeatherCurrent;

  const metricCards = [
    { icon: Droplets, label: 'Humidity', value: `${humidity}%`, bg: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Wind, label: 'Wind', value: `${windSpeed} km/h ${windDirection}`, bg: 'from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20', color: 'text-teal-600 dark:text-teal-400' },
    { icon: Gauge, label: 'Pressure', value: `${pressure} hPa`, bg: 'from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20', color: 'text-amber-600 dark:text-amber-400' },
    { icon: CloudRain, label: 'Rain Prob.', value: `${rainProbability}%`, bg: 'from-sky-50 to-sky-100 dark:from-sky-950/30 dark:to-sky-900/20', color: 'text-sky-600 dark:text-sky-400' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Weather Intelligence" />

      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center lg:col-span-1">
            <Thermometer className="w-8 h-8 text-emerald-600 mb-2" />
            <div className="text-6xl font-bold">{temperature}°C</div>
            <p className="text-lg text-muted-foreground mt-2">{condition}</p>
            <p className="text-sm text-muted-foreground">Feels like {feelsLike}°C</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {metricCards.map((m) => (
              <div key={m.label} className={`bg-gradient-to-br ${m.bg} rounded-lg p-4`}>
                <div className="flex items-center space-x-3">
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-lg font-semibold">{m.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">7-Day Forecast</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 px-3 font-medium">Date</th>
                <th className="text-left py-2 px-3 font-medium">Condition</th>
                <th className="text-left py-2 px-3 font-medium">High / Low</th>
                <th className="text-left py-2 px-3 font-medium">Rain</th>
                <th className="text-left py-2 px-3 font-medium">Wind</th>
              </tr>
            </thead>
            <tbody>
              {mockForecast.map((day, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3">{day.date}</td>
                  <td className="py-3 px-3 text-muted-foreground">{day.condition}</td>
                  <td className="py-3 px-3 font-medium">{day.high}° / {day.low}°</td>
                  <td className="py-3 px-3 text-muted-foreground">{day.rainProbability}%</td>
                  <td className="py-3 px-3 text-muted-foreground">{day.windSpeed} km/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Temperature Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockForecast}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="high" stroke="#dc2626" dot={false} name="High" />
              <Line type="monotone" dataKey="low" stroke="#2563eb" dot={false} name="Low" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rainfall Trend">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockForecast}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="rainProbability" fill="#2563eb" name="Rain %" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Wind Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockForecast}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="windSpeed" stroke="#0d9488" dot={false} name="Wind km/h" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
