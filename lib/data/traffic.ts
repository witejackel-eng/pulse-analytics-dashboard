import { makeRng } from "./rng";
import { COUNTRIES } from "./customers";

export interface TrafficPoint {
  date: string;
  sessions: number;
  pageviews: number;
  visitors: number;
  conversionRate: number;
}

function buildTraffic(): TrafficPoint[] {
  const rng = makeRng(19);
  const now = new Date("2026-07-04T12:00:00Z");
  const start = new Date(now);
  start.setDate(start.getDate() - 365);

  let baseSessions = 9800;
  const rows: TrafficPoint[] = [];
  for (let d = 0; d < 365; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dow = date.getUTCDay();
    const weekendDip = dow === 0 || dow === 6 ? 0.72 : 1;
    baseSessions *= 1 + 0.0009 + (rng() - 0.5) * 0.02;
    const sessions = Math.round(baseSessions * weekendDip * (0.92 + rng() * 0.16));
    const visitors = Math.round(sessions * (0.68 + rng() * 0.1));
    const pageviews = Math.round(sessions * (2.6 + rng() * 1.8));
    const conversionRate = Math.round((2.1 + rng() * 2.4) * 100) / 100;
    rows.push({ date: date.toISOString().slice(0, 10), sessions, pageviews, visitors, conversionRate });
  }
  return rows;
}

let cache: TrafficPoint[] | null = null;
export function getCuratedTraffic(): TrafficPoint[] {
  if (!cache) cache = buildTraffic();
  return cache;
}

export function trafficForDays(days: number): TrafficPoint[] {
  return getCuratedTraffic().slice(-days);
}

export const DEVICE_BREAKDOWN = [
  { device: "Desktop", value: 54.2, color: "var(--accent-blue)" },
  { device: "Mobile", value: 34.8, color: "var(--accent-emerald)" },
  { device: "Tablet", value: 8.1, color: "var(--accent-amber)" },
  { device: "Other", value: 2.9, color: "var(--accent-purple)" },
];

export function countryBreakdown() {
  const rng = makeRng(31);
  return [...COUNTRIES]
    .map((country) => ({ country, sessions: Math.round(4000 + rng() * 42000) }))
    .sort((a, b) => b.sessions - a.sessions);
}

export const FUNNEL_STEPS = [
  { step: "Visited site", value: 100 },
  { step: "Viewed pricing", value: 46 },
  { step: "Started signup", value: 24 },
  { step: "Verified email", value: 18 },
  { step: "Activated workspace", value: 12.4 },
  { step: "Converted to paid", value: 5.8 },
];

export function retentionCurve() {
  const rng = makeRng(53);
  const cohorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return cohorts.map((cohort, ci) => {
    const weeks = Array.from({ length: 8 }, (_, w) => {
      const decay = Math.exp(-w / (5.2 + ci * 0.3));
      return Math.round((30 + decay * 68 + (rng() - 0.5) * 4) * 10) / 10;
    });
    weeks[0] = 100;
    return { cohort, weeks };
  });
}
