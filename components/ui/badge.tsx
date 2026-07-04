import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-tight w-fit whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-bg-surface-2 text-text-secondary border-border-default",
        blue: "bg-accent-blue-dim text-accent-blue border-transparent",
        emerald: "bg-accent-emerald-dim text-accent-emerald border-transparent",
        amber: "bg-accent-amber-dim text-accent-amber border-transparent",
        red: "bg-accent-red-dim text-accent-red border-transparent",
        purple: "bg-accent-purple-dim text-accent-purple border-transparent",
        outline: "text-text-secondary border-border-strong",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

function StatusDot({ variant }: { variant: "emerald" | "amber" | "red" | "blue" | "purple" }) {
  const colorMap = {
    emerald: "bg-accent-emerald",
    amber: "bg-accent-amber",
    red: "bg-accent-red",
    blue: "bg-accent-blue",
    purple: "bg-accent-purple",
  };
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
          colorMap[variant]
        )}
      />
      <span
        className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colorMap[variant])}
      />
    </span>
  );
}

export { Badge, badgeVariants, StatusDot };
