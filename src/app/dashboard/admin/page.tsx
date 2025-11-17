
// "use client";

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   LayoutDashboard,
//   Users,
//   Briefcase,
//   FileBarChart,
//   Settings,
//   LogOut,
//   AlertCircle,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [adminName, setAdminName] = useState<string>("Admin");
//   const [adminEmail, setAdminEmail] = useState<string>("");
//   const [adminPhoto, setAdminPhoto] = useState<string | null>(null);

//   // ✅ Load admin data and photo (persistent)
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (!token || !storedUser) {
//       router.push("/auth/login");
//       return;
//     }

//     try {
//       const parsed = JSON.parse(storedUser);
//       if (parsed.name) setAdminName(parsed.name);
//       if (parsed.email) setAdminEmail(parsed.email);
//     } catch (err) {
//       console.error("Error parsing admin user:", err);
//     }

//     // ✅ Always load saved photo
//     const savedPhoto = localStorage.getItem("adminPhoto");
//     if (savedPhoto) setAdminPhoto(savedPhoto);
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("user");
//     router.push("/auth/login");
//   };

//   const isProfileComplete = !!adminPhoto;

//   return (
//     <div className="flex min-h-screen bg-slate-50 text-slate-900">
//       {/* ─── Sidebar ───────────────────────────── */}
//       <aside className="hidden md:flex md:w-64 flex-col justify-between bg-white border-r border-slate-200 shadow-sm fixed h-full">
//         <div>
//           <div className="p-6 border-b border-slate-200 text-center">
//             <Avatar className="w-16 h-16 mx-auto mb-3 border shadow">
//               {adminPhoto ? (
//                 <AvatarImage src={adminPhoto} alt="Admin Photo" />
//               ) : (
//                 <AvatarFallback>
//                   {adminName ? adminName.charAt(0).toUpperCase() : "A"}
//                 </AvatarFallback>
//               )}
//             </Avatar>
//             <h1 className="text-lg font-semibold text-slate-900">
//               {adminName || "Admin Panel"}
//             </h1>
//             <p className="text-sm text-slate-500 mt-1">{adminEmail}</p>
//           </div>

//           <nav className="p-4 space-y-1">
//             <SidebarItem
//               icon={<LayoutDashboard size={18} />}
//               label="Dashboard Overview"
//               onClick={() => router.push("/dashboard/admin")}
//               active
//             />
//             <SidebarItem
//               icon={<Users size={18} />}
//               label="Manage Users"
//               onClick={() => router.push("/dashboard/admin/users")}
//             />
//             <SidebarItem
//               icon={<Briefcase size={18} />}
//               label="Job Listings"
//               onClick={() => router.push("/dashboard/admin/jobs")}
//             />
//             <SidebarItem
//               icon={<FileBarChart size={18} />}
//               label="Reports & Analytics"
//               onClick={() => router.push("/dashboard/admin/reports")}
//             />
//             <SidebarItem
//               icon={<Settings size={18} />}
//               label="System Settings"
//               onClick={() => router.push("/dashboard/admin/settings")}
//             />
//           </nav>
//         </div>

//         <div className="p-4 border-t border-slate-200">
//           <Button
//             variant="destructive"
//             className="w-full flex items-center justify-center gap-2"
//             onClick={handleLogout}
//           >
//             <LogOut size={16} /> Logout
//           </Button>
//         </div>
//       </aside>

//       {/* ─── Main Content ───────────────────────────── */}
//       <main className="flex-1 md:ml-64 px-6 md:px-10 py-10 overflow-y-auto">
//         <div className="max-w-6xl mx-auto space-y-10">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center text-slate-900">
//                 <LayoutDashboard className="mr-2 h-7 w-7 text-slate-600" />
//                 Admin Dashboard
//               </h1>
//               <p className="text-slate-500 mt-2">
//                 Manage users, jobs, analytics, and system settings.
//               </p>
//             </div>
//           </div>

//           <Separator className="my-6" />

//           {/* ⚠️ Profile Incomplete Warning */}
//           {!isProfileComplete && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center gap-3"
//             >
//               <AlertCircle className="text-yellow-600" size={20} />
//               <p className="text-sm text-yellow-700">
//                 Your profile photo is missing.{" "}
//                 <button
//                   onClick={() => router.push("/dashboard/admin/create-profile")}
//                   className="underline font-medium hover:text-yellow-800"
//                 >
//                   Upload Photo
//                 </button>{" "}
//                 to complete your admin profile.
//               </p>
//             </motion.div>
//           )}

//           {/* Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//             <DashboardCard
//               icon={<Users className="h-5 w-5 mr-2 text-slate-600" />}
//               title="Manage Users"
//               description="Add, edit, or delete users and assign roles."
//               buttonLabel="Go to Users"
//               onClick={() => router.push("/dashboard/admin/users")}
//             />
//             <DashboardCard
//               icon={<Briefcase className="h-5 w-5 mr-2 text-slate-600" />}
//               title="Job Listings"
//               description="Create and manage job opportunities."
//               buttonLabel="Manage Jobs"
//               onClick={() => router.push("/dashboard/admin/jobs")}
//             />
//             <DashboardCard
//               icon={<FileBarChart className="h-5 w-5 mr-2 text-slate-600" />}
//               title="Reports & Analytics"
//               description="View platform performance and analytics data."
//               buttonLabel="View Reports"
//               onClick={() => router.push("/dashboard/admin/reports")}
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ─── Sidebar Link ───────────────────────────── */
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
//       className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
//         active
//           ? "bg-black text-white font-medium shadow-sm"
//           : "text-slate-700 hover:bg-slate-100 hover:text-black"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// /* ─── Dashboard Card ───────────────────────────── */
// function DashboardCard({
//   icon,
//   title,
//   description,
//   buttonLabel,
//   onClick,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   buttonLabel: string;
//   onClick: () => void;
// }) {
//   return (
//     <Card className="border border-slate-200 hover:shadow-md transition-all duration-200 bg-white rounded-xl">
//       <CardHeader>
//         <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
//           {icon}
//           {title}
//         </CardTitle>
//         <CardDescription className="text-slate-500">
//           {description}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Button
//           onClick={onClick}
//           variant="outline"
//           className="w-full mt-2 border border-slate-200 text-slate-700 hover:bg-slate-100"
//         >
//           {buttonLabel}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState<string>("Admin");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);

  // Load admin profile from storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.name) setAdminName(parsed.name);
      if (parsed.email) setAdminEmail(parsed.email);
    } catch (err) {
      console.error("Error parsing admin user:", err);
    }

    const savedPhoto = localStorage.getItem("adminPhoto");
    if (savedPhoto) setAdminPhoto(savedPhoto);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const isProfileComplete = !!adminPhoto;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between bg-white border-r border-slate-200 shadow-sm fixed h-full">
        <div>
          <div className="p-6 border-b border-slate-200 text-center">
            <Avatar className="w-16 h-16 mx-auto mb-3 border shadow">
              {adminPhoto ? (
                <AvatarImage src={adminPhoto} alt="Admin Photo" />
              ) : (
                <AvatarFallback>
                  {adminName ? adminName.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              )}
            </Avatar>
            <h1 className="text-lg font-semibold text-slate-900">
              {adminName || "Admin Panel"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{adminEmail}</p>
          </div>

          <nav className="p-4 space-y-1">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard Overview"
              onClick={() => router.push("/dashboard/admin")}
              active
            />
            <SidebarItem
              icon={<Users size={18} />}
              label="Manage Users"
              onClick={() => router.push("/dashboard/admin/users")}
            />
            <SidebarItem
              icon={<Briefcase size={18} />}
              label="Job Listings"
              onClick={() => router.push("/dashboard/admin/jobs")}
            />
            <SidebarItem
              icon={<FileBarChart size={18} />}
              label="Reports & Analytics"
              onClick={() => router.push("/dashboard/admin/reports")}
            />
            <SidebarItem
              icon={<Settings size={18} />}
              label="System Settings"
              onClick={() => router.push("/dashboard/admin/settings")}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 px-6 md:px-10 py-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-slate-900">
                <LayoutDashboard className="mr-2 h-7 w-7 text-slate-600" />
                Admin Dashboard
              </h1>
              <p className="text-slate-500 mt-2">
                Manage users, jobs, analytics, and system settings.
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Profile warning */}
          {!isProfileComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center gap-3"
            >
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-sm text-yellow-700">
                Your profile photo is missing.{" "}
                <button
                  onClick={() =>
                    router.push("/dashboard/admin/create-profile")
                  }
                  className="underline font-medium hover:text-yellow-800"
                >
                  Upload Photo
                </button>{" "}
                to complete your admin profile.
              </p>
            </motion.div>
          )}

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <DashboardCard
              icon={<Users className="h-5 w-5 mr-2 text-slate-600" />}
              title="Manage Users"
              description="Add, edit, or delete users and assign roles."
              buttonLabel="Go to Users"
              onClick={() => router.push("/dashboard/admin/users")}
            />

            <DashboardCard
              icon={<Briefcase className="h-5 w-5 mr-2 text-slate-600" />}
              title="Job Listings"
              description="Create and manage job opportunities."
              buttonLabel="Manage Jobs"
              onClick={() => router.push("/dashboard/admin/jobs")}
            />

            <DashboardCard
              icon={<FileBarChart className="h-5 w-5 mr-2 text-slate-600" />}
              title="Reports & Analytics"
              description="View platform performance and analytics data."
              buttonLabel="View Reports"
              onClick={() => router.push("/dashboard/admin/reports")}
            />

            {/* NEW – Create/Update Profile */}
            <DashboardCard
              icon={<Settings className="h-5 w-5 mr-2 text-slate-600" />}
              title="Create / Update Profile"
              description="Upload your profile photo and update account details."
              buttonLabel="Edit Profile"
              onClick={() => router.push("/dashboard/admin/create-profile")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
        active
          ? "bg-black text-white font-medium shadow-sm"
          : "text-slate-700 hover:bg-slate-100 hover:text-black"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* Dashboard Card UI */
function DashboardCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <Card className="border border-slate-200 hover:shadow-md transition-all duration-200 bg-white rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-slate-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onClick}
          variant="outline"
          className="w-full mt-2 border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
