
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecruiterCreateProfile() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [recruiterId, setRecruiterId] = useState<string>("");

  // Load recruiter info
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const parsed = JSON.parse(storedUser);
    const id = parsed.email || parsed.id || "defaultRecruiter";
    setRecruiterId(id);

    // Load existing photo
    const existingPhoto = localStorage.getItem(`recruiterPhoto_${id}`);
    if (existingPhoto) setPhoto(existingPhoto);
  }, [router]);

  // Photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Save photo
  const handleSave = () => {
    if (!photo) {
      alert("⚠️ Please upload a photo.");
      return;
    }

    localStorage.setItem(`recruiterPhoto_${recruiterId}`, photo);

    alert("✅ Profile photo saved!");
    router.push("/dashboard/recruiter");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">
            Upload Recruiter Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Upload Profile Photo
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

          <Button className="w-full bg-black text-white" onClick={handleSave}>
            Save Photo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
