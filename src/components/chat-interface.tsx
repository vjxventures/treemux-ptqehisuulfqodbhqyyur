"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { ChatMessage, TypingIndicator } from "@/components/chat-message";
import { BenefitsSidebar } from "@/components/benefits-sidebar";
import {
  Send,
  Sparkles,
  Shield,
  Heart,
  DollarSign,
  Brain,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  {
    icon: <Shield className="size-4" />,
    label: "Explore my benefits",
    prompt:
      "I'm on the Blue Shield PPO Gold plan. Can you give me an overview of my key benefits?",
  },
  {
    icon: <DollarSign className="size-4" />,
    label: "Estimate a cost",
    prompt:
      "My kid broke his arm and we need to go to the ER. I'm on Blue Shield PPO Gold and I've met $500 of my deductible. How much will this cost me?",
  },
  {
    icon: <Stethoscope className="size-4" />,
    label: "Free preventive care",
    prompt:
      "I'm 35 years old, female, on the Blue Shield PPO Gold plan. What free preventive care am I eligible for?",
  },
  {
    icon: <Brain className="size-4" />,
    label: "Mental health support",
    prompt:
      "I've been feeling really stressed and anxious lately. I'm on the Aetna HDHP Bronze plan. What mental health resources do I have?",
  },
  {
    icon: <Heart className="size-4" />,
    label: "Maximize my benefits",
    prompt:
      "I'm on the Aetna HDHP Bronze plan and want to make sure I'm not leaving money on the table. Can you create an action plan for me? I have 10 months left in my plan year.",
  },
  {
    icon: <Sparkles className="size-4" />,
    label: "Compare plans",
    prompt:
      "Can you compare the Blue Shield PPO Gold and Aetna HDHP Bronze plans? I want to understand the trade-offs.",
  },
];

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Check screen size for default sidebar state
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  const handleSubmit = useCallback(
    (text?: string) => {
      const messageText = text ?? input.trim();
      if (!messageText || isLoading) return;
      sendMessage({ text: messageText });
      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    },
    [input, isLoading, sendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <BenefitsSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSendMessage={handleSubmit}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
        >
          <div className="max-w-2xl mx-auto space-y-5">
            {showWelcome && <WelcomeScreen onPromptClick={handleSubmit} />}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {status === "submitted" && <TypingIndicator />}
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 bg-card border border-border/60 rounded-2xl px-4 py-2 shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your benefits..."
                className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60 min-h-[24px] max-h-[160px] py-1"
                rows={1}
                disabled={isLoading}
              />
              <Button
                size="icon-sm"
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                className="rounded-xl flex-shrink-0 mb-0.5"
              >
                <Send className="size-3.5" />
              </Button>
            </div>
            <p className="text-[0.7rem] text-muted-foreground/50 text-center mt-2.5">
              PulseAid provides general benefits information. Always verify with
              your HR department or plan administrator for decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({
  onPromptClick,
}: {
  onPromptClick: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] stagger-children">
      {/* Logo */}
      <div className="mb-6">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-sage-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Heart className="size-8 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-center mb-2">
        PulseAid
      </h1>
      <p className="text-muted-foreground text-center text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        Your personal AI benefits navigator. I help you understand, optimize,
        and actually use the health benefits you&apos;re paying for.
      </p>

      {/* Suggested prompts */}
      <div className="w-full max-w-lg space-y-2">
        <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-3 text-center">
          Try asking
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_PROMPTS.map((item, i) => (
            <button
              key={i}
              onClick={() => onPromptClick(item.prompt)}
              className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-card border border-border/50 text-left text-sm hover:border-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-muted-foreground group-hover:text-primary transition-colors">
                {item.icon}
              </span>
              <span className="flex-1 text-foreground/80 group-hover:text-foreground transition-colors">
                {item.label}
              </span>
              <ArrowRight className="size-3 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
