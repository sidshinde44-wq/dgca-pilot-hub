// src/app/admin/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!error && data) {
        setRole(data.role);
      }
    };

    getUserRole();
  }, []);

  if (role !== "admin") {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Access denied. You must be an admin to view this page.
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/subjects"
          className="p-6 bg-blue-100 rounded-xl shadow hover:bg-blue-200"
        >
          Manage Subjects
        </Link>
        <Link
          href="/admin/modules"
          className="p-6 bg-green-100 rounded-xl shadow hover:bg-green-200"
        >
          Manage Modules
        </Link>
        <Link
          href="/admin/topics"
          className="p-6 bg-yellow-100 rounded-xl shadow hover:bg-yellow-200"
        >
          Manage Topics
        </Link>
        <Link
          href="/admin/notes"
          className="p-6 bg-purple-100 rounded-xl shadow hover:bg-purple-200"
        >
          Manage Notes
        </Link>
        <Link
          href="/admin/quizzes"
          className="p-6 bg-pink-100 rounded-xl shadow hover:bg-pink-200"
        >
          Manage Quizzes
        </Link>
      </div>
    </div>
  );
}
