"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaGoogle, FaGithub } from "react-icons/fa";

// 🔗 Backend base URL
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();

  // 🔒 State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      alert("Please select your role first.");
      return;
    }

    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid credentials.");
      }

      const data = await response.json();

      // Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || role);

      // ✅ Redirect based on actual role from backend
      redirectByRole(data.role || role);
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Social Login (Google / GitHub)
  const handleSocialLogin = (provider: string) => {
    if (!role) {
      alert("Please select your role before continuing.");
      return;
    }

    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}?role=${encodeURIComponent(
      role
    )}`;
  };

  // ✅ Handle OAuth success (token in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Fetch user info from token
      fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          if (user?.role) {
            localStorage.setItem("role", user.role);
            redirectByRole(user.role);
          } else {
            const savedRole = localStorage.getItem("role") || "user";
            redirectByRole(savedRole);
          }
        })
        .catch(() => {
          const savedRole = localStorage.getItem("role") || "user";
          redirectByRole(savedRole);
        });
    }
  }, []);

  // 🚀 Helper Function: Redirect User by Role
  const redirectByRole = (userRole: string) => {
    const role = userRole.toLowerCase();

    if (role === "admin") {
      // 👑 Admin can see all dashboards (redirect to an admin panel or overview)
      router.push("/dashboard/admin");
    } else if (role === "recruiter") {
      router.push("/dashboard/recruiter");
    } else {
      router.push("/dashboard/user");
    }
  };

  // 🧠 Helper Function: Role-based Dashboard Access Check
  // 👉 You’ll use this in dashboards later
  const canAccessDashboard = (requiredRole: string) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // if no token, force login
    if (!token) {
      router.push("/auth/login");
      return false;
    }

    // Admin can access everything
    if (role === "admin") return true;

    // Otherwise, only same-role users allowed
    return role === requiredRole;
  };

  // 💎 UI Rendering
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Login to Your Account
          </CardTitle>
        </CardHeader>

        <CardContent>
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
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Role */}
            <div>
              <Label>Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Signup Redirect */}
            <Button
              type="button"
              variant="link"
              onClick={() => router.push("/auth/signup")}
              className="w-full"
            >
              Don’t have an account? Sign Up
            </Button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-3 text-sm text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col space-y-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("google")}
              >
                <FaGoogle className="text-red-500" /> Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("github")}
              >
                <FaGithub className="text-gray-800" /> Continue with GitHub
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
