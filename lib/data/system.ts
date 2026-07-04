import { makeRng, pick } from "./rng";

export const SERVICES = [
  "api-gateway", "auth-service", "billing-service", "ingest-pipeline",
  "query-engine", "notification-worker", "web-app", "websocket-hub",
] as const;

export type MetricName =
  | "CPU" | "MEMORY" | "LATENCY_P50" | "LATENCY_P95" | "LATENCY_P99"
  | "ERROR_RATE" | "REQUESTS_PER_MIN" | "AVAILABILITY";

export interface MetricPoint {
  timestamp: string;
  value: number;
}

const METRIC_DEFS: Record<MetricName, { base: number; jitter: number }> = {
  CPU: { base: 42, jitter: 18 },
  MEMORY: { base: 61, jitter: 12 },
  LATENCY_P50: { base: 84, jitter: 20 },
  LATENCY_P95: { base: 240, jitter: 60 },
  LATENCY_P99: { base: 520, jitter: 140 },
  ERROR_RATE: { base: 0.4, jitter: 0.35 },
  REQUESTS_PER_MIN: { base: 8200, jitter: 2200 },
  AVAILABILITY: { base: 99.95, jitter: 0.06 },
};

function buildSeries(name: MetricName, seedOffset: number): MetricPoint[] {
  const rng = makeRng(101 + seedOffset);
  const def = METRIC_DEFS[name];
  const now = new Date("2026-07-04T12:00:00Z");
  const points = 24 * 12;
  const rows: MetricPoint[] = [];
  for (let p = 0; p < points; p++) {
    const timestamp = new Date(now.getTime() - (points - p) * 5 * 60 * 1000);
    const wave = Math.sin(p / 14) * def.jitter * 0.5;
    const noise = (rng() - 0.5) * def.jitter;
    const value = Math.max(0, def.base + wave + noise);
    rows.push({ timestamp: timestamp.toISOString(), value: Math.round(value * 100) / 100 });
  }
  return rows;
}

const cache = new Map<string, MetricPoint[]>();
export function getCuratedMetric(name: MetricName, service: string = "api-gateway"): MetricPoint[] {
  const key = `${name}:${service}`;
  if (!cache.has(key)) {
    const seedOffset = SERVICES.indexOf(service as (typeof SERVICES)[number]) * 7 + name.length;
    cache.set(key, buildSeries(name, seedOffset));
  }
  return cache.get(key)!;
}

export function currentValue(name: MetricName, service?: string): number {
  const series = getCuratedMetric(name, service);
  return series[series.length - 1]?.value ?? 0;
}

export type ServiceStatus = "OPERATIONAL" | "DEGRADED" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";

export function getServiceStatuses() {
  const rng = makeRng(211);
  return SERVICES.map((name, i) => ({
    name,
    status: (i === 3 ? "DEGRADED" : "OPERATIONAL") as ServiceStatus,
    uptime90d: Math.round((99.5 + rng() * 0.5) * 1000) / 1000,
    region: pick(["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"] as const, rng),
  }));
}

export type DeploymentStatus = "SUCCESS" | "FAILED" | "IN_PROGRESS" | "ROLLED_BACK";

export interface DeploymentRecord {
  id: string;
  service: string;
  version: string;
  status: DeploymentStatus;
  author: string;
  commitSha: string;
  durationSec: number;
  createdAt: string;
}

const OWNERS = ["Reese Calloway", "Devon Ashworth", "Sam Whitfield", "Jules Okonkwo", "Marina Petrov"] as const;

export function getDeployments(): DeploymentRecord[] {
  const rng = makeRng(307);
  const now = new Date("2026-07-04T12:00:00Z");
  const rows: DeploymentRecord[] = [];
  for (let i = 0; i < 40; i++) {
    const createdAt = new Date(now.getTime() - rng() * 1000 * 60 * 60 * 24 * 30);
    const statusRoll = rng();
    rows.push({
      id: `dep_${i}`,
      service: pick(SERVICES, rng),
      version: `v${1 + Math.floor(rng() * 4)}.${Math.floor(rng() * 20)}.${Math.floor(rng() * 10)}`,
      status: statusRoll < 0.86 ? "SUCCESS" : statusRoll < 0.94 ? "ROLLED_BACK" : "FAILED",
      author: pick(OWNERS, rng),
      commitSha: Array.from({ length: 7 }, () => "0123456789abcdef"[Math.floor(rng() * 16)]).join(""),
      durationSec: Math.round(30 + rng() * 240),
      createdAt: createdAt.toISOString(),
    });
  }
  return rows.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogRecord {
  id: string;
  level: LogLevel;
  service: string;
  message: string;
  timestamp: string;
}

const LOG_MESSAGES = [
  "Request completed successfully",
  "Cache miss for key metrics:rollup:daily",
  "Rate limit threshold approaching for org pulse-analytics",
  "Database connection pool at 78% utilization",
  "Webhook delivery failed after 3 retries",
  "Background job ingest-events finished in 4.2s",
  "Slow query detected (>1200ms) on customers table",
  "TLS certificate renewed for api.pulse.io",
  "Autoscaler added 2 replicas to query-engine",
  "Unhandled exception in notification-worker",
] as const;

export function getLogs(count = 300): LogRecord[] {
  const rng = makeRng(401);
  const now = new Date("2026-07-04T12:00:00Z");
  const rows: LogRecord[] = [];
  for (let i = 0; i < count; i++) {
    const roll = rng();
    const level: LogLevel = roll < 0.55 ? "INFO" : roll < 0.8 ? "DEBUG" : roll < 0.94 ? "WARN" : "ERROR";
    rows.push({
      id: `log_${i}`,
      level,
      service: pick(SERVICES, rng),
      message: pick(LOG_MESSAGES, rng),
      timestamp: new Date(now.getTime() - rng() * 1000 * 60 * 60 * 6).toISOString(),
    });
  }
  return rows.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}
