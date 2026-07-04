import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SystemMetricsPanel } from "@/components/system/system-metrics-panel";
import { ServicesGrid } from "@/components/system/services-grid";
import { DeploymentsTable } from "@/components/system/deployments-table";
import { LogStream } from "@/components/system/log-stream";
import { getMetricSeries, getServiceStatuses, getDeployments, getLogs } from "@/server/queries/system";
import type { MetricName } from "@/lib/data/system";

const METRIC_NAMES: MetricName[] = ["CPU", "MEMORY", "LATENCY_P50", "LATENCY_P95", "ERROR_RATE", "REQUESTS_PER_MIN"];

export default async function SystemHealthPage() {
  const [seriesEntries, services, deployments, logs] = await Promise.all([
    Promise.all(METRIC_NAMES.map(async (name) => [name, await getMetricSeries(name)] as const)),
    getServiceStatuses(),
    getDeployments(),
    getLogs(300),
  ]);

  const initialSeries = Object.fromEntries(seriesEntries) as Record<MetricName, Awaited<ReturnType<typeof getMetricSeries>>>;

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <SystemMetricsPanel initialSeries={initialSeries} />

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>{services.length} production services across all regions</CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesGrid services={services} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent deployments</CardTitle>
          <CardDescription>Latest releases across all services</CardDescription>
        </CardHeader>
        <CardContent>
          <DeploymentsTable deployments={deployments} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log stream</CardTitle>
          <CardDescription>Virtualized, most recent 300 entries</CardDescription>
        </CardHeader>
        <CardContent>
          <LogStream logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}
