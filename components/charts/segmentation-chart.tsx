"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCurrency } from "@/lib/utils";

interface SegmentRow {
  segment: string;
  count: number;
  mrr: number;
}

const SEGMENT_LABEL: Record<string, string> = {
  ENTERPRISE: "Enterprise",
  MID_MARKET: "Mid-market",
  SMB: "SMB",
  STARTUP: "Startup",
};

const SEGMENT_COLOR: Record<string, string> = {
  ENTERPRISE: "var(--accent-blue)",
  MID_MARKET: "var(--accent-purple)",
  SMB: "var(--accent-emerald)",
  STARTUP: "var(--accent-amber)",
};

export function SegmentationChart({ data }: { data: SegmentRow[] }) {
  const chartData = data.map((d) => ({ ...d, label: SEGMENT_LABEL[d.segment] }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid stroke="var(--border-subtle)" horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="label" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} width={84} />
        <Tooltip
          cursor={{ fill: "var(--bg-hover)" }}
          content={<ChartTooltip formatter={(value, name) => [name === "mrr" ? formatCurrency(value) : String(value), name === "mrr" ? "MRR" : "Accounts"]} />}
        />
        <Bar dataKey="mrr" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={900}>
          {chartData.map((entry) => (
            <Cell key={entry.segment} fill={SEGMENT_COLOR[entry.segment]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
