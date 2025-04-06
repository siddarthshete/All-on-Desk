
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
  { id: "1", name: "New York", state: "NY" },
  { id: "2", name: "Los Angeles", state: "CA" },
  { id: "3", name: "Chicago", state: "IL" },
  { id: "4", name: "Houston", state: "TX" },
  { id: "5", name: "Phoenix", state: "AZ" }
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
  {
    id: "1",
    title: "Infrastructure Development Q1 2025",
    description: "Budget allocation for road repairs and bridge maintenance",
    cityId: "1",
    domainId: "1",
    year: 2025,
    quarter: "Q1",
    amount: 5000000,
    documentUrl: "/documents/infra-q1-2025.pdf",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z"
  },
  {
    id: "2",
    title: "Education Funding Q1 2025",
    description: "Budget for public school system and teacher salaries",
    cityId: "1",
    domainId: "2",
    year: 2025,
    quarter: "Q1",
    amount: 7500000,
    documentUrl: "/documents/edu-q1-2025.pdf",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z"
  },
  {
    id: "3",
    title: "Healthcare Initiatives Q1 2025",
    description: "Budget for city hospitals and healthcare programs",
    cityId: "1",
    domainId: "3",
    year: 2025,
    quarter: "Q1",
    amount: 10000000,
    documentUrl: "/documents/health-q1-2025.pdf",
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-12T00:00:00Z"
  },
  {
    id: "4",
    title: "Infrastructure Development Q1 2025",
    description: "Budget for highway construction and public transit",
    cityId: "2",
    domainId: "1",
    year: 2025,
    quarter: "Q1",
    amount: 12000000,
    documentUrl: "/documents/la-infra-q1-2025.pdf",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z"
  },
  {
    id: "5",
    title: "Education Funding Q1 2025",
    description: "Budget for community colleges and educational programs",
    cityId: "2",
    domainId: "2",
    year: 2025,
    quarter: "Q1",
    amount: 8000000,
    documentUrl: "/documents/la-edu-q1-2025.pdf",
    createdAt: "2025-01-08T00:00:00Z",
    updatedAt: "2025-01-18T00:00:00Z"
  }
];

export const mockQueries: Query[] = [
  {
    id: "1",
    title: "Clarification on bridge maintenance costs",
    description: "The budget seems higher than previous quarters. Can you explain the increase?",
    budgetDocumentId: "1",
    userId: "2",
    status: "pending",
    createdAt: "2025-01-20T00:00:00Z"
  },
  {
    id: "2",
    title: "Teacher salary allocation",
    description: "What percentage of the education budget is allocated to teacher salaries?",
    budgetDocumentId: "2",
    userId: "2",
    status: "resolved",
    createdAt: "2025-01-22T00:00:00Z",
    response: "Approximately 65% of the education budget is allocated to teacher salaries and benefits."
  }
];
