
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface City {
  id: string;
  name: string;
  state: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface BudgetDocument {
  id: string;
  title: string;
  description: string;
  cityId: string;
  domainId: string;
  year: number;
  quarter: string;
  amount: number;
  documentUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Query {
  id: string;
  title: string;
  description: string;
  budgetDocumentId: string;
  userId: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
  response?: string;
}

export interface SliderRefType {
  current: HTMLDivElement | null;
}
