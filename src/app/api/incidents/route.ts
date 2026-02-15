import { NextResponse } from "next/server";
import { getAllIncidents, upsertIncident } from "@/lib/incidents-store";
import { Incident } from "@/lib/types";

export async function GET() {
  const incidents = getAllIncidents();
  return NextResponse.json(incidents);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Incident;
  const incident = upsertIncident(body);
  return NextResponse.json(incident, { status: 201 });
}
