import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      {/* KPI cards row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border-default bg-bg-surface p-5">
            <Skeleton className="mb-3 h-3 w-24" />
            <Skeleton className="mb-2 h-7 w-32" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
      {/* Main chart area */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-border-default bg-bg-surface p-5 xl:col-span-2">
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="mb-1 h-3 w-48" />
          <Skeleton className="h-72 w-full" />
        </div>
        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="mb-1 h-3 w-36" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
      {/* Second row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-border-default bg-bg-surface p-5 xl:col-span-2">
          <Skeleton className="mb-4 h-4 w-24" />
          <Skeleton className="mb-1 h-3 w-52" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <Skeleton className="mb-4 h-4 w-28" />
          <Skeleton className="mb-1 h-3 w-40" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border-default bg-bg-surface p-5">
            <Skeleton className="mb-4 h-4 w-28" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}