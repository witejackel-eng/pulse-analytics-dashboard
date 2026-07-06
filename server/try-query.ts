// Shared try-query wrapper — replaces silent catch blocks with structured logging.
// Usage: const result = await tryQuery("getRevenueSeries", () => prisma.revenue.findMany(...), fallback);

type QueryFn<T> = () => Promise<T>;

export async function tryQuery<T>(label: string, fn: QueryFn<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[db-fallback] ${label}:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}