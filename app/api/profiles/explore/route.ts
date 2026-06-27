import { createAdminClient } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { mapProfile } from "@/lib/database.types"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, theme_json, created_at")
      .order("created_at", { ascending: false })
      .limit(48)

    if (error) return apiError(error.message, 500)

    return apiSuccess((data ?? []).map(mapProfile))
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Failed to load profiles", 500)
  }
}
