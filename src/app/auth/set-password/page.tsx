
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function SetPassword() {
//   const router = useRouter();
//   const [password, setPassword] = useState<string>("");
//   const [confirmPassword, setConfirmPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");
//   const [success, setSuccess] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   // ⛔ If no temp token → block access
//   useEffect(() => {
//     const tempToken = localStorage.getItem("temp_oauth_token");
//     if (!tempToken) {
//       router.replace("/auth/login");
//     }
//   }, []);

//   const handleSavePassword = async () => {
//     setError("");
//     setSuccess("");

//     // 🔐 Validation
//     if (!password || !confirmPassword) {
//       setError("Please fill both fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     // ⭐ IMPORTANT: Fetch correct token
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
//             Authorization: `Bearer ${token}`, // ⭐ Using OAuth temp token
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

//       // 🆕 Backend returns new JWT
//       localStorage.setItem("token", data?.token);

//       // ❌ Remove temp OAuth token
//       localStorage.removeItem("temp_oauth_token");

//       setSuccess("Password set successfully!");
//       setLoading(false);

//       // 🎯 Redirect to dashboard
//       setTimeout(() => {
//         router.push("/dashboard/user");
//       }, 1200);

//     } catch (err) {
//       console.error("Error setting password:", err);
//       setError("Something went wrong. Try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-4">
//           Set Your Password
//         </h1>

//         {/* Error Message */}
//         {error && (
//           <p className="text-red-600 bg-red-100 px-3 py-2 rounded mb-3 text-sm">
//             {error}
//           </p>
//         )}

//         {/* Success Message */}
//         {success && (
//           <p className="text-green-600 bg-green-100 px-3 py-2 rounded mb-3 text-sm">
//             {success}
//           </p>
//         )}

//         <div className="flex flex-col gap-3">
//           <input
//             type="password"
//             className="border rounded-lg p-3 w-full focus:ring-2 ring-blue-400 outline-none"
//             placeholder="Enter new password"
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <input
//             type="password"
//             className="border rounded-lg p-3 w-full focus:ring-2 ring-blue-400 outline-none"
//             placeholder="Confirm password"
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//         </div>

//         <button
//           onClick={handleSavePassword}
//           disabled={loading}
//           className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg mt-5 hover:bg-blue-700 transition disabled:bg-blue-300"
//         >
//           {loading ? "Saving..." : "Save Password"}
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner"

export default function SetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempToken = localStorage.getItem("temp_oauth_token");
    if (!tempToken) {
      router.replace("/auth/login");
    }
  }, []);

  const handleSavePassword = async () => {
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("temp_oauth_token");
    if (!token) {
      setError("Token missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
        }/api/users/reset-password`,
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
        setError(data?.message || "Failed to set password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data?.token);
      localStorage.removeItem("temp_oauth_token");

      setSuccess("Password set successfully!");
      setLoading(false);

      setTimeout(() => {
        router.push("/dashboard/user");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Set your password
          </CardTitle>
          <p className="text-sm text-gray-500">
            Enter your new password to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 border border-red-300 text-red-600 rounded-md bg-red-50">
              <AlertCircle size={18} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-3 border border-green-300 text-green-700 rounded-md bg-green-50">
              <CheckCircle size={18} />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-700">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="border-gray-300 focus:ring-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="border-gray-300 focus:ring-black"
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
