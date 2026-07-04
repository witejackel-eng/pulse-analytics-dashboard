"use client";

import * as React from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Cpu, MemoryStick, Gauge, TriangleAlert, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusDot } from "@/components/ui/badge";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { useLiveMetrics } from "@/hooks/use-live-metrics";
import { cn } from "@/lib/utils";
import type { MetricName, MetricPoint } from "@/lib/data/system";

interface SystemMetricsPanelProps {
  initialSeries: Record<MetricName, MetricPoint[]>;
}

const TILE_DEFS: { name: MetricName; label: string; icon: typeof Cpu; unit: string; decimals: number; warn?: number }[] = [
  { name: "CPU", label: "CPU utilization", icon: Cpu, unit: "%", decimals: 1, warn: 75 },
  { name: "MEMORY", label: "Memory usage", icon: MemoryStick, unit: "%", decimals: 1, warn: 80 },
  { name: "LATENCY_P50", label: "Latency p50", icon: Gauge, unit: "ms", decimals: 0 },
  { name: "LATENCY_P95", label: "Latency p95", icon: Gauge, unit: "ms", decimals: 0, warn: 400 },
  { name: "ERROR_RATE", label: "Error rate", icon: TriangleAlert, unit: "%", decimals: 2, warn: 1 },
  { name: "REQUESTS_PER_MIN", label: "Requests / min", icon: Activity, unit: "", decimals: 0 },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function SystemMetricsPanel({ initialSeries }: SystemMetricsPanelProps) {
  const { ticks, latest, connected } = useLiveMetrics(48);

  const merged = React.useMemo(() => {
    const result: Record<string, { timestamp: string; value: number }[]> = {};
    for (const def of TILE_DEFS) {
      const base = initialSeries[def.name] ?? [];
      const live = ticks.map((t) => ({ timestamp: t.timestamp, value: t.values[def.name] })).filter((p) => p.value !== undefined);
      result[def.name] = [...base.slice(-60), ...live];
    }
    return result;
  }, [initialSeries, ticks]);

  const cpuMemData = React.useMemo(() => {
    const cpu = merged.CPU ?? [];
    const mem = merged.MEMORY ?? [];
    const length = Math.max(cpu.length, mem.length);
    return Array.from({ length }, (_, i) => ({
      timestamp: cpu[i]?.timestamp ?? mem[i]?.timestamp,
      cpu: cpu[i]?.value,
      memory: mem[i]?.value,
    }));
  }, [merged]);

  const latencyData = React.useMemo(() => {
    const p50 = merged.LATENCY_P50 ?? [];
    const p95 = merged.LATENCY_P95 ?? [];
    const length = Math.max(p50.length, p95.length);
    return Array.from({ length }, (_, i) => ({
      timestamp: p50[i]?.timestamp ?? p95[i]?.timestamp,
      p50: p50[i]?.value,
      p95: p95[i]?.value,
    }));
  }, [merged]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
        <StatusDot variant={connected ? "emerald" : "amber"} />
        {connected ? "Streaming live metrics" : "Reconnecting…"}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {TILE_DEFS.map((def) => {
          const value = latest[def.name] ?? merged[def.name]?.[merged[def.name].length - 1]?.value ?? 0;
          const isWarn = def.warn !== undefined && value >= def.warn;
          const Icon = def.icon;
          return (
            <Card key={def.name} className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary">
                <Icon className="size-3.5" />
                {def.label}
              </div>
              <p className={cn("mt-1.5 text-xl font-semibold tabular-nums", isWarn ? "text-accent-amber" : "text-text-primary")}>
                {value.toFixed(def.decimals)}
                <span className="ml-0.5 text-xs font-normal text-text-tertiary">{def.unit}</span>
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CPU &amp; Memory</CardTitle>
            <CardDescription>Rolling window, updates every 2.5s</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuMemData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} minTickGap={50} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTooltip formatter={(v, n) => [`${Number(v).toFixed(1)}%`, n]} labelFormatter={(l) => formatTime(l)} />} />
                <Area type="monotone" dataKey="cpu" name="CPU" stroke="var(--accent-blue)" strokeWidth={2} fill="url(#cpuFill)" isAnimationActive={false} />
                <Area type="monotone" dataKey="memory" name="Memory" stroke="var(--accent-purple)" strokeWidth={2} fill="url(#memFill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latency</CardTitle>
            <CardDescription>p50 / p95 response time, milliseconds</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} minTickGap={50} />
                <YAxis tickFormatter={(v) => `${v}ms`} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<ChartTooltip formatter={(v, n) => [`${Math.round(Number(v))}ms`, n]} labelFormatter={(l) => formatTime(l)} />} />
                <Line type="monotone" dataKey="p50" name="p50" stroke="var(--accent-emerald)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="p95" name="p95" stroke="var(--accent-amber)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
