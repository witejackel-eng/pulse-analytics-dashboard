export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
}

export function getCuratedApiKeys(): ApiKeyRecord[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: "key_1", name: "Production server key", keyPrefix: "pk_live_4f2a", scopes: ["read:metrics", "read:events"], createdAt: new Date(now - 90 * day).toISOString(), lastUsedAt: new Date(now - 3600000).toISOString() },
    { id: "key_2", name: "Staging integration", keyPrefix: "pk_test_9c31", scopes: ["read:metrics"], createdAt: new Date(now - 45 * day).toISOString(), lastUsedAt: new Date(now - day).toISOString() },
    { id: "key_3", name: "CI export bot", keyPrefix: "pk_live_a01e", scopes: ["read:reports", "write:reports"], createdAt: new Date(now - 12 * day).toISOString() },
  ];
}
