import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

export function AnalyticsChart({ data }: { data: any[] }) {
  const hasData = data && data.length > 0;

  return (
    <Card className="col-span-1 lg:col-span-2 border-0 shadow-sm bg-slate-50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-3 w-3" />
            Temperature Trend (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                />
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }} 
                />
                <Area 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTemp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <BarChart3 className="h-8 w-8 opacity-20" />
                <p className="text-xs font-bold">Waiting for sensor data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
