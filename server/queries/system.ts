import { prisma } from "@/lib/prisma";
import {
  getCuratedMetric,
  getServiceStatuses as curatedServiceStatuses,
  getDeployments as curatedDeployments,
  getLogs as curatedLogs,
  type MetricName,
  type MetricPoint,
} from "@/lib/data/system";
import { tryQuery } from "@/server/try-query";

export async function getMetricSeries(name: MetricName, service = "api-gateway"): Promise<MetricPoint[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const rows = await tryQuery("getMetricSeries", () =>
    prisma.metric.findMany({
      where: { name, service, timestamp: { gte: since } },
      orderBy: { timestamp: "asc" },
    }).then((r) =>
      r.length > 0
        ? r.map((row) => ({ timestamp: row.timestamp.toISOString(), value: row.value }))
        : null
    ),
    null
  );

  return rows ?? getCuratedMetric(name, service);
}

export async function getServiceStatuses() {
  const rows = await tryQuery("getServiceStatuses", () =>
    prisma.service.findMany({ orderBy: { name: "asc" } }).then((r) =>
      r.length > 0
        ? r.map((s) => ({ name: s.name, status: s.status, uptime90d: s.uptime90d, region: s.region }))
        : null
    ),
    null
  );

  return rows ?? curatedServiceStatuses();
}

export async function getDeployments() {
  const rows = await tryQuery("getDeployments", () =>
    prisma.deployment.findMany({ orderBy: { createdAt: "desc" }, take: 40 }).then((r) =>
      r.length > 0
        ? r.map((d) => ({
            id: d.id,
            service: d.service,
            version: d.version,
            status: d.status,
            author: d.author,
            commitSha: d.commitSha,
            durationSec: d.durationSec,
            createdAt: d.createdAt.toISOString(),
          }))
        : null
    ),
    null
  );

  return rows ?? curatedDeployments();
}

export async function getLogs(count = 300) {
  const rows = await tryQuery("getLogs", () =>
    prisma.logEntry.findMany({ orderBy: { timestamp: "desc" }, take: count }).then((r) =>
      r.length > 0
        ? r.map((l) => ({
            id: l.id,
            level: l.level,
            service: l.service,
            message: l.message,
            timestamp: l.timestamp.toISOString(),
          }))
        : null
    ),
    null
  );

  return rows ?? curatedLogs(count);
}