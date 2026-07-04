"use client";

import * as React from "react";
import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDateRange, type DateRangePreset } from "@/components/date-range-context";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

export function DateRangePicker() {
  const { preset, from, to, label, setPreset, setCustomRange } = useDateRange();
  const [open, setOpen] = React.useState(false);
  const [customFrom, setCustomFrom] = React.useState(from.toISOString().slice(0, 10));
  const [customTo, setCustomTo] = React.useState(to.toISOString().slice(0, 10));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="size-3.5 text-text-tertiary" />
          <span>{label}</span>
          <span className="hidden text-text-disabled sm:inline">
            {formatDate(from)} – {formatDate(to)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="flex flex-col gap-0.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPreset(p.id);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] transition-colors",
                preset === p.id ? "bg-bg-hover text-text-primary" : "text-text-secondary hover:bg-bg-hover"
              )}
            >
              {p.label}
              {preset === p.id && <Check className="size-3.5 text-accent-blue" />}
            </button>
          ))}
        </div>
        <div className="mt-3 border-t border-border-subtle pt-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            Custom range
          </p>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">From</Label>
              <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="h-8 text-[12px]" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">To</Label>
              <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="h-8 text-[12px]" />
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            className="mt-3 w-full"
            onClick={() => {
              setCustomRange(new Date(customFrom), new Date(customTo));
              setOpen(false);
            }}
          >
            Apply range
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
