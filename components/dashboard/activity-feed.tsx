import { UserPlus, LogIn, ArrowUpCircle, ArrowDownCircle, XCircle, CreditCard, Zap, AlertTriangle, Sparkles } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { EventRecord, EventType } from "@/lib/data/events";

const EVENT_ICON: Record<EventType, typeof UserPlus> = {
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

const EVENT_COLOR: Record<EventType, string> = {
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

export function ActivityFeed({ events }: { events: EventRecord[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      {events.map((event) => {
        const Icon = EVENT_ICON[event.type];
        return (
          <div key={event.id} className="flex items-start gap-2.5 rounded-md px-1.5 py-2 hover:bg-bg-hover">
            <Icon className={`mt-0.5 size-3.5 shrink-0 ${EVENT_COLOR[event.type]}`} />
            <p className="flex-1 text-[12.5px] leading-snug text-text-secondary">{event.message}</p>
            <span className="shrink-0 text-[11px] text-text-disabled">{formatRelativeTime(event.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}
