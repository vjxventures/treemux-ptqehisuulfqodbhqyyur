import { NextResponse } from "next/server";
import { getIncident, updateIncident } from "@/lib/incidents-store";
import { investigateIncident } from "@/lib/ai-investigator";
import { InvestigationStep, RootCauseAnalysis } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incident = getIncident(id);
  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  // Use ReadableStream to stream investigation steps
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const steps: InvestigationStep[] = [];

        for await (const result of investigateIncident(incident)) {
          if ("agentName" in result) {
            // It's an InvestigationStep
            const step = result as InvestigationStep;
            const existingIdx = steps.findIndex((s) => s.id === step.id);
            if (existingIdx >= 0) {
              steps[existingIdx] = step;
            } else {
              steps.push(step);
            }

            // Update the incident in store
            updateIncident(id, { investigationSteps: [...steps] });

            // Stream the step to the client
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "step", data: step })}\n\n`
              )
            );
          } else {
            // It's a RootCauseAnalysis
            const rootCause = result as RootCauseAnalysis;
            updateIncident(id, {
              rootCause,
              status: "investigating",
              investigationSteps: [...steps],
            });

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "rootCause", data: rootCause })}\n\n`
              )
            );
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", data: errorMessage })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
