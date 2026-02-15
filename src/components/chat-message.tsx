"use client";

import { type UIMessage, isToolUIPart, getToolName } from "ai";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Heart,
  Shield,
  DollarSign,
  Stethoscope,
  Brain,
  ClipboardList,
  BarChart3,
  Loader2,
  MapPin,
  BookOpen,
} from "lucide-react";

function ToolCallDisplay({
  toolName,
  state,
  output,
}: {
  toolName: string;
  state: string;
  output: unknown;
}) {
  const toolMeta: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    lookupBenefits: {
      icon: <Shield className="size-3.5" />,
      label: "Looking up benefits",
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    comparePlans: {
      icon: <BarChart3 className="size-3.5" />,
      label: "Comparing plans",
      color: "text-sage-600 bg-sage-50 border-sage-200",
    },
    estimateCost: {
      icon: <DollarSign className="size-3.5" />,
      label: "Estimating costs",
      color: "text-warm-600 bg-warm-50 border-warm-200",
    },
    findPreventiveCare: {
      icon: <Stethoscope className="size-3.5" />,
      label: "Finding preventive care",
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    checkMentalHealthResources: {
      icon: <Brain className="size-3.5" />,
      label: "Checking mental health resources",
      color: "text-sage-600 bg-sage-50 border-sage-200",
    },
    generateActionPlan: {
      icon: <ClipboardList className="size-3.5" />,
      label: "Generating action plan",
      color: "text-warm-600 bg-warm-50 border-warm-200",
    },
    findProviders: {
      icon: <MapPin className="size-3.5" />,
      label: "Searching providers",
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    explainInsuranceTerm: {
      icon: <BookOpen className="size-3.5" />,
      label: "Explaining term",
      color: "text-sage-600 bg-sage-50 border-sage-200",
    },
  };

  const meta = toolMeta[toolName] ?? {
    icon: <Shield className="size-3.5" />,
    label: toolName,
    color: "text-muted-foreground bg-muted border-border",
  };

  const isLoading = state !== "output-available";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300",
        meta.color,
        isLoading && "animate-pulse"
      )}
    >
      {isLoading ? <Loader2 className="size-3 animate-spin" /> : meta.icon}
      <span>{isLoading ? meta.label + "..." : meta.label}</span>
    </div>
  );
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <div className="size-8 rounded-xl bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center shadow-sm">
            <Heart className="size-4 text-white" />
          </div>
        </div>
      )}

      <div
        className={cn("max-w-[80%] flex flex-col gap-1.5", isUser && "items-end")}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={`${message.id}-${i}`}
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-[0.9rem] leading-relaxed",
                  isUser
                    ? "bg-foreground text-background rounded-br-md"
                    : "bg-card border border-border/60 rounded-bl-md shadow-xs prose-chat"
                )}
              >
                {isUser ? (
                  <p>{part.text}</p>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {part.text}
                  </ReactMarkdown>
                )}
              </div>
            );
          }

          if (isToolUIPart(part)) {
            return (
              <ToolCallDisplay
                key={`${message.id}-${i}`}
                toolName={getToolName(part)}
                state={part.state}
                output={part.state === "output-available" ? part.output : undefined}
              />
            );
          }

          return null;
        })}
      </div>

      {isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <div className="size-8 rounded-xl bg-gradient-to-br from-warm-300 to-warm-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-semibold">U</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-fade-in-up">
      <div className="flex-shrink-0 mt-0.5">
        <div className="size-8 rounded-xl bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center shadow-sm">
          <Heart className="size-4 text-white" />
        </div>
      </div>
      <div className="bg-card border border-border/60 rounded-2xl rounded-bl-md px-4 py-3 shadow-xs">
        <div className="flex gap-1.5">
          <div className="size-2 rounded-full bg-sage-400 typing-dot" />
          <div className="size-2 rounded-full bg-sage-400 typing-dot" />
          <div className="size-2 rounded-full bg-sage-400 typing-dot" />
        </div>
      </div>
    </div>
  );
}
