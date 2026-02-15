import { NextResponse } from "next/server";
import { getIncident, updateIncident } from "@/lib/incidents-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incident = getIncident(id);
  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const updated = updateIncident(id, {
    status: "resolved",
    resolvedAt: new Date().toISOString(),
  });

  return NextResponse.json(updated);
}
