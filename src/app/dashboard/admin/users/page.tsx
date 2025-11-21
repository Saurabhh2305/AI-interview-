
// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Loader2, Users, Search, Filter } from "lucide-react";

// export default function UsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [filtered, setFiltered] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("ALL");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           setError("No token found. Please login again.");
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get("http://localhost:8080/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data?.success) {
//           setUsers(res.data.data);
//           setFiltered(res.data.data);
//         } else {
//           setError("Failed to load users");
//         }
//       } catch (err) {
//         setError("401 Unauthorized – Token Invalid or Expired");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Search + Filter Logic
//   useEffect(() => {
//     let data = [...users];

//     if (search.trim() !== "") {
//       data = data.filter((u) =>
//         u.fullName.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (roleFilter !== "ALL") {
//       data = data.filter((u) => u.role === roleFilter);
//     }

//     setFiltered(data);
//   }, [search, roleFilter, users]);

//   return (
//     <div className="px-6 md:px-10 py-10 bg-white">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-black text-white rounded-xl">
//               <Users className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-black">Users Dashboard</h1>
//               <p className="text-sm text-gray-500">
//                 Manage platform users, roles & verification status.
//               </p>
//             </div>
//           </div>
//         </div>

//         <Separator className="mb-8" />

//         {/* Controls */}
//         <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//           <div className="flex items-center gap-2 w-full md:w-1/2">
//             <Search className="text-gray-500" size={20} />
//             <Input
//               placeholder="Search users..."
//               className="w-full border border-gray-300"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <Filter size={18} className="text-gray-600" />
//             <Select onValueChange={(v) => setRoleFilter(v)} defaultValue="ALL">
//               <SelectTrigger className="w-[150px] border-gray-300">
//                 <SelectValue placeholder="Filter Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All</SelectItem>
//                 <SelectItem value="ADMIN">Admin</SelectItem>
//                 <SelectItem value="USER">User</SelectItem>
//                 <SelectItem value="RECRUITER">Recruiter</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="flex justify-center py-10">
//             <Loader2 className="h-8 w-8 animate-spin text-black" />
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && (
//           <div className="bg-red-50 border border-red-400 text-red-700 p-4 rounded-md mb-6">
//             {error}
//           </div>
//         )}

//         {/* User Table */}
//         {!loading && !error && (
//           <Card className="border border-black/20 rounded-xl shadow-none bg-white">
//             <CardHeader>
//               <CardTitle className="text-xl font-semibold text-black">
//                 Registered Users ({filtered.length})
//               </CardTitle>
//             </CardHeader>

//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-black text-white text-left text-sm">
//                       <th className="p-3">User</th>
//                       <th className="p-3">Email</th>
//                       <th className="p-3">Mobile</th>
//                       <th className="p-3">Role</th>
//                       <th className="p-3">Verified</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filtered.map((user) => (
//                       <tr
//                         key={user.id}
//                         className="border-b border-gray-200 hover:bg-gray-100 transition"
//                       >
//                         <td className="p-3 flex items-center gap-3">
//                           <Avatar className="h-10 w-10">
//                             {user?.photo ? (
//                               <AvatarImage src={user.photo} />
//                             ) : (
//                               <AvatarFallback className="bg-black text-white">
//                                 {user.fullName?.charAt(0).toUpperCase()}
//                               </AvatarFallback>
//                             )}
//                           </Avatar>

//                           <span className="font-medium text-black">
//                             {user.fullName}
//                           </span>
//                         </td>

//                         <td className="p-3 text-gray-700">{user.email}</td>
//                         <td className="p-3 text-gray-700">{user.mobileNo}</td>
//                         <td className="p-3 text-gray-800 font-medium">
//                           {user.role}
//                         </td>

//                         <td className="p-3">
//                           {user.verified ? (
//                             <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
//                               Verified
//                             </span>
//                           ) : (
//                             <span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full">
//                               Not Verified
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {filtered.length === 0 && (
//                   <p className="text-center text-gray-500 py-8">
//                     No matching users found.
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
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Users, Search, Filter } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNo?: string;
  role: "ADMIN" | "USER" | "RECRUITER";
  verified: boolean;
  photo?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const res = await axios.get(`${BACKEND_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setUsers(res.data.data);
          setFiltered(res.data.data);
        } else {
          setError(res.data?.message || "Failed to load users");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "API Error: Unable to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter + Search logic
  useEffect(() => {
    let data = [...users];

    if (search.trim() !== "") {
      data = data.filter((u) =>
        u.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "ALL") {
      data = data.filter((u) => u.role === roleFilter);
    }

    setFiltered(data);
  }, [search, roleFilter, users]);

  return (
    <div className="px-6 md:px-10 py-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Users Dashboard</h1>
              <p className="text-sm text-gray-500">
                Manage platform users, roles & verification status.
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <Search className="text-gray-500" size={20} />
            <Input
              placeholder="Search users..."
              className="w-full border border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-600" />
            <Select onValueChange={(v) => setRoleFilter(v)} defaultValue="ALL">
              <SelectTrigger className="w-[150px] border-gray-300">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="RECRUITER">Recruiter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-400 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* User Table */}
        {!loading && !error && (
          <Card className="border border-black/20 rounded-xl shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-black">
                Registered Users ({filtered.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-black text-white text-left text-sm">
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Mobile</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Verified</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((user: User) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition"
                      >
                        <td className="p-3 flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {user?.photo ? (
                              <AvatarImage src={user.photo} />
                            ) : (
                              <AvatarFallback className="bg-black text-white">
                                {user.fullName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <span className="font-medium text-black">{user.fullName}</span>
                        </td>

                        <td className="p-3 text-gray-700">{user.email}</td>
                        <td className="p-3 text-gray-700">{user.mobileNo || "-"}</td>
                        <td className="p-3 text-gray-800 font-medium">{user.role}</td>

                        <td className="p-3">
                          {user.verified ? (
                            <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full">
                              Not Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No matching users found.
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
