

// "use client";

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   LayoutDashboard,
//   Bookmark,
//   BarChart2,
//   Settings,
//   LogOut,
//   Loader2,
//   RotateCcw,
//   Users,
//   Search,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";

// interface Application {
//   applicationId: string;
//   jobId: string;
//   jobTitle: string;
//   candidateName: string;
//   userId: string;
//   appliedAt: string;
//   status: "Pending" | "Accepted" | "Rejected";
// }

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// export default function RecruiterApplicantsPage() {
//   const router = useRouter();

//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loadingJob, setLoadingJob] = useState(false);
//   const [loadingTitle, setLoadingTitle] = useState(false);
//   const [error, setError] = useState("");

//   const [userName, setUserName] = useState("");
//   const [jobId, setJobId] = useState("");
//   const [jobTitle, setJobTitle] = useState("");

//   // Load recruiter/user
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const user = storedUser ? JSON.parse(storedUser) : null;

//     if (!user) {
//       setError("User not found. Please login again.");
//       return;
//     }

//     setUserName(user.name || "Recruiter");
//   }, []);

//   // Fetch applications by job ID
//   const fetchApplicationsByJobId = async () => {
//     if (!jobId.trim()) {
//       setError("Please enter a Job ID");
//       return;
//     }

//     setLoadingJob(true);
//     setError("");

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/applications/job/${jobId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const result = await res.json();

//       if (res.ok && result.success) {
//         setApplications(result.data || []);
//         if (result.data.length === 0) setError("No applications found for this Job ID.");
//       } else {
//         setApplications([]);
//         setError(result.message || "Invalid Job ID.");
//       }
//     } catch {
//       setError("Failed to fetch applications for this Job ID.");
//     }

//     setLoadingJob(false);
//   };

//   // Fetch applications by job title
//   const fetchApplicationsByJobTitle = async () => {
//     if (!jobTitle.trim()) {
//       setError("Please enter a Job Title");
//       return;
//     }

//     setLoadingTitle(true);
//     setError("");

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/applications/job/title/${jobTitle}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const result = await res.json();

//       if (res.ok && result.success) {
//         setApplications(result.data || []);
//         if (result.data.length === 0) setError("No applications found for this Job Title.");
//       } else {
//         setApplications([]);
//         setError(result.message || "Invalid Job Title.");
//       }
//     } catch {
//       setError("Failed to fetch applications for this Job Title.");
//     }

//     setLoadingTitle(false);
//   };

//   // Reset both searches
//   const resetFilters = () => {
//     setJobId("");
//     setJobTitle("");
//     setApplications([]);
//     setError("");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     router.push("/login");
//   };

//   return (
//     <div className="flex bg-slate-50 min-h-screen text-slate-900">
//       {/* Sidebar */}
//       <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
//         <div>
//           <div className="p-6 border-b border-slate-200">
//             <h2 className="text-lg font-semibold">Recruiter Panel</h2>
//             <p className="text-sm text-slate-500">Welcome, {userName}</p>
//           </div>

//           <nav className="p-4 space-y-2">
//             <SidebarLink
//               icon={<LayoutDashboard size={18} />}
//               text="Dashboard Overview"
//               onClick={() => router.push("/dashboard/recruiter")}
//             />
//             <SidebarLink icon={<Users size={18} />} text="Applicants" active />
//             <SidebarLink
//               icon={<Bookmark size={18} />}
//               text="Posted Jobs"
//               onClick={() => router.push("/dashboard/recruiter/jobs")}
//             />
//             <SidebarLink icon={<BarChart2 size={18} />} text="Analytics" />
//             <SidebarLink icon={<Settings size={18} />} text="Settings" />
//           </nav>
//         </div>

//         <div className="p-4 border-t border-slate-200">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
//           >
//             <LogOut size={16} />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 ml-64 p-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
//             <Users className="w-7 h-7 text-slate-600" />
//             Job Applicants
//           </h1>
//           <p className="text-slate-500 mb-8">Search applications by Job ID or Job Title</p>

//           <Separator className="mb-8" />

//           {/* Search Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             {/* Search by Job ID */}
//             <div className="space-y-3">
//               <label className="text-sm font-medium">Search by Job ID</label>
//               <div className="flex gap-2">
//                 <Input
//                   type="number"
//                   placeholder="Enter Job ID"
//                   value={jobId}
//                   onChange={(e) => setJobId(e.target.value)}
//                 />

//                 <Button onClick={fetchApplicationsByJobId} disabled={loadingJob} className="bg-black text-white">
//                   {loadingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={16} />}
//                 </Button>
//               </div>
//             </div>

//             {/* Search by Job Title */}
//             <div className="space-y-3">
//               <label className="text-sm font-medium">Search by Job Title</label>
//               <div className="flex gap-2">
//                 <Input
//                   type="text"
//                   placeholder="Enter Job Title"
//                   value={jobTitle}
//                   onChange={(e) => setJobTitle(e.target.value)}
//                 />

//                 <Button
//                   onClick={fetchApplicationsByJobTitle}
//                   disabled={loadingTitle}
//                   className="bg-black text-white"
//                 >
//                   {loadingTitle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={16} />}
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <Button variant="outline" onClick={resetFilters} className="mb-8 flex gap-2 items-center">
//             <RotateCcw size={16} />
//             Reset Filters
//           </Button>

//           {/* Applications */}
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//             {error ? (
//               <p className="text-red-500 text-center py-8">{error}</p>
//             ) : applications.length === 0 ? (
//               <div className="text-center py-10">
//                 <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-600">No applications found. Try searching above.</p>
//               </div>
//             ) : (
//               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {applications.map((app) => (
//                   <Card key={app.applicationId} className="shadow hover:shadow-xl transition">
//                     <CardHeader>
//                       <CardTitle className="flex justify-between items-center">
//                         {app.jobTitle}
//                         <span
//                           className={`text-xs px-2 py-1 rounded-full ${
//                             app.status === "Accepted"
//                               ? "bg-green-100 text-green-700"
//                               : app.status === "Rejected"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-yellow-100 text-yellow-700"
//                           }`}
//                         >
//                           {app.status}
//                         </span>
//                       </CardTitle>
//                     </CardHeader>

//                     <CardContent className="text-sm text-slate-700 space-y-1">
//                       <p><strong>Applicant:</strong> {app.candidateName}</p>
//                       <p><strong>User ID:</strong> {app.userId}</p>
//                       <p><strong>Job ID:</strong> {app.jobId}</p>
//                       <p><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function SidebarLink({
//   icon,
//   text,
//   onClick,
//   active = false,
// }: {
//   icon: React.ReactNode;
//   text: string;
//   onClick?: () => void;
//   active?: boolean;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition ${
//         active ? "bg-black text-white" : "text-slate-700 hover:bg-slate-100"
//       }`}
//     >
//       {icon}
//       {text}
//     </button>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bookmark,
  BarChart2,
  Settings,
  LogOut,
  Loader2,
  RotateCcw,
  Users,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Simple Modal component (self-contained) using basic markup + framer-motion
interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div>{children}</div>
      </motion.div>
    </div>
  );
}


interface Application {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  userId: string;
  appliedAt: string;
  status: "Pending" | "Accepted" | "Rejected" | string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function RecruiterApplicantsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJob, setLoadingJob] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [error, setError] = useState("");

  const [userName, setUserName] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  // selection / bulk
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // status modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTargetId, setStatusTargetId] = useState<string | null>(null);
  const [statusTargetBulk, setStatusTargetBulk] = useState<boolean>(false);
  const [statusValue, setStatusValue] = useState<"SHORTLISTED" | "REJECTED" | "PENDING">("SHORTLISTED");
  const [statusReason, setStatusReason] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  // schedule modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleApplicationId, setScheduleApplicationId] = useState<string | null>(null);
  const [schType, setSchType] = useState("VIRTUAL");
  const [schStart, setSchStart] = useState("");
  const [schEnd, setSchEnd] = useState("");
  const [schPanel, setSchPanel] = useState(""); // comma separated
  const [schLocation, setSchLocation] = useState("");
  const [schNotes, setSchNotes] = useState("");
  const [schLoading, setSchLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setError("User not found. Please login again.");
      return;
    }

    setUserName(user.name || "Recruiter");
  }, []);

  // Fetch applications by job ID
  const fetchApplicationsByJobId = async () => {
    if (!jobId.trim()) {
      setError("Please enter a Job ID");
      return;
    }

    setLoadingJob(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setApplications(result.data || []);
        setSelectedIds(new Set());
        setSelectAll(false);
        if (result.data.length === 0) setError("No applications found for this Job ID.");
      } else {
        setApplications([]);
        setSelectedIds(new Set());
        setError(result.message || "Invalid Job ID.");
      }
    } catch (e) {
      setApplications([]);
      setError("Failed to fetch applications for this Job ID.");
    }

    setLoadingJob(false);
  };

  // Fetch applications by job title
  const fetchApplicationsByJobTitle = async () => {
    if (!jobTitle.trim()) {
      setError("Please enter a Job Title");
      return;
    }

    setLoadingTitle(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/job/title/${encodeURIComponent(jobTitle)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setApplications(result.data || []);
        setSelectedIds(new Set());
        setSelectAll(false);
        if (result.data.length === 0) setError("No applications found for this Job Title.");
      } else {
        setApplications([]);
        setSelectedIds(new Set());
        setError(result.message || "Invalid Job Title.");
      }
    } catch (e) {
      setApplications([]);
      setError("Failed to fetch applications for this Job Title.");
    }

    setLoadingTitle(false);
  };

  const resetFilters = () => {
    setJobId("");
    setJobTitle("");
    setApplications([]);
    setError("");
    setSelectedIds(new Set());
    setSelectAll(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  function toggleSelect(applicationId: string) {
    const next = new Set(selectedIds);
    if (next.has(applicationId)) next.delete(applicationId);
    else next.add(applicationId);
    setSelectedIds(next);
    setSelectAll(next.size === applications.length && applications.length > 0);
  }

  function toggleSelectAll() {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      setSelectedIds(new Set(applications.map((a) => a.applicationId)));
      setSelectAll(true);
    }
  }

  // Open status modal for single or bulk
  function openStatusModalForSingle(applicationId: string, initialStatus: "SHORTLISTED" | "REJECTED") {
    setStatusTargetId(applicationId);
    setStatusTargetBulk(false);
    setStatusValue(initialStatus);
    setStatusReason("");
    setStatusModalOpen(true);
  }

  function openStatusModalForBulk(initialStatus: "SHORTLISTED" | "REJECTED") {
    if (selectedIds.size === 0) {
      setError("Please select at least one application for bulk action.");
      return;
    }
    setStatusTargetId(null);
    setStatusTargetBulk(true);
    setStatusValue(initialStatus);
    setStatusReason("");
    setStatusModalOpen(true);
  }

  async function submitStatusChange() {
    setStatusLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (statusTargetBulk) {
        // bulk
        const body = {
          applicationIds: Array.from(selectedIds).map((id) => Number(id)),
          status: statusValue,
          reason: statusReason,
        };

        const res = await fetch(`${BACKEND_URL}/api/applications/status/bulk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          // optimistic update locally
          const updated = applications.map((a) =>
            selectedIds.has(a.applicationId) ? { ...a, status: statusValue } : a
          );
          setApplications(updated);
          setSelectedIds(new Set());
          setSelectAll(false);
          setStatusModalOpen(false);
        } else {
          setError(result.message || "Bulk update failed.");
        }
      } else {
        // single
        if (!statusTargetId) throw new Error("No target id");

        const body = {
          status: statusValue,
          reason: statusReason,
        };

        const res = await fetch(`${BACKEND_URL}/api/applications/${statusTargetId}/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          const updated = applications.map((a) =>
            a.applicationId === statusTargetId ? { ...a, status: statusValue } : a
          );
          setApplications(updated);
          setStatusModalOpen(false);
        } else {
          setError(result.message || "Update failed.");
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to update status.");
    }

    setStatusLoading(false);
  }

  // Schedule interview
  function openScheduleModal(applicationId: string) {
    setScheduleApplicationId(applicationId);
    setSchType("VIRTUAL");
    setSchStart("");
    setSchEnd("");
    setSchPanel("");
    setSchLocation("");
    setSchNotes("");
    setScheduleModalOpen(true);
  }

  async function submitSchedule() {
    setSchLoading(true);
    setError("");

    try {
      if (!scheduleApplicationId) throw new Error("No application selected.");
      if (!schStart || !schEnd) throw new Error("Start and end datetime are required.");

      const body = {
        applicationId: Number(scheduleApplicationId),
        type: schType,
        start: schStart,
        end: schEnd,
        panel: schPanel ? schPanel.split(",").map((s) => s.trim()) : [],
        location: schLocation,
        notes: schNotes,
      };

      const res = await fetch(`${BACKEND_URL}/api/interviews/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // optionally update application status locally to "SHORTLISTED" or leave as-is
        const updated = applications.map((a) =>
          a.applicationId === scheduleApplicationId ? { ...a, status: "Interview Scheduled" } : a
        );
        setApplications(updated);
        setScheduleModalOpen(false);
      } else {
        setError(result.message || "Failed to schedule interview.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to schedule interview.");
    }

    setSchLoading(false);
  }

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Recruiter Panel</h2>
            <p className="text-sm text-slate-500">Welcome, {userName}</p>
          </div>

          <nav className="p-4 space-y-2">
            <SidebarLink
              icon={<LayoutDashboard size={18} />}
              text="Dashboard Overview"
              onClick={() => router.push("/dashboard/recruiter")}
            />
            <SidebarLink icon={<Users size={18} />} text="Applicants" active />
            <SidebarLink
              icon={<Bookmark size={18} />}
              text="Posted Jobs"
              onClick={() => router.push("/dashboard/recruiter/jobs")}
            />
            <SidebarLink icon={<BarChart2 size={18} />} text="Analytics" />
            <SidebarLink icon={<Settings size={18} />} text="Settings" />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Users className="w-7 h-7 text-slate-600" />
            Job Applicants
          </h1>
          <p className="text-slate-500 mb-4">Search applications by Job ID or Job Title</p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                <span className="text-sm">Select All</span>
              </label>

              <Button
                onClick={() => openStatusModalForBulk("SHORTLISTED")}
                disabled={selectedIds.size === 0}
                className="bg-green-600 text-white"
              >
                Bulk Shortlist
              </Button>

              <Button
                onClick={() => openStatusModalForBulk("REJECTED")}
                disabled={selectedIds.size === 0}
                className="bg-red-600 text-white"
              >
                Bulk Reject
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={resetFilters} className="flex gap-2 items-center">
                <RotateCcw size={16} /> Reset Filters
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Search by Job ID */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Search by Job ID</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter Job ID"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                />

                <Button onClick={fetchApplicationsByJobId} disabled={loadingJob} className="bg-black text-white">
                  {loadingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={16} />}
                </Button>
              </div>
            </div>

            {/* Search by Job Title */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Search by Job Title</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />

                <Button onClick={fetchApplicationsByJobTitle} disabled={loadingTitle} className="bg-black text-white">
                  {loadingTitle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={16} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Applications */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {error ? (
              <p className="text-red-500 text-center py-4">{error}</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No applications found. Try searching above.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <Card key={app.applicationId} className="shadow hover:shadow-xl transition relative">
                    <div className="absolute right-3 top-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(app.applicationId)}
                          onChange={() => toggleSelect(app.applicationId)}
                        />
                      </label>
                    </div>

                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <div className="truncate max-w-[60%]">{app.jobTitle}</div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            app.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : app.status === "Interview Scheduled"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="text-sm text-slate-700 space-y-2">
                      <p>
                        <strong>Applicant:</strong> {app.candidateName}
                      </p>
                      <p>
                        <strong>User ID:</strong> {app.userId}
                      </p>
                      <p>
                        <strong>Job ID:</strong> {app.jobId}
                      </p>
                      <p>
                        <strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleString()}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => openStatusModalForSingle(app.applicationId, "SHORTLISTED")}
                          className="bg-green-600 text-white"
                        >
                          Shortlist
                        </Button>

                        <Button
                          onClick={() => openStatusModalForSingle(app.applicationId, "REJECTED")}
                          className="bg-red-600 text-white"
                        >
                          Reject
                        </Button>

                        <Button onClick={() => openScheduleModal(app.applicationId)} variant="outline">
                          Schedule Interview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Status Modal (single or bulk) */}
      <Modal
        open={statusModalOpen}
        title={statusTargetBulk ? `Bulk ${statusValue}` : `${statusValue} application`}
        onClose={() => setStatusModalOpen(false)}
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {statusTargetBulk
              ? `You are about to ${statusValue.toLowerCase()} ${selectedIds.size} applications.`
              : `You are about to ${statusValue.toLowerCase()} this application.`}
          </p>

          <label className="text-sm">Reason (optional)</label>
          <Input value={statusReason} onChange={(e) => setStatusReason(e.target.value)} placeholder="e.g. Matches key skills" />

          <div className="flex items-center gap-3 justify-end mt-4">
            <Button variant="ghost" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black text-white" onClick={submitStatusChange} disabled={statusLoading}>
              {statusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Modal */}
      <Modal open={scheduleModalOpen} title="Schedule Interview" onClose={() => setScheduleModalOpen(false)}>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Application ID: {scheduleApplicationId}</p>

          <label className="text-sm">Type</label>
          <select className="w-full p-2 border rounded-md" value={schType} onChange={(e) => setSchType(e.target.value)}>
            <option value="VIRTUAL">Virtual</option>
            <option value="ONSITE">Onsite</option>
          </select>

          <label className="text-sm">Start (UTC / ISO)</label>
          <Input type="datetime-local" value={schStart} onChange={(e) => setSchStart(e.target.value)} />

          <label className="text-sm">End (UTC / ISO)</label>
          <Input type="datetime-local" value={schEnd} onChange={(e) => setSchEnd(e.target.value)} />

          <label className="text-sm">Panel (comma separated emails)</label>
          <Input value={schPanel} onChange={(e) => setSchPanel(e.target.value)} placeholder="recruiter@...,engineer@..." />

          <label className="text-sm">Location / Link</label>
          <Input value={schLocation} onChange={(e) => setSchLocation(e.target.value)} placeholder="Google Meet link or office address" />

          <label className="text-sm">Notes</label>
          <Input value={schNotes} onChange={(e) => setSchNotes(e.target.value)} placeholder="Round 1, take-home, etc." />

          <div className="flex items-center gap-3 justify-end mt-4">
            <Button variant="ghost" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black text-white" onClick={submitSchedule} disabled={schLoading}>
              {schLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule"}
            </Button>
          </div>
        </div>
      </Modal>
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
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition ${
        active ? "bg-black text-white" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}
