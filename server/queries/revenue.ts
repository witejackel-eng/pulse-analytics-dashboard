import { prisma } from "@/lib/prisma";
import { revenueForDays, revenueKpis, type RevenuePoint } from "@/lib/data/revenue";
import { tryQuery } from "@/server/try-query";

export async function getRevenueSeries(days: number): Promise<RevenuePoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await tryQuery("getRevenueSeries", () =>
    prisma.revenue.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    }).then((r) =>
      r.length > 0
        ? r.map((row) => ({
            date: row.date.toISOString().slice(0, 10),
            amount: row.amount,
            mrr: row.mrr,
            newMrr: row.newMrr,
            churnedMrr: row.churnedMrr,
            plan: row.plan,
          }))
        : null
    ),
    null
  );

  return rows ?? revenueForDays(days);
}

export async function getRevenueKpis(days: number) {
  try {
    const series = await getRevenueSeries(days * 2);
    if (series.length >= days) {
      const rows = series.slice(-days);
      const prevRows = series.slice(-days * 2, -days);
      const total = rows.reduce((s, r) => s + r.amount, 0);
      const prevTotal = prevRows.reduce((s, r) => s + r.amount, 0) || total;
      const currentMrr = rows[rows.length - 1]?.mrr ?? 0;
      const startMrr = rows[0]?.mrr ?? currentMrr;
      const newMrr = rows.reduce((s, r) => s + r.newMrr, 0);
      const churnedMrr = rows.reduce((s, r) => s + r.churnedMrr, 0);
      return {
        totalRevenue: total,
        revenueChangePct: Math.round((prevTotal ? ((total - prevTotal) / prevTotal) * 100 : 0) * 10) / 10,
        currentMrr,
        mrrChangePct: Math.round((startMrr ? ((currentMrr - startMrr) / startMrr) * 100 : 0) * 10) / 10,
        newMrr: Math.round(newMrr),
        churnedMrr: Math.round(churnedMrr),
        netNewMrr: Math.round(newMrr - churnedMrr),
      };
    }
  } catch (error) {
    console.warn("[db-fallback] getRevenueKpis:", error instanceof Error ? error.message : error);
  }
  return revenueKpis(days);
}