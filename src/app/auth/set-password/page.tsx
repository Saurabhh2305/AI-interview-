
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { AlertCircle, CheckCircle } from "lucide-react";
// import { toast } from "sonner"

// export default function SetPassword() {
//   const router = useRouter();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const tempToken = localStorage.getItem("temp_oauth_token");
//     if (!tempToken) {
//       router.replace("/auth/login");
//     }
//   }, []);

//   const handleSavePassword = async () => {
//     setError("");
//     setSuccess("");

//     if (!password || !confirmPassword) {
//       setError("Please fill both fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     const token = localStorage.getItem("temp_oauth_token");
//     if (!token) {
//       setError("Token missing. Please login again.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${
//           process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
//         }/api/users/reset-password`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ newPassword: password }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.message || "Failed to set password.");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("token", data?.token);
//       localStorage.removeItem("temp_oauth_token");

//       setSuccess("Password set successfully!");
//       setLoading(false);

//       setTimeout(() => {
//         router.push("/dashboard/user");
//       }, 1200);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4">
//       <Card className="w-full max-w-md border border-gray-200 shadow-sm rounded-xl">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-gray-900">
//             Set your password
//           </CardTitle>
//           <p className="text-sm text-gray-500">
//             Enter your new password to continue
//           </p>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* Error */}
//           {error && (
//             <div className="flex items-center gap-2 p-3 border border-red-300 text-red-600 rounded-md bg-red-50">
//               <AlertCircle size={18} />
//               <p className="text-sm">{error}</p>
//             </div>
//           )}

//           {/* Success */}
//           {success && (
//             <div className="flex items-center gap-2 p-3 border border-green-300 text-green-700 rounded-md bg-green-50">
//               <CheckCircle size={18} />
//               <p className="text-sm">{success}</p>
//             </div>
//           )}

//           <div className="space-y-2">
//             <label className="text-sm text-gray-700">New Password</label>
//             <Input
//               type="password"
//               placeholder="Enter new password"
//               className="border-gray-300 focus:ring-black"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-gray-700">Confirm Password</label>
//             <Input
//               type="password"
//               placeholder="Confirm new password"
//               className="border-gray-300 focus:ring-black"
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </div>

//           <Button
//             onClick={handleSavePassword}
//             disabled={loading}
//             className="w-full bg-black text-white py-2 hover:bg-black/90 rounded-md"
//           >
//             {loading ? "Saving..." : "Save Password"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempToken = localStorage.getItem("temp_oauth_token");
    if (!tempToken) {
      router.replace("/auth/login");
    }
  }, [router]);

  const handleSavePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("⚠️ Please fill both fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("⚠️ Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("temp_oauth_token");
    if (!token) {
      toast.error("⚠️ Token missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/users/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword: password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "❌ Failed to set password.");
        setLoading(false);
        return;
      }

      // Save new token and cleanup
      localStorage.setItem("token", data?.token);
      localStorage.removeItem("temp_oauth_token");

      toast.success("✅ Password set successfully!");

      setTimeout(() => {
        router.push("/dashboard/user");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Set Your Password
          </CardTitle>
          <p className="text-sm text-gray-500">
            Enter your new password to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="border-gray-300 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="border-gray-300 focus:ring-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSavePassword}
            disabled={loading}
            className="w-full bg-black text-white py-2 hover:bg-black/90 rounded-md"
          >
            {loading ? "Saving..." : "Save Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
