import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { MERIDIAN_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { z } from "zod";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter("anthropic/claude-sonnet-4"),
    system: MERIDIAN_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      analyzeInfrastructure: tool({
        description:
          "Analyze a region's infrastructure across key sectors and return structured data for visualization. Use this when you need to provide a comprehensive infrastructure assessment with scores and metrics.",
        inputSchema: z.object({
          region: z.string().describe("The name of the region/city being analyzed"),
          country: z.string().describe("The country the region is in"),
          sectors: z.array(
            z.object({
              id: z.string().describe("Sector identifier: energy, transport, water, telecom, health, education"),
              name: z.string().describe("Human readable sector name"),
              currentScore: z
                .number()
                .min(0)
                .max(100)
                .describe("Current infrastructure quality score 0-100"),
              targetScore: z
                .number()
                .min(0)
                .max(100)
                .describe("Target score after recommended improvements"),
              investmentNeeded: z
                .string()
                .describe("Estimated investment needed, e.g. '$2.5B'"),
              populationImpact: z
                .string()
                .describe("Number of people who would benefit, e.g. '4.2M'"),
              priority: z
                .enum(["Critical", "High", "Medium", "Low"])
                .describe("Priority level for this sector"),
              keyProjects: z.array(
                z.object({
                  name: z.string(),
                  cost: z.string(),
                  timeline: z.string(),
                  impact: z.string(),
                })
              ),
            })
          ),
          overallScore: z
            .number()
            .min(0)
            .max(100)
            .describe("Overall infrastructure readiness score"),
          totalInvestment: z
            .string()
            .describe("Total estimated investment across all sectors"),
          climateRiskLevel: z
            .enum(["Low", "Moderate", "High", "Very High"])
            .describe("Climate risk assessment for the region"),
          economicGrowthPotential: z
            .enum(["Low", "Moderate", "High", "Very High"])
            .describe("Economic growth potential if infrastructure gaps are addressed"),
        }),
        execute: async (data) => {
          return data;
        },
      }),
      generateTimeline: tool({
        description:
          "Generate an infrastructure development timeline showing phased implementation. Use this when presenting a multi-year development plan.",
        inputSchema: z.object({
          region: z.string(),
          phases: z.array(
            z.object({
              name: z.string().describe("Phase name, e.g. 'Phase 1: Foundation'"),
              startYear: z.number(),
              endYear: z.number(),
              totalBudget: z.string(),
              projects: z.array(
                z.object({
                  name: z.string(),
                  sector: z.string(),
                  budget: z.string(),
                  description: z.string(),
                })
              ),
            })
          ),
        }),
        execute: async (data) => {
          return data;
        },
      }),
      compareRegions: tool({
        description:
          "Compare infrastructure metrics between two or more regions. Use this for benchmarking analysis.",
        inputSchema: z.object({
          regions: z.array(
            z.object({
              name: z.string(),
              overallScore: z.number().min(0).max(100),
              energyScore: z.number().min(0).max(100),
              transportScore: z.number().min(0).max(100),
              waterScore: z.number().min(0).max(100),
              telecomScore: z.number().min(0).max(100),
              healthScore: z.number().min(0).max(100),
              educationScore: z.number().min(0).max(100),
            })
          ),
        }),
        execute: async (data) => {
          return data;
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
