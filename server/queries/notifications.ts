import { prisma } from "@/lib/prisma";
import { getCuratedNotifications, type NotificationRecord } from "@/lib/data/notifications";
import { tryQuery } from "@/server/try-query";

export async function getNotifications(userId?: string): Promise<NotificationRecord[]> {
  if (!userId) return getCuratedNotifications();

  const rows = await tryQuery("getNotifications", () =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }).then((r) =>
      r.length > 0
        ? r.map((n) => ({
            id: n.id,
            level: n.level,
            title: n.title,
            body: n.body,
            read: n.read,
            createdAt: n.createdAt.toISOString(),
          }))
        : null
    ),
    null
  );

  return rows ?? getCuratedNotifications();
}