'use client';

import { TreePine, Cloud, BarChart3, Activity } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { MetricCard } from '@/components/shared/metric-card';
import { mockForestryResults } from '@/lib/mock-data';

export function ForestryResults() {
  const result = mockForestryResults[0];
  const { treeCount, canopyCoverage, density, confidenceScore, healthDistribution, imageUrl } = result;

  return (
    <div className="space-y-8">
      <PageHeader title="Analysis Results" />

      {/* Main Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Display */}
        <div className="flex items-center justify-center rounded-lg border border-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt="Satellite imagery"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Results Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
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
            title="Confidence"
            value={`${confidenceScore}%`}
            icon={<Activity className="h-5 w-5 text-emerald-600" />}
          />
        </div>
      </div>

      {/* Health Distribution Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Health Distribution</h3>
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex h-8 rounded-lg overflow-hidden border border-gray-200">
            <div
              className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${healthDistribution.healthy}%` }}
            >
              {healthDistribution.healthy > 15 && `${healthDistribution.healthy}%`}
            </div>
            <div
              className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${healthDistribution.moderate}%` }}
            >
              {healthDistribution.moderate > 15 && `${healthDistribution.moderate}%`}
            </div>
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${healthDistribution.poor}%` }}
            >
              {healthDistribution.poor > 15 && `${healthDistribution.poor}%`}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600">Healthy: {healthDistribution.healthy}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Moderate: {healthDistribution.moderate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Poor: {healthDistribution.poor}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Before/After Comparison</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <img
              src={mockForestryResults[0].imageUrl}
              alt="Before"
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-gray-50 text-center text-sm font-medium text-gray-700">
              Before
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <img
              src={mockForestryResults[1].imageUrl}
              alt="After"
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-gray-50 text-center text-sm font-medium text-gray-700">
              After
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
