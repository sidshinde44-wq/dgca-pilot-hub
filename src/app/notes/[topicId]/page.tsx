"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Topic {
  id: string;
  name: string;
}

interface Note {
  id: string;
  content: string;
}

interface Subtopic {
  id: string;
  title: string;
  content: string;
}

export default function NotesPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) {
      fetchTopic();
      fetchNotes();
      fetchSubtopics();
    }
  }, [topicId]);

  async function fetchTopic() {
    const { data } = await supabase.from("topics").select("*").eq("id", topicId).single();
    setTopic(data || null);
  }

  async function fetchNotes() {
    const { data } = await supabase.from("notes").select("*").eq("topic_id", topicId);
    setNotes(data || []);
  }

  async function fetchSubtopics() {
    const { data } = await supabase.from("subtopics").select("*").eq("topic_id", topicId);
    setSubtopics(data || []);
    setLoading(false);
  }

  function startQuiz() {
    // redirect to quiz page with topicId
    router.push(`/quiz/${topicId}`);
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Topic Title */}
      <h1 className="text-3xl font-bold mb-6">{topic?.name}</h1>

      {/* Notes Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Notes</h2>
        {notes.length === 0 ? (
          <p>No notes available for this topic yet.</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 border rounded bg-white shadow">
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subtopics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Subtopics</h2>
        {subtopics.length === 0 ? (
          <p>No subtopics available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subtopics.map((sub) => (
              <div key={sub.id} className="p-4 border rounded bg-gray-50">
                <h3 className="font-bold mb-2">{sub.title}</h3>
                <p>{sub.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Button */}
      {subtopics.length > 0 && (
        <button
          onClick={startQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700"
        >
          Start 5-Question Quiz
        </button>
      )}
    </div>
  );
}
