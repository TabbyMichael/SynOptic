import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ForestryPreviewWidget({ analysis }: { analysis: any }) {
  return (
    <Card className="col-span-1 md:col-span-2 border-emerald-200 dark:border-emerald-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Latest Forestry Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Original</p>
            <div className="aspect-video bg-muted rounded-md" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Overlay</p>
            <div className="aspect-video bg-emerald-100 rounded-md" />
          </div>
        </div>
        <div className="mt-4 flex gap-6 text-sm">
          <div><span className="font-bold">{analysis.treeCount}</span> trees detected</div>
          <div>Confidence: <span className="font-bold text-emerald-600">{analysis.confidence}%</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
