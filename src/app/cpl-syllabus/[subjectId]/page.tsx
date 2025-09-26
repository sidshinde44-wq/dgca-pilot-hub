import { supabase } from "@/lib/supabase";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { notFound } from "next/navigation";

interface Params {
  params: { subjectId: string };
}

export default async function CplSubjectPage({ params }: Params) {
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

  // Fetch modules for this subject (COMMON + CPL)
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*")
    .eq("subject_id", subjectId)
    .in("level", ["COMMON", "CPL"])
    .order("name");

  if (modulesError) {
    return <p className="text-red-500">Error loading modules: {modulesError.message}</p>;
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{subject.name} – CPL 2025</h1>
      <p className="mb-6 text-gray-700">{subject.description}</p>

      {modules?.length === 0 && <p className="text-gray-500">No modules available.</p>}

      <Accordion type="single" collapsible className="w-full">
        {modules?.map((mod) => (
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
  // Fetch topics for this module (COMMON + CPL)
  const { data: topics, error } = await supabase
    .from("topics")
    .select("*")
    .eq("module_id", moduleId)
    .in("level", ["COMMON", "CPL"])
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
