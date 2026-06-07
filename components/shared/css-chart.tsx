import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CSSChartProps {
  title: string;
  data: { label: string; value: number }[];
  color: string;
}

export function CSSChart({ title, data, color }: CSSChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Card className="col-span-1 shadow-sm border-0 bg-slate-50/50 dark:bg-slate-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full flex items-end justify-between gap-2">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1 h-full pt-2">
              <div className="flex-1 w-full flex items-end justify-center px-[10%]">
                <div 
                  className="w-full rounded-t-md transition-all duration-500 hover:brightness-110 cursor-help" 
                  title={`${item.value}`}
                  style={{ 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color 
                  }} 
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-tighter whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
