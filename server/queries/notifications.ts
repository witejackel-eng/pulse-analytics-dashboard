import { prisma } from "@/lib/prisma";
import { getCuratedNotifications, type NotificationRecord } from "@/lib/data/notifications";

export async function getNotifications(userId?: string): Promise<NotificationRecord[]> {
  try {
    if (userId) {
      const rows = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      if (rows.length > 0) {
        return rows.map((n) => ({
          id: n.id,
          level: n.level,
          title: n.title,
          body: n.body,
          read: n.read,
          createdAt: n.createdAt.toISOString(),
        }));
      }
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return getCuratedNotifications();
}
