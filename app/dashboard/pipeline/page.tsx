import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DynamicKpiCard, DynamicForecastChart } from "@/components/charts/dynamic-charts";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { DealsTable } from "@/components/pipeline/deals-table";
import { getDeals, getPipelineSummary, getForecast } from "@/server/queries/pipeline";

export default async function PipelinePage() {
  const [deals, summary, forecast] = await Promise.all([getDeals(), getPipelineSummary(), Promise.resolve(getForecast())]);
  const avgDealSize = Math.round(summary.openValue / (summary.openCount || 1));

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DynamicKpiCard label="Open pipeline" value={summary.openValue} format="currency-compact" changePct={5.4} icon="trending-up" accent="blue" />
        <DynamicKpiCard label="Weighted pipeline" value={summary.weightedValue} format="currency-compact" changePct={3.9} icon="dollar" accent="purple" />
        <DynamicKpiCard label="Win rate" value={summary.winRate} format="percent" changePct={2.1} icon="activity" accent="emerald" />
        <DynamicKpiCard label="Avg. deal size" value={avgDealSize} format="currency-compact" changePct={-1.2} icon="users" accent="amber" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue forecast</CardTitle>
          <CardDescription>Actuals vs. projected close, next quarter</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <DynamicForecastChart data={forecast} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline by stage</CardTitle>
          <CardDescription>{summary.openCount} open deals across the funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <PipelineBoard deals={deals} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top deals</CardTitle>
          <CardDescription>Largest deals by amount</CardDescription>
        </CardHeader>
        <CardContent>
          <DealsTable deals={deals} />
        </CardContent>
      </Card>
    </div>
  );
}
