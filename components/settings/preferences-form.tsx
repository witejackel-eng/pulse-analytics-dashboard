"use client";

import * as React from "react";
import { toast } from "sonner";
import { Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "@/components/settings/settings-section";

export function PreferencesForm() {
  const [compact, setCompact] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <SettingsSection title="Appearance" description="Pulse is designed as a dark, high-density workspace.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="size-4 text-text-tertiary" />
            <div>
              <p className="text-[13px] text-text-primary">Theme</p>
              <p className="text-[12px] text-text-tertiary">Dark is the only theme available today</p>
            </div>
          </div>
          <Select defaultValue="dark" disabled>
            <SelectTrigger size="sm" className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-text-primary">Compact density</p>
            <p className="text-[12px] text-text-tertiary">Reduce padding across tables and lists</p>
          </div>
          <Switch checked={compact} onCheckedChange={(v) => { setCompact(v); toast.success(v ? "Compact density enabled" : "Compact density disabled"); }} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-text-primary">Reduce motion</p>
            <p className="text-[12px] text-text-tertiary">Minimize chart and transition animations</p>
          </div>
          <Switch
            checked={reduceMotion}
            onCheckedChange={(v) => {
              setReduceMotion(v);
              document.documentElement.setAttribute("data-reduce-motion", String(v));
              toast.success(v ? "Motion reduced" : "Motion restored");
            }}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Regional" description="Control how dates, times, and numbers are displayed.">
        <div className="flex items-center justify-between">
          <Label>Timezone</Label>
          <Select defaultValue="ist">
            <SelectTrigger size="sm" className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ist">India Standard Time (UTC+5:30)</SelectItem>
              <SelectItem value="utc">Coordinated Universal Time</SelectItem>
              <SelectItem value="pst">Pacific Time (UTC-8)</SelectItem>
              <SelectItem value="est">Eastern Time (UTC-5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label>Date format</Label>
          <Select defaultValue="mdy">
            <SelectTrigger size="sm" className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
              <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
              <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingsSection>
    </div>
  );
}
