"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Bookmark,
  BarChart2,
  Settings,
  LogOut,
  Loader2,
  RotateCcw,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Existing API endpoints
const BACKEND_URL_JOB = "http://localhost:8080/api/applications/job";

export default function RecruiterApplicantsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingJob, setLoadingJob] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [jobId, setJobId] = useState("");
  const [recruiterId, setRecruiterId] = useState<number | null>(null);

  // Load recruiter info
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    setRecruiterId(user.id);
    setUserName(user.name || "Recruiter");

    // Initially show message to search by Job ID
    setLoading(false);
  }, []);

  // Fetch applications by Job ID
  const fetchApplicationsByJob = async () => {
    if (!jobId) {
      setError("Please enter a Job ID");
      return;
    }

    setLoadingJob(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL_JOB}/${jobId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setApplications(result.data || []);
        if (result.data.length === 0) {
          setError("No applications found for this Job ID.");
        }
      } else {
        setApplications([]);
        setError(result.message || "No applications found for this Job ID.");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please check the Job ID.");
    } finally {
      setLoadingJob(false);
    }
  };

  // Reset search
  const resetSearch = () => {
    setJobId("");
    setApplications([]);
    setError("");
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchApplicationsByJob();
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Recruiter Panel</h2>
            <p className="text-sm text-slate-500">Welcome, {userName}</p>
          </div>

          <nav className="p-4 space-y-2">
            <SidebarLink
              icon={<LayoutDashboard size={18} />}
              text="Dashboard Overview"
              onClick={() => router.push("/dashboard/recruiter")}
            />

            <SidebarLink
              icon={<Users size={18} />}
              text="Applicants"
              active
            />

            <SidebarLink
              icon={<Bookmark size={18} />}
              text="Posted Jobs"
              onClick={() => router.push("/dashboard/recruiter/jobs")}
            />

            <SidebarLink icon={<BarChart2 size={18} />} text="Analytics" />
            <SidebarLink icon={<Settings size={18} />} text="Settings" />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-7 h-7 text-slate-600" />
                Job Applicants
              </h1>
              <p className="text-slate-500">View applications by Job ID</p>
            </div>

            <Avatar className="w-12 h-12 border shadow">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <Separator className="mb-8 bg-slate-200" />

          {/* Search Section */}
          <div className="mb-8">
            <div className="flex gap-3 mb-4">
              <input
                type="number"
                placeholder="Enter Job ID to view applications"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm flex-1"
                value={jobId}
                onChange={(e) => {
                  setJobId(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
              />

              <Button
                onClick={fetchApplicationsByJob}
                disabled={loadingJob}
                className="bg-black text-white hover:bg-slate-800"
              >
                {loadingJob && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Search
              </Button>

              <Button
                onClick={resetSearch}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
            
            <p className="text-sm text-slate-600">
              Enter the Job ID to view all applications for that specific job.
            </p>
          </div>

          {/* Applications List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin w-6 h-6 text-slate-600" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <p className="text-slate-600">Please enter a valid Job ID to view applications.</p>
              </div>
            ) : applications.length === 0 && !jobId ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Job Selected</h3>
                <p className="text-slate-600">Enter a Job ID above to view applications for that job.</p>
              </div>
            ) : applications.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No applications found for this Job ID.</p>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Applications for Job ID: {jobId} 
                    <span className="ml-2 text-sm font-normal text-slate-600">
                      ({applications.length} applications)
                    </span>
                  </h3>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {applications.map((app) => (
                    <Card
                      key={app.applicationId}
                      className="shadow-sm hover:shadow-lg transition"
                    >
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span className="text-lg">{app.jobTitle}</span>

                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              app.status === "Accepted"
                                ? "bg-green-100 text-green-700"
                                : app.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {app.status}
                          </span>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="text-sm text-slate-600">
                        <p>
                          <strong>Applicant:</strong> {app.candidateName}
                        </p>
                        <p>
                          <strong>User ID:</strong> {app.userId}
                        </p>
                        <p>
                          <strong>Applied On:</strong>{" "}
                          {new Date(app.appliedAt).toLocaleString()}
                        </p>
                        <p>
                          <strong>Application ID:</strong> {app.applicationId}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({
  icon,
  text,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition ${
        active
          ? "bg-black text-white font-medium"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}