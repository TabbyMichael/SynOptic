import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Trees } from 'lucide-react';

export function ForestryStatusWidget({ stats }: { stats: any }) {
  return (
    <Card className="col-span-1 md:col-span-1 border-emerald-200 dark:border-emerald-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <Trees className="h-4 w-4" />
          Forestry Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Analyses</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Healthy Trees</p>
            <p className="text-xl font-bold">{stats.healthy}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Coverage</p>
            <p className="text-xl font-bold">{stats.coverage}%</p>
          </div>
        </div>
        <a href="/forestry/results" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
          View all results <ArrowRight className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
