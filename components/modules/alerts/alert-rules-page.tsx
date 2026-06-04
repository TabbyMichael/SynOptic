'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { SEVERITY_COLORS, ALERT_STATUS_COLORS } from '@/lib/constants';
import { mockAlertRules, mockAlertEvents } from '@/lib/mock-data';
import { CreateAlertDialog } from './create-alert-dialog';

export function AlertRulesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton type="card" count={3} />;
  }

  const activeRules = mockAlertRules.filter((r) => r.enabled);
  const todayEvents = mockAlertEvents.filter((e) => {
    const eventDate = new Date(e.triggeredAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    return eventDate === today;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert Rules"
        description="Manage and monitor your farm alert configurations"
      >
        <CreateAlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Create Rule
          </Button>
        </CreateAlertDialog>
      </PageHeader>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Rules</TabsTrigger>
          <TabsTrigger value="history">Trigger History</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {mockAlertRules.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No alert rules found
              </CardContent>
            </Card>
          ) : (
            mockAlertRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rule.farmName}</h3>
                        <StatusBadge
                          label={rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                          variant={SEVERITY_COLORS[rule.severity as keyof typeof SEVERITY_COLORS]}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rule.metric} {rule.operator} {rule.threshold}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch checked={rule.enabled} disabled className="cursor-pointer" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {mockAlertEvents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No alert events recorded
              </CardContent>
            </Card>
          ) : (
            mockAlertEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{event.farmName}</h3>
                        <StatusBadge
                          label={event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                          variant={SEVERITY_COLORS[event.severity as keyof typeof SEVERITY_COLORS]}
                        />
                        <StatusBadge
                          label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          variant={ALERT_STATUS_COLORS[event.status as keyof typeof ALERT_STATUS_COLORS]}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.metric}: {event.value} vs {event.threshold} ({new Date(event.triggeredAt).toLocaleDateString()})
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="statistics" className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Total Rules" value={mockAlertRules.length} />
          <MetricCard
            title="Active Alerts"
            value={mockAlertEvents.filter((e) => e.status === 'active').length}
          />
          <MetricCard title="Triggers Today" value={todayEvents.length} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
