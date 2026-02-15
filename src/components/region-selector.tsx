"use client";

import { motion } from "framer-motion";
import { MapPin, Users, ChevronRight } from "lucide-react";
import { FEATURED_REGIONS, type Region } from "@/lib/regions";

export function RegionSelector({
  onSelect,
  onCustom,
}: {
  onSelect: (region: Region) => void;
  onCustom: () => void;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="font-serif text-3xl sm:text-4xl gradient-text mb-3">
          Select a Region
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Choose an emerging economy to analyze, or describe any region in the
          world for a custom assessment.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FEATURED_REGIONS.map((region, i) => (
          <motion.button
            key={region.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => onSelect(region)}
            className="group relative text-left p-4 rounded-lg border border-meridian-warm/8 bg-card/50 hover:bg-card hover:border-meridian-warm/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-meridian-warm/60" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {region.country}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-meridian-warm/60 transition-colors" />
            </div>
            <h3 className="font-serif text-lg text-foreground mb-1">
              {region.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-2">
              <Users className="w-3 h-3" />
              <span>{region.population}</span>
            </div>
            <p className="text-xs text-muted-foreground/50 leading-relaxed">
              {region.description}
            </p>
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-meridian-warm/[0.02] to-transparent pointer-events-none" />
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mt-6"
      >
        <button
          onClick={onCustom}
          className="text-sm text-muted-foreground/50 hover:text-meridian-warm transition-colors underline underline-offset-4 decoration-meridian-warm/20"
        >
          Or describe any region for custom analysis
        </button>
      </motion.div>
    </div>
  );
}
