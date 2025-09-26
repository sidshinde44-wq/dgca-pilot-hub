"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Subject {
  id: string;
  name: string;
  description: string | null;
  level: string; // CPL / ATPL / COMMON
}

export default function ManageSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
    level: "CPL",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    setLoading(true);
    const { data, error } = await supabase.from("subjects").select("*").order("name");
    if (error) {
      console.error("Error fetching subjects:", error.message);
    } else {
      setSubjects(data || []);
    }
    setLoading(false);
  }

  async function addSubject() {
    if (!newSubject.name.trim()) return;
    const { error } = await supabase.from("subjects").insert([newSubject]);
    if (error) {
      console.error("Error adding subject:", error.message);
    } else {
      setNewSubject({ name: "", description: "", level: "CPL" });
      fetchSubjects();
    }
  }

  async function updateSubject(id: string, field: string, value: string) {
    const { error } = await supabase
      .from("subjects")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Error updating subject:", error.message);
    } else {
      fetchSubjects();
    }
  }

  async function deleteSubject(id: string) {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) {
      console.error("Error deleting subject:", error.message);
    } else {
      fetchSubjects();
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Subjects</h1>

      {/* Add New Subject */}
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-3">Add New Subject</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Subject Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="border p-2 flex-1 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newSubject.description}
            onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
            className="border p-2 flex-1 rounded"
          />
          <select
            value={newSubject.level}
            onChange={(e) => setNewSubject({ ...newSubject, level: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="CPL">CPL</option>
            <option value="ATPL">ATPL</option>
            <option value="COMMON">COMMON</option>
          </select>
          <button
            onClick={addSubject}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* List Subjects */}
      {loading ? (
        <p>Loading subjects...</p>
      ) : (
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Level</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subj) => (
              <tr key={subj.id}>
                <td className="border p-2">
                  <input
                    type="text"
                    defaultValue={subj.name}
                    onBlur={(e) =>
                      updateSubject(subj.id, "name", e.target.value)
                    }
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    defaultValue={subj.description || ""}
                    onBlur={(e) =>
                      updateSubject(subj.id, "description", e.target.value)
                    }
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <select
                    defaultValue={subj.level}
                    onChange={(e) => updateSubject(subj.id, "level", e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="CPL">CPL</option>
                    <option value="ATPL">ATPL</option>
                    <option value="COMMON">COMMON</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteSubject(subj.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
