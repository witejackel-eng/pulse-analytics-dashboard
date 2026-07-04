"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleDef {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

const TOGGLES: ToggleDef[] = [
  { id: "weekly-summary", label: "Weekly summary email", description: "A digest of key metrics every Monday morning", defaultChecked: true },
  { id: "anomaly-alerts", label: "Anomaly alerts", description: "Notify me when a metric moves outside its expected range", defaultChecked: true },
  { id: "incident-alerts", label: "Incident alerts", description: "Notify me about service degradation or outages", defaultChecked: true },
  { id: "billing-alerts", label: "Billing alerts", description: "Payment failures, upcoming renewals, and invoices", defaultChecked: true },
  { id: "product-updates", label: "Product updates", description: "New features and changes to Pulse", defaultChecked: false },
  { id: "teammate-activity", label: "Teammate activity", description: "When teammates share dashboards or reports with you", defaultChecked: true },
];

export function NotificationToggles() {
  const [state, setState] = React.useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map((t) => [t.id, t.defaultChecked]))
  );

  return (
    <div className="flex flex-col gap-1">
      {TOGGLES.map((toggle, i) => (
        <div key={toggle.id}>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label htmlFor={toggle.id} className="text-text-primary">{toggle.label}</Label>
              <p className="mt-0.5 text-[12px] text-text-tertiary">{toggle.description}</p>
            </div>
            <Switch
              id={toggle.id}
              checked={state[toggle.id]}
              onCheckedChange={(checked) => setState((prev) => ({ ...prev, [toggle.id]: checked }))}
            />
          </div>
          {i < TOGGLES.length - 1 && <div className="h-px bg-border-subtle" />}
        </div>
      ))}
    </div>
  );
}
