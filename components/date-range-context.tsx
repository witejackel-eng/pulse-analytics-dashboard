"use client";

import * as React from "react";

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "90d"
  | "custom";

export interface DateRangeState {
  preset: DateRangePreset;
  from: Date;
  to: Date;
  label: string;
}

interface DateRangeContextValue extends DateRangeState {
  setPreset: (preset: DateRangePreset) => void;
  setCustomRange: (from: Date, to: Date) => void;
}

const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  custom: "Custom range",
};

function rangeForPreset(preset: DateRangePreset): { from: Date; to: Date } {
  const now = new Date();
  const to = new Date(now);
  const from = new Date(now);

  switch (preset) {
    case "today":
      from.setHours(0, 0, 0, 0);
      return { from, to };
    case "yesterday": {
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      const yTo = new Date(from);
      yTo.setHours(23, 59, 59, 999);
      return { from, to: yTo };
    }
    case "7d":
      from.setDate(from.getDate() - 7);
      return { from, to };
    case "90d":
      from.setDate(from.getDate() - 90);
      return { from, to };
    case "30d":
    default:
      from.setDate(from.getDate() - 30);
      return { from, to };
  }
}

const DateRangeContext = React.createContext<DateRangeContextValue | null>(null);

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPresetState] = React.useState<DateRangePreset>("30d");
  const [range, setRange] = React.useState(() => rangeForPreset("30d"));

  const setPreset = React.useCallback((next: DateRangePreset) => {
    setPresetState(next);
    if (next !== "custom") {
      setRange(rangeForPreset(next));
    }
  }, []);

  const setCustomRange = React.useCallback((from: Date, to: Date) => {
    setPresetState("custom");
    setRange({ from, to });
  }, []);

  const value = React.useMemo<DateRangeContextValue>(
    () => ({
      preset,
      from: range.from,
      to: range.to,
      label: PRESET_LABELS[preset],
      setPreset,
      setCustomRange,
    }),
    [preset, range, setPreset, setCustomRange]
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange() {
  const ctx = React.useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
  return ctx;
}
