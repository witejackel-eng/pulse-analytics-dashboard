"use client";

import dynamic from "next/dynamic";

const skeleton = (className?: string) => (
  <div className={`animate-pulse rounded-lg bg-muted ${className ?? "h-[300px]"}`} />
);

export const DynamicRevenueChart = dynamic(
  () => import("./revenue-chart").then((m) => ({ default: m.RevenueChart })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicTrafficChart = dynamic(
  () => import("./traffic-chart").then((m) => ({ default: m.TrafficChart })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicDeviceDonut = dynamic(
  () => import("./device-donut").then((m) => ({ default: m.DeviceDonut })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicCountryBars = dynamic(
  () => import("./country-bars").then((m) => ({ default: m.CountryBars })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicForecastChart = dynamic(
  () => import("./forecast-chart").then((m) => ({ default: m.ForecastChart })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicSegmentationChart = dynamic(
  () => import("./segmentation-chart").then((m) => ({ default: m.SegmentationChart })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicRetentionChart = dynamic(
  () => import("./retention-chart").then((m) => ({ default: m.RetentionChart })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicFunnelChart = dynamic(
  () => import("./funnel-chart").then((m) => ({ default: m.FunnelChart })),
  { ssr: false, loading: () => skeleton() }
);

export const DynamicKpiCard = dynamic(
  () => import("../dashboard/kpi-card").then((m) => ({ default: m.KpiCard })),
  { ssr: false, loading: () => skeleton("h-[120px]") }
);

export const DynamicSystemMetricsPanel = dynamic(
  () => import("../system/system-metrics-panel").then((m) => ({ default: m.SystemMetricsPanel })),
  { ssr: false, loading: () => skeleton("h-[400px]") }
);