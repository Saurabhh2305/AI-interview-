
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateProfile() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [resume, setResume] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // ✅ Load current user info (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.photo) setPhoto(parsed.photo);
        if (parsed.resume) setResume(parsed.resume);
      } catch (err) {
        console.error("Error reading user from localStorage:", err);
      }
    }
  }, []);

  // ✅ Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ✅ Handle resume upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setResume(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ✅ Save data locally
  const handleSave = () => {
    if (!photo || !resume) {
      alert("Please upload both photo and resume!");
      return;
    }

    if (!user) {
      alert("User not found! Please log in again.");
      router.push("/auth/login");
      return;
    }

    const updatedUser = { ...user, photo, resume };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem(`userPhoto_${user.email || user.id}`, photo);
    localStorage.setItem(`userResume_${user.email || user.id}`, resume);

    alert("✅ Profile updated successfully!");
    router.push("/dashboard/user");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">
            {photo || resume ? "Update Your Profile" : "Create Your Profile"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Profile photo upload */}
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Upload Photo
            </label>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
            {photo && (
              <div className="mt-3">
                <img
                  src={photo}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full border border-slate-200 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Resume upload */}
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Upload Resume (PDF)
            </label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleResumeChange}
            />
            {resume && (
              <p className="text-green-600 text-sm mt-2">Resume uploaded ✔️</p>
            )}
          </div>

          <Button
            className="w-full bg-black text-white hover:bg-gray-900 transition"
            onClick={handleSave}
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
