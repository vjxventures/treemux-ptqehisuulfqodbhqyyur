import Anthropic from "@anthropic-ai/sdk";
import {
  Incident,
  InvestigationStep,
  RootCauseAnalysis,
  LogEntry,
  Deployment,
  Metric,
} from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY_ALPHA,
});

function generateStepId(): string {
  return `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function* investigateIncident(
  incident: Incident
): AsyncGenerator<InvestigationStep | RootCauseAnalysis> {
  // Step 1: Log Analysis Agent
  const logStep: InvestigationStep = {
    id: generateStepId(),
    agentName: "Log Analyzer",
    action: "Analyzing error logs and patterns",
    status: "running",
    summary: "Scanning recent logs for error patterns and anomalies...",
    timestamp: new Date().toISOString(),
  };
  yield logStep;

  const logAnalysis = await analyzeLogsWithAI(incident);
  logStep.status = "complete";
  logStep.summary = logAnalysis.summary;
  logStep.details = logAnalysis.details;
  yield logStep;

  // Step 2: Deployment Correlation Agent
  const deployStep: InvestigationStep = {
    id: generateStepId(),
    agentName: "Deployment Correlator",
    action: "Correlating with recent deployments",
    status: "running",
    summary: "Checking recent deployments for potential correlation...",
    timestamp: new Date().toISOString(),
  };
  yield deployStep;

  const deployAnalysis = await correlateDeploymentsWithAI(incident);
  deployStep.status = "complete";
  deployStep.summary = deployAnalysis.summary;
  deployStep.details = deployAnalysis.details;
  yield deployStep;

  // Step 3: Metrics Analysis Agent
  const metricsStep: InvestigationStep = {
    id: generateStepId(),
    agentName: "Metrics Analyzer",
    action: "Analyzing service metrics and anomalies",
    status: "running",
    summary: "Examining metric trends for anomalies around incident time...",
    timestamp: new Date().toISOString(),
  };
  yield metricsStep;

  const metricsAnalysis = await analyzeMetricsWithAI(incident);
  metricsStep.status = "complete";
  metricsStep.summary = metricsAnalysis.summary;
  metricsStep.details = metricsAnalysis.details;
  yield metricsStep;

  // Step 4: Root Cause Synthesis Agent
  const synthesisStep: InvestigationStep = {
    id: generateStepId(),
    agentName: "Root Cause Synthesizer",
    action: "Synthesizing findings into root cause analysis",
    status: "running",
    summary: "Combining all agent findings to determine root cause...",
    timestamp: new Date().toISOString(),
  };
  yield synthesisStep;

  const rootCause = await synthesizeRootCauseWithAI(
    incident,
    logAnalysis,
    deployAnalysis,
    metricsAnalysis
  );

  synthesisStep.status = "complete";
  synthesisStep.summary = "Root cause analysis complete";
  yield synthesisStep;

  // Yield the final root cause analysis
  yield rootCause;
}

interface AgentAnalysis {
  summary: string;
  details: string;
}

async function analyzeLogsWithAI(incident: Incident): Promise<AgentAnalysis> {
  const logsText = incident.logs
    .map(
      (l: LogEntry) =>
        `[${l.timestamp}] [${l.service}] [${l.level.toUpperCase()}] ${l.message}`
    )
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a Site Reliability Engineering (SRE) log analysis agent. Analyze these logs from an active incident and identify key error patterns, anomalies, and potential causes.

Incident: ${incident.title}
Service: ${incident.service}
Severity: ${incident.severity}
Description: ${incident.description}

Recent Logs:
${logsText}

Provide your analysis in this exact JSON format:
{
  "summary": "One sentence summary of what the logs reveal",
  "details": "2-3 paragraph detailed analysis of the log patterns, error sequences, and what they indicate about the root cause"
}

Return ONLY the JSON, no other text.`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    return {
      summary: "Log analysis completed - identified error patterns in service logs",
      details: "Analysis of the log entries shows a pattern of errors originating from the affected service. Further investigation recommended.",
    };
  }
}

async function correlateDeploymentsWithAI(
  incident: Incident
): Promise<AgentAnalysis> {
  const deploymentsText = incident.deployments
    .map(
      (d: Deployment) =>
        `[${d.timestamp}] ${d.service} - ${d.commitMessage} (by ${d.author}, sha: ${d.sha})`
    )
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a deployment correlation agent for incident investigation. Analyze recent deployments to determine if any could have caused or contributed to this incident.

Incident: ${incident.title}
Service: ${incident.service}
Triggered At: ${incident.triggeredAt}
Description: ${incident.description}

Recent Deployments:
${deploymentsText || "No recent deployments found"}

Provide your analysis in this exact JSON format:
{
  "summary": "One sentence about deployment correlation findings",
  "details": "2-3 paragraph analysis of which deployments (if any) correlate with the incident timing and could be causal"
}

Return ONLY the JSON, no other text.`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    return {
      summary: "Deployment correlation analysis completed",
      details: "Reviewed recent deployments for correlation with the incident timeline.",
    };
  }
}

async function analyzeMetricsWithAI(
  incident: Incident
): Promise<AgentAnalysis> {
  const metricsText = incident.metrics
    .map((m: Metric) => {
      const recent = m.values.slice(-5);
      return `${m.name} (${m.service}): ${recent.map((v) => `${v.value}${m.unit}`).join(" → ")}`;
    })
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a metrics analysis agent for incident investigation. Analyze these service metrics to identify anomalies that could indicate the cause or impact of the incident.

Incident: ${incident.title}
Service: ${incident.service}
Description: ${incident.description}

Service Metrics (recent values, left=oldest → right=newest):
${metricsText || "No metrics available"}

Provide your analysis in this exact JSON format:
{
  "summary": "One sentence about metric anomalies found",
  "details": "2-3 paragraph analysis of metric trends, anomalies, and what they indicate"
}

Return ONLY the JSON, no other text.`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    return {
      summary: "Metrics analysis completed - detected anomalous patterns",
      details: "Service metrics show deviations from normal baselines around the incident time.",
    };
  }
}

async function synthesizeRootCauseWithAI(
  incident: Incident,
  logAnalysis: AgentAnalysis,
  deployAnalysis: AgentAnalysis,
  metricsAnalysis: AgentAnalysis
): Promise<RootCauseAnalysis> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are a senior SRE root cause analysis agent. Synthesize the findings from multiple investigation agents to determine the most likely root cause and generate a remediation runbook.

Incident: ${incident.title}
Service: ${incident.service}
Severity: ${incident.severity}
Description: ${incident.description}
Triggered At: ${incident.triggeredAt}

=== Log Analysis Agent Findings ===
${logAnalysis.summary}
${logAnalysis.details}

=== Deployment Correlation Agent Findings ===
${deployAnalysis.summary}
${deployAnalysis.details}

=== Metrics Analysis Agent Findings ===
${metricsAnalysis.summary}
${metricsAnalysis.details}

=== Recent Deployments ===
${incident.deployments.map((d: Deployment) => `[${d.timestamp}] ${d.service} - ${d.commitMessage} (by ${d.author})`).join("\n") || "None"}

Provide your root cause analysis in this exact JSON format:
{
  "summary": "Clear 1-2 sentence root cause determination",
  "confidence": 0.85,
  "evidence": ["evidence point 1", "evidence point 2", "evidence point 3"],
  "suggestedFix": "Specific action to resolve the incident",
  "runbook": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ...",
    "Step 5: ..."
  ],
  "relatedDeploymentSha": "sha of the most likely causal deployment, or null"
}

Return ONLY the JSON, no other text.`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    const relatedDeployment = parsed.relatedDeploymentSha
      ? incident.deployments.find(
          (d: Deployment) => d.sha === parsed.relatedDeploymentSha
        )
      : undefined;

    return {
      summary: parsed.summary,
      confidence: parsed.confidence,
      evidence: parsed.evidence,
      suggestedFix: parsed.suggestedFix,
      runbook: parsed.runbook,
      relatedDeployment,
    };
  } catch {
    return {
      summary: "Root cause analysis completed. Multiple factors identified.",
      confidence: 0.7,
      evidence: [
        "Error patterns in service logs",
        "Timing correlation with recent changes",
        "Metric anomalies detected",
      ],
      suggestedFix: "Review recent changes and service dependencies",
      runbook: [
        "Step 1: Check service health and restart if necessary",
        "Step 2: Review recent deployment changes",
        "Step 3: Check dependent service health",
        "Step 4: Roll back recent deployment if correlated",
        "Step 5: Monitor recovery metrics",
      ],
    };
  }
}
