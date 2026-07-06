"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type KpiFormat = "currency" | "currency-compact" | "compact" | "percent" | "percent-2";
export type KpiIcon = "dollar" | "trending-up" | "users" | "activity";

interface KpiCardProps {
  label: string;
  value: number;
  format: KpiFormat;
  changePct: number;
  invertColor?: boolean;
  sparkline?: number[];
  icon?: KpiIcon;
  accent?: "blue" | "emerald" | "amber" | "purple";
}

const ACCENT_STROKE: Record<string, string> = {
  blue: "var(--accent-blue)",
  emerald: "var(--accent-emerald)",
  amber: "var(--accent-amber)",
  purple: "var(--accent-purple)",
};

const ICON_MAP: Record<KpiIcon, typeof DollarSign> = {
  dollar: DollarSign,
  "trending-up": TrendingUp,
  users: Users,
  activity: Activity,
};

const FORMATTERS: Record<KpiFormat, (value: number) => string> = {
  currency: (v) => formatCurrency(v),
  "currency-compact": (v) => formatCurrency(v, { compact: true }),
  compact: (v) => formatCompactNumber(v),
  percent: (v) => `${v.toFixed(1)}%`,
  "percent-2": (v) => `${v.toFixed(2)}%`,
};

export function KpiCard({ label, value, format, changePct, invertColor, sparkline, icon, accent = "blue" }: KpiCardProps) {
  const isPositive = changePct >= 0;
  const isGood = invertColor ? !isPositive : isPositive;
  const sparkData = (sparkline ?? []).map((v, i) => ({ i, v }));
  const gradientId = `spark-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const Icon = icon ? ICON_MAP[icon] : null;

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-text-tertiary">
            {Icon && <Icon className="size-3.5" />}
            {label}
          </span>
          <span className="text-2xl font-semibold tabular-nums text-text-primary">
            <AnimatedNumber value={value} formatter={FORMATTERS[format]} />
          </span>
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
            isGood ? "bg-accent-emerald-dim text-accent-emerald" : "bg-accent-red-dim text-accent-red"
          )}
        >
          {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(changePct).toFixed(1)}%
        </span>
      </div>

      {sparkData.length > 1 && (
        <div className="mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT_STROKE[accent]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={ACCENT_STROKE[accent]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={ACCENT_STROKE[accent]} strokeWidth={1.75} fill={`url(#${gradientId})`} isAnimationActive animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export const MemoizedKpiCard = React.memo(KpiCard);
