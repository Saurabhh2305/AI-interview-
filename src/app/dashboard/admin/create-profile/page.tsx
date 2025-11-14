
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateProfile() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);

  // ✅ Load saved photo if already uploaded before
  useEffect(() => {
    const savedPhoto = localStorage.getItem("adminPhoto");
    if (savedPhoto) {
      setExistingPhoto(savedPhoto);
      setPhoto(savedPhoto);
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!photo) return alert("Please upload a photo first!");
    localStorage.setItem("adminPhoto", photo); // ✅ persist forever
    alert("Profile photo saved successfully!");
    router.push("/dashboard/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-800">
            {existingPhoto ? "Update Profile Photo" : "Upload Your Photo"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <Input type="file" accept="image/*" onChange={handlePhotoUpload} />

          {photo && (
            <div className="mt-4 flex justify-center">
              <img
                src={photo}
                alt="Preview"
                className="w-32 h-32 rounded-full border-2 border-slate-200 object-cover"
              />
            </div>
          )}

          <Button
            onClick={handleSave}
            className="w-full bg-black  text-white"
          >
            Save Photo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
