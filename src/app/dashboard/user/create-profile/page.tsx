
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateProfile() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [resume, setResume] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setResume(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!photo || !resume) {
      alert("Please upload both photo and resume!");
      return;
    }

    // ✅ Get current user (from localStorage)
    const storedUser = localStorage.getItem("user");
    let userId = "defaultUser";
    let userData = null;

    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
        userId = userData.email || userData.id || "defaultUser";
      } catch (err) {
        console.error("Error parsing user data", err);
      }
    }

    // ✅ Store user-specific photo & resume
    localStorage.setItem(`userPhoto_${userId}`, photo);
    localStorage.setItem(`userResume_${userId}`, resume);

    // ✅ Also update the main user object (important for Dashboard)
    if (userData) {
      userData.photo = photo;
      localStorage.setItem("user", JSON.stringify(userData));
    }

    alert("Profile created successfully!");
    router.push("/dashboard/user");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">
            Create Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Upload Photo
            </label>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
            {photo && (
              <img
                src={photo}
                alt="Preview"
                className="w-24 h-24 mt-3 rounded-full border"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Upload Resume (PDF)
            </label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleResumeChange}
            />
          </div>

          <Button className="w-full bg-black text-white" onClick={handleSave}>
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
