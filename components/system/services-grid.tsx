import { Card } from "@/components/ui/card";
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
  DEGRADED: "Degraded performance",
  PARTIAL_OUTAGE: "Partial outage",
  MAJOR_OUTAGE: "Major outage",
};

const STATUS_VARIANT: Record<ServiceStatus, "emerald" | "amber" | "red"> = {
  OPERATIONAL: "emerald",
  DEGRADED: "amber",
  PARTIAL_OUTAGE: "red",
  MAJOR_OUTAGE: "red",
};

export function ServicesGrid({ services }: { services: ServiceRow[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {services.map((service) => (
        <Card key={service.name} className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] text-text-primary">{service.name}</span>
            <StatusDot variant={STATUS_VARIANT[service.status]} />
          </div>
          <p className="mt-1 text-[11px] text-text-tertiary">{STATUS_LABEL[service.status]}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-text-disabled">
            <span>{service.region}</span>
            <span className="tabular-nums">{service.uptime90d.toFixed(2)}% uptime</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
