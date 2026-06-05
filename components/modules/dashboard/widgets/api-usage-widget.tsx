import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function APIUsageWidget({ usage }: { usage: any }) {
  const pct = usage.total > 0 ? (usage.remaining / usage.total) * 100 : 0;
  const isLow = pct < 20;

  return (
    <Card className="col-span-1 border-0 shadow-sm bg-slate-50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Activity className="h-3 w-3" />
            WeatherAI Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-black text-emerald-900 dark:text-emerald-100">Operational</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">All systems go</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">99.9%</p>
                <p className="text-[9px] text-emerald-600 dark:text-emerald-500 uppercase font-bold">Uptime</p>
            </div>
        </div>

        <div className="space-y-3 px-1">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Requests Remaining</p>
                    <div className="flex items-baseline gap-1">
                        <p className={cn("text-3xl font-black tracking-tight", isLow ? "text-red-500" : "text-slate-900 dark:text-slate-100")}>{usage.remaining}</p>
                        <p className="text-xs font-bold text-muted-foreground">/ {usage.total}</p>
                    </div>
                </div>
                <div className={cn(
                    "p-2 rounded-lg",
                    isLow ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                )}>
                    <Zap className="h-4 w-4" />
                </div>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700">
                <div 
                    className={cn(
                        "h-full transition-all duration-1000 ease-out shadow-inner",
                        isLow ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-emerald-500"
                    )} 
                    style={{ width: `${pct}%` }} 
                />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium italic">
                {isLow ? "Warning: Quota nearly exhausted" : "Monthly quota reset in 22 days"}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
