import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SegmentationChart } from "@/components/charts/segmentation-chart";
import { RetentionChart } from "@/components/charts/retention-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { CustomersTable } from "@/components/tables/customers-table";
import { getCustomers, getCustomerSummary } from "@/server/queries/customers";
import { getRetentionCurve, getFunnelSteps } from "@/server/queries/traffic";

export default async function CustomersPage() {
  const [customers, summary, retention, funnel] = await Promise.all([
    getCustomers(),
    getCustomerSummary(),
    Promise.resolve(getRetentionCurve()),
    Promise.resolve(getFunnelSteps()),
  ]);

  const avgLtv = Math.round(customers.reduce((s, c) => s + c.ltv, 0) / customers.length);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total customers" value={summary.total} format="compact" changePct={4.2} icon="users" accent="blue" />
        <KpiCard label="Active MRR" value={summary.totalMrr} format="currency-compact" changePct={6.8} icon="dollar" accent="emerald" />
        <KpiCard label="Churn rate" value={summary.churnRate} format="percent" changePct={-0.6} invertColor icon="activity" accent="amber" />
        <KpiCard label="Avg. LTV" value={avgLtv} format="currency-compact" changePct={3.1} icon="trending-up" accent="purple" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Segmentation</CardTitle>
            <CardDescription>MRR contribution by customer segment</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <SegmentationChart data={summary.bySegment} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Retention by cohort</CardTitle>
            <CardDescription>Weekly retention, last 6 signup cohorts</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <RetentionChart data={retention} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acquisition funnel</CardTitle>
          <CardDescription>Visitor-to-paid conversion, last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <FunnelChart data={funnel} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>{summary.active} active accounts across {summary.bySegment.length} segments</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomersTable data={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
