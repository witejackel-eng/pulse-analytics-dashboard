import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="ml-auto h-8 w-24" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border-default">
        <div className="p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border-subtle py-3 last:border-0">
              <Skeleton className="size-4" />
              <Skeleton className="size-7 rounded-full" />
              <div className="flex flex-1 gap-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}