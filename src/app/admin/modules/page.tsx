"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Subject = { id: string; name: string };
type Module = { id: string; name: string; description: string; level: string; created_at: string };
type ModuleSubject = { subject_id: string; module_id: string };

export default function AdminModulesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleSubjects, setModuleSubjects] = useState<ModuleSubject[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Module
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");
  const [newModuleLevel, setNewModuleLevel] = useState("COMMON");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Edit Module
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModuleName, setEditModuleName] = useState("");
  const [editModuleDesc, setEditModuleDesc] = useState("");
  const [editModuleLevel, setEditModuleLevel] = useState("COMMON");
  const [editSelectedSubjects, setEditSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchSubjects();
    fetchModules();
    fetchModuleSubjects();
  }, []);

  async function fetchSubjects() {
    const { data, error } = await supabase.from("subjects").select("*");
    if (error) console.error(error);
    else setSubjects(data);
  }

  async function fetchModules() {
    setLoading(true);
    const { data, error } = await supabase.from("modules").select("*").order("name");
    if (error) console.error(error);
    else setModules(data);
    setLoading(false);
  }

  async function fetchModuleSubjects() {
    const { data, error } = await supabase.from("subject_modules").select("*");
    if (error) console.error(error);
    else setModuleSubjects(data);
  }

  // Add Module
  async function handleAddModule() {
    if (!newModuleName || selectedSubjects.length === 0) return;

    const { data: moduleData, error: insertError } = await supabase
      .from("modules")
      .insert([{ name: newModuleName, description: newModuleDesc, level: newModuleLevel }])
      .select()
      .single();

    if (insertError) return console.error(insertError);

    const links = selectedSubjects.map((subId) => ({
      module_id: moduleData.id,
      subject_id: subId,
    }));

    const { error: linkError } = await supabase.from("subject_modules").insert(links);
    if (linkError) return console.error(linkError);

    setNewModuleName("");
    setNewModuleDesc("");
    setSelectedSubjects([]);
    fetchModules();
    fetchModuleSubjects();
  }

  // Edit Module
  function startEditing(mod: Module) {
    setEditingModuleId(mod.id);
    setEditModuleName(mod.name);
    setEditModuleDesc(mod.description);
    setEditModuleLevel(mod.level);
    const linkedSubs = moduleSubjects.filter((ms) => ms.module_id === mod.id).map((ms) => ms.subject_id);
    setEditSelectedSubjects(linkedSubs);
  }

  async function handleUpdateModule() {
    if (!editingModuleId) return;

    // 1. Update module
    const { error: updateError } = await supabase
      .from("modules")
      .update({ name: editModuleName, description: editModuleDesc, level: editModuleLevel })
      .eq("id", editingModuleId);

    if (updateError) return console.error(updateError);

    // 2. Update linked subjects
    await supabase.from("subject_modules").delete().eq("module_id", editingModuleId);
    const links = editSelectedSubjects.map((subId) => ({
      module_id: editingModuleId,
      subject_id: subId,
    }));
    const { error: linkError } = await supabase.from("subject_modules").insert(links);
    if (linkError) return console.error(linkError);

    setEditingModuleId(null);
    setEditModuleName("");
    setEditModuleDesc("");
    setEditModuleLevel("COMMON");
    setEditSelectedSubjects([]);

    fetchModules();
    fetchModuleSubjects();
  }

  async function handleDeleteModule(moduleId: string) {
    await supabase.from("subject_modules").delete().eq("module_id", moduleId);
    await supabase.from("modules").delete().eq("id", moduleId);

    fetchModules();
    fetchModuleSubjects();
  }

  const getSubjectsForModule = (moduleId: string) =>
    moduleSubjects
      .filter((ms) => ms.module_id === moduleId)
      .map((ms) => subjects.find((s) => s.id === ms.subject_id)?.name)
      .filter(Boolean)
      .join(", ");

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Modules</h1>

      {/* Add Module */}
      <div className="mb-6 border p-4 rounded-lg bg-gray-50">
        <h2 className="font-semibold mb-2">{editingModuleId ? "Edit Module" : "Add New Module"}</h2>

        <input
          type="text"
          placeholder="Module Name"
          value={editingModuleId ? editModuleName : newModuleName}
          onChange={(e) =>
            editingModuleId ? setEditModuleName(e.target.value) : setNewModuleName(e.target.value)
          }
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Description"
          value={editingModuleId ? editModuleDesc : newModuleDesc}
          onChange={(e) =>
            editingModuleId ? setEditModuleDesc(e.target.value) : setNewModuleDesc(e.target.value)
          }
          className="border p-2 rounded w-full mb-2"
        />
        <select
          value={editingModuleId ? editModuleLevel : newModuleLevel}
          onChange={(e) =>
            editingModuleId ? setEditModuleLevel(e.target.value) : setNewModuleLevel(e.target.value)
          }
          className="border p-2 rounded w-full mb-2"
        >
          <option value="COMMON">COMMON</option>
          <option value="CPL">CPL</option>
          <option value="ATPL">ATPL</option>
        </select>
        <div className="mb-2">
          <label className="block font-medium mb-1">Link to Subjects:</label>
          <select
            multiple
            value={editingModuleId ? editSelectedSubjects : selectedSubjects}
            onChange={(e) =>
              editingModuleId
                ? setEditSelectedSubjects(Array.from(e.target.selectedOptions, (opt) => opt.value))
                : setSelectedSubjects(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            className="border p-2 rounded w-full h-32"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {editingModuleId ? (
          <div className="flex gap-2">
            <button
              onClick={handleUpdateModule}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Module
            </button>
            <button
              onClick={() => setEditingModuleId(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddModule}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Module
          </button>
        )}
      </div>

      {/* Module List */}
      <h2 className="font-semibold mb-2">All Modules</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {modules.map((mod) => (
            <li key={mod.id} className="border p-2 rounded flex justify-between items-center">
              <div>
                <strong>{mod.name}</strong> ({mod.level})
                <p className="text-gray-600">{mod.description}</p>
                <p className="text-sm text-gray-500">
                  Linked Subjects: {getSubjectsForModule(mod.id) || "None"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(mod)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteModule(mod.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
