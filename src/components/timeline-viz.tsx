"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";

interface TimelinePhase {
  name: string;
  startYear: number;
  endYear: number;
  totalBudget: string;
  projects: {
    name: string;
    sector: string;
    budget: string;
    description: string;
  }[];
}

interface TimelineData {
  region: string;
  phases: TimelinePhase[];
}

const SECTOR_COLORS: Record<string, string> = {
  energy: "#D4A574",
  transport: "#5B8A3C",
  water: "#3D7A9E",
  telecom: "#C9956B",
  health: "#C45D4A",
  education: "#8B9D83",
  Energy: "#D4A574",
  Transportation: "#5B8A3C",
  Water: "#3D7A9E",
  Telecom: "#C9956B",
  Healthcare: "#C45D4A",
  Education: "#8B9D83",
  Digital: "#C9956B",
};

function getSectorColor(sector: string): string {
  const lower = sector.toLowerCase();
  for (const [key, color] of Object.entries(SECTOR_COLORS)) {
    if (lower.includes(key.toLowerCase())) return color;
  }
  return "#8B9D83";
}

export function TimelineViz({ data }: { data: TimelineData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-meridian-warm/10 bg-card/80 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-meridian-warm/8">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-meridian-warm/60" />
          <h3 className="font-serif text-lg text-meridian-warm">
            Development Timeline
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{data.region}</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-meridian-warm/10" />

        {data.phases.map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className="relative pl-16 pr-5 py-4 border-b border-meridian-warm/6 last:border-0"
          >
            {/* Dot */}
            <div
              className="absolute left-[26px] top-5 w-3 h-3 rounded-full border-2 border-meridian-warm/40"
              style={{
                background:
                  i === 0 ? "#D4A574" : "rgba(212, 165, 116, 0.15)",
              }}
            />

            {/* Phase Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium">{phase.name}</h4>
                <div className="text-[10px] text-muted-foreground/50 mt-0.5">
                  {phase.startYear} — {phase.endYear}
                </div>
              </div>
              <div className="text-xs text-meridian-warm/70 font-medium">
                {phase.totalBudget}
              </div>
            </div>

            {/* Year range bar */}
            <div className="h-1 bg-secondary rounded-full mb-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="h-full bg-gradient-to-r from-meridian-warm/40 to-meridian-warm/20 rounded-full"
              />
            </div>

            {/* Projects */}
            <div className="space-y-1.5">
              {phase.projects.map((project, pi) => (
                <div
                  key={pi}
                  className="flex items-start gap-2 text-xs"
                >
                  <ChevronRight
                    className="w-3 h-3 mt-0.5 flex-none"
                    style={{ color: getSectorColor(project.sector) }}
                  />
                  <div className="flex-1">
                    <span className="text-muted-foreground/80 font-medium">
                      {project.name}
                    </span>
                    <span className="text-muted-foreground/40 ml-1.5">
                      ({project.budget})
                    </span>
                    <p className="text-muted-foreground/40 mt-0.5">
                      {project.description}
                    </p>
                  </div>
                  <span
                    className="flex-none text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      color: getSectorColor(project.sector),
                      background: `${getSectorColor(project.sector)}15`,
                    }}
                  >
                    {project.sector}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
