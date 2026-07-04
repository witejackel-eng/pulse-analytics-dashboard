"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCompactNumber, formatDate } from "@/lib/utils";
import type { TrafficPoint } from "@/lib/data/traffic";

export function TrafficChart({ data }: { data: TrafficPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          tickFormatter={(v) => formatCompactNumber(v)}
          tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          content={
            <ChartTooltip
              formatter={(value, name) => [formatCompactNumber(value), name]}
              labelFormatter={(label) => formatDate(label, { month: "short", day: "numeric", year: "numeric" })}
            />
          }
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "var(--text-tertiary)" }}
          iconType="circle"
          iconSize={7}
        />
        <Line type="monotone" dataKey="sessions" name="Sessions" stroke="var(--accent-blue)" strokeWidth={2} dot={false} isAnimationActive animationDuration={1100} />
        <Line type="monotone" dataKey="visitors" name="Visitors" stroke="var(--accent-purple)" strokeWidth={2} dot={false} isAnimationActive animationDuration={1100} />
      </LineChart>
    </ResponsiveContainer>
  );
}
