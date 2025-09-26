// src/lib/checkAdmin.ts
import { supabase } from "./supabase"

export async function requireAdmin() {
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session?.user) {
    throw new Error("Not authenticated")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    throw new Error("Not authorized")
  }

  return session.user
}
