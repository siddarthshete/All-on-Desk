
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerData, setRegisterData] = useState({
    name: "",
    dob: "",
    contact: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (err: any) {
      // If user not found, switch to register mode
      if (err?.message?.toLowerCase().includes("invalid login credentials")) {
        setMode("register");
        setRegisterData((prev) => ({
          ...prev,
          email: loginEmail,
        }));
        setError("User not found or wrong password. Please register.");
      } else {
        setError(err?.message || "Login failed");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (
      !registerData.name ||
      !registerData.dob ||
      !registerData.contact ||
      !registerData.location ||
      !registerData.email ||
      !registerData.password
    ) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await signup({
        name: registerData.name,
        dob: registerData.dob,
        contact: registerData.contact,
        location: registerData.location,
        email: registerData.email,
        password: registerData.password,
      });
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Login" : "Register"}
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}
        {mode === "login" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block mb-1 text-sm font-medium">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-sm text-center">
              No account?{" "}
              <button
                className="text-aod-purple-600 hover:underline"
                type="button"
                onClick={() => setMode("register")}
              >
                Register here
              </button>
            </p>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={handleRegister}>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerData.dob}
                onChange={(e) =>
                  setRegisterData((prev) => ({ ...prev, dob: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Contact
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerData.contact}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    contact: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Location
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerData.location}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <p className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <button
                className="text-aod-purple-600 hover:underline"
                type="button"
                onClick={() => setMode("login")}
              >
                Login here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
