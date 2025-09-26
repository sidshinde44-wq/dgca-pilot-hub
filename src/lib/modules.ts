import { supabase } from "@/lib/supabase";

export type Module = {
  id: string;
  name: string;
  description: string;
  level: string;
  created_at: string;
};

/**
 * Fetch modules for a given subject ID via junction table
 */
export async function getModulesBySubject(subjectId: string): Promise<Module[]> {
  // Step 1: Get module IDs from junction table
  const { data: links, error: linksError } = await supabase
    .from("subject_modules")
    .select("module_id")
    .eq("subject_id", subjectId);

  if (linksError) {
    console.error("Error fetching subject_modules:", linksError.message);
    return [];
  }

  const moduleIds = links?.map((l) => l.module_id) || [];

  if (moduleIds.length === 0) return [];

  // Step 2: Fetch modules by IDs
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*")
    .in("id", moduleIds)
    .order("name", { ascending: true });

  if (modulesError) {
    console.error("Error fetching modules:", modulesError.message);
    return [];
  }

  return modules;
}

/**
 * Fetch all modules via junction table
 */
export async function getAllModules(): Promise<Module[]> {
  const { data: modules, error } = await supabase
    .from("modules")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading all modules:", error.message);
    return [];
  }

  return modules;
}
