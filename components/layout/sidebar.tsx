"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/badge";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border-subtle bg-bg-sunken lg:flex">
      <div className="flex h-14 items-center gap-2 border-b border-border-subtle px-5">
        <div className="flex size-6 items-center justify-center rounded-md bg-accent-blue text-white">
          <Activity className="size-3.5" />
        </div>
        <span className="text-[14px] font-semibold text-text-primary">Pulse</span>
        <span className="ml-auto rounded border border-border-default px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
          Enterprise
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href.split("/").slice(0, 3).join("/"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-bg-elevated text-text-primary"
                  : "text-text-tertiary hover:bg-bg-hover hover:text-text-secondary"
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive ? "text-accent-blue" : "text-text-disabled group-hover:text-text-tertiary")} />
              <span className="flex-1 truncate">{item.title}</span>
              {item.shortcut && (
                <span className="hidden text-[10px] tracking-wide text-text-disabled group-hover:inline-block">
                  {item.shortcut}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle p-3">
        <div className="flex items-center gap-2 rounded-md bg-bg-surface-2 px-3 py-2.5">
          <StatusDot variant="emerald" />
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-medium text-text-secondary">All systems operational</span>
            <span className="text-[11px] text-text-disabled">Updated moments ago</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
