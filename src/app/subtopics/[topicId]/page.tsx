// app/subtopics/[topicId]/page.tsx
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Subtopic {
  id: string;
  name: string;
  topic_id: string;
}

async function getSubtopics(topicId: string): Promise<Subtopic[]> {
  const { data, error } = await supabase
    .from("subtopics")
    .select("id, name, topic_id")
    .eq("topic_id", topicId);

  if (error) {
    console.error("Error fetching subtopics:", error.message);
    return [];
  }

  return data as Subtopic[];
}

export default async function SubtopicsPage({ params }: { params: { topicId: string } }) {
  const subtopics = await getSubtopics(params.topicId);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Choose a Subtopic Quiz</h1>

      {subtopics.length === 0 && <p>No subtopics available for this topic.</p>}

      <ul className="space-y-3">
        {subtopics.map((sub) => (
          <li
            key={sub.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>{sub.name}</span>
            <Link
              href={`/quiz/${sub.id}`}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Start Quiz
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
