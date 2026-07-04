import { SettingsSection } from "@/components/settings/settings-section";
import { MockSaveButton } from "@/components/settings/mock-save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function OrganizationSettingsPage() {
  return (
    <SettingsSection
      title="Organization"
      description="Manage your workspace details and branding."
      footer={<MockSaveButton successMessage="Organization updated" />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="org-name">Organization name</Label>
          <Input id="org-name" defaultValue="Pulse Analytics" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="org-slug">Workspace URL</Label>
          <div className="flex items-center gap-1 text-[13px] text-text-tertiary">
            <span>app.pulse.io/</span>
            <Input id="org-slug" defaultValue="pulse-analytics" className="flex-1" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-surface-2 px-4 py-3">
        <div>
          <p className="text-[13px] font-medium text-text-primary">Current plan</p>
          <p className="text-[12px] text-text-tertiary">Enterprise — billed annually</p>
        </div>
        <Badge variant="blue">Enterprise</Badge>
      </div>
    </SettingsSection>
  );
}
