// app/admin/manage-topics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Module {
  id: string;
  name: string;
  level: string;
}

interface Topic {
  id: string;
  module_id: string;
  name: string;
  description: string;
  level: string;
}

export default function ManageTopicsPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");

  const [newTopic, setNewTopic] = useState<{
    moduleId: string;
    name: string;
    description: string;
    level: string;
  }>({
    moduleId: "",
    name: "",
    description: "",
    level: "",
  });

  // Load modules and topics
  useEffect(() => {
    const fetchData = async () => {
      const { data: modulesData } = await supabase.from("modules").select("id, name, level");
      const { data: topicsData } = await supabase.from("topics").select("*");
      if (modulesData) setModules(modulesData);
      if (topicsData) setTopics(topicsData);
    };
    fetchData();
  }, []);

  // Add topic
  const addTopic = async () => {
    if (!newTopic.moduleId || !newTopic.name || !newTopic.level) return;

    const { data, error } = await supabase
      .from("topics")
      .insert([
        {
          module_id: newTopic.moduleId,
          name: newTopic.name,
          description: newTopic.description,
          level: newTopic.level,
        },
      ])
      .select();

    if (!error && data) {
      setTopics([...topics, data[0]]);
      setNewTopic({ moduleId: "", name: "", description: "", level: "" });
    }
  };

  // Delete topic
  const deleteTopic = async (id: string) => {
    const { error } = await supabase.from("topics").delete().eq("id", id);
    if (!error) {
      setTopics(topics.filter((t) => t.id !== id));
    }
  };

  // Apply filter
  const filteredTopics =
    filterLevel === "ALL" ? topics : topics.filter((t) => t.level === filterLevel);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Topics</h1>

      {/* Add Topic Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Add New Topic</h2>

        {/* Module Dropdown */}
        <select
          className="border p-2 rounded w-full mb-2"
          value={newTopic.moduleId}
          onChange={(e) => setNewTopic({ ...newTopic, moduleId: e.target.value })}
        >
          <option value="">Select Module</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Level Dropdown */}
        <select
          className="border p-2 rounded w-full mb-2"
          value={newTopic.level}
          onChange={(e) => setNewTopic({ ...newTopic, level: e.target.value })}
        >
          <option value="">Select Level</option>
          <option value="CPL">CPL</option>
          <option value="ATPL">ATPL</option>
          <option value="COMMON">COMMON</option>
        </select>

        <input
          type="text"
          placeholder="Topic name"
          className="border p-2 rounded w-full mb-2"
          value={newTopic.name}
          onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border p-2 rounded w-full mb-2"
          value={newTopic.description}
          onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addTopic}>
          Add Topic
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-6">
        {["ALL", "CPL", "ATPL", "COMMON"].map((level) => (
          <button
            key={level}
            onClick={() => setFilterLevel(level)}
            className={`px-4 py-2 rounded ${
              filterLevel === level
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* List Topics grouped by Module */}
      {modules.map((m) => (
        <div key={m.id} className="mb-6">
          <h2 className="text-xl font-semibold">{m.name}</h2>
          <ul className="pl-4 mt-2">
            {filteredTopics
              .filter((t) => t.module_id === m.id)
              .map((t) => (
                <li key={t.id} className="flex justify-between items-center bg-white p-2 rounded shadow mb-2">
                  <div>
                    <span className="font-medium">{t.name}</span>
                    {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                    <p className="text-xs text-gray-500 italic">[{t.level}]</p>
                  </div>
                  <button
                    onClick={() => deleteTopic(t.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
