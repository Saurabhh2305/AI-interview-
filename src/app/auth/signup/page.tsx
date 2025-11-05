"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEMO_BACKEND_URL = "https://jsonplaceholder.typicode.com/posts";
// 🔜 Replace with your real backend later (e.g. http://localhost:8080/api/auth/signup)

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Password match validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match! Please check again.");
      return;
    }

    setLoading(true);

    try {
      // 🧠 Prepare clean data (remove confirmPassword before sending)
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        role: formData.role,
      };

      console.log("🧠 Sending signup data to backend:", payload);

      const response = await fetch(DEMO_BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("✅ Demo backend response:", data);

      setResponseData(data);
      alert("Signup successful (demo mode). Check console for backend data!");
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            Create Your Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label>Create Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
                placeholder="Re-enter your password"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <Label>Mobile Number</Label>
              <Input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
              />
            </div>

            {/* Role */}
            <div>
              <Label>Select Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-black text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => router.push("/auth/login")}
              >
                Log In
              </span>
            </p>
          </form>

          {/* Demo backend response preview */}
          {responseData && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
              <p className="font-semibold mb-1">📦 Demo Backend Response:</p>
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
