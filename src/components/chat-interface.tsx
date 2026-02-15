"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MapPin, ArrowLeft, Sparkles } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send initial message when region is selected
  useEffect(() => {
    if (region && messages.length === 0) {
      sendMessage({
        text: `Analyze the infrastructure of ${region.name}, ${region.country}. This city has a population of approximately ${region.population} and is described as: "${region.description}". Please provide a comprehensive infrastructure assessment using the analyzeInfrastructure tool, covering all key sectors (energy, transport, water, telecom, health, education). After presenting the data, provide a detailed analysis with recommendations and then generate a development timeline using the generateTimeline tool.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedFollowups = [
    "Compare this region to a similar city",
    "Dive deeper into the energy sector",
    "What are the biggest climate risks?",
    "Show me the investment priorities",
  ];

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
            <div>
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
              </div>
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
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${
                  message.role === "user" ? "flex justify-end" : ""
                }`}
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
                      if (part.type === "tool-analyzeInfrastructure") {
                        const toolPart = part as unknown as {
                          type: string;
                          state: string;
                          toolCall: { input: Record<string, unknown> };
                          output: Record<string, unknown>;
                        };
                        if (toolPart.state === "output-available") {
                          return (
                            <InfrastructureViz
                              key={i}
                              data={toolPart.output as never}
                            />
                          );
                        }
                        if (toolPart.state === "input-available" || toolPart.state === "input-streaming") {
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs text-meridian-warm/60 py-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Generating infrastructure analysis...</span>
                            </div>
                          );
                        }
                      }
                      if (part.type === "tool-generateTimeline") {
                        const toolPart = part as unknown as {
                          type: string;
                          state: string;
                          toolCall: { input: Record<string, unknown> };
                          output: Record<string, unknown>;
                        };
                        if (toolPart.state === "output-available") {
                          return (
                            <TimelineViz
                              key={i}
                              data={toolPart.output as never}
                            />
                          );
                        }
                        if (toolPart.state === "input-available" || toolPart.state === "input-streaming") {
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs text-meridian-warm/60 py-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Building development timeline...</span>
                            </div>
                          );
                        }
                      }
                      if (part.type === "tool-compareRegions") {
                        const toolPart = part as unknown as {
                          type: string;
                          state: string;
                          toolCall: { input: Record<string, unknown> };
                          output: Record<string, unknown>;
                        };
                        if (toolPart.state === "output-available") {
                          return (
                            <ComparisonViz
                              key={i}
                              data={toolPart.output as never}
                            />
                          );
                        }
                        if (toolPart.state === "input-available" || toolPart.state === "input-streaming") {
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs text-meridian-warm/60 py-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Comparing regions...</span>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

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
                  onClick={() => {
                    sendMessage({ text: q });
                  }}
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
                placeholder="Ask about infrastructure, sectors, investments..."
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
