import { tool } from "ai";
import { z } from "zod/v4";

// Sample benefits data representing common health plan structures
const SAMPLE_PLANS = {
  "Blue Shield PPO Gold": {
    name: "Blue Shield PPO Gold",
    type: "PPO",
    deductible: { individual: 1500, family: 3000 },
    outOfPocketMax: { individual: 6000, family: 12000 },
    copays: {
      primaryCare: 30,
      specialist: 50,
      urgentCare: 75,
      emergencyRoom: 250,
      genericRx: 15,
      brandRx: 40,
      specialtyRx: 100,
    },
    coinsurance: 20,
    preventiveCare: "Covered 100% in-network, no deductible",
    mentalHealth: {
      inNetwork: "$30 copay per session",
      outOfNetwork: "40% coinsurance after deductible",
      teletherapy: "Covered same as in-person",
    },
    dental: "Basic dental included (cleanings, X-rays). Major work 50% coinsurance.",
    vision: "Annual eye exam $10 copay. $150 allowance for frames/lenses.",
    wellness: {
      gymReimbursement: "$300/year",
      wellnessPrograms: "Free access to weight management, smoking cessation",
      preventiveScreenings: "Annual physical, vaccinations, cancer screenings all covered 100%",
    },
    hsa: { eligible: false, employerContribution: 0, maxContribution: 0 },
    fsa: { eligible: true, maxContribution: 3050 },
    telehealth: "$0 copay for virtual visits",
    urgentCareVsER:
      "Urgent care copay: $75. ER copay: $250 (waived if admitted). Always try urgent care first for non-life-threatening issues.",
  },
  "Aetna HDHP Bronze": {
    name: "Aetna HDHP Bronze",
    type: "HDHP",
    deductible: { individual: 3000, family: 6000 },
    outOfPocketMax: { individual: 7500, family: 15000 },
    copays: {
      primaryCare: 0,
      specialist: 0,
      urgentCare: 0,
      emergencyRoom: 0,
      genericRx: 0,
      brandRx: 0,
      specialtyRx: 0,
    },
    coinsurance: 20,
    note: "All services subject to deductible first (except preventive care). After deductible, 20% coinsurance.",
    preventiveCare: "Covered 100% in-network, no deductible",
    mentalHealth: {
      inNetwork: "Subject to deductible, then 20% coinsurance",
      outOfNetwork: "Subject to deductible, then 40% coinsurance",
      teletherapy: "Covered same as in-person",
    },
    dental: "Not included. Separate dental plan available.",
    vision: "Not included. Separate vision plan available.",
    wellness: {
      gymReimbursement: "Not included",
      wellnessPrograms: "Free access to EAP (Employee Assistance Program)",
      preventiveScreenings: "Annual physical, vaccinations, cancer screenings all covered 100%",
    },
    hsa: { eligible: true, employerContribution: 500, maxContribution: 4150 },
    fsa: { eligible: false, maxContribution: 0, note: "Cannot use FSA with HDHP (limited-purpose FSA only)" },
    telehealth: "Subject to deductible",
    urgentCareVsER:
      "Both subject to deductible. Urgent care typically costs $150-300, ER $1,000-3,000+. Use urgent care when possible.",
  },
};

type PlanKey = keyof typeof SAMPLE_PLANS;

export const lookupBenefits = tool({
  description:
    "Look up specific benefit information from the user's health insurance plan. Use this to answer questions about coverage, copays, deductibles, and other plan details.",
  inputSchema: z.object({
    planName: z
      .string()
      .describe("The name of the insurance plan to look up"),
    category: z
      .string()
      .describe(
        "The category of benefit to look up, e.g. 'copays', 'deductible', 'mentalHealth', 'dental', 'vision', 'wellness', 'hsa', 'fsa', 'telehealth', 'preventiveCare'"
      ),
  }),
  execute: async ({ planName, category }) => {
    const plan =
      SAMPLE_PLANS[planName as PlanKey] ??
      Object.values(SAMPLE_PLANS).find((p) =>
        p.name.toLowerCase().includes(planName.toLowerCase())
      );
    if (!plan) {
      return {
        found: false,
        availablePlans: Object.keys(SAMPLE_PLANS),
        message: `Plan "${planName}" not found. Available plans: ${Object.keys(SAMPLE_PLANS).join(", ")}`,
      };
    }
    const info = (plan as Record<string, unknown>)[category];
    return {
      found: true,
      planName: plan.name,
      planType: plan.type,
      category,
      details: info ?? "Category not found in plan details",
      allCategories: Object.keys(plan),
    };
  },
});

export const comparePlans = tool({
  description:
    "Compare two or more health insurance plans side by side on key metrics like deductibles, copays, and out-of-pocket maximums.",
  inputSchema: z.object({
    aspects: z
      .array(z.string())
      .describe(
        "Aspects to compare, e.g. ['deductible', 'copays', 'outOfPocketMax']"
      ),
  }),
  execute: async ({ aspects }) => {
    const comparison: Record<string, Record<string, unknown>> = {};
    for (const planName of Object.keys(SAMPLE_PLANS)) {
      const plan = SAMPLE_PLANS[planName as PlanKey];
      comparison[plan.name] = {};
      for (const aspect of aspects) {
        comparison[plan.name][aspect] =
          (plan as Record<string, unknown>)[aspect] ?? "N/A";
      }
    }
    return { comparison, plansCompared: Object.keys(SAMPLE_PLANS) };
  },
});

export const estimateCost = tool({
  description:
    "Estimate out-of-pocket costs for a medical procedure or service based on the user's plan, current deductible status, and whether the provider is in-network.",
  inputSchema: z.object({
    planName: z.string().describe("The name of the insurance plan"),
    service: z
      .string()
      .describe(
        "The medical service, e.g. 'emergency room visit', 'MRI', 'therapy session'"
      ),
    estimatedCost: z
      .number()
      .describe("The estimated total cost of the service in dollars"),
    deductibleMet: z
      .number()
      .describe(
        "How much of the annual deductible has already been met in dollars"
      ),
    inNetwork: z.boolean().describe("Whether the provider is in-network"),
  }),
  execute: async ({
    planName,
    service,
    estimatedCost,
    deductibleMet,
    inNetwork,
  }) => {
    const plan =
      SAMPLE_PLANS[planName as PlanKey] ??
      Object.values(SAMPLE_PLANS).find((p) =>
        p.name.toLowerCase().includes(planName.toLowerCase())
      );
    if (!plan) {
      return { error: "Plan not found" };
    }

    const deductible = plan.deductible.individual;
    const remainingDeductible = Math.max(0, deductible - deductibleMet);
    const coinsuranceRate = inNetwork
      ? plan.coinsurance / 100
      : (plan.coinsurance + 20) / 100;

    let outOfPocket: number;
    if (plan.type === "HDHP") {
      // HDHP: Everything goes toward deductible first
      if (remainingDeductible >= estimatedCost) {
        outOfPocket = estimatedCost;
      } else {
        outOfPocket =
          remainingDeductible +
          (estimatedCost - remainingDeductible) * coinsuranceRate;
      }
    } else {
      // PPO: Copay-based for common services
      const copayMap: Record<string, keyof typeof plan.copays> = {
        "primary care": "primaryCare",
        "specialist": "specialist",
        "urgent care": "urgentCare",
        "emergency room": "emergencyRoom",
        "er visit": "emergencyRoom",
        "generic prescription": "genericRx",
        "brand prescription": "brandRx",
      };
      const matchedCopay = Object.entries(copayMap).find(([key]) =>
        service.toLowerCase().includes(key)
      );
      if (matchedCopay) {
        outOfPocket = plan.copays[matchedCopay[1]];
      } else {
        if (remainingDeductible >= estimatedCost) {
          outOfPocket = estimatedCost;
        } else {
          outOfPocket =
            remainingDeductible +
            (estimatedCost - remainingDeductible) * coinsuranceRate;
        }
      }
    }

    const oop = Math.min(
      outOfPocket,
      plan.outOfPocketMax.individual - deductibleMet
    );

    return {
      planName: plan.name,
      service,
      estimatedTotalCost: estimatedCost,
      estimatedOutOfPocket: Math.round(oop * 100) / 100,
      deductibleStatus: {
        annual: deductible,
        met: deductibleMet,
        remaining: remainingDeductible,
      },
      inNetwork,
      coinsuranceRate: `${coinsuranceRate * 100}%`,
      outOfPocketMax: plan.outOfPocketMax.individual,
      recommendation:
        !inNetwork
          ? "Consider finding an in-network provider to reduce costs significantly."
          : oop > 500
            ? "This is a significant expense. Check if your plan's telehealth option or urgent care could be alternatives."
            : "This cost is within a typical range for your plan.",
    };
  },
});

export const findPreventiveCare = tool({
  description:
    "Find preventive care services that are covered at 100% with no cost to the user. Helps users discover free benefits they may not be using.",
  inputSchema: z.object({
    age: z.number().describe("The user's age"),
    sex: z.enum(["male", "female"]).describe("The user's biological sex"),
  }),
  execute: async ({ age, sex }) => {
    const services: { service: string; frequency: string; covered: boolean }[] =
      [];

    // Universal preventive services
    services.push(
      {
        service: "Annual wellness visit / physical exam",
        frequency: "Once per year",
        covered: true,
      },
      {
        service: "Blood pressure screening",
        frequency: "Every visit",
        covered: true,
      },
      {
        service: "Cholesterol screening",
        frequency: "Every 4-6 years (more often if at risk)",
        covered: true,
      },
      {
        service: "Depression screening",
        frequency: "Annual",
        covered: true,
      },
      {
        service: "Immunizations (flu, Tdap, hepatitis, etc.)",
        frequency: "As recommended by CDC schedule",
        covered: true,
      },
      {
        service: "Type 2 diabetes screening",
        frequency: "If BMI > 25, every 3 years",
        covered: true,
      }
    );

    if (age >= 45) {
      services.push({
        service: "Colorectal cancer screening (colonoscopy)",
        frequency: "Every 10 years starting at age 45",
        covered: true,
      });
    }

    if (age >= 50) {
      services.push({
        service: "Lung cancer screening (if smoking history)",
        frequency: "Annual for qualifying individuals",
        covered: true,
      });
    }

    if (sex === "female") {
      services.push(
        {
          service: "Mammogram",
          frequency: age >= 40 ? "Annual" : "Discuss with doctor",
          covered: true,
        },
        {
          service: "Cervical cancer screening (Pap smear)",
          frequency: "Every 3 years (age 21-65)",
          covered: true,
        },
        {
          service: "Contraceptive counseling and FDA-approved methods",
          frequency: "As needed",
          covered: true,
        }
      );
    }

    if (sex === "male" && age >= 55) {
      services.push({
        service: "Prostate cancer screening discussion",
        frequency: "Discuss with doctor",
        covered: true,
      });
    }

    return {
      eligibleServices: services,
      totalFreeServices: services.length,
      importantNote:
        "All preventive services are covered 100% in-network with no deductible under the ACA. You should be using these!",
      actionItem:
        "Schedule your annual wellness visit if you haven't had one this year — it's completely free.",
    };
  },
});

export const checkMentalHealthResources = tool({
  description:
    "Check mental health benefits and resources available under the user's plan, including therapy, counseling, crisis resources, and wellness programs.",
  inputSchema: z.object({
    planName: z.string().describe("The name of the insurance plan"),
    concern: z
      .string()
      .describe(
        "The type of mental health concern, e.g. 'anxiety', 'depression', 'stress', 'grief', 'substance use'"
      ),
  }),
  execute: async ({ planName, concern }) => {
    const plan =
      SAMPLE_PLANS[planName as PlanKey] ??
      Object.values(SAMPLE_PLANS).find((p) =>
        p.name.toLowerCase().includes(planName.toLowerCase())
      );

    const resources = {
      planCoverage: plan
        ? plan.mentalHealth
        : "Plan not found — but mental health parity laws require most plans to cover mental health equally to physical health.",
      crisisResources: {
        "988 Suicide & Crisis Lifeline": "Call or text 988 (free, 24/7)",
        "Crisis Text Line": "Text HOME to 741741",
        "SAMHSA Helpline": "1-800-662-4357 (free referrals, 24/7)",
      },
      freeResources: [
        "Employee Assistance Program (EAP) — typically 6-8 free sessions",
        "NAMI support groups (nami.org)",
        "Mental health apps (many plans cover Headspace, Calm, or Talkspace)",
      ],
      concernSpecific: getConcernResources(concern),
      teleTherapy:
        plan?.telehealth ??
        "Most plans now cover teletherapy — often at lower cost than in-person.",
      actionItems: [
        "Check if your employer offers an EAP — these sessions are usually free and confidential",
        "Ask your plan about covered mental health apps",
        "Your annual preventive visit can include depression/anxiety screening at no cost",
      ],
    };

    return resources;
  },
});

function getConcernResources(concern: string): string {
  const lower = concern.toLowerCase();
  if (lower.includes("anxiety") || lower.includes("stress")) {
    return "Cognitive Behavioral Therapy (CBT) is evidence-based and typically covered. Many plans also cover mindfulness-based stress reduction programs.";
  }
  if (lower.includes("depression")) {
    return "Depression is one of the most treatable conditions. Both therapy and medication are covered under mental health parity laws. Screening is free at your annual visit.";
  }
  if (lower.includes("grief") || lower.includes("loss")) {
    return "Grief counseling is typically covered. Many EAPs specifically include bereavement support. Support groups are often free.";
  }
  if (lower.includes("substance") || lower.includes("addiction")) {
    return "Substance use treatment is covered under mental health parity. SAMHSA helpline (1-800-662-4357) provides free referrals 24/7.";
  }
  return "Most mental health services are covered under federal parity laws. Contact your plan for specific coverage details.";
}

export const generateActionPlan = tool({
  description:
    "Generate a personalized action plan with specific steps the user should take to optimize their benefits, including deadlines, dollar savings estimates, and priority levels.",
  inputSchema: z.object({
    planName: z.string().describe("The name of the insurance plan"),
    situation: z
      .string()
      .describe(
        "The user's current situation or concern, e.g. 'new enrollment', 'just had a baby', 'managing chronic condition'"
      ),
    monthsLeftInYear: z
      .number()
      .describe("Number of months remaining in the current plan year"),
  }),
  execute: async ({ planName, situation, monthsLeftInYear }) => {
    const plan =
      SAMPLE_PLANS[planName as PlanKey] ??
      Object.values(SAMPLE_PLANS).find((p) =>
        p.name.toLowerCase().includes(planName.toLowerCase())
      );

    const actions: {
      priority: string;
      action: string;
      potentialSavings: string;
      deadline: string;
    }[] = [];

    // Universal recommendations
    actions.push({
      priority: "HIGH",
      action: "Schedule your annual wellness visit (completely free)",
      potentialSavings: "$200-500 (retail cost of a physical)",
      deadline: "Within the next month",
    });

    if (plan?.hsa?.eligible) {
      actions.push({
        priority: "HIGH",
        action: `Max out HSA contributions (${plan.hsa.maxContribution}/year). Employer contributes $${plan.hsa.employerContribution}. You have ${monthsLeftInYear} months left.`,
        potentialSavings: `$${Math.round(plan.hsa.maxContribution * 0.3)} in tax savings`,
        deadline: "Before plan year end",
      });
    }

    if (plan?.fsa?.eligible) {
      actions.push({
        priority: "MEDIUM",
        action: `Review FSA balance — FSA funds expire at year end. Max: $${plan.fsa.maxContribution}/year.`,
        potentialSavings: "Use it or lose it!",
        deadline: `${monthsLeftInYear} months remaining`,
      });
    }

    if (plan?.wellness) {
      if (
        plan.wellness.gymReimbursement &&
        plan.wellness.gymReimbursement !== "Not included"
      ) {
        actions.push({
          priority: "MEDIUM",
          action: `Claim gym reimbursement: ${plan.wellness.gymReimbursement}`,
          potentialSavings: plan.wellness.gymReimbursement,
          deadline: "Before plan year end",
        });
      }
    }

    actions.push({
      priority: "MEDIUM",
      action:
        "Review all preventive care screenings you're eligible for (all free)",
      potentialSavings: "$500-2,000 in early detection value",
      deadline: "Schedule within 2 weeks",
    });

    if (plan?.telehealth) {
      actions.push({
        priority: "LOW",
        action: `Set up telehealth access — your plan covers it at ${plan.telehealth}`,
        potentialSavings: "$50-200 per visit vs. in-person",
        deadline: "Whenever convenient",
      });
    }

    return {
      planName: plan?.name ?? planName,
      situation,
      actionPlan: actions,
      totalPotentialSavings:
        "Following all recommendations could save you $1,000-5,000+ per year",
      openEnrollmentReminder:
        "Open enrollment is typically in November. Review your plan needs 2-3 months before.",
    };
  },
});
