

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   LayoutDashboard,
//   Users,
//   Briefcase,
//   FileBarChart,
//   Settings,
//   LogOut,
//   UserCheck,
//   Plus,
// } from "lucide-react";

// export default function RecruiterDashboard() {
//   const router = useRouter();
//   const [recruiterName] = useState("Saurabh Gupta");
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [recruiterId, setRecruiterId] = useState<number | null>(null);
//   const [role, setRole] = useState<string | null>(null);
//   const [photo, setPhoto] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedId = localStorage.getItem("recruiterId");
//       setRecruiterId(storedId ? Number(storedId) : 5);

//       const storedRole = localStorage.getItem("role");
//       setRole(storedRole ? storedRole.toUpperCase() : null);
//     }
//   }, []);

//   useEffect(() => {
//   const storedUser = localStorage.getItem("user");
//   if (!storedUser) return;

//   const parsed = JSON.parse(storedUser);
//   const id = parsed.email || parsed.id || "defaultRecruiter";

//   const savedPhoto = localStorage.getItem(`recruiterPhoto_${id}`);
//   if (savedPhoto) setPhoto(savedPhoto);
// }, []);

//   const [jobData, setJobData] = useState({
//     title: "",
//     description: "",
//     skillsRequired: "",
//     location: "",
//     experienceLevel: "",
//     salaryRange: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => setJobData({ ...jobData, [e.target.name]: e.target.value });

//   const handleLogout = () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("token");
//       localStorage.removeItem("recruiterId");
//       localStorage.removeItem("role");
//     }
//     router.push("/auth/login");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!recruiterId) return alert("⚠️ Recruiter ID missing!");

//     if (!role || (role !== "RECRUITER" && role !== "ADMIN")) {
//       return alert("❌ Only recruiters or admins can post jobs!");
//     }

//     const { title, description, skillsRequired, location, experienceLevel, salaryRange } = jobData;
//     if (!title || !description || !skillsRequired || !location || !experienceLevel || !salaryRange) {
//       return alert("⚠️ Please fill all fields");
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const payload = {
//         recruiterId,
//         title,
//         description,
//         skillsRequired,
//         location,
//         experienceLevel,
//         salaryRange,
//       };

//       await axios.post("http://localhost:8080/api/jobs/create", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("✅ Job Created!");
//       setOpen(false);

//       setJobData({
//         title: "",
//         description: "",
//         skillsRequired: "",
//         location: "",
//         experienceLevel: "",
//         salaryRange: "",
//       });
//     } catch (error: any) {
//       alert(`❌ Failed to create job`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoToJobs = async () => {
//     if (!recruiterId) return alert("⚠️ Recruiter ID missing!");

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         `http://localhost:8080/api/jobs/recruiter/${recruiterId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const { data } = response.data;
//       sessionStorage.setItem("recruiterJobs", JSON.stringify(data || []));

//       if (data?.length > 0) {
//         router.push("/dashboard/recruiter/jobs");
//       } else {
//         alert("⚠️ No jobs found. Create one.");
//       }
//     } catch {
//       alert("❌ Failed to fetch jobs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      
//       {/* Sidebar */}
//       <aside className="md:w-64 w-full flex flex-col justify-between border-r bg-card shadow-sm h-auto md:h-screen">
        
//            <div className="p-6 border-b flex items-center gap-4">
//       <img
//         src={photo || "/default-avatar.png"}
//         className="w-14 h-14 rounded-full border object-cover"
//         alt="Recruiter"
//       />
//       <div>
//         <h2 className="text-lg font-semibold">Recruiter Panel</h2>
//         <p className="text-sm text-muted-foreground">Welcome, {recruiterName}</p>
//       </div>
//           {/* ⭐ UPDATED SIDEBAR */}
//           <nav className="flex flex-col p-4 space-y-2">

//             <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard/recruiter")}>
//               <LayoutDashboard className="mr-3 h-5 w-5" />
//               Dashboard Overview
//             </Button>

//             {/* NEW ➤ Create Profile */}
//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => router.push("/dashboard/recruiter/create-profile")}
//             >
//               <UserCheck className="mr-3 h-5 w-5" />
//               Create Profile
//             </Button>

//             {/* NEW ➤ Update Profile */}
//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => router.push("/dashboard/recruiter/update-profile")}
//             >
//               <Settings className="mr-3 h-5 w-5" />
//               Update Profile
//             </Button>

//             <Button variant="ghost" className="w-full justify-start" onClick={handleGoToJobs}>
//               <Briefcase className="mr-3 h-5 w-5" />
//               {loading ? "Loading..." : "Manage Job Posts"}
//             </Button>

//             <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard/recruiter/applicants")}>
//               <Users className="mr-3 h-5 w-5" />
//               View Applicants
//             </Button>

//             <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard/recruiter/reports")}>
//               <FileBarChart className="mr-3 h-5 w-5" />
//               Reports & Analytics
//             </Button>

//             <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard/recruiter/settings")}>
//               <Settings className="mr-3 h-5 w-5" />
//               Settings
//             </Button>
//           </nav>
//         </div>

//         <div className="p-4 border-t">
//           <Button variant="destructive" className="w-full" onClick={handleLogout}>
//             <LogOut className="mr-2 h-5 w-5" /> Logout
//           </Button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 md:p-10 overflow-y-auto">
//         <div className="w-full max-w-6xl space-y-8">

//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
//             <Button onClick={() => setOpen(true)} className="flex items-center">
//               <Plus className="mr-2 h-5 w-5" />
//               Create Job
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Briefcase className="mr-2 h-5 w-5" /> Manage Job Posts
//                 </CardTitle>
//                 <CardDescription>Create, update, delete job openings.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button onClick={handleGoToJobs} className="w-full" variant="outline">
//                   Go to Job Posts
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Users className="mr-2 h-5 w-5" /> Applicants
//                 </CardTitle>
//                 <CardDescription>Manage applications.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button onClick={() => router.push("/dashboard/recruiter/applicants")} className="w-full" variant="outline">
//                   View Applicants
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <FileBarChart className="mr-2 h-5 w-5" /> Reports
//                 </CardTitle>
//                 <CardDescription>Track hiring performance.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button onClick={() => router.push("/dashboard/recruiter/reports")} className="w-full" variant="outline">
//                   View Reports
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       {/* Job Dialog */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Create a New Job Post</DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label>Job Title</Label>
//               <Input name="title" value={jobData.title} onChange={handleChange} required />
//             </div>

//             <div>
//               <Label>Description</Label>
//               <Textarea name="description" value={jobData.description} onChange={handleChange} required />
//             </div>

//             <div>
//               <Label>Skills Required</Label>
//               <Input name="skillsRequired" value={jobData.skillsRequired} onChange={handleChange} required />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Location</Label>
//                 <Input name="location" value={jobData.location} onChange={handleChange} required />
//               </div>
//               <div>
//                 <Label>Experience Level</Label>
//                 <Input name="experienceLevel" value={jobData.experienceLevel} onChange={handleChange} required />
//               </div>
//             </div>

//             <div>
//               <Label>Salary Range</Label>
//               <Input name="salaryRange" value={jobData.salaryRange} onChange={handleChange} required />
//             </div>

//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Creating..." : "Create Job"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }
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
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [photo, setPhoto] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [recruiterId, setRecruiterId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    location: "",
    experienceLevel: "",
    salaryRange: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("recruiterId");
      setRecruiterId(storedId ? Number(storedId) :5);

      const storedRole = localStorage.getItem("role");
      setRole(storedRole ? storedRole.toUpperCase() : null);
    }
  }, []);

  // Load recruiter photo
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser);
    const id = parsed.email || parsed.id || "defaultRecruiter";

    const savedPhoto = localStorage.getItem(`recruiterPhoto_${id}`);
    if (savedPhoto) setPhoto(savedPhoto);
  }, []);

  const handleChange = (e: any) =>
    setJobData({ ...jobData, [e.target.name]: e.target.value });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("recruiterId");
    localStorage.removeItem("role");
    router.push("/auth/login");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!recruiterId) return alert("Recruiter ID not found");
    if (!role || (role !== "RECRUITER" && role !== "ADMIN"))
      return alert("Only recruiters can post jobs");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/jobs/create",
        {
          recruiterId,
          ...jobData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job Created Successfully");
      setOpen(false);

      setJobData({
        title: "",
        description: "",
        skillsRequired: "",
        location: "",
        experienceLevel: "",
        salaryRange: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToJobs = async () => {
    if (!recruiterId) return alert("Recruiter ID missing!");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/api/jobs/recruiter/${recruiterId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data } = response.data;
      sessionStorage.setItem("recruiterJobs", JSON.stringify(data || []));

      if (data?.length > 0) {
        router.push("/dashboard/recruiter/jobs");
      } else {
        alert("No jobs found. Create one.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* SIDEBAR */}
      <aside className="w-64 border-r bg-white shadow-sm flex flex-col justify-between">

        {/* Profile top */}
        <div>
          <div className="p-6 border-b flex items-center gap-4">
            <img
              src={photo || "/default-avatar.png"}
              className="w-14 h-14 rounded-full border shadow object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold leading-tight">Recruiter Panel</h2>
              <p className="text-sm text-muted-foreground leading-tight">
                Welcome, {recruiterName}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col p-4 space-y-1">

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
              onClick={() => router.push("/dashboard/recruiter/create-profile")}
            >
              <UserCheck className="mr-3 h-5 w-5" />
              Create Profile
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/update-profile")}
            >
              <Settings className="mr-3 h-5 w-5" />
              Update Profile
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleGoToJobs}
            >
              <Briefcase className="mr-3 h-5 w-5" />
              Manage Job Posts
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/recruiter/applicants")}
            >
              <Users className="mr-3 h-5 w-5" />
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

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">

        <div className="max-w-6xl mx-auto space-y-10">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

            <Button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 shadow"
            >
              <Plus className="h-5 w-5" />
              Create Job
            </Button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5" />
                  Manage Job Posts
                </CardTitle>
                <CardDescription>
                  Create, update, delete job openings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGoToJobs}
                  className="w-full"
                  variant="outline"
                >
                  Go to Job Posts
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Applicants
                </CardTitle>
                <CardDescription>
                  Manage applications.
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

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileBarChart className="h-5 w-5" />
                  Reports
                </CardTitle>
                <CardDescription>
                  Track hiring performance.
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

          </div>
        </div>
      </main>

      {/* CREATE JOB DIALOG */}
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
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Skills Required</Label>
              <Input
                name="skillsRequired"
                value={jobData.skillsRequired}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Experience Level</Label>
                <Input
                  name="experienceLevel"
                  value={jobData.experienceLevel}
                  onChange={handleChange}
                  required
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
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
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
