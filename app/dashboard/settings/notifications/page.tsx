import { SettingsSection } from "@/components/settings/settings-section";
import { NotificationToggles } from "@/components/settings/notification-toggles";

export default function NotificationSettingsPage() {
  return (
    <SettingsSection title="Notifications" description="Choose what you want to be notified about, and how.">
      <NotificationToggles />
    </SettingsSection>
  );
}
