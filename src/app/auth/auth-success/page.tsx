// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// const API_URL =
//   process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

// export default function AuthSuccessPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const userId = searchParams.get("userId");

//   const [resume, setResume] = useState<File | null>(null);
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   // if no userId, send back to login
//   useEffect(() => {
//     if (!userId) router.replace("/auth/login");
//   }, [userId, router]);

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!resume || !photo) return alert("Please upload both photo and resume");

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const formData = new FormData();
//       formData.append("userId", userId!);
//       formData.append("resume", resume);
//       formData.append("photo", photo);

//       const response = await fetch(`${API_URL}/documents/upload`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errData = await response.json().catch(() => ({}));
//         alert(errData?.message || "Failed to upload files");
//         return;
//       }

//       alert("Documents uploaded successfully!");
//       router.replace("/dashboard/user");
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-white">
//       <Card className="w-full max-w-md shadow border border-gray-200 rounded-2xl">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-semibold text-black">
//             Complete Your Profile
//           </CardTitle>
//           <p className="text-sm text-gray-600 mt-1">
//             Please upload your photo and resume to continue.
//           </p>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleUpload} className="space-y-4">
//             <div>
//               <Label className="text-black">Photo</Label>
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setPhoto(e.target.files?.[0] || null)}
//                 required
//               />
//             </div>

//             <div>
//               <Label className="text-black">Resume</Label>
//               <Input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={(e) => setResume(e.target.files?.[0] || null)}
//                 required
//               />
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-2.5"
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Submit & Continue"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
