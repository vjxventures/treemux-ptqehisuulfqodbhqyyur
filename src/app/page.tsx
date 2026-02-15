"use client";

import { useState, useEffect, useCallback } from "react";
import { Incident } from "@/lib/types";
import { IncidentList } from "@/components/incident-list";
import { IncidentDetail } from "@/components/incident-detail";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Zap,
  Shield,
} from "lucide-react";

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch("/api/incidents");
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const seedDemo = async () => {
    setSeeding(true);
    try {
      await fetch("/api/demo-seed", { method: "POST" });
      await fetchIncidents();
    } finally {
      setSeeding(false);
    }
  };

  const selectedIncident = incidents.find((i) => i.id === selectedId);

  const firingCount = incidents.filter((i) => i.status === "firing").length;
  const investigatingCount = incidents.filter(
    (i) => i.status === "investigating"
  ).length;
  const resolvedCount = incidents.filter((i) => i.status === "resolved").length;

  const handleIncidentUpdate = useCallback((updated: Incident) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
  }, []);

  return (
    <div className="min-h-screen grid-bg">
      <div className="fixed inset-0 scanline-overlay z-50" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0e17]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap className="w-6 h-6 text-[#64d2ff]" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#30d158] rounded-full animate-status-blink" />
              </div>
              <div>
                <h1 className="font-mono text-[16px] font-bold tracking-tight text-foreground">
                  FleetContext
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wider uppercase">
                  AI-Native Incident Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {firingCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#ff2d55]/10 font-mono text-[10px] text-[#ff2d55]">
                    <AlertTriangle className="w-3 h-3" />
                    {firingCount} FIRING
                  </span>
                )}
                {investigatingCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#ff9f0a]/10 font-mono text-[10px] text-[#ff9f0a]">
                    <Activity className="w-3 h-3" />
                    {investigatingCount} INVESTIGATING
                  </span>
                )}
                {resolvedCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#30d158]/10 font-mono text-[10px] text-[#30d158]">
                    <CheckCircle2 className="w-3 h-3" />
                    {resolvedCount} RESOLVED
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={fetchIncidents}
                className="text-muted-foreground hover:text-foreground font-mono text-[11px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-[#64d2ff] mb-3" />
            <p className="font-mono text-sm">Connecting to incident feed...</p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="relative mb-6">
              <Shield className="w-16 h-16 text-[#64d2ff]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-8 h-8 text-[#64d2ff]/40" />
              </div>
            </div>
            <h2 className="font-mono text-[18px] font-bold text-foreground/80 mb-2">
              No Active Incidents
            </h2>
            <p className="font-mono text-[12px] text-muted-foreground/60 mb-6 text-center max-w-md">
              FleetContext monitors your infrastructure and uses AI agents to
              autonomously investigate incidents when they fire.
            </p>
            <Button
              onClick={seedDemo}
              disabled={seeding}
              className="font-mono text-[12px] tracking-wide bg-[#64d2ff]/10 border border-[#64d2ff]/30 text-[#64d2ff] hover:bg-[#64d2ff]/20 transition-all"
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Activity className="w-4 h-4 mr-2" />
              )}
              {seeding ? "SIMULATING..." : "SIMULATE INCIDENTS"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Incident List */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-wider">
                    Active Incidents ({incidents.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={seedDemo}
                    disabled={seeding}
                    className="text-muted-foreground/40 hover:text-muted-foreground font-mono text-[10px] h-6 px-2"
                  >
                    {seeding ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Reset Demo"
                    )}
                  </Button>
                </div>
                <IncidentList
                  incidents={incidents}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </div>

            {/* Incident Detail */}
            <div className="lg:col-span-8 xl:col-span-9">
              {selectedIncident ? (
                <div className="rounded-xl border border-white/5 bg-[#111827]/30 p-4">
                  <IncidentDetail
                    incident={selectedIncident}
                    onBack={() => setSelectedId(undefined)}
                    onUpdate={handleIncidentUpdate}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground/30">
                  <Activity className="w-12 h-12 mb-3" />
                  <p className="font-mono text-[13px]">
                    Select an incident to investigate
                  </p>
                  <p className="font-mono text-[11px] mt-1 opacity-60">
                    AI agents will analyze logs, deployments, and metrics
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
