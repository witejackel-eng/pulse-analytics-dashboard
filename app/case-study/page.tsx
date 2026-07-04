import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/case-study-shell";
import { Section } from "@/components/case-study/section";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Case study — Pulse",
  description: "Design and engineering case study for Pulse, a real-time enterprise analytics platform.",
};

export default function CaseStudyPage() {
  return (
    <CaseStudyShell>
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge variant="blue">Product design</Badge>
          <Badge variant="purple">Frontend engineering</Badge>
          <Badge variant="emerald">Data visualization</Badge>
          <Badge variant="amber">Systems architecture</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Pulse: a real-time analytics platform for enterprise operators
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-tertiary">
          A from-scratch design and build of a Stripe/Datadog-grade operational dashboard —
          covering research, information architecture, the design system, live data
          infrastructure, and the engineering decisions behind all of it.
        </p>
      </div>

      <Section id="overview" number="01" title="Project overview">
        <p>
          Pulse is a unified analytics workspace that brings revenue, product usage,
          customer health, infrastructure telemetry, and sales pipeline data into a single
          real-time surface. It was built to answer a specific complaint heard across growth-stage
          SaaS companies: teams have a metric for everything, but no single place where an
          executive, analyst, or on-call engineer can see the state of the business in one glance.
        </p>
        <p>
          The build spans the full stack — a Next.js 15 / React 19 frontend, a Prisma/PostgreSQL
          data layer, NextAuth-based authentication with role-aware sessions, and a
          Server-Sent-Events streaming layer that keeps KPIs, activity feeds, and system metrics
          moving without polling or full-page refreshes.
        </p>
      </Section>

      <Section id="problem" number="02" title="Business problem">
        <p>
          Fast-growing companies accumulate dashboards the way they accumulate SaaS tools —
          one for revenue (finance), one for product analytics (growth), one for infrastructure
          (engineering), and a CRM export for sales. Each is internally consistent but they never
          agree with each other, and none of them update fast enough to matter during an incident
          or a launch.
        </p>
        <p>
          The brief was to design a single operational dashboard that could credibly replace all
          four, with three non-negotiable constraints:
        </p>
        <ul>
          <li>It has to feel <strong>immediate</strong> — numbers that move, not numbers you refresh.</li>
          <li>It has to serve <strong>four different roles</strong> without becoming four different products.</li>
          <li>It has to look like software a Fortune 500 buyer would trust with their revenue data.</li>
        </ul>
      </Section>

      <Section id="research" number="03" title="Research & personas">
        <p>
          Before any pixels, the products already winning this space were audited directly:
          Stripe Dashboard for information density and restraint, Linear for interaction speed
          and the command palette pattern, Datadog and Grafana for how they handle
          high-cardinality time series without becoming noisy, and Vercel Analytics for how
          little chrome a metric actually needs to be legible.
        </p>
        <p>The result was four personas that map directly onto Pulse&apos;s information architecture:</p>
        <h3>Reese — VP of Analytics (Executive)</h3>
        <p>
          Checks Pulse once in the morning and once before a leadership sync. Needs revenue,
          growth, and churn trends at a glance, with enough context to answer &ldquo;why&rdquo; without
          pulling in an analyst.
        </p>
        <h3>Devon — Senior Data Analyst (Analyst)</h3>
        <p>
          Lives in the Customer Analytics and Reports sections. Needs to segment, export, and
          build a case for a retention initiative using real cohort data, not summary stats.
        </p>
        <h3>Priya — Product Manager (Operator)</h3>
        <p>
          Watches feature adoption and the acquisition funnel. Cares about the live event feed
          because it&apos;s the fastest way to sanity-check that a shipped feature is actually being used.
        </p>
        <h3>On-call engineer (Infrastructure)</h3>
        <p>
          Opens System Health during an incident, not before. Needs latency, error rate, and
          deploy history in one place, with zero ambiguity about what &ldquo;degraded&rdquo; means.
        </p>
      </Section>

      <Section id="goals" number="04" title="Goals & success metrics">
        <ul>
          <li><strong>Time to insight under 5 seconds</strong> — the overview page must answer &ldquo;is the business healthy today&rdquo; without scrolling or filtering.</li>
          <li><strong>One codebase, four roles</strong> — role-aware navigation and permissions instead of four separate apps.</li>
          <li><strong>Sub-3-second perceived latency</strong> for any chart or table interaction, including 90-day time series with hundreds of points.</li>
          <li><strong>Live by default</strong> — the activity feed and system metrics update without a manual refresh, with no layout shift when they do.</li>
          <li><strong>Enterprise-credible visual design</strong> — dense, restrained, dark-first, with color reserved strictly for meaning (status, direction, risk).</li>
        </ul>
      </Section>

      <Section id="flows" number="05" title="User flows & wireframes">
        <p>
          The core flow is intentionally short: <strong>sign in → land on Overview → drill into a
          section that matches your role → act (export, share, or escalate)</strong>. Early wireframes
          explored a single infinitely-tall dashboard versus a sectioned app; the sectioned model
          won because Devon&apos;s analyst workflows (filtering, exporting, sorting large tables)
          need dedicated screen real estate that a shared overview page can&apos;t spare without
          overwhelming Reese&apos;s five-second glance.
        </p>
        <p>
          That produced the six-section IA that ships today: <strong>Overview, Customers, System
          Health, Pipeline, Reports, and Settings</strong> — reachable from a persistent sidebar and,
          for power users, the <strong>⌘K command palette</strong>, which was wireframed early specifically
          so navigation never blocks on a mouse.
        </p>
        <p>
          Low-fidelity passes were done as grayscale block wireframes to lock information
          hierarchy (KPI row → primary chart → secondary charts → tables/feeds) before any
          color or type decisions, which kept the design system phase focused purely on
          expressing an already-validated layout rather than discovering it.
        </p>
      </Section>

      <Section id="architecture" number="06" title="Dashboard architecture">
        <p>
          Every top-level route is a React Server Component that fetches its data in parallel
          with <code className="mono-nums text-[13px]">Promise.all</code> and passes plain,
          serializable props down to client components for interactivity — charts, tables, and
          live widgets are the only parts of the tree that ship JavaScript for state. The shared{" "}
          <code className="mono-nums text-[13px]">DashboardShell</code> (sidebar, topbar, command
          palette) wraps every authenticated route from a single layout, so navigation state,
          the global date-range filter, and notifications are consistent everywhere.
        </p>
        <p>
          Real-time updates run over <strong>Server-Sent Events</strong> rather than WebSockets:
          each browser tab opens a single long-lived <code className="mono-nums text-[13px]">EventSource</code>{" "}
          per live surface (the activity feed, system metrics), and the server streams
          incremental ticks that get merged into the already-rendered chart data client-side —
          no polling, no full re-fetch, and no layout shift when a new point arrives.
        </p>
      </Section>

      <Section id="design-system" number="07" title="Design system">
        <p>
          The palette is deliberately narrow: a graphite/charcoal surface scale for structure,
          and five accent colors — blue, emerald, amber, red, purple — reserved exclusively for
          meaning (primary action, positive, warning, negative, and a fifth &ldquo;other&rdquo; category
          used sparingly for segmentation). Nothing is colored for decoration; a chart series or
          badge earns color only when its color communicates state.
        </p>
        <p>
          Typography is Geist Sans for UI text and Geist Mono for anything numeric or
          identifier-like (currency deltas, commit SHAs, API keys), which reinforces the
          &ldquo;this number is precise&rdquo; feeling that Stripe and Linear both use well. Every
          interactive surface — buttons, inputs, popovers, dialogs — shares the same 6px/10px
          radius scale and a single elevation model (four background layers, from{" "}
          <code className="mono-nums text-[13px]">bg-base</code> to{" "}
          <code className="mono-nums text-[13px]">bg-overlay</code>) instead of ad hoc shadows.
        </p>
      </Section>

      <Section id="components" number="08" title="Component library">
        <p>
          Roughly 30 primitives were hand-built on top of Radix UI (dialog, dropdown, popover,
          select, tabs, tooltip, switch, checkbox, avatar) and styled to the theme with{" "}
          <code className="mono-nums text-[13px]">class-variance-authority</code> — this was
          chosen over pulling a pre-styled kit so every component could share the exact token
          set (colors, radii, motion) defined for Pulse rather than inheriting a different
          design language. On top of those primitives sit domain components: the KPI card with
          its animated counter and sparkline, the enterprise data table (TanStack Table, with
          sorting, column resizing, row selection, and CSV export), the virtualized log stream
          (React Virtuoso, for scrolling through hundreds of entries without a DOM cost), and the
          command palette (cmdk).
        </p>
      </Section>

      <Section id="dataviz" number="09" title="Data visualization strategy">
        <p>
          Every chart in Pulse is built on Recharts with a shared tooltip component so
          formatting (currency, compact numbers, dates) is consistent across the revenue area
          chart, traffic lines, device donut, segmentation bars, cohort retention lines, the
          acquisition funnel, and the forecast chart&apos;s confidence band. The forecast chart in
          particular composes three series — a solid &ldquo;actual&rdquo; line, a dashed &ldquo;forecast&rdquo; line, and
          a translucent range area for the confidence band — pinned together at the exact month
          they diverge so the projection reads as a continuation, not a disconnected second chart.
        </p>
        <p>
          KPI cards use a lightweight count-up animation and a 14-point sparkline so a number
          never appears as a flat, static fact — every headline metric carries its own recent
          trend without needing a separate chart.
        </p>
      </Section>

      <Section id="backend" number="10" title="Backend architecture">
        <p>
          The data model is a 20-table Prisma/PostgreSQL schema covering organizations, users,
          revenue, traffic, customers, deals, system metrics, deployments, logs, reports, and
          notifications — designed to mirror what a real analytics/CRM backend would look like,
          including proper NextAuth account/session tables and role-based access
          (Admin/Analyst/Viewer).
        </p>
        <p>
          Every read goes through a <strong>Prisma-first, curated-fallback</strong> pattern: each
          function in <code className="mono-nums text-[13px]">server/queries/*.ts</code> tries the
          live database first and, on any connection error or empty result, falls back to a
          deterministic, seeded dataset that matches the same shape. This was a deliberate
          resilience decision, not just a development convenience — it means the product degrades
          gracefully instead of blank-screening if the database is temporarily unreachable, and it
          let this entire build be verified end-to-end in the browser without a live Postgres
          instance in the build environment.
        </p>
      </Section>

      <Section id="performance" number="11" title="Performance optimizations">
        <ul>
          <li>Server Components by default; client components are opt-in and limited to interactive leaves (charts, tables, forms, live feeds).</li>
          <li>Route-level data fetching runs in parallel with <code className="mono-nums text-[13px]">Promise.all</code> instead of sequential awaits.</li>
          <li>Long lists (logs, large tables) are virtualized so DOM node count stays constant regardless of row count.</li>
          <li>Server-Sent Events instead of polling — one persistent connection per live surface instead of repeated fetches.</li>
          <li>Deterministic, seeded data generation means charts never jump or flicker between reloads during development.</li>
        </ul>
      </Section>

      <Section id="accessibility" number="12" title="Accessibility">
        <p>
          All interactive primitives are built on Radix UI, which provides correct roles,
          keyboard navigation, and focus management out of the box for menus, dialogs, and
          popovers. Every custom control (switches, checkboxes, the command palette) is
          keyboard-operable, focus states use a visible ring rather than relying on color alone,
          and status is always paired with text (a colored dot never appears without an
          accompanying label like &ldquo;Operational&rdquo; or &ldquo;Degraded&rdquo;) so meaning doesn&apos;t depend on
          color perception.
        </p>
      </Section>

      <Section id="testing" number="13" title="Testing">
        <p>
          Correctness was verified continuously in a real browser throughout the build rather
          than only at the end: every new page was loaded, exercised (filtering, sorting,
          exporting, opening dialogs), and checked for console errors before moving to the next
          screen. The schema was validated independently of a live database using{" "}
          <code className="mono-nums text-[13px]">prisma validate</code> and{" "}
          <code className="mono-nums text-[13px]">prisma generate</code>, and the production build
          (<code className="mono-nums text-[13px]">next build</code>) is treated as the final type
          and lint gate across the whole codebase.
        </p>
      </Section>

      <Section id="deployment" number="14" title="Deployment">
        <p>
          Pulse is built for Vercel: the Next.js app deploys directly, environment variables
          (<code className="mono-nums text-[13px]">DATABASE_URL</code>,{" "}
          <code className="mono-nums text-[13px]">AUTH_SECRET</code>, OAuth credentials) are the
          only required configuration, and Prisma migrations run against any managed Postgres
          provider (Neon, Supabase, or RDS). Because of the curated-fallback data layer, the app
          is demo-able immediately after deploy, even before a production database is fully
          seeded.
        </p>
      </Section>

      <Section id="lessons" number="15" title="Lessons learned">
        <ul>
          <li>
            <strong>Resilience patterns pay for themselves twice.</strong> The Prisma-first/fallback
            pattern was built for graceful production degradation, but its biggest payoff was
            during development — it made the entire product demo-able and testable without ever
            standing up infrastructure.
          </li>
          <li>
            <strong>Server/Client boundaries need explicit contracts.</strong> The most subtle bugs
            in this build came from passing non-serializable values (icon components, formatter
            functions) from Server Components into Client Components — the fix was always to pass
            plain data (a format key, an icon name) and resolve it to a component or function
            inside the client boundary.
          </li>
          <li>
            <strong>A country breakdown doesn&apos;t need a map.</strong> A ranked bar list communicates
            &ldquo;where our traffic comes from&rdquo; faster than a choropleth map and costs a fraction of
            the bundle size — a conscious scope trade-off in favor of clarity over spectacle.
          </li>
        </ul>
      </Section>
    </CaseStudyShell>
  );
}
