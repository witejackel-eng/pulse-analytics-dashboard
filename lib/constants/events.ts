import {
  UserPlus, LogIn, ArrowUpCircle, ArrowDownCircle,
  XCircle, CreditCard, Zap, AlertTriangle, Sparkles,
} from "lucide-react";
import type { EventType } from "@/lib/data/events";

export const EVENT_ICON: Record<EventType, typeof UserPlus> = {
  SIGNUP: UserPlus,
  LOGIN: LogIn,
  UPGRADE: ArrowUpCircle,
  DOWNGRADE: ArrowDownCircle,
  CHURN: XCircle,
  PAYMENT: CreditCard,
  API_CALL: Zap,
  ERROR: AlertTriangle,
  FEATURE_USE: Sparkles,
};

export const EVENT_COLOR: Record<EventType, string> = {
  SIGNUP: "text-accent-emerald",
  LOGIN: "text-accent-blue",
  UPGRADE: "text-accent-emerald",
  DOWNGRADE: "text-accent-amber",
  CHURN: "text-accent-red",
  PAYMENT: "text-accent-blue",
  API_CALL: "text-accent-purple",
  ERROR: "text-accent-red",
  FEATURE_USE: "text-accent-purple",
};