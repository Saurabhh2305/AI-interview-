"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecruiterCreateProfile() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);

  // 🖼 Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 💾 Save recruiter photo
  const handleSave = () => {
    if (!photo) {
      alert("⚠️ Please upload your photo before saving!");
      return;
    }

    // Get recruiter info
    const storedRecruiter = localStorage.getItem("user");
    let recruiterId = "defaultRecruiter";
    let recruiterData = null;

    if (storedRecruiter) {
      try {
        recruiterData = JSON.parse(storedRecruiter);
        recruiterId = recruiterData.email || recruiterData.id || "defaultRecruiter";
      } catch (err) {
        console.error("Error parsing recruiter data", err);
      }
    }

    // Store recruiter photo
    localStorage.setItem(`recruiterPhoto_${recruiterId}`, photo);

    // Update main user object
    if (recruiterData) {
      recruiterData.photo = photo;
      localStorage.setItem("user", JSON.stringify(recruiterData));
    }

    alert("✅ Profile photo uploaded successfully!");
    router.push("/dashboard/recruiter");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">
            Upload Your Recruiter Profile Photo
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
