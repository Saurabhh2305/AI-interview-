"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function RecruiterDashboard() {
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <Card className="w-full max-w-6xl shadow-lg border border-gray-200 bg-white">
        {/* Header */}
        <CardHeader className="flex justify-between items-center pb-2">
          <div>
            <CardTitle className="text-3xl font-semibold text-gray-800">
              Recruiter Dashboard
            </CardTitle>
            <CardDescription>
              Manage candidates, job postings, and hiring analytics
            </CardDescription>
          </div>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </CardHeader>

        <Separator className="my-4" />

        {/* Main Grid Section */}
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-1">
            {/* Card 1 */}
            <Card
              className="p-6 hover:shadow-xl transition cursor-pointer text-center"
              onClick={() => router.push("/recruiter/post-job")}
            >
              <CardTitle className="text-lg font-semibold">
                💼 Post a Job
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Create and publish a new job listing instantly.
              </p>
            </Card>

            {/* Card 2 */}
            <Card
              className="p-6 hover:shadow-xl transition cursor-pointer text-center"
              onClick={() => router.push("/recruiter/manage-jobs")}
            >
              <CardTitle className="text-lg font-semibold">
                📋 Manage Jobs
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Edit, pause, or close your active job posts.
              </p>
            </Card>

            {/* Card 3 */}
            <Card
              className="p-6 hover:shadow-xl transition cursor-pointer text-center"
              onClick={() => router.push("/recruiter/applications")}
            >
              <CardTitle className="text-lg font-semibold">
                🧑‍💼 View Applications
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Review and shortlist candidates who have applied.
              </p>
            </Card>

            {/* Card 4 */}
            <Card
              className="p-6 hover:shadow-xl transition cursor-pointer text-center"
              onClick={() => router.push("/recruiter/schedule-interviews")}
            >
              <CardTitle className="text-lg font-semibold">
                📅 Schedule Interviews
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Set up interview slots and invite selected candidates.
              </p>
            </Card>

            {/* Card 5 */}
            <Card
              className="p-6 hover:shadow-xl transition cursor-pointer text-center"
              onClick={() => router.push("/recruiter/analytics")}
            >
              <CardTitle className="text-lg font-semibold">
                📊 Analytics & Insights
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Track hiring performance and candidate trends.
              </p>
            </Card>

            {/* Card 6 */}
            <Card
              className="p-6 hover:shadow-xl transition cursor-pointer text-center"
              onClick={() => router.push("/recruiter/profile")}
            >
              <CardTitle className="text-lg font-semibold">
                ⚙️ My Profile
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Manage your company details and recruiter settings.
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
