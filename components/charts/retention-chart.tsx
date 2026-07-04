"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";

interface CohortRow {
  cohort: string;
  weeks: number[];
}

const COLORS = ["var(--accent-blue)", "var(--accent-emerald)", "var(--accent-amber)", "var(--accent-purple)", "var(--accent-red)", "#5eead4"];

export function RetentionChart({ data }: { data: CohortRow[] }) {
  const chartData = Array.from({ length: 8 }, (_, week) => {
    const row: Record<string, number | string> = { week: `W${week}` };
    data.forEach((cohort) => {
      row[cohort.cohort] = cohort.weeks[week];
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
        <XAxis dataKey="week" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
        <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<ChartTooltip formatter={(value, name) => [`${value}%`, name]} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-tertiary)" }} iconType="circle" iconSize={7} />
        {data.map((cohort, i) => (
          <Line
            key={cohort.cohort}
            type="monotone"
            dataKey={cohort.cohort}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={900}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
