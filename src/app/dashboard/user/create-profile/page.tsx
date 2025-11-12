
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const UPLOAD_URL = "http://localhost:8080/api/documents/upload";
const USER_INFO_URL = "http://localhost:8080/api/users";

export default function CreateOrUpdateProfile() {
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      alert("Please log in again.");
      router.replace("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // ✅ If user already has a photo, show preview
    if (parsedUser.photo) {
      if (parsedUser.photo.startsWith("/9j/")) {
        // base64 format
        setPhotoPreview(`data:image/jpeg;base64,${parsedUser.photo}`);
      } else if (parsedUser.photo.startsWith("http")) {
        // file URL format
        setPhotoPreview(parsedUser.photo);
      }
    }
  }, [router]);

  // ✅ Handle photo selection with size check
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024); // convert bytes → MB

    // ⚠️ If image > 1 MB, show alert and reset input
    if (fileSizeMB > 1) {
      alert(
        `⚠️ Image too large!\nYour file is ${(fileSizeMB).toFixed(
          2
        )} MB.\nPlease upload an image smaller than 1 MB (≈ 1024 KB).`
      );
      e.target.value = ""; // reset input
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ✅ Upload / Update profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !user?.id) {
      alert("Session expired. Please log in again.");
      router.replace("/auth/login");
      return;
    }

    if (!photo && !resume) {
      alert("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id.toString());
    if (photo) formData.append("photo", photo);
    if (resume) formData.append("resume", resume);

    setLoading(true);
    try {
      await axios.post(UPLOAD_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Fetch updated user info from backend
      const updatedUserResp = await axios.get(`${USER_INFO_URL}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = updatedUserResp.data?.data || updatedUserResp.data;

      // ✅ Keep user data lightweight
      const minimalUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        photo: updatedUser.photo, // URL or reference only
        hasPhoto: !!updatedUser.photo,
        hasResume: !!updatedUser.resume,
      };

      // ✅ Store small data only
      localStorage.setItem("user", JSON.stringify(minimalUser));

      // ✅ Store Base64 only if small (prevent QuotaExceededError)
      if (updatedUser.photo && updatedUser.photo.length < 200000) {
        localStorage.setItem("photoBase64", updatedUser.photo);
      } else {
        console.warn("Photo too large — skipping photoBase64 save.");
        localStorage.removeItem("photoBase64");
      }

      // 🔄 Notify dashboard
      window.dispatchEvent(new Event("userUpdated"));

      alert("✅ Profile updated successfully!");
      router.replace("/dashboard/user");
    } catch (error: any) {
      console.error("Upload failed:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Upload failed. Try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-black">
            {user?.hasPhoto || user?.hasResume
              ? "Update Your Profile"
              : "Complete Your Profile"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-black">Upload New Resume (optional)</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <Label className="text-black">Upload New Profile Photo (optional)</Label>
              <Input type="file" accept="image/*" onChange={handlePhotoChange} />

              {photoPreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full border border-slate-300 shadow-sm object-cover"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-2.5 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
