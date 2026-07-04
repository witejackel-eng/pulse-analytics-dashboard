import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-border-default bg-bg-surface-2 px-3 py-1 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors",
        "focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-accent-blue/30",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export { Input };
