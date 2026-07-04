import Link from "next/link";
import { Activity } from "lucide-react";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border-subtle bg-bg-sunken p-10 lg:flex">
        <div className="card-grid-line absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
        <div className="relative z-10 flex items-center gap-2 text-text-primary">
          <div className="flex size-7 items-center justify-center rounded-md bg-accent-blue text-white">
            <Activity className="size-4" />
          </div>
          <span className="text-[15px] font-semibold">Pulse</span>
        </div>
        <div className="relative z-10 max-w-md">
          <p className="text-2xl font-medium leading-snug text-text-primary">
            &ldquo;Pulse replaced four dashboards and a spreadsheet. Our whole
            leadership team looks at the same numbers now.&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-bg-elevated text-[12px] font-medium text-text-secondary">
              RC
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">Reese Calloway</p>
              <p className="text-[12px] text-text-tertiary">VP of Analytics, Pulse Analytics</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-[12px] text-text-disabled">
          © 2026 Pulse Analytics, Inc.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col gap-1 lg:hidden">
            <div className="flex items-center gap-2 text-text-primary">
              <div className="flex size-7 items-center justify-center rounded-md bg-accent-blue text-white">
                <Activity className="size-4" />
              </div>
              <span className="text-[15px] font-semibold">Pulse</span>
            </div>
          </div>
          <div className="mb-7">
            <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
            <p className="mt-1.5 text-[13px] text-text-tertiary">{subtitle}</p>
          </div>
          {children}
          <p className="mt-8 text-center text-[12px] text-text-disabled">
            <Link href="/" className="hover:text-text-tertiary">
              ← Back to overview
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
