"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Users,
  Briefcase,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName] = useState("Saurabh Gupta");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* ─── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between bg-white border-r border-border shadow-sm fixed h-full">
        <div>
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {adminName}
            </p>
          </div>

          <nav className="p-4 space-y-1">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard Overview"
              onClick={() => router.push("/dashboard/admin")}
              active
            />
            <SidebarItem
              icon={<Users size={18} />}
              label="Manage Users"
              onClick={() => router.push("/dashboard/admin/users")}
            />
            <SidebarItem
              icon={<Briefcase size={18} />}
              label="Job Listings"
              onClick={() => router.push("/dashboard/admin/jobs")}
            />
            <SidebarItem
              icon={<FileBarChart size={18} />}
              label="Reports & Analytics"
              onClick={() => router.push("/dashboard/admin/reports")}
            />
            <SidebarItem
              icon={<Settings size={18} />}
              label="System Settings"
              onClick={() => router.push("/dashboard/admin/settings")}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* ─── Main Content ───────────────────────────────────────────── */}
      <main className="flex-1 md:ml-64 px-6 md:px-10 py-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <LayoutDashboard className="mr-2 h-7 w-7 text-foreground/80" />
                Admin Dashboard 
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage users, jobs, analytics, and settings efficiently.
              </p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <DashboardCard
              icon={<Users className="h-5 w-5 mr-2 text-foreground/70" />}
              title="Manage Users"
              description="Add, edit, or delete users and assign their roles."
              buttonLabel="Go to Users"
              onClick={() => router.push("/dashboard/admin/users")}
            />

            <DashboardCard
              icon={<Briefcase className="h-5 w-5 mr-2 text-foreground/70" />}
              title="Job Listings"
              description="Create and manage job opportunities for recruiters."
              buttonLabel="Manage Jobs"
              onClick={() => router.push("/dashboard/admin/jobs")}
            />

            <DashboardCard
              icon={<FileBarChart className="h-5 w-5 mr-2 text-foreground/70" />}
              title="Reports & Analytics"
              description="View platform performance and analytics data."
              buttonLabel="View Reports"
              onClick={() => router.push("/dashboard/admin/reports")}
            />

            <DashboardCard
              icon={<Settings className="h-5 w-5 mr-2 text-foreground/70" />}
              title="System Settings"
              description="Configure global preferences and platform settings."
              buttonLabel="Open Settings"
              onClick={() => router.push("/dashboard/admin/settings")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Sidebar Link Component ───────────────────────────────────────────── */
function SidebarItem({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-muted text-foreground font-medium"
          : "text-foreground/80 hover:bg-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Dashboard Card Component ───────────────────────────────────────────── */
function DashboardCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <Card className="border border-border hover:shadow-md transition-all duration-200 bg-white rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-foreground">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onClick}
          variant="outline"
          className="w-full mt-2 border-border text-foreground hover:bg-muted"
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
