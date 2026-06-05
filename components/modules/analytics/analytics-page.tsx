'use client';

import { useEffect, useState } from 'react';
import { PageHeader, MetricCard, LoadingSkeleton } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Database, AlertCircle, Clock } from 'lucide-react';

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="WeatherAI Usage Analytics" />
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="WeatherAI Usage Analytics"
        description="Monitor your WeatherAI API consumption and quota status."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="API Requests (Today)" value="1,248" icon={<Zap className="w-5 h-5 text-purple-500" />} />
        <MetricCard title="Remaining Quota" value="87,552" icon={<Database className="w-5 h-5 text-blue-500" />} />
        <MetricCard title="AI Analysis Calls" value="342" icon={<Database className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="Avg Latency" value="142ms" icon={<Clock className="w-5 h-5 text-orange-500" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quota Usage Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly API Request Usage</span>
                <span className="font-medium">12,448 / 100,000</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: '12.4%' }} />
              </div>
            </div>
            <p className="text-sm text-slate-500">You have used 12.4% of your monthly WeatherAI API quota.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent API Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500">No API errors detected in the last 24 hours. Service health is optimal.</div>
        </CardContent>
      </Card>
    </div>
  );
}
