"use client";

import { Metric } from "@/lib/types";

const chartColors = ["#64d2ff", "#30d158", "#ff9f0a", "#bf5af2", "#ff2d55"];

export function MetricsChart({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="space-y-4">
      {metrics.map((metric, idx) => {
        const values = metric.values.map((v) => v.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;
        const color = chartColors[idx % chartColors.length];
        const latest = values[values.length - 1];
        const prev = values[values.length - 2] || latest;
        const change = prev ? ((latest - prev) / prev) * 100 : 0;

        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-[11px] text-muted-foreground">
                  {metric.name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  {metric.service}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] font-medium" style={{ color }}>
                  {latest.toLocaleString()}
                  {metric.unit}
                </span>
                <span
                  className={`font-mono text-[10px] ${
                    change > 0 ? "text-[#ff2d55]" : "text-[#30d158]"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Sparkline-style bar chart */}
            <div className="flex items-end gap-[2px] h-8">
              {values.map((value, vi) => {
                const height = ((value - min) / range) * 100;
                const isAnomaly = vi >= values.length - 4;
                return (
                  <div
                    key={vi}
                    className="flex-1 rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${Math.max(height, 4)}%`,
                      backgroundColor: isAnomaly
                        ? color
                        : `${color}33`,
                      opacity: isAnomaly ? 1 : 0.5,
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
