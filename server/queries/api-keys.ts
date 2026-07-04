import { prisma } from "@/lib/prisma";
import { getCuratedApiKeys, type ApiKeyRecord } from "@/lib/data/api-keys";

export async function getApiKeys(): Promise<ApiKeyRecord[]> {
  try {
    const rows = await prisma.apiKey.findMany({ where: { revokedAt: null }, orderBy: { createdAt: "desc" } });
    if (rows.length > 0) {
      return rows.map((k) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        scopes: k.scopes,
        createdAt: k.createdAt.toISOString(),
        lastUsedAt: k.lastUsedAt?.toISOString(),
      }));
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return getCuratedApiKeys();
}
