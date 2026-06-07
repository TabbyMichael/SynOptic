'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, CartesianGrid } from "recharts";

interface ChartCardProps {
  title: string;
  data?: any[];
  dataKey?: string;
  color?: string;
  type?: 'line' | 'bar' | 'area';
  children?: React.ReactNode;
}

export function ChartCard({ title, data, dataKey, color, type = 'line', children }: ChartCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card className="col-span-1 shadow-sm border-0 h-[350px]">
        <CardHeader><h2 className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{title}</h2></CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center text-slate-500">
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 shadow-sm border-0 h-[350px]">
      <CardHeader>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{title}</h2>
      </CardHeader>
      <CardContent>
        {children ? (
          <div className="h-[250px] w-full">{children}</div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {type === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey={dataKey!} fill={color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              ) : type === 'area' ? (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey={dataKey!} fill={color} stroke={color} strokeWidth={2} fillOpacity={0.2} isAnimationActive={false} />
                </AreaChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey={dataKey!} stroke={color} strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: 'white'}} activeDot={{r: 6}} isAnimationActive={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
