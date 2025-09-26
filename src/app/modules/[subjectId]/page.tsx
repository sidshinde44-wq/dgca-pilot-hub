"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Module {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
}

export default function ModulesPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Record<string, Topic[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModulesAndTopics() {
      setLoading(true);

      // Step 1: get modules linked to this subject via subject_modules
      const { data: subjectModules, error: smErr } = await supabase
        .from("subject_modules")
        .select("modules(id, name)")
        .eq("subject_id", subjectId);

      if (smErr) {
        console.error("Error fetching subject_modules:", smErr.message);
        setLoading(false);
        return;
      }

      const mods = subjectModules?.map((sm) => sm.modules) || [];
      setModules(mods);

      // Step 2: fetch topics for each module
      const newTopics: Record<string, Topic[]> = {};
      for (let mod of mods) {
        const { data: t, error: topicErr } = await supabase
          .from("topics")
          .select("id, name")
          .eq("module_id", mod.id);

        if (topicErr) {
          console.error("Error fetching topics:", topicErr.message);
        }
        if (t) newTopics[mod.id] = t;
      }
      setTopics(newTopics);
      setLoading(false);
    }

    fetchModulesAndTopics();
  }, [subjectId]);

  if (loading) return <p className="p-6">Loading modules...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Modules & Topics</h1>
      <div className="space-y-6">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">{mod.name}</h2>
            <ul className="space-y-2">
              {(topics[mod.id] || []).map((topic) => (
                <li
                  key={topic.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{topic.name}</span>
                  <div className="space-x-2">
                    <Link
                      href={`/notes/${topic.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Notes
                    </Link>
                    <Link
                      href={`/quiz/topic/${topic.id}`}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Quiz
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {modules.length === 0 && (
          <p className="text-gray-500">No modules available for this subject yet.</p>
        )}
      </div>
    </div>
  );
}
