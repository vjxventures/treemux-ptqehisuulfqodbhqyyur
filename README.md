# PulseAid — AI-Native Benefits Navigator

**An AI-native reimagining of Zenefits (YC W13) for TreeHacks 2026**

Over $750 billion in employee health benefits go unused every year. PulseAid flips Zenefits' model from employer-first benefits administration to employee-first AI navigation. Instead of confusing plan documents, employees get a conversational AI that speaks plain language about their specific coverage.

## What It Does

PulseAid is a multi-agent conversational platform that acts as your personal benefits navigator:

- **Benefits Lookup**: Ask about any aspect of your plan — copays, deductibles, covered services
- **Cost Estimation**: Get specific out-of-pocket cost estimates for medical procedures
- **Plan Comparison**: Compare plans side-by-side on the metrics that matter to you
- **Preventive Care Discovery**: Find free preventive services you're eligible for but not using
- **Mental Health Resources**: Empathetic guidance to covered therapy, counseling, and crisis resources
- **Action Plans**: Personalized recommendations to maximize your benefits and save money
- **Provider Search**: Find in-network providers with availability and ratings
- **Insurance Jargon Translator**: Plain-language explanations of confusing insurance terms

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Frontend                  │
│  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │ Benefits Hub  │  │    Multi-turn Chat UI       │  │
│  │   Sidebar     │  │  (Vercel AI SDK useChat)    │  │
│  └──────────────┘  └─────────────────────────────┘  │
└─────────────────────────┬───────────────────────────┘
                          │ Streaming (UI Message Protocol)
┌─────────────────────────▼───────────────────────────┐
│              Claude Orchestrator (API Route)          │
│  ┌────────────────────────────────────────────────┐  │
│  │  Claude claude-sonnet-4 via @ai-sdk/anthropic  │  │
│  │  System prompt + 8 specialized tools           │  │
│  │  Multi-step reasoning (up to 8 tool calls)     │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  Tools:                                               │
│  ├── lookupBenefits          (plan details)           │
│  ├── comparePlans            (side-by-side)           │
│  ├── estimateCost            (OOP calculator)         │
│  ├── findPreventiveCare      (free services)          │
│  ├── checkMentalHealthResources  (therapy + crisis)   │
│  ├── generateActionPlan      (savings roadmap)        │
│  ├── findProviders           (in-network search)      │
│  └── explainInsuranceTerm    (jargon translator)      │
└───────────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + shadcn/ui + Tailwind CSS 4
- **AI**: Claude claude-sonnet-4 via Vercel AI SDK 6 + @ai-sdk/anthropic
- **Runtime**: Bun
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
bun install

# Set environment variable
export ANTHROPIC_API_KEY_ALPHA=your_key_here

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to start navigating your benefits.

## Demo Plans

Two demo insurance plans are included for testing:

1. **Blue Shield PPO Gold** — Comprehensive PPO with $1,500 deductible, $30 copays, good for families
2. **Aetna HDHP Bronze** — High-deductible plan ($3,000) with HSA eligibility, good for healthy individuals

## Prize Categories Targeted

- TreeHacks Grand Prize
- Anthropic Human Flourishing Track
- Anthropic Best Use of Claude Agent SDK
- YC "Build an Iconic YC Company with AI" (reimagining Zenefits, YC W13)
- Greylock "Best Multi-Turn Agent"
- Vercel "Best Use of Vercel"
- Most Technically Complex
- Decagon "Best Conversation Assistant"

## Team

Built by Pulse at TreeHacks 2026.
