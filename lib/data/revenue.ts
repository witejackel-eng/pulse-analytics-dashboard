import { makeRng, pick } from "./rng";
import { PLANS } from "./customers";

export interface RevenuePoint {
  date: string;
  amount: number;
  mrr: number;
  newMrr: number;
  churnedMrr: number;
  plan: string;
}

const REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"] as const;

function buildRevenue(): RevenuePoint[] {
  const rng = makeRng(7);
  const now = new Date("2026-07-04T12:00:00Z");
  const start = new Date(now);
  start.setDate(start.getDate() - 365);

  let baseMrr = 182_000;
  const rows: RevenuePoint[] = [];
  for (let d = 0; d < 365; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const growth = 1 + 0.0011 + (rng() - 0.5) * 0.01;
    baseMrr *= growth;
    const newMrr = baseMrr * (0.02 + rng() * 0.015);
    const churnedMrr = baseMrr * (0.005 + rng() * 0.008);
    rows.push({
      date: date.toISOString().slice(0, 10),
      amount: Math.round(baseMrr / 30 + (rng() - 0.5) * 2000),
      mrr: Math.round(baseMrr),
      newMrr: Math.round(newMrr),
      churnedMrr: Math.round(churnedMrr),
      plan: pick(PLANS, rng),
    });
  }
  return rows;
}

let cache: RevenuePoint[] | null = null;
export function getCuratedRevenue(): RevenuePoint[] {
  if (!cache) cache = buildRevenue();
  return cache;
}

export function revenueForDays(days: number): RevenuePoint[] {
  const all = getCuratedRevenue();
  return all.slice(-days);
}

export function revenueKpis(days: number) {
  const rows = revenueForDays(days);
  const prevRows = getCuratedRevenue().slice(-days * 2, -days);
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const prevTotal = prevRows.reduce((s, r) => s + r.amount, 0) || total;
  const currentMrr = rows[rows.length - 1]?.mrr ?? 0;
  const startMrr = rows[0]?.mrr ?? currentMrr;
  const newMrr = rows.reduce((s, r) => s + r.newMrr, 0);
  const churnedMrr = rows.reduce((s, r) => s + r.churnedMrr, 0);
  const change = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : 0;
  const mrrChange = startMrr ? ((currentMrr - startMrr) / startMrr) * 100 : 0;

  return {
    totalRevenue: total,
    revenueChangePct: Math.round(change * 10) / 10,
    currentMrr,
    mrrChangePct: Math.round(mrrChange * 10) / 10,
    newMrr: Math.round(newMrr),
    churnedMrr: Math.round(churnedMrr),
    netNewMrr: Math.round(newMrr - churnedMrr),
  };
}

export { REGIONS };
