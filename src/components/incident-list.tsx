"use client";

import { Incident } from "@/lib/types";
import { SeverityBadge } from "./severity-badge";
import { StatusIndicator } from "./status-indicator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Clock, Server } from "lucide-react";

export function IncidentList({
  incidents,
  selectedId,
  onSelect,
}: {
  incidents: Incident[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <AlertTriangle className="w-8 h-8 mb-3 opacity-40" />
        <p className="font-mono text-sm">No incidents detected</p>
        <p className="font-mono text-xs mt-1 opacity-60">System nominal</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {incidents.map((incident, index) => (
        <button
          key={incident.id}
          onClick={() => onSelect(incident.id)}
          className={cn(
            "w-full text-left p-3 rounded-lg border transition-all duration-200 group",
            "hover:bg-[#1a2332]/80 hover:border-[#64d2ff]/20",
            selectedId === incident.id
              ? "bg-[#1a2332] border-[#64d2ff]/30 shadow-[0_0_15px_rgba(100,210,255,0.05)]"
              : "bg-transparent border-transparent",
            "animate-slide-in"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <SeverityBadge severity={incident.severity} />
            <StatusIndicator status={incident.status} />
          </div>

          <h3 className="font-mono text-[13px] font-medium text-foreground/90 leading-tight mb-2 group-hover:text-foreground">
            {incident.title}
          </h3>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
            <span className="inline-flex items-center gap-1">
              <Server className="w-3 h-3" />
              {incident.service}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(incident.triggeredAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {incident.rootCause && (
            <div className="mt-2 px-2 py-1 bg-[#30d158]/5 border border-[#30d158]/10 rounded text-[10px] font-mono text-[#30d158]/80">
              RCA: {incident.rootCause.confidence * 100}% confidence
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
