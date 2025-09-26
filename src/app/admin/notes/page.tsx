// app/admin/notes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Topic {
  id: string;
  name: string;
}

export default function ManageNotesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [bulletPoints, setBulletPoints] = useState<string[]>([""]);
  const [flashcards, setFlashcards] = useState<{ front: string; back: string }[]>([{ front: "", back: "" }]);
  const [quizzes, setQuizzes] = useState<{ question: string; options: string[]; answer: string }[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  useEffect(() => {
    async function fetchTopics() {
      const { data, error } = await supabase.from("topics").select("id, name");
      if (error) console.error(error);
      else setTopics(data || []);
    }
    fetchTopics();
  }, []);

  async function saveNotes() {
    const { error } = await supabase.from("notes").insert([
      {
        topic_id: selectedTopic,
        bullet_points: bulletPoints,
        flashcards: flashcards,
        quizzes: quizzes,
      },
    ]);
    if (error) console.error(error);
    else alert("Notes saved successfully!");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Notes</h1>

      {/* Select Topic */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Select Topic</label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Choose Topic --</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs for Notes Type */}
      <Tabs defaultValue="bullet">
        <TabsList>
          <TabsTrigger value="bullet">Bullet Points</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        {/* Bullet Points */}
        <TabsContent value="bullet">
          <Card>
            <CardContent className="space-y-2 mt-4">
              {bulletPoints.map((point, idx) => (
                <Input
                  key={idx}
                  value={point}
                  onChange={(e) => {
                    const newPoints = [...bulletPoints];
                    newPoints[idx] = e.target.value;
                    setBulletPoints(newPoints);
                  }}
                  placeholder={`Bullet Point ${idx + 1}`}
                />
              ))}
              <Button onClick={() => setBulletPoints([...bulletPoints, ""])}>+ Add Point</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flashcards */}
        <TabsContent value="flashcards">
          <Card>
            <CardContent className="space-y-4 mt-4">
              {flashcards.map((card, idx) => (
                <div key={idx} className="space-y-2">
                  <Input
                    value={card.front}
                    onChange={(e) => {
                      const newCards = [...flashcards];
                      newCards[idx].front = e.target.value;
                      setFlashcards(newCards);
                    }}
                    placeholder={`Flashcard ${idx + 1} Front`}
                  />
                  <Textarea
                    value={card.back}
                    onChange={(e) => {
                      const newCards = [...flashcards];
                      newCards[idx].back = e.target.value;
                      setFlashcards(newCards);
                    }}
                    placeholder="Flashcard Back"
                  />
                </div>
              ))}
              <Button onClick={() => setFlashcards([...flashcards, { front: "", back: "" }])}>
                + Add Flashcard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes */}
        <TabsContent value="quizzes">
          <Card>
            <CardContent className="space-y-6 mt-4">
              {quizzes.map((quiz, idx) => (
                <div key={idx} className="space-y-2 border p-3 rounded">
                  <Input
                    value={quiz.question}
                    onChange={(e) => {
                      const newQuizzes = [...quizzes];
                      newQuizzes[idx].question = e.target.value;
                      setQuizzes(newQuizzes);
                    }}
                    placeholder={`Question ${idx + 1}`}
                  />
                  {quiz.options.map((opt, optIdx) => (
                    <Input
                      key={optIdx}
                      value={opt}
                      onChange={(e) => {
                        const newQuizzes = [...quizzes];
                        newQuizzes[idx].options[optIdx] = e.target.value;
                        setQuizzes(newQuizzes);
                      }}
                      placeholder={`Option ${optIdx + 1}`}
                    />
                  ))}
                  <Input
                    value={quiz.answer}
                    onChange={(e) => {
                      const newQuizzes = [...quizzes];
                      newQuizzes[idx].answer = e.target.value;
                      setQuizzes(newQuizzes);
                    }}
                    placeholder="Correct Answer"
                  />
                </div>
              ))}
              <Button
                onClick={() =>
                  setQuizzes([...quizzes, { question: "", options: ["", "", "", ""], answer: "" }])
                }
              >
                + Add Quiz
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Button className="mt-4" onClick={saveNotes}>
        Save Notes
      </Button>
    </div>
  );
}
