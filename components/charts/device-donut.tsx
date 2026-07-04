"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";

interface DeviceSlice {
  device: string;
  value: number;
  color: string;
}

export function DeviceDonut({ data }: { data: DeviceSlice[] }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-36 w-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="device"
              innerRadius={44}
              outerRadius={64}
              paddingAngle={3}
              stroke="none"
              isAnimationActive
              animationDuration={900}
            >
              {data.map((entry) => (
                <Cell key={entry.device} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatter={(value, name) => [`${value}%`, name]} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        {data.map((slice) => (
          <div key={slice.device} className="flex items-center gap-2 text-[12px]">
            <span className="size-2 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="text-text-secondary">{slice.device}</span>
            <span className="ml-auto font-medium tabular-nums text-text-primary">{slice.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
