"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Authorizing your account...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");

    // 🧩 No code → redirect to login
    if (!code) {
      setMessage("⚠️ No authorization code found. Redirecting...");
      const timer = setTimeout(() => router.push("/auth/login"), 2000);
      return () => clearTimeout(timer);
    }

    const handleOAuthLogin = async () => {
      try {
        // 🔹 Step 1: Exchange OAuth code for token
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/auth/exchange`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        if (!res.ok) throw new Error(`OAuth exchange failed with status ${res.status}`);

        const data = await res.json();
        const token = data?.data?.token;
        const user = data?.data?.user;

        if (!token || !user) throw new Error("Invalid login response from server");

        // 🔹 Step 2: Extract and normalize role
        const role = (user?.role?.role || user?.role || "USER").toUpperCase();

        // 🔹 Step 3: Store in localStorage
        if (typeof window !== "undefined") {
          const minimalUser = {
            id: user.id,
            name: user.name || user.fullName || user.displayName || "User",
            email: user.email,
            role,
            hasPhoto: !!user.photo,
            hasResume: !!user.resume,
          };

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(minimalUser));
          localStorage.setItem("role", role);
          localStorage.setItem("recruiterId", user.id || "");
          localStorage.setItem("userName", minimalUser.name);
        }

        setMessage("✅ Login successful! Redirecting...");
        setLoading(false);

        // 🔹 Step 4: Role-based redirect
       // 🔹 Step 4: Role-based redirect (Simplified)
const timer = setTimeout(() => {
  if (role === "ADMIN") router.replace("/dashboard/admin");
  else if (role === "RECRUITER") router.replace("/dashboard/recruiter");
  else router.replace("/dashboard/user");
}, 1500);


        return () => clearTimeout(timer);
      } catch (err: any) {
        console.error("❌ OAuth Login Error:", err);
        setMessage("❌ Login failed. Redirecting to login...");
        setLoading(false);
        const timer = setTimeout(() => router.push("/auth/login"), 2500);
        return () => clearTimeout(timer);
      }
    };

    handleOAuthLogin();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full transition-all duration-300">
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Please Wait...
        </h1>

        <p
          className={`text-gray-600 transition-all duration-300 ${
            message.includes("✅")
              ? "text-green-600 font-medium"
              : message.includes("❌")
              ? "text-red-600 font-medium"
              : message.includes("⚠️")
              ? "text-yellow-600 font-medium"
              : ""
          }`}
        >
          {message}
        </p>

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="relative w-10 h-10">
              <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute w-full h-full border-4 border-blue-300 border-b-transparent rounded-full animate-ping opacity-50" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
