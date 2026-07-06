import type { ServiceStatus } from "@/lib/data/system";

export const STATUS_LABEL: Record<ServiceStatus, string> = {
  OPERATIONAL: "Operational",
  DEGRADED: "Degraded performance",
  PARTIAL_OUTAGE: "Partial outage",
  MAJOR_OUTAGE: "Major outage",
};

export const STATUS_VARIANT: Record<ServiceStatus, "emerald" | "amber" | "red"> = {
  OPERATIONAL: "emerald",
  DEGRADED: "amber",
  PARTIAL_OUTAGE: "red",
  MAJOR_OUTAGE: "red",
};