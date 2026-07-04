import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReportsList } from "@/components/reports/reports-list";
import { DashboardsList } from "@/components/reports/dashboards-list";
import { getReports, getDashboards } from "@/server/queries/reports";

export default async function ReportsPage() {
  const [reports, dashboards] = await Promise.all([getReports(), getDashboards()]);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scheduled reports</CardTitle>
              <CardDescription>{reports.length} reports running on a recurring cadence</CardDescription>
            </div>
            <CardAction>
              <Button variant="primary" size="sm">
                <Plus className="size-3.5" />
                New report
              </Button>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <ReportsList reports={reports} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved dashboards</CardTitle>
          <CardDescription>Custom views shared across your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardsList dashboards={dashboards} />
        </CardContent>
      </Card>
    </div>
  );
}
