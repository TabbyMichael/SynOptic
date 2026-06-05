import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WeatherAlertsPanel({ alerts }: { alerts: any[] }) {
  const hasAlerts = alerts && alerts.length > 0;

  return (
    <Card className="col-span-1 border-0 shadow-sm bg-slate-50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Bell className="h-3 w-3" />
            Active Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hasAlerts ? alerts.slice(0, 4).map((alert, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 group">
            <div className={cn(
                "p-2 rounded-lg shrink-0 group-hover:scale-110 transition-transform",
                alert.severity === 'High' ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
            )}>
                <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{alert.message}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Sensor Trigger</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] text-muted-foreground">Recent</span>
                </div>
            </div>
            <Badge variant="outline" className={cn(
                "text-[9px] uppercase font-black px-1.5 h-5",
                alert.severity === 'High' ? "border-red-200 text-red-600 bg-red-50/50" : "border-amber-200 text-amber-600 bg-amber-50/50"
            )}>
                {alert.severity}
            </Badge>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <Info className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-400">All systems clear</p>
            <p className="text-[10px] text-slate-300">No active alerts for your farms</p>
          </div>
        )}
        {hasAlerts && alerts.length > 4 && (
            <p className="text-[10px] text-center text-muted-foreground pt-1 font-medium italic">+{alerts.length - 4} more alerts hidden</p>
        )}
      </CardContent>
    </Card>
  );
}
