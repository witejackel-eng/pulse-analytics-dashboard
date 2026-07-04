import { makeRng, pick } from "./rng";
import { getCuratedCustomers } from "./customers";

export type DealStage = "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";

export interface DealRecord {
  id: string;
  name: string;
  amount: number;
  stage: DealStage;
  probability: number;
  closeDate: string;
  owner: string;
}

export const STAGES: { id: DealStage; label: string }[] = [
  { id: "LEAD", label: "Lead" },
  { id: "QUALIFIED", label: "Qualified" },
  { id: "PROPOSAL", label: "Proposal" },
  { id: "NEGOTIATION", label: "Negotiation" },
  { id: "CLOSED_WON", label: "Closed Won" },
  { id: "CLOSED_LOST", label: "Closed Lost" },
];

const DEAL_NAMES = ["Platform Rollout", "Multi-year Renewal", "Seat Expansion", "API Add-on", "Enterprise Upgrade", "Data Warehouse Sync", "SSO + SCIM Bundle", "Analytics Suite"] as const;
const OWNERS = ["Reese Calloway", "Devon Ashworth", "Sam Whitfield", "Jules Okonkwo", "Marina Petrov"] as const;

function buildDeals(): DealRecord[] {
  const rng = makeRng(613);
  const now = new Date("2026-07-04T12:00:00Z");
  const customers = getCuratedCustomers();
  const rows: DealRecord[] = [];
  for (let i = 0; i < 64; i++) {
    const stage = pick(STAGES.map((s) => s.id), rng);
    const probability =
      stage === "LEAD" ? 10 + Math.round(rng() * 10) :
      stage === "QUALIFIED" ? 25 + Math.round(rng() * 15) :
      stage === "PROPOSAL" ? 45 + Math.round(rng() * 15) :
      stage === "NEGOTIATION" ? 65 + Math.round(rng() * 20) :
      stage === "CLOSED_WON" ? 100 : 0;
    const closeDate = new Date(now);
    closeDate.setDate(closeDate.getDate() + Math.round((rng() - 0.3) * 90));
    const customer = pick(customers, rng);
    rows.push({
      id: `deal_${i}`,
      name: `${customer.company} — ${pick(DEAL_NAMES, rng)}`,
      amount: Math.round(3000 + rng() * 90000),
      stage,
      probability,
      closeDate: closeDate.toISOString(),
      owner: pick(OWNERS, rng),
    });
  }
  return rows;
}

let cache: DealRecord[] | null = null;
export function getCuratedDeals(): DealRecord[] {
  if (!cache) cache = buildDeals();
  return cache;
}

export function pipelineSummary() {
  const deals = getCuratedDeals();
  const open = deals.filter((d) => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST");
  const won = deals.filter((d) => d.stage === "CLOSED_WON");
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
    winRate: Math.round((won.length / (won.length + deals.filter((d) => d.stage === "CLOSED_LOST").length || 1)) * 1000) / 10,
    byStage,
  };
}

export function forecastSeries() {
  const rng = makeRng(701);
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const lastActualIndex = 4;
  let actualBase = 210_000;
  return months.map((month, i) => {
    const isFuture = i > lastActualIndex;
    const isPivot = i === lastActualIndex;
    actualBase *= 1 + 0.03 + (rng() - 0.5) * 0.02;
    const actual = isFuture ? null : Math.round(actualBase);
    const forecast = Math.round(actualBase * (1 + rng() * 0.04));
    const forecastLow = Math.round(forecast * 0.88);
    const forecastHigh = Math.round(forecast * 1.14);
    const showForecast = isFuture || isPivot;
    return {
      month,
      actual,
      forecast: showForecast ? (isPivot ? actual : forecast) : null,
      forecastLow: showForecast ? (isPivot ? actual : forecastLow) : null,
      forecastHigh: showForecast ? (isPivot ? actual : forecastHigh) : null,
    };
  });
}
