// src/app/page.tsx
import React from "react";

interface Subject {
  id: string;
  name: string;
}

interface HomePageProps {
  data: Subject[]; // Replaced 'any' with proper type
}

export default function HomePage({ data }: HomePageProps) {
  return (
    <div>
      <h1>DGCA Pilot Hub</h1>
      <ul>
        {data.map((subject) => (
          <li key={subject.id}>{subject.name}</li>
        ))}
      </ul>
    </div>
  );
}
