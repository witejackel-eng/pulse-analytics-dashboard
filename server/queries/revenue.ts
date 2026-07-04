import { prisma } from "@/lib/prisma";
import { revenueForDays, revenueKpis, type RevenuePoint } from "@/lib/data/revenue";

export async function getRevenueSeries(days: number): Promise<RevenuePoint[]> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const rows = await prisma.revenue.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        amount: r.amount,
        mrr: r.mrr,
        newMrr: r.newMrr,
        churnedMrr: r.churnedMrr,
        plan: r.plan,
      }));
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return revenueForDays(days);
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
  } catch {
    // fall through to curated
  }
  return revenueKpis(days);
}
