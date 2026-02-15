"use client";

import { useState, useCallback } from "react";
import { Incident, InvestigationStep, RootCauseAnalysis } from "@/lib/types";
import { SeverityBadge } from "./severity-badge";
import { StatusIndicator } from "./status-indicator";
import { LogViewer } from "./log-viewer";
import { MetricsChart } from "./metrics-chart";
import { InvestigationPanel } from "./investigation-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Brain,
  Clock,
  Server,
  Radio,
  GitBranch,
  Tag,
  ArrowLeft,
} from "lucide-react";

export function IncidentDetail({
  incident,
  onBack,
  onUpdate,
}: {
  incident: Incident;
  onBack: () => void;
  onUpdate: (updated: Incident) => void;
}) {
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [liveSteps, setLiveSteps] = useState<InvestigationStep[]>(
    incident.investigationSteps || []
  );
  const [liveRootCause, setLiveRootCause] = useState<
    RootCauseAnalysis | undefined
  >(incident.rootCause);

  const startInvestigation = useCallback(async () => {
    setIsInvestigating(true);
    setLiveSteps([]);
    setLiveRootCause(undefined);

    try {
      const response = await fetch(
        `/api/incidents/${incident.id}/investigate`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to start investigation");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6));

          if (data.type === "step") {
            setLiveSteps((prev) => {
              const existing = prev.findIndex((s) => s.id === data.data.id);
              if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = data.data;
                return updated;
              }
              return [...prev, data.data];
            });
          } else if (data.type === "rootCause") {
            setLiveRootCause(data.data);
          } else if (data.type === "done") {
            // Refresh the incident from server
            const refreshed = await fetch(`/api/incidents/${incident.id}`);
            if (refreshed.ok) {
              const updatedIncident = await refreshed.json();
              onUpdate(updatedIncident);
            }
          }
        }
      }
    } catch (err) {
      console.error("Investigation error:", err);
    } finally {
      setIsInvestigating(false);
    }
  }, [incident.id, onUpdate]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="shrink-0 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <SeverityBadge severity={incident.severity} />
            <StatusIndicator status={incident.status} />
          </div>

          <h2 className="font-mono text-[15px] font-bold text-foreground leading-tight mb-2">
            {incident.title}
          </h2>

          <p className="font-mono text-[11px] text-muted-foreground/70 leading-relaxed mb-3">
            {incident.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-muted-foreground/60">
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
            <span className="inline-flex items-center gap-1">
              <Radio className="w-3 h-3" />
              {incident.alertSource}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              {incident.deployments.length} recent deploys
            </span>
          </div>

          {/* Tags */}
          {incident.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <Tag className="w-3 h-3 text-muted-foreground/40" />
              {incident.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[9px] px-1.5 py-0 bg-[#1a2332] text-muted-foreground/60 border-white/5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Investigation Button */}
      {incident.status !== "resolved" && !liveRootCause && (
        <Button
          onClick={startInvestigation}
          disabled={isInvestigating}
          className="w-full font-mono text-[12px] tracking-wide bg-gradient-to-r from-[#64d2ff]/20 to-[#30d158]/20 border border-[#64d2ff]/30 text-[#64d2ff] hover:from-[#64d2ff]/30 hover:to-[#30d158]/30 hover:border-[#64d2ff]/50 transition-all duration-300"
        >
          <Brain className="w-4 h-4 mr-2" />
          {isInvestigating
            ? "AGENTS INVESTIGATING..."
            : "LAUNCH AI INVESTIGATION"}
        </Button>
      )}

      {/* Tabs for different views */}
      <Tabs defaultValue={liveSteps.length > 0 || liveRootCause ? "investigation" : "logs"} className="w-full">
        <TabsList className="w-full bg-[#111827] border border-white/5">
          <TabsTrigger
            value="investigation"
            className="flex-1 font-mono text-[11px] data-[state=active]:bg-[#1a2332] data-[state=active]:text-[#64d2ff]"
          >
            AI Investigation
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="flex-1 font-mono text-[11px] data-[state=active]:bg-[#1a2332] data-[state=active]:text-[#64d2ff]"
          >
            Logs ({incident.logs.length})
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="flex-1 font-mono text-[11px] data-[state=active]:bg-[#1a2332] data-[state=active]:text-[#64d2ff]"
          >
            Metrics ({incident.metrics.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investigation" className="mt-3">
          <InvestigationPanel
            steps={liveSteps}
            rootCause={liveRootCause}
            isRunning={isInvestigating}
          />
        </TabsContent>

        <TabsContent value="logs" className="mt-3">
          <div className="rounded-lg border border-white/5 bg-[#0d1117] p-2 overflow-hidden">
            <LogViewer logs={incident.logs} />
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-3">
          <div className="rounded-lg border border-white/5 bg-[#111827] p-3">
            <MetricsChart metrics={incident.metrics} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Deployments section */}
      {incident.deployments.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-wider">
            Recent Deployments
          </h3>
          <div className="space-y-1">
            {incident.deployments.map((deploy) => (
              <div
                key={deploy.id}
                className="p-2 rounded bg-[#111827]/50 border border-white/5 flex items-center gap-3"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#bf5af2] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[11px] text-foreground/80 block truncate">
                    {deploy.commitMessage}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/50">
                    {deploy.service} · {deploy.author} ·{" "}
                    <span className="text-[#bf5af2]/60">{deploy.sha}</span> ·{" "}
                    {formatDistanceToNow(new Date(deploy.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
