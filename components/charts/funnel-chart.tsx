"use client";

interface FunnelStep {
  step: string;
  value: number;
}

export function FunnelChart({ data }: { data: FunnelStep[] }) {
  const max = data[0]?.value || 100;

  return (
    <div className="flex flex-col gap-2">
      {data.map((step, i) => {
        const widthPct = (step.value / max) * 100;
        const prevValue = i > 0 ? data[i - 1].value : step.value;
        const dropoff = i > 0 ? Math.round((1 - step.value / prevValue) * 1000) / 10 : 0;
        return (
          <div key={step.step} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-[12px] text-text-secondary">{step.step}</span>
            <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-bg-surface-2">
              <div
                className="flex h-full items-center justify-end rounded-md bg-gradient-to-r from-accent-blue/40 to-accent-blue px-2.5 transition-all duration-700 ease-out"
                style={{ width: `${widthPct}%` }}
              >
                <span className="text-[11px] font-medium text-white">{step.value}%</span>
              </div>
            </div>
            <span className="w-14 shrink-0 text-right text-[11px] text-text-disabled">
              {i > 0 ? `-${dropoff}%` : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
