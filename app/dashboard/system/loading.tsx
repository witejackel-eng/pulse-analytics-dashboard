import { Skeleton } from "@/components/ui/skeleton";

export default function SystemLoading() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border-default bg-bg-surface p-4">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-3 h-3 w-20" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border-default bg-bg-surface p-5">
        <Skeleton className="mb-4 h-4 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <Skeleton className="mb-4 h-4 w-28" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}