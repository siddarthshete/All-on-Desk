
import { BudgetDocument, City, Domain, Query, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@allondesk.gov",
    name: "Admin User",
    role: "admin"
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "user"
  }
];

export const mockCities: City[] = [
  { id: "1", name: "Mumbai", state: "MH" },
  { id: "2", name: "Pune", state: "MH" },
  { id: "3", name: "Nashik", state: "MH" },
  { id: "4", name: "Nagpur", state: "MH" },
  { id: "5", name: "Ahilyanagar", state: "MH" },
  { id: "6", name: "Ch.Sambhajinagar", state: "MH" }
];

export const mockDomains: Domain[] = [
  { 
    id: "1", 
    name: "Infrastructure", 
    description: "Roads, bridges, public transit, and other physical infrastructure",
    color: "#8B5CF6" // purple-500
  },
  { 
    id: "2", 
    name: "Education", 
    description: "Schools, universities, and educational programs",
    color: "#7C3AED" // purple-600
  },
  { 
    id: "3", 
    name: "Healthcare", 
    description: "Hospitals, clinics, and public health initiatives",
    color: "#6D28D9" // purple-700
  },
  { 
    id: "4", 
    name: "Public Safety", 
    description: "Police, fire departments, and emergency services",
    color: "#5B21B6" // purple-800
  },
  { 
    id: "5", 
    name: "Environment", 
    description: "Parks, conservation, and environmental protection",
    color: "#4C1D95" // purple-900
  }
];

export const mockBudgetDocuments: BudgetDocument[] = [
  // Mumbai Documents
  {
    id: "1",
    title: "Metro Line Extension Phase 1",
    description: "Budget allocation for extending Mumbai Metro Line from Andheri to Dahisar with new stations at Borivali and Kandivali",
    cityId: "1", // Mumbai
    domainId: "1", // Infrastructure
    year: 2025,
    quarter: "Q1",
    amount: 125000000,
    documentUrl: "/documents/infra-q1-2025.pdf",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z"
  },
  {
    id: "2",
    title: "Primary School Teacher Salary Revision",
    description: "Budget for implementing the 7th Pay Commission recommendations for 12,500 primary school teachers across Mumbai",
    cityId: "1", // Mumbai
    domainId: "2", // Education
    year: 2025,
    quarter: "Q1",
    amount: 75000000,
    documentUrl: "/documents/edu-q1-2025.pdf",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z"
  },
  {
    id: "3",
    title: "Municipal Hospital Modernization",
    description: "Budget for upgrading medical equipment and facilities in 5 municipal hospitals in Mumbai suburban area",
    cityId: "1", // Mumbai
    domainId: "3", // Healthcare
    year: 2025,
    quarter: "Q1",
    amount: 95000000,
    documentUrl: "/documents/health-q1-2025.pdf",
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-12T00:00:00Z"
  },
  {
    id: "4",
    title: "Coastal Police Station Enhancement",
    description: "Budget for upgrading coastal police stations with advanced surveillance equipment and patrol boats",
    cityId: "1", // Mumbai
    domainId: "4", // Public Safety
    year: 2025,
    quarter: "Q2",
    amount: 48000000,
    documentUrl: "/documents/safety-q2-2025.pdf",
    createdAt: "2025-04-02T00:00:00Z",
    updatedAt: "2025-04-15T00:00:00Z"
  },
  {
    id: "5",
    title: "Mangrove Conservation Project",
    description: "Budget for preserving and expanding mangrove forests along Mumbai coastline to prevent coastal erosion",
    cityId: "1", // Mumbai
    domainId: "5", // Environment
    year: 2025,
    quarter: "Q1",
    amount: 35000000,
    documentUrl: "/documents/env-q1-2025.pdf",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-25T00:00:00Z"
  },
  
  // Pune Documents
  {
    id: "6",
    title: "Ring Road Construction Phase 2",
    description: "Budget for constructing the eastern section of Pune Ring Road connecting Wagholi to Hadapsar",
    cityId: "2", // Pune
    domainId: "1", // Infrastructure
    year: 2025,
    quarter: "Q1",
    amount: 120000000,
    documentUrl: "/documents/pune-infra-q1-2025.pdf",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z"
  },
  {
    id: "7",
    title: "Digital Classroom Initiative",
    description: "Budget for installing smart boards and digital learning tools in 250 municipal schools across Pune",
    cityId: "2", // Pune
    domainId: "2", // Education
    year: 2025,
    quarter: "Q1",
    amount: 65000000,
    documentUrl: "/documents/pune-edu-q1-2025.pdf",
    createdAt: "2025-01-08T00:00:00Z",
    updatedAt: "2025-01-18T00:00:00Z"
  },
  {
    id: "8",
    title: "Infectious Disease Control Center",
    description: "Budget for establishing a specialized infectious disease control and research center at Sassoon Hospital",
    cityId: "2", // Pune
    domainId: "3", // Healthcare
    year: 2025,
    quarter: "Q2",
    amount: 85000000,
    documentUrl: "/documents/pune-health-q2-2025.pdf",
    createdAt: "2025-04-05T00:00:00Z",
    updatedAt: "2025-04-22T00:00:00Z"
  },
  
  // Nashik Documents
  {
    id: "9",
    title: "Godavari Riverfront Development",
    description: "Budget for beautification and flood control measures along the Godavari riverfront in Nashik",
    cityId: "3", // Nashik
    domainId: "1", // Infrastructure
    year: 2025,
    quarter: "Q1",
    amount: 76000000,
    documentUrl: "/documents/nashik-infra-q1-2025.pdf",
    createdAt: "2025-01-03T00:00:00Z",
    updatedAt: "2025-01-25T00:00:00Z"
  },
  {
    id: "10",
    title: "Vocational Training Centers",
    description: "Budget for establishing 3 new vocational training centers for viticulture and food processing industries",
    cityId: "3", // Nashik
    domainId: "2", // Education
    year: 2025,
    quarter: "Q2",
    amount: 42000000,
    documentUrl: "/documents/nashik-edu-q2-2025.pdf",
    createdAt: "2025-04-10T00:00:00Z",
    updatedAt: "2025-04-30T00:00:00Z"
  },
  
  // Nagpur Documents
  {
    id: "11",
    title: "Urban Transport Modernization",
    description: "Budget for introducing electric buses and upgrading public transport infrastructure in Nagpur",
    cityId: "4", // Nagpur
    domainId: "1", // Infrastructure
    year: 2025,
    quarter: "Q1",
    amount: 92000000,
    documentUrl: "/documents/nagpur-infra-q1-2025.pdf",
    createdAt: "2025-01-08T00:00:00Z",
    updatedAt: "2025-01-28T00:00:00Z"
  },
  {
    id: "12",
    title: "Wildlife Conservation & Eco-Tourism",
    description: "Budget for conservation projects in surrounding tiger reserves and developing eco-tourism facilities",
    cityId: "4", // Nagpur
    domainId: "5", // Environment
    year: 2025,
    quarter: "Q2",
    amount: 55000000,
    documentUrl: "/documents/nagpur-env-q2-2025.pdf",
    createdAt: "2025-04-15T00:00:00Z",
    updatedAt: "2025-04-28T00:00:00Z"
  },
  
  // Ahilyanagar Documents
  {
    id: "13",
    title: "Heritage Conservation Project",
    description: "Budget for preserving and restoring historical monuments and heritage sites in Ahilyanagar",
    cityId: "5", // Ahilyanagar
    domainId: "1", // Infrastructure
    year: 2025,
    quarter: "Q1",
    amount: 58000000,
    documentUrl: "/documents/ahilyanagar-infra-q1-2025.pdf",
    createdAt: "2025-01-12T00:00:00Z",
    updatedAt: "2025-01-30T00:00:00Z"
  },
  {
    id: "14",
    title: "Women's Healthcare Initiative",
    description: "Budget for specialized healthcare facilities and awareness programs for women's health issues",
    cityId: "5", // Ahilyanagar
    domainId: "3", // Healthcare
    year: 2025,
    quarter: "Q2",
    amount: 38000000,
    documentUrl: "/documents/ahilyanagar-health-q2-2025.pdf",
    createdAt: "2025-04-05T00:00:00Z",
    updatedAt: "2025-04-22T00:00:00Z"
  },
  
  // Ch.Sambhajinagar Documents
  {
    id: "15",
    title: "Water Supply Enhancement Project",
    description: "Budget for upgrading water treatment plants and distribution network in Ch.Sambhajinagar",
    cityId: "6", // Ch.Sambhajinagar
    domainId: "1", // Infrastructure
    year: 2025,
    quarter: "Q1",
    amount: 83000000,
    documentUrl: "/documents/sambhajinagar-infra-q1-2025.pdf",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-29T00:00:00Z"
  },
  {
    id: "16",
    title: "Emergency Response System Upgrade",
    description: "Budget for implementing an integrated emergency response system with GPS-enabled ambulances and fire engines",
    cityId: "6", // Ch.Sambhajinagar
    domainId: "4", // Public Safety
    year: 2025,
    quarter: "Q2",
    amount: 45000000,
    documentUrl: "/documents/sambhajinagar-safety-q2-2025.pdf",
    createdAt: "2025-04-10T00:00:00Z",
    updatedAt: "2025-04-25T00:00:00Z"
  }
];

export const mockQueries: Query[] = [
  {
    id: "1",
    title: "Clarification on Metro Line station locations",
    description: "The budget mentions new stations at Borivali and Kandivali, but are there intermediate stations planned as well?",
    budgetDocumentId: "1",
    userId: "2",
    status: "pending",
    createdAt: "2025-01-20T00:00:00Z"
  },
  {
    id: "2",
    title: "Teacher salary breakdown request",
    description: "What is the average salary increase per teacher after implementation of the 7th Pay Commission?",
    budgetDocumentId: "2",
    userId: "2",
    status: "resolved",
    createdAt: "2025-01-22T00:00:00Z",
    response: "The average salary increase per teacher after implementation of the 7th Pay Commission will be approximately ₹12,500 per month, which represents a 24% increase from current levels."
  },
  {
    id: "3",
    title: "Mangrove project timeline",
    description: "Is there a specific timeline for the mangrove conservation project? When will the first phase begin?",
    budgetDocumentId: "5",
    userId: "2",
    status: "resolved",
    createdAt: "2025-01-25T00:00:00Z",
    response: "The mangrove conservation project will commence in February 2025 with the initial assessment phase. Planting activities will begin in March 2025 and continue through the monsoon season for optimal growth conditions."
  },
  {
    id: "4",
    title: "Query about electric buses",
    description: "How many electric buses will be purchased under the Urban Transport Modernization project in Nagpur?",
    budgetDocumentId: "11",
    userId: "2",
    status: "pending",
    createdAt: "2025-02-05T00:00:00Z"
  }
];
