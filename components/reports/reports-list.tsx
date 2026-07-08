"use client";

import { toast } from "sonner";
import { FileText, Play, Download, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import type { ReportRecord } from "@/lib/data/reports";

export function ReportsList({ reports }: { reports: ReportRecord[] }) {
  return (
    <div className="flex flex-col divide-y divide-border-subtle">
      {reports.map((report) => (
        <div key={report.id} className="flex items-center gap-3 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-bg-surface-2 text-text-tertiary">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-text-primary">{report.name}</p>
            <p className="truncate text-[12px] text-text-tertiary">{report.description}</p>
          </div>
          <Badge variant="outline">{report.cadence.toLowerCase()}</Badge>
          <Badge variant={report.format === "PDF" ? "purple" : "blue"}>{report.format}</Badge>
          <span className="hidden w-32 shrink-0 text-right text-[12px] text-text-tertiary sm:block">
            Next: {formatDate(report.nextRunAt, { month: "short", day: "numeric" })}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Run report" onClick={() => toast.success(`Running "${report.name}" now`)}>
              <Play className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Export report" onClick={() => toast.success("Export started — check your downloads")}>
              <Download className="size-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More actions">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => toast.info("Editing isn't wired up in this demo")}>Edit report</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => toast.info(`Recipients: ${report.recipients.join(", ")}`)}>View recipients</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={() => toast.success("Report deleted")}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
