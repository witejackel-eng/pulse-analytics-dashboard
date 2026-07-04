import { auth } from "@/auth";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function ProfileSettingsPage() {
  const session = await auth();

  return (
    <ProfileForm
      defaultValues={{
        name: session?.user?.name ?? "Reese Calloway",
        email: session?.user?.email ?? "admin@pulse.io",
        title: "VP of Analytics",
      }}
    />
  );
}
