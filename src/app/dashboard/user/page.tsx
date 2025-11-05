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
  Briefcase,
  User,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const [userName] = useState<string>("Saurabh Gupta");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-md border-r border-gray-200">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600 tracking-tight">
            User Panel
          </h2>
          <p className="text-sm text-gray-500 mt-1">Welcome, {userName}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-blue-50"
            onClick={() => router.push("/dashboard/user")}
          >
            <LayoutDashboard className="mr-3 h-5 w-5 text-blue-500" />
            Dashboard Overview
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-blue-50"
            onClick={() => router.push("/dashboard/user/jobs")}
          >
            <Briefcase className="mr-3 h-5 w-5 text-blue-500" />
            Explore Jobs
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-blue-50"
            onClick={() => router.push("/dashboard/user/profile")}
          >
            <User className="mr-3 h-5 w-5 text-blue-500" />
            My Profile
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-blue-50"
            onClick={() => router.push("/dashboard/user/applications")}
          >
            <FileText className="mr-3 h-5 w-5 text-blue-500" />
            My Applications
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-blue-50"
            onClick={() => router.push("/dashboard/user/settings")}
          >
            <Settings className="mr-3 h-5 w-5 text-blue-500" />
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
            User Dashboard 
          </h1>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">
            Logged in as: <span className="font-medium">{userName}</span>
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Explore Jobs */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Briefcase className="mr-2 h-5 w-5" /> Explore Opportunities
              </CardTitle>
              <CardDescription>
                Browse and apply for jobs that match your skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/user/jobs")}
                className="w-full"
                variant="outline"
              >
                View Jobs
              </Button>
            </CardContent>
          </Card>

          {/* Profile Management */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <User className="mr-2 h-5 w-5" /> Profile Management
              </CardTitle>
              <CardDescription>
                Update your details, resume, and preferences anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/user/profile")}
                className="w-full"
                variant="outline"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <FileText className="mr-2 h-5 w-5" /> My Applications
              </CardTitle>
              <CardDescription>
                Track the status of your job applications here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/user/applications")}
                className="w-full"
                variant="outline"
              >
                View Applications
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Settings className="mr-2 h-5 w-5" /> Settings
              </CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/user/settings")}
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
