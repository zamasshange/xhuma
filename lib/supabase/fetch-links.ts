import type { SupabaseClient } from "@supabase/supabase-js"
import type { DbLink } from "@/lib/database.types"
import { isMissingColumnError } from "@/lib/schema-hint"

export type PublicLink = Pick<DbLink, "id" | "title" | "url" | "icon" | "position">

function isRenderableLink(link: Pick<DbLink, "title" | "url">): boolean {
  return Boolean(link.title?.trim() && link.url?.trim() && link.url !== "#")
}

/** Load active links for a public profile. Never selects `icon` first (column may be missing). */
export async function fetchActiveLinksForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<PublicLink[]> {
  const withoutIcon = () =>
    supabase
      .from("links")
      .select("id, title, url, position, is_active")
      .eq("user_id", userId)
      .order("position", { ascending: true })

  let { data, error } = await withoutIcon()

  if (error && isMissingColumnError(error.message, "is_active", "links")) {
    ;({ data, error } = await supabase
      .from("links")
      .select("id, title, url, position")
      .eq("user_id", userId)
      .order("position", { ascending: true }))
  }

  if (error || !data) return []

  return (data as PublicLink[])
    .filter((l) => ("is_active" in l ? l.is_active !== false : true))
    .filter(isRenderableLink)
}
