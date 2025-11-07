"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = "http://localhost:8080/api/users/register";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (res.ok) {
        // ✅ Only show success message (no auto login or role assignment)
        setMessage("✅ Signup successful! You can now log in.");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else if (res.status === 409) {
        setMessage("⚠️ Email already registered.");
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.message || "❌ Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-y-auto">
      {/* Left Section - Form */}
      <div className="flex flex-1 items-center justify-center py-10 px-6 sm:px-12 lg:px-16">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Create your account
            </CardTitle>
            <p className="text-sm text-gray-500">Fill in your details below</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>

              {/* Message */}
              {message && (
                <p
                  className={`text-center text-sm ${
                    message.startsWith("✅")
                      ? "text-green-600"
                      : message.startsWith("⚠️")
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-semibold py-2.5"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Manual Login Redirect */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                  >
                    Login here
                  </button>
                </p>
              </div>
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
