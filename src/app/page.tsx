"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingHero } from "@/components/landing-hero";
import { RegionSelector } from "@/components/region-selector";
import { ChatInterface } from "@/components/chat-interface";
import { type Region } from "@/lib/regions";

type AppState = "landing" | "select" | "chat";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setAppState("chat");
  };

  const handleCustom = () => {
    setSelectedRegion(null);
    setAppState("chat");
  };

  const handleBack = () => {
    setSelectedRegion(null);
    setAppState("select");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {appState === "landing" && (
          <motion.div
            key="landing"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LandingHero onEnter={() => setAppState("select")} />
          </motion.div>
        )}

        {appState === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center topo-bg topo-lines py-12"
          >
            <RegionSelector
              onSelect={handleRegionSelect}
              onCustom={handleCustom}
            />
          </motion.div>
        )}

        {appState === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface region={selectedRegion} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
