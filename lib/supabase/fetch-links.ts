import type { SupabaseClient } from "@supabase/supabase-js"
import type { DbLink } from "@/lib/database.types"
import { isMissingColumnError } from "@/lib/schema-hint"

export type PublicLink = Pick<DbLink, "id" | "title" | "url" | "icon" | "position">

/** Load active links; omits `icon` from the select if PostgREST schema cache lacks that column. */
export async function fetchActiveLinksForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<PublicLink[]> {
  const base = () =>
    supabase
      .from("links")
      .select("id, title, url, icon, position")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("position", { ascending: true })

  let { data, error } = await base()

  if (error && isMissingColumnError(error.message, "icon", "links")) {
    ;({ data, error } = await supabase
      .from("links")
      .select("id, title, url, position")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("position", { ascending: true }))
  }

  if (error || !data) return []
  return data as PublicLink[]
}
