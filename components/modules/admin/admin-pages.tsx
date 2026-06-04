'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { mockUsers, mockAuditLogs, mockSystemMetrics } from '@/lib/mock-data';
import { PageHeader, MetricCard } from '@/components/shared';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Warehouse,
  Users,
  TreePine,
  Bell,
} from 'lucide-react';

function useLoadingState() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return isLoading;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getRoleBadgeColor(role: string) {
  return role === 'ADMIN'
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
}

function getActionBadgeColor(action: string) {
  switch (action) {
    case 'CREATE':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'UPDATE':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'DELETE':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'UPLOAD':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

export function AdminUsers() {
  const { user } = useAuth();
  const isLoading = useLoadingState();

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users"
        description="Manage platform users"
      />

      {isLoading ? (
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getRoleBadgeColor(user.role)}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function AdminAuditLogs() {
  const { user } = useAuth();
  const isLoading = useLoadingState();

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Audit Logs"
        description="Track system activity"
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {mockAuditLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{log.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.entity} ({log.entityId})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={getActionBadgeColor(log.action)}
                    >
                      {log.action}
                    </Badge>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminSystemMetrics() {
  const { user } = useAuth();
  const isLoading = useLoadingState();

  if (user?.role !== 'ADMIN') return null;

  const metrics = [
    {
      title: 'Total Farms',
      value: mockSystemMetrics.totalFarms,
      icon: <Warehouse className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Total Users',
      value: mockSystemMetrics.totalUsers,
      icon: <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Total Analyses',
      value: mockSystemMetrics.totalAnalyses,
      icon: <TreePine className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Active Alerts',
      value: mockSystemMetrics.activeAlerts,
      icon: <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="System Metrics"
        description="Platform performance overview"
      />

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((_, i) => (
            <div
              key={i}
              className="h-32 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}
