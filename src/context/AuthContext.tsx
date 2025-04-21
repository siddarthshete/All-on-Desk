
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string | null;
  dob: string | null;
  contact: string | null;
  location: string | null;
  avatar_url: string | null;
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    dob: string;
    contact: string;
    location: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile if user exists
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (data) setProfile(data);
          else setProfile(null);
        });
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
    if (!data.session || !data.user) throw new Error("User not found");
    // Fetch profile after login
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    setProfile(profileData || null);
  };

  // Signup method to create both auth + profile data
  const signup = async ({
    name,
    dob,
    contact,
    location,
    email,
    password,
  }: {
    name: string;
    dob: string;
    contact: string;
    location: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    // Step 1: Create user
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signupError) {
      setLoading(false);
      throw signupError;
    }
    if (!signupData.user) {
      setLoading(false);
      throw new Error("Could not create account");
    }
    // Step 2: Upsert profile
    const { error: profileError } = await supabase.from("profiles").upsert([
      {
        id: signupData.user.id,
        name,
        dob,
        contact,
        location,
        updated_at: new Date().toISOString(),
      },
    ]);
    setLoading(false);
    if (profileError) throw profileError;
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
