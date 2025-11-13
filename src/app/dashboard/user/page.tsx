"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  User,
  Bookmark,
  ClipboardList,
  BarChart2,
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

export default function UserDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userResume, setUserResume] = useState<string | null>(null);

 

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return;

  try {
    const parsed = JSON.parse(storedUser);
    const userId = parsed.email || parsed.id || "defaultUser";

    const photo = localStorage.getItem(`userPhoto_${userId}`);
    const resume = localStorage.getItem(`userResume_${userId}`);

    if (photo) setUserPhoto(photo);
    if (resume) setUserResume(resume);
    if (parsed.name) setUserName(parsed.name);
  } catch (err) {
    console.error("Error reading stored user:", err);
  }
}, []);


  // 👇 Check if profile complete
  const isProfileComplete = userPhoto && userResume;

  const cards = [
    {
      id: "applications",
      title: "My Applications",
      desc: "Track all the jobs you've applied to.",
      cta: "View Applications",
      icon: <ClipboardList className="w-5 h-5" />,
      action: () => router.push("/dashboard/user/applications"),
    },
    {
      id: "saved",
      title: "Saved Jobs",
      desc: "Jobs you've saved for later.",
      cta: "View Saved Jobs",
      icon: <Bookmark className="w-5 h-5" />,
      action: () => router.push("/dashboard/user/saved-jobs"),
    },
    {
      id: "profile",
      title: "Profile",
      desc: "Update your resume and personal info.",
      cta: isProfileComplete ? "Edit Profile" : "Create Profile",
      icon: <User className="w-5 h-5" />,
      action: () => router.push("/dashboard/user/create-profile"),
    },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
        
          <div className="p-6 border-b border-slate-200 flex flex-col items-center text-center">
  <Avatar className="w-16 h-16 mb-3 border shadow">
    {userPhoto ? (
      <AvatarImage src={userPhoto} alt="User Photo" />
    ) : (
      <AvatarFallback>
        {userName ? userName.charAt(0).toUpperCase() : "U"}
      </AvatarFallback>
    )}
  </Avatar>

  <h2 className="text-lg font-semibold text-slate-900">
    {userName || "User Panel"}
  </h2>
  <p className="text-sm text-slate-500 mt-1">
    {userName ? "Welcome back!" : "Guest User"}
  </p>
</div>


          <nav className="p-4 space-y-2">
            <SidebarLink
              icon={<LayoutDashboard size={18} />}
              text="Dashboard Overview"
              active
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
  onClick={() => {
    // ✅ Remove only login/session-related data
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("token"); 



    // ✅ Redirect to login page
    router.push("/auth/login");
  }}
  className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow transition"
>
  <LogOut size={16} />
  Logout
</button>


        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <User className="w-7 h-7 text-slate-600" />
                User Dashboard
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                Overview of your job activities
              </p>
            </div>

            <div className="flex items-center gap-4">
             
              <Avatar className="w-12 h-12 border shadow">
                {userPhoto ? (
                  <AvatarImage src={userPhoto} alt="User Photo" />
                ) : (
                  <AvatarFallback>
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>

          <Separator className="mb-8 bg-slate-200" />

          {/* 🚨 Profile Incomplete Message */}
          {!isProfileComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center gap-3"
            >
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-sm text-yellow-700">
                Your profile is incomplete. Please{" "}
                <button
                  onClick={() => router.push("/dashboard/user/create-profile")}
                  className="underline font-medium hover:text-yellow-800"
                >
                  create your profile
                </button>{" "}
                to unlock full features.
              </p>
            </motion.div>
          )}

          {/* Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <Card
                  key={c.id}
                  className="shadow-sm hover:shadow-lg border border-slate-100 transition duration-200"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                      <span className="p-2 bg-slate-100 rounded-md inline-flex">
                        {c.icon}
                      </span>
                      {c.title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      {c.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full mt-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      onClick={c.action}
                    >
                      {c.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* 📄 Show Uploaded Resume (optional preview) */}
         {isProfileComplete && userResume && (
  <div className="mt-10 bg-white border border-slate-100 p-4 rounded-lg shadow-sm text-center">
    <p className="text-slate-600 mb-4 font-medium">Your Uploaded Resume:</p>

    <a
      href={
        userResume.startsWith("data:application/pdf")
          ? userResume
          : `data:application/pdf;base64,${userResume}`
      }
      download="My_Resume.pdf"
      className="inline-block bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800 transition"
    >
      Download Resume
    </a>
  </div>
)}

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
