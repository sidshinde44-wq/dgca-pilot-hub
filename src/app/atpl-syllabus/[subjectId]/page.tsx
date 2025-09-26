import { supabase } from "@/lib/supabase";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getModulesBySubject, Module } from "@/lib/modules";

interface Params {
  params: { subjectId: string };
}

export default async function AtplSubjectPage({ params }: Params) {
  const { subjectId } = params;

  // Fetch the subject
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", subjectId)
    .single();

  if (subjectError || !subject) {
    return <p className="text-red-500">Subject not found.</p>;
  }

  // Fetch all modules via helper
  let modules: Module[] = await getModulesBySubject(subjectId);

  // --- FILTER: Remove Instrumentation & Radio Navigation by module ID ---
  const modulesToExclude = [
    "82fa852f-b54b-4df6-8a82-5727afad381b", // Instrumentation
    "8e5d8061-9a98-421a-a6e1-4efed816b982"  // Radio Navigation
  ];

  // Apply filter only for Air Navigation
  if (subject.name.toLowerCase().includes("air navigation")) {
    modules = modules.filter((mod) => !modulesToExclude.includes(mod.id));
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{subject.name} – ATPL 2025</h1>
      <p className="mb-6 text-gray-700">{subject.description}</p>

      {modules?.length === 0 && <p className="text-gray-500">No modules available.</p>}

      <Accordion type="single" collapsible className="w-full">
        {modules.map((mod) => (
          <AccordionItem key={mod.id} value={`module-${mod.id}`}>
            <AccordionTrigger>{mod.name}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">{mod.description}</p>
              <TopicList moduleId={mod.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}

async function TopicList({ moduleId }: { moduleId: string }) {
  const { data: topics, error } = await supabase
    .from("topics")
    .select("*")
    .eq("module_id", moduleId)
    .in("level", ["COMMON", "ATPL"])
    .order("name");

  if (error) return <p className="text-red-500">Error loading topics: {error.message}</p>;
  if (!topics || topics.length === 0) return <p className="text-gray-500">No topics available.</p>;

  return (
    <ul className="list-disc pl-6 mt-2 space-y-1">
      {topics.map((t) => (
        <li key={t.id}>
          <span className="font-medium">{t.name}</span> – {t.description}
        </li>
      ))}
    </ul>
  );
}
