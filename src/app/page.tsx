import { ChatInterface } from "@/components/chat-interface";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col grain">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center">
            <Heart className="size-3.5 text-white" />
          </div>
          <span className="font-serif text-lg tracking-tight">PulseAid</span>
          <span className="text-[0.65rem] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
            BETA
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="size-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>AI Navigator Active</span>
          </div>
        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
