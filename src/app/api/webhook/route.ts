import { NextResponse } from "next/server";
import { upsertIncident } from "@/lib/incidents-store";
import { Incident, Severity, LogEntry } from "@/lib/types";

// Webhook endpoint for ingesting alerts from external sources
// Supports PagerDuty, Datadog, Prometheus Alertmanager, and generic formats

interface WebhookPayload {
  source?: string;
  // Generic format
  title?: string;
  description?: string;
  severity?: string;
  service?: string;
  // PagerDuty-style
  event?: {
    event_type?: string;
    data?: {
      title?: string;
      body?: { details?: string };
      severity?: { summary?: string };
      service?: { summary?: string };
    };
  };
  // Datadog-style
  alert_title?: string;
  alert_body?: string;
  priority?: string;
  tags?: string[];
  // Alertmanager-style
  alerts?: Array<{
    status?: string;
    labels?: Record<string, string>;
    annotations?: { summary?: string; description?: string };
  }>;
}

function mapSeverity(input?: string): Severity {
  if (!input) return "medium";
  const lower = input.toLowerCase();
  if (lower.includes("crit") || lower === "p1" || lower === "sev1")
    return "critical";
  if (lower.includes("high") || lower === "p2" || lower === "sev2" || lower === "error")
    return "high";
  if (lower.includes("low") || lower === "p4" || lower === "sev4" || lower === "info")
    return "low";
  return "medium";
}

export async function POST(request: Request) {
  try {
    const body: WebhookPayload = await request.json();

    let title: string;
    let description: string;
    let severity: Severity;
    let service: string;
    let alertSource: string;
    let tags: string[] = [];

    if (body.event?.data) {
      // PagerDuty format
      title = body.event.data.title || "PagerDuty Alert";
      description = body.event.data.body?.details || "";
      severity = mapSeverity(body.event.data.severity?.summary);
      service = body.event.data.service?.summary || "unknown";
      alertSource = "PagerDuty";
      tags = ["pagerduty"];
    } else if (body.alert_title) {
      // Datadog format
      title = body.alert_title;
      description = body.alert_body || "";
      severity = mapSeverity(body.priority);
      service = body.tags?.find((t: string) => t.startsWith("service:"))?.split(":")[1] || "unknown";
      alertSource = "Datadog";
      tags = body.tags || [];
    } else if (body.alerts && body.alerts.length > 0) {
      // Alertmanager format
      const alert = body.alerts[0];
      title = alert.annotations?.summary || alert.labels?.alertname || "Prometheus Alert";
      description = alert.annotations?.description || "";
      severity = mapSeverity(alert.labels?.severity);
      service = alert.labels?.service || alert.labels?.job || "unknown";
      alertSource = "Prometheus";
      tags = Object.entries(alert.labels || {}).map(
        ([k, v]) => `${k}:${v}`
      );
    } else {
      // Generic format
      title = body.title || "External Alert";
      description = body.description || "";
      severity = mapSeverity(body.severity);
      service = body.service || "unknown";
      alertSource = body.source || "webhook";
      tags = ["webhook"];
    }

    const now = new Date().toISOString();
    const incident: Incident = {
      id: `inc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      description,
      severity,
      status: "firing",
      service,
      triggeredAt: now,
      alertSource,
      tags,
      logs: [
        {
          timestamp: now,
          service,
          level: "error",
          message: `Alert received via webhook: ${title}`,
        },
      ] as LogEntry[],
      deployments: [],
      metrics: [],
      investigationSteps: [],
    };

    upsertIncident(incident);

    return NextResponse.json(
      {
        message: "Incident created",
        incidentId: incident.id,
        severity: incident.severity,
        service: incident.service,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid webhook payload", details: String(error) },
      { status: 400 }
    );
  }
}
