export interface Region {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  population: string;
  description: string;
}

export const FEATURED_REGIONS: Region[] = [
  {
    id: "lagos-nigeria",
    name: "Lagos",
    country: "Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    population: "~21M",
    description: "West Africa's largest megacity facing rapid urbanization challenges",
  },
  {
    id: "dhaka-bangladesh",
    name: "Dhaka",
    country: "Bangladesh",
    lat: 23.8103,
    lng: 90.4125,
    population: "~22M",
    description: "One of the world's densest cities with critical climate resilience needs",
  },
  {
    id: "nairobi-kenya",
    name: "Nairobi",
    country: "Kenya",
    lat: -1.2921,
    lng: 36.8219,
    population: "~5M",
    description: "East Africa's tech hub balancing rapid growth with infrastructure",
  },
  {
    id: "lima-peru",
    name: "Lima",
    country: "Peru",
    lat: -12.0464,
    lng: -77.0428,
    population: "~11M",
    description: "South American capital with water scarcity and seismic challenges",
  },
  {
    id: "addis-ababa-ethiopia",
    name: "Addis Ababa",
    country: "Ethiopia",
    lat: 9.0192,
    lng: 38.7525,
    population: "~5.5M",
    description: "Africa's diplomatic capital undergoing massive infrastructure expansion",
  },
  {
    id: "ho-chi-minh-vietnam",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    lat: 10.8231,
    lng: 106.6297,
    population: "~9M",
    description: "Southeast Asia's economic engine with flooding and transit challenges",
  },
  {
    id: "accra-ghana",
    name: "Accra",
    country: "Ghana",
    lat: 5.6037,
    lng: -0.187,
    population: "~4.4M",
    description: "West African growth hub with energy and sanitation infrastructure needs",
  },
  {
    id: "manila-philippines",
    name: "Manila",
    country: "Philippines",
    lat: 14.5995,
    lng: 120.9842,
    population: "~14M",
    description: "Island megacity facing typhoons, flooding, and transit congestion",
  },
];

export const INFRASTRUCTURE_SECTORS = [
  { id: "energy", label: "Energy & Power", icon: "Zap", color: "#D4A574" },
  { id: "transport", label: "Transportation", icon: "Train", color: "#5B8A3C" },
  { id: "water", label: "Water & Sanitation", icon: "Droplets", color: "#3D7A9E" },
  { id: "telecom", label: "Digital & Telecom", icon: "Wifi", color: "#C9956B" },
  { id: "health", label: "Healthcare", icon: "Heart", color: "#C45D4A" },
  { id: "education", label: "Education", icon: "GraduationCap", color: "#8B9D83" },
] as const;
