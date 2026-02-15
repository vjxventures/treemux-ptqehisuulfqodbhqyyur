"use client";

import { LogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const levelColors: Record<string, string> = {
  error: "text-[#ff2d55]",
  warn: "text-[#ff9f0a]",
  info: "text-[#64d2ff]",
  debug: "text-[#64748b]",
};

const levelBg: Record<string, string> = {
  error: "bg-[#ff2d55]/5",
  warn: "bg-[#ff9f0a]/5",
  info: "bg-transparent",
  debug: "bg-transparent",
};

export function LogViewer({ logs }: { logs: LogEntry[] }) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="font-mono text-[11px] leading-relaxed space-y-0">
        {logs.map((log, i) => {
          const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return (
            <div
              key={i}
              className={cn(
                "flex gap-2 px-2 py-0.5 hover:bg-white/[0.02] border-l-2 transition-colors",
                levelBg[log.level],
                log.level === "error"
                  ? "border-l-[#ff2d55]/40"
                  : log.level === "warn"
                    ? "border-l-[#ff9f0a]/30"
                    : "border-l-transparent"
              )}
            >
              <span className="text-muted-foreground/50 shrink-0 select-none">
                {time}
              </span>
              <span className="text-muted-foreground/40 shrink-0 w-24 truncate">
                {log.service}
              </span>
              <span
                className={cn(
                  "shrink-0 w-10 uppercase font-semibold",
                  levelColors[log.level]
                )}
              >
                {log.level}
              </span>
              <span className="text-foreground/80 break-all">{log.message}</span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
