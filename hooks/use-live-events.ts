"use client";

import * as React from "react";
import type { EventRecord } from "@/lib/data/events";

export function useLiveEvents(initial: EventRecord[], max = 30) {
  const [events, setEvents] = React.useState<EventRecord[]>(initial);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const source = new EventSource("/api/events/stream");

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);

    source.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data);
        if (payload.type === "connected") return;
        setEvents((prev) => [payload as EventRecord, ...prev].slice(0, max));
      } catch {
        // ignore malformed payloads
      }
    };

    return () => source.close();
  }, [max]);

  return { events, connected };
}
