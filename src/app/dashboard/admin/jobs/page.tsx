
// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Loader2,
//   Briefcase,
//   AlertCircle,
//   Users,
//   FileText,
//   Search,
//   Filter,
// } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function AdminJobsPage() {
//   const [jobs, setJobs] = useState<any[]>([]);
//   const [filtered, setFiltered] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [recruiterFilter, setRecruiterFilter] = useState("ALL");

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await axios.get("http://localhost:8080/api/jobs/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data?.success) {
//           setJobs(res.data.data);
//           setFiltered(res.data.data);
//         } else {
//           setError("Failed to load job listings");
//         }
//       } catch (err: any) {
//         console.log(err);
//         setError("API Error: Unable to fetch jobs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Filter + Search Logic
//   useEffect(() => {
//     let data = [...jobs];

//     if (search.trim() !== "") {
//       data = data.filter(
//         (job) =>
//           job.title.toLowerCase().includes(search.toLowerCase()) ||
//           job.location.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (statusFilter !== "ALL") {
//       const isActive = statusFilter === "ACTIVE";
//       data = data.filter((job) => job.isActive === isActive);
//     }

//     if (recruiterFilter !== "ALL") {
//       data = data.filter((job) => job.recruiterId === recruiterFilter);
//     }

//     setFiltered(data);
//   }, [search, statusFilter, recruiterFilter, jobs]);

//   const uniqueRecruiters = Array.from(new Set(jobs.map((j) => j.recruiterId)));

//   return (
//     <div className="px-6 md:px-10 py-10 bg-gradient-to-b from-[#f2f2f2] to-[#ffffff] min-h-screen">
//       <div className="max-w-7xl mx-auto">

//         {/* DASHBOARD HEADER */}
//         <div className="mb-10">
//           <div className="bg-black text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-extrabold">Admin Job Dashboard</h1>
//               <p className="text-gray-300 mt-1">
//                 Monitor & manage all recruiter job postings.
//               </p>
//             </div>
//             <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
//               <Briefcase className="h-10 w-10 text-white" />
//             </div>
//           </div>
//         </div>

//         {/* STATS CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <Card className="border-none shadow-xl bg-white rounded-3xl">
//             <CardContent className="p-6 flex items-center gap-5">
//               <div className="bg-black text-white p-4 rounded-2xl">
//                 <Briefcase className="h-6 w-6" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">{jobs.length}</h2>
//                 <p className="text-gray-600 text-sm">Total Job Posts</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-none shadow-xl bg-white rounded-3xl">
//             <CardContent className="p-6 flex items-center gap-5">
//               <div className="bg-black text-white p-4 rounded-2xl">
//                 <Users className="h-6 w-6" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">{uniqueRecruiters.length}</h2>
//                 <p className="text-gray-600 text-sm">Recruiters</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-none shadow-xl bg-white rounded-3xl">
//             <CardContent className="p-6 flex items-center gap-5">
//               <div className="bg-black text-white p-4 rounded-2xl">
//                 <FileText className="h-6 w-6" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">
//                   {jobs.filter((j) => j.isActive).length}
//                 </h2>
//                 <p className="text-gray-600 text-sm">Active Listings</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <Separator className="mb-10" />

//         {/* FILTER CONTROLS */}
//         <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//           <div className="flex items-center gap-2 w-full md:w-1/2">
//             <Search className="text-gray-500" size={20} />
//             <Input
//               placeholder="Search Job Title / Location..."
//               className="w-full border border-gray-300"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <Filter size={18} className="text-gray-600" />
//             <Select
//               defaultValue="ALL"
//               onValueChange={(v) => setStatusFilter(v)}
//             >
//               <SelectTrigger className="w-[130px] border-gray-300">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All</SelectItem>
//                 <SelectItem value="ACTIVE">Active</SelectItem>
//                 <SelectItem value="INACTIVE">Inactive</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select
//               defaultValue="ALL"
//               onValueChange={(v) => setRecruiterFilter(v)}
//             >
//               <SelectTrigger className="w-[130px] border-gray-300">
//                 <SelectValue placeholder="Recruiter" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All</SelectItem>
//                 {uniqueRecruiters.map((r) => (
//                   <SelectItem key={r} value={r}>
//                     {r}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* LOADING */}
//         {loading && (
//           <div className="flex justify-center py-10">
//             <Loader2 className="h-10 w-10 animate-spin text-black" />
//           </div>
//         )}

//         {/* ERROR */}
//         {!loading && error && (
//           <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl flex items-center gap-2 shadow">
//             <AlertCircle size={22} />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* JOB TABLE */}
//         {!loading && !error && (
//           <Card className="border-none shadow-2xl rounded-3xl bg-white">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-black">
//                 Job Listings ({filtered.length})
//               </CardTitle>
//               <CardDescription>
//                 All job posts added by recruiters
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse rounded-2xl">
//                   <thead>
//                     <tr className="bg-black text-white text-sm uppercase tracking-wide">
//                       <th className="p-4 text-left">Job Title</th>
//                       <th className="p-4 text-left">Recruiter</th>
//                       <th className="p-4 text-left">Location</th>
//                       <th className="p-4 text-left">Experience</th>
//                       <th className="p-4 text-left">Salary</th>
//                       <th className="p-4 text-left">Status</th>
//                       <th className="p-4 text-left">Created</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filtered.map((job: any) => (
//                       <tr
//                         key={job.jobId}
//                         className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
//                       >
//                         <td className="p-4 font-semibold">{job.title}</td>
//                         <td className="p-4">{job.recruiterId}</td>
//                         <td className="p-4">{job.location}</td>
//                         <td className="p-4">{job.experienceLevel}</td>
//                         <td className="p-4">{job.salaryRange}</td>

//                         <td className="p-4">
//                           {job.isActive ? (
//                             <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
//                               Active
//                             </span>
//                           ) : (
//                             <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
//                               Inactive
//                             </span>
//                           )}
//                         </td>

//                         <td className="p-4">
//                           {new Date(job.createdAt).toLocaleDateString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {filtered.length === 0 && (
//                   <p className="text-center text-gray-500 py-10 text-lg">
//                     No matching job postings found.
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Briefcase,
  AlertCircle,
  Users,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Job {
  jobId: string;
  title: string;
  location: string;
  experienceLevel: string;
  salaryRange: string;
  isActive: boolean;
  recruiterId: string;
  createdAt: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [recruiterFilter, setRecruiterFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");

        const res = await axios.get(`${BACKEND_URL}/api/jobs/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setJobs(res.data.data);
          setFiltered(res.data.data);
        } else {
          setError("Failed to load job listings");
        }
      } catch (err: any) {
        console.error(err);
        setError("API Error: Unable to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter + Search Logic
  useEffect(() => {
    let data = [...jobs];

    if (search.trim() !== "") {
      data = data.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      const isActive = statusFilter === "ACTIVE";
      data = data.filter((job) => job.isActive === isActive);
    }

    if (recruiterFilter !== "ALL") {
      data = data.filter((job) => job.recruiterId === recruiterFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, recruiterFilter, jobs]);

  const uniqueRecruiters = Array.from(new Set(jobs.map((j) => j.recruiterId)));

  return (
    <div className="px-6 md:px-10 py-10 bg-gradient-to-b from-[#f2f2f2] to-[#ffffff] min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* DASHBOARD HEADER */}
        <div className="mb-10">
          <div className="bg-black text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">Admin Job Dashboard</h1>
              <p className="text-gray-300 mt-1">
                Monitor & manage all recruiter job postings.
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-none shadow-xl bg-white rounded-3xl">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="bg-black text-white p-4 rounded-2xl">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{jobs.length}</h2>
                <p className="text-gray-600 text-sm">Total Job Posts</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="bg-black text-white p-4 rounded-2xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{uniqueRecruiters.length}</h2>
                <p className="text-gray-600 text-sm">Recruiters</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="bg-black text-white p-4 rounded-2xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {jobs.filter((j) => j.isActive).length}
                </h2>
                <p className="text-gray-600 text-sm">Active Listings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-10" />

        {/* FILTER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <Search className="text-gray-500" size={20} />
            <Input
              placeholder="Search Job Title / Location..."
              className="w-full border border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-600" />
            <Select
              defaultValue="ALL"
              onValueChange={(v) => setStatusFilter(v)}
            >
              <SelectTrigger className="w-[130px] border-gray-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              defaultValue="ALL"
              onValueChange={(v) => setRecruiterFilter(v)}
            >
              <SelectTrigger className="w-[130px] border-gray-300">
                <SelectValue placeholder="Recruiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {uniqueRecruiters.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-black" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl flex items-center gap-2 shadow">
            <AlertCircle size={22} />
            <span>{error}</span>
          </div>
        )}

        {/* JOB TABLE */}
        {!loading && !error && (
          <Card className="border-none shadow-2xl rounded-3xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">
                Job Listings ({filtered.length})
              </CardTitle>
              <CardDescription>All job posts added by recruiters</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-2xl">
                  <thead>
                    <tr className="bg-black text-white text-sm uppercase tracking-wide">
                      <th className="p-4 text-left">Job Title</th>
                      <th className="p-4 text-left">Recruiter</th>
                      <th className="p-4 text-left">Location</th>
                      <th className="p-4 text-left">Experience</th>
                      <th className="p-4 text-left">Salary</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((job: Job) => (
                      <tr
                        key={job.jobId}
                        className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                      >
                        <td className="p-4 font-semibold">{job.title}</td>
                        <td className="p-4">{job.recruiterId}</td>
                        <td className="p-4">{job.location}</td>
                        <td className="p-4">{job.experienceLevel}</td>
                        <td className="p-4">{job.salaryRange}</td>

                        <td className="p-4">
                          {job.isActive ? (
                            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <p className="text-center text-gray-500 py-10 text-lg">
                    No matching job postings found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
