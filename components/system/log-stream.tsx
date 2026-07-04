"use client";

import { Virtuoso } from "react-virtuoso";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { LogLevel } from "@/lib/data/system";

interface LogRow {
  id: string;
  level: LogLevel;
  service: string;
  message: string;
  timestamp: string;
}

const LEVEL_STYLE: Record<LogLevel, string> = {
  DEBUG: "text-text-disabled",
  INFO: "text-accent-blue",
  WARN: "text-accent-amber",
  ERROR: "text-accent-red",
};

export function LogStream({ logs }: { logs: LogRow[] }) {
  return (
    <div className="h-96 overflow-hidden rounded-md border border-border-subtle bg-bg-sunken">
      <Virtuoso
        style={{ height: "100%" }}
        data={logs}
        itemContent={(_, log) => (
          <div className="flex items-start gap-3 border-b border-border-subtle px-3 py-2 font-mono text-[12px] hover:bg-bg-hover">
            <span className="w-16 shrink-0 text-text-disabled">{formatRelativeTime(log.timestamp)}</span>
            <span className={cn("w-12 shrink-0 font-medium", LEVEL_STYLE[log.level])}>{log.level}</span>
            <span className="w-32 shrink-0 truncate text-text-tertiary">{log.service}</span>
            <span className="flex-1 text-text-secondary">{log.message}</span>
          </div>
        )}
      />
    </div>
  );
}
