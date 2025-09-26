"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // <- new hook
import { supabase } from "@/lib/supabase";

interface Subject {
  id: string;
  name: string;
  level: string; // CPL / ATPL / COMMON
}

export default function SubjectsPage() {
  const params = useParams();
  const examId = params.examId.toUpperCase(); // CPL / ATPL
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .in("level", [examId, "COMMON"]); // include common subjects for both exams

      if (!error) setSubjects(data || []);
    }
    fetchSubjects();
  }, [examId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Subjects ({examId})</h1>
      <ul className="space-y-4">
        {subjects.map((subj) => (
          <li key={subj.id}>
            <Link
              href={`/modules/${subj.id}`}
              className="block p-4 bg-white rounded shadow hover:shadow-lg"
            >
              {subj.name} {subj.level === "COMMON" && "(Common)"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
