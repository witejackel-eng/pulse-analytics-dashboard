import { prisma } from "@/lib/prisma";
import { getCuratedEvents, type EventRecord } from "@/lib/data/events";
import { tryQuery } from "@/server/try-query";

export async function getRecentEvents(limit = 50): Promise<EventRecord[]> {
  const rows = await tryQuery("getRecentEvents", () =>
    prisma.event.findMany({ orderBy: { timestamp: "desc" }, take: limit }).then((r) =>
      r.length > 0
        ? r.map((e) => ({
            id: e.id,
            type: e.type,
            actor: e.actor,
            message: e.message,
            timestamp: e.timestamp.toISOString(),
          }))
        : null
    ),
    null
  );

  return rows ?? getCuratedEvents().slice(0, limit);
}