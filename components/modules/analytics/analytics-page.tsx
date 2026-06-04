'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PageHeader, ChartCard, MetricCard, LoadingSkeleton } from '@/components/shared';
import {
  mockHealthTrend,
  mockWeatherTrend,
  mockAlertFrequency,
  mockAnalysisHistory,
} from '@/lib/mock-data';

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Historical data and trends across your farms" />
        <LoadingSkeleton type="chart" count={4} />
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Historical data and trends across your farms"
      />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Farm Health Trend */}
        <ChartCard title="Farm Health Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockHealthTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="greenValley"
                stroke="#16a34a"
                dot={false}
                name="Green Valley"
              />
              <Line
                type="monotone"
                dataKey="sunrise"
                stroke="#2563eb"
                dot={false}
                name="Sunrise"
              />
              <Line
                type="monotone"
                dataKey="riftView"
                stroke="#dc2626"
                dot={false}
                name="Rift View"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weather Trend */}
        <ChartCard title="Weather Trend">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={mockWeatherTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                stroke="#dc2626"
                dot={false}
                name="Temperature (°C)"
              />
              <Bar yAxisId="right" dataKey="rain" fill="#2563eb" name="Rain (mm)" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Alert Frequency */}
        <ChartCard title="Alert Frequency">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockAlertFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill="#dc2626" name="Critical" />
              <Bar dataKey="high" stackId="a" fill="#ea580c" name="High" />
              <Bar dataKey="medium" stackId="a" fill="#d97706" name="Medium" />
              <Bar dataKey="low" stackId="a" fill="#2563eb" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Analysis History */}
        <ChartCard title="Analysis History">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockAnalysisHistory}>
              <defs>
                <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="analyses"
                stroke="#16a34a"
                fillOpacity={1}
                fill="url(#colorAnalyses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Average Health Score" value="67" />
        <MetricCard title="Rainy Days This Week" value="3" />
        <MetricCard title="Total Alerts (30d)" value="42" />
        <MetricCard title="Analyses Completed" value="47" />
      </div>
    </div>
  );
}
