"use client";

import * as React from "react";

interface AnimatedNumberProps {
  value: number;
  formatter?: (value: number) => string;
  className?: string;
  durationMs?: number;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({ value, formatter, className, durationMs = 700 }: AnimatedNumberProps) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const start = Date.now();
    const from = 0;
    const distance = value - from;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / durationMs);
      const next = from + distance * easeOutCubic(t);
      setDisplay(next);
      if (t >= 1) {
        clearInterval(interval);
        setDisplay(value);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [value, durationMs]);

  const format = formatter ?? ((v: number) => Math.round(v).toLocaleString("en-US"));

  return <span className={className}>{format(display)}</span>;
}
