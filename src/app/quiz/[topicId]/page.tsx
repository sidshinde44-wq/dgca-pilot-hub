"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Subtopic {
  id: string;
  name: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  subtopic_id: string;
}

export default function QuizPage({ params }: { params: { topicId: string } }) {
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // ✅ Fetch subtopics
  useEffect(() => {
    const fetchSubtopics = async () => {
      const { data, error } = await supabase
        .from("subtopics")
        .select("id, name")
        .eq("topic_id", params.topicId);

      if (!error && data) setSubtopics(data);
    };
    fetchSubtopics();
  }, [params.topicId]);

  // ✅ Fetch 5 random questions from different subtopics
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("quiz")
        .select("id, question, options, answer, subtopic_id")
        .in("subtopic_id", subtopics.map((s) => s.id));

      if (!error && data) {
        // Pick 5 random unique subtopics
        const random = subtopics
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map((s) => {
            const qs = data.filter((q) => q.subtopic_id === s.id);
            return qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
          })
          .filter(Boolean) as Question[];

        setQuestions(random);
      }
    };

    if (subtopics.length > 0) fetchQuestions();
  }, [subtopics]);

  // ✅ Handle answer selection
  const handleAnswer = (choice: string) => {
    if (questions[current].answer === choice) {
      setScore((prev) => prev + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>

      {/* ✅ Show subtopics list */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Subtopics included:</h2>
        <ul className="list-disc list-inside text-gray-700">
          {subtopics.map((sub) => (
            <li key={sub.id}>{sub.name}</li>
          ))}
        </ul>
      </div>

      {/* ✅ Show questions */}
      {!finished && questions.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium mb-2">
            Q{current + 1}. {questions[current].question}
          </h2>
          <div className="space-y-2">
            {questions[current].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="w-full text-left p-3 border rounded hover:bg-gray-100"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : finished ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold">Quiz Finished!</h2>
          <p className="mt-2">Your Score: {score} / {questions.length}</p>
        </div>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
}
