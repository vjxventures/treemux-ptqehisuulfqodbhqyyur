"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe2, Layers, Compass } from "lucide-react";

export function LandingHero({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden topo-bg topo-lines">
      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4A574" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating compass decoration */}
      <motion.div
        className="absolute top-20 right-20 opacity-[0.06]"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <Compass className="w-64 h-64 text-meridian-warm" />
      </motion.div>

      {/* Globe decoration */}
      <motion.div
        className="absolute bottom-20 left-20 opacity-[0.04]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Globe2 className="w-48 h-48 text-meridian-topo" />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-meridian-warm/20 bg-meridian-warm/5 text-meridian-warm text-sm mb-8"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>AI Infrastructure Intelligence</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.9] mb-6"
        >
          <span className="gradient-text">Meridian</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 font-light"
        >
          Infrastructure intelligence for the world&apos;s fastest-growing regions
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-sm text-muted-foreground/60 max-w-xl mx-auto mb-12"
        >
          AI-powered analysis of infrastructure gaps, investment priorities, and
          development roadmaps for emerging economies — powered by real-time research
          and expert-level reasoning.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-meridian-warm text-background font-medium rounded-lg hover:bg-meridian-gold transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,165,116,0.2)]"
        >
          Begin Analysis
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex items-center justify-center gap-8 sm:gap-12 mt-16 text-xs text-muted-foreground/50 uppercase tracking-widest"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-serif text-meridian-warm/80">8+</span>
            <span>Regions</span>
          </div>
          <div className="w-px h-8 bg-meridian-warm/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-serif text-meridian-warm/80">6</span>
            <span>Sectors</span>
          </div>
          <div className="w-px h-8 bg-meridian-warm/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-serif text-meridian-warm/80">AI</span>
            <span>Powered</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
