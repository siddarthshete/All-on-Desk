
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
  hasAccessToCity: (cityId: string) => boolean;
  accessibleCities: City[];
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

  // Calculate accessible cities based on user permissions
  const accessibleCities = React.useMemo(() => {
    if (!user) return [];
    
    // Regular users can see all cities
    if (user.role !== "admin") return cities;
    
    // Global admin can see all cities
    if (!user.assignedCityIds || user.assignedCityIds.length === 0) return cities;
    
    // City-specific admin can only see assigned cities
    return cities.filter(city => user.assignedCityIds?.includes(city.id));
  }, [user, cities]);

  // Check if user has access to a specific city
  const hasAccessToCity = (cityId: string): boolean => {
    if (!user) return false;
    
    // Regular users can access all cities
    if (user.role !== "admin") return true;
    
    // Global admin can access all cities
    if (!user.assignedCityIds || user.assignedCityIds.length === 0) return true;
    
    // City-specific admin can only access assigned cities
    return user.assignedCityIds.includes(cityId);
  };

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

    // Check if admin has access to the city
    if (!hasAccessToCity(document.cityId)) {
      toast({
        title: "Access Denied",
        description: "You don't have access to add documents for this city.",
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

    // Get the existing document to check its city
    const existingDoc = budgetDocuments.find(doc => doc.id === id);
    if (!existingDoc) {
      toast({
        title: "Document Not Found",
        description: "The budget document you're trying to update doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    // Check if admin has access to the city of the existing document
    if (!hasAccessToCity(existingDoc.cityId)) {
      toast({
        title: "Access Denied",
        description: "You don't have access to update documents for this city.",
        variant: "destructive",
      });
      return;
    }

    // If the city is being changed, check access to the new city as well
    if (document.cityId && document.cityId !== existingDoc.cityId && !hasAccessToCity(document.cityId)) {
      toast({
        title: "Access Denied",
        description: "You don't have access to move documents to this city.",
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

    // Get the document to check its city
    const document = budgetDocuments.find(doc => doc.id === id);
    if (!document) {
      toast({
        title: "Document Not Found",
        description: "The budget document you're trying to delete doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    // Check if admin has access to the city
    if (!hasAccessToCity(document.cityId)) {
      toast({
        title: "Access Denied",
        description: "You don't have access to delete documents for this city.",
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

    // Get the query and associated document
    const query = queries.find(q => q.id === id);
    if (!query) {
      toast({
        title: "Query Not Found",
        description: "The query you're trying to respond to doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    // Get the document related to the query
    const document = budgetDocuments.find(doc => doc.id === query.budgetDocumentId);
    if (!document) {
      toast({
        title: "Related Document Not Found",
        description: "The document related to this query doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    // Check if admin has access to the city of the document
    if (!hasAccessToCity(document.cityId)) {
      toast({
        title: "Access Denied",
        description: "You don't have access to respond to queries for this city.",
        variant: "destructive",
      });
      return;
    }

    setQueries(prev => 
      prev.map(q => 
        q.id === id 
          ? { ...q, response, status: "resolved" } 
          : q
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
        hasAccessToCity,
        accessibleCities,
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
