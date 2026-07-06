"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-svh items-center justify-center bg-bg-base text-text-primary">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent-red-dim">
            <AlertTriangle className="size-6 text-accent-red" />
          </div>
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="max-w-md text-[13px] text-text-tertiary">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          {error.digest && (
            <p className="text-[11px] text-text-disabled">Error ID: {error.digest}</p>
          )}
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}