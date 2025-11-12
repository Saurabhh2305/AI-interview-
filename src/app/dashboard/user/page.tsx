
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Bookmark,
  ClipboardList,
  BarChart2,
} from "lucide-react";
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

/* ---------------------------------------------
   ✅ Types
---------------------------------------------- */
interface StoredUser {
  id: number;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  photo?: string;
  hasPhoto?: boolean;
  resume?: string;
  hasResume?: boolean;
}

/* ---------------------------------------------
   ✅ Sidebar Link Component
---------------------------------------------- */
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

/* ---------------------------------------------
   ✅ Main Dashboard Component
---------------------------------------------- */
export default function UserDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Guest");
  const [userPhoto, setUserPhoto] = useState<string>("");
  const [userResume, setUserResume] = useState<string | null>(null);

  /* ---------------------------------------------
     🧠 Load user info from LocalStorage
  ---------------------------------------------- */
  const updateUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedPhoto = localStorage.getItem("photoBase64");
      const storedResume = localStorage.getItem("resumeUrl"); // store this when user uploads resume
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        router.replace("/auth/login");
        return;
      }

      const parsedUser: StoredUser = JSON.parse(storedUser);
      setUserName(parsedUser?.fullName || parsedUser?.name || "Guest");

      // ✅ Check uploaded photo from storage or backend field
      let photo = "";
      if (storedPhoto) {
        const isJPEG = storedPhoto.startsWith("/9j/");
        photo = `data:image/${isJPEG ? "jpeg" : "png"};base64,${storedPhoto}`;
      } else if (parsedUser.photo) {
        photo = parsedUser.photo; // from backend if exists
      }

      setUserPhoto(photo || "");
      setUserResume(storedResume || parsedUser.resume || null);

      // ✅ Only redirect to create-profile if both missing
      const hasPhoto = !!photo || parsedUser.hasPhoto;
      const hasResume = !!storedResume || !!parsedUser.resume || parsedUser.hasResume;

      if (!hasPhoto || !hasResume) {
        console.log("Profile incomplete → redirecting to create-profile");
        router.replace("/dashboard/user/create-profile");
        return;
      }
      // ✅ If both exist, stay on this page
    } catch (err) {
      console.error("Error parsing user data:", err);
      localStorage.clear();
      router.replace("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    updateUserFromStorage();
    window.addEventListener("userUpdated", updateUserFromStorage);
    window.addEventListener("storage", updateUserFromStorage);
    return () => {
      window.removeEventListener("userUpdated", updateUserFromStorage);
      window.removeEventListener("storage", updateUserFromStorage);
    };
  }, [updateUserFromStorage]);

  /* ---------------------------------------------
     🚪 Logout Handler
  ---------------------------------------------- */
  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  /* ---------------------------------------------
     📦 Dashboard Cards
  ---------------------------------------------- */
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
      cta: "Edit Profile",
      icon: <User className="w-5 h-5" />,
      action: () => router.push("/dashboard/user/create-profile"),
    },
  ];

  /* ---------------------------------------------
     🧱 Render UI
  ---------------------------------------------- */
  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* ================= Sidebar ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          {/* ✅ User Info */}
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="User"
                className="w-12 h-12 rounded-full object-cover border border-slate-300 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-500" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                User Panel
              </h2>
              <p className="text-sm text-slate-500 mt-1 truncate w-36">
                Welcome, {userName}
              </p>
            </div>
          </div>

          {/* ✅ Sidebar Links */}
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
          </nav>
        </div>

        {/* ✅ Logout */}
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

      {/* ================= Main Content ================= */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
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
          </div>

          <Separator className="mb-8 bg-slate-200" />

          {/* ✅ Show uploaded resume link */}
          {userResume && (
            <div className="mb-8 bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
              <p className="text-slate-600 mb-2 font-medium">Your Uploaded Resume:</p>
              <a
                href={userResume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm break-all"
              >
                {userResume}
              </a>
            </div>
          )}

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
