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
import { useRouter } from "next/navigation"; // ✅ added

export default function UserDashboard() {
  const router = useRouter(); // ✅
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedName =
        localStorage.getItem("userName") ||
        (storedUser ? JSON.parse(storedUser)?.name : "");
      if (storedName) setUserName(storedName);
    }
  }, []);

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
      cta: "create Profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">User Panel</h2>
            <p className="text-sm text-slate-500 mt-1">
              Welcome, {userName || "Guest"}
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
              onClick={() => null}
            />
            <SidebarLink
              icon={<Bookmark size={18} />}
              text="Saved Jobs"
              onClick={() => router.push("/dashboard/user/saved-jobs")} // ✅ sidebar link
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
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow transition">
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
                Overview of your job applications
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button className="hidden sm:inline-flex items-center gap-2 bg-black text-white hover:bg-slate-800 px-4 py-2">
                Apply for a Job
              </Button>
              <Avatar className="w-12 h-12 border shadow">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <Separator className="mb-8 bg-slate-200" />

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


