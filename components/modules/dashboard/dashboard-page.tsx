'use client';

import { useEffect, useState } from 'react';
import { Heart, Cloud, Bell, Activity, Zap, Thermometer, Wind, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard, PageHeader, ChartCard, LoadingSkeleton, ErrorState } from '@/components/shared';
import { mockHealthTrend, mockWeatherTrend, mockRecentActivity } from '@/lib/mock-data';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <LoadingSkeleton type="card" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Weather Intelligence Dashboard" 
        description="Powered by WeatherAI real-time weather analytics."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Current Temp" value="24°C" icon={<Thermometer className="w-5 h-5 text-orange-500" />} />
        <MetricCard title="Humidity" value="62%" icon={<Droplets className="w-5 h-5 text-sky-500" />} />
        <MetricCard title="Wind Speed" value="12 km/h" icon={<Wind className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="WeatherAI Status" value="Active" icon={<Zap className="w-5 h-5 text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Farm Health Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockHealthTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="greenValley" stroke="#16a34a" strokeWidth={2} dot={false} name="Green Valley" />
              <Line type="monotone" dataKey="sunrise" stroke="#2563eb" strokeWidth={2} dot={false} name="Sunrise" />
              <Line type="monotone" dataKey="riftView" stroke="#dc2626" strokeWidth={2} dot={false} name="Rift View" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weather Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockWeatherTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="temp" fill="#f97316" name="Temp (°C)" radius={[4,4,0,0]} />
              <Bar dataKey="rain" fill="#3b82f6" name="Rain (%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => {
              const dotColor: Record<string, string> = {
                analysis: 'bg-emerald-500',
                alert: 'bg-amber-500',
                weather: 'bg-blue-500',
                farm: 'bg-gray-400',
              };
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor[activity.type] || 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.farm} &middot; {activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
