import { SettingsSection } from "@/components/settings/settings-section";
import { ApiKeysManager } from "@/components/settings/api-keys-manager";
import { getApiKeys } from "@/server/queries/api-keys";

export default async function ApiKeysSettingsPage() {
  const keys = await getApiKeys();

  return (
    <SettingsSection title="API keys" description="Manage keys used to access the Pulse REST API.">
      <ApiKeysManager initial={keys} />
    </SettingsSection>
  );
}
