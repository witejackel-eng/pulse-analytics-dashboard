import { User, Building2, Bell, CreditCard, KeyRound, ShieldCheck, SlidersHorizontal } from "lucide-react";

export const SETTINGS_NAV = [
  { title: "Profile", href: "/dashboard/settings/profile", icon: User },
  { title: "Organization", href: "/dashboard/settings/organization", icon: Building2 },
  { title: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
  { title: "Billing", href: "/dashboard/settings/billing", icon: CreditCard },
  { title: "API Keys", href: "/dashboard/settings/api-keys", icon: KeyRound },
  { title: "Security", href: "/dashboard/settings/security", icon: ShieldCheck },
  { title: "Preferences", href: "/dashboard/settings/preferences", icon: SlidersHorizontal },
];
