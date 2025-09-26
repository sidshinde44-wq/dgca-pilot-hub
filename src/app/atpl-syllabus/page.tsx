import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getModulesBySubject, Module } from "@/lib/modules";

interface Subject {
  id: string;
  name: string;
  description: string;
  level: string;
}

// Map ATPL subject name → PDF path
const subjectPdfs: Record<string, string> = {
  "Air Navigation": "/pdfs/atpl-subject-wise-syllabus/atpl-syllabus-air-navigation.pdf",
  "Aviation Meteorology": "/pdfs/atpl-subject-wise-syllabus/atpl-syllabus-aviation-meteorology.pdf",
  "Radio Aids and Instruments": "/pdfs/atpl-subject-wise-syllabus/atpl-syllabus-radio-aids-instruments.pdf",
  "Air Regulation": "/pdfs/atpl-subject-wise-syllabus/atpl-syllabus-air-regulation.pdf",
  "Aircraft and Engines": "/pdfs/atpl-subject-wise-syllabus/atpl-syllabus-technical-general.pdf",
};

export default async function AtplSyllabusPage() {
  // Fetch COMMON + ATPL subjects only
  const { data: subjects, error } = await supabase
    .from<Subject>("subjects")
    .select("id, name, description, level")
    .in("level", ["COMMON", "ATPL"])
    .order("name");

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">DGCA ATPL Syllabus 2025</h1>
      <p className="mb-6 text-gray-700">
        Explore each subject below or{" "}
        <Link
          href="/pdfs/atpl-syllabus.pdf"
          target="_blank"
          className="text-blue-600 underline"
        >
          download the full official PDF
        </Link>
        .
      </p>

      <div className="space-y-8">
        {subjects?.map((subject) => (
          <div key={subject.id}>
            <h2 className="text-2xl font-semibold mb-4">{subject.name}</h2>
            <p className="mb-4 text-gray-600">{subject.description}</p>

            {/* Subject-specific PDF link if available */}
            {subjectPdfs[subject.name] && (
              <p className="mb-4">
                <Link
                  href={subjectPdfs[subject.name]}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Download {subject.name} PDF
                </Link>
              </p>
            )}

            {/* Fetch and display modules for this subject */}
            <ModulesList subjectId={subject.id} />
          </div>
        ))}
      </div>
    </main>
  );
}

// Component to fetch and display modules for a subject
async function ModulesList({ subjectId }: { subjectId: string }) {
  const modules: Module[] = await getModulesBySubject(subjectId);

  if (!modules || modules.length === 0) {
    return <p className="text-gray-500">No modules found for this subject.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {modules.map((module) => (
        <div
          key={module.id}
          className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold">{module.name}</h3>
          <p className="text-gray-600">{module.description}</p>
        </div>
      ))}
    </div>
  );
}
