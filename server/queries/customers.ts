import { prisma } from "@/lib/prisma";
import { getCuratedCustomers, customerSummary, type CustomerRecord } from "@/lib/data/customers";

export async function getCustomers(): Promise<CustomerRecord[]> {
  try {
    const rows = await prisma.customer.findMany({ orderBy: { mrr: "desc" } });
    if (rows.length > 0) {
      return rows.map((c) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email,
        avatarSeed: c.avatarSeed,
        plan: c.plan,
        mrr: c.mrr,
        ltv: c.ltv,
        status: c.status,
        segment: c.segment,
        country: c.country,
        healthScore: c.healthScore,
        sessionsCount: c.sessionsCount,
        lastActiveAt: c.lastActiveAt.toISOString(),
        createdAt: c.createdAt.toISOString(),
      }));
    }
  } catch {
    // No live database connection available — fall back to curated data.
  }
  return getCuratedCustomers();
}

export async function getCustomerSummary() {
  try {
    const customers = await getCustomers();
    if (customers.length > 0) {
      const active = customers.filter((c) => c.status === "ACTIVE");
      const churned = customers.filter((c) => c.status === "CHURNED");
      const bySegment = (["ENTERPRISE", "MID_MARKET", "SMB", "STARTUP"] as const).map((segment) => ({
        segment,
        count: customers.filter((c) => c.segment === segment).length,
        mrr: customers.filter((c) => c.segment === segment).reduce((s, c) => s + c.mrr, 0),
      }));
      return {
        total: customers.length,
        active: active.length,
        churned: churned.length,
        churnRate: Math.round((churned.length / customers.length) * 1000) / 10,
        totalMrr: active.reduce((s, c) => s + c.mrr, 0),
        avgHealth: Math.round(customers.reduce((s, c) => s + c.healthScore, 0) / customers.length),
        bySegment,
      };
    }
  } catch {
    // fall through
  }
  return customerSummary();
}
