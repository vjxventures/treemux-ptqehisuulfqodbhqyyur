import { Incident, LogEntry, Deployment, Metric } from "./types";

function generateId(): string {
  return `inc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function generateMetricValues(
  baseValue: number,
  anomalyAtIndex: number,
  anomalyMultiplier: number,
  count: number = 10
): { timestamp: string; value: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: minutesAgo((count - i) * 5),
    value:
      i >= anomalyAtIndex
        ? Math.round(baseValue * anomalyMultiplier * (1 + Math.random() * 0.2))
        : Math.round(baseValue * (0.9 + Math.random() * 0.2)),
  }));
}

export function generateDemoIncidents(): Incident[] {
  return [
    // Critical: API Gateway Timeout Storm
    {
      id: generateId(),
      title: "API Gateway 5xx Errors Spike — 43% Error Rate",
      description:
        "API gateway returning 503 Service Unavailable for 43% of requests. Customer-facing endpoints severely degraded. Multiple downstream services reporting connection timeouts.",
      severity: "critical",
      status: "firing",
      service: "api-gateway",
      triggeredAt: minutesAgo(12),
      alertSource: "Datadog",
      tags: ["p0", "customer-facing", "api", "gateway"],
      logs: [
        { timestamp: minutesAgo(15), service: "api-gateway", level: "info", message: "Health check passed for upstream pool 'payment-service'" },
        { timestamp: minutesAgo(12), service: "api-gateway", level: "warn", message: "Connection pool exhaustion warning: payment-service (85% utilized)" },
        { timestamp: minutesAgo(11), service: "api-gateway", level: "error", message: "Upstream connection timeout after 30000ms: payment-service:8080/v2/process" },
        { timestamp: minutesAgo(11), service: "payment-service", level: "error", message: "OOM killer invoked: container exceeded 4Gi memory limit" },
        { timestamp: minutesAgo(10), service: "api-gateway", level: "error", message: "Circuit breaker OPEN for payment-service — 15 consecutive failures" },
        { timestamp: minutesAgo(10), service: "payment-service", level: "error", message: "Fatal: Goroutine leak detected in transaction processor — 24,891 active goroutines" },
        { timestamp: minutesAgo(9), service: "api-gateway", level: "error", message: "5xx rate exceeded threshold: 43.2% (threshold: 5%)" },
        { timestamp: minutesAgo(8), service: "payment-service", level: "error", message: "Database connection pool exhausted: max_connections=100, active=100, waiting=342" },
        { timestamp: minutesAgo(7), service: "api-gateway", level: "error", message: "Cascading failure detected: order-service, inventory-service also degraded" },
        { timestamp: minutesAgo(5), service: "kubernetes", level: "warn", message: "Pod payment-service-7d4f8c9-xk2lp restarting: CrashLoopBackOff (restart count: 4)" },
      ] as LogEntry[],
      deployments: [
        {
          id: "deploy_1",
          service: "payment-service",
          timestamp: minutesAgo(25),
          author: "sarah.chen",
          commitMessage: "feat: add concurrent transaction batching for v2 payment processor",
          sha: "a1b2c3d",
        },
        {
          id: "deploy_2",
          service: "api-gateway",
          timestamp: minutesAgo(180),
          author: "mike.ross",
          commitMessage: "chore: update nginx config for rate limiting",
          sha: "e4f5g6h",
        },
      ] as Deployment[],
      metrics: [
        {
          name: "Error Rate (5xx)",
          service: "api-gateway",
          unit: "%",
          values: generateMetricValues(2, 6, 20),
        },
        {
          name: "P99 Latency",
          service: "api-gateway",
          unit: "ms",
          values: generateMetricValues(150, 6, 15),
        },
        {
          name: "Memory Usage",
          service: "payment-service",
          unit: "Mi",
          values: generateMetricValues(2048, 5, 2),
        },
        {
          name: "Active Connections",
          service: "payment-service",
          unit: "",
          values: generateMetricValues(45, 6, 8),
        },
      ] as Metric[],
      investigationSteps: [],
    },

    // High: Database Replication Lag
    {
      id: generateId(),
      title: "PostgreSQL Replication Lag Exceeds 30s — Read Replicas Stale",
      description:
        "Primary-to-replica replication lag has exceeded 30 seconds on the user-db cluster. Read-heavy endpoints serving stale data. Potential for data inconsistency in user-facing flows.",
      severity: "high",
      status: "firing",
      service: "user-db",
      triggeredAt: minutesAgo(8),
      alertSource: "PgBouncer Monitor",
      tags: ["database", "replication", "data-consistency"],
      logs: [
        { timestamp: minutesAgo(10), service: "user-db-primary", level: "info", message: "WAL generation rate: 12MB/s (normal: 3MB/s)" },
        { timestamp: minutesAgo(9), service: "user-db-replica-1", level: "warn", message: "Replication lag: 8.2s (threshold: 5s)" },
        { timestamp: minutesAgo(8), service: "user-db-replica-1", level: "error", message: "Replication lag: 31.4s — CRITICAL threshold exceeded" },
        { timestamp: minutesAgo(7), service: "user-service", level: "warn", message: "Stale read detected: user profile updated 25s ago not visible on replica" },
        { timestamp: minutesAgo(6), service: "user-db-primary", level: "warn", message: "Long-running transaction detected: UPDATE users SET ... WHERE batch_id IN (...) — running for 45s" },
        { timestamp: minutesAgo(5), service: "user-db-replica-2", level: "error", message: "Replication lag: 28.7s — applying backlog" },
        { timestamp: minutesAgo(4), service: "cron-worker", level: "info", message: "Batch job 'user-analytics-backfill' processing 2.3M rows" },
      ] as LogEntry[],
      deployments: [
        {
          id: "deploy_3",
          service: "cron-worker",
          timestamp: minutesAgo(15),
          author: "alex.kim",
          commitMessage: "feat: add user analytics backfill job for Q4 reporting",
          sha: "j7k8l9m",
        },
      ] as Deployment[],
      metrics: [
        {
          name: "Replication Lag",
          service: "user-db",
          unit: "s",
          values: generateMetricValues(0.5, 6, 60),
        },
        {
          name: "WAL Generation Rate",
          service: "user-db-primary",
          unit: "MB/s",
          values: generateMetricValues(3, 5, 4),
        },
        {
          name: "Query Duration P99",
          service: "user-db-primary",
          unit: "ms",
          values: generateMetricValues(25, 5, 8),
        },
      ] as Metric[],
      investigationSteps: [],
    },

    // Medium: Authentication Service Latency
    {
      id: generateId(),
      title: "Auth Service Latency Degradation — P99 > 2s",
      description:
        "Authentication service P99 latency has increased from 200ms to 2.1s. Login flows degraded but functional. Token refresh endpoints also affected.",
      severity: "medium",
      status: "firing",
      service: "auth-service",
      triggeredAt: minutesAgo(20),
      alertSource: "Prometheus",
      tags: ["latency", "auth", "degradation"],
      logs: [
        { timestamp: minutesAgo(22), service: "auth-service", level: "info", message: "Redis connection pool: 48/50 connections active" },
        { timestamp: minutesAgo(20), service: "auth-service", level: "warn", message: "Token validation latency exceeded SLO: 1.8s (SLO: 500ms)" },
        { timestamp: minutesAgo(18), service: "auth-service", level: "warn", message: "Redis SLOWLOG: GET session:* took 890ms" },
        { timestamp: minutesAgo(15), service: "redis-cluster", level: "warn", message: "Memory usage at 89% — eviction policy active" },
        { timestamp: minutesAgo(12), service: "auth-service", level: "error", message: "Token refresh timeout for 12 concurrent requests" },
      ] as LogEntry[],
      deployments: [
        {
          id: "deploy_4",
          service: "auth-service",
          timestamp: minutesAgo(60),
          author: "jordan.lee",
          commitMessage: "fix: increase session TTL to 24h for mobile clients",
          sha: "p1q2r3s",
        },
      ] as Deployment[],
      metrics: [
        {
          name: "P99 Latency",
          service: "auth-service",
          unit: "ms",
          values: generateMetricValues(200, 5, 10),
        },
        {
          name: "Redis Memory Usage",
          service: "redis-cluster",
          unit: "%",
          values: generateMetricValues(45, 4, 2),
        },
      ] as Metric[],
      investigationSteps: [],
    },

    // Resolved incident for history
    {
      id: generateId(),
      title: "CDN Cache Invalidation Failure — Serving Stale Assets",
      description:
        "CDN cache invalidation pipeline failed, causing users to receive outdated JavaScript bundles after a frontend deployment. Resolved by manual cache purge.",
      severity: "medium",
      status: "resolved",
      service: "cdn-edge",
      triggeredAt: minutesAgo(180),
      resolvedAt: minutesAgo(120),
      alertSource: "CloudWatch",
      tags: ["cdn", "cache", "frontend", "resolved"],
      logs: [
        { timestamp: minutesAgo(185), service: "cdn-edge", level: "info", message: "Cache invalidation request received for path: /static/js/*" },
        { timestamp: minutesAgo(183), service: "cdn-edge", level: "error", message: "Cache invalidation failed: API rate limit exceeded (429)" },
        { timestamp: minutesAgo(180), service: "frontend-app", level: "warn", message: "Version mismatch detected: client v2.14.0, expected v2.15.0" },
        { timestamp: minutesAgo(125), service: "cdn-edge", level: "info", message: "Manual cache purge initiated by ops-bot" },
        { timestamp: minutesAgo(120), service: "cdn-edge", level: "info", message: "Cache invalidation complete — all edge nodes updated" },
      ] as LogEntry[],
      deployments: [
        {
          id: "deploy_5",
          service: "frontend-app",
          timestamp: minutesAgo(190),
          author: "emma.wilson",
          commitMessage: "feat: redesign checkout flow with new payment options",
          sha: "t4u5v6w",
        },
      ] as Deployment[],
      metrics: [
        {
          name: "Cache Hit Rate",
          service: "cdn-edge",
          unit: "%",
          values: generateMetricValues(98, 6, 0.3),
        },
      ] as Metric[],
      investigationSteps: [],
      rootCause: {
        summary: "CDN cache invalidation API rate limit was exceeded during a high-traffic deployment window, causing stale assets to be served.",
        confidence: 0.95,
        evidence: [
          "Cache invalidation API returned 429 rate limit error",
          "Frontend deployment at 3h ago triggered invalidation request",
          "Cache hit rate dropped from 98% to 29% indicating stale content",
        ],
        suggestedFix: "Implement staggered cache invalidation with exponential backoff",
        runbook: [
          "Step 1: Verify current cache state across edge nodes",
          "Step 2: Execute manual cache purge via CDN API",
          "Step 3: Verify new assets are being served",
          "Step 4: Update invalidation pipeline with retry logic",
          "Step 5: Set up monitoring for cache invalidation failures",
        ],
      },
    },
  ];
}
