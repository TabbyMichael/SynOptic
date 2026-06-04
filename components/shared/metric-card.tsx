'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ title, value, change, changeLabel, icon, className }: MetricCardProps) {
  const safeChange = change ?? 0;
  const trend =
    change !== undefined
      ? safeChange > 0
        ? 'up'
        : safeChange < 0
        ? 'down'
        : 'neutral'
      : undefined;

  const trendColor =
    trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend === 'down'
      ? 'text-red-600 dark:text-red-400'
      : 'text-muted-foreground';

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon && (
            <div className="rounded-md bg-emerald-50 p-2 dark:bg-emerald-950/30">
              {icon}
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            <TrendIcon className={cn('h-4 w-4', trendColor)} />
            <span className={cn('text-sm font-medium', trendColor)}>
              {safeChange > 0 ? '+' : ''}
              {safeChange}%
            </span>
            {changeLabel && (
              <span className="text-xs text-muted-foreground ml-1">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
