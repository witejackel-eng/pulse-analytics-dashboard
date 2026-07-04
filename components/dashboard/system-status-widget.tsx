import { StatusDot } from "@/components/ui/badge";
import type { ServiceStatus } from "@/lib/data/system";

interface ServiceRow {
  name: string;
  status: ServiceStatus;
  uptime90d: number;
  region: string;
}

const STATUS_LABEL: Record<ServiceStatus, string> = {
  OPERATIONAL: "Operational",
  DEGRADED: "Degraded",
  PARTIAL_OUTAGE: "Partial outage",
  MAJOR_OUTAGE: "Major outage",
};

const STATUS_VARIANT: Record<ServiceStatus, "emerald" | "amber" | "red"> = {
  OPERATIONAL: "emerald",
  DEGRADED: "amber",
  PARTIAL_OUTAGE: "red",
  MAJOR_OUTAGE: "red",
};

export function SystemStatusWidget({ services }: { services: ServiceRow[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      {services.map((service) => (
        <div key={service.name} className="flex items-center gap-2.5 rounded-md px-1.5 py-2 hover:bg-bg-hover">
          <StatusDot variant={STATUS_VARIANT[service.status]} />
          <span className="flex-1 truncate font-mono text-[12.5px] text-text-secondary">{service.name}</span>
          <span className="text-[11px] text-text-disabled">{STATUS_LABEL[service.status]}</span>
          <span className="w-14 shrink-0 text-right text-[11px] tabular-nums text-text-tertiary">
            {service.uptime90d.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
