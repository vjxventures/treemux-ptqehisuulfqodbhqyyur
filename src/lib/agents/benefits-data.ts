// Comprehensive benefits knowledge base for the agent
// This simulates what would be a RAG pipeline in production

export interface UserProfile {
  name: string;
  age: number;
  sex: "male" | "female";
  planName: string;
  dependents: number;
  employmentType: "full-time" | "part-time" | "contract";
  annualIncome: number;
  deductibleMet: number;
  monthsLeftInYear: number;
}

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    name: "Sarah Chen",
    age: 34,
    sex: "female",
    planName: "Blue Shield PPO Gold",
    dependents: 2,
    employmentType: "full-time",
    annualIncome: 95000,
    deductibleMet: 800,
    monthsLeftInYear: 10,
  },
  {
    name: "Marcus Johnson",
    age: 28,
    sex: "male",
    planName: "Aetna HDHP Bronze",
    dependents: 0,
    employmentType: "full-time",
    annualIncome: 72000,
    deductibleMet: 0,
    monthsLeftInYear: 10,
  },
];

// Common health scenarios that people encounter
export const SCENARIO_TEMPLATES = [
  {
    category: "Emergency",
    scenarios: [
      "My child fell and might have a broken bone",
      "I'm having severe chest pain",
      "I need stitches after cutting myself",
    ],
  },
  {
    category: "Routine Care",
    scenarios: [
      "I need to schedule my annual physical",
      "I want to find a new primary care doctor",
      "I need a prescription refill",
    ],
  },
  {
    category: "Mental Health",
    scenarios: [
      "I'm feeling overwhelmed and need someone to talk to",
      "I want to start therapy for anxiety",
      "My teenager needs counseling",
    ],
  },
  {
    category: "Financial",
    scenarios: [
      "How can I save money on my prescriptions?",
      "Should I switch to the HDHP during open enrollment?",
      "I got a medical bill that seems wrong",
    ],
  },
];

// In-network provider database (simulated)
export const PROVIDER_DATABASE = {
  primaryCare: [
    {
      name: "Dr. Emily Watson",
      specialty: "Family Medicine",
      distance: "0.8 miles",
      rating: 4.9,
      nextAvailable: "Next Tuesday",
      telehealth: true,
    },
    {
      name: "Dr. Raj Patel",
      specialty: "Internal Medicine",
      distance: "1.2 miles",
      rating: 4.7,
      nextAvailable: "Tomorrow",
      telehealth: true,
    },
  ],
  urgentCare: [
    {
      name: "MinuteClinic - CVS",
      distance: "0.5 miles",
      hours: "8am-8pm",
      waitTime: "~15 min",
    },
    {
      name: "CityMD Urgent Care",
      distance: "1.0 miles",
      hours: "8am-10pm",
      waitTime: "~25 min",
    },
  ],
  mentalHealth: [
    {
      name: "Dr. Lisa Park",
      specialty: "Clinical Psychology",
      distance: "1.5 miles",
      rating: 4.8,
      nextAvailable: "Next week",
      telehealth: true,
      specialties: ["anxiety", "depression", "CBT"],
    },
    {
      name: "BetterHelp (Online)",
      specialty: "Online Therapy",
      distance: "Online",
      rating: 4.5,
      nextAvailable: "Today",
      telehealth: true,
      specialties: ["anxiety", "depression", "stress", "relationships"],
    },
  ],
};

// Common medical procedure costs (average in-network)
export const PROCEDURE_COSTS: Record<
  string,
  { low: number; average: number; high: number; description: string }
> = {
  "emergency room visit": {
    low: 500,
    average: 1500,
    high: 3000,
    description: "ER visit (without admission)",
  },
  "urgent care visit": {
    low: 100,
    average: 200,
    high: 400,
    description: "Urgent care visit",
  },
  mri: {
    low: 400,
    average: 1200,
    high: 2500,
    description: "MRI scan",
  },
  "physical therapy": {
    low: 75,
    average: 150,
    high: 300,
    description: "Physical therapy session",
  },
  "therapy session": {
    low: 100,
    average: 200,
    high: 350,
    description: "Mental health therapy session",
  },
  "dental cleaning": {
    low: 75,
    average: 150,
    high: 300,
    description: "Routine dental cleaning",
  },
  "x-ray": {
    low: 100,
    average: 250,
    high: 500,
    description: "X-ray imaging",
  },
  "blood work": {
    low: 50,
    average: 150,
    high: 400,
    description: "Standard blood panel",
  },
  "specialist visit": {
    low: 150,
    average: 300,
    high: 500,
    description: "Specialist consultation",
  },
};
