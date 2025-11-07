"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";

// 🌐 Backend URLs
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/users";
const OAUTH_URL = "http://localhost:8080/oauth2/authorization";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🧭 Check existing session
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userData && token) {
      try {
        fetch(`${BACKEND_URL}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (res.ok) {
              const parsed = JSON.parse(userData);
              redirectByRole(parsed.role);
            } else {
              localStorage.clear();
            }
          })
          .finally(() => setCheckingAuth(false));
      } catch {
        localStorage.clear();
        setCheckingAuth(false);
      }
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // 🔁 Redirect user based on role
  const redirectByRole = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "recruiter":
        router.push("/dashboard/recruiter");
        break;
      default:
        router.push("/dashboard/user");
        break;
    }
  };

  // 🧩 Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill in all fields.");

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok || !data?.data) {
        alert(data?.message || "Invalid credentials.");
        return;
      }

      const userData = data.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token || "");

      alert(`✅ Logged in as ${userData.role}`);
      redirectByRole(userData.role);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 OAuth Login (Backend decides role)
  const handleSocialLogin = (provider: string) => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${OAUTH_URL}/${provider}`;
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-lg animate-pulse">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Section (Login Form) */}
      <div className="flex w-full lg:w-1/2 justify-center items-center p-8 bg-white">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200 rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-800">
              Login to your account
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Continue with your credentials or social account
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center">
                  <Label>Password</Label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-3 text-sm text-gray-500">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Social Logins */}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100"
                  onClick={() => handleSocialLogin("google")}
                >
                  <FaGoogle className="text-red-500 text-lg" /> Continue with
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100"
                  onClick={() => handleSocialLogin("github")}
                >
                  <FaGithub className="text-gray-800 text-lg" /> Continue with
                  GitHub
                </Button>
              </div>

              {/* Signup Redirect */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push("/auth/signup")}
                  className="text-blue-600 hover:text-blue-800 p-0"
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
          className="absolute inset-0 w-full h-full object-cover scale-105 brightness-100"
        />
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
