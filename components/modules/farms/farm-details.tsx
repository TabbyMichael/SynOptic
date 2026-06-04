'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader, MetricCard, ChartCard, StatusBadge, EmptyState, LoadingSkeleton } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Farm, ForestryResult, AlertRule } from '@/lib/types';
import { mockFarms, mockWeatherCurrent, mockForecast, mockForestryResults, mockAlertRules } from '@/lib/mock-data';
import { FARM_STATUS_COLORS } from '@/lib/constants';
import { Cloud, AlertCircle, History } from 'lucide-react';

interface FarmDetailsProps {
  farmId: string;
}

export function FarmDetails({ farmId }: FarmDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [forestryData, setForestryData] = useState<ForestryResult | null>(null);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundFarm = mockFarms.find((f) => f.id === farmId);
      const foundForestry = mockForestryResults.find((f) => f.farmId === farmId);
      const foundAlerts = mockAlertRules.filter((r) => r.farmId === farmId);

      setFarm(foundFarm || null);
      setForestryData(foundForestry || null);
      setAlertRules(foundAlerts);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [farmId]);

  if (loading) {
    return <LoadingSkeleton type="card" />;
  }

  if (!farm) {
    return <EmptyState title="Farm not found" description="The requested farm could not be found." />;
  }

  const getHealthColor = (score: number) => {
    if (score > 70) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={farm.name}
        description={`${farm.county} County • ${farm.acres.toLocaleString()} acres`}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="forestry">Forestry</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Name" value={farm.name} />
            <MetricCard title="County" value={farm.county} />
            <MetricCard title="Acres" value={farm.acres.toLocaleString()} />
            <MetricCard
              title="Health Score"
              value={`${farm.healthScore}%`}
              className={`${getHealthColor(farm.healthScore)}`}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Coordinates</span>
                <span className="text-sm font-medium">{farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge
                  label={farm.status.charAt(0).toUpperCase() + farm.status.slice(1)}
                  variant={FARM_STATUS_COLORS[farm.status]}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Analysis</span>
                <span className="text-sm font-medium">
                  {farm.lastAnalysis ? new Date(farm.lastAnalysis).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard title="Temperature" value={`${mockWeatherCurrent.temperature}°C`} />
                <MetricCard title="Feels Like" value={`${mockWeatherCurrent.feelsLike}°C`} />
                <MetricCard title="Humidity" value={`${mockWeatherCurrent.humidity}%`} />
                <MetricCard title="Wind Speed" value={`${mockWeatherCurrent.windSpeed} km/h`} />
                <MetricCard title="Pressure" value={`${mockWeatherCurrent.pressure} hPa`} />
                <MetricCard title="Rain Probability" value={`${mockWeatherCurrent.rainProbability}%`} />
              </div>
              <div className="mt-4 p-4 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Condition: {mockWeatherCurrent.condition}</p>
                <p className="text-sm text-muted-foreground">Wind: {mockWeatherCurrent.windDirection}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Date</th>
                      <th className="text-left py-2 px-2">Condition</th>
                      <th className="text-left py-2 px-2">High/Low</th>
                      <th className="text-left py-2 px-2">Wind</th>
                      <th className="text-left py-2 px-2">Rain Prob</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockForecast.map((day, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted">
                        <td className="py-2 px-2">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                        <td className="py-2 px-2">{day.condition}</td>
                        <td className="py-2 px-2">{day.high}°/{day.low}°</td>
                        <td className="py-2 px-2">{day.windSpeed} km/h</td>
                        <td className="py-2 px-2">{day.rainProbability}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forestry" className="space-y-4">
          {forestryData ? (
            <Card>
              <CardHeader>
                <CardTitle>Forestry Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <MetricCard title="Tree Count" value={forestryData.treeCount} />
                  <MetricCard title="Canopy Coverage" value={`${forestryData.canopyCoverage}%`} />
                  <MetricCard title="Density" value={`${forestryData.density}%`} />
                </div>
                <Card className="bg-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Health Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p>Healthy: {forestryData.healthDistribution.healthy}%</p>
                    <p>Moderate: {forestryData.healthDistribution.moderate}%</p>
                    <p>Poor: {forestryData.healthDistribution.poor}%</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="No Forestry Data" description="No forestry analysis available for this farm yet." />
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alertRules.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Alert Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertRules.map((rule) => (
                    <div key={rule.id} className="flex items-start justify-between p-3 border rounded bg-muted/50">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{rule.metric}</p>
                        <p className="text-xs text-muted-foreground">
                          Trigger when {rule.metric} {rule.operator} {rule.threshold}
                        </p>
                      </div>
                      <StatusBadge label={rule.severity} variant="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="No Alert Rules" description="No alert rules configured for this farm." />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <ChartCard title="Analysis History">
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <History className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Historical data chart placeholder</p>
            </div>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
