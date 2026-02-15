"use client";

import { InvestigationStep, RootCauseAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileSearch,
  GitBranch,
  BarChart3,
  Brain,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Shield,
  ListChecks,
} from "lucide-react";

const agentIcons: Record<string, React.ReactNode> = {
  "Log Analyzer": <FileSearch className="w-4 h-4" />,
  "Deployment Correlator": <GitBranch className="w-4 h-4" />,
  "Metrics Analyzer": <BarChart3 className="w-4 h-4" />,
  "Root Cause Synthesizer": <Brain className="w-4 h-4" />,
};

const agentColors: Record<string, string> = {
  "Log Analyzer": "#64d2ff",
  "Deployment Correlator": "#bf5af2",
  "Metrics Analyzer": "#ff9f0a",
  "Root Cause Synthesizer": "#30d158",
};

export function InvestigationPanel({
  steps,
  rootCause,
  isRunning,
}: {
  steps: InvestigationStep[];
  rootCause?: RootCauseAnalysis;
  isRunning: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Agent Steps Timeline */}
      <ScrollArea className="h-[300px]">
        <div className="relative pl-6 space-y-3">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-[#64d2ff]/30 via-[#bf5af2]/30 to-[#30d158]/30" />

          {steps.map((step, i) => {
            const color = agentColors[step.agentName] || "#64d2ff";
            return (
              <div key={step.id} className="relative animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Timeline dot */}
                <div
                  className="absolute -left-6 top-1 w-[22px] h-[22px] rounded-full flex items-center justify-center border-2"
                  style={{
                    borderColor: color,
                    backgroundColor: step.status === "complete" ? `${color}15` : "transparent",
                  }}
                >
                  {step.status === "running" ? (
                    <Loader2 className="w-3 h-3 animate-spin" style={{ color }} />
                  ) : step.status === "complete" ? (
                    <CheckCircle2 className="w-3 h-3" style={{ color }} />
                  ) : (
                    <AlertCircle className="w-3 h-3" style={{ color }} />
                  )}
                </div>

                <div
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-300",
                    step.status === "running"
                      ? "bg-[#1a2332] border-white/10"
                      : "bg-[#111827]/50 border-white/5"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color }}>{agentIcons[step.agentName]}</span>
                    <span className="font-mono text-[11px] font-semibold tracking-wide" style={{ color }}>
                      {step.agentName}
                    </span>
                    {step.status === "running" && (
                      <span className="font-mono text-[10px] text-muted-foreground/50 animate-pulse">
                        processing...
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-foreground/70 leading-relaxed">
                    {step.summary}
                  </p>
                  {step.details && step.status === "complete" && (
                    <p className="mt-2 font-mono text-[10px] text-muted-foreground/60 leading-relaxed line-clamp-3">
                      {step.details}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {isRunning && steps.length === 0 && (
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
              <Loader2 className="w-4 h-4 animate-spin text-[#64d2ff]" />
              Initializing investigation agents...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Root Cause Analysis Card */}
      {rootCause && (
        <div className="p-4 rounded-lg border border-[#30d158]/20 bg-[#30d158]/5 animate-slide-in space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#30d158]" />
            <span className="font-mono text-[12px] font-bold text-[#30d158] tracking-wide uppercase">
              Root Cause Analysis
            </span>
            <span className="ml-auto font-mono text-[11px] text-[#30d158]/70">
              {(rootCause.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>

          {/* Confidence bar */}
          <div className="h-1.5 bg-[#1a2332] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#30d158] to-[#64d2ff] rounded-full animate-grow"
              style={{ width: `${rootCause.confidence * 100}%` }}
            />
          </div>

          <p className="font-mono text-[12px] text-foreground/90 leading-relaxed">
            {rootCause.summary}
          </p>

          {/* Evidence */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
              Evidence
            </span>
            {rootCause.evidence.map((e, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#64d2ff] mt-0.5 font-mono text-[10px]">
                  [{i + 1}]
                </span>
                <span className="font-mono text-[11px] text-foreground/70">
                  {e}
                </span>
              </div>
            ))}
          </div>

          {/* Suggested Fix */}
          <div className="p-2 rounded bg-[#1a2332] border border-white/5">
            <span className="font-mono text-[10px] text-[#ff9f0a] uppercase tracking-wider block mb-1">
              Suggested Fix
            </span>
            <p className="font-mono text-[11px] text-foreground/80">
              {rootCause.suggestedFix}
            </p>
          </div>

          {/* Runbook */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-[#bf5af2]" />
              <span className="font-mono text-[10px] text-[#bf5af2] uppercase tracking-wider">
                Auto-Generated Runbook
              </span>
            </div>
            {rootCause.runbook.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2 pl-2 py-1 border-l border-[#bf5af2]/20"
              >
                <span className="font-mono text-[11px] text-foreground/70">
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Related Deployment */}
          {rootCause.relatedDeployment && (
            <div className="p-2 rounded bg-[#ff2d55]/5 border border-[#ff2d55]/10">
              <span className="font-mono text-[10px] text-[#ff2d55] uppercase tracking-wider block mb-1">
                Correlated Deployment
              </span>
              <p className="font-mono text-[11px] text-foreground/80">
                <span className="text-[#bf5af2]">{rootCause.relatedDeployment.sha}</span>
                {" — "}
                {rootCause.relatedDeployment.commitMessage}
                {" by "}
                <span className="text-[#64d2ff]">{rootCause.relatedDeployment.author}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
