"use client";

import * as React from "react";

export interface MetricTick {
  timestamp: string;
  values: Record<string, number>;
}

export function useLiveMetrics(maxTicks = 40) {
  const [ticks, setTicks] = React.useState<MetricTick[]>([]);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const source = new EventSource("/api/metrics/stream");

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);

    source.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data);
        if (payload.type !== "tick") return;
        setTicks((prev) => [...prev, payload as MetricTick].slice(-maxTicks));
      } catch {
        // ignore malformed payloads
      }
    };

    return () => source.close();
  }, [maxTicks]);

  const latest = ticks[ticks.length - 1]?.values ?? {};
  return { ticks, latest, connected };
}
