"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// 🌐 API Base from .env
const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/api/applications`;

export default function RecruiterModule() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  // 👉 Static sample data (replace with backend fetch later)
  const applications = [
    { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", status: "PENDING" },
    { id: 2, name: "Priya Mehta", email: "priya@gmail.com", status: "SHORTLISTED" },
    { id: 3, name: "Aman Gupta", email: "aman@gmail.com", status: "REJECTED" },
    { id: 4, name: "Sneha Verma", email: "sneha@gmail.com", status: "PENDING" },
  ];

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = applications.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-700 border border-gray-300",
    SHORTLISTED: "bg-green-100 text-green-700 border border-green-300",
    REJECTED: "bg-red-100 text-red-700 border border-red-300",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10 text-gray-900"
      >
        Applications Dashboard
      </motion.h1>

      <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Manage Job Applications
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* 🔍 Search + Bulk Actions */}
          <div className="flex items-center justify-between mb-8">
            <Input
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 bg-white border border-gray-300 text-gray-900"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={selected.length === 0}
                className="border-gray-300 text-gray-800 hover:bg-gray-100"
              >
                Bulk Shortlist
              </Button>

              <Button
                variant="destructive"
                disabled={selected.length === 0}
                className="bg-red-600 hover:bg-red-700"
              >
                Bulk Reject
              </Button>
            </div>
          </div>

          {/* 🧑‍💼 Applicant Cards */}
          <div className="space-y-4">
            {filtered.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border border-gray-200 shadow-xs bg-white rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-5">
                    <Checkbox
                      checked={selected.includes(app.id)}
                      onCheckedChange={() => toggleSelect(app.id)}
                      className="scale-110"
                    />

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {app.name}
                      </h2>
                      <p className="text-sm text-gray-500">{app.email}</p>

                      <Badge
                        variant="secondary"
                        className={`mt-2 px-3 py-1 rounded-md text-xs font-medium ${statusColor[app.status]}`}
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-100 text-gray-800"
                    >
                      Shortlist
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
