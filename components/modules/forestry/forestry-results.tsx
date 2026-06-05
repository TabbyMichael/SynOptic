'use client';

import { TreePine, Cloud, BarChart3, Activity, ArrowRight, Layers } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { MetricCard } from '@/components/shared/metric-card';
import { mockForestryResults } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ForestryResults() {
  const result = mockForestryResults[0];
  const { treeCount, canopyCoverage, density, confidenceScore, healthDistribution, imageUrl } = result;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Forestry Analysis Report" 
        description={`Analysis performed on ${new Date(result.analyzedAt).toLocaleDateString()}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualization Overlay</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-b-lg">
                <img
                  src={imageUrl}
                  alt="Original Satellite Imagery"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply flex items-center justify-center">
                  <span className="bg-white/90 px-4 py-2 rounded-full font-semibold text-emerald-900 shadow-lg border border-emerald-200">
                    AI Detection Overlay Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <MetricCard
            title="Tree Count"
            value={treeCount}
            icon={<TreePine className="h-5 w-5 text-emerald-600" />}
          />
          <MetricCard
            title="Canopy Coverage"
            value={`${canopyCoverage}%`}
            icon={<Cloud className="h-5 w-5 text-emerald-600" />}
          />
          <MetricCard
            title="Density"
            value={`${density} trees/acre`}
            icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
          />
          <MetricCard
            title="AI Confidence"
            value={`${confidenceScore}%`}
            icon={<Activity className="h-5 w-5 text-emerald-600" />}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Distribution Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex h-10 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
            <div
              className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${healthDistribution.healthy}%` }}
            >
              {healthDistribution.healthy}%
            </div>
            <div
              className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${healthDistribution.moderate}%` }}
            >
              {healthDistribution.moderate}%
            </div>
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${healthDistribution.poor}%` }}
            >
              {healthDistribution.poor}%
            </div>
          </div>
          <div className="flex gap-8 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm"></div>
              <span className="text-sm font-medium">Healthy: {healthDistribution.healthy}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-sm font-medium">Moderate: {healthDistribution.moderate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-sm font-medium">Poor: {healthDistribution.poor}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
