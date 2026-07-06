import { formatCurrency } from "@/lib/utils";
import { STAGE_COLOR } from "@/lib/constants/stages";

interface StageRow {
  stage: string;
  label: string;
  count: number;
  value: number;
}

export function PipelineMini({
  stages,
  weightedValue,
  openValue,
}: {
  stages: StageRow[];
  weightedValue: number;
  openValue: number;
}) {
  const total = stages.reduce((s, r) => s + r.value, 0) || 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[11px] text-text-tertiary">Weighted pipeline</p>
          <p className="text-xl font-semibold text-text-primary">{formatCurrency(weightedValue, { compact: true })}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-text-tertiary">Open value</p>
          <p className="text-[13px] font-medium text-text-secondary">{formatCurrency(openValue, { compact: true })}</p>
        </div>
      </div>

      <div className="flex h-2 overflow-hidden rounded-full" role="img" aria-label="Pipeline stages breakdown">
        {stages.map((s) => (
          <div
            key={s.stage}
            className={STAGE_COLOR[s.stage]}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.label}: ${formatCurrency(s.value, { compact: true })}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {stages.map((s) => (
          <div key={s.stage} className="flex items-center gap-2 text-[12px]">
            <span className={`size-1.5 rounded-full ${STAGE_COLOR[s.stage]}`} />
            <span className="text-text-tertiary">{s.label}</span>
            <span className="ml-auto tabular-nums text-text-secondary">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
