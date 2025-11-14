"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  UserCheck,
  FileBarChart,
  Settings,
  LogOut,
  AlertCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface StoredUser {
  id?: number;
  name?: string;
  email?: string;
}

export default function RecruiterDashboard() {
  const router = useRouter();

  const [recruiterName, setRecruiterName] = useState<string>("Recruiter");
  const [recruiterEmail, setRecruiterEmail] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);

  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);

  // ───────────────────────────────────────────────
  // ✔ Load Recruiter DATA + PHOTO
  // ───────────────────────────────────────────────
 useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    router.push("/auth/login");
    return;
  }

  // recruiter data
  const parsed = JSON.parse(storedUser);
  if (parsed.name) setRecruiterName(parsed.name);
  if (parsed.email) setRecruiterEmail(parsed.email);

  // find unique recruiter key
  const recruiterId = parsed.email || parsed.id || "defaultRecruiter";

  // read correct photo key
  const savedPhoto = localStorage.getItem(`recruiterPhoto_${recruiterId}`);
  if (savedPhoto) setPhoto(savedPhoto);
}, [router]);

  // ───────────────────────────────────────────────
  // ✔ Logout
  // ───────────────────────────────────────────────
  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  // ───────────────────────────────────────────────
  // ✔ Fetch Jobs API + Redirect
  // ───────────────────────────────────────────────
  const handleGoToJobs = async (): Promise<void> => {
    setLoadingJobs(true);

    try {
      const token = localStorage.getItem("token");
      const storedUser: StoredUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
      const recruiterId = storedUser.id;

      if (!recruiterId) {
        alert("❌ Recruiter ID missing");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/jobs/recruiter/${recruiterId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = response.data;
      sessionStorage.setItem("recruiterJobs", JSON.stringify(data || []));

      if (Array.isArray(data) && data.length > 0) {
        router.push("/dashboard/recruiter/jobs");
      } else {
        alert("⚠️ No jobs found. Please create a job post first.");
      }
    } catch (error) {
      console.error("Error fetching recruiter jobs:", error);
      alert("❌ Failed to fetch job list.");
    } finally {
      setLoadingJobs(false);
    }
  };

  const isProfileComplete = Boolean(photo);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* ─── Sidebar ───────────────────────────── */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between bg-white border-r border-slate-200 shadow-sm fixed h-full">
        <div>
          <div className="p-6 border-b border-slate-200 text-center">
            <Avatar className="w-16 h-16 mx-auto mb-3 border shadow">
              {photo ? (
                <AvatarImage src={photo} alt="Recruiter Photo" />
              ) : (
                <AvatarFallback>
                  {recruiterName ? recruiterName.charAt(0).toUpperCase() : "R"}
                </AvatarFallback>
              )}
            </Avatar>

            <h1 className="text-lg font-semibold text-slate-900">
              {recruiterName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{recruiterEmail}</p>
          </div>

          <nav className="p-4 space-y-1">
  <SidebarItem
    icon={<LayoutDashboard size={18} />}
    label="Dashboard Overview"
    onClick={() => router.push("/dashboard/recruiter")}
    active
  />

  {/* 🆕 Create Profile */}
  <SidebarItem
    icon={<UserCheck size={18} />}
    label="Create Profile"
    onClick={() => router.push("/dashboard/recruiter/create-profile")}
  />

  {/* 🆕 Update Profile */}
  <SidebarItem
    icon={<Settings size={18} />}
    label="Update Profile"
    onClick={() => router.push("/dashboard/recruiter/create-profile")}
  />

  <SidebarItem
    icon={<Briefcase size={18} />}
    label="Manage Job Posts"
    onClick={handleGoToJobs}
  />

  <SidebarItem
    icon={<UserCheck size={18} />}
    label="View Applicants"
    onClick={() => router.push("/dashboard/recruiter/applicants")}
  />

  <SidebarItem
    icon={<FileBarChart size={18} />}
    label="Reports & Analytics"
    onClick={() => router.push("/dashboard/recruiter/reports")}
  />
</nav>

        </div>

        <div className="p-4 border-t border-slate-200">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ───────────────────────── */}
      <main className="flex-1 md:ml-64 px-6 md:px-10 py-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-slate-900">
                <LayoutDashboard className="mr-2 h-7 w-7 text-slate-600" />
                Recruiter Dashboard
              </h1>
              <p className="text-slate-500 mt-2">
                Manage job posts, applicants, and view analytics.
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ⚠️ Profile Incomplete */}
          {!isProfileComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center gap-3"
            >
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-sm text-yellow-700">
                Your profile photo is missing.{" "}
                <button
                  onClick={() =>
                    router.push("/dashboard/recruiter/create-profile")
                  }
                  className="underline font-medium hover:text-yellow-800"
                >
                  Upload Photo
                </button>{" "}
                to complete your profile.
              </p>
            </motion.div>
          )}

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <DashboardCard
              icon={<Briefcase className="h-5 w-5 mr-2 text-slate-600" />}
              title="Manage Job Posts"
              description="Create, update, or delete job openings."
              buttonLabel={loadingJobs ? "Loading..." : "Go to Job Posts"}
              onClick={handleGoToJobs}
            />
            <DashboardCard
              icon={<UserCheck className="h-5 w-5 mr-2 text-slate-600" />}
              title="Applicants"
              description="Review and manage candidate applications."
              buttonLabel="View Applicants"
              onClick={() => router.push("/dashboard/recruiter/applicants")}
            />
            <DashboardCard
              icon={<FileBarChart className="h-5 w-5 mr-2 text-slate-600" />}
              title="Reports & Analytics"
              description="Track hiring performance and job insights."
              buttonLabel="View Reports"
              onClick={() => router.push("/dashboard/recruiter/reports")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Sidebar Item ───────────────────────────── */
interface SidebarProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function SidebarItem({ icon, label, onClick, active = false }: SidebarProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition ${
        active
          ? "bg-black text-white font-medium shadow"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Dashboard Card ─────────────────────────── */
interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

function DashboardCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
}: CardProps) {
  return (
    <Card className="border border-slate-200 hover:shadow-md transition bg-white rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-slate-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onClick}
          variant="outline"
          className="w-full mt-2 border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
