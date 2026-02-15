"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Train,
  Droplets,
  Wifi,
  Heart,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const SECTOR_ICONS: Record<string, React.ElementType> = {
  energy: Zap,
  transport: Train,
  water: Droplets,
  telecom: Wifi,
  health: Heart,
  education: GraduationCap,
};

const SECTOR_COLORS: Record<string, string> = {
  energy: "#D4A574",
  transport: "#5B8A3C",
  water: "#3D7A9E",
  telecom: "#C9956B",
  health: "#C45D4A",
  education: "#8B9D83",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "#C45D4A",
  High: "#D4A574",
  Medium: "#C9956B",
  Low: "#8B9D83",
};

interface SectorData {
  id: string;
  name: string;
  currentScore: number;
  targetScore: number;
  investmentNeeded: string;
  populationImpact: string;
  priority: string;
  keyProjects: {
    name: string;
    cost: string;
    timeline: string;
    impact: string;
  }[];
}

interface InfrastructureData {
  region: string;
  country: string;
  sectors: SectorData[];
  overallScore: number;
  totalInvestment: string;
  climateRiskLevel: string;
  economicGrowthPotential: string;
}

export function InfrastructureViz({ data }: { data: InfrastructureData }) {
  const radarData = data.sectors.map((s) => ({
    sector: s.name.split(" ")[0],
    current: s.currentScore,
    target: s.targetScore,
  }));

  const barData = data.sectors.map((s) => ({
    name: s.name.split(" ")[0],
    score: s.currentScore,
    id: s.id,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-meridian-warm/10 bg-card/80 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-meridian-warm/8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-meridian-warm">
              Infrastructure Assessment
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.region}, {data.country}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-right">
              <div className="text-2xl font-serif text-meridian-warm">
                {data.overallScore}
              </div>
              <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                Readiness
              </div>
            </div>
            <div className="text-xs text-muted-foreground/30">/100</div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 border-b border-meridian-warm/8">
        <div className="px-4 py-3 border-r border-meridian-warm/8">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3 h-3 text-meridian-warm/50" />
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
              Total Investment
            </span>
          </div>
          <div className="text-sm font-medium">{data.totalInvestment}</div>
        </div>
        <div className="px-4 py-3 border-r border-meridian-warm/8">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3 h-3 text-meridian-warm/50" />
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
              Climate Risk
            </span>
          </div>
          <div
            className="text-sm font-medium"
            style={{
              color:
                data.climateRiskLevel === "Very High"
                  ? "#C45D4A"
                  : data.climateRiskLevel === "High"
                  ? "#D4A574"
                  : "#8B9D83",
            }}
          >
            {data.climateRiskLevel}
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-meridian-warm/50" />
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
              Growth Potential
            </span>
          </div>
          <div
            className="text-sm font-medium"
            style={{
              color:
                data.economicGrowthPotential === "Very High"
                  ? "#5B8A3C"
                  : data.economicGrowthPotential === "High"
                  ? "#8B9D83"
                  : "#C9956B",
            }}
          >
            {data.economicGrowthPotential}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-meridian-warm/8">
        {/* Radar Chart */}
        <div className="p-4 border-b md:border-b-0 md:border-r border-meridian-warm/8">
          <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-2">
            Sector Analysis — Current vs Target
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(212,165,116,0.08)" />
              <PolarAngleAxis
                dataKey="sector"
                tick={{ fill: "#8B8680", fontSize: 10 }}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="rgba(212,165,116,0.4)"
                fill="rgba(212,165,116,0.08)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#D4A574"
                fill="rgba(212,165,116,0.15)"
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/50">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-meridian-warm rounded" />
              Current
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-meridian-warm/40 rounded border-dashed" />
              Target
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-4">
          <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-2">
            Sector Scores
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical" barSize={16}>
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#8B8680", fontSize: 10 }}
                axisLine={{ stroke: "rgba(212,165,116,0.08)" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#8B8680", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: "#141914",
                  border: "1px solid rgba(212,165,116,0.15)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#E8E4DE",
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {barData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={SECTOR_COLORS[entry.id] || "#D4A574"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Details */}
      <div className="divide-y divide-meridian-warm/6">
        {data.sectors.map((sector, i) => {
          const Icon = SECTOR_ICONS[sector.id] || Zap;
          return (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-5 py-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: SECTOR_COLORS[sector.id] }}
                  />
                  <span className="text-sm font-medium">{sector.name}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      color: PRIORITY_COLORS[sector.priority],
                      background: `${PRIORITY_COLORS[sector.priority]}15`,
                    }}
                  >
                    {sector.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 opacity-40" />
                    {sector.investmentNeeded}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 opacity-40" />
                    {sector.populationImpact}
                  </div>
                </div>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sector.currentScore}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      background: SECTOR_COLORS[sector.id],
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {sector.currentScore}
                </span>
              </div>

              {/* Key projects */}
              {sector.keyProjects.length > 0 && (
                <div className="ml-5 space-y-1">
                  {sector.keyProjects.map((project, pi) => (
                    <div
                      key={pi}
                      className="text-xs text-muted-foreground/60 flex items-start gap-2"
                    >
                      <span className="text-meridian-warm/30 mt-0.5">-</span>
                      <span>
                        <strong className="text-muted-foreground/80">
                          {project.name}
                        </strong>{" "}
                        — {project.cost} / {project.timeline} / {project.impact}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
