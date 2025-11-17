
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Bookmark,
  ClipboardList,
  BarChart2,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

/* ✅ Spinner */
function Spinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default function SavedJobsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobFiles, setJobFiles] = useState<{
    [key: number]: { resume?: string; photo?: string; applied?: boolean };
  }>({});
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);

  /* ✅ Fetch user + photo + jobs */
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const possibleId =
            parsedUser?.id ||
            parsedUser?.userId ||
            parsedUser?.user?.id ||
            parsedUser?.data?.id ||
            parsedUser?.data?.userId;
          const possibleName =
            parsedUser?.name ||
            parsedUser?.user?.name ||
            parsedUser?.data?.name ||
            localStorage.getItem("userName");

          if (possibleName) setUserName(possibleName);
          if (possibleId) setUserId(Number(possibleId));
        }

        const storedPhoto = localStorage.getItem("photoBase64");
        if (storedPhoto) {
          const isJPEG = storedPhoto.startsWith("/9j/");
          setUserPhoto(`data:image/${isJPEG ? "jpeg" : "png"};base64,${storedPhoto}`);
        }
      } catch (err) {
        console.error("❌ Failed to parse user:", err);
      }
    }

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/jobs/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch jobs");

        setJobs(data?.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* ✅ Handle resume/photo upload */
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    jobId: number,
    type: "resume" | "photo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setJobFiles((prev) => ({
        ...prev,
        [jobId]: {
          ...prev[jobId],
          [type]: base64,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ✅ Apply for job */
  const handleApply = async (jobId: number) => {
    if (!userId || isNaN(Number(userId))) {
      alert("❌ Missing or invalid userId. Please login again.");
      return;
    }

    const jobFile = jobFiles[jobId];
    if (!jobFile?.resume) {
      alert("Please upload your resume first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      setApplyingJobId(jobId);

      const payload = {
        userId: Number(userId),
        jobId: Number(jobId),
        resume: jobFile.resume,
        photo: jobFile.photo || "",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/applications/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok && data?.success !== false) {
        alert(`✅ Successfully applied for Job ID: ${jobId}`);
        setJobFiles((prev) => ({
          ...prev,
          [jobId]: { ...prev[jobId], applied: true },
        }));
      } else {
        alert(`❌ Failed: ${data?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            {/* {userPhoto ? (
              <img
                src={userPhoto}
                alt="User"
                className="w-12 h-12 rounded-full object-cover border border-slate-300 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-500" />
              </div>
            )} */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">User Panel</h2>
              <p className="text-sm text-slate-500 mt-1 truncate w-36">
                Welcome, {userName || "Guest"}
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <SidebarLink
              icon={<LayoutDashboard size={18} />}
              text="Dashboard Overview"
              onClick={() => router.push("/dashboard/user")}
            />
            <SidebarLink
              icon={<ClipboardList size={18} />}
              text="My Applications"
              onClick={() => router.push("/dashboard/user/applications")}
            />
            <SidebarLink
              icon={<Bookmark size={18} />}
              text="Saved Jobs"
              active
              onClick={() => router.push("/dashboard/user/saved-jobs")}
            />
            <SidebarLink
              icon={<BarChart2 size={18} />}
              text="Job Stats"
              onClick={() => router.push("/dashboard/user/stats")}
            />
            <SidebarLink
              icon={<Settings size={18} />}
              text="Settings"
              onClick={() => router.push("/dashboard/user/settings")}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bookmark className="w-7 h-7 text-slate-600" />
                Saved Jobs
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                Upload your resume and apply to jobs easily.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => router.push("/dashboard/user")}
              >
                Back to Dashboard
              </Button>

              <Avatar className="w-12 h-12 border border-slate-300 shadow-sm">
                {userPhoto ? (
                  <AvatarImage src={userPhoto} alt="User" />
                ) : (
                  <AvatarFallback>
                    <User className="w-6 h-6 text-slate-500" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>

          <Separator className="mb-6 bg-slate-200" />

          {loading && <Spinner />}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!loading && !error && jobs.length === 0 && (
            <p className="text-slate-500">No jobs available right now.</p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {!loading &&
              jobs.map((job) => {
                const jobId = job.id || job.jobId;
                const jobFile = jobFiles[jobId] || {};
                const isApplied = jobFile.applied;
                const isApplying = applyingJobId === jobId;

                return (
                  <Card
                    key={jobId}
                    className="shadow-sm hover:shadow-lg border border-slate-100 transition duration-200"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {job.title}
                      </CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{job.location}</p>
                      <p className="text-slate-500 text-sm mt-2 line-clamp-3">
                        {job.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        <div>
                          <label className="block text-sm text-slate-700 mb-1">
                            Upload Resume
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              handleFileUpload(e, jobId, "resume")
                            }
                            className="block w-full text-sm border border-slate-300 rounded p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-700 mb-1">
                            Upload Photo (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, jobId, "photo")
                            }
                            className="block w-full text-sm border border-slate-300 rounded p-2"
                          />
                        </div>
                      </div>

                      {/* ✅ Only Apply Button */}
                      <div className="flex mt-4">
                        {isApplied ? (
                          <Button
                            disabled
                            className="flex-1 bg-green-100 text-green-700 cursor-not-allowed"
                          >
                            ✅ Applied
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-100"
                            onClick={() => handleApply(jobId)}
                            disabled={isApplying}
                          >
                            {isApplying ? <Spinner /> : "Apply"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* Sidebar Link */
function SidebarLink({
  icon,
  text,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${
        active
          ? "bg-black text-white font-medium shadow-sm"
          : "text-slate-700 hover:bg-slate-100 hover:text-black"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}
