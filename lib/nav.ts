import {
  LayoutDashboard,
  Users,
  Activity,
  TrendingUp,
  FileBarChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  shortcut?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Executive KPIs, revenue, and live activity",
    shortcut: "G O",
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    description: "Segmentation, retention, and account health",
    shortcut: "G C",
  },
  {
    title: "System Health",
    href: "/dashboard/system",
    icon: Activity,
    description: "Latency, errors, deployments, and logs",
    shortcut: "G S",
  },
  {
    title: "Pipeline",
    href: "/dashboard/pipeline",
    icon: TrendingUp,
    description: "Deals, stages, and revenue forecast",
    shortcut: "G P",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
    description: "Scheduled reports and saved dashboards",
    shortcut: "G R",
  },
  {
    title: "Settings",
    href: "/dashboard/settings/profile",
    icon: Settings,
    description: "Profile, organization, billing, and API keys",
    shortcut: "G ,",
  },
];
