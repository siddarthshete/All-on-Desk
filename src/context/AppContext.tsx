
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BudgetDocument, City, Domain, Query, User } from "@/types";
import { mockBudgetDocuments, mockCities, mockDomains, mockQueries, mockUsers } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AppContextProps {
  user: User | null;
  cities: City[];
  domains: Domain[];
  budgetDocuments: BudgetDocument[];
  queries: Query[];
  selectedCity: City | null;
  selectedDomain: Domain | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSelectedCity: (city: City | null) => void;
  setSelectedDomain: (domain: Domain | null) => void;
  createQuery: (query: Omit<Query, "id" | "userId" | "createdAt" | "status">) => void;
  addBudgetDocument: (document: Omit<BudgetDocument, "id" | "createdAt" | "updatedAt">) => void;
  updateBudgetDocument: (id: string, document: Partial<BudgetDocument>) => void;
  deleteBudgetDocument: (id: string) => void;
  respondToQuery: (id: string, response: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cities, setCities] = useState<City[]>(mockCities);
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [budgetDocuments, setBudgetDocuments] = useState<BudgetDocument[]>(mockBudgetDocuments);
  const [queries, setQueries] = useState<Query[]>(mockQueries);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const { toast } = useToast();

  // Check localStorage for user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to a backend service
    // For demo, we'll use mock data
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === "password") {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. For demo, use admin@allondesk.gov/password or user@example.com/password",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const createQuery = (query: Omit<Query, "id" | "userId" | "createdAt" | "status">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a query.",
        variant: "destructive",
      });
      return;
    }

    const newQuery: Query = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: "pending",
      ...query,
    };

    setQueries(prev => [...prev, newQuery]);
    toast({
      title: "Query Submitted",
      description: "Your query has been submitted successfully.",
    });
  };

  const addBudgetDocument = (document: Omit<BudgetDocument, "id" | "createdAt" | "updatedAt">) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can add budget documents.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const newDocument: BudgetDocument = {
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      ...document,
    };

    setBudgetDocuments(prev => [...prev, newDocument]);
    toast({
      title: "Document Added",
      description: "The budget document has been added successfully.",
    });
  };

  const updateBudgetDocument = (id: string, document: Partial<BudgetDocument>) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can update budget documents.",
        variant: "destructive",
      });
      return;
    }

    setBudgetDocuments(prev => 
      prev.map(doc => 
        doc.id === id 
          ? { ...doc, ...document, updatedAt: new Date().toISOString() } 
          : doc
      )
    );
    toast({
      title: "Document Updated",
      description: "The budget document has been updated successfully.",
    });
  };

  const deleteBudgetDocument = (id: string) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can delete budget documents.",
        variant: "destructive",
      });
      return;
    }

    setBudgetDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document Deleted",
      description: "The budget document has been deleted successfully.",
    });
  };

  const respondToQuery = (id: string, response: string) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can respond to queries.",
        variant: "destructive",
      });
      return;
    }

    setQueries(prev => 
      prev.map(query => 
        query.id === id 
          ? { ...query, response, status: "resolved" } 
          : query
      )
    );
    toast({
      title: "Response Submitted",
      description: "Your response has been submitted successfully.",
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cities,
        domains,
        budgetDocuments,
        queries,
        selectedCity,
        selectedDomain,
        login,
        logout,
        setSelectedCity,
        setSelectedDomain,
        createQuery,
        addBudgetDocument,
        updateBudgetDocument,
        deleteBudgetDocument,
        respondToQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
