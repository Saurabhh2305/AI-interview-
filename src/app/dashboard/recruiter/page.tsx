
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  FileBarChart,
  Settings,
  LogOut,
  UserCheck,
  Plus,
  User,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RecruiterDashboard() {
  const router = useRouter();
  const [recruiterName, setRecruiterName] = useState("Recruiter");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [recruiterId, setRecruiterId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // ✅ Load recruiter info + photo persistently
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");
      const storedId = localStorage.getItem("recruiterId");

      setRecruiterId(storedId ? Number(storedId) : null);
      setRole(storedRole ? storedRole.toUpperCase() : null);

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setRecruiterName(parsed.name || "Recruiter");

        const recruiterKey = parsed.email || parsed.id || "defaultRecruiter";
        const storedPhoto = localStorage.getItem(`recruiterPhoto_${recruiterKey}`);

        // ✅ Persistent photo load
        if (storedPhoto) setPhoto(storedPhoto);
      }
    }
  }, []);

  // ✅ Logout (keeps photo stored)
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const recruiterKey = parsed.email || parsed.id || "defaultRecruiter";
        const savedPhoto = localStorage.getItem(`recruiterPhoto_${recruiterKey}`);

        localStorage.clear();
        if (savedPhoto) {
          localStorage.setItem(`recruiterPhoto_${recruiterKey}`, savedPhoto);
        }
      }
    }
    router.push("/auth/login");
  };

  // ✅ Go to jobs (fetch from backend)
  const handleGoToJobs = async () => {
    if (!recruiterId) {
      alert("⚠️ Recruiter ID not found!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/jobs/recruiter/${recruiterId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = response.data;
      sessionStorage.setItem("recruiterJobs", JSON.stringify(data || []));
      if (Array.isArray(data) && data.length > 0) {
        router.push("/dashboard/recruiter/jobs");
      } else {
        alert("⚠️ No jobs found. Please create a new job post first.");
      }
    } catch (error) {
      console.error("Error fetching recruiter jobs:", error);
      alert("❌ Failed to fetch job list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* Sidebar */}
      <aside className="md:w-64 w-full flex flex-col justify-between border-b md:border-b-0 md:border-r border-border bg-card shadow-sm md:sticky md:top-0 h-auto md:h-screen">
        <div>
          {/* Recruiter Info */}
          <div className="p-6 border-b flex items-center gap-4">
            <Avatar className="w-12 h-12 border">
              {photo ? (
                <AvatarImage src={photo} alt="Recruiter" />
              ) : (
                <AvatarFallback>
                  <User className="text-gray-500" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {recruiterName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {role || "RECRUITER"}
              </p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter")}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard Overview
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleGoToJobs}
              disabled={loading}
            >
              <Briefcase className="mr-3 h-5 w-5" />
              {loading ? "Loading..." : "Manage Job Posts"}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/applicants")}
            >
              <UserCheck className="mr-3 h-5 w-5" />
              View Applicants
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/reports")}
            >
              <FileBarChart className="mr-3 h-5 w-5" />
              Reports & Analytics
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/settings")}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t mt-auto">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto">
        <div className="w-full max-w-6xl space-y-8">
          {/* Notification if no photo */}
          {!photo && (
            <Card className="border-yellow-400 bg-yellow-50 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3">
                <AlertCircle className="text-yellow-600 w-6 h-6" />
                <div>
                  <CardTitle className="text-yellow-800">
                    Complete Your Profile
                  </CardTitle>
                  <CardDescription className="text-yellow-700">
                    Please upload your profile photo to complete your recruiter profile.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() =>
                    router.push("/dashboard/recruiter/create-profile")
                  }
                >
                  Create Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
            <Button
              onClick={() => router.push("/dashboard/recruiter/create-profile")}
            >
              <Plus className="mr-2 h-5 w-5" /> Update Profile Photo
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Manage Job Posts
                </CardTitle>
                <CardDescription>
                  Create, update, or delete job openings easily.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGoToJobs}
                  className="w-full"
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Go to Job Posts"}
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" /> Applicants
                </CardTitle>
                <CardDescription>
                  Review and manage candidate applications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/dashboard/recruiter/applicants")}
                  className="w-full"
                  variant="outline"
                >
                  View Applicants
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileBarChart className="mr-2 h-5 w-5" /> Reports
                </CardTitle>
                <CardDescription>
                  Track hiring performance and job statistics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/dashboard/recruiter/reports")}
                  className="w-full"
                  variant="outline"
                >
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
