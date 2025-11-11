"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) return;

    // 🔁 Send code to backend for token exchange
    fetch("http://localhost:8080/api/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to exchange code");
        return await res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("role", data.data.user.role);

        // Redirect based on role
       // const role = data.role?.toLowerCase();
        const role = data.data.user.role?.toLowerCase();
console.log("Role:", role);
        console.log("jffj "+ data.data.user.role);
        console.log("jffj " + JSON.stringify(data));
        console.log("token "+data.data.token)
        setTimeout(() => {
  console.log("completed wait");
}, 2 * 60 * 1000);
        if (role === "admin") router.push("/dashboard/admin");
        else if (role === "recruiter") router.push("/dashboard/recruiter");
        else router.push("/dashboard/user");
      })
      .catch((err) => {
        console.error(err);
        router.push("/auth/login");
      });
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Logging you in...
        </h1>
        <p className="text-gray-500 animate-pulse">
          Please wait while we complete your authentication.
        </p>
        <div className="mt-6 w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
