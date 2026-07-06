"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent-red-dim">
          <AlertTriangle className="size-6 text-accent-red" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">Dashboard error</h2>
        <p className="max-w-md text-[13px] text-text-tertiary">
          {error.message || "An error occurred while loading this page."}
        </p>
        <Button variant="primary" onClick={reset}>
          <RotateCcw className="size-3.5" />
          Reload page
        </Button>
      </div>
    </div>
  );
}