import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Business problem" },
  { id: "research", label: "Research & personas" },
  { id: "goals", label: "Goals & success metrics" },
  { id: "flows", label: "User flows & wireframes" },
  { id: "architecture", label: "Dashboard architecture" },
  { id: "design-system", label: "Design system" },
  { id: "components", label: "Component library" },
  { id: "dataviz", label: "Data visualization strategy" },
  { id: "backend", label: "Backend architecture" },
  { id: "performance", label: "Performance" },
  { id: "accessibility", label: "Accessibility" },
  { id: "testing", label: "Testing" },
  { id: "deployment", label: "Deployment" },
  { id: "lessons", label: "Lessons learned" },
];

export function CaseStudyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-bg-base">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border-subtle bg-bg-base/80 px-6 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-text-primary">
          <div className="flex size-6 items-center justify-center rounded-md bg-accent-blue text-white">
            <Activity className="size-3.5" />
          </div>
          <span className="text-[14px] font-semibold">Pulse</span>
        </Link>
        <span className="text-text-disabled">/</span>
        <span className="text-[13px] text-text-tertiary">Case study</span>
        <Link href="/dashboard" className="ml-auto flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary">
          <ArrowLeft className="size-3.5" />
          Back to dashboard
        </Link>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-12">
        <aside className="sticky top-20 hidden h-fit w-56 shrink-0 flex-col gap-0.5 lg:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-md px-2.5 py-1.5 text-[12.5px] text-text-tertiary transition-colors hover:bg-bg-hover hover:text-text-secondary"
            >
              {section.label}
            </a>
          ))}
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
