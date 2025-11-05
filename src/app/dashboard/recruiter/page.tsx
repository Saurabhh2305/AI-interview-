"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function RecruiterDashboard() {
  const router = useRouter();
  const [recruiterName, setRecruiterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔍 Verify user & role access
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();

        // Allow only recruiter or admin
        if (data.role !== "recruiter" && data.role !== "admin") {
          alert("Access denied: Recruiter or Admin only.");
          router.push(`/dashboard/${data.role}`);
          return;
        }

        setRecruiterName(data.name || "Recruiter");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error verifying recruiter:", err);
        setError("Unable to load dashboard.");
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/auth/login");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 px-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border border-gray-200 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome, {recruiterName} 💼
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">Recruiter Dashboard</p>
        </CardHeader>

        <CardContent>
          <div className="bg-white shadow-inner rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Manage Job Postings
            </h3>
            <p className="text-gray-600 mb-3">
              Create, edit, and view your active job listings. Track applicants
              and connect with top talent.
            </p>

            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Candidate Connections
            </h3>
            <p className="text-gray-600">
              Review candidate profiles, shortlist applicants, and schedule
              interviews easily.
            </p>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full mt-2"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
