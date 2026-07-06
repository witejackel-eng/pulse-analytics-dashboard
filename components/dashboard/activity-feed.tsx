import { formatRelativeTime } from "@/lib/utils";
import { EVENT_ICON, EVENT_COLOR } from "@/lib/constants/events";
import type { EventRecord } from "@/lib/data/events";

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
