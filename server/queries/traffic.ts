import { prisma } from "@/lib/prisma";
import { trafficForDays, type TrafficPoint, DEVICE_BREAKDOWN, countryBreakdown, FUNNEL_STEPS, retentionCurve } from "@/lib/data/traffic";
import { tryQuery } from "@/server/try-query";

export async function getTrafficSeries(days: number): Promise<TrafficPoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await tryQuery("getTrafficSeries", () =>
    prisma.trafficDaily.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    }).then((r) =>
      r.length > 0
        ? r.map((row) => ({
            date: row.date.toISOString().slice(0, 10),
            sessions: row.sessions,
            pageviews: row.pageviews,
            visitors: row.visitors,
            conversionRate: row.conversionRate,
          }))
        : null
    ),
    null
  );

  return rows ?? trafficForDays(days);
}

export function getDeviceBreakdown() {
  return DEVICE_BREAKDOWN;
}

export function getCountryBreakdown() {
  return countryBreakdown();
}

export function getFunnelSteps() {
  return FUNNEL_STEPS;
}

export function getRetentionCurve() {
  return retentionCurve();
}