"use client";

interface TooltipPayloadEntry {
  value?: number | string;
  name?: number | string;
  dataKey?: string | number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
  formatter?: (value: number, name: string) => [string, string];
  labelFormatter?: (label: string) => string;
}

export function ChartTooltip({ active, payload, label, formatter, labelFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border-default bg-bg-elevated px-3 py-2 shadow-2xl">
      {label !== undefined && (
        <p className="mb-1.5 text-[11px] font-medium text-text-tertiary">
          {labelFormatter ? labelFormatter(String(label)) : String(label)}
        </p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((entry, i) => {
          const [formattedValue, formattedName] = formatter
            ? formatter(entry.value as number, entry.name as string)
            : [String(entry.value), String(entry.name)];
          return (
            <div key={entry.dataKey ?? i} className="flex items-center gap-2 text-[12px]">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-text-tertiary">{formattedName}</span>
              <span className="ml-auto font-medium tabular-nums text-text-primary">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
