# Component library

Pulse's components are organized in four layers. Lower layers know nothing
about the layers above them — `ui/` primitives never import from `dashboard/`
or `charts/`.

## 1. `components/ui/*` — design-system primitives

Hand-built on top of Radix UI primitives and styled with
`class-variance-authority` + `tailwind-merge` (`cn()` in `lib/utils.ts`).
Every component reads from the CSS custom properties defined in
`app/globals.css` (`--bg-*`, `--text-*`, `--accent-*`) rather than
hardcoding colors, so the whole app's theme lives in one file.

| Component | Notes |
| --- | --- |
| `button.tsx` | Variants: `default`, `primary`, `secondary`, `ghost`, `outline`, `destructive`, `link`. Sizes: `sm`, `default`, `lg`, `icon`. |
| `card.tsx` | `Card` + `CardHeader`/`CardTitle`/`CardDescription`/`CardAction`/`CardContent`/`CardFooter` — the base container for every dashboard panel. |
| `badge.tsx` | Status pills. Also exports `StatusDot`, a pulsing indicator dot used for live/online status. |
| `table.tsx` | Bare styled `<table>` primitives; paired with TanStack Table for interactive tables (see `components/tables/`). |
| `dialog.tsx`, `popover.tsx`, `dropdown-menu.tsx`, `select.tsx`, `tabs.tsx`, `tooltip.tsx` | Radix wrappers with consistent motion (`tw-animate-css`) and elevation. |
| `switch.tsx`, `checkbox.tsx`, `input.tsx`, `label.tsx` | Form primitives, used directly or via React Hook Form's `register()`. |
| `progress.tsx` | Simple determinate progress bar (health scores, usage meters). |
| `sonner.tsx` | Toast notifications, themed to match the dashboard. |

## 2. `components/charts/*` — Recharts wrappers

Every chart shares `chart-tooltip.tsx` for consistent formatting and reads
colors from the same CSS custom properties as the rest of the UI, so a chart
series in "emerald" is the exact emerald used in a badge or status dot
elsewhere on the page.

- `revenue-chart.tsx`, `traffic-chart.tsx` — time series (area/line)
- `device-donut.tsx`, `segmentation-chart.tsx` — categorical breakdowns
- `country-bars.tsx` — ranked bar list (see README trade-offs)
- `retention-chart.tsx` — multi-cohort line chart
- `funnel-chart.tsx` — hand-built funnel (not a Recharts primitive — Recharts'
  `FunnelChart` doesn't support per-step drop-off labels the way this needed)
- `forecast-chart.tsx` — composed chart: actual line + dashed forecast line +
  translucent confidence-range area, pinned together at the actual→forecast
  pivot point

## 3. Domain widgets

Grouped by the section they belong to: `components/dashboard/*` (Overview),
`components/system/*` (System Health), `components/pipeline/*` (Pipeline),
`components/settings/*` (Settings), `components/reports/*` (Reports),
`components/tables/*` (the full-featured `CustomersTable`), and
`components/auth/*` (login/forgot-password forms).

Notable ones:

- **`dashboard/animated-number.tsx`** — count-up counter driven by a
  `setInterval` easing tween (not `requestAnimationFrame`/framer-motion
  springs) so the final value always converges even in environments where
  animation-frame callbacks are throttled or suspended.
- **`dashboard/kpi-card.tsx`** — takes a `format` key (`"currency-compact"`,
  `"percent"`, etc.) and an `icon` name string rather than a formatter
  function or icon component, because it's rendered from Server Components:
  functions and component references aren't serializable across the
  server/client boundary, so the card resolves them to real functions/icons
  internally.
- **`tables/customers-table.tsx`** — the reference implementation for
  "enterprise-grade table": global search, faceted filters, sortable
  columns, row selection with a bulk-action bar, column resizing
  (`columnResizeMode: "onChange"`), pagination, and CSV export.
- **`system/log-stream.tsx`** — virtualized with `react-virtuoso` so
  hundreds of log lines cost a constant number of DOM nodes.

## 4. `components/layout/*` — app shell

`sidebar.tsx`, `topbar.tsx`, `dashboard-shell.tsx`, `command-palette.tsx`,
`date-range-picker.tsx`, `notifications-menu.tsx`, `user-menu.tsx`. These
compose the persistent frame every authenticated route renders inside
(`app/dashboard/layout.tsx`).

## Conventions

- **Server by default.** A component only gets `"use client"` if it needs
  state, effects, or browser APIs. Page components (`app/**/page.tsx`) are
  async Server Components that fetch data and pass plain props down.
- **No inline color literals.** Use the CSS custom properties
  (`var(--accent-blue)`, `bg-bg-surface`, etc.) so a future theme change is a
  one-file edit.
- **Currency/number/date formatting** goes through `lib/utils.ts`
  (`formatCurrency`, `formatCompactNumber`, `formatDate`,
  `formatRelativeTime`) — never call `Intl` or `toLocaleString` directly in a
  component.
