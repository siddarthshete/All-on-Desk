
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // NEW for registration
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(email, password);
        navigate("/dashboard");
      } else {
        // Register user via signup
        await signup(email, password);
        // Get the latest session/user after successful signup
        const {
          data: { user: newUser },
        } = await supabase.auth.getUser();
        if (newUser) {
          // Insert profile with the user's name
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ name })
            .eq("id", newUser.id);
          if (profileError) {
            setError("Registered, but failed to save profile name.");
          } else {
            setMode("login");
            setError("Registration successful! Please log in.");
          }
        } else {
          setError("Registration successful, but user not found.");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">{mode === "login" ? "Log In" : "Register"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full bg-aod-purple-600 hover:bg-aod-purple-700" disabled={loading}>
              {loading ? (mode === "login" ? "Logging in..." : "Registering...") : (mode === "login" ? "Log In" : "Register")}
            </Button>
          </form>
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <span>
                Don't have an account?{" "}
                <button className="text-aod-purple-600 hover:underline" onClick={() => setMode("register")}>
                  Register
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button className="text-aod-purple-600 hover:underline" onClick={() => setMode("login")}>
                  Log in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;

