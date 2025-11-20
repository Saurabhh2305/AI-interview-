
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("Authorizing your account...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");

    // 🚫 No code → redirect to login
    if (!code) {
      setStatus("⚠️ Authorization code missing. Redirecting...");
      const timer = setTimeout(() => router.push("/auth/login"), 2000);
      return () => clearTimeout(timer);
    }

    const processLogin = async () => {
      try {
        setStatus("🔁 Contacting server...");

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
          }/api/auth/exchange`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        if (!res.ok) throw new Error("Failed to exchange OAuth code");

        const data = await res.json();
        const { token, user, password_required } = data?.data || {};

        if (!token || !user) throw new Error("Invalid token or user data");

        // 🔍 Check if password is required
        if (password_required === true) {
          setStatus("🔐 Password required. Redirecting...");
          localStorage.setItem("temp_oauth_token", token); // store temporary token
          setTimeout(() => router.replace("/auth/set-password"), 1200);
          return;
        }

        setStatus("🔍 Processing account...");

        // 🧠 Normalize user object
        const normalizedUser = {
          id: user.id ?? "",
          name: user.fullName ?? user.name ?? user.displayName ?? "User",
          email: user.email ?? "",
          role: (user.role?.role || user.role || "USER").toUpperCase(),
          verified: user.verified ?? false,
          photo: user.photo ?? user.picture ?? null,
          resume: user.resume ?? null,
        };

        // 💾 Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("role", normalizedUser.role);

        // 🔔 Notify other components/tabs
        window.dispatchEvent(new Event("storage"));

        setStatus("✅ Login successful! Redirecting...");
        setLoading(false);

        // 🧭 Redirect based on role
        setTimeout(() => {
          if (normalizedUser.role === "ADMIN")
            router.replace("/dashboard/admin");
          else if (normalizedUser.role === "RECRUITER")
            router.replace("/dashboard/recruiter");
          else router.replace("/dashboard/user");
        }, 1200);
      } catch (err) {
        console.error("❌ OAuth error:", err);
        setStatus("❌ Login failed. Redirecting...");
        setLoading(false);

        setTimeout(() => router.push("/auth/login"), 2000);
      }
    };

    processLogin();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="bg-white shadow-xl rounded-xl p-10 text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Authenticating...
        </h1>

        <p
          className={`transition-all duration-500 ${
            status.includes("✅")
              ? "text-green-600"
              : status.includes("❌")
              ? "text-red-600"
              : status.includes("⚠️")
              ? "text-yellow-600"
              : "text-gray-600"
          }`}
        >
          {status}
        </p>

        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
