
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BudgetDocument, City, Domain, Query, User } from "@/types";
import { mockCities, mockDomains } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
  loading: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, profile, signIn, signOut, loading: authLoading } = useAuth();
  const [cities, setCities] = useState<City[]>(mockCities);
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [budgetDocuments, setBudgetDocuments] = useState<BudgetDocument[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Convert Supabase user to app user format
  const user: User | null = profile ? {
    id: profile.id,
    name: profile.name || profile.email || 'Unknown User',
    email: profile.email || '',
    role: profile.role
  } : null;

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (authUser && !authLoading) {
      loadBudgetDocuments();
      loadQueries();
      loadCitiesAndDomains();
    }
    setLoading(authLoading);
  }, [authUser, authLoading]);

  const loadBudgetDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading budget documents:', error);
        return;
      }

      const formattedDocs: BudgetDocument[] = data.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        amount: doc.amount,
        year: doc.year,
        quarter: doc.quarter,
        cityId: doc.city_id || '',
        domainId: doc.domain_id || '',
        documentUrl: doc.document_url || '',
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
      }));

      setBudgetDocuments(formattedDocs);
    } catch (error) {
      console.error('Error loading budget documents:', error);
    }
  };

  const loadQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading queries:', error);
        return;
      }

      const formattedQueries: Query[] = data.map(query => ({
        id: query.id,
        userId: query.user_id || '',
        budgetDocumentId: query.budget_document_id || '',
        title: query.title,
        description: query.description || '',
        response: query.response || '',
        status: query.status || 'pending',
        createdAt: query.created_at,
      }));

      setQueries(formattedQueries);
    } catch (error) {
      console.error('Error loading queries:', error);
    }
  };

  const loadCitiesAndDomains = async () => {
    try {
      const [citiesResult, domainsResult] = await Promise.all([
        supabase.from('cities').select('*'),
        supabase.from('domains').select('*')
      ]);

      if (citiesResult.data) {
        setCities(citiesResult.data);
      }
      if (domainsResult.data) {
        setDomains(domainsResult.data);
      }
    } catch (error) {
      console.error('Error loading cities and domains:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    signOut();
  };

  const createQuery = async (query: Omit<Query, "id" | "userId" | "createdAt" | "status">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a query.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('queries')
        .insert({
          user_id: user.id,
          budget_document_id: query.budgetDocumentId,
          title: query.title,
          description: query.description,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating query:', error);
        toast({
          title: "Error",
          description: "Failed to submit query. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Query Submitted",
        description: "Your query has been submitted successfully.",
      });

      // Reload queries
      loadQueries();
    } catch (error) {
      console.error('Error creating query:', error);
      toast({
        title: "Error",
        description: "Failed to submit query. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addBudgetDocument = async (document: Omit<BudgetDocument, "id" | "createdAt" | "updatedAt">) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can add budget documents.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('budget_documents')
        .insert({
          title: document.title,
          description: document.description,
          amount: document.amount,
          year: document.year,
          quarter: document.quarter,
          city_id: document.cityId,
          domain_id: document.domainId,
          document_url: document.documentUrl,
        });

      if (error) {
        console.error('Error adding document:', error);
        toast({
          title: "Error",
          description: "Failed to add document. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Document Added",
        description: "The budget document has been added successfully.",
      });

      // Reload documents
      loadBudgetDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: "Error",
        description: "Failed to add document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateBudgetDocument = async (id: string, document: Partial<BudgetDocument>) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can update budget documents.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData: any = {};
      if (document.title) updateData.title = document.title;
      if (document.description) updateData.description = document.description;
      if (document.amount) updateData.amount = document.amount;
      if (document.year) updateData.year = document.year;
      if (document.quarter) updateData.quarter = document.quarter;
      if (document.cityId) updateData.city_id = document.cityId;
      if (document.domainId) updateData.domain_id = document.domainId;
      if (document.documentUrl) updateData.document_url = document.documentUrl;

      const { error } = await supabase
        .from('budget_documents')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating document:', error);
        toast({
          title: "Error",
          description: "Failed to update document. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Document Updated",
        description: "The budget document has been updated successfully.",
      });

      // Reload documents
      loadBudgetDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteBudgetDocument = async (id: string) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can delete budget documents.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('budget_documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Error",
          description: "Failed to delete document. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Document Deleted",
        description: "The budget document has been deleted successfully.",
      });

      // Reload documents
      loadBudgetDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const respondToQuery = async (id: string, response: string) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only administrators can respond to queries.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('queries')
        .update({ response, status: 'resolved' })
        .eq('id', id);

      if (error) {
        console.error('Error responding to query:', error);
        toast({
          title: "Error",
          description: "Failed to submit response. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Response Submitted",
        description: "Your response has been submitted successfully.",
      });

      // Reload queries
      loadQueries();
    } catch (error) {
      console.error('Error responding to query:', error);
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    }
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
        loading,
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
