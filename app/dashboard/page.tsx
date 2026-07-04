import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { DeviceDonut } from "@/components/charts/device-donut";
import { CountryBars } from "@/components/charts/country-bars";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { LiveEventFeed } from "@/components/dashboard/live-event-feed";
import { SystemStatusWidget } from "@/components/dashboard/system-status-widget";
import { PipelineMini } from "@/components/dashboard/pipeline-mini";
import { getRevenueKpis, getRevenueSeries } from "@/server/queries/revenue";
import { getTrafficSeries, getDeviceBreakdown, getCountryBreakdown } from "@/server/queries/traffic";
import { getCustomerSummary } from "@/server/queries/customers";
import { getRecentEvents } from "@/server/queries/events";
import { getServiceStatuses } from "@/server/queries/system";
import { getPipelineSummary } from "@/server/queries/pipeline";
import { formatCurrency } from "@/lib/utils";

export default async function OverviewPage() {
  const [
    revenueKpis,
    revenueSeries,
    trafficSeries,
    devices,
    countries,
    customerSummary,
    recentEvents,
    services,
    pipeline,
  ] = await Promise.all([
    getRevenueKpis(30),
    getRevenueSeries(90),
    getTrafficSeries(90),
    Promise.resolve(getDeviceBreakdown()),
    Promise.resolve(getCountryBreakdown()),
    getCustomerSummary(),
    getRecentEvents(8),
    getServiceStatuses(),
    getPipelineSummary(),
  ]);

  const revenueSparkline = revenueSeries.slice(-14).map((r) => r.amount);
  const trafficSparkline = trafficSeries.slice(-14).map((t) => t.sessions);
  const last30Traffic = trafficSeries.slice(-30);
  const trafficTotal = last30Traffic.reduce((s, t) => s + t.sessions, 0);
  const prevTrafficTotal = trafficSeries.slice(-60, -30).reduce((s, t) => s + t.sessions, 0) || trafficTotal;
  const trafficChangePct = Math.round(((trafficTotal - prevTrafficTotal) / prevTrafficTotal) * 1000) / 10;
  const avgConversion = last30Traffic.reduce((s, t) => s + t.conversionRate, 0) / last30Traffic.length;
  const prevConversion =
    trafficSeries.slice(-60, -30).reduce((s, t) => s + t.conversionRate, 0) / 30 || avgConversion;
  const conversionChangePct = Math.round(((avgConversion - prevConversion) / prevConversion) * 1000) / 10;

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue (30d)"
          value={revenueKpis.totalRevenue}
          format="currency-compact"
          changePct={revenueKpis.revenueChangePct}
          sparkline={revenueSparkline}
          icon="dollar"
          accent="blue"
        />
        <KpiCard
          label="MRR"
          value={revenueKpis.currentMrr}
          format="currency-compact"
          changePct={revenueKpis.mrrChangePct}
          sparkline={revenueSeries.slice(-14).map((r) => r.mrr)}
          icon="trending-up"
          accent="emerald"
        />
        <KpiCard
          label="Sessions (30d)"
          value={trafficTotal}
          format="compact"
          changePct={trafficChangePct}
          sparkline={trafficSparkline}
          icon="users"
          accent="purple"
        />
        <KpiCard
          label="Conversion rate"
          value={avgConversion}
          format="percent-2"
          changePct={conversionChangePct}
          sparkline={last30Traffic.map((t) => t.conversionRate)}
          icon="activity"
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Daily revenue over the last 90 days</CardDescription>
              </div>
              <CardAction>
                <Badge variant="emerald">
                  Net new MRR {formatCurrency(revenueKpis.netNewMrr, { compact: true })}
                </Badge>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <RevenueChart data={revenueSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic by device</CardTitle>
            <CardDescription>Share of sessions, last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceDonut data={devices} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Traffic</CardTitle>
            <CardDescription>Sessions and unique visitors over the last 90 days</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <TrafficChart data={trafficSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top countries</CardTitle>
            <CardDescription>Sessions by country, last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <CountryBars data={countries} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sales pipeline</CardTitle>
            <CardDescription>{pipeline.openCount} open deals · {pipeline.winRate}% win rate</CardDescription>
          </CardHeader>
          <CardContent>
            <PipelineMini stages={pipeline.byStage} weightedValue={pipeline.weightedValue} openValue={pipeline.openValue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              {customerSummary.active} active customers · {customerSummary.churnRate}% churn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed events={recentEvents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live event feed</CardTitle>
                <CardDescription>Streaming product events</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LiveEventFeed initial={recentEvents} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System status</CardTitle>
          <CardDescription>Uptime across all production services, last 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <SystemStatusWidget services={services.slice(0, 4)} />
            <SystemStatusWidget services={services.slice(4, 8)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
