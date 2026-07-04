import Link from "next/link";
import {
  Activity, ArrowRight, BarChart3, Gauge, Users, Radio, ShieldCheck, GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  { icon: BarChart3, title: "Executive metrics", description: "Revenue, MRR, retention, and growth in one live view." },
  { icon: Radio, title: "Real-time events", description: "Streaming activity feed and product events, no refresh needed." },
  { icon: Users, title: "Customer analytics", description: "Segmentation, LTV, churn, and account health scoring." },
  { icon: Gauge, title: "System health", description: "Latency, error budgets, deployments, and log streams." },
  { icon: GitBranch, title: "Sales pipeline", description: "Stage-by-stage forecasting with weighted revenue." },
  { icon: ShieldCheck, title: "Enterprise-ready", description: "Role-based access, audit-friendly, SSO-compatible." },
];

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-bg-base">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-accent-blue text-white">
            <Activity className="size-4" />
          </div>
          <span className="text-[15px] font-semibold text-text-primary">Pulse</span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/case-study">Case study</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </nav>
      </header>

      <section className="card-grid-line relative mx-auto max-w-6xl overflow-hidden px-6 py-24 text-center [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] sm:py-32">
        <Badge variant="blue" className="mx-auto mb-6 w-fit">
          Real-time analytics for enterprise teams
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
          Every metric that matters, updating the moment it happens.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-text-tertiary">
          Pulse unifies revenue, product, customer, and infrastructure data into a
          single operational dashboard — built for teams who make decisions in real time.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href="/dashboard">
              View live demo <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border-default bg-bg-surface p-5 transition-colors hover:border-border-strong"
              >
                <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-bg-surface-2 text-accent-blue">
                  <Icon className="size-4" />
                </div>
                <h3 className="text-[14px] font-medium text-text-primary">{feature.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-text-tertiary">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border-subtle py-8 text-center text-[12px] text-text-disabled">
        © 2026 Pulse Analytics, Inc. — Built with Next.js, Prisma, and Recharts.
      </footer>
    </div>
  );
}
