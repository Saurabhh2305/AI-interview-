
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BACKEND_URL_USER = "http://localhost:8080/api/applications/user";
const BACKEND_URL_JOB = "http://localhost:8080/api/applications/job";

export default function UserApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [backupApplications, setBackupApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingJob, setLoadingJob] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [jobId, setJobId] = useState("");

  /* ----------------------------------------------------
     📌 Fetch ALL user applications on first load
  ---------------------------------------------------- */
  const loadAllApplications = async () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

    const storedName =
      localStorage.getItem("userName") ||
      (storedUser ? JSON.parse(storedUser)?.name : "");
    if (storedName) setUserName(storedName);

    try {
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${BACKEND_URL_USER}/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setApplications(result.data || []);
        setBackupApplications(result.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Error loading applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllApplications();
  }, []);

  /* ----------------------------------------------------
     🔍 Search by Job ID
  ---------------------------------------------------- */
  const fetchApplicationsByJob = async () => {
    if (!jobId.trim()) {
      // ⭐ If empty, restore all applications
      setApplications(backupApplications);
      setError("");
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

      if (res.ok && result.success && result.data) {
        setApplications(result.data);
      } else {
        setApplications([]);
        setError("No applications found for this Job ID.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching job applications.");
    } finally {
      setLoadingJob(false);
    }
  };

  /* ----------------------------------------------------
     🔄 Clear search 
  ---------------------------------------------------- */
  const clearSearch = () => {
    setJobId("");
    setApplications(backupApplications);
    setError("");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Recruiter Panel</h2>
          <p className="text-sm text-slate-500 mt-1">
            Welcome, {userName || "Guest"}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-slate-600" />
            My Applications
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            View all your applications or search by Job ID.
          </p>

          <Separator className="my-8 bg-slate-200" />

          {/* Search */}
          <div className="mb-6 flex items-center gap-3">
            <input
              type="number"
              placeholder="Enter Job ID"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black"
              onChange={(e) => setJobId(e.target.value)}
              value={jobId}
            />

            <Button
              onClick={fetchApplicationsByJob}
              disabled={loadingJob}
              className="bg-black text-white hover:bg-slate-800 flex items-center gap-2"
            >
              {loadingJob && <Loader2 className="w-4 h-4 animate-spin" />}
              Search
            </Button>

            <Button
              variant="secondary"
              onClick={clearSearch}
              className="border border-slate-300"
            >
              Clear
            </Button>
          </div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin w-6 h-6 text-slate-600" />
                <span className="ml-2 text-slate-600">Loading applications...</span>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : applications.length === 0 ? (
              <p className="text-slate-600 text-center">No applications found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <Card
                    key={app.applicationId}
                    className="shadow-sm hover:shadow-lg border border-slate-100 transition"
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{app.jobTitle}</span>

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
                      <p><strong>Candidate:</strong> {app.candidateName}</p>
                      <p>
                        <strong>Applied On:</strong>{" "}
                        {new Date(app.appliedAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
