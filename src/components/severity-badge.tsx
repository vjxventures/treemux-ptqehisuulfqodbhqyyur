"use client";

import { Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityConfig: Record<
  Severity,
  { label: string; bg: string; text: string; dot: string }
> = {
  critical: {
    label: "CRIT",
    bg: "bg-[#ff2d55]/10",
    text: "text-[#ff2d55]",
    dot: "bg-[#ff2d55]",
  },
  high: {
    label: "HIGH",
    bg: "bg-[#ff9500]/10",
    text: "text-[#ff9500]",
    dot: "bg-[#ff9500]",
  },
  medium: {
    label: "MED",
    bg: "bg-[#ffcc00]/10",
    text: "text-[#ffcc00]",
    dot: "bg-[#ffcc00]",
  },
  low: {
    label: "LOW",
    bg: "bg-[#30d158]/10",
    text: "text-[#30d158]",
    dot: "bg-[#30d158]",
  },
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  const config = severityConfig[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[11px] font-semibold tracking-wider uppercase",
        config.bg,
        config.text,
        severity === "critical" && "animate-critical-pulse",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          config.dot,
          severity === "critical" && "animate-status-blink"
        )}
      />
      {config.label}
    </span>
  );
}
