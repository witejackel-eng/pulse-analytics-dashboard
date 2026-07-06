import { StatusDot } from "@/components/ui/badge";
import { STATUS_LABEL, STATUS_VARIANT } from "@/lib/constants/service-status";
import type { ServiceStatus } from "@/lib/data/system";

interface ServiceRow {
  name: string;
  status: ServiceStatus;
  uptime90d: number;
  region: string;
}

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
