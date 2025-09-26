"use client"; // <-- must be first line

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalTopics: number;
  totalQuizzes: number;
  totalAttempts: number;
}

interface QuizPreview {
  id: string;
  topicName: string;
  question: string;
}

export default function HomePage() {
  const exams = [
    { id: "cpl", name: "CPL" },
    { id: "atpl", name: "ATPL" },
  ];

  const [stats, setStats] = useState<Stats | null>(null);
  const [latestQuizzes, setLatestQuizzes] = useState<QuizPreview[]>([]);

  useEffect(() => {
    async function fetchStats() {
      // Example quick stats (adjust queries as per your DB)
      const { count: topicCount } = await supabase.from("topics").select("*", { count: "exact" });
      const { count: quizCount } = await supabase.from("quizzes").select("*", { count: "exact" });
      const { count: attemptsCount } = await supabase.from("statistics").select("*", { count: "exact" });

      setStats({
        totalTopics: topicCount || 0,
        totalQuizzes: quizCount || 0,
        totalAttempts: attemptsCount || 0,
      });

      // Latest 5 quizzes (just first question preview)
      const { data: quizzes } = await supabase
        .from("quizzes")
        .select(`
          id,
          question,
          subtopic_id,
          subtopics!inner(name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      setLatestQuizzes(
        (quizzes || []).map((q: any) => ({
          id: q.id,
          question: q.question,
          topicName: q.subtopics.name,
        }))
      );
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">DGCA Pilot Knowledge Hub</h1>
        <p className="text-gray-700">Notes and quizzes for CPL and ATPL subjects.</p>
      </header>

      {/* Exams */}
      <section className="max-w-6xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/subjects/${exam.id}`}
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center justify-center"
          >
            <h2 className="text-xl font-semibold mb-2">{exam.name}</h2>
            <p className="text-gray-600 text-center">Explore subjects and topics for {exam.name}</p>
          </Link>
        ))}
      </section>

      {/* Quick Stats */}
      <section className="max-w-6xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">Total Topics</p>
              <p className="text-2xl font-bold">{stats.totalTopics}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">Total Quizzes</p>
              <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">Total Attempts</p>
              <p className="text-2xl font-bold">{stats.totalAttempts}</p>
            </div>
          </div>
        )}
      </section>

      {/* Latest Quizzes */}
      <section className="max-w-6xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4">Latest Quizzes</h2>
        <ul className="space-y-4">
          {latestQuizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="border rounded-lg p-4 bg-white shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{quiz.topicName}</p>
                <p className="text-gray-600 text-sm">{quiz.question}</p>
              </div>
              <Link
                href={`/quiz/topic/${quiz.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Attempt
              </Link>
            </li>
          ))}
          {latestQuizzes.length === 0 && <p className="text-gray-500">No quizzes available yet.</p>}
        </ul>
      </section>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        &copy; 2025 DGCA Pilot Hub. All rights reserved.
      </footer>
    </div>
  );
}
