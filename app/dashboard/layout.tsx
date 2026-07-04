import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getNotifications } from "@/server/queries/notifications";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const notifications = await getNotifications(session?.user?.id);

  const user = {
    name: session?.user?.name ?? "Reese Calloway",
    email: session?.user?.email ?? "admin@pulse.io",
    image: session?.user?.image,
    role: session?.user?.role ?? "ADMIN",
  };

  return (
    <DashboardShell user={user} notifications={notifications}>
      {children}
    </DashboardShell>
  );
}
