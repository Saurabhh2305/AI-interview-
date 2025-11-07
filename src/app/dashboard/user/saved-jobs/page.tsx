"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Job {
  id: number;
  title: string;
  location?: string;
  company?: string;
  experienceLevel?: string;
  salaryRange?: string;
  skillsRequired?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  key: string;
}

export default function SavedJobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [userId] = useState<number>(1); // Replace with actual logged-in user ID

  useEffect(() => {
    const queryJobs = searchParams.get("jobs");
    if (queryJobs) {
      try {
        const parsed: Job[] = JSON.parse(decodeURIComponent(queryJobs));
        const withKeys = parsed.map((job, i) => ({
          ...job,
          key: job.id ? `job-${job.id}` : `job-${i}`,
        }));
        setJobs(withKeys);
      } catch (err) {
        console.error("Failed to parse jobs:", err);
      }
    }
  }, [searchParams]);

  const handleApply = async (job: Job) => {
    if (!userId) return alert("You must be logged in to apply.");

    setLoadingIds((prev) => ({ ...prev, [job.key]: true }));

    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await axios.post(
        `${baseURL}/api/applications/apply`,
        { userId, jobId: job.id },
        { headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
      );

      if (res.data?.success) {
        alert(`Applied for "${job.title}" successfully!`);
        // Optionally redirect to Applied Jobs page
        router.push("/applied-jobs");
      } else {
        alert(res.data?.message || "Failed to apply.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong while applying.");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [job.key]: false }));
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>

      <ScrollArea className="h-[75vh] pr-2">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No saved jobs found.</p>
          ) : (
            jobs.map((job) => (
              <Card key={job.key} className="hover:shadow-lg border p-5 flex flex-col justify-between rounded-2xl bg-white">
                <div>
                  <CardHeader className="p-0 mb-3">
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.location || "Location not specified"}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 text-sm text-gray-700 space-y-2">
                    {job.company && <p><strong>Company:</strong> {job.company}</p>}
                    {job.experienceLevel && <p><strong>Experience:</strong> {job.experienceLevel}</p>}
                    {job.salaryRange && <p><strong>Salary:</strong> {job.salaryRange}</p>}
                  </CardContent>
                </div>

                <button
                  onClick={() => handleApply(job)}
                  disabled={loadingIds[job.key]}
                  className={`w-full mt-5 py-2 rounded-lg font-medium transition-all ${
                    loadingIds[job.key] ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {loadingIds[job.key] ? "Applying..." : "Apply Now"}
                </button>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
