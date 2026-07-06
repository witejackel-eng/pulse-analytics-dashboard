import { Skeleton } from "@/components/ui/skeleton";

export default function PipelineLoading() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border-default bg-bg-surface p-5">
            <Skeleton className="mb-2 h-3 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex min-w-[200px] flex-col gap-2 rounded-lg border border-border-default bg-bg-surface-2 p-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-6 rounded" />
            </div>
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-col gap-2 pt-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border-default bg-bg-surface p-5">
        <Skeleton className="mb-4 h-4 w-28" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}