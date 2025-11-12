"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const OAUTH_URL = process.env.NEXT_PUBLIC_OAUTH_URL || "http://localhost:8080/oauth2/authorization";

// Helper to get token
const getToken = () => localStorage.getItem("token") || "";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🔹 Check session on load
  useEffect(() => {
    const token = getToken();
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const user = JSON.parse(userData);
      redirectByRole(user);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // 🔹 Redirect based on role and profile completeness
const redirectByRole = (user: any) => {
  const role = user.role?.toLowerCase();

  if (role === "admin") return router.push("/dashboard/admin");
  if (role === "recruiter") return router.push("/dashboard/recruiter");

  // ✅ Always redirect user directly to dashboard (no checks)
  router.push("/dashboard/user");
};



  // 🔹 Minimal user storage helper
  const storeMinimalUser = (user: any, token: string) => {
    const minimalUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
     
    };
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(minimalUser));
      localStorage.setItem("role", user.role);
    } catch (err) {
      console.warn("Storage quota exceeded, storing minimal user only:", err);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role,
       
      }));
    }
  };

  // 🔹 Handle email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill in all fields.");

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert(err?.message || "Invalid credentials");
      }

      const data = await res.json();
      const user = data?.data?.user;
      const token = data?.data?.token;

      if (!user || !token) return alert("Invalid server response.");

      storeMinimalUser(user, token);
      redirectByRole(user);
    } catch (err) {
      console.error(err);
      alert("Login failed. Check backend or network.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle social login
  const handleSocialLogin = (provider: string) => {
    window.location.href = `${OAUTH_URL}/${provider}?redirect_uri=http://localhost:3000/auth/login`;
  };

  // 🔹 Handle OAuth redirect with token & user
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        storeMinimalUser(user, token);
        redirectByRole(user);
      } catch (err) {
        console.error("Failed to parse OAuth user:", err);
      }
    }
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-600 text-lg animate-pulse">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="flex w-full lg:w-1/2 justify-center items-center p-8">
        <Card className="w-full max-w-md shadow border border-gray-200 rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-black">
              Login to your account
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Use your credentials or social account
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-black">Email</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label className="text-black">Password</Label>
                <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-2.5" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-3 text-sm text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              <div className="flex flex-col gap-2">
                <Button type="button" variant="outline" className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 text-black" onClick={() => handleSocialLogin("google")}>
                  <FaGoogle className="text-black text-lg" /> Continue with Google
                </Button>
                <Button type="button" variant="outline" className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 text-black" onClick={() => handleSocialLogin("github")}>
                  <FaGithub className="text-black text-lg" /> Continue with GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <Button type="button" variant="link" onClick={() => router.push("/auth/signup")} className="text-black hover:underline p-0">
                  Sign up
                </Button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="relative hidden lg:flex w-1/2 items-center justify-center overflow-hidden">
        <img src="/1__k6mS5p92Oanaw7EIdcaow.png" alt="Background" className="absolute inset-0 w-full h-full object-cover scale-105 brightness-90" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
