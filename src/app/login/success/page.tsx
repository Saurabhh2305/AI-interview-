"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingMessage, setLoadingMessage] = useState("Authorizing your account...");

  useEffect(() => {
    const code = searchParams.get("code"); // 🔹 OAuth code from URL
    if (!code) return;

    // Step 1️⃣ — Send code to backend to exchange for token
    fetch("http://localhost:8080/api/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Code exchange failed");
        return await res.json();
      })
      .then((data) => {
        // Step 2️⃣ — Save token and role in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        setLoadingMessage("Login successful! Redirecting to your dashboard...");

        // Step 3️⃣ — Redirect user based on role
        const role = data.role?.toLowerCase();
console.log("User role:", role);
 setTimeout(() => {
  console.log("completed wait");
}, 2 * 60 * 1000);
// Wait 100000088 milliseconds (if that's what you meant)
setTimeout(() => {
  if (role === "admin") router.push("/dashboard/admin");
  else if (role === "recruiter") router.push("/dashboard/recruiter");
  else router.push("/dashboard/user");
}, 10008); // <-- this is milliseconds, ~27.7 hours

      })
      .catch((err) => {
        console.error("Exchange error:", err);
        setLoadingMessage("Login failed. Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 1200);
      });
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Please Wait...</h1>
        <p className="text-gray-600 animate-pulse">{loadingMessage}</p>

        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
