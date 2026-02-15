import { NextResponse } from "next/server";
import { deleteAllIncidents, upsertIncident } from "@/lib/incidents-store";
import { generateDemoIncidents } from "@/lib/demo-data";

export async function POST() {
  deleteAllIncidents();
  const incidents = generateDemoIncidents();
  for (const incident of incidents) {
    upsertIncident(incident);
  }
  return NextResponse.json({
    message: `Seeded ${incidents.length} demo incidents`,
    count: incidents.length,
  });
}
