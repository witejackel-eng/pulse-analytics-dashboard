import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 p-4 sm:flex-row sm:p-6">
      <SettingsNav />
      <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
    </div>
  );
}
