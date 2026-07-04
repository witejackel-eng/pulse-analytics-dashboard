"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { NAV_ITEMS } from "@/lib/nav";
import type { NotificationRecord } from "@/lib/data/notifications";

interface DashboardShellProps {
  children: React.ReactNode;
  user: { name: string; email: string; image?: string | null; role?: string };
  notifications: NotificationRecord[];
}

function titleFor(pathname: string): string {
  if (pathname.startsWith("/dashboard/settings")) return "Settings";
  const match = NAV_ITEMS.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
  return match?.title ?? "Overview";
}

export function DashboardShell({ children, user, notifications }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-svh bg-bg-base">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={titleFor(pathname)} user={user} notifications={notifications} />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
