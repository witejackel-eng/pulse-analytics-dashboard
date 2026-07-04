import { prisma } from "@/lib/prisma";
import { trafficForDays, type TrafficPoint, DEVICE_BREAKDOWN, countryBreakdown, FUNNEL_STEPS, retentionCurve } from "@/lib/data/traffic";

export async function getTrafficSeries(days: number): Promise<TrafficPoint[]> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const rows = await prisma.trafficDaily.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        sessions: r.sessions,
        pageviews: r.pageviews,
        visitors: r.visitors,
        conversionRate: r.conversionRate,
      }));
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return trafficForDays(days);
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
