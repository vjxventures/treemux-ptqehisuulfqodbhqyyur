export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "firing" | "investigating" | "resolved";

export interface LogEntry {
  timestamp: string;
  service: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
}

export interface Deployment {
  id: string;
  service: string;
  timestamp: string;
  author: string;
  commitMessage: string;
  sha: string;
}

export interface Metric {
  name: string;
  service: string;
  values: { timestamp: string; value: number }[];
  unit: string;
}

export interface InvestigationStep {
  id: string;
  agentName: string;
  action: string;
  status: "running" | "complete" | "error";
  summary: string;
  details?: string;
  timestamp: string;
}

export interface RootCauseAnalysis {
  summary: string;
  confidence: number;
  evidence: string[];
  suggestedFix: string;
  runbook: string[];
  relatedDeployment?: Deployment;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  service: string;
  triggeredAt: string;
  resolvedAt?: string;
  alertSource: string;
  logs: LogEntry[];
  deployments: Deployment[];
  metrics: Metric[];
  investigationSteps: InvestigationStep[];
  rootCause?: RootCauseAnalysis;
  assignee?: string;
  tags: string[];
}
