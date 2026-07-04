import { prisma } from "@/lib/prisma";
import {
  getCuratedMetric,
  getServiceStatuses as curatedServiceStatuses,
  getDeployments as curatedDeployments,
  getLogs as curatedLogs,
  type MetricName,
  type MetricPoint,
} from "@/lib/data/system";

export async function getMetricSeries(name: MetricName, service = "api-gateway"): Promise<MetricPoint[]> {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const rows = await prisma.metric.findMany({
      where: { name, service, timestamp: { gte: since } },
      orderBy: { timestamp: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({ timestamp: r.timestamp.toISOString(), value: r.value }));
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return getCuratedMetric(name, service);
}

export async function getServiceStatuses() {
  try {
    const rows = await prisma.service.findMany({ orderBy: { name: "asc" } });
    if (rows.length > 0) {
      return rows.map((s) => ({ name: s.name, status: s.status, uptime90d: s.uptime90d, region: s.region }));
    }
  } catch {
    // fall through
  }
  return curatedServiceStatuses();
}

export async function getDeployments() {
  try {
    const rows = await prisma.deployment.findMany({ orderBy: { createdAt: "desc" }, take: 40 });
    if (rows.length > 0) {
      return rows.map((d) => ({
        id: d.id,
        service: d.service,
        version: d.version,
        status: d.status,
        author: d.author,
        commitSha: d.commitSha,
        durationSec: d.durationSec,
        createdAt: d.createdAt.toISOString(),
      }));
    }
  } catch {
    // fall through
  }
  return curatedDeployments();
}

export async function getLogs(count = 300) {
  try {
    const rows = await prisma.logEntry.findMany({ orderBy: { timestamp: "desc" }, take: count });
    if (rows.length > 0) {
      return rows.map((l) => ({
        id: l.id,
        level: l.level,
        service: l.service,
        message: l.message,
        timestamp: l.timestamp.toISOString(),
      }));
    }
  } catch {
    // fall through
  }
  return curatedLogs(count);
}
