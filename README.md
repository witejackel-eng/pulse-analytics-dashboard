# Pulse — Real-time Analytics Platform

[![Live Demo](https://img.shields.io/badge/demo-pulse--aadi--project.vercel.app-brightgreen?style=flat-square)](https://pulse-aadi-project.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![NextAuth](https://img.shields.io/badge/NextAuth-v5-blue?style=flat-square)](https://authjs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)


Pulse is an enterprise-grade, real-time analytics dashboard — the kind of
operational surface used by product, growth, and infrastructure teams to
watch revenue, customers, and system health in one place. It's a full-stack
build: Next.js 15 (App Router) + React 19 on the frontend, Prisma/PostgreSQL
and NextAuth on the backend, with live updates streamed over Server-Sent
Events.

Read the full design + engineering write-up at [`/case-study`](http://localhost:3000/case-study)
once the app is running.

## Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Recharts, TanStack Table, TanStack Query, React Hook Form + Zod, React Virtuoso, Radix UI, cmdk, Lucide icons
- **Backend:** Next.js Route Handlers, Prisma 6, PostgreSQL, Server-Sent Events
- **Auth:** NextAuth v5 (credentials + Google OAuth), JWT sessions, role-based access
- **Deployment target:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, etc.
npm run db:generate          # generate the Prisma client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with one of the
seeded demo accounts (see below) or continue with Google once OAuth
credentials are configured.

> The repo also includes a plain `.env` with a non-secret placeholder
> `DATABASE_URL`. It exists purely so `prisma generate` has something to
> resolve during `npm install`/`npm run build` even before you've configured a
> real database (locally or on a hosting provider) — it's never used to
> connect to anything, and your real `DATABASE_URL` in `.env.local` (or set in
> your host's dashboard) always takes precedence. See [`DEPLOYMENT.md`](./DEPLOYMENT.md#prisma--vercel-build-failures)
> if you hit a Prisma `Validation Error Count: 1` during deployment.

### Demo accounts

| Email               | Password       | Role    |
| ------------------- | -------------- | ------- |
| admin@pulse.io       | Password123!   | Admin   |
| analyst@pulse.io     | Password123!   | Analyst |
| viewer@pulse.io      | Password123!   | Viewer  |

### Database

The Prisma schema (`prisma/schema.prisma`) models organizations, users,
revenue, traffic, customers, deals, system metrics, deployments, logs,
reports, and notifications, plus the standard NextAuth tables.

```bash
npm run db:push     # push the schema to your database
npm run db:seed      # seed realistic demo data (12 months of revenue/traffic,
                      # 120 customers, 64 deals, system metrics, logs, etc.)
npm run db:studio    # browse the database with Prisma Studio
```

These `db:*` scripts (unlike `db:generate`/`postinstall`) load `.env.local` via
`dotenv-cli`, so they target the real database you've configured there rather
than the placeholder in `.env` — the Prisma CLI doesn't read `.env.local` on
its own.
```

**No live database? The app still works.** Every read in
`server/queries/*.ts` tries Prisma first and, on any connection error or
empty result, falls back to a deterministic curated dataset in
`lib/data/*.ts` with the same shape (see the [case study](./app/case-study/page.tsx)
for why this pattern exists). This means you can run `npm run dev` right
now, with no Postgres instance configured, and the entire product — including
sign-in — works end-to-end against realistic seeded-looking data.

### Scripts

| Script              | Purpose                                         |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start the dev server (Turbopack)                 |
| `npm run build`      | Production build                                 |
| `npm run start`      | Run the production build                         |
| `npm run lint`       | ESLint                                           |
| `npm run db:generate`| Regenerate the Prisma client                     |
| `npm run db:push`    | Push the schema to your database                 |
| `npm run db:migrate` | Create/apply a migration                         |
| `npm run db:seed`    | Seed the database with demo data                 |
| `npm run db:studio`  | Open Prisma Studio                               |

## Project structure

```
app/
  page.tsx                 Landing page
  login/, forgot-password/ Auth pages
  case-study/               Design & engineering case study
  dashboard/
    layout.tsx              Shared shell (sidebar, topbar, command palette)
    page.tsx                 Overview: KPIs, revenue/traffic, pipeline, activity
    customers/                Segmentation, retention, funnel, customer table
    system/                    Live metrics, services, deployments, log stream
    pipeline/                   Kanban pipeline, deals table, revenue forecast
    reports/                     Scheduled reports, saved dashboards
    settings/                    Profile, org, notifications, billing, API keys, security, preferences
  api/
    auth/[...nextauth]/        NextAuth route handler
    events/stream, metrics/stream  Server-Sent Events endpoints
components/
  ui/            Design-system primitives (button, card, table, dialog, ...)
  charts/         Recharts wrappers with shared tooltip/theme
  dashboard/      Overview widgets (KPI card, activity/live feeds, ...)
  system/         System health widgets
  pipeline/       Pipeline board, deals table
  settings/       Settings forms
  layout/         Sidebar, topbar, command palette, date range picker
lib/data/        Curated fallback datasets (seeded, deterministic)
server/queries/  Prisma-first / curated-fallback data access layer
prisma/          Schema + seed script
```

## Known scope trade-offs

This is a demo/portfolio build, not a production SaaS with paying customers.
A few things are intentionally simplified rather than half-built:

- **Real-time transport is Server-Sent Events, not WebSockets.** SSE is
  one-directional and works cleanly on Vercel's serverless runtime without a
  separate socket server; a production deployment with bidirectional needs
  (e.g. collaborative editing) would introduce a dedicated WebSocket service
  (Pusher, Ably, or a custom Node process) instead.
- **The "country map" is a ranked bar list, not a choropleth.** It communicates
  the same information (where traffic comes from) without the bundle size and
  GeoJSON overhead of a full map library.
- **Settings forms persist to local component state, not the database.**
  Profile, notifications, and preferences forms are fully interactive and
  validated (React Hook Form + Zod) but don't yet write through to Prisma —
  the API surface (`server/queries/*.ts`) is there to extend into real
  mutations.
- **Email delivery (password reset, scheduled report emails) is mocked.**
  The forgot-password flow and report scheduling UI are complete, but no
  transactional email provider is wired up.
- **Google OAuth requires your own credentials.** The provider is configured
  and the button is live; set `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` in
  `.env.local` to enable it. Credentials sign-in works out of the box with
  the seeded demo accounts.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full Vercel + managed Postgres
deployment guide.
