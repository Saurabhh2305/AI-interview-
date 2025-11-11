"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const API_URL = "http://localhost:8080/api/documents/upload";

export default function CreateProfilePage() {
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !photo) {
      alert("Please upload both photo and resume.");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!user?.id || !token) {
        alert("User not authenticated. Please log in again.");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("resume", resume);
      formData.append("photo", photo);

      // ❌ Remove manual Content-Type — axios auto sets it
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Upload successful:", response.data);
      alert("Profile created successfully!");
      router.push("/dashboard/user");
    } catch (error: any) {
      console.error("❌ Upload failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Server error. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Complete Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Upload Resume</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                required
              />
            </div>

            <div>
              <Label>Upload Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Uploading...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
