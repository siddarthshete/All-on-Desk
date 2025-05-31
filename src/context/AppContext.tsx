
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BudgetDocument, City, Domain, Query } from "@/types";
import { mockBudgetDocuments, mockCities, mockDomains, mockQueries } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "./AuthContext";

interface AppContextProps {
  cities: City[];
  domains: Domain[];
  budgetDocuments: BudgetDocument[];
  queries: Query[];
  selectedCity: City | null;
  selectedDomain: Domain | null;
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
  const { user, isAdmin, isAuthenticated } = useAuthContext();
  const [cities, setCities] = useState<City[]>(mockCities);
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [budgetDocuments, setBudgetDocuments] = useState<BudgetDocument[]>(mockBudgetDocuments);
  const [queries, setQueries] = useState<Query[]>(mockQueries);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const { toast } = useToast();

  const createQuery = (query: Omit<Query, "id" | "userId" | "createdAt" | "status">) => {
    if (!isAuthenticated || !user) {
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
    if (!isAdmin) {
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
    if (!isAdmin) {
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
    if (!isAdmin) {
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
    if (!isAdmin) {
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
        cities,
        domains,
        budgetDocuments,
        queries,
        selectedCity,
        selectedDomain,
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
