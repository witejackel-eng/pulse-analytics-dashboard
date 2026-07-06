"use client";

import { useDateRange } from "@/components/date-range-context";
import { OverviewContent } from "@/components/dashboard/overview-content";

export default function OverviewPage() {
  const { from, to } = useDateRange();
  const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));

  return <OverviewContent days={days} />;
}