import { Card, CardContent } from '@/components/ui/card';
import { Sun, CloudRain, Droplets, Wind, MapPin, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WeatherHeroCard({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white border-0 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
        <Sun className="h-32 w-32" />
      </div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-100 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-semibold text-xs uppercase tracking-wider">{data.location || 'Unknown Location'}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <h2 className="text-7xl font-black tracking-tighter">{data.temp ?? '--'}°</h2>
                <span className="text-3xl font-light text-emerald-100">C</span>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-2xl font-medium">{data.condition || 'Clear'}</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <p className="text-emerald-100/80 text-sm">Feels like {data.feelsLike ?? '--'}°</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-inner grid grid-cols-2 gap-x-8 gap-y-4 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20"><Droplets className="h-5 w-5 text-blue-200" /></div>
              <div>
                <p className="text-[10px] text-emerald-100 uppercase font-bold tracking-tight">Humidity</p>
                <p className="font-bold text-lg">{data.humidity ?? '--'}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20"><Wind className="h-5 w-5 text-slate-200" /></div>
              <div>
                <p className="text-[10px] text-emerald-100 uppercase font-bold tracking-tight">Wind</p>
                <p className="font-bold text-lg">{data.windSpeed ?? '--'} <span className="text-[10px] font-normal">km/h</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20"><CloudRain className="h-5 w-5 text-blue-100" /></div>
              <div>
                <p className="text-[10px] text-emerald-100 uppercase font-bold tracking-tight">Rain</p>
                <p className="font-bold text-lg">{data.rainChance ?? '0'}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20"><Thermometer className="h-5 w-5 text-orange-200" /></div>
              <div>
                <p className="text-[10px] text-emerald-100 uppercase font-bold tracking-tight">Updated</p>
                <p className="font-bold text-sm leading-tight">{data.lastUpdated || 'Just now'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
