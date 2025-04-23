
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BudgetDocument, City, Domain, Query, User } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Basic User from Supabase session (you can extend this as needed)
interface SimpleUser {
  id: string;
  email: string | null;
  name?: string | null;
  role?: "admin" | "user";
}

interface AppContextProps {
  user: SimpleUser | null;
  session: any;
  setUser: (user: SimpleUser | null) => void;
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
  createQuery: (query: Omit<Query, "id" | "userId" | "createdAt" | "status">) => Promise<void>;
  addBudgetDocument: (document: Omit<BudgetDocument, "id" | "createdAt" | "updatedAt">, file?: File) => Promise<void>;
  updateBudgetDocument: (id: string, document: Partial<BudgetDocument>, file?: File) => Promise<void>;
  deleteBudgetDocument: (id: string) => Promise<void>;
  respondToQuery: (id: string, response: string) => Promise<void>;
  refreshAll: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [budgetDocuments, setBudgetDocuments] = useState<BudgetDocument[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const { toast } = useToast();

  // Helper: Fetch all reference and content data
  const fetchAll = async () => {
    // Cities
    const { data: citiesData, error: citiesError } = await supabase
      .from("cities")
      .select("*");
    if (citiesError) {
      toast({ title: "Error loading cities", description: citiesError.message, variant: "destructive" });
    } else if (citiesData) {
      setCities(citiesData);
    }
    // Domains
    const { data: domainsData, error: domainsError } = await supabase
      .from("domains")
      .select("*");
    if (domainsError) {
      toast({ title: "Error loading domains", description: domainsError.message, variant: "destructive" });
    } else if (domainsData) {
      setDomains(domainsData);
    }
    // Budget documents
    const { data: budgetsData, error: budgetsError } = await supabase
      .from("budget_documents")
      .select("*");
    if (budgetsError) {
      toast({ title: "Error loading budget documents", description: budgetsError.message, variant: "destructive" });
    } else if (budgetsData) {
      setBudgetDocuments(
        budgetsData.map((b: any) => ({
          id: b.id,
          title: b.title,
          description: b.description,
          cityId: b.city_id,
          domainId: b.domain_id,
          year: b.year,
          quarter: b.quarter,
          amount: b.amount,
          documentUrl: b.document_url || "",
          createdAt: b.created_at,
          updatedAt: b.updated_at,
        }))
      );
    }
    // Queries
    const { data: queriesData, error: queriesError } = await supabase
      .from("queries")
      .select("*");
    if (queriesError) {
      toast({ title: "Error loading queries", description: queriesError.message, variant: "destructive" });
    } else if (queriesData) {
      setQueries(
        queriesData.map((q: any) => ({
          id: q.id,
          title: q.title,
          description: q.description,
          budgetDocumentId: q.budget_document_id,
          userId: q.user_id,
          status: (q.status as "pending" | "resolved" | "rejected") ?? "pending",
          createdAt: q.created_at,
          response: q.response ?? undefined,
        }))
      );
    }
  };

  // Helper for fetching just docs
  const refreshAll = () => {
    fetchAll();
  };

  // Auth session logic
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, sessionObj) => {
      setSession(sessionObj);
      if (sessionObj?.user) {
        setUser({
          id: sessionObj.user.id,
          email: sessionObj.user.email,
        });
      } else {
        setUser(null);
      }
    });
    // Initial session load
    supabase.auth.getSession().then(({ data: { session: sessionObj } }) => {
      setSession(sessionObj);
      if (sessionObj?.user) {
        setUser({
          id: sessionObj.user.id,
          email: sessionObj.user.email,
        });
      } else {
        setUser(null);
      }
    });
    fetchAll();
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Login with Supabase
  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      throw new Error("Login failed: " + error.message);
    }
    toast({ title: "Login Successful", description: `Welcome!` });
    setSession(data.session);
    setUser({
      id: data.user.id,
      email: data.user.email,
    });
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Add Query
  const createQuery = async (query: Omit<Query, "id" | "userId" | "createdAt" | "status">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a query.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.from("queries").insert({
      title: query.title,
      description: query.description,
      budget_document_id: query.budgetDocumentId,
      user_id: user.id,
      status: "pending",
    });
    if (error) {
      toast({ title: "Failed to submit query", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Query Submitted", description: "Your query has been submitted successfully." });
    fetchAll();
  };

  // Upload file helper
  const uploadFile = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("budgets").upload(fileName, file, {
      upsert: false,
    });
    if (error) {
      toast({ title: "File Upload Failed", description: error.message, variant: "destructive" });
      return null;
    }
    // File accessible via public URL
    return `https://gdzpwlcmfudewgowmzbm.supabase.co/storage/v1/object/public/budgets/${fileName}`;
  };

  // Add new budget document
  const addBudgetDocument = async (
    document: Omit<BudgetDocument, "id" | "createdAt" | "updatedAt">,
    file?: File
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login.",
        variant: "destructive",
      });
      return;
    }
    let uploadedUrl = document.documentUrl;
    if (file) {
      const maybeUrl = await uploadFile(file);
      if (!maybeUrl) return;
      uploadedUrl = maybeUrl;
    }
    const { error } = await supabase.from("budget_documents").insert({
      title: document.title,
      description: document.description,
      city_id: document.cityId,
      domain_id: document.domainId,
      year: document.year,
      quarter: document.quarter,
      amount: document.amount,
      document_url: uploadedUrl,
    });
    if (error) {
      toast({ title: "Failed to add budget document", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Document Added", description: "The budget document has been added successfully." });
    fetchAll();
  };

  // Edit budget document
  const updateBudgetDocument = async (
    id: string,
    document: Partial<BudgetDocument>,
    file?: File
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login.",
        variant: "destructive",
      });
      return;
    }
    let uploadedUrl = document.documentUrl;
    if (file) {
      const maybeUrl = await uploadFile(file);
      if (!maybeUrl) return;
      uploadedUrl = maybeUrl;
    }
    const fieldsToUpdate: any = {
      ...document,
      updated_at: new Date().toISOString(),
    };
    if (uploadedUrl !== undefined) fieldsToUpdate.document_url = uploadedUrl;
    if (fieldsToUpdate.cityId !== undefined) {
      fieldsToUpdate.city_id = fieldsToUpdate.cityId;
      delete fieldsToUpdate.cityId;
    }
    if (fieldsToUpdate.domainId !== undefined) {
      fieldsToUpdate.domain_id = fieldsToUpdate.domainId;
      delete fieldsToUpdate.domainId;
    }
    const { error } = await supabase
      .from("budget_documents")
      .update(fieldsToUpdate)
      .eq("id", id);
    if (error) {
      toast({ title: "Failed to update budget document", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Document Updated", description: "The budget document has been updated successfully." });
    fetchAll();
  };

  // Delete budget document
  const deleteBudgetDocument = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.from("budget_documents").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete budget document", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Document Deleted", description: "The budget document has been deleted successfully." });
    fetchAll();
  };

  // Respond to query (set response)
  const respondToQuery = async (id: string, response: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase
      .from("queries")
      .update({ response, status: "resolved" })
      .eq("id", id);
    if (error) {
      toast({ title: "Failed to respond to query", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Response Submitted", description: "Your response has been submitted successfully." });
    fetchAll();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        setUser,
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
        refreshAll,
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
