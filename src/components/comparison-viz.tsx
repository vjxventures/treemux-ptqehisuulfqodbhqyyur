"use client";

import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RegionComparison {
  name: string;
  overallScore: number;
  energyScore: number;
  transportScore: number;
  waterScore: number;
  telecomScore: number;
  healthScore: number;
  educationScore: number;
}

interface ComparisonData {
  regions: RegionComparison[];
}

const COLORS = ["#D4A574", "#3D7A9E", "#5B8A3C", "#C45D4A"];

export function ComparisonViz({ data }: { data: ComparisonData }) {
  const sectors = [
    { key: "energyScore", label: "Energy" },
    { key: "transportScore", label: "Transport" },
    { key: "waterScore", label: "Water" },
    { key: "telecomScore", label: "Telecom" },
    { key: "healthScore", label: "Health" },
    { key: "educationScore", label: "Education" },
  ];

  const radarData = sectors.map((sector) => {
    const entry: Record<string, string | number> = { sector: sector.label };
    data.regions.forEach((r) => {
      entry[r.name] = r[sector.key as keyof RegionComparison] as number;
    });
    return entry;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-meridian-warm/10 bg-card/80 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-meridian-warm/8">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-meridian-warm/60" />
          <h3 className="font-serif text-lg text-meridian-warm">
            Regional Comparison
          </h3>
        </div>
      </div>

      {/* Overall scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-meridian-warm/8">
        {data.regions.map((region, i) => (
          <div
            key={region.name}
            className="px-4 py-3 border-r border-meridian-warm/8 last:border-r-0"
          >
            <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-1">
              {region.name}
            </div>
            <div className="text-xl font-serif" style={{ color: COLORS[i % COLORS.length] }}>
              {region.overallScore}
              <span className="text-xs text-muted-foreground/30">/100</span>
            </div>
          </div>
        ))}
      </div>

      {/* Radar comparison */}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(212,165,116,0.08)" />
            <PolarAngleAxis
              dataKey="sector"
              tick={{ fill: "#8B8680", fontSize: 11 }}
            />
            {data.regions.map((region, i) => (
              <Radar
                key={region.name}
                name={region.name}
                dataKey={region.name}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#8B8680" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Sector comparison table */}
      <div className="px-5 pb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-meridian-warm/10">
              <th className="text-left py-2 text-muted-foreground/50 font-normal uppercase tracking-wider">
                Sector
              </th>
              {data.regions.map((r, i) => (
                <th
                  key={r.name}
                  className="text-right py-2 font-normal uppercase tracking-wider"
                  style={{ color: COLORS[i % COLORS.length] }}
                >
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector) => (
              <tr
                key={sector.key}
                className="border-b border-meridian-warm/5"
              >
                <td className="py-1.5 text-muted-foreground/70">
                  {sector.label}
                </td>
                {data.regions.map((r, i) => (
                  <td
                    key={r.name}
                    className="text-right py-1.5"
                    style={{ color: COLORS[i % COLORS.length] }}
                  >
                    {r[sector.key as keyof RegionComparison]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
