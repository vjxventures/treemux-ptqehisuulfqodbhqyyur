"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  X,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitsSidebarProps {
  onSendMessage?: (text: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const QUICK_ACTIONS = [
  { label: "Annual Physical", action: "When should I schedule my next annual physical? Is it free?" },
  { label: "HSA vs FSA", action: "Can you explain the difference between HSA and FSA, and which one I should use?" },
  { label: "ER vs Urgent Care", action: "How do I decide between going to the ER and urgent care?" },
  { label: "Appeal a Claim", action: "I got a claim denied. How do I appeal it?" },
  { label: "Find a Therapist", action: "I'd like to find an in-network therapist. Can you help?" },
  { label: "Open Enrollment", action: "Open enrollment is coming up. Should I switch plans?" },
];

const BENEFITS_ALERTS = [
  {
    type: "action" as const,
    message: "You haven't had your annual wellness visit yet",
    savings: "Free — $0 copay",
  },
  {
    type: "savings" as const,
    message: "Your FSA has $1,200 remaining — use it or lose it",
    savings: "$1,200 at risk",
  },
  {
    type: "info" as const,
    message: "Flu season: vaccines are 100% covered",
    savings: "$40+ saved",
  },
];

export function BenefitsSidebar({ onSendMessage, isOpen, onToggle }: BenefitsSidebarProps) {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    setIsUploading(true);
    // Simulate file upload and processing
    await new Promise((r) => setTimeout(r, 1500));
    setUploadedDocs((prev) => [
      ...prev,
      `Benefits_Summary_${new Date().getFullYear()}.pdf`,
    ]);
    setIsUploading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-3 top-16 z-20 p-2 rounded-lg bg-card border border-border/60 shadow-sm hover:shadow-md transition-all text-muted-foreground hover:text-foreground"
      >
        <PanelLeftOpen className="size-4" />
      </button>
    );
  }

  return (
    <aside className="w-72 border-r border-border/40 bg-sage-50/30 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium">Benefits Hub</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-sage-100 text-muted-foreground hover:text-foreground transition-colors"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Alerts Section */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Benefit Alerts
          </h3>
          <div className="space-y-2">
            {BENEFITS_ALERTS.map((alert, i) => (
              <button
                key={i}
                onClick={() =>
                  onSendMessage?.(
                    `Tell me more about: ${alert.message}`
                  )
                }
                className="group w-full text-left p-2.5 rounded-lg bg-white/80 border border-border/40 hover:border-primary/30 hover:shadow-xs transition-all"
              >
                <div className="flex items-start gap-2">
                  {alert.type === "action" ? (
                    <AlertCircle className="size-3.5 text-warm-500 mt-0.5 flex-shrink-0" />
                  ) : alert.type === "savings" ? (
                    <AlertCircle className="size-3.5 text-destructive mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="size-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground/80 leading-snug">
                      {alert.message}
                    </p>
                    <p className="text-[0.65rem] text-primary font-medium mt-0.5">
                      {alert.savings}
                    </p>
                  </div>
                  <ChevronRight className="size-3 text-muted-foreground/40 group-hover:text-primary mt-0.5 transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator className="mx-4 bg-border/30" />

        {/* Document Upload */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Your Documents
          </h3>
          {uploadedDocs.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {uploadedDocs.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/80 border border-border/40"
                >
                  <FileText className="size-3.5 text-teal-500 flex-shrink-0" />
                  <span className="text-xs text-foreground/80 truncate flex-1">
                    {doc}
                  </span>
                  <button
                    onClick={() =>
                      setUploadedDocs((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                    className="p-0.5 rounded hover:bg-sage-100 text-muted-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileUpload}
            disabled={isUploading}
            className="w-full text-xs gap-1.5 h-8 bg-white/80"
          >
            <Upload className="size-3" />
            {isUploading ? "Processing..." : "Upload Benefits Doc"}
          </Button>
          <p className="text-[0.6rem] text-muted-foreground/60 mt-1.5 text-center">
            Upload your Summary of Benefits or EOB for personalized advice
          </p>
        </div>

        <Separator className="mx-4 bg-border/30" />

        {/* Quick Actions */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick Questions
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map((qa, i) => (
              <button
                key={i}
                onClick={() => onSendMessage?.(qa.action)}
                className="px-2.5 py-1 rounded-full text-[0.7rem] bg-white/80 border border-border/40 text-foreground/70 hover:border-primary/30 hover:text-foreground transition-all"
              >
                {qa.label}
              </button>
            ))}
          </div>
        </div>

        <Separator className="mx-4 bg-border/30" />

        {/* Coverage Summary */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Demo Plans Available
          </h3>
          <div className="space-y-2">
            <button
              onClick={() =>
                onSendMessage?.(
                  "Tell me about the Blue Shield PPO Gold plan. Give me a quick overview."
                )
              }
              className="group w-full text-left p-2.5 rounded-lg bg-white/80 border border-border/40 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Blue Shield PPO Gold</span>
                <Badge variant="secondary" className="text-[0.6rem] h-4 px-1.5">
                  PPO
                </Badge>
              </div>
              <p className="text-[0.65rem] text-muted-foreground">
                $1,500 deductible · $30 PCP copay · Good for families
              </p>
            </button>
            <button
              onClick={() =>
                onSendMessage?.(
                  "Tell me about the Aetna HDHP Bronze plan. Give me a quick overview."
                )
              }
              className="group w-full text-left p-2.5 rounded-lg bg-white/80 border border-border/40 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Aetna HDHP Bronze</span>
                <Badge variant="secondary" className="text-[0.6rem] h-4 px-1.5">
                  HDHP
                </Badge>
              </div>
              <p className="text-[0.65rem] text-muted-foreground">
                $3,000 deductible · HSA eligible · Good for healthy singles
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/30 bg-white/50">
        <div className="flex items-center gap-1.5">
          <Heart className="size-3 text-primary" />
          <span className="text-[0.6rem] text-muted-foreground">
            PulseAid — Reimagining Zenefits with AI
          </span>
        </div>
      </div>
    </aside>
  );
}
