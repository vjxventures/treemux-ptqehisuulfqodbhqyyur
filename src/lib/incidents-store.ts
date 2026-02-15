import { Incident } from "./types";

// In-memory store for demo purposes (would be a database in production)
const incidents: Map<string, Incident> = new Map();

export function getAllIncidents(): Incident[] {
  return Array.from(incidents.values()).sort(
    (a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
  );
}

export function getIncident(id: string): Incident | undefined {
  return incidents.get(id);
}

export function upsertIncident(incident: Incident): Incident {
  incidents.set(incident.id, incident);
  return incident;
}

export function updateIncident(id: string, updates: Partial<Incident>): Incident | undefined {
  const existing = incidents.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  incidents.set(id, updated);
  return updated;
}

export function deleteAllIncidents(): void {
  incidents.clear();
}
