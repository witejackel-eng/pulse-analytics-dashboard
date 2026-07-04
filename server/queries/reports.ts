import { prisma } from "@/lib/prisma";
import { getCuratedReports, getCuratedDashboards, type ReportRecord, type SavedDashboardRecord } from "@/lib/data/reports";

export async function getReports(): Promise<ReportRecord[]> {
  try {
    const rows = await prisma.report.findMany({ include: { owner: true }, orderBy: { nextRunAt: "asc" } });
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        cadence: r.cadence,
        format: r.format,
        recipients: r.recipients,
        lastRunAt: (r.lastRunAt ?? r.createdAt).toISOString(),
        nextRunAt: (r.nextRunAt ?? r.createdAt).toISOString(),
        owner: r.owner.name ?? r.owner.email,
      }));
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return getCuratedReports();
}

export async function getDashboards(): Promise<SavedDashboardRecord[]> {
  try {
    const rows = await prisma.dashboard.findMany({ include: { owner: true }, orderBy: { updatedAt: "desc" } });
    if (rows.length > 0) {
      return rows.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description ?? "",
        isDefault: d.isDefault,
        owner: d.owner.name ?? d.owner.email,
        updatedAt: d.updatedAt.toISOString(),
      }));
    }
  } catch {
    // fall through
  }
  return getCuratedDashboards();
}
