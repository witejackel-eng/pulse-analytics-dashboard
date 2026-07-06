import { prisma } from "@/lib/prisma";
import { getCuratedApiKeys, type ApiKeyRecord } from "@/lib/data/api-keys";
import { tryQuery } from "@/server/try-query";

export async function getApiKeys(): Promise<ApiKeyRecord[]> {
  const rows = await tryQuery("getApiKeys", () =>
    prisma.apiKey.findMany({ where: { revokedAt: null }, orderBy: { createdAt: "desc" } }).then((r) =>
      r.length > 0
        ? r.map((k) => ({
            id: k.id,
            name: k.name,
            keyPrefix: k.keyPrefix,
            scopes: k.scopes,
            createdAt: k.createdAt.toISOString(),
            lastUsedAt: k.lastUsedAt?.toISOString(),
          }))
        : null
    ),
    null
  );

  return rows ?? getCuratedApiKeys();
}