"use client";

import { toast } from "sonner";
import { LayoutDashboard, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import type { SavedDashboardRecord } from "@/lib/data/reports";

export function DashboardsList({ dashboards }: { dashboards: SavedDashboardRecord[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {dashboards.map((dashboard) => (
        <div key={dashboard.id} className="flex flex-col gap-2 rounded-lg border border-border-default bg-bg-surface-2 p-4">
          <div className="flex items-center justify-between">
            <div className="flex size-8 items-center justify-center rounded-md bg-bg-elevated text-accent-blue">
              <LayoutDashboard className="size-4" />
            </div>
            {dashboard.isDefault && (
              <Badge variant="blue" className="gap-1">
                <Star className="size-2.5" /> Default
              </Badge>
            )}
          </div>
          <div>
            <p className="text-[13px] font-medium text-text-primary">{dashboard.name}</p>
            <p className="mt-0.5 text-[12px] text-text-tertiary">{dashboard.description}</p>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-text-disabled">
            <span>Updated {formatRelativeTime(dashboard.updatedAt)}</span>
            <Button variant="ghost" size="sm" onClick={() => toast.info("Saved dashboard views aren't wired up in this demo")}>
              Open
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
