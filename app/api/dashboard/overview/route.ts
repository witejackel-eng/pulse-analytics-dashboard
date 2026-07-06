import { auth } from "@/auth";
import { getRevenueKpis, getRevenueSeries } from "@/server/queries/revenue";
import { getTrafficSeries, getDeviceBreakdown, getCountryBreakdown } from "@/server/queries/traffic";
import { getCustomerSummary } from "@/server/queries/customers";
import { getRecentEvents } from "@/server/queries/events";
import { getServiceStatuses } from "@/server/queries/system";
import { getPipelineSummary } from "@/server/queries/pipeline";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(Number(searchParams.get("days") ?? 90), 1), 365);

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
    getRevenueSeries(days),
    getTrafficSeries(days),
    Promise.resolve(getDeviceBreakdown()),
    Promise.resolve(getCountryBreakdown()),
    getCustomerSummary(),
    getRecentEvents(8),
    getServiceStatuses(),
    getPipelineSummary(),
  ]);

  return NextResponse.json({
    revenueKpis,
    revenueSeries,
    trafficSeries,
    devices,
    countries,
    customerSummary,
    recentEvents,
    services,
    pipeline,
  });
}