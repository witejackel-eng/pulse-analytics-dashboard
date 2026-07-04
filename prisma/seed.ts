import {
  PrismaClient,
  Role,
  ReportCadence,
  ReportFormat,
  MetricName,
  ServiceStatus,
  DeploymentStatus,
  LogLevel,
  EventType,
  CustomerStatus,
  CustomerSegment,
  DealStage,
  NotificationLevel,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function rand(seed: { v: number }) {
  seed.v = (seed.v * 9301 + 49297) % 233280;
  return seed.v / 233280;
}

function pick<T>(arr: T[], seed: { v: number }): T {
  return arr[Math.floor(rand(seed) * arr.length)];
}

const COMPANIES = [
  "Northwind Logistics", "Vector Dynamics", "Brightfield Capital", "Cascade Robotics",
  "Ionic Health", "Latitude Freight", "Solstice Media", "Anchor Biotech",
  "Fathom Analytics Inc", "Meridian Foods", "Silverline Insurance", "Kestrel Aerospace",
  "Harbor Payments", "Orbital Studios", "Granite Systems", "Wavelength Telecom",
  "Copperfield Retail", "Bluepeak Energy", "Nimbus Cloud Co", "Redwood Legal",
  "Arcline Manufacturing", "Tidewater Shipping", "Vertex Materials", "Frostline Apparel",
  "Cobalt Security", "Palisade Realty", "Driftwood Hospitality", "Ember Robotics",
  "Cinderpoint Games", "Larkspur Pharma",
];

const FIRST_NAMES = ["Ava","Liam","Noah","Emma","Olivia","Ethan","Mia","Lucas","Sofia","Mason","Isabella","Elijah","Amelia","James","Harper","Benjamin","Evelyn","Henry","Camila","Alexander"];
const LAST_NAMES = ["Carter","Nguyen","Patel","Kim","Rossi","Muller","Chen","Silva","Andersson","Kowalski","Dubois","Okafor","Haddad","Ivanov","Larsen","Fischer","Suzuki","Reyes","Novak","Costa"];
const COUNTRIES = ["United States","United Kingdom","Germany","Canada","Australia","France","Netherlands","Singapore","Japan","Brazil","India","Sweden"];
const PLANS = ["Starter","Growth","Business","Enterprise"];
const REGIONS = ["us-east-1","us-west-2","eu-west-1","ap-southeast-1"];
const SERVICES = ["api-gateway","auth-service","billing-service","ingest-pipeline","query-engine","notification-worker","web-app","websocket-hub"];

async function main() {
  const seed = { v: 42 };
  console.log("Seeding Pulse analytics database...");

  await prisma.trafficDaily.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.revenue.deleteMany();
  await prisma.event.deleteMany();
  await prisma.logEntry.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.report.deleteMany();
  await prisma.dashboard.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: {
      name: "Pulse Analytics",
      slug: "pulse-analytics",
      plan: "Enterprise",
    },
  });

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Reese Calloway",
      email: "admin@pulse.io",
      password: passwordHash,
      role: Role.ADMIN,
      title: "VP of Analytics",
      organizationId: org.id,
    },
  });

  const analyst = await prisma.user.create({
    data: {
      name: "Devon Ashworth",
      email: "analyst@pulse.io",
      password: passwordHash,
      role: Role.ANALYST,
      title: "Senior Data Analyst",
      organizationId: org.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Priya Malhotra",
      email: "viewer@pulse.io",
      password: passwordHash,
      role: Role.VIEWER,
      title: "Product Manager",
      organizationId: org.id,
    },
  });

  // ---------- Revenue: 12 months daily ----------
  const revenueRows = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 365);
  let baseMrr = 182_000;

  for (let d = 0; d < 365; d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    const growth = 1 + 0.0011 + (rand(seed) - 0.5) * 0.01;
    baseMrr *= growth;
    const newMrr = baseMrr * (0.02 + rand(seed) * 0.015);
    const churnedMrr = baseMrr * (0.005 + rand(seed) * 0.008);
    revenueRows.push({
      date,
      amount: Math.round(baseMrr / 30 + (rand(seed) - 0.5) * 2000),
      mrr: Math.round(baseMrr),
      newMrr: Math.round(newMrr),
      churnedMrr: Math.round(churnedMrr),
      plan: pick(PLANS, seed),
      region: pick(REGIONS, seed),
    });
  }
  await prisma.revenue.createMany({ data: revenueRows });

  // ---------- Traffic ----------
  const trafficRows = [];
  let baseSessions = 9800;
  for (let d = 0; d < 365; d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    const dow = date.getUTCDay();
    const weekendDip = dow === 0 || dow === 6 ? 0.72 : 1;
    baseSessions *= 1 + 0.0009 + (rand(seed) - 0.5) * 0.02;
    const sessions = Math.round(baseSessions * weekendDip * (0.92 + rand(seed) * 0.16));
    const visitors = Math.round(sessions * (0.68 + rand(seed) * 0.1));
    const pageviews = Math.round(sessions * (2.6 + rand(seed) * 1.8));
    trafficRows.push({
      date,
      sessions,
      pageviews,
      visitors,
      conversionRate: Math.round((2.1 + rand(seed) * 2.4) * 100) / 100,
    });
  }
  await prisma.trafficDaily.createMany({ data: trafficRows });

  // ---------- Customers ----------
  const customers = [];
  for (let i = 0; i < 120; i++) {
    const first = pick(FIRST_NAMES, seed);
    const last = pick(LAST_NAMES, seed);
    const company = COMPANIES[i % COMPANIES.length];
    const segment = pick(
      [CustomerSegment.ENTERPRISE, CustomerSegment.MID_MARKET, CustomerSegment.SMB, CustomerSegment.STARTUP],
      seed
    );
    const mrr =
      segment === CustomerSegment.ENTERPRISE
        ? 4000 + rand(seed) * 12000
        : segment === CustomerSegment.MID_MARKET
        ? 1200 + rand(seed) * 3000
        : segment === CustomerSegment.SMB
        ? 300 + rand(seed) * 900
        : 49 + rand(seed) * 250;
    const statusRoll = rand(seed);
    const status =
      statusRoll < 0.78
        ? CustomerStatus.ACTIVE
        : statusRoll < 0.88
        ? CustomerStatus.TRIAL
        : statusRoll < 0.95
        ? CustomerStatus.PAST_DUE
        : CustomerStatus.CHURNED;

    const createdAt = new Date(startDate);
    createdAt.setDate(createdAt.getDate() + Math.floor(rand(seed) * 360));

    customers.push({
      name: `${first} ${last}`,
      company,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12)}.com`,
      avatarSeed: `${first}${last}${i}`,
      plan: pick(PLANS, seed),
      mrr: Math.round(mrr),
      ltv: Math.round(mrr * (8 + rand(seed) * 30)),
      status,
      segment,
      country: pick(COUNTRIES, seed),
      healthScore: Math.round(30 + rand(seed) * 70),
      sessionsCount: Math.round(rand(seed) * 4000),
      lastActiveAt: new Date(today.getTime() - rand(seed) * 1000 * 60 * 60 * 24 * 21),
      organizationId: org.id,
      createdAt,
    });
  }
  await prisma.customer.createMany({ data: customers });
  const dbCustomers = await prisma.customer.findMany({ select: { id: true, name: true } });

  // ---------- Deals ----------
  const dealNames = ["Platform Rollout", "Multi-year Renewal", "Seat Expansion", "API Add-on", "Enterprise Upgrade", "Data Warehouse Sync", "SSO + SCIM Bundle", "Analytics Suite"];
  const owners = ["Reese Calloway", "Devon Ashworth", "Sam Whitfield", "Jules Okonkwo", "Marina Petrov"];
  const dealRows = [];
  for (let i = 0; i < 64; i++) {
    const stage = pick(
      [DealStage.LEAD, DealStage.QUALIFIED, DealStage.PROPOSAL, DealStage.NEGOTIATION, DealStage.CLOSED_WON, DealStage.CLOSED_LOST],
      seed
    );
    const probability =
      stage === DealStage.LEAD ? 10 + Math.round(rand(seed) * 10) :
      stage === DealStage.QUALIFIED ? 25 + Math.round(rand(seed) * 15) :
      stage === DealStage.PROPOSAL ? 45 + Math.round(rand(seed) * 15) :
      stage === DealStage.NEGOTIATION ? 65 + Math.round(rand(seed) * 20) :
      stage === DealStage.CLOSED_WON ? 100 : 0;
    const closeDate = new Date(today);
    closeDate.setDate(closeDate.getDate() + Math.round((rand(seed) - 0.3) * 90));
    dealRows.push({
      name: `${pick(COMPANIES, seed)} — ${pick(dealNames, seed)}`,
      amount: Math.round(3000 + rand(seed) * 90000),
      stage,
      probability,
      closeDate,
      owner: pick(owners, seed),
      customerId: rand(seed) > 0.4 ? pick(dbCustomers, seed).id : null,
    });
  }
  await prisma.deal.createMany({ data: dealRows });

  // ---------- Metrics (system health, last 24h at 5 min resolution) ----------
  const metricRows = [];
  const metricDefs: { name: MetricName; base: number; jitter: number }[] = [
    { name: MetricName.CPU, base: 42, jitter: 18 },
    { name: MetricName.MEMORY, base: 61, jitter: 12 },
    { name: MetricName.LATENCY_P50, base: 84, jitter: 20 },
    { name: MetricName.LATENCY_P95, base: 240, jitter: 60 },
    { name: MetricName.LATENCY_P99, base: 520, jitter: 140 },
    { name: MetricName.ERROR_RATE, base: 0.4, jitter: 0.35 },
    { name: MetricName.REQUESTS_PER_MIN, base: 8200, jitter: 2200 },
    { name: MetricName.AVAILABILITY, base: 99.95, jitter: 0.06 },
  ];
  const points = 24 * 12; // 5-min buckets over 24h
  for (const svc of SERVICES) {
    for (const def of metricDefs) {
      for (let p = 0; p < points; p++) {
        const timestamp = new Date(today.getTime() - (points - p) * 5 * 60 * 1000);
        const wave = Math.sin(p / 14) * def.jitter * 0.5;
        const noise = (rand(seed) - 0.5) * def.jitter;
        const value = Math.max(0, def.base + wave + noise);
        metricRows.push({ name: def.name, service: svc, value: Math.round(value * 100) / 100, timestamp });
      }
    }
  }
  await prisma.metric.createMany({ data: metricRows });

  // ---------- Services ----------
  await prisma.service.createMany({
    data: SERVICES.map((name, i) => ({
      name,
      status: i === 3 ? ServiceStatus.DEGRADED : ServiceStatus.OPERATIONAL,
      uptime90d: Math.round((99.5 + rand(seed) * 0.5) * 1000) / 1000,
      region: pick(REGIONS, seed),
    })),
  });

  // ---------- Deployments ----------
  const deployRows = [];
  for (let i = 0; i < 40; i++) {
    const createdAt = new Date(today.getTime() - rand(seed) * 1000 * 60 * 60 * 24 * 30);
    const statusRoll = rand(seed);
    deployRows.push({
      service: pick(SERVICES, seed),
      version: `v${1 + Math.floor(rand(seed) * 4)}.${Math.floor(rand(seed) * 20)}.${Math.floor(rand(seed) * 10)}`,
      status: statusRoll < 0.86 ? DeploymentStatus.SUCCESS : statusRoll < 0.94 ? DeploymentStatus.ROLLED_BACK : DeploymentStatus.FAILED,
      author: pick(owners, seed),
      commitSha: Array.from({ length: 7 }, () => "0123456789abcdef"[Math.floor(rand(seed) * 16)]).join(""),
      durationSec: Math.round(30 + rand(seed) * 240),
      createdAt,
    });
  }
  await prisma.deployment.createMany({ data: deployRows });

  // ---------- Logs ----------
  const logMessages = [
    "Request completed successfully",
    "Cache miss for key metrics:rollup:daily",
    "Rate limit threshold approaching for org pulse-analytics",
    "Database connection pool at 78% utilization",
    "Webhook delivery failed after 3 retries",
    "Background job ingest-events finished in 4.2s",
    "Slow query detected (>1200ms) on customers table",
    "TLS certificate renewed for api.pulse.io",
    "Autoscaler added 2 replicas to query-engine",
    "Unhandled exception in notification-worker",
  ];
  const logRows = [];
  for (let i = 0; i < 300; i++) {
    const roll = rand(seed);
    const level = roll < 0.55 ? LogLevel.INFO : roll < 0.8 ? LogLevel.DEBUG : roll < 0.94 ? LogLevel.WARN : LogLevel.ERROR;
    logRows.push({
      level,
      service: pick(SERVICES, seed),
      message: pick(logMessages, seed),
      timestamp: new Date(today.getTime() - rand(seed) * 1000 * 60 * 60 * 6),
    });
  }
  await prisma.logEntry.createMany({ data: logRows });

  // ---------- Events (activity feed) ----------
  const eventTypes = [EventType.SIGNUP, EventType.LOGIN, EventType.UPGRADE, EventType.DOWNGRADE, EventType.CHURN, EventType.PAYMENT, EventType.API_CALL, EventType.FEATURE_USE];
  const eventRows = [];
  for (let i = 0; i < 250; i++) {
    const type = pick(eventTypes, seed);
    const customer = pick(dbCustomers, seed);
    const messages: Record<string, string> = {
      SIGNUP: `${customer.name} signed up for a free trial`,
      LOGIN: `${customer.name} logged in from a new device`,
      UPGRADE: `${customer.name} upgraded to a higher plan`,
      DOWNGRADE: `${customer.name} downgraded their plan`,
      CHURN: `${customer.name} cancelled their subscription`,
      PAYMENT: `${customer.name} completed a payment`,
      API_CALL: `${customer.name}'s integration made a burst of API calls`,
      FEATURE_USE: `${customer.name} created a new saved dashboard`,
    };
    eventRows.push({
      type,
      actor: customer.name,
      actorEmail: `${customer.name.toLowerCase().replace(" ", ".")}@example.com`,
      message: messages[type],
      timestamp: new Date(today.getTime() - rand(seed) * 1000 * 60 * 60 * 48),
    });
  }
  await prisma.event.createMany({ data: eventRows });

  // ---------- Notifications ----------
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, level: NotificationLevel.WARNING, title: "Error rate spike", body: "ingest-pipeline error rate crossed 2% for 5 minutes.", read: false },
      { userId: admin.id, level: NotificationLevel.SUCCESS, title: "Monthly report ready", body: "Your September performance report has been generated.", read: false },
      { userId: admin.id, level: NotificationLevel.INFO, title: "New teammate joined", body: "Priya Malhotra joined the Pulse Analytics workspace.", read: true },
      { userId: admin.id, level: NotificationLevel.ERROR, title: "Payment failed", body: "Redwood Legal's card was declined during renewal.", read: false },
      { userId: analyst.id, level: NotificationLevel.INFO, title: "Dashboard shared", body: "Reese Calloway shared 'Q3 Growth Review' with you.", read: false },
    ],
  });

  // ---------- Reports ----------
  await prisma.report.createMany({
    data: [
      { name: "Weekly Executive Summary", description: "Revenue, retention, and growth KPIs", cadence: ReportCadence.WEEKLY, format: ReportFormat.PDF, recipients: ["admin@pulse.io"], organizationId: org.id, ownerId: admin.id, lastRunAt: new Date(today.getTime() - 6 * 86400000), nextRunAt: new Date(today.getTime() + 86400000) },
      { name: "Monthly Board Deck Data", description: "MRR, churn, pipeline for board reporting", cadence: ReportCadence.MONTHLY, format: ReportFormat.PDF, recipients: ["admin@pulse.io", "analyst@pulse.io"], organizationId: org.id, ownerId: admin.id, lastRunAt: new Date(today.getTime() - 20 * 86400000), nextRunAt: new Date(today.getTime() + 10 * 86400000) },
      { name: "Daily System Health Digest", description: "Uptime, latency, and incident summary", cadence: ReportCadence.DAILY, format: ReportFormat.CSV, recipients: ["analyst@pulse.io"], organizationId: org.id, ownerId: analyst.id, lastRunAt: new Date(today.getTime() - 86400000), nextRunAt: new Date(today.getTime() + 3600000) },
      { name: "Customer Health Scorecard", description: "At-risk accounts and expansion signals", cadence: ReportCadence.WEEKLY, format: ReportFormat.CSV, recipients: ["admin@pulse.io"], organizationId: org.id, ownerId: admin.id, lastRunAt: new Date(today.getTime() - 3 * 86400000), nextRunAt: new Date(today.getTime() + 4 * 86400000) },
    ],
  });

  // ---------- Dashboards ----------
  await prisma.dashboard.createMany({
    data: [
      { name: "Executive Overview", description: "Default company-wide KPI overview", isDefault: true, organizationId: org.id, ownerId: admin.id },
      { name: "Q3 Growth Review", description: "Growth experiments and cohort retention", organizationId: org.id, ownerId: admin.id },
      { name: "Infra On-call Board", description: "Latency, error budgets, and deploy health", organizationId: org.id, ownerId: analyst.id },
    ],
  });

  // ---------- API Keys ----------
  await prisma.apiKey.createMany({
    data: [
      { name: "Production server key", keyPrefix: "pk_live_4f2a", keyHash: await bcrypt.hash("prod-key", 10), scopes: ["read:metrics", "read:events"], organizationId: org.id, createdById: admin.id, lastUsedAt: new Date(today.getTime() - 3600000) },
      { name: "Staging integration", keyPrefix: "pk_test_9c31", keyHash: await bcrypt.hash("staging-key", 10), scopes: ["read:metrics"], organizationId: org.id, createdById: analyst.id, lastUsedAt: new Date(today.getTime() - 86400000) },
      { name: "CI export bot", keyPrefix: "pk_live_a01e", keyHash: await bcrypt.hash("ci-key", 10), scopes: ["read:reports", "write:reports"], organizationId: org.id, createdById: admin.id },
    ],
  });

  console.log("Seed complete.");
  console.log("Accounts: admin@pulse.io / analyst@pulse.io / viewer@pulse.io — password: Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
