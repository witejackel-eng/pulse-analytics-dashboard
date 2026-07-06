"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLiveEvents } from "@/hooks/use-live-events";
import { StatusDot } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { EVENT_ICON, EVENT_COLOR } from "@/lib/constants/events";
import type { EventRecord } from "@/lib/data/events";

export function LiveEventFeed({ initial }: { initial: EventRecord[] }) {
  const { events, connected } = useLiveEvents(initial, 12);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
        <StatusDot variant={connected ? "emerald" : "amber"} />
        {connected ? "Live" : "Reconnecting…"}
      </div>
      <div className="flex flex-col gap-0.5">
        <AnimatePresence initial={false}>
          {events.slice(0, 8).map((event) => {
            const Icon = EVENT_ICON[event.type];
            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-2.5 rounded-md px-1.5 py-2 hover:bg-bg-hover"
              >
                <Icon className={`mt-0.5 size-3.5 shrink-0 ${EVENT_COLOR[event.type]}`} />
                <p className="flex-1 text-[12.5px] leading-snug text-text-secondary">{event.message}</p>
                <span className="shrink-0 text-[11px] text-text-disabled">{formatRelativeTime(event.timestamp)}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
