"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Activity } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/badge";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Trigger button — visible only below lg breakpoint */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center size-9 rounded-md hover:bg-bg-hover lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-4 text-text-secondary" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-bg-sunken transition-transform duration-200 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex h-14 items-center justify-between border-b border-border-subtle px-5">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-accent-blue text-white">
              <Activity className="size-3.5" />
            </div>
            <span className="text-[14px] font-semibold text-text-primary">Pulse</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center size-8 rounded-md hover:bg-bg-hover"
            aria-label="Close navigation menu"
          >
            <X className="size-4 text-text-secondary" />
          </button>
        </div>

        {/* Nav items */}
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
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-bg-elevated text-text-primary"
                    : "text-text-tertiary hover:bg-bg-hover hover:text-text-secondary"
                )}
              >
                <Icon className={cn("size-4 shrink-0", isActive ? "text-accent-blue" : "text-text-disabled")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* System status footer */}
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
    </>
  );
}