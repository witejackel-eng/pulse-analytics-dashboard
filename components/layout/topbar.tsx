"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { DateRangePicker } from "@/components/layout/date-range-picker";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { NotificationRecord } from "@/lib/data/notifications";

interface TopbarProps {
  title: string;
  user: { name: string; email: string; image?: string | null; role?: string };
  notifications: NotificationRecord[];
  showDateRange?: boolean;
}

export function Topbar({ title, user, notifications, showDateRange = true }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border-subtle bg-bg-base/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav />
      <h1 className="text-[14px] font-semibold text-text-primary">{title}</h1>

      <button
        onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        className="ml-2 hidden max-w-xs flex-1 items-center gap-2 rounded-md border border-border-default bg-bg-surface-2 px-3 py-1.5 text-[12px] text-text-tertiary transition-colors hover:border-border-strong md:flex"
        aria-label="Open search command palette"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-border-default bg-bg-surface px-1.5 py-0.5 text-[10px] text-text-disabled">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {showDateRange && <DateRangePicker />}
        <NotificationsMenu initial={notifications} />
        <UserMenu name={user.name} email={user.email} image={user.image} role={user.role} />
      </div>
    </header>
  );
}
