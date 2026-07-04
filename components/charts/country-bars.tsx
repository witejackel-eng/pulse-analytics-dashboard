"use client";

import { formatCompactNumber } from "@/lib/utils";

interface CountryRow {
  country: string;
  sessions: number;
}

const FLAGS: Record<string, string> = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  Germany: "🇩🇪",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  France: "🇫🇷",
  Netherlands: "🇳🇱",
  Singapore: "🇸🇬",
  Japan: "🇯🇵",
  Brazil: "🇧🇷",
  India: "🇮🇳",
  Sweden: "🇸🇪",
};

export function CountryBars({ data }: { data: CountryRow[] }) {
  const max = Math.max(...data.map((d) => d.sessions));
  return (
    <div className="flex flex-col gap-2.5">
      {data.slice(0, 8).map((row) => (
        <div key={row.country} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-[12px] text-text-secondary">
            <span className="mr-1.5">{FLAGS[row.country] ?? "🌐"}</span>
            {row.country}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-surface-2">
            <div
              className="h-full rounded-full bg-accent-blue transition-all duration-700 ease-out"
              style={{ width: `${(row.sessions / max) * 100}%` }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-[12px] tabular-nums text-text-tertiary">
            {formatCompactNumber(row.sessions)}
          </span>
        </div>
      ))}
    </div>
  );
}
