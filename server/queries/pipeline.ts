import { prisma } from "@/lib/prisma";
import { getCuratedDeals, pipelineSummary as curatedPipelineSummary, forecastSeries, STAGES, type DealRecord } from "@/lib/data/pipeline";
import { tryQuery } from "@/server/try-query";

export async function getDeals(): Promise<DealRecord[]> {
  const rows = await tryQuery("getDeals", () =>
    prisma.deal.findMany({ orderBy: { amount: "desc" } }).then((r) =>
      r.length > 0
        ? r.map((d) => ({
            id: d.id,
            name: d.name,
            amount: d.amount,
            stage: d.stage,
            probability: d.probability,
            closeDate: d.closeDate.toISOString(),
            owner: d.owner,
          }))
        : null
    ),
    null
  );

  return rows ?? getCuratedDeals();
}

export async function getPipelineSummary() {
  try {
    const deals = await getDeals();
    if (deals.length > 0) {
      const open = deals.filter((d) => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST");
      const won = deals.filter((d) => d.stage === "CLOSED_WON");
      const lost = deals.filter((d) => d.stage === "CLOSED_LOST");
      const weightedValue = open.reduce((s, d) => s + (d.amount * d.probability) / 100, 0);
      const byStage = STAGES.map((s) => ({
        stage: s.id,
        label: s.label,
        count: deals.filter((d) => d.stage === s.id).length,
        value: deals.filter((d) => d.stage === s.id).reduce((sum, d) => sum + d.amount, 0),
      }));
      return {
        openCount: open.length,
        openValue: open.reduce((s, d) => s + d.amount, 0),
        weightedValue: Math.round(weightedValue),
        wonValue: won.reduce((s, d) => s + d.amount, 0),
        winRate: Math.round((won.length / (won.length + lost.length || 1)) * 1000) / 10,
        byStage,
      };
    }
  } catch (error) {
    console.warn("[db-fallback] getPipelineSummary:", error instanceof Error ? error.message : error);
  }
  return curatedPipelineSummary();
}

export function getForecast() {
  return forecastSeries();
}