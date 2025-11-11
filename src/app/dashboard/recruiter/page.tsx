"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileBarChart,
  Settings,
  LogOut,
  UserCheck,
  Plus,
} from "lucide-react";

export default function RecruiterDashboard() {
  const router = useRouter();
  const [recruiterName] = useState("Saurabh Gupta");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [recruiterId, setRecruiterId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("recruiterId");
      setRecruiterId(storedId ? Number(storedId) : 5);
      const storedRole = localStorage.getItem("role");
      setRole(storedRole ? storedRole.toUpperCase() : null);
    }
  }, []);

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    location: "",
    experienceLevel: "",
    salaryRange: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setJobData({ ...jobData, [e.target.name]: e.target.value });

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("recruiterId");
      localStorage.removeItem("role");
    }
    router.push("/auth/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recruiterId) {
      alert("⚠️ Recruiter ID is missing!");
      return;
    }

    // Check user role before sending request
    if (!role || (role !== "RECRUITER" && role !== "ADMIN")) {
      alert("❌ Only recruiters or admins can post jobs!");
      return;
    }

    // Frontend validation for empty fields
    const { title, description, skillsRequired, location, experienceLevel, salaryRange } = jobData;
    if (!title || !description || !skillsRequired || !location || !experienceLevel || !salaryRange) {
      alert("⚠️ Please fill in all the fields!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please login again.");

      const payload = {
        recruiterId: Number(recruiterId),
        title,
        description,
        skillsRequired,
        location,
        experienceLevel,
        salaryRange,
      };

      console.log("Sending job data:", payload);

      const response = await axios.post(
        "http://localhost:8080/api/jobs/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Job created successfully!");
      console.log("Created Job:", response.data);

      setOpen(false);
      setJobData({
        title: "",
        description: "",
        skillsRequired: "",
        location: "",
        experienceLevel: "",
        salaryRange: "",
      });
    } catch (error: any) {
      console.error("Error creating job:", error.response?.data || error.message);
      alert(`❌ Failed to create job: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToJobs = async () => {
    if (!recruiterId) {
      alert("⚠️ Recruiter ID not found!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/jobs/recruiter/${recruiterId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = response.data;
      sessionStorage.setItem("recruiterJobs", JSON.stringify(data || []));
      if (Array.isArray(data) && data.length > 0) {
        router.push("/dashboard/recruiter/jobs");
      } else {
        alert("⚠️ No jobs found. Please create a new job post first.");
      }
    } catch (error) {
      console.error("Error fetching recruiter jobs:", error);
      alert("❌ Failed to fetch job list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* Sidebar */}
      <aside className="md:w-64 w-full flex flex-col justify-between border-b md:border-b-0 md:border-r border-border bg-card shadow-sm md:sticky md:top-0 h-auto md:h-screen">
        <div>
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Recruiter Panel
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {recruiterName}
            </p>
          </div>

          <nav className="flex flex-col p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter")}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard Overview
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleGoToJobs}
              disabled={loading}
            >
              <Briefcase className="mr-3 h-5 w-5" />
              {loading ? "Loading..." : "Manage Job Posts"}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/applicants")}
            >
              <UserCheck className="mr-3 h-5 w-5" />
              View Applicants
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/reports")}
            >
              <FileBarChart className="mr-3 h-5 w-5" />
              Reports & Analytics
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/settings")}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Logout pinned to bottom */}
        <div className="p-4 border-t mt-auto">
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
      <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto">
        <div className="w-full max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
            <Button onClick={() => setOpen(true)} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create Job
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Manage Job Posts
                </CardTitle>
                <CardDescription>
                  Create, update, or delete job openings easily.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGoToJobs}
                  className="w-full"
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Go to Job Posts"}
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" /> Applicants
                </CardTitle>
                <CardDescription>
                  Review and manage candidate applications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/dashboard/recruiter/applicants")}
                  className="w-full"
                  variant="outline"
                >
                  View Applicants
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileBarChart className="mr-2 h-5 w-5" /> Reports
                </CardTitle>
                <CardDescription>
                  Track hiring performance and job statistics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/dashboard/recruiter/reports")}
                  className="w-full"
                  variant="outline"
                >
                  View Reports
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/dashboard/recruiter/settings")}
                  className="w-full"
                  variant="outline"
                >
                  Open Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Create Job Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a New Job Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <Input
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Java Developer"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
                placeholder="Describe the job role..."
              />
            </div>
            <div>
              <Label>Skills Required</Label>
              <Input
                name="skillsRequired"
                value={jobData.skillsRequired}
                onChange={handleChange}
                required
                placeholder="e.g., Java, Spring Boot, AWS"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Bangalore"
                />
              </div>
              <div>
                <Label>Experience Level</Label>
                <Input
                  name="experienceLevel"
                  value={jobData.experienceLevel}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 3-5 years"
                />
              </div>
            </div>
            <div>
              <Label>Salary Range</Label>
              <Input
                name="salaryRange"
                value={jobData.salaryRange}
                onChange={handleChange}
                required
                placeholder="e.g., 10-15 LPA"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
