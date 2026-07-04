import { prisma } from "@/lib/prisma";
import { getCuratedEvents, type EventRecord } from "@/lib/data/events";

export async function getRecentEvents(limit = 50): Promise<EventRecord[]> {
  try {
    const rows = await prisma.event.findMany({ orderBy: { timestamp: "desc" }, take: limit });
    if (rows.length > 0) {
      return rows.map((e) => ({
        id: e.id,
        type: e.type,
        actor: e.actor,
        message: e.message,
        timestamp: e.timestamp.toISOString(),
      }));
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return getCuratedEvents().slice(0, limit);
}
