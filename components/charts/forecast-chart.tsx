"use client";

import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCurrency } from "@/lib/utils";

interface ForecastRow {
  month: string;
  actual: number | null;
  forecast: number | null;
  forecastLow: number | null;
  forecastHigh: number | null;
}

export function ForecastChart({ data }: { data: ForecastRow[] }) {
  const chartData = data.map((d) => ({
    ...d,
    forecastRange: d.forecastLow !== null && d.forecastHigh !== null ? [d.forecastLow, d.forecastHigh] : undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
        <YAxis tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
        <Tooltip content={<ChartTooltip formatter={(v, n) => [formatCurrency(Array.isArray(v) ? v[1] : v), n === "forecastRange" ? "Forecast range" : n]} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-tertiary)" }} iconType="circle" iconSize={7} />
        <Area
          dataKey="forecastRange"
          name="Forecast range"
          stroke="none"
          fill="var(--accent-purple)"
          fillOpacity={0.15}
          isAnimationActive
          animationDuration={900}
        />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--accent-blue)" strokeWidth={2.5} dot={{ r: 3 }} connectNulls isAnimationActive animationDuration={900} />
        <Line type="monotone" dataKey="forecast" name="Forecast" stroke="var(--accent-purple)" strokeWidth={2.5} strokeDasharray="5 4" dot={{ r: 3 }} connectNulls isAnimationActive animationDuration={900} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
