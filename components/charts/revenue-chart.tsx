"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { RevenuePoint } from "@/lib/data/revenue";

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDate(v)}
          tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border-default)" }}
          tickLine={false}
          minTickGap={40}
        />
        <YAxis
          tickFormatter={(v) => formatCurrency(v, { compact: true })}
          tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          content={
            <ChartTooltip
              formatter={(value) => [formatCurrency(value), "Revenue"]}
              labelFormatter={(label) => formatDate(label, { month: "short", day: "numeric", year: "numeric" })}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="amount"
          name="Revenue"
          stroke="var(--accent-blue)"
          strokeWidth={2}
          fill="url(#revenueFill)"
          isAnimationActive
          animationDuration={1100}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
