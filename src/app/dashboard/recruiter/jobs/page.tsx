// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import {
//   LayoutDashboard,
//   Briefcase,
//   Users,
//   FileBarChart,
//   Settings,
//   LogOut,
//   ArrowLeft,
//   Plus,
// } from "lucide-react";

// export default function RecruiterJobsPage() {
//   const router = useRouter();
//   const [jobs, setJobs] = useState<any[]>([]);

//   useEffect(() => {
//     const storedJobs = sessionStorage.getItem("recruiterJobs");
//     if (storedJobs) {
//       setJobs(JSON.parse(storedJobs));
//     } else {
//       alert("⚠️ No job data found. Redirecting...");
//       router.push("/dashboard/recruiter");
//     }
//   }, [router]);

//   return (
//     <div className="flex min-h-screen bg-background text-foreground">
//       {/* ─── Sidebar ─────────────────────────────────────────────── */}
//       <aside className="hidden md:flex md:w-64 flex-col justify-between bg-card border-r shadow-sm fixed h-full">
//         <div>
//           <div className="p-6 border-b">
//             <h1 className="text-xl font-semibold text-primary">Recruiter Panel</h1>
//             <p className="text-sm text-muted-foreground mt-1">Welcome, Saurabh Gupta</p>
//           </div>

//           <nav className="p-4 space-y-1">
//             <SidebarItem
//               icon={<LayoutDashboard size={18} />}
//               label="Dashboard Overview"
//               onClick={() => router.push("/dashboard/recruiter")}
//             />
//             <SidebarItem
//               icon={<Briefcase size={18} />}
//               label="Manage Job Posts"
//               active
//               onClick={() => router.push("/dashboard/recruiter/jobs")}
//             />
//             <SidebarItem
//               icon={<Users size={18} />}
//               label="View Applicants"
//               onClick={() => router.push("/dashboard/recruiter/applicants")}
//             />
//             <SidebarItem
//               icon={<FileBarChart size={18} />}
//               label="Reports & Analytics"
//               onClick={() => router.push("/dashboard/recruiter/reports")}
//             />
//             <SidebarItem
//               icon={<Settings size={18} />}
//               label="Settings"
//               onClick={() => router.push("/dashboard/recruiter/settings")}
//             />
//           </nav>
//         </div>

//         <div className="p-4 border-t">
//           <Button
//             variant="destructive"
//             className="w-full flex items-center justify-center gap-2"
//           >
//             <LogOut size={16} /> Logout
//           </Button>
//         </div>
//       </aside>

//       {/* ─── Main Content ───────────────────────────────────────────── */}
//       <ScrollArea className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-10 py-8">
//         <div className="max-w-6xl mx-auto w-full">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center text-primary">
//                 <Briefcase className="mr-3 h-7 w-7 text-primary" />
//                 Your Job Posts
//               </h1>
//               <p className="text-muted-foreground mt-1">
//                 Manage and review your active job listings.
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <Button
//                 variant="outline"
//                 className="flex items-center"
//                 onClick={() => router.push("/dashboard/recruiter")}
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//               </Button>

             
//             </div>
//           </div>

//           <Separator className="mb-8" />

//           {/* Job List Section */}
//           {jobs.length > 0 ? (
//             <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {jobs.map((job) => (
//                 <Card
//                   key={job.jobId}
//                   className="hover:shadow-md border border-border transition-all duration-200 rounded-xl"
//                 >
//                   <CardHeader>
//                     <CardTitle className="text-lg text-primary font-semibold truncate">
//                       {job.title}
//                     </CardTitle>
//                     <CardDescription>{job.location}</CardDescription>
//                   </CardHeader>

//                   <CardContent className="space-y-2 text-sm text-muted-foreground">
//                     <p>
//                       <strong className="text-foreground">Description:</strong>{" "}
//                       {job.description}
//                     </p>
//                     <p>
//                       <strong className="text-foreground">Skills:</strong>{" "}
//                       {job.skillsRequired}
//                     </p>
//                     <p>
//                       <strong className="text-foreground">Experience:</strong>{" "}
//                       {job.experienceLevel}
//                     </p>
//                     <p>
//                       <strong className="text-foreground">Salary:</strong>{" "}
//                       {job.salaryRange}
//                     </p>
//                   </CardContent>

//                   <CardFooter className="flex justify-end">
//                     <Button
//                       variant="outline"
//                       className="text-primary border-border hover:bg-accent hover:text-accent-foreground transition"
//                     >
//                       View Applicants
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-24 text-center">
//               <h2 className="text-xl font-semibold text-foreground">
//                 No jobs found yet.
//               </h2>
//               <p className="text-muted-foreground mt-2">
//                 Create a new job from your dashboard to get started!
//               </p>
//               <Button
//                 className="mt-4"
//                 onClick={() => router.push("/dashboard/recruiter")}
//               >
//                 Back to Dashboard
//               </Button>
//             </div>
//           )}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }

// /* ─── Sidebar Item ───────────────────────────────────────────── */
// function SidebarItem({
//   icon,
//   label,
//   onClick,
//   active = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   onClick: () => void;
//   active?: boolean;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-all ${
//         active
//           ? "bg-accent text-accent-foreground"
//           : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileBarChart,
  Settings,
  ArrowLeft,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RecruiterJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editJob, setEditJob] = useState<any>(null);

  // Load Jobs From Session
  useEffect(() => {
    const storedJobs = sessionStorage.getItem("recruiterJobs");
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }
  }, []);

  // Open Edit Dialog
  const startEdit = (job: any) => {
    setEditJob(job);
    setOpenEdit(true);
  };

  // Update Form Inputs
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEditJob((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------- UPDATE JOB API CALL ----------
const handleUpdateJob = async () => {
  try {
    const jobId = editJob.jobId;

    const payload = {
      recruiterId: editJob.recruiterId,
      title: editJob.title,
      description: editJob.description,
      skillsRequired: editJob.skillsRequired,
      location: editJob.location,
      experienceLevel: editJob.experienceLevel,
      salaryRange: editJob.salaryRange,
      isActive: true,
    };

    // BACKEND URL FIXED
    const API_URL = `http://localhost:8080/api/jobs/${jobId}?recruiterId=${editJob.recruiterId}`;

    const response = await axios.put(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // If required
      },
    });

    if (response.data.success) {
     
      toast("✅ Job Updated Successfully!")

      const updatedJobs = jobs.map((job) =>
        job.jobId === jobId ? response.data.data : job
      );

      setJobs(updatedJobs);
      sessionStorage.setItem("recruiterJobs", JSON.stringify(updatedJobs));
      setOpenEdit(false);
    } else {
      toast("❌ Update failed!");
    }
  } catch (error) {
    console.error(error);
    toast("❌ Error updating job");
  }
};



  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between bg-card border-r shadow-sm fixed h-full">
        <div>
          <div className="p-6 border-b">
            <h1 className="text-xl font-semibold text-primary">
              Recruiter Panel
            </h1>
          </div>

          <nav className="p-4 space-y-1">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard Overview"
              onClick={() => router.push("/dashboard/recruiter")}
            />
            <SidebarItem
              icon={<Briefcase size={18} />}
              label="Manage Job Posts"
              active
              onClick={() => router.push("/dashboard/recruiter/jobs")}
            />
            <SidebarItem
              icon={<Users size={18} />}
              label="View Applicants"
              onClick={() => router.push("/dashboard/recruiter/applicants")}
            />
            <SidebarItem
              icon={<FileBarChart size={18} />}
              label="Reports & Analytics"
              onClick={() => router.push("/dashboard/recruiter/reports")}
            />
            <SidebarItem
              icon={<Settings size={18} />}
              label="Settings"
              onClick={() => router.push("/dashboard/recruiter/settings")}
            />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <ScrollArea className="flex-1 md:ml-64 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center text-primary">
              <Briefcase className="mr-3 h-7 w-7" /> Your Job Posts
            </h1>

            <Button variant="outline" onClick={() => router.push("/dashboard/recruiter")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>

          <Separator className="mb-8" />

          {/* JOB LIST */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.jobId} className="rounded-xl border">
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.location}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>Description:</strong> {job.description}
                  </p>
                  <p>
                    <strong>Skills:</strong> {job.skillsRequired}
                  </p>
                  <p>
                    <strong>Experience:</strong> {job.experienceLevel}
                  </p>
                  <p>
                    <strong>Salary:</strong> {job.salaryRange}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => startEdit(job)}>
                    Edit Job
                  </Button>

                  <Button 
  variant="secondary" 
  onClick={() => router.push("/dashboard/recruiter/applicants")}
>
  Applicants
</Button>

                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* EDIT JOB POPUP */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>

          {editJob && (
            <div className="space-y-4">
              <Field label="Job Title" name="title" value={editJob.title} onChange={handleChange} />
              <Field label="Description" name="description" value={editJob.description} onChange={handleChange} />
              <Field label="Skills Required" name="skillsRequired" value={editJob.skillsRequired} onChange={handleChange} />
              <Field label="Location" name="location" value={editJob.location} onChange={handleChange} />
              <Field label="Experience Level" name="experienceLevel" value={editJob.experienceLevel} onChange={handleChange} />
              <Field label="Salary Range" name="salaryRange" value={editJob.salaryRange} onChange={handleChange} />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateJob}>Update Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Reusable Input Component */
function Field({ label, name, value, onChange }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={onChange} />
    </div>
  );
}

/* Sidebar Component */
function SidebarItem({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
