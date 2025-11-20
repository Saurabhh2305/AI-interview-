

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
  User,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"

const BACKEND_URL_USER = "http://localhost:8080/api/applications/user";
const BACKEND_URL_JOB = "http://localhost:8080/api/applications/job";
const BACKEND_URL_WITHDRAW = "http://localhost:8080/api/applications/withdraw";

export default function UserApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingJob, setLoadingJob] = useState(false);
  const [withdrawing, setWithdrawing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [jobId, setJobId] = useState("");
  const [userPhoto, setUserPhoto] = useState("");

  // Load User Info & Applications
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.id;

      const storedName =
        localStorage.getItem("userName") ||
        (storedUser ? JSON.parse(storedUser)?.name : "");

      if (storedName) setUserName(storedName);

      const storedPhoto = localStorage.getItem("photoBase64");
      if (storedPhoto) {
        const isJPEG = storedPhoto.startsWith("/9j/");
        setUserPhoto(`data:image/${isJPEG ? "jpeg" : "png"};base64,${storedPhoto}`);
      }

      const fetchApplicationsByUser = async () => {
        try {
          if (!userId) {
            setError("User not found. Please login again.");
            setLoading(false);
            return;
          }

          const response = await fetch(`${BACKEND_URL_USER}/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const result = await response.json();

          if (response.ok && result.success && result.data) {
            setApplications(result.data);
          } else {
            setError(result.message || "No applications found.");
          }
        } catch (err) {
          console.error(err);
          setError("Error loading applications.");
        } finally {
          setLoading(false);
        }
      };

      fetchApplicationsByUser();
    } catch (err) {
      console.error("Error loading user:", err);
    }
  }, []);

  // SEARCH BY JOB ID
  const fetchApplicationsByJob = async () => {
    if (!jobId) return toast("Please enter a job ID.");
    setLoadingJob(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL_JOB}/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setApplications(result.data);
      } else {
        setApplications([]);
        setError(result.message || "No applications found for this Job ID.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching job applications.");
    } finally {
      setLoadingJob(false);
    }
  };

  // WITHDRAW APPLICATION
const handleWithdraw = async (userId: number, jobId: number, appId: number) => {
  toast("Are you sure you want to withdraw this application?", {
    description: "This action cannot be undone.",
    action: {
      label: "Yes, Withdraw",
      onClick: async () => {
        setWithdrawing(appId);

        try {
          const url = `${BACKEND_URL_WITHDRAW}?userId=${userId}&jobId=${jobId}`;
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const result = await response.json();

          if (response.ok && result.success) {
            toast.success("Application withdrawn successfully!", {
              description: "Your application has been removed.",
            });

            setApplications((prev) =>
              prev.filter((app) => app.jobId !== jobId)
            );
          } else {
            toast.error(result.message || "Unable to withdraw application.");
          }
        } catch (err) {
          console.error(err);
          toast.error("Server error withdrawing application.");
        } finally {
          setWithdrawing(null);
        }
      },
    },
  });
};

const handleLogout = () => {
  router.push("/auth/login");
};

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
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
              active
              onClick={() => router.push("/dashboard/user/applications")}
            />
            <SidebarLink
              icon={<Bookmark size={18} />}
              text="Saved Jobs"
              onClick={() => router.push("/dashboard/user/saved-jobs")}
            />
            <SidebarLink
              icon={<BarChart2 size={18} />}
              text="Job Stats"
              onClick={() => null}
            />
            <SidebarLink
              icon={<Settings size={18} />}
              text="Settings"
              onClick={() => null}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ClipboardList className="w-7 h-7 text-slate-600" />
                My Applications
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                View and manage your job applications.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                className="hidden sm:inline-flex items-center gap-2 bg-black text-white hover:bg-slate-800 px-4 py-2"
                onClick={() => router.push("/dashboard/user")}
              >
                Back to Dashboard
              </Button>

              <Avatar className="w-12 h-12 border border-slate-300 shadow-sm">
                {userPhoto ? (
                  <AvatarImage src={userPhoto} alt="User" />
                ) : (
                  <AvatarFallback>
                    <User className="text-slate-500" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>

          <Separator className="mb-8 bg-slate-200" />

          {/* APPLICATIONS LIST */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin w-6 h-6 text-slate-600" />
                <span className="ml-2 text-slate-600">
                  Loading applications...
                </span>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : applications.length === 0 ? (
              <p className="text-slate-600 text-center">
                No applications found.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <Card
                    key={app.applicationId}
                    className="shadow-sm hover:shadow-lg border border-slate-100 transition duration-200"
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

                    <CardContent className="text-sm text-slate-600 space-y-2">
                      <p>
                        <strong>Candidate:</strong> {app.candidateName}
                      </p>
                      <p>
                        <strong>Applied On:</strong>{" "}
                        {new Date(app.appliedAt).toLocaleString()}
                      </p>

                      {/* WITHDRAW BUTTON */}
                      {app.status?.toLowerCase() === "pending" && (
                        <Button
                          onClick={() =>
                            handleWithdraw(app.userId, app.jobId, app.applicationId)
                          }
                          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 mt-3"
                          disabled={withdrawing === app.applicationId}
                        >
                          {withdrawing === app.applicationId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Withdraw Application
                        </Button>
                      )}
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

/* Sidebar Link Component */
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
