import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  rainChance: number;
}

const iconMap: Record<string, any> = {
  '☀️': <Sun className="h-6 w-6 text-orange-400" />,
  '🌤️': <Cloud className="h-6 w-6 text-slate-400" />,
  '☁️': <Cloud className="h-6 w-6 text-slate-500" />,
  '🌧️': <CloudRain className="h-6 w-6 text-blue-400" />,
  '🌦️': <CloudRain className="h-6 w-6 text-blue-300" />,
  '⛈️': <CloudLightning className="h-6 w-6 text-purple-400" />,
  '❄️': <Snowflake className="h-6 w-6 text-blue-200" />,
};

export function WeatherForecastWidget({ data }: { data: ForecastDay[] }) {
  const hasData = data && data.length > 0;

  return (
    <Card className="col-span-1 md:col-span-3 border-0 shadow-sm bg-slate-50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            7-Day Forecast
            {!hasData && <span className="text-[10px] font-normal lowercase">(No data available)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-4">
            {hasData ? data.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-3 min-w-[100px] p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-105">
                <span className="text-xs font-bold text-slate-500 uppercase">{day.day}</span>
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-full">
                    {iconMap[day.icon] || <Sun className="h-6 w-6 text-orange-400" />}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-base font-black">{day.high}°</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{day.low}°</span>
                </div>
                <div className="flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-400" />
                    <span className="text-[10px] font-black text-blue-500">{day.rainChance}%</span>
                </div>
              </div>
            )) : (
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 min-w-[100px] p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse">
                   <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded" />
                   <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
                   <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                   <div className="h-3 w-6 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
