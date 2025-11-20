"use client";

import React, { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  User,
  Bookmark,
  ClipboardList,
  AlertCircle,
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

interface StoredUser {
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
}

export default function UserDashboard(): JSX.Element {
  const router = useRouter();

  const [userName, setUserName] = useState<string>("User");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userResume, setUserResume] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsed: StoredUser = JSON.parse(storedUser);

      // FIX ⭐ Full Name always read
      const finalName =
        parsed.fullName || parsed.name || parsed.email?.split("@")[0];

      setUserName(finalName || "User");

      // Load saved photo/resume
      const userId = parsed.email || parsed.id || "defaultUser";
      const photo = localStorage.getItem(`userPhoto_${userId}`);
      const resume = localStorage.getItem(`userResume_${userId}`);

      if (photo) setUserPhoto(photo);
      if (resume) setUserResume(resume);
    } catch (err) {
      console.error("User load error:", err);
    }
  }, []);

  const isProfileComplete = Boolean(userPhoto && userResume);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          {/* User Avatar */}
          <div className="p-6 border-b border-slate-200 flex flex-col items-center text-center">
            <Avatar className="w-16 h-16 mb-3 border shadow">
              {userPhoto ? (
                <AvatarImage src={userPhoto} alt="User Photo" />
              ) : (
                <AvatarFallback>
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <h2 className="text-lg font-semibold text-slate-900">
              {userName}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Welcome, {userName}
            </p>
          </div>

          {/* Sidebar Navigation */}
          <nav className="p-4 space-y-2">
            <SidebarLink
              icon={<LayoutDashboard size={18} />}
              text="Dashboard Overview"
              active
              onClick={() => router.push("/dashboard/user")}
            />

            <SidebarLink
              icon={<User size={18} />}
              text="Create Profile"
              onClick={() => router.push("/dashboard/user/create-profile")}
            />

            <SidebarLink
              icon={<FileText size={18} />}
              text="Download Resume"
              onClick={() => {
                if (!userResume) return;

                const link = document.createElement("a");
                link.href = userResume.startsWith("data:application/pdf")
                  ? userResume
                  : `data:application/pdf;base64,${userResume}`;
                link.download = "My_Resume.pdf";
                link.click();
              }}
            />

            <SidebarLink
              icon={<ClipboardList size={18} />}
              text="My Applications"
              onClick={() => router.push("/dashboard/user/applications")}
            />

            <SidebarLink
              icon={<Bookmark size={18} />}
              text="Jobs"
              onClick={() => router.push("/dashboard/user/saved-jobs")}
            />

            <SidebarLink
              icon={<Settings size={18} />}
              text="Settings"
              onClick={() => null}
            />
          </nav>
        </div>

        {/* LOGOUT */}
        <button
  onClick={() => {
    localStorage.removeItem("token");   // sirf token hatao
    router.push("/auth/login");
  }}
  className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow transition"
>
  <LogOut size={16} />
  Logout
</button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <User className="w-7 h-7 text-slate-600" />
                Hello, {userName} 
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Welcome to User dashboard
              </p>
            </div>
          </div>

          <Separator className="mb-8 bg-slate-200" />

          {/* Profile Warning */}
          {!isProfileComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center gap-3"
            >
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-sm text-yellow-700">
                Your profile is incomplete.{" "}
                <button
                  onClick={() => router.push("/dashboard/user/create-profile")}
                  className="underline font-medium hover:text-yellow-800"
                >
                  Complete your profile
                </button>
                .
              </p>
            </motion.div>
          )}

          {/* Dashboard Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                icon={<ClipboardList className="w-5 h-5" />}
                title="My Applications"
                desc="Track all jobs you applied for."
                btn="View Applications"
                action={() => router.push("/dashboard/user/applications")}
              />

              <DashboardCard
                icon={<Bookmark className="w-5 h-5" />}
                title="Jobs"
                desc="Track all the jobs added by recruiters."
                btn="Jobs"
                action={() => router.push("/dashboard/user/saved-jobs")}
              />

              <DashboardCard
                icon={<User className="w-5 h-5" />}
                title="Profile"
                desc="Manage your resume & details."
                btn="Edit Profile"
                action={() => router.push("/dashboard/user/create-profile")}
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* ------------------ REUSABLE COMPONENTS ------------------ */

interface SidebarLinkProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  active?: boolean;
}

function SidebarLink({ icon, text, onClick, active = false }: SidebarLinkProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition ${
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

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  btn: string;
  action: () => void;
}

function DashboardCard({ icon, title, desc, btn, action }: DashboardCardProps): JSX.Element {
  return (
    <Card className="shadow-sm hover:shadow-lg border border-slate-100 transition duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="p-2 bg-slate-100 rounded-md inline-flex">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription className="text-slate-500 mt-1">{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full mt-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          onClick={action}
        >
          {btn}
        </Button>
      </CardContent>
    </Card>
  );
}
