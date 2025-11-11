"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";

// Base URLs
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const OAUTH_URL = process.env.NEXT_PUBLIC_OAUTH_URL || "http://localhost:8080/oauth2/authorization";

// Helper function to get token
const getToken = () => localStorage.getItem("token") || "";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = getToken();
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const res = await fetch(`${API_URL}/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const parsedUser = JSON.parse(userData);
            redirectByRole(parsedUser.role);
            return;
          } else {
            localStorage.clear();
          }
        } catch {
          localStorage.clear();
        }
      }
      setCheckingAuth(false);
    };

    checkSession();
  }, []);

  const redirectByRole = (role: string) => {
    const r = role?.toLowerCase();
    if (r === "admin") router.push("/dashboard/admin");
    else if (r === "recruiter") router.push("/dashboard/recruiter");
    else router.push("/dashboard/user");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill in all fields.");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        alert(errData?.message || "Invalid credentials");
        return;
      }

      const data = await response.json();
      if (!data?.data?.token || !data?.data?.user) {
        alert("Invalid response from server.");
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("role", data.data.user.role);

      redirectByRole(data.data.user.role);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check your backend URL or network.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `${OAUTH_URL}/${provider}`;
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-600 text-lg animate-pulse">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Section (Login Form) */}
      <div className="flex w-full lg:w-1/2 justify-center items-center p-8">
        <Card className="w-full max-w-md shadow border border-gray-200 rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-black">
              Login to your account
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Continue with your credentials or social account
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-black">Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-black">Password</Label>
                  <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">
                    Forgot password?
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                 
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-2.5"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-3 text-sm text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 text-black"
                  onClick={() => handleSocialLogin("google")}
                >
                  <FaGoogle className="text-black text-lg" /> Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 text-black"
                  onClick={() => handleSocialLogin("github")}
                >
                  <FaGithub className="text-black text-lg" /> Continue with GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push("/auth/signup")}
                  className="text-black hover:underline p-0"
                >
                  Sign up
                </Button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Section (Image & Glow) */}
      <div className="relative hidden lg:flex w-1/2 items-center justify-center overflow-hidden">
        <img
          src="/1__k6mS5p92Oanaw7EIdcaow.png"
          alt="AI Interview Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 brightness-90"
        />
        <div className="absolute top-20 left-20 w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
