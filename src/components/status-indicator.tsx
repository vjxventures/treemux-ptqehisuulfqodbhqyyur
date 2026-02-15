"use client";

import { IncidentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  IncidentStatus,
  { label: string; color: string; bgColor: string }
> = {
  firing: {
    label: "FIRING",
    color: "text-[#ff2d55]",
    bgColor: "bg-[#ff2d55]",
  },
  investigating: {
    label: "INVESTIGATING",
    color: "text-[#ff9f0a]",
    bgColor: "bg-[#ff9f0a]",
  },
  resolved: {
    label: "RESOLVED",
    color: "text-[#30d158]",
    bgColor: "bg-[#30d158]",
  },
};

export function StatusIndicator({ status }: { status: IncidentStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider", config.color)}>
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          config.bgColor,
          status === "firing" && "animate-status-blink"
        )}
      />
      {config.label}
    </span>
  );
}
