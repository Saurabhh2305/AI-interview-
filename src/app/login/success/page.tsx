// 
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
    if (!code) {
      setMessage("No authorization code found. Redirecting...");
      const timer = setTimeout(() => router.push("/auth/login"), 1500);
      return () => clearTimeout(timer);
    }

    const handleOAuthLogin = async () => {
      try {
        // Step 1: Exchange OAuth code for token
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

        if (!token || !user) throw new Error("Invalid login response");

        // Step 2: Extract role safely
        const role = user?.role?.role || user?.role || "USER";

        // 🟢 Step 3: Save token & user info in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", role.toUpperCase());
          localStorage.setItem("recruiterId", user?.id || "");

          // 👉 Store name separately for sidebar
          const userName = user?.name || user?.fullName || user?.displayName || "User";
          localStorage.setItem("userName", userName);
        }

        setMessage("✅ Login successful! Redirecting...");
        setLoading(false);

        // Step 4: Redirect based on role
        const timer = setTimeout(() => {
          const userRole = role.toLowerCase();
          if (userRole === "admin") router.push("/dashboard/admin");
          else if (userRole === "recruiter") router.push("/dashboard/recruiter");
          else router.push("/dashboard/user");
        }, 1500);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error("❌ OAuth Login Error:", err);
        setMessage("❌ Login failed. Redirecting to login...");
        setLoading(false);
        const timer = setTimeout(() => router.push("/auth/login"), 2000);
        return () => clearTimeout(timer);
      }
    };

    handleOAuthLogin();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full transition-all duration-300">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Please Wait...</h1>
        <p
          className={`text-gray-600 ${
            message.includes("✅")
              ? "text-green-600 font-medium"
              : message.includes("❌")
              ? "text-red-600 font-medium"
              : ""
          }`}
        >
          {message}
        </p>

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
