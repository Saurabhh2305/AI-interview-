// // "use client";

// // import {
// //   LayoutDashboard,
// //   FileText,
// //   Settings,
// //   LogOut,
// //   User,
// // } from "lucide-react";
// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// //   CardContent,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Separator } from "@/components/ui/separator";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { motion } from "framer-motion";
// // import { useRouter } from "next/navigation";
// // import { useEffect, useState } from "react";

// // type Job = {
// //   id: number;
// //   title: string;
// //   company: string;
// //   location: string;
// //   type: string;
// //   recruiterId?: number; // Make sure to match backend
// // };

// // export default function UserDashboard() {
// //   const router = useRouter();
// //   const [jobs, setJobs] = useState<Job[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);

// //   useEffect(() => {
// //     async function fetchJobs() {
// //       try {
// //         const res = await fetch("http://localhost:8080/api/jobs/all");
// //         const data = await res.json();
// //         if (data.success) {
// //           setJobs(data.data);
// //         }
// //       } catch (err) {
// //         console.error("Failed to fetch jobs:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     fetchJobs();
// //   }, []);

// //   return (
// //     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
// //       {/* Sidebar */}
// //       <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between fixed md:relative h-screen z-20">
// //         <div>
// //           <div className="p-6 border-b border-gray-200">
// //             <h1 className="text-lg font-bold">User Dashboard</h1>
// //             <p className="text-sm text-gray-500 mt-1">Welcome, Candidate</p>
// //           </div>

// //           <nav className="p-4 space-y-2">
// //             <SidebarLink
// //               icon={<LayoutDashboard size={18} />}
// //               text="Overview"
// //               active
// //               onClick={() => router.push("/dashboard/user")}
// //             />
// //             <SidebarLink
// //               icon={<FileText size={18} />}
// //               text="My Applications"
// //               onClick={() => router.push("/dashboard/user/applications")}
// //             />
// //             <SidebarLink
// //               icon={<Settings size={18} />}
// //               text="Settings"
// //               onClick={() => router.push("/dashboard/user/settings")}
// //             />
// //           </nav>
// //         </div>

// //         <div className="p-4 border-t border-gray-200">
// //           <Button
// //             variant="destructive"
// //             className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
// //           >
// //             <LogOut size={16} /> Logout
// //           </Button>
// //         </div>
// //       </aside>

// //       {/* Main Content */}
// //       <main className="flex-1 md:ml-64 p-6 md:p-8">
// //         <ScrollArea className="h-[calc(100vh-2rem)] pr-2">
// //           {/* Header */}
// //           <div className="flex flex-col md:flex-row items-center justify-between mb-8">
// //             <div>
// //               <h1 className="text-3xl font-bold flex items-center">
// //                 <User className="mr-3 h-7 w-7 text-gray-600" />
// //                 Profile Overview
// //               </h1>
// //               <p className="text-gray-500 mt-1">
// //                 Manage your account and track your job applications.
// //               </p>
// //             </div>
// //             <Avatar className="w-14 h-14 border shadow mt-4 md:mt-0">
// //               <AvatarImage src="/avatar.png" />
// //               <AvatarFallback>U</AvatarFallback>
// //             </Avatar>
// //           </div>

// //           <Separator className="mb-8 bg-gray-200" />

// //           {/* Dashboard Cards */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.3 }}
// //             className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
// //           >
// //             {/* My Applications Card */}
// //             <Card className="hover:shadow-lg transition-all border-gray-200">
// //               <CardHeader>
// //                 <CardTitle>My Applications</CardTitle>
// //                 <CardDescription>
// //                   Review your submitted job applications.
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <Button
// //                   onClick={() => router.push("/dashboard/user/applications")}
// //                   className="w-full mt-2 bg-black text-white hover:bg-gray-800"
// //                 >
// //                   View Applications
// //                 </Button>
// //               </CardContent>
// //             </Card>

// //             {/* Jobs Card */}
// //             <Card className="hover:shadow-lg transition-all border-gray-200">
// //               <CardHeader>
// //                 <CardTitle>Jobs</CardTitle>
// //                 <CardDescription>
// //                   View and manage job listings.
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 {loading ? (
// //                   <p className="text-gray-500">Loading jobs...</p>
// //                 ) : jobs.length === 0 ? (
// //                   <p className="text-gray-500">No jobs available</p>
// //                 ) : (
// //                   <ul className="space-y-2 max-h-48 overflow-y-auto">
// //                     {jobs.map((job) => (
// //                       <li
// //                         key={job.id}
// //                         className="p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
// //                         onClick={() =>
// //                           router.push(`/dashboard/user/jobs/${job.id}`)
// //                         }
// //                       >
// //                         <p className="font-medium">{job.title}</p>
// //                         <p className="text-sm text-gray-500">{job.company}</p>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 )}

// //                 {/* Updated Go to Jobs Button */}
// //                 <Button
// //                   onClick={async () => {
// //                     try {
// //                       // Get token from localStorage (or wherever you store it)
// //                       const token = localStorage.getItem("token");

// //                       const res = await fetch("http://localhost:8080/api/jobs/all", {
// //                         headers: {
// //                           "Content-Type": "application/json",
// //                           Authorization: `Bearer ${token}`, // Add token here
// //                         },
// //                       });

// //                       const data = await res.json();

// //                       if (data.success) {
// //                         // Filter only recruiter-created jobs
// //                         const recruiterJobs = data.data.filter((job: any) => job.recruiterId);

// //                         // Convert jobs to URL-safe query string
// //                         const query = encodeURIComponent(JSON.stringify(recruiterJobs));

// //                         // Navigate to saved-jobs page with jobs in query
// //                         router.push(`/dashboard/user/saved-jobs?jobs=${query}`);
// //                       }
// //                     } catch (err) {
// //                       console.error("Failed to fetch jobs:", err);
// //                     }
// //                   }}
// //                   className="w-full mt-4 bg-black text-white hover:bg-gray-800"
// //                 >
// //                   Go to Jobs
// //                 </Button>

// //               </CardContent>
// //             </Card>

// //             {/* Profile Settings Card */}
// //             <Card className="hover:shadow-lg transition-all border-gray-200">
// //               <CardHeader>
// //                 <CardTitle>Profile Settings</CardTitle>
// //                 <CardDescription>
// //                   Manage your personal information and preferences.
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <Button
// //                   onClick={() => router.push("/dashboard/user/settings")}
// //                   className="w-full mt-2 bg-black text-white hover:bg-gray-800"
// //                 >
// //                   Open Settings
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           </motion.div>
// //         </ScrollArea>
// //       </main>
// //     </div>
// //   );
// // }

// // /* Sidebar Link Component */
// // function SidebarLink({
// //   icon,
// //   text,
// //   onClick,
// //   active = false,
// // }: {
// //   icon: React.ReactNode;
// //   text: string;
// //   onClick: () => void;
// //   active?: boolean;
// // }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all ${active
// //         ? "bg-black text-white font-medium"
// //         : "text-gray-700 hover:bg-gray-200 hover:text-black"
// //         }`}
// //     >
// //       {icon}
// //       {text}
// //     </button>
// //   );
// // }

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

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedId = localStorage.getItem("recruiterId");
//       if (storedId) setRecruiterId(Number(storedId));
//       else setRecruiterId(3);
//     }
//   }, []);

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
//     }
//     router.push("/auth/login");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:8080/api/jobs/create",
//         { recruiterId, ...jobData },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       alert("✅ Job created successfully!");
//       console.log("Created Job:", response.data);
//       setOpen(false);
//       setJobData({
//         title: "",
//         description: "",
//         skillsRequired: "",
//         location: "",
//         experienceLevel: "",
//         salaryRange: "",
//       });
//     } catch (error) {
//       console.error("Error creating job:", error);
//       alert("❌ Failed to create job. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoToJobs = async () => {
//     if (!recruiterId) {
//       alert("⚠️ Recruiter ID not found!");
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:8080/api/jobs/recruiter/${recruiterId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const { data } = response.data;
//       sessionStorage.setItem("recruiterJobs", JSON.stringify(data || []));
//       if (Array.isArray(data) && data.length > 0) {
//         router.push("/dashboard/recruiter/jobs");
//       } else {
//         alert("⚠️ No jobs found. Please create a new job post first.");
//       }
//     } catch (error) {
//       console.error("Error fetching recruiter jobs:", error);
//       alert("❌ Failed to fetch job list. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
//       {/* Sidebar */}
//       <aside className="md:w-64 w-full flex flex-col justify-between border-b md:border-b-0 md:border-r border-border bg-card shadow-sm md:sticky md:top-0 h-auto md:h-screen">
//         <div>
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-semibold tracking-tight text-foreground">
//               Recruiter Panel
//             </h2>
//             <p className="text-sm text-muted-foreground mt-1">
//               Welcome, {recruiterName}
//             </p>
//           </div>

//           <nav className="flex flex-col p-4 space-y-2">
//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => router.push("/dashboard/recruiter")}
//             >
//               <LayoutDashboard className="mr-3 h-5 w-5" />
//               Dashboard Overview
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={handleGoToJobs}
//               disabled={loading}
//             >
//               <Briefcase className="mr-3 h-5 w-5" />
//               {loading ? "Loading..." : "Manage Job Posts"}
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => router.push("/dashboard/recruiter/applicants")}
//             >
//               <UserCheck className="mr-3 h-5 w-5" />
//               View Applicants
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => router.push("/dashboard/recruiter/reports")}
//             >
//               <FileBarChart className="mr-3 h-5 w-5" />
//               Reports & Analytics
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => router.push("/dashboard/recruiter/settings")}
//             >
//               <Settings className="mr-3 h-5 w-5" />
//               Settings
//             </Button>
//           </nav>
//         </div>

//         {/* Logout pinned to bottom */}
//         <div className="p-4 border-t mt-auto">
//           <Button
//             variant="destructive"
//             className="w-full flex items-center justify-center"
//             onClick={handleLogout}
//           >
//             <LogOut className="mr-2 h-5 w-5" /> Logout
//           </Button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto">
//         <div className="w-full max-w-6xl space-y-8">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
//             <Button onClick={() => setOpen(true)} className="flex items-center">
//               <Plus className="mr-2 h-5 w-5" />
//               Create Job
//             </Button>
//           </div>

//           {/* Dashboard Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <Card className="hover:shadow-md transition">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Briefcase className="mr-2 h-5 w-5" /> Manage Job Posts
//                 </CardTitle>
//                 <CardDescription>
//                   Create, update, or delete job openings easily.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button
//                   onClick={handleGoToJobs}
//                   className="w-full"
//                   variant="outline"
//                   disabled={loading}
//                 >
//                   {loading ? "Loading..." : "Go to Job Posts"}
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-md transition">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <UserCheck className="mr-2 h-5 w-5" /> Applicants
//                 </CardTitle>
//                 <CardDescription>
//                   Review and manage candidate applications.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button
//                   onClick={() => router.push("/dashboard/recruiter/applicants")}
//                   className="w-full"
//                   variant="outline"
//                 >
//                   View Applicants
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-md transition">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <FileBarChart className="mr-2 h-5 w-5" /> Reports
//                 </CardTitle>
//                 <CardDescription>
//                   Track hiring performance and job statistics.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button
//                   onClick={() => router.push("/dashboard/recruiter/reports")}
//                   className="w-full"
//                   variant="outline"
//                 >
//                   View Reports
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-md transition">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Settings className="mr-2 h-5 w-5" /> Account Settings
//                 </CardTitle>
//                 <CardDescription>
//                   Manage your account and preferences.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button
//                   onClick={() => router.push("/dashboard/recruiter/settings")}
//                   className="w-full"
//                   variant="outline"
//                 >
//                   Open Settings
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       {/* Create Job Dialog */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Create a New Job Post</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label>Job Title</Label>
//               <Input
//                 name="title"
//                 value={jobData.title}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., Senior Java Developer"
//               />
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Textarea
//                 name="description"
//                 value={jobData.description}
//                 onChange={handleChange}
//                 required
//                 placeholder="Describe the job role..."
//               />
//             </div>
//             <div>
//               <Label>Skills Required</Label>
//               <Input
//                 name="skillsRequired"
//                 value={jobData.skillsRequired}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., Java, Spring Boot, AWS"
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Location</Label>
//                 <Input
//                   name="location"
//                   value={jobData.location}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g., Bangalore"
//                 />
//               </div>
//               <div>
//                 <Label>Experience Level</Label>
//                 <Input
//                   name="experienceLevel"
//                   value={jobData.experienceLevel}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g., 3-5 years"
//                 />
//               </div>
//             </div>
//             <div>
//               <Label>Salary Range</Label>
//               <Input
//                 name="salaryRange"
//                 value={jobData.salaryRange}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., 10-15 LPA"
//               />
//             </div>

//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>
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

import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  recruiterId?: number;
};

export default function UserDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:8080/api/jobs/all");
        const data = await res.json();
        if (data.success) setJobs(data.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between fixed md:relative h-screen z-20">
        <div>
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-lg font-bold">User Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome, Candidate</p>
          </div>

          <nav className="p-4 space-y-2">
            <SidebarLink
              icon={<LayoutDashboard size={18} />}
              text="Overview"
              active
              onClick={() => router.push("/dashboard/user")}
            />
            <SidebarLink
              icon={<FileText size={18} />}
              text="My Applications"
              onClick={() => router.push("/dashboard/user/applications")}
            />
            <SidebarLink
              icon={<Settings size={18} />}
              text="Settings"
              onClick={() => router.push("/dashboard/user/settings")}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 flex justify-center items-center">
        <ScrollArea className="w-full h-[calc(100vh-2rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <User className="mr-3 h-7 w-7 text-gray-600" />
                  Profile Overview
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your account and track your job applications.
                </p>
              </div>
              <Avatar className="w-14 h-14 border shadow mt-4 md:mt-0">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>

            <Separator className="mb-8 bg-gray-200" />

            {/* Dashboard Cards */}
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center items-start">
              {/* My Applications */}
              <Card className="hover:shadow-lg transition-all border-gray-200">
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>
                    Review your submitted job applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push("/dashboard/user/applications")}
                    className="w-full mt-2 bg-black text-white hover:bg-gray-800"
                  >
                    View Applications
                  </Button>
                </CardContent>
              </Card>

              {/* Jobs */}
              <Card className="hover:shadow-lg transition-all border-gray-200">
                <CardHeader>
                  <CardTitle>Jobs</CardTitle>
                  <CardDescription>
                    View and manage job listings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500">Loading jobs...</p>
                  ) : jobs.length === 0 ? (
                    <p className="text-gray-500">No jobs available</p>
                  ) : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                      {jobs.map((job) => (
                        <li
                          key={job.id}
                          className="p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
                          onClick={() =>
                            router.push(`/dashboard/user/jobs/${job.id}`)
                          }
                        >
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-500">{job.company}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                          "http://localhost:8080/api/jobs/all",
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        const data = await res.json();
                        if (data.success) {
                          const recruiterJobs = data.data.filter(
                            (job: any) => job.recruiterId
                          );
                          const query = encodeURIComponent(
                            JSON.stringify(recruiterJobs)
                          );
                          router.push(
                            `/dashboard/user/saved-jobs?jobs=${query}`
                          );
                        }
                      } catch (err) {
                        console.error("Failed to fetch jobs:", err);
                      }
                    }}
                    className="w-full mt-4 bg-black text-white hover:bg-gray-800"
                  >
                    Go to Jobs
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Settings */}
              <Card className="hover:shadow-lg transition-all border-gray-200">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push("/dashboard/user/settings")}
                    className="w-full mt-2 bg-black text-white hover:bg-gray-800"
                  >
                    Open Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </ScrollArea>
      </main>
    </div>
  );
}

/* Sidebar Link Component */
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
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all ${
        active
          ? "bg-black text-white font-medium"
          : "text-gray-700 hover:bg-gray-200 hover:text-black"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

