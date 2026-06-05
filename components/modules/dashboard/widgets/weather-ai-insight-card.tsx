import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BrainCircuit } from 'lucide-react';

export function WeatherAIInsightCard({ insight }: { insight: string }) {
  return (
    <Card className="col-span-1 border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative group">
      <div className="absolute -bottom-4 -right-4 p-8 opacity-20 rotate-12 scale-150 group-hover:scale-125 transition-transform duration-700">
        <BrainCircuit className="h-24 w-24 text-emerald-400" />
      </div>

      <CardHeader className="pb-2 border-b border-white/5 relative z-10">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
          <Sparkles className="h-3 w-3 animate-pulse" />
          AI Agronomic Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 relative z-10">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm min-h-[140px] flex items-center">
            <p className="text-sm leading-relaxed font-medium text-slate-200">
                "{insight || "Initializing AI engine for specialized crop analysis..."}"
            </p>
        </div>
        <div className="mt-6 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">WeatherAI Engine v2.4</p>
        </div>
      </CardContent>
    </Card>
  );
}
