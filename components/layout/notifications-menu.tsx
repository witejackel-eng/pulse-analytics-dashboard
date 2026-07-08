"use client";

import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { NotificationRecord } from "@/lib/data/notifications";

const LEVEL_DOT: Record<string, string> = {
  INFO: "bg-accent-blue",
  SUCCESS: "bg-accent-emerald",
  WARNING: "bg-accent-amber",
  ERROR: "bg-accent-red",
};

export function NotificationsMenu({ initial }: { initial: NotificationRecord[] }) {
  const [items, setItems] = React.useState(initial);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex size-3.5 items-center justify-center rounded-full bg-accent-red text-[9px] font-semibold text-white">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border-subtle px-3.5 py-2.5">
          <span className="text-[13px] font-medium text-text-primary">Notifications</span>
          <button
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            className="flex items-center gap-1 text-[11px] text-text-tertiary hover:text-text-secondary"
            aria-label="Mark all notifications as read"
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex gap-2.5 border-b border-border-subtle px-3.5 py-3 transition-colors last:border-0 hover:bg-bg-hover",
                !n.read && "bg-bg-surface-2/60"
              )}
            >
              <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", LEVEL_DOT[n.level])} />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-text-primary">{n.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-text-tertiary">{n.body}</p>
                <p className="mt-1 text-[11px] text-text-disabled">{formatRelativeTime(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="px-3.5 py-6 text-center text-[12px] text-text-tertiary">You&apos;re all caught up.</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
