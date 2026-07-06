import { Badge } from "@/components/ui/badge";
import { STAGE_ACCENT } from "@/lib/constants/stages";
import { formatCurrency } from "@/lib/utils";
import { STAGES, type DealRecord } from "@/lib/data/pipeline";

export function PipelineBoard({ deals }: { deals: DealRecord[] }) {
  return (
    <div className="grid grid-cols-[repeat(6,minmax(200px,1fr))] gap-3 overflow-x-auto pb-2">
      {STAGES.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage.id);
        const total = stageDeals.reduce((s, d) => s + d.amount, 0);
        return (
          <div key={stage.id} className={`flex min-w-[200px] flex-col gap-2 rounded-lg border-t-2 bg-bg-surface-2 p-3 ${STAGE_ACCENT[stage.id]}`}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-text-secondary">{stage.label}</span>
              <Badge variant="outline">{stageDeals.length}</Badge>
            </div>
            <span className="text-[13px] font-semibold text-text-primary">{formatCurrency(total, { compact: true })}</span>
            <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
              {stageDeals.slice(0, 6).map((deal) => (
                <div key={deal.id} className="rounded-md border border-border-subtle bg-bg-surface p-2.5">
                  <p className="truncate text-[12px] font-medium text-text-primary">{deal.name}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-text-tertiary">
                    <span>{formatCurrency(deal.amount, { compact: true })}</span>
                    <span>{deal.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
