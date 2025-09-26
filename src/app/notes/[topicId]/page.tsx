// src/app/notes/[topicId]/page.tsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchNotesAPI, fetchSubtopicsAPI, fetchTopicAPI } from "@/lib/api";

interface NotesPageProps {
  params: { topicId: string };
}

export default function NotesPage({ params }: NotesPageProps) {
  const { topicId } = params;

  const [notes, setNotes] = useState<any[]>([]);
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);

  // Memoize fetch functions to satisfy useEffect deps
  const fetchNotes = useCallback(async () => {
    const data = await fetchNotesAPI(topicId);
    setNotes(data);
  }, [topicId]);

  const fetchSubtopics = useCallback(async () => {
    const data = await fetchSubtopicsAPI(topicId);
    setSubtopics(data);
  }, [topicId]);

  const fetchTopic = useCallback(async () => {
    const data = await fetchTopicAPI(topicId);
    setTopic(data);
  }, [topicId]);

  useEffect(() => {
    fetchNotes();
    fetchSubtopics();
    fetchTopic();
  }, [fetchNotes, fetchSubtopics, fetchTopic]);

  return (
    <div>
      <h1>Notes for Topic {topicId}</h1>
      {topic && <h2>{topic.title}</h2>}
      <ul>
        {subtopics.map((st) => (
          <li key={st.id}>{st.name}</li>
        ))}
      </ul>
      <div>
        {notes.map((note) => (
          <p key={note.id}>{note.content}</p>
        ))}
      </div>
    </div>
  );
}
