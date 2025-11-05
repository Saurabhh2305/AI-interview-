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
  const [adminName] = useState<string>("Saurabh Gupta");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-md border-r border-gray-200">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-600 tracking-tight">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-500 mt-1">Welcome, {adminName}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-indigo-50"
            onClick={() => router.push("/dashboard/admin")}
          >
            <LayoutDashboard className="mr-3 h-5 w-5 text-indigo-500" />
            Dashboard Overview
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-indigo-50"
            onClick={() => router.push("/dashboard/admin/users")}
          >
            <Users className="mr-3 h-5 w-5 text-indigo-500" />
            Manage Users
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-indigo-50"
            onClick={() => router.push("/dashboard/admin/jobs")}
          >
            <Briefcase className="mr-3 h-5 w-5 text-indigo-500" />
            Job Listings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-indigo-50"
            onClick={() => router.push("/dashboard/admin/reports")}
          >
            <FileBarChart className="mr-3 h-5 w-5 text-indigo-500" />
            Reports
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-indigo-50"
            onClick={() => router.push("/dashboard/admin/settings")}
          >
            <Settings className="mr-3 h-5 w-5 text-indigo-500" />
            Settings
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard 👑
          </h1>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">
            Logged in as: <span className="font-medium">{adminName}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-700">
                <Users className="mr-2 h-5 w-5" /> Manage Users
              </CardTitle>
              <CardDescription>
                Add, edit, or delete users and assign their roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/admin/users")}
                className="w-full"
                variant="outline"
              >
                Go to Users
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-700">
                <Briefcase className="mr-2 h-5 w-5" /> Job Listings
              </CardTitle>
              <CardDescription>
                Create and manage job opportunities for recruiters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/admin/jobs")}
                className="w-full"
                variant="outline"
              >
                Manage Jobs
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-700">
                <FileBarChart className="mr-2 h-5 w-5" /> Reports
              </CardTitle>
              <CardDescription>
                View analytics and performance data across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/admin/reports")}
                className="w-full"
                variant="outline"
              >
                View Reports
              </Button>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-700">
                <Settings className="mr-2 h-5 w-5" /> System Settings
              </CardTitle>
              <CardDescription>
                Configure global preferences and access controls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/admin/settings")}
                className="w-full"
                variant="outline"
              >
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
