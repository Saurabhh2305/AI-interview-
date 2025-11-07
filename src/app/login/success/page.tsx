"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Authorizing your account...");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setMessage("No authorization code found. Redirecting...");
      setTimeout(() => router.push("/auth/login"), 1500);
      return;
    }

    const handleOAuthLogin = async () => {
      try {
        // 🔹 Step 1 — Send OAuth code to backend
        const res = await fetch("http://localhost:8080/api/auth/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) throw new Error("OAuth exchange failed");

        const data = await res.json();
        const { token, role, user } = data;

        // 🔹 Step 2 — Save login info locally
        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        if (role) localStorage.setItem("role", role);

        setMessage("✅ Login successful! Redirecting to your dashboard...");

        // 🔹 Step 3 — Redirect based on backend-assigned role
        setTimeout(() => {
          const userRole = role?.toLowerCase() || "user";
          if (userRole === "admin") router.push("/dashboard/admin");
          else if (userRole === "recruiter") router.push("/dashboard/recruiter");
          else router.push("/dashboard/user");
        }, 1500);
      } catch (error) {
        console.error("❌ OAuth Login Error:", error);
        setMessage("❌ Login failed. Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
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
            message.includes("✅") ? "text-green-600 font-medium" : ""
          }`}
        >
          {message}
        </p>

        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
