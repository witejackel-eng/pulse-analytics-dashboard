import { makeRng, pick } from "./rng";

export type CustomerSegment = "ENTERPRISE" | "MID_MARKET" | "SMB" | "STARTUP";
export type CustomerStatus = "ACTIVE" | "TRIAL" | "PAST_DUE" | "CHURNED";

export interface CustomerRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  avatarSeed: string;
  plan: string;
  mrr: number;
  ltv: number;
  status: CustomerStatus;
  segment: CustomerSegment;
  country: string;
  healthScore: number;
  sessionsCount: number;
  lastActiveAt: string;
  createdAt: string;
}

const COMPANIES = [
  "Northwind Logistics", "Vector Dynamics", "Brightfield Capital", "Cascade Robotics",
  "Ionic Health", "Latitude Freight", "Solstice Media", "Anchor Biotech",
  "Fathom Analytics Inc", "Meridian Foods", "Silverline Insurance", "Kestrel Aerospace",
  "Harbor Payments", "Orbital Studios", "Granite Systems", "Wavelength Telecom",
  "Copperfield Retail", "Bluepeak Energy", "Nimbus Cloud Co", "Redwood Legal",
  "Arcline Manufacturing", "Tidewater Shipping", "Vertex Materials", "Frostline Apparel",
  "Cobalt Security", "Palisade Realty", "Driftwood Hospitality", "Ember Robotics",
  "Cinderpoint Games", "Larkspur Pharma",
] as const;

const FIRST_NAMES = ["Ava","Liam","Noah","Emma","Olivia","Ethan","Mia","Lucas","Sofia","Mason","Isabella","Elijah","Amelia","James","Harper","Benjamin","Evelyn","Henry","Camila","Alexander"] as const;
const LAST_NAMES = ["Carter","Nguyen","Patel","Kim","Rossi","Muller","Chen","Silva","Andersson","Kowalski","Dubois","Okafor","Haddad","Ivanov","Larsen","Fischer","Suzuki","Reyes","Novak","Costa"] as const;
export const COUNTRIES = ["United States","United Kingdom","Germany","Canada","Australia","France","Netherlands","Singapore","Japan","Brazil","India","Sweden"] as const;
export const PLANS = ["Starter", "Growth", "Business", "Enterprise"] as const;

function buildCustomers(): CustomerRecord[] {
  const rng = makeRng(42);
  const now = new Date("2026-07-04T12:00:00Z");
  const start = new Date(now);
  start.setDate(start.getDate() - 365);

  const rows: CustomerRecord[] = [];
  for (let i = 0; i < 120; i++) {
    const first = pick(FIRST_NAMES, rng);
    const last = pick(LAST_NAMES, rng);
    const company = COMPANIES[i % COMPANIES.length];
    const segment = pick(["ENTERPRISE", "MID_MARKET", "SMB", "STARTUP"] as const, rng);
    const mrr =
      segment === "ENTERPRISE" ? 4000 + rng() * 12000 :
      segment === "MID_MARKET" ? 1200 + rng() * 3000 :
      segment === "SMB" ? 300 + rng() * 900 :
      49 + rng() * 250;
    const statusRoll = rng();
    const status: CustomerStatus =
      statusRoll < 0.78 ? "ACTIVE" :
      statusRoll < 0.88 ? "TRIAL" :
      statusRoll < 0.95 ? "PAST_DUE" : "CHURNED";

    const createdAt = new Date(start);
    createdAt.setDate(createdAt.getDate() + Math.floor(rng() * 360));

    rows.push({
      id: `cus_${i.toString(36).padStart(4, "0")}`,
      name: `${first} ${last}`,
      company,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12)}.com`,
      avatarSeed: `${first}${last}${i}`,
      plan: pick(PLANS, rng),
      mrr: Math.round(mrr),
      ltv: Math.round(mrr * (8 + rng() * 30)),
      status,
      segment,
      country: pick(COUNTRIES, rng),
      healthScore: Math.round(30 + rng() * 70),
      sessionsCount: Math.round(rng() * 4000),
      lastActiveAt: new Date(now.getTime() - rng() * 1000 * 60 * 60 * 24 * 21).toISOString(),
      createdAt: createdAt.toISOString(),
    });
  }
  return rows;
}

let cache: CustomerRecord[] | null = null;
export function getCuratedCustomers(): CustomerRecord[] {
  if (!cache) cache = buildCustomers();
  return cache;
}

export function customerSummary() {
  const customers = getCuratedCustomers();
  const active = customers.filter((c) => c.status === "ACTIVE");
  const churned = customers.filter((c) => c.status === "CHURNED");
  const totalMrr = active.reduce((sum, c) => sum + c.mrr, 0);
  const avgHealth = Math.round(customers.reduce((s, c) => s + c.healthScore, 0) / customers.length);
  const bySegment = (["ENTERPRISE", "MID_MARKET", "SMB", "STARTUP"] as const).map((segment) => ({
    segment,
    count: customers.filter((c) => c.segment === segment).length,
    mrr: customers.filter((c) => c.segment === segment).reduce((s, c) => s + c.mrr, 0),
  }));
  return {
    total: customers.length,
    active: active.length,
    churned: churned.length,
    churnRate: Math.round((churned.length / customers.length) * 1000) / 10,
    totalMrr,
    avgHealth,
    bySegment,
  };
}
