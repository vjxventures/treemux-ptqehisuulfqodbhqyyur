"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  MapPin,
  ArrowLeft,
  Sparkles,
  Globe2,
} from "lucide-react";
import { type Region } from "@/lib/regions";
import ReactMarkdown from "react-markdown";
import { InfrastructureViz } from "./infrastructure-viz";
import { TimelineViz } from "./timeline-viz";
import { ComparisonViz } from "./comparison-viz";

interface ChatInterfaceProps {
  region: Region | null;
  onBack: () => void;
}

export function ChatInterface({ region, onBack }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [customMode] = useState(!region);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send initial message when region is selected
  useEffect(() => {
    if (region && messages.length === 0 && !hasStarted) {
      setHasStarted(true);
      sendMessage({
        text: `Analyze the infrastructure of ${region.name}, ${region.country}. This city has a population of approximately ${region.population} and is described as: "${region.description}". Please provide a comprehensive infrastructure assessment using the analyzeInfrastructure tool, covering all key sectors (energy, transport, water, telecom, health, education). After presenting the data, provide a detailed analysis with your top recommendations, and then generate a phased development timeline using the generateTimeline tool.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (customMode && !hasStarted) {
      setHasStarted(true);
      sendMessage({
        text: `Analyze the infrastructure of ${input.trim()}. Please provide a comprehensive infrastructure assessment using the analyzeInfrastructure tool, covering all key sectors (energy, transport, water, telecom, health, education). After presenting the data, provide a detailed analysis with your top recommendations, and then generate a phased development timeline using the generateTimeline tool.`,
      });
    } else {
      sendMessage({ text: input.trim() });
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedFollowups = region
    ? [
        `Compare ${region.name} to a similar city`,
        "Dive deeper into the energy sector",
        "What are the biggest climate risks?",
        "Show the top 3 investment priorities",
      ]
    : [
        "Compare this with another region",
        "What are the biggest climate risks?",
        "Focus on healthcare infrastructure",
        "Show investment priorities by ROI",
      ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderToolPart = (part: any, i: number) => {
    const state = part.state;
    const output = part.output;

    if (part.type === "tool-analyzeInfrastructure") {
      if (state === "output-available" && output) {
        return <InfrastructureViz key={i} data={output} />;
      }
      return (
        <LoadingIndicator key={i} text="Generating infrastructure analysis..." />
      );
    }
    if (part.type === "tool-generateTimeline") {
      if (state === "output-available" && output) {
        return <TimelineViz key={i} data={output} />;
      }
      return <LoadingIndicator key={i} text="Building development timeline..." />;
    }
    if (part.type === "tool-compareRegions") {
      if (state === "output-available" && output) {
        return <ComparisonViz key={i} data={output} />;
      }
      return <LoadingIndicator key={i} text="Comparing regions..." />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-none border-b border-meridian-warm/8 glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-md hover:bg-meridian-warm/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-meridian-warm/10" />
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl gradient-text">Meridian</h1>
              {region && (
                <>
                  <span className="text-muted-foreground/30">/</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 text-meridian-warm/60" />
                    {region.name}, {region.country}
                  </div>
                </>
              )}
              {!region && hasStarted && (
                <>
                  <span className="text-muted-foreground/30">/</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Globe2 className="w-3 h-3 text-meridian-warm/60" />
                    Custom Analysis
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-meridian-warm/60">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Analyzing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* Welcome state for custom mode */}
          {customMode && !hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Globe2 className="w-12 h-12 text-meridian-warm/20 mb-4" />
              <h2 className="font-serif text-2xl gradient-text mb-2">
                Custom Region Analysis
              </h2>
              <p className="text-sm text-muted-foreground/50 max-w-md mb-6">
                Describe any city, region, or country in the developing world.
                Meridian will research and analyze its infrastructure landscape.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Rural Bihar, India",
                  "Kinshasa, DRC",
                  "Colombo, Sri Lanka",
                  "Luanda, Angola",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="text-xs px-3 py-1.5 rounded-full border border-meridian-warm/10 text-muted-foreground/50 hover:text-meridian-warm hover:border-meridian-warm/20 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  message.role === "user" ? "flex justify-end" : ""
                }
              >
                {message.role === "user" ? (
                  <div className="max-w-lg px-4 py-3 rounded-lg bg-meridian-warm/10 border border-meridian-warm/15 text-sm">
                    {message.parts.map((part, i) =>
                      part.type === "text" ? (
                        <span key={i}>{part.text}</span>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {message.parts.map((part, i) => {
                      if (part.type === "text" && part.text) {
                        return (
                          <div key={i} className="prose-meridian text-sm">
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                          </div>
                        );
                      }
                      if (part.type.startsWith("tool-")) {
                        return renderToolPart(part, i);
                      }
                      return null;
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming indicator */}
          {isLoading && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-muted-foreground/40 pl-1"
            >
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-meridian-warm/40 meridian-pulse"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-meridian-warm/40 meridian-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-meridian-warm/40 meridian-pulse"
                  style={{ animationDelay: "0.6s" }}
                />
              </div>
            </motion.div>
          )}

          {/* Suggested follow-ups when idle */}
          {messages.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {suggestedFollowups.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage({ text: q })}
                  className="text-xs px-3 py-1.5 rounded-full border border-meridian-warm/10 text-muted-foreground/60 hover:text-meridian-warm hover:border-meridian-warm/25 transition-all duration-200"
                >
                  <Sparkles className="w-3 h-3 inline mr-1.5 opacity-40" />
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-none border-t border-meridian-warm/8 glass">
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto px-4 py-3"
        >
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  customMode && !hasStarted
                    ? "Enter a city or region to analyze..."
                    : "Ask about infrastructure, sectors, investments..."
                }
                disabled={isLoading}
                rows={1}
                className="w-full resize-none rounded-lg bg-secondary/50 border border-meridian-warm/8 px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground/30 focus:outline-none focus:border-meridian-warm/25 focus:ring-1 focus:ring-meridian-warm/15 disabled:opacity-50 transition-all"
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-none p-3 rounded-lg bg-meridian-warm text-background hover:bg-meridian-gold disabled:opacity-30 disabled:hover:bg-meridian-warm transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LoadingIndicator({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2.5 text-xs text-meridian-warm/60 py-3 px-4 rounded-lg bg-meridian-warm/[0.03] border border-meridian-warm/8"
    >
      <Loader2 className="w-3.5 h-3.5 animate-spin flex-none" />
      <span>{text}</span>
    </motion.div>
  );
}
