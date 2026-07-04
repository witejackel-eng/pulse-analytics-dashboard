export interface ReportRecord {
  id: string;
  name: string;
  description: string;
  cadence: "DAILY" | "WEEKLY" | "MONTHLY";
  format: "CSV" | "PDF";
  recipients: string[];
  lastRunAt: string;
  nextRunAt: string;
  owner: string;
}

export function getCuratedReports(): ReportRecord[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: "r1", name: "Weekly Executive Summary", description: "Revenue, retention, and growth KPIs", cadence: "WEEKLY", format: "PDF", recipients: ["admin@pulse.io"], lastRunAt: new Date(now - 6 * day).toISOString(), nextRunAt: new Date(now + day).toISOString(), owner: "Reese Calloway" },
    { id: "r2", name: "Monthly Board Deck Data", description: "MRR, churn, pipeline for board reporting", cadence: "MONTHLY", format: "PDF", recipients: ["admin@pulse.io", "analyst@pulse.io"], lastRunAt: new Date(now - 20 * day).toISOString(), nextRunAt: new Date(now + 10 * day).toISOString(), owner: "Reese Calloway" },
    { id: "r3", name: "Daily System Health Digest", description: "Uptime, latency, and incident summary", cadence: "DAILY", format: "CSV", recipients: ["analyst@pulse.io"], lastRunAt: new Date(now - day).toISOString(), nextRunAt: new Date(now + 3600000).toISOString(), owner: "Devon Ashworth" },
    { id: "r4", name: "Customer Health Scorecard", description: "At-risk accounts and expansion signals", cadence: "WEEKLY", format: "CSV", recipients: ["admin@pulse.io"], lastRunAt: new Date(now - 3 * day).toISOString(), nextRunAt: new Date(now + 4 * day).toISOString(), owner: "Reese Calloway" },
  ];
}

export interface SavedDashboardRecord {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  owner: string;
  updatedAt: string;
}

export function getCuratedDashboards(): SavedDashboardRecord[] {
  const now = Date.now();
  return [
    { id: "d1", name: "Executive Overview", description: "Default company-wide KPI overview", isDefault: true, owner: "Reese Calloway", updatedAt: new Date(now - 2 * 3600000).toISOString() },
    { id: "d2", name: "Q3 Growth Review", description: "Growth experiments and cohort retention", isDefault: false, owner: "Reese Calloway", updatedAt: new Date(now - 26 * 3600000).toISOString() },
    { id: "d3", name: "Infra On-call Board", description: "Latency, error budgets, and deploy health", isDefault: false, owner: "Devon Ashworth", updatedAt: new Date(now - 5 * 3600000).toISOString() },
  ];
}
