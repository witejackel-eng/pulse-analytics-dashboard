import { prisma } from "@/lib/prisma";
import { getCuratedReports, getCuratedDashboards, type ReportRecord, type SavedDashboardRecord } from "@/lib/data/reports";
import { tryQuery } from "@/server/try-query";

export async function getReports(): Promise<ReportRecord[]> {
  const rows = await tryQuery("getReports", () =>
    prisma.report.findMany({ include: { owner: true }, orderBy: { nextRunAt: "asc" } }).then((r) =>
      r.length > 0
        ? r.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description ?? "",
            cadence: row.cadence,
            format: row.format,
            recipients: row.recipients,
            lastRunAt: (row.lastRunAt ?? row.createdAt).toISOString(),
            nextRunAt: (row.nextRunAt ?? row.createdAt).toISOString(),
            owner: row.owner.name ?? row.owner.email,
          }))
        : null
    ),
    null
  );

  return rows ?? getCuratedReports();
}

export async function getDashboards(): Promise<SavedDashboardRecord[]> {
  const rows = await tryQuery("getDashboards", () =>
    prisma.dashboard.findMany({ include: { owner: true }, orderBy: { updatedAt: "desc" } }).then((r) =>
      r.length > 0
        ? r.map((d) => ({
            id: d.id,
            name: d.name,
            description: d.description ?? "",
            isDefault: d.isDefault,
            owner: d.owner.name ?? d.owner.email,
            updatedAt: d.updatedAt.toISOString(),
          }))
        : null
    ),
    null
  );

  return rows ?? getCuratedDashboards();
}